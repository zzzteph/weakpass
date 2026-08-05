<script setup>
import { ref, computed } from 'vue'
import hashcat from 'crack-js'

const genModes = (Array.isArray(hashcat.hashTypes) ? hashcat.hashTypes : [])
  .filter(t => t.generatable)
  .sort((a, b) => a.mode - b.mode)

const input = ref('hashcat')
const mode = ref(genModes.length ? String(genModes[0].mode) : '')
const filter = ref('')
const rows = ref([])
const status = ref('')
const copied = ref('')

function run() {
  copied.value = ''
  const pw = input.value
  if (mode.value === 'all') {
    const out = []
    for (const t of genModes) {
      try {
        const h = hashcat.generateHash(t.mode, pw)
        if (h != null && h !== false) out.push({ mode: t.mode, name: t.name, hash: String(h) })
      } catch (e) { /* skip modes that need special params */ }
    }
    rows.value = out
    status.value = `generated ${out.length} hashes for "${pw}"`
  } else {
    const t = genModes.find(x => String(x.mode) === mode.value)
    if (!t) return
    let h = null
    try { h = hashcat.generateHash(t.mode, pw) } catch (e) { status.value = 'could not generate: ' + (e.message || e); rows.value = []; return }
    rows.value = (h == null || h === false) ? [] : [{ mode: t.mode, name: t.name, hash: String(h) }]
    status.value = rows.value.length ? '' : 'this mode is verify-only (no generator).'
  }
}

const shown = computed(() => {
  const f = filter.value.trim().toLowerCase()
  return f ? rows.value.filter(r => r.name.includes(f) || String(r.mode).includes(f)) : rows.value
})

function copy(hash) {
  try { if (navigator.clipboard) navigator.clipboard.writeText(hash) } catch (e) { /* */ }
  copied.value = hash
}
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./generate</span> — password → hash</h2>
    <p class="psub">Pick a mode and password to emit its hash, or <b>all generatable</b> to emit every mode at once. Click a hash to copy.</p>

    <div class="controls">
      <span class="prompt">echo -n</span>
      <input type="text" v-model="input" spellcheck="false" style="min-width:150px" />
      <label class="field">mode
        <select v-model="mode">
          <option value="all">— all generatable ({{ genModes.length }}) —</option>
          <option v-for="t in genModes" :key="t.mode" :value="String(t.mode)">{{ t.name }} (-m {{ t.mode }})</option>
        </select>
      </label>
      <button class="btn" @click="run">generate</button>
      <input type="text" v-model="filter" placeholder="grep…" style="min-width:110px" />
    </div>

    <div class="statusline" v-if="status">{{ status }}</div>
    <div class="statusline" v-if="copied">copied: {{ copied }}</div>

    <div class="tblwrap" v-if="shown.length">
      <table>
        <thead><tr><th>Mode</th><th>Name</th><th>Hash</th></tr></thead>
        <tbody>
          <tr v-for="r in shown" :key="r.mode">
            <td class="mode">{{ r.mode }}</td>
            <td class="name">{{ r.name }}</td>
            <td class="hash" @click="copy(r.hash)" title="click to copy">{{ r.hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
