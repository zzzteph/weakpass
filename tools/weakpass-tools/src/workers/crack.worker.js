import hashcat from 'crack-js'
import hashcatRule from 'hashcat-rules-js'

self.onmessage = (event) => {
  if (event.data.action === 'start') run(event.data)
}

// plan = ordered list of steps run against the hashes until all are cracked:
//   { type:'dict',  rules:string[] }                 words × rules (empty rules = plain words)
//   { type:'brute', charset:string, min:int, max:int } charset combinations, length min..max
function run({ hashes, hashType, words, plan }) {
  try {
    if (!hashcat.availableHashTypes.includes(hashType)) {
      postMessage({ type: 'error', message: 'Unknown hash type: ' + hashType }); return
    }
    const targets = [...new Set(hashes)].filter(h => hashcat.isValidHash(h, hashType))
    if (!targets.length) {
      postMessage({ type: 'error', message: 'No valid ' + hashType + ' hashes to crack.' }); return
    }
    const steps = (Array.isArray(plan) && plan.length) ? plan : [{ type: 'dict', rules: [] }]
    const remaining = new Set(targets)
    postMessage({ type: 'meta', valid: targets.length, steps: steps.length })

    // Grand total of candidates across every step — drives the overall bar + ETA.
    let grand = 0
    for (const s of steps) {
      if (s.type === 'dict') {
        grand += words.length * ((s.rules && s.rules.length) ? s.rules.length : 1)
      } else if (s.type === 'brute') {
        const n = (s.charset || '').length
        const min = Math.max(1, s.min | 0)
        const max = Math.max(min, s.max | 0)
        for (let L = min; L <= max; L++) grand += Math.pow(n, L)
      }
    }
    if (!isFinite(grand)) grand = Infinity

    let found = 0
    let done = 0            // candidates tried, cumulative across all steps
    let ops = 0             // individual hash comparisons — the "H/s" numerator
    const t0 = Date.now()
    let last = 0
    let curStep = 1

    // Post progress at most ~7×/sec; `force` flushes step boundaries and the finish.
    const report = (force) => {
      const now = Date.now()
      if (!force && now - last < 140) return
      last = now
      const secs = (now - t0) / 1000
      const rate = secs > 0 ? done / secs : 0
      const eta = (rate > 0 && isFinite(grand)) ? Math.max(0, (grand - done) / rate) : null
      postMessage({
        type: 'progress', index: curStep,
        done, total: grand,
        hps: secs > 0 ? Math.round(ops / secs) : 0,
        eta, found
      })
    }

    const tryCandidate = (c) => {
      for (const h of remaining) {
        ops++
        if (hashcat.verifyHash(c, h, hashType) === true) {
          found++; remaining.delete(h)
          postMessage({ type: 'found', hash: h, password: c })
        }
      }
      done++
      report(false)
    }

    for (let si = 0; si < steps.length; si++) {
      if (!remaining.size) break
      const step = steps[si]
      curStep = si + 1
      postMessage({ type: 'step', index: si + 1, steps: steps.length, label: step.label || step.type })

      if (step.type === 'dict') {
        const rules = (step.rules && step.rules.length) ? step.rules : null
        for (const w of words) {
          if (!remaining.size) break
          if (rules) {
            for (const r of rules) {
              if (!remaining.size) break
              const c = hashcatRule.applyRule(w, r)
              if (c !== false) tryCandidate(c)
              else done++   // still counts toward `grand` so the bar/ETA stay honest
            }
          } else {
            tryCandidate(w)
          }
        }
      } else if (step.type === 'brute') {
        const cs = step.charset || ''
        if (!cs.length) continue
        const min = Math.max(1, step.min | 0)
        const max = Math.max(min, step.max | 0)
        let stopped = false
        for (let L = min; L <= max && !stopped; L++) {
          const n = cs.length
          const idx = new Array(L).fill(0)
          while (true) {
            if (!remaining.size) { stopped = true; break }
            let c = ''
            for (let k = 0; k < L; k++) c += cs[idx[k]]
            tryCandidate(c)
            let p = L - 1
            while (p >= 0) { idx[p]++; if (idx[p] < n) break; idx[p] = 0; p-- }
            if (p < 0) break
          }
        }
      }
      report(true)
    }
    report(true)
    postMessage({ type: 'done', found, remaining: remaining.size })
  } catch (e) {
    postMessage({ type: 'error', message: (e && e.message) || String(e) })
  }
}
