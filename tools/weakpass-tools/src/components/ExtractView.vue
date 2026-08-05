<script setup>
import { ref, inject } from 'vue'
import hashcat from 'crack-js'
import { crackPrefill } from '../store.js'

const navigate = inject('navigate')
const HAS_EXTRACT = typeof hashcat.extract === 'function'

const rows = ref([])
const status = ref('')
const over = ref(false)
const fileInput = ref(null)

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
      if (res && res.length) { res.forEach(r => { r.src = file.name }); resolve(res) }
      else resolve([{ type: '?', mode: '', name: file.name, note: 'nothing extractable found', src: file.name }])
    }
    rd.onerror = () => resolve([{ type: '?', mode: '', name: file.name, note: 'could not read file', src: file.name }])
    rd.readAsArrayBuffer(file)
  })
}

async function handleFiles(files) {
  if (!HAS_EXTRACT) { status.value = 'This build has no extract().'; return }
  if (!files || !files.length) return
  status.value = `extracting ${files.length} file${files.length > 1 ? 's' : ''}…`
  const all = []
  for (const f of files) all.push(...(await extractOne(f)))
  rows.value = all
  const n = all.filter(r => r.hash).length
  status.value = n ? `extracted ${n} hash${n > 1 ? 'es' : ''} — click a hash to copy, or send to crack.` : 'no extractable hash found.'
}

function onInput(e) { handleFiles(e.target.files); e.target.value = '' }
function onDrop(e) { over.value = false; if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files) }

const withHash = () => rows.value.filter(r => r.hash)
function copy(t) { try { if (navigator.clipboard) navigator.clipboard.writeText(t) } catch (e) { /* */ } }
function copyAll() { copy(withHash().map(r => r.hash).join('\n')); status.value = `copied ${withHash().length} hash line(s).` }
function sendToCrack() {
  const hs = withHash().map(r => r.hash)
  if (!hs.length) return
  crackPrefill.value = hs.join('\n')
  navigate('crack')
}
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./extract</span> — file → hashcat hash</h2>
    <p class="psub">
      Drop an encrypted <b>.zip / .7z / .docx / .xlsx / .rar</b> or a Wi-Fi capture — the format is sniffed and a
      ready-to-crack hashcat line is pulled out. Nothing is uploaded; it stays in your browser.
    </p>

    <div v-if="!HAS_EXTRACT" class="load-err">This build of crack-js has no <code>extract()</code>.</div>

    <div v-else class="drop" :class="{ over }"
         @click="fileInput.click()"
         @dragenter.prevent="over = true" @dragover.prevent="over = true"
         @dragleave.prevent="over = false" @drop.prevent="onDrop">
      <b>drop a file here</b> or click to choose
      <span class="sub">zip · 7z · office · rar · hccapx · pmkid/22000 text</span>
      <input ref="fileInput" type="file" multiple style="display:none" @change="onInput" />
    </div>

    <div class="statusline mt" v-if="status">{{ status }}</div>

    <div class="tblwrap mt" v-if="rows.length">
      <table>
        <thead><tr><th>Type</th><th>Mode</th><th>Name</th><th>File</th><th>Hash</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td class="name">{{ r.type }}</td>
            <td class="mode" v-if="r.mode !== '' && r.mode != null">{{ r.mode }}</td><td v-else></td>
            <td class="name">{{ r.name || '' }}</td>
            <td class="hint">{{ r.file || r.src || '' }}</td>
            <td>
              <span v-if="r.hash" class="hash" @click="copy(r.hash)" title="click to copy">{{ r.hash }}</span>
              <span v-else class="pill warnp">{{ r.note || 'no hash' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="controls mt" v-if="rows.some(r => r.hash)">
      <button class="btn" @click="sendToCrack">send all → crack</button>
      <button class="btn ghost" @click="copyAll">copy all</button>
    </div>
  </div>
</template>
