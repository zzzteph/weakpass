<script setup>
import { ref, computed, provide } from 'vue'

import HomeView from './components/HomeView.vue'
import PassgenView from './components/PassgenView.vue'
import PasscheckView from './components/PasscheckView.vue'
import LookupView from './components/LookupView.vue'
import IdentifyView from './components/IdentifyView.vue'
import GenerateView from './components/GenerateView.vue'
import BenchmarkView from './components/BenchmarkView.vue'
import CrackView from './components/CrackView.vue'
import ExtractView from './components/ExtractView.vue'
import WorkflowsView from './components/WorkflowsView.vue'

const tools = [
  { id: 'home', label: 'home', comp: HomeView, group: null, sub: 'overview' },
  { id: 'passgen', label: 'passgen', comp: PassgenView, group: 'weakpass', sub: 'wordlist generator' },
  { id: 'passcheck', label: 'passcheck', comp: PasscheckView, group: 'weakpass', sub: 'is my password compromised?' },
  { id: 'lookup', label: 'lookup', comp: LookupView, group: 'weakpass', sub: 'range hash lookup' },
  { id: 'identify', label: 'identify', comp: IdentifyView, group: 'crack toolkit', sub: 'what is this hash?' },
  { id: 'generate', label: 'generate', comp: GenerateView, group: 'crack toolkit', sub: 'password → hash' },
  { id: 'benchmark', label: 'benchmark', comp: BenchmarkView, group: 'crack toolkit', sub: 'hashes/sec per mode' },
  { id: 'crack', label: 'crack', comp: CrackView, group: 'crack toolkit', sub: 'dictionary · bruteforce · workflows' },
  { id: 'extract', label: 'extract', comp: ExtractView, group: 'crack toolkit', sub: 'file → hash' },
  { id: 'workflows', label: 'workflows', comp: WorkflowsView, group: 'crack toolkit', sub: 'preconfigure chained cracking' }
]
const ids = tools.map(t => t.id)
const active = ref(ids.includes(location.hash.replace('#', '')) ? location.hash.replace('#', '') : 'home')

function navigate(id) {
  if (!ids.includes(id)) return
  active.value = id
  if (history.replaceState) history.replaceState(null, '', '#' + id)
  const m = document.querySelector('.main')
  if (m) m.scrollTop = 0
}
window.addEventListener('hashchange', () => {
  const h = location.hash.replace('#', '')
  if (ids.includes(h)) active.value = h
})
provide('navigate', navigate)
provide('tools', tools)

const activeTool = computed(() => tools.find(t => t.id === active.value) || tools[0])
const groups = computed(() => {
  const out = []
  for (const t of tools) {
    let g = out.find(x => x.name === t.group)
    if (!g) { g = { name: t.group, items: [] }; out.push(g) }
    g.items.push(t)
  }
  return out
})

function togglePhosphor() {
  const el = document.documentElement
  el.dataset.phosphor = el.dataset.phosphor === 'amber' ? 'green' : 'amber'
}
</script>

<template>
  <div class="layout">
    <nav class="sidenav">
      <div class="brand">weak<span class="sep">·</span>pass <span class="t">tools</span></div>

      <div class="navtabs" role="tablist" aria-label="tools">
        <template v-for="g in groups" :key="g.name || 'top'">
          <div v-if="g.name" class="navlabel">{{ g.name }}</div>
          <button
            v-for="t in g.items"
            :key="t.id"
            class="tab"
            role="tab"
            :aria-selected="active === t.id ? 'true' : 'false'"
            @click="navigate(t.id)"
          >{{ t.label }}</button>
        </template>
      </div>

      <div class="navfoot">
        <button class="phosphor-btn" @click="togglePhosphor" aria-label="toggle phosphor color">◉ phosphor</button>
        <a href="https://weakpass.com" target="_blank" rel="noopener">weakpass.com ↗</a>
        <a href="https://github.com/zzzteph/weakpass" target="_blank" rel="noopener">github ↗</a>
      </div>
    </nav>

    <main class="main">
      <div class="main-inner">
        <keep-alive>
          <component :is="activeTool.comp" />
        </keep-alive>
      </div>
    </main>
  </div>
</template>
