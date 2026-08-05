<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import hashcat from 'crack-js'

import HomeView from './components/HomeView.vue'
import PassgenView from './components/PassgenView.vue'
import PasscheckView from './components/PasscheckView.vue'
import LookupView from './components/LookupView.vue'
import IdentifyView from './components/IdentifyView.vue'
import GenerateView from './components/GenerateView.vue'
import BenchmarkView from './components/BenchmarkView.vue'
import CrackView from './components/CrackView.vue'
import ExtractView from './components/ExtractView.vue'

const tools = [
  { id: 'home', label: 'Home', ic: '⌂', comp: HomeView, group: null, sub: 'overview' },
  { id: 'passgen', label: 'Passgen', ic: '≡', comp: PassgenView, group: 'weakpass', sub: 'wordlist generator' },
  { id: 'passcheck', label: 'Passcheck', ic: '✓', comp: PasscheckView, group: 'weakpass', sub: 'is my password compromised?' },
  { id: 'lookup', label: 'Lookup', ic: '⌕', comp: LookupView, group: 'weakpass', sub: 'range hash lookup' },
  { id: 'identify', label: 'Identify', ic: '?', comp: IdentifyView, group: 'crack toolkit', sub: 'what is this hash?' },
  { id: 'generate', label: 'Generate', ic: '#', comp: GenerateView, group: 'crack toolkit', sub: 'password → hash' },
  { id: 'benchmark', label: 'Benchmark', ic: '⚡', comp: BenchmarkView, group: 'crack toolkit', sub: 'hashes/sec per mode' },
  { id: 'crack', label: 'Crack', ic: '⚒', comp: CrackView, group: 'crack toolkit', sub: 'dictionary + rules' },
  { id: 'extract', label: 'Extract', ic: '⇪', comp: ExtractView, group: 'crack toolkit', sub: 'file → hash' }
]

const ids = tools.map(t => t.id)
const active = ref(ids.includes(location.hash.replace('#', '')) ? location.hash.replace('#', '') : 'home')

function navigate(id) {
  if (!ids.includes(id)) return
  active.value = id
  if (history.replaceState) history.replaceState(null, '', '#' + id)
  const m = document.querySelector('.hub-main')
  if (m) m.scrollTop = 0
}
window.addEventListener('hashchange', () => {
  const h = location.hash.replace('#', '')
  if (ids.includes(h)) active.value = h
})
provide('navigate', navigate)
provide('tools', tools)

const activeTool = computed(() => tools.find(t => t.id === active.value) || tools[0])

// grouped nav
const groups = computed(() => {
  const out = []
  for (const t of tools) {
    let g = out.find(x => x.name === t.group)
    if (!g) { g = { name: t.group, items: [] }; out.push(g) }
    g.items.push(t)
  }
  return out
})

const modeCount = ref(0)
onMounted(() => { modeCount.value = Array.isArray(hashcat.hashTypes) ? hashcat.hashTypes.length : 0 })
</script>

<template>
  <div class="hub">
    <nav class="hub-sidebar">
      <div>
        <div class="hub-brand">weak<span class="sep">·</span>pass</div>
        <div class="hub-tagline">// tools · runs in your browser</div>
      </div>

      <div class="hub-nav">
        <template v-for="g in groups" :key="g.name || 'top'">
          <div v-if="g.name" class="hub-navlabel">{{ g.name }}</div>
          <button
            v-for="t in g.items"
            :key="t.id"
            class="hub-navbtn"
            :class="{ 'is-active': active === t.id }"
            @click="navigate(t.id)"
          >
            <span class="ic wp-mono">{{ t.ic }}</span>
            <span>{{ t.label }}</span>
          </button>
        </template>
      </div>

      <div class="hub-navfoot">
        <a href="https://weakpass.com" target="_blank" rel="noopener">weakpass.com ↗</a>
        <a href="https://github.com/zzzteph/weakpass" target="_blank" rel="noopener">github ↗</a>
        <a>{{ modeCount }} hash modes · client-side</a>
      </div>
    </nav>

    <main class="hub-main">
      <div class="hub-main-inner">
        <keep-alive>
          <component :is="activeTool.comp" />
        </keep-alive>
      </div>
    </main>
  </div>
</template>
