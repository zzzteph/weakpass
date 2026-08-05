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

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}

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
    <h1 class="title is-4"><span class="wp-mono has-text-link">./benchmark</span> — hashes/sec per mode</h1>
    <p class="subtitle is-6">
      Raw calculation throughput in your browser. <b>Fast</b> = single-shot unsalted (md5, sha1, ntlm) — millions/sec.
      <b>Slow</b> = salted &amp; iterated by design (bcrypt, pbkdf2, *crypt) — far fewer.
    </p>

    <div class="field is-grouped is-grouped-multiline is-align-items-center">
      <div class="control">
        <button class="button is-link" :class="{ 'is-loading': running }" @click="start" :disabled="running">Benchmark</button>
      </div>
      <div class="control"><button class="button is-light" @click="stop" :disabled="!running">Stop</button></div>
      <div class="control">
        <div class="select">
          <select v-model.number="duration" :disabled="running">
            <option :value="100">100 ms / mode</option>
            <option :value="250">250 ms / mode</option>
            <option :value="500">500 ms / mode</option>
            <option :value="1000">1 s / mode</option>
          </select>
        </div>
      </div>
      <div class="control"><label class="checkbox mt-2"><input type="checkbox" v-model="fastAll" :disabled="running"> all fast modes ({{ allFastModes.length }})</label></div>
    </div>

    <div class="table-container wp-scroll mt-3" v-if="sorted.length">
      <table class="table is-fullwidth is-hoverable">
        <thead><tr><th>#</th><th>Mode</th><th class="has-text-right">Hashes / sec</th><th>Relative</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in sorted" :key="r.name">
            <td class="has-text-grey">{{ i + 1 }}</td>
            <td class="wp-mono">{{ r.name }}</td>
            <td class="has-text-right wp-mono has-text-link">{{ r.speed.toLocaleString('en-US') }}</td>
            <td>
              <div style="background:var(--wp-accent);height:8px;border-radius:2px;min-width:2px"
                   :style="{ width: (maxSpeed ? Math.max(2, (r.speed / maxSpeed) * 100) : 2) + '%' }"
                   :title="fmt(r.speed) + '/s'"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!running" class="notification is-light">Hit <b>Benchmark</b> to measure throughput.</div>
  </div>
</template>
