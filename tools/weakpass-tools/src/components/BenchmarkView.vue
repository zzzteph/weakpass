<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import hashcat from 'crack-js'

const available = new Set(hashcat.availableHashTypes || [])
const COMMON = ['md5', 'sha1', 'sha256', 'sha512', 'ntlm', 'md4', 'sha224', 'sha384', 'ripemd160',
  'whirlpool', 'md5crypt', 'sha256crypt', 'sha512crypt', 'bcrypt', 'descrypt', 'phpass',
  'netntlmv1', 'netntlmv2', 'mysql323', 'mysql41', 'jwt', 'hmac-md5', 'hmac-sha1', 'hmac-sha256',
  'pbkdf2-hmac-sha1', 'pbkdf2-hmac-sha256', 'wpa-pbkdf2-pmkid'].filter(m => available.has(m))
const allFastModes = (Array.isArray(hashcat.hashTypes) ? hashcat.hashTypes : [])
  .filter(t => t.fast).map(t => t.name)

const duration = ref(250)
const fastAll = ref(false)
const running = ref(false)
const results = ref([])
let worker = null

const sorted = computed(() => [...results.value].sort((a, b) => b.speed - a.speed))
const maxSpeed = computed(() => sorted.value.reduce((m, r) => Math.max(m, r.speed), 0))

function start() {
  stop()
  results.value = []
  running.value = true
  const modes = fastAll.value ? allFastModes : COMMON
  worker = new Worker(new URL('../workers/benchmark.worker.js', import.meta.url), { type: 'module' })
  worker.onmessage = (e) => {
    if (e.data.type === 'result') {
      const i = results.value.findIndex(r => r.name === e.data.name)
      if (i >= 0) results.value[i] = e.data
      else results.value.push({ name: e.data.name, speed: e.data.speed })
    } else if (e.data.type === 'done') {
      stop()
    }
  }
  worker.postMessage({ action: 'start', modes, duration: duration.value })
}
function stop() {
  if (worker) { worker.terminate(); worker = null }
  running.value = false
}
onBeforeUnmount(stop)
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./benchmark</span> — hashes/sec per mode</h2>
    <p class="psub">
      Raw calculation throughput in your browser. <b>Fast</b> = single-shot unsalted (md5, sha1, ntlm) — millions/sec.
      <b>Slow</b> = salted &amp; iterated by design (bcrypt, pbkdf2, *crypt) — far fewer.
    </p>

    <div class="controls">
      <button class="btn" @click="start" :disabled="running">benchmark</button>
      <button class="btn ghost" @click="stop" :disabled="!running">stop</button>
      <label class="field">time/mode
        <select v-model.number="duration" :disabled="running">
          <option :value="100">100 ms</option>
          <option :value="250">250 ms</option>
          <option :value="500">500 ms</option>
          <option :value="1000">1 s</option>
        </select>
      </label>
      <label class="field"><input type="checkbox" v-model="fastAll" :disabled="running"> all fast modes ({{ allFastModes.length }})</label>
    </div>

    <div class="statusline" v-if="running">benchmarking {{ (fastAll ? allFastModes.length : COMMON.length) }} modes…</div>

    <div class="tblwrap" v-if="sorted.length">
      <table>
        <thead><tr><th>#</th><th>Mode</th><th class="num">Hashes / sec</th><th>Relative</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in sorted" :key="r.name">
            <td class="rank">{{ i + 1 }}</td>
            <td class="name">{{ r.name }}</td>
            <td class="num hps">{{ r.speed.toLocaleString('en-US') }}</td>
            <td class="barcell"><div class="bar" :style="{ width: (maxSpeed ? Math.max(2, (r.speed / maxSpeed) * 100) : 2) + '%' }"></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!running" class="empty">Hit benchmark to measure throughput for every mode.</div>
  </div>
</template>
