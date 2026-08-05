import hashcat from 'crack-js'
import hashcatRule from 'hashcat-rules-js'

self.onmessage = (event) => {
  if (event.data.action === 'start') run(event.data)
}

function run({ hashes, hashType, words, rules }) {
  try {
    if (!hashcat.availableHashTypes.includes(hashType)) {
      postMessage({ type: 'error', message: 'Unknown hash type: ' + hashType }); return
    }
    const targets = [...new Set(hashes)].filter(h => hashcat.isValidHash(h, hashType))
    if (!targets.length) {
      postMessage({ type: 'error', message: 'No valid ' + hashType + ' hashes to crack.' }); return
    }
    const remaining = new Set(targets)
    const useRules = Array.isArray(rules) && rules.length > 0
    const total = words.length
    postMessage({ type: 'meta', total, valid: targets.length })

    let done = 0
    let found = 0
    for (const w of words) {
      if (!remaining.size) break
      const candidates = useRules
        ? rules.map(r => hashcatRule.applyRule(w, r)).filter(x => x !== false)
        : [w]
      for (const c of candidates) {
        if (!remaining.size) break
        for (const h of remaining) {
          if (hashcat.verifyHash(c, h, hashType) === true) {
            found++
            remaining.delete(h)
            postMessage({ type: 'found', hash: h, password: c })
          }
        }
      }
      done++
      if (done % 200 === 0) postMessage({ type: 'progress', done, total, found })
    }
    postMessage({ type: 'done', done, total, found, remaining: remaining.size })
  } catch (e) {
    postMessage({ type: 'error', message: (e && e.message) || String(e) })
  }
}
