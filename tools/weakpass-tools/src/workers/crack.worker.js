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

    let found = 0
    const tryCandidate = (c) => {
      for (const h of remaining) {
        if (hashcat.verifyHash(c, h, hashType) === true) {
          found++; remaining.delete(h)
          postMessage({ type: 'found', hash: h, password: c })
        }
      }
    }

    for (let si = 0; si < steps.length; si++) {
      if (!remaining.size) break
      const step = steps[si]
      postMessage({ type: 'step', index: si + 1, steps: steps.length, label: step.label || step.type })

      if (step.type === 'dict') {
        const rules = (step.rules && step.rules.length) ? step.rules : null
        const total = words.length
        let done = 0
        for (const w of words) {
          if (!remaining.size) break
          const cands = rules ? rules.map(r => hashcatRule.applyRule(w, r)).filter(x => x !== false) : [w]
          for (const c of cands) { if (!remaining.size) break; tryCandidate(c) }
          done++
          if (done % 200 === 0) postMessage({ type: 'progress', index: si + 1, done, total, found })
        }
        postMessage({ type: 'progress', index: si + 1, done: total, total, found })
      } else if (step.type === 'brute') {
        const cs = step.charset || ''
        if (!cs.length) continue
        const min = Math.max(1, step.min | 0)
        const max = Math.max(min, step.max | 0)
        let total = 0
        for (let L = min; L <= max; L++) total += Math.pow(cs.length, L)
        if (!isFinite(total)) total = 0
        let done = 0
        let stopped = false
        for (let L = min; L <= max && !stopped; L++) {
          const n = cs.length
          const idx = new Array(L).fill(0)
          while (true) {
            if (!remaining.size) { stopped = true; break }
            let c = ''
            for (let k = 0; k < L; k++) c += cs[idx[k]]
            tryCandidate(c)
            done++
            if (done % 500 === 0) postMessage({ type: 'progress', index: si + 1, done, total, found })
            let p = L - 1
            while (p >= 0) { idx[p]++; if (idx[p] < n) break; idx[p] = 0; p-- }
            if (p < 0) break
          }
        }
        postMessage({ type: 'progress', index: si + 1, done: total || done, total, found })
      }
    }
    postMessage({ type: 'done', found, remaining: remaining.size })
  } catch (e) {
    postMessage({ type: 'error', message: (e && e.message) || String(e) })
  }
}
