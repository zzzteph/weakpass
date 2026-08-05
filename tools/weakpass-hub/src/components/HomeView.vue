<script setup>
import { inject, ref, onMounted } from 'vue'
import hashcat from 'crack-js'

const navigate = inject('navigate')
const tools = inject('tools').filter(t => t.id !== 'home')

const stats = ref([])
onMounted(() => {
  const ht = Array.isArray(hashcat.hashTypes) ? hashcat.hashTypes : []
  const gen = ht.filter(t => t.generatable).length
  const fast = ht.filter(t => t.fast).length
  stats.value = [
    ['hash registry', ht.length + ' modes'],
    ['generators armed', gen + ' online'],
    ['fast (single-shot) modes', fast],
    ['file extractors', typeof hashcat.extract === 'function' ? 'zip · 7z · office · rar · wpa' : 'unavailable'],
    ['backend / dependencies', '0 — client-side']
  ]
})
</script>

<template>
  <div>
    <h1 class="title is-1 wp-mono">weak<span class="has-text-link">·</span>pass</h1>
    <p class="subtitle is-5 mt-2">
      A single home for the weakpass tools — a
      <b>wordlist generator</b>, <b>password check</b>, <b>hash lookup</b>, and a full
      <b>client-side crack toolkit</b>. No server, nothing uploaded — everything runs in your browser.
    </p>

    <div class="box" style="max-width:560px">
      <div v-for="s in stats" :key="s[0]" class="is-flex is-justify-content-space-between py-1" style="border-bottom:1px dotted #eee">
        <span class="has-text-grey">&gt; {{ s[0] }}</span>
        <span class="has-text-link has-text-weight-semibold wp-mono">[ {{ s[1] }} ]</span>
      </div>
    </div>

    <div class="columns is-multiline mt-2">
      <div v-for="t in tools" :key="t.id" class="column is-4-desktop is-6-tablet">
        <div class="box wp-clickable" style="height:100%" @click="navigate(t.id)">
          <p class="title is-6 mb-1">
            <span class="wp-mono has-text-link mr-2">{{ t.ic }}</span>{{ t.label }}
          </p>
          <p class="is-size-7 has-text-grey">{{ t.sub }}</p>
        </div>
      </div>
    </div>

    <p class="is-size-7 has-text-grey mt-4">
      weakpass · client-side toolkit ·
      <a href="https://github.com/zzzteph/weakpass" target="_blank" rel="noopener">github.com/zzzteph/weakpass</a>
    </p>
  </div>
</template>
