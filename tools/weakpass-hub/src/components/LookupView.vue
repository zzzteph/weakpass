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
    <h1 class="title is-4"><span class="wp-mono has-text-link">./lookup</span> — range hash lookup</h1>
    <p class="subtitle is-6">
      Reveal the password behind an <b>MD5 / NTLM / SHA1 / SHA256</b> hash using the precomputed
      <b>weakpass_4.merged</b> list via the range API — only a 6-char prefix leaves your browser, never the full hash.
    </p>

    <form @submit.prevent="handleLookup">
      <div class="field">
        <div class="control">
          <textarea class="textarea wp-mono" rows="6" v-model="content" placeholder="bef58f652fddb1c20ecbfdb7cf31d932&#10;one hash per line"></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button type="submit" class="button is-link" :class="{ 'is-loading': isProcessing }" :disabled="isProcessing">Search</button>
        </div>
      </div>
    </form>

    <div v-if="revealed.length" class="mt-4">
      <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
        <div class="tabs mb-0">
          <ul>
            <li :class="{ 'is-active': activeTab === 'found' }"><a @click="activeTab = 'found'">Found {{ foundCount }}</a></li>
            <li :class="{ 'is-active': activeTab === 'unknown' }"><a @click="activeTab = 'unknown'">Unknown {{ noMatchCount }}</a></li>
          </ul>
        </div>
        <div class="buttons">
          <button class="button is-link is-small" @click="downloadFound">Found ({{ foundCount }})</button>
          <button class="button is-link is-light is-small" @click="downloadAll">All ({{ foundCount + noMatchCount }})</button>
        </div>
      </div>

      <div class="table-container wp-scroll">
        <table class="table is-fullwidth is-hoverable">
          <thead>
            <tr><th>Hash</th><th v-if="activeTab === 'found'">Password</th><th v-if="activeTab === 'found'">Type</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in filteredRows" :key="i">
              <td class="wp-hash wp-mono">{{ item.hash }}</td>
              <td v-if="activeTab === 'found'"><b v-if="item.match !== false">{{ item.pass }}</b></td>
              <td v-if="activeTab === 'found'"><span class="tag is-light" v-if="item.match !== false">{{ item.type }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p class="is-size-7 has-text-grey mt-4">
      Uses <code>https://weakpass.com/api/v1/range</code>. You can self-host the range API against a
      <a href="https://weakpass.com/pre-computed" target="_blank" rel="noopener">precomputed table</a> and point this tool at it.
    </p>
  </div>
</template>
