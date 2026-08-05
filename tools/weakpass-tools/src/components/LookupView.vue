<script setup>
import { ref, computed } from 'vue'

const API_URL = 'https://weakpass.com/api/v1/range/'

const content = ref('')
const hashes = ref([])
const revealed = ref([])
const isProcessing = ref(false)
const activeTab = ref('found')

const reversedRevealed = computed(() => [...revealed.value].reverse())
const filteredRows = computed(() =>
  activeTab.value === 'found'
    ? reversedRevealed.value.filter(i => i.match !== false)
    : reversedRevealed.value.filter(i => i.match === false)
)
const foundCount = computed(() => revealed.value.filter(i => i.match !== false).length)
const noMatchCount = computed(() => revealed.value.filter(i => i.match === false).length)

function buildHashDB() {
  let arr = content.value.split(/[\n\s:;]+/).filter(x => x.trim() !== '')
  hashes.value = [...new Set(arr)]
}
function fullMatch(results, hashtype) {
  const matched = []
  hashes.value.forEach(hash => {
    results.flat().forEach(item => {
      if (item.hash === hash.toLowerCase()) {
        revealed.value.push({ hash: item.hash, pass: item.pass, type: hashtype, match: 'strict' })
        matched.push(hash.toLowerCase())
      }
    })
  })
  hashes.value = hashes.value.filter(h => !matched.includes(h.toLowerCase()))
}
function partialMatch(results, hashtype) {
  const matched = []
  hashes.value.forEach(hash => {
    results.flat().forEach(item => {
      if (item.hash.length - hash.length < item.hash.length / 2 && item.hash.startsWith(hash.toLowerCase())) {
        revealed.value.push({ hash: item.hash, pass: item.pass, type: hashtype, match: 'partial', original: hash })
        matched.push(hash.toLowerCase())
      }
    })
  })
  hashes.value = hashes.value.filter(h => !matched.includes(h.toLowerCase()))
}
function lastBytes(results, hashtype) {
  const matched = []
  hashes.value.forEach(hash => {
    const entry = hash.slice(0, -2)
    results.flat().forEach(item => {
      if (item.hash.length - entry.length < item.hash.length / 2 && item.hash.startsWith(entry.toLowerCase())) {
        revealed.value.push({ hash: item.hash, pass: item.pass, type: hashtype, match: 'last', original: hash })
        matched.push(hash.toLowerCase())
      }
    })
  })
  hashes.value = hashes.value.filter(h => !matched.includes(h.toLowerCase()))
}
async function parseResults(results, hashtype) {
  fullMatch(results, hashtype)
  partialMatch(results, hashtype)
  lastBytes(results, hashtype)
}
async function lookupType(type, minLen, maxLen) {
  const prefixes = new Set()
  hashes.value.forEach(line => {
    if (line.length >= minLen && line.length <= maxLen && /^[0-9a-fA-F]+$/i.test(line)) {
      prefixes.add(line.substring(0, 6))
    }
  })
  for (const p of prefixes) {
    try {
      const resp = await fetch(`${API_URL}${p}.json?type=${type}`)
      const data = await resp.json()
      await parseResults([data], type)
    } catch (e) {
      console.error(`lookup ${type} ${p}`, e)
    }
  }
}
function cleanUp() {
  hashes.value.forEach(hash => revealed.value.push({ hash, pass: false, type: false, match: false }))
  hashes.value = []
  content.value = ''
}
async function handleLookup() {
  isProcessing.value = true
  buildHashDB()
  try { await lookupType('md5', 30, 32) } catch (e) { /* */ }
  try { await lookupType('ntlm', 30, 32) } catch (e) { /* */ }
  try { await lookupType('sha1', 38, 40) } catch (e) { /* */ }
  try { await lookupType('sha256', 60, 64) } catch (e) { /* */ }
  cleanUp()
  isProcessing.value = false
}

function toCSV(rows) { return rows.map(r => r.join(',')).join('\n') }
function download(csv, name) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = name
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
}
function downloadAll() {
  download(toCSV([['Hash', 'Match', 'Type', 'Password'], ...revealed.value.map(i => [i.hash, i.match !== false ? i.match : 'no match', i.type, i.pass])]), 'all_hashes.csv')
}
function downloadFound() {
  download(toCSV([['Hash', 'Match', 'Type', 'Password'], ...revealed.value.filter(i => i.match !== false).map(i => [i.hash, i.match, i.type, i.pass])]), 'found_hashes.csv')
}
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./lookup</span> — range hash lookup</h2>
    <p class="psub">
      Reveal the password behind an <b>MD5 / NTLM / SHA1 / SHA256</b> hash using the precomputed
      <b>weakpass_4.merged</b> list — only a 6-char prefix leaves your browser, never the full hash.
    </p>

    <textarea v-model="content" rows="6" placeholder="bef58f652fddb1c20ecbfdb7cf31d932&#10;one hash per line"></textarea>
    <div class="controls mt">
      <button class="btn" @click="handleLookup" :disabled="isProcessing">{{ isProcessing ? 'searching…' : 'search' }}</button>
    </div>

    <div v-if="revealed.length" class="mt">
      <div class="rowspread">
        <div class="controls" style="margin:0">
          <button class="btn ghost sm" :class="{ on: activeTab === 'found' }" @click="activeTab = 'found'">found {{ foundCount }}</button>
          <button class="btn ghost sm" :class="{ on: activeTab === 'unknown' }" @click="activeTab = 'unknown'">unknown {{ noMatchCount }}</button>
        </div>
        <div class="controls" style="margin:0">
          <button class="btn ghost sm" @click="downloadFound">export found</button>
          <button class="btn ghost sm" @click="downloadAll">export all</button>
        </div>
      </div>

      <div class="tblwrap">
        <table>
          <thead><tr><th>Hash</th><th v-if="activeTab === 'found'">Password</th><th v-if="activeTab === 'found'">Type</th></tr></thead>
          <tbody>
            <tr v-for="(item, i) in filteredRows" :key="i">
              <td class="hash">{{ item.hash }}</td>
              <td class="pass" v-if="activeTab === 'found'">{{ item.pass }}</td>
              <td v-if="activeTab === 'found'"><span class="pill">{{ item.type }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p class="hint mt">
      Uses <span class="accent">weakpass.com/api/v1/range</span>. You can self-host it against a
      <a href="https://weakpass.com/pre-computed" target="_blank" rel="noopener">precomputed table</a> and point this tool at it.
    </p>
  </div>
</template>
