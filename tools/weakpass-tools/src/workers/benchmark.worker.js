import hashcat from 'crack-js'

self.onmessage = (event) => {
  if (event.data.action !== 'start') return
  const { modes, duration } = event.data
  for (const name of modes) {
    let speed = 0
    try {
      speed = hashcat.measureSpeed(name, duration) || 0
    } catch (e) {
      postMessage({ type: 'skip', name })
      continue
    }
    postMessage({ type: 'result', name, speed: Math.floor(speed) })
  }
  postMessage({ type: 'done' })
}
