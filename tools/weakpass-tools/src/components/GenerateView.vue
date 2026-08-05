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
    <h1 class="title is-4"><span class="wp-mono has-text-link">./generate</span> — password → hash</h1>
    <p class="subtitle is-6">Pick a mode and a password to emit its hash, or choose <b>all generatable</b> to emit every mode at once. Click a hash to copy.</p>

    <div class="field is-grouped is-grouped-multiline is-align-items-center">
      <div class="control">
        <div class="field has-addons mb-0">
          <p class="control"><span class="button is-static wp-mono">echo -n</span></p>
          <p class="control"><input class="input wp-mono" v-model="input" spellcheck="false" style="min-width:160px" /></p>
        </div>
      </div>
      <div class="control">
        <div class="select">
          <select v-model="mode">
            <option value="all">— all generatable ({{ genModes.length }}) —</option>
            <option v-for="t in genModes" :key="t.mode" :value="String(t.mode)">{{ t.name }} (-m {{ t.mode }})</option>
          </select>
        </div>
      </div>
      <div class="control"><button class="button is-link" @click="run">Generate</button></div>
      <div class="control"><input class="input" v-model="filter" placeholder="grep…" style="min-width:110px" /></div>
    </div>

    <p class="help" v-if="status">{{ status }}</p>
    <p class="help is-success" v-if="copied">copied: <span class="wp-mono">{{ copied }}</span></p>

    <div class="table-container wp-scroll mt-3" v-if="shown.length">
      <table class="table is-fullwidth is-hoverable">
        <thead><tr><th>Mode</th><th>Name</th><th>Hash</th></tr></thead>
        <tbody>
          <tr v-for="r in shown" :key="r.mode">
            <td class="wp-mono has-text-grey">-m {{ r.mode }}</td>
            <td class="wp-mono">{{ r.name }}</td>
            <td class="wp-hash wp-mono wp-clickable" @click="copy(r.hash)" title="click to copy">{{ r.hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
