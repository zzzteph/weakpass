<script setup>
import { ref } from 'vue'
import hashcat from 'crack-js'

const input = ref('')
const results = ref([])
const done = ref(false)

const modeByName = {}
if (Array.isArray(hashcat.hashTypes)) {
  for (const t of hashcat.hashTypes) {
    const names = t.names || [t.name]
    for (const n of names) if (modeByName[n] === undefined) modeByName[n] = t.mode
  }
}

const examples = [
  ['md5', '5f4dcc3b5aa765d61d8327deb882cf99'],
  ['sha1', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8'],
  ['bcrypt', '$2a$05$/VT2Xs2dMd8GJKfrXhjYP.DkTjOVrY12yDN7/6I8ZV0q/1lEohLru'],
  ['md5crypt', '$1$28772684$iEwNOgGugqO9.bIz5sk8k/']
]

function identify() {
  const h = input.value.trim()
  done.value = true
  if (!h) { results.value = []; return }
  let names = []
  try { names = hashcat.getPossibleHashTypes(h) || [] } catch (e) { names = [] }
  results.value = names.map(n => ({ name: n, mode: modeByName[n] }))
}
function useExample(h) { input.value = h; identify() }
function clear() { input.value = ''; results.value = []; done.value = false }
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./identify</span> — what is this hash?</h2>
    <p class="psub">Paste a hash — it's matched against all {{ hashcat.hashTypes.length }} known formats, client-side.</p>

    <textarea v-model="input" rows="2" placeholder="e.g.  5f4dcc3b5aa765d61d8327deb882cf99" @keydown.enter.prevent="identify"></textarea>
    <div class="controls mt">
      <button class="btn" @click="identify">identify</button>
      <button class="btn ghost" @click="clear">clear</button>
    </div>

    <div class="examples">try:
      <code v-for="e in examples" :key="e[0]" @click="useExample(e[1])">{{ e[0] }}</code>
    </div>

    <div v-if="done" class="mt">
      <div v-if="results.length" class="results">
        <div v-for="r in results" :key="r.name" class="match">
          <span class="m-name">{{ r.name }}</span>
          <span class="m-flags"><span class="pill" v-if="r.mode !== undefined">-m {{ r.mode }}</span></span>
        </div>
      </div>
      <div v-else class="empty">No known format matches that string.</div>
    </div>
  </div>
</template>
