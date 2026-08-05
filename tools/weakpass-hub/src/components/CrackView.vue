<script setup>
import { ref, reactive, computed, onActivated, onBeforeUnmount } from 'vue'
import hashcat from 'crack-js'
import { crackPrefill } from '../store.js'

const COMMON = ('password 123456 123456789 12345678 12345 1234 1234567 1234567890 000000 111111 654321 ' +
  'qwerty abc123 password1 password123 iloveyou admin administrator root toor guest test test123 welcome ' +
  'welcome1 login passw0rd p@ssw0rd letmein monkey dragon sunshine princess football baseball shadow master ' +
  'superman batman trustno1 hunter hashcat crackme qwertyuiop 1q2w3e4r 1qaz2wsx qazwsx zxcvbn ninja azerty ' +
  'michael jessica jennifer daniel charlie robert thomas joshua william summer winter freedom whatever ' +
  'computer internet google apple starwars pokemon secret access money mustang diamond silver golden angel ' +
  'love chocolate cookie orange purple rainbow monster coffee cowboy eagle falcon phoenix warrior killer ' +
  '2023 2024 2025 2026 admin1 admin123 root123 letmein1 monkey123 dragon123 qwerty123 iloveyou1 princess1').split(/\s+/)
const PINS = Array.from({ length: 10000 }, (_, i) => ('000' + i).slice(-4))

const sources = reactive([
  { name: 'common passwords', words: [...new Set(COMMON)], builtin: true, checked: true },
  { name: '4-digit PINs (0000–9999)', words: PINS, builtin: true, checked: false }
])

const hashesText = ref('')
const hashType = ref('auto')
const availableHashTypes = hashcat.availableHashTypes || []
const useRules = ref(false)
const rulesText = ref(':\nc\n$1\n$1 $2 $3\nr')

const RULE_PRESETS = {
  digit: ':\n$0\n$1\n$2\n$3\n$4\n$5\n$6\n$7\n$8\n$9',
  digit2: ':\n$1 $2 $3\n$2 $0 $2 $5\n$2 $0 $2 $6',
  capdigit: 'c\nc $1\nc $2 $0 $2 $6\nc $!',
  leet: 'sa@\nse3\nsi1\nso0\nss$\nsa@ se3 si1 so0 ss$',
  best: ':\nc\nu\nr\nd\n$1\n$1 $2 $3\n^1'
}

const running = ref(false)
const progress = reactive({ done: 0, total: 0, found: 0, valid: 0 })
const found = ref([])
const status = ref('')
const detected = ref('')
let worker = null

onActivated(() => {
  if (crackPrefill.value) { hashesText.value = crackPrefill.value; crackPrefill.value = ''; status.value = 'Hashes loaded from Extract.' }
})

const selectedWords = computed(() => {
  const seen = new Set(); const out = []
  for (const s of sources) if (s.checked) for (const w of s.words) if (!seen.has(w)) { seen.add(w); out.push(w) }
  return out
})

function onHashFile(e) {
  const f = e.target.files[0]; if (!f) return
  const rd = new FileReader()
  rd.onload = () => { hashesText.value = String(rd.result) }
  rd.readAsText(f); e.target.value = ''
}
function onWordlistFiles(e) {
  Array.from(e.target.files).forEach(f => {
    const rd = new FileReader()
    rd.onload = () => { sources.push({ name: f.name, words: [...new Set(String(rd.result).split(/\r?\n/).filter(Boolean))], builtin: false, checked: true }) }
    rd.readAsText(f)
  })
  e.target.value = ''
}
function setPreset(k) { rulesText.value = RULE_PRESETS[k]; useRules.value = true }

function resolveType(hashes) {
  if (hashType.value !== 'auto') return hashType.value
  const first = hashes[0]
  let names = []
  try { names = hashcat.getPossibleHashTypes(first) || [] } catch (e) { /* */ }
  for (const n of names) if (hashcat.isValidHash(first, n)) return n
  return names[0] || null
}

function start() {
  stop()
  const hashes = hashesText.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (!hashes.length) { status.value = 'Paste at least one target hash.'; return }
  const type = resolveType(hashes)
  if (!type) { status.value = 'Could not detect the hash type — pick one explicitly.'; return }
  detected.value = hashType.value === 'auto' ? type : ''
  const words = selectedWords.value
  if (!words.length) { status.value = 'Select or upload at least one wordlist.'; return }
  const rules = useRules.value ? rulesText.value.split(/\r?\n/).filter(r => r.trim() !== '') : []

  found.value = []
  progress.done = 0; progress.total = words.length; progress.found = 0; progress.valid = 0
  running.value = true
  status.value = ''

  worker = new Worker(new URL('../workers/crack.worker.js', import.meta.url), { type: 'module' })
  worker.onmessage = (e) => {
    const d = e.data
    if (d.type === 'meta') { progress.valid = d.valid; progress.total = d.total }
    else if (d.type === 'found') { found.value.push({ hash: d.hash, password: d.password }); progress.found = found.value.length }
    else if (d.type === 'progress') { progress.done = d.done; progress.total = d.total; progress.found = d.found }
    else if (d.type === 'done') { progress.done = d.total; running.value = false; status.value = `Done — cracked ${d.found} of ${progress.valid}, ${d.remaining} left.`; stop() }
    else if (d.type === 'error') { running.value = false; status.value = 'Error: ' + d.message; stop() }
  }
  worker.postMessage({ action: 'start', hashes, hashType: type, words, rules })
}
function stop() { if (worker) { worker.terminate(); worker = null } running.value = false }
onBeforeUnmount(stop)

const pct = computed(() => progress.total ? Math.min(100, Math.round((progress.done / progress.total) * 100)) : 0)

function download() {
  const txt = found.value.map(f => `${f.hash}:${f.password}`).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }))
  a.download = 'cracked.txt'
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
}
</script>

<template>
  <div>
    <h1 class="title is-4"><span class="wp-mono has-text-link">./crack</span> — dictionary + rules</h1>
    <p class="subtitle is-6">
      Paste target hashes, pick a wordlist (and optional <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank" rel="noopener">rules</a>),
      and crack in a background Web Worker — 100% client-side. Best for fast modes (md5, sha1, ntlm, …).
    </p>

    <div class="field">
      <label class="label">Target hashes <span class="has-text-weight-normal has-text-grey is-size-7">(one per line)</span></label>
      <div class="control">
        <textarea class="textarea wp-mono" rows="4" v-model="hashesText" placeholder="5f4dcc3b5aa765d61d8327deb882cf99"></textarea>
      </div>
      <div class="file is-small mt-2">
        <label class="file-label">
          <input class="file-input" type="file" @change="onHashFile" />
          <span class="file-cta"><span class="file-label">…or load a hash file</span></span>
        </label>
      </div>
    </div>

    <div class="field is-grouped is-grouped-multiline is-align-items-center">
      <div class="control">
        <label class="label is-small mb-1">Hash type</label>
        <div class="select is-small">
          <select v-model="hashType">
            <option value="auto">auto-detect</option>
            <option v-for="t in availableHashTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <span class="is-size-7 has-text-grey ml-2" v-if="detected">detected: <b>{{ detected }}</b></span>
      </div>
    </div>

    <div class="field">
      <label class="label is-small">Wordlists</label>
      <div class="field is-grouped is-grouped-multiline">
        <div class="control" v-for="s in sources" :key="s.name">
          <label class="checkbox tag is-medium" :class="s.checked ? 'is-link is-light' : ''">
            <input type="checkbox" v-model="s.checked" class="mr-2" />{{ s.name }} <span class="has-text-grey ml-1">{{ s.words.length.toLocaleString('en-US') }}</span>
          </label>
        </div>
      </div>
      <div class="file is-small">
        <label class="file-label">
          <input class="file-input" type="file" multiple accept=".txt,.lst,.dic,text/plain" @change="onWordlistFiles" />
          <span class="file-cta"><span class="file-label">+ upload wordlist</span></span>
        </label>
      </div>
    </div>

    <div class="field">
      <label class="checkbox label is-small"><input type="checkbox" v-model="useRules" class="mr-2" />apply hashcat rules</label>
      <div v-if="useRules">
        <div class="buttons are-small">
          <button class="button is-light" @click="setPreset('best')">best (small)</button>
          <button class="button is-light" @click="setPreset('digit')">append 0-9</button>
          <button class="button is-light" @click="setPreset('capdigit')">capitalize + year</button>
          <button class="button is-light" @click="setPreset('leet')">leet</button>
        </div>
        <textarea class="textarea wp-mono" rows="4" v-model="rulesText" spellcheck="false"></textarea>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control"><button class="button is-link" :class="{ 'is-loading': running }" @click="start" :disabled="running">Crack</button></div>
      <div class="control"><button class="button is-light" @click="stop" :disabled="!running">Stop</button></div>
      <div class="control" v-if="found.length"><button class="button is-success" @click="download">Download {{ found.length }}</button></div>
    </div>

    <p class="help" v-if="status">{{ status }}</p>

    <div v-if="running || progress.done" class="mt-2">
      <progress class="progress is-link" :value="pct" max="100">{{ pct }}%</progress>
      <p class="is-size-7 has-text-grey">{{ progress.done.toLocaleString('en-US') }} / {{ progress.total.toLocaleString('en-US') }} words · {{ progress.valid }} valid hash(es) · {{ progress.found }} cracked</p>
    </div>

    <div class="table-container wp-scroll mt-3" v-if="found.length">
      <table class="table is-fullwidth is-hoverable">
        <thead><tr><th>Hash</th><th>Password</th></tr></thead>
        <tbody>
          <tr v-for="(f, i) in found" :key="i">
            <td class="wp-hash wp-mono has-text-grey">{{ f.hash }}</td>
            <td class="wp-mono has-text-weight-semibold has-text-success">{{ f.password }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
