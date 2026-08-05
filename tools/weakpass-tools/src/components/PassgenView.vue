<script setup>
import { ref, watch, onMounted } from 'vue'
import { applyRule } from 'hashcat-rules-js'
import { passgenRuleSets } from '../data/passgenRules.js'

const inputData = ref('')
const rulesData = ref(passgenRuleSets.default)
const filterLength = ref(false)
const filterSpecial = ref(false)
const filterNumber = ref(false)
const showRules = ref(true)
const results = ref('')
const count = ref(0)

const isMobile = () => /android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '')

function filterValue(str) {
  const special = /[^a-zA-Z0-9]/
  const number = /[0-9]/
  if (filterLength.value && str.length < 8) return false
  if (filterNumber.value && !number.test(str)) return false
  if (filterSpecial.value && !special.test(str)) return false
  return true
}

const generate = () => {
  const data = inputData.value.split(/[\s,]+/).filter((v, i, a) => a.indexOf(v) === i && (v === '0' || v))
  const rules = rulesData.value.split(/\n/).filter((v, i, a) => a.indexOf(v) === i && (v === '0' || v))
  const list = new Set()
  for (const string of data) {
    for (const rule of rules) {
      const r = applyRule(string, rule)
      if (r !== false) {
        if (filterValue(r) === false) continue
        list.add(r)
      }
    }
  }
  results.value = Array.from(list).join('\n')
  count.value = list.size
}

function refilter() {
  if (!results.value) return
  const rows = results.value.split(/\n/).filter((v, i, a) => a.indexOf(v) === i && (v === '0' || v))
  const list = new Set()
  for (const s of rows) { if (filterValue(s)) list.add(s) }
  results.value = Array.from(list).join('\n')
  count.value = list.size
}
watch([filterLength, filterSpecial, filterNumber], refilter)

function setRules(type) { rulesData.value = passgenRuleSets[type] || passgenRuleSets.default }

function downloadResults() {
  const blob = new Blob([results.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'generated_wordlist.txt'
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(() => { showRules.value = !isMobile() })
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./passgen</span> — wordlist generator</h2>
    <p class="psub">
      Generate a targeted wordlist from your keywords using
      <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank" rel="noopener">hashcat rules</a>.
      e.g. <b>Acme.corp</b> → <b>Acme.corp2026!</b>, <b>Acme.corp123</b>, … — all client-side.
    </p>

    <div class="field-block">
      <label class="blocklabel">words <span class="hint">— separated by comma, whitespace or newline</span></label>
      <textarea v-model="inputData" rows="3" placeholder="Put words of interest here…"></textarea>
    </div>

    <div class="controls">
      <label class="field"><input type="checkbox" v-model="showRules"> show rules</label>
      <label class="field"><input type="checkbox" v-model="filterLength"> length &gt; 8</label>
      <label class="field"><input type="checkbox" v-model="filterSpecial"> has special</label>
      <label class="field"><input type="checkbox" v-model="filterNumber"> has numbers</label>
    </div>

    <div class="controls">
      <button class="btn" @click="generate">generate</button>
      <button v-if="results.trim().length > 0" class="btn ghost" @click="downloadResults">download</button>
      <span class="hint" v-if="count"><b>{{ count }}</b> generated</span>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:14px">
      <div style="flex:1 1 320px;min-width:0">
        <label class="blocklabel">result</label>
        <textarea v-model="results" rows="16" spellcheck="false"></textarea>
      </div>
      <div v-if="showRules" style="flex:1 1 320px;min-width:0">
        <label class="blocklabel">rules</label>
        <div class="controls" style="margin-bottom:8px">
          <button class="btn ghost sm" @click="setRules('default')">online</button>
          <button class="btn ghost sm" @click="setRules('nsa64')">nsa64</button>
          <button class="btn ghost sm" @click="setRules('hobo')">hob064</button>
          <button class="btn ghost sm" @click="setRules('top500')">top 500</button>
          <button class="btn ghost sm" @click="setRules('best64')">best64</button>
        </div>
        <textarea v-model="rulesData" rows="14" spellcheck="false" placeholder="Rules"></textarea>
      </div>
    </div>
  </div>
</template>
