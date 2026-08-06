<script setup>
import { ref, reactive, computed, onActivated, onBeforeUnmount } from 'vue'
import hashcat from 'crack-js'
import { crackPrefill, workflows, crackRunWorkflow } from '../store.js'

const HAS_EXTRACT = typeof hashcat.extract === 'function'

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
const attack = ref('dict') // 'dict' | 'brute' | 'workflow'
const useRules = ref(false)
const rulesText = ref(':\nc\n$1\n$1 $2 $3\nr')
const bf = reactive({ l: true, u: false, d: true, s: false, custom: '', min: 1, max: 4 })
const selectedWf = ref('')
const hashFileRef = ref(null)
const wlFileRef = ref(null)

const RULE_PRESETS = {
  digit: ':\n$0\n$1\n$2\n$3\n$4\n$5\n$6\n$7\n$8\n$9',
  capdigit: 'c\nc $1\nc $2 $0 $2 $6\nc $!',
  leet: 'sa@\nse3\nsi1\nso0\nss$\nsa@ se3 si1 so0 ss$',
  best: ':\nc\nu\nr\nd\n$1\n$1 $2 $3\n^1'
}

const running = ref(false)
const finished = ref(false)
const progress = reactive({ done: 0, total: 0, found: 0, valid: 0, hps: 0, eta: null })
const step = reactive({ index: 0, steps: 0, label: '' })
const found = ref([])
const status = ref('')
const detected = ref('')
const over = ref(false)
const dropFileRef = ref(null)
let worker = null

function fmt(n) { return Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '∞' }
function fmtBig(n) {
  if (!isFinite(n)) return '∞'
  if (n < 1e6) return Math.round(n).toLocaleString('en-US')
  if (n < 1e9) return (n / 1e6).toFixed(1) + 'M'
  if (n < 1e12) return (n / 1e9).toFixed(1) + 'B'
  if (n < 1e15) return (n / 1e12).toFixed(1) + 'T'
  return n.toExponential(1)
}
function fmtEta(sec) {
  if (sec == null || !isFinite(sec)) return '∞'
  if (sec < 1) return '<1s'
  if (sec < 60) return Math.round(sec) + 's'
  if (sec < 3600) return Math.floor(sec / 60) + 'm ' + Math.round(sec % 60) + 's'
  if (sec < 86400) return Math.floor(sec / 3600) + 'h ' + Math.floor((sec % 3600) / 60) + 'm'
  if (sec < 86400 * 365) return Math.floor(sec / 86400) + 'd ' + Math.floor((sec % 86400) / 3600) + 'h'
  const yr = sec / (86400 * 365)
  return yr > 1e6 ? '>1M yr' : (yr < 1000 ? yr.toFixed(1) + ' yr' : Math.round(yr).toLocaleString('en-US') + ' yr')
}

onActivated(() => {
  if (crackPrefill.value) { hashesText.value = crackPrefill.value; crackPrefill.value = ''; status.value = 'Hashes loaded from Extract.' }
  if (crackRunWorkflow.value) { attack.value = 'workflow'; selectedWf.value = crackRunWorkflow.value; crackRunWorkflow.value = ''; status.value = 'Workflow loaded — hit crack.' }
})

const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/'
function buildCharset(c) {
  let s = ''
  if (c.l) s += 'abcdefghijklmnopqrstuvwxyz'
  if (c.u) s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (c.d) s += '0123456789'
  if (c.s) s += SYMBOLS
  if (c.custom) s += c.custom
  return [...new Set(s.split(''))].join('')
}
const bfCharset = computed(() => buildCharset(bf))
const bfSpace = computed(() => {
  const n = bfCharset.value.length
  if (!n) return 0
  let t = 0
  for (let L = Math.max(1, bf.min); L <= Math.max(bf.min, bf.max); L++) t += Math.pow(n, L)
  return t
})

const selectedWords = computed(() => {
  const seen = new Set(); const out = []
  for (const s of sources) if (s.checked) for (const w of s.words) if (!seen.has(w)) { seen.add(w); out.push(w) }
  return out
})
const needsWordlist = computed(() => attack.value === 'dict' ||
  (attack.value === 'workflow' && (workflows.value.find(w => w.id === selectedWf.value)?.steps || []).some(s => s.type === 'dict')))

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

// Drop an encrypted archive / capture → sniff it into hashcat lines → crack immediately.
function extractOne(file) {
  return new Promise((resolve) => {
    const rd = new FileReader()
    rd.onload = () => {
      let res = null
      try { res = hashcat.extract(new Uint8Array(rd.result)) }
      catch (e1) {
        try { res = hashcat.extract(new TextDecoder('utf-8').decode(new Uint8Array(rd.result))) }
        catch (e2) { res = null }
      }
      resolve(res && res.length ? res : [])
    }
    rd.onerror = () => resolve([])
    rd.readAsArrayBuffer(file)
  })
}
async function extractAndCrack(files) {
  if (!HAS_EXTRACT) { status.value = 'This build of crack-js has no extract().'; return }
  if (!files || !files.length) return
  status.value = `extracting ${files.length} file${files.length > 1 ? 's' : ''}…`
  const all = []
  for (const f of files) all.push(...(await extractOne(f)))
  const hs = all.filter(r => r.hash).map(r => r.hash)
  if (!hs.length) { status.value = 'No crackable hash found in that file.'; return }
  hashesText.value = hs.join('\n')
  hashType.value = 'auto'
  status.value = `extracted ${hs.length} hash${hs.length > 1 ? 'es' : ''} — launching…`
  start()
}
function onDropCrack(e) { over.value = false; if (e.dataTransfer?.files?.length) extractAndCrack(e.dataTransfer.files) }
function onDropInput(e) { extractAndCrack(e.target.files); e.target.value = '' }

function resolveType(hashes) {
  if (hashType.value !== 'auto') return hashType.value
  const first = hashes[0]
  let names = []
  try { names = hashcat.getPossibleHashTypes(first) || [] } catch (e) { /* */ }
  for (const n of names) if (hashcat.isValidHash(first, n)) return n
  return names[0] || null
}

function buildPlan() {
  if (attack.value === 'dict') {
    const rules = useRules.value ? rulesText.value.split(/\r?\n/).filter(r => r.trim() !== '') : []
    return [{ type: 'dict', rules, label: 'wordlist' + (rules.length ? ' + rules' : '') }]
  }
  if (attack.value === 'brute') {
    return [{ type: 'brute', charset: bfCharset.value, min: bf.min, max: bf.max, label: 'bruteforce' }]
  }
  const wf = workflows.value.find(w => w.id === selectedWf.value)
  if (!wf) return null
  return wf.steps.map(s => s.type === 'brute'
    ? { type: 'brute', charset: buildCharset(s.charset), min: s.min, max: s.max, label: 'bruteforce' }
    : { type: 'dict', rules: (s.rules || '').split(/\r?\n/).filter(r => r.trim() !== ''), label: 'wordlist' + ((s.rules || '').trim() ? ' + rules' : '') })
}

function start() {
  stop()
  const hashes = hashesText.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (!hashes.length) { status.value = 'Paste at least one target hash.'; return }
  const type = resolveType(hashes)
  if (!type) { status.value = 'Could not detect the hash type — pick one explicitly.'; return }
  detected.value = hashType.value === 'auto' ? type : ''
  const plan = buildPlan()
  if (!plan || !plan.length) { status.value = 'Pick a workflow to run (build one in the workflows tab).'; return }
  const words = selectedWords.value
  if (needsWordlist.value && !words.length) { status.value = 'Select or upload a wordlist for the wordlist step(s).'; return }

  found.value = []
  progress.done = 0; progress.total = 0; progress.found = 0; progress.valid = 0; progress.hps = 0; progress.eta = null
  step.index = 0; step.steps = plan.length; step.label = ''
  running.value = true; finished.value = false
  status.value = ''

  worker = new Worker(new URL('../workers/crack.worker.js', import.meta.url), { type: 'module' })
  worker.onmessage = (e) => {
    const d = e.data
    if (d.type === 'meta') { progress.valid = d.valid; step.steps = d.steps }
    else if (d.type === 'step') { step.index = d.index; step.steps = d.steps; step.label = d.label }
    else if (d.type === 'found') { found.value.push({ hash: d.hash, password: d.password }); progress.found = found.value.length }
    else if (d.type === 'progress') { progress.done = d.done; progress.total = d.total; progress.found = d.found; progress.hps = d.hps; progress.eta = d.eta }
    else if (d.type === 'done') { finished.value = true; running.value = false; progress.eta = 0; status.value = `Done — cracked ${d.found} of ${progress.valid}, ${d.remaining} left.`; stop() }
    else if (d.type === 'error') { running.value = false; status.value = 'Error: ' + d.message; stop() }
  }
  worker.postMessage({ action: 'start', hashes, hashType: type, words, plan })
}
function stop() { if (worker) { worker.terminate(); worker = null } running.value = false }
onBeforeUnmount(stop)

const showTotal = computed(() => !!progress.total && isFinite(progress.total))
const pct = computed(() => {
  if (finished.value) return 100
  if (showTotal.value) return Math.min(100, Math.round((progress.done / progress.total) * 100))
  return running.value ? 4 : 0
})

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
    <h2 class="ptitle"><span class="cmd">./crack</span> — dictionary · bruteforce · workflows</h2>
    <p class="psub">
      Paste target hashes and run a <b>wordlist + rules</b>, a <b>bruteforce</b>, or a saved
      <a href="#workflows">workflow</a> (chained attack) — all in a background Web Worker, 100% client-side.
      Best for fast modes (md5, sha1, ntlm, …).
    </p>

    <div class="field-block">
      <label class="blocklabel">target hashes <span class="hint">— one per line</span></label>
      <textarea v-model="hashesText" rows="4" placeholder="5f4dcc3b5aa765d61d8327deb882cf99"></textarea>
      <div class="controls" style="margin-top:8px">
        <button class="btn ghost sm" @click="hashFileRef.click()">load hash file</button>
        <input ref="hashFileRef" type="file" style="display:none" @change="onHashFile" />
        <label class="field">hash type
          <select v-model="hashType">
            <option value="auto">auto-detect</option>
            <option v-for="t in availableHashTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>
        <label class="field">attack
          <select v-model="attack">
            <option value="dict">wordlist + rules</option>
            <option value="brute">bruteforce</option>
            <option value="workflow" :disabled="!workflows.length">workflow</option>
          </select>
        </label>
        <span class="hint" v-if="detected">detected: <b>{{ detected }}</b></span>
      </div>
      <div v-if="HAS_EXTRACT" class="drop drop-sm" :class="{ over }"
           @click="dropFileRef.click()"
           @dragenter.prevent="over = true" @dragover.prevent="over = true"
           @dragleave.prevent="over = false" @drop.prevent="onDropCrack">
        <b>drop an encrypted archive or capture</b> — extract &amp; auto-crack
        <span class="sub">zip · 7z · office · rar · hccapx · pmkid/22000 — starts immediately</span>
        <input ref="dropFileRef" type="file" multiple style="display:none" @change="onDropInput" />
      </div>
    </div>

    <!-- wordlists (dict + workflows with a wordlist step) -->
    <template v-if="needsWordlist">
      <label class="blocklabel">wordlists</label>
      <div class="wordlists">
        <label class="wl-item" v-for="s in sources" :key="s.name">
          <input type="checkbox" v-model="s.checked" /> {{ s.name }} <span class="wl-count">{{ s.words.length.toLocaleString('en-US') }}</span>
        </label>
      </div>
      <div class="controls" style="margin-top:2px">
        <button class="btn ghost sm" @click="wlFileRef.click()">+ upload wordlist</button>
        <input ref="wlFileRef" type="file" multiple accept=".txt,.lst,.dic,text/plain" style="display:none" @change="onWordlistFiles" />
      </div>
    </template>

    <!-- wordlist + rules -->
    <div v-if="attack === 'dict'" class="field-block">
      <label class="field mb"><input type="checkbox" v-model="useRules" /> apply hashcat rules</label>
      <div v-if="useRules">
        <div class="controls" style="margin-bottom:8px">
          <button class="btn ghost sm" @click="setPreset('best')">best (small)</button>
          <button class="btn ghost sm" @click="setPreset('digit')">append 0-9</button>
          <button class="btn ghost sm" @click="setPreset('capdigit')">capitalize + year</button>
          <button class="btn ghost sm" @click="setPreset('leet')">leet</button>
        </div>
        <textarea v-model="rulesText" rows="4" spellcheck="false"></textarea>
      </div>
    </div>

    <!-- bruteforce -->
    <div v-if="attack === 'brute'" class="cfgbox">
      <label class="blocklabel">charset</label>
      <div class="wf-mini">
        <span class="charset-toggles">
          <label class="cs-tog"><input type="checkbox" v-model="bf.l" /> a-z</label>
          <label class="cs-tog"><input type="checkbox" v-model="bf.u" /> A-Z</label>
          <label class="cs-tog"><input type="checkbox" v-model="bf.d" /> 0-9</label>
          <label class="cs-tog"><input type="checkbox" v-model="bf.s" /> symbols</label>
        </span>
        <label class="field">custom <input type="text" v-model="bf.custom" placeholder="extra chars" style="width:120px" /></label>
        <label class="field">min <input type="number" class="len-in" v-model.number="bf.min" min="1" max="12" /></label>
        <label class="field">max <input type="number" class="len-in" v-model.number="bf.max" min="1" max="12" /></label>
      </div>
      <div class="space-est">keyspace ≈ <b>{{ bfSpace.toLocaleString('en-US') }}</b> candidates ({{ bfCharset.length }}-char set) — browser bruteforce is only practical for small keyspaces.</div>
    </div>

    <!-- workflow picker -->
    <div v-if="attack === 'workflow'" class="cfgbox">
      <label class="field">run workflow
        <select v-model="selectedWf">
          <option value="" disabled>— pick a workflow —</option>
          <option v-for="wf in workflows" :key="wf.id" :value="wf.id">{{ wf.name }} ({{ wf.steps.length }} steps)</option>
        </select>
      </label>
      <span class="hint" style="margin-left:8px">build &amp; edit these in the <a href="#workflows">workflows</a> tab →</span>
    </div>

    <div class="controls mt">
      <button class="btn" @click="start" :disabled="running">crack</button>
      <button class="btn ghost" @click="stop" :disabled="!running">stop</button>
      <button v-if="found.length" class="btn ghost" @click="download">download {{ found.length }}</button>
    </div>

    <div class="progress" :class="{ on: running || progress.found || step.index || finished }"><i :style="{ width: pct + '%' }"></i></div>
    <div class="statusline" v-if="status">{{ status }}</div>
    <div class="statusline" v-if="running || step.index">
      <span v-if="step.steps > 1">step {{ step.index }}/{{ step.steps }} · {{ step.label }} · </span>
      {{ fmt(progress.done) }}<span v-if="showTotal"> / {{ fmtBig(progress.total) }}</span> tried
      · <b>{{ fmt(progress.hps) }}</b> H/s<span v-if="progress.eta != null"> · eta {{ fmtEta(progress.eta) }}</span>
      · {{ progress.valid }} valid · {{ progress.found }} cracked
    </div>

    <div class="tblwrap mt" v-if="found.length">
      <table>
        <thead><tr><th>Hash</th><th>Password</th></tr></thead>
        <tbody>
          <tr v-for="(f, i) in found" :key="i">
            <td class="hash">{{ f.hash }}</td>
            <td class="pass">{{ f.password }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
