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
    <h1 class="title is-4"><span class="wp-mono has-text-link">./identify</span> — what is this hash?</h1>
    <p class="subtitle is-6">Paste a hash — it's matched against all {{ hashcat.hashTypes.length }} known formats, client-side.</p>

    <div class="field">
      <div class="control">
        <textarea class="textarea wp-mono" rows="2" v-model="input" placeholder="e.g. 5f4dcc3b5aa765d61d8327deb882cf99" @keydown.enter.prevent="identify"></textarea>
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control"><button class="button is-link" @click="identify">Identify</button></div>
      <div class="control"><button class="button is-light" @click="clear">Clear</button></div>
    </div>

    <div class="field is-grouped is-grouped-multiline">
      <span class="is-size-7 has-text-grey mr-2 mt-1">try:</span>
      <div class="control" v-for="e in examples" :key="e[0]">
        <button class="button is-small is-light wp-mono" @click="useExample(e[1])">{{ e[0] }}</button>
      </div>
    </div>

    <div v-if="done" class="mt-3">
      <div v-if="results.length" class="wp-scroll">
        <div v-for="r in results" :key="r.name" class="box py-2 px-4 mb-2 is-flex is-align-items-center is-justify-content-space-between">
          <span class="wp-mono has-text-weight-semibold">{{ r.name }}</span>
          <span class="tag is-link is-light wp-mono" v-if="r.mode !== undefined">-m {{ r.mode }}</span>
        </div>
      </div>
      <div v-else class="notification is-warning is-light">No known format matches that string.</div>
    </div>
  </div>
</template>
