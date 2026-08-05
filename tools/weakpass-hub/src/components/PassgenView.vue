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
    <h1 class="title is-4"><span class="wp-mono has-text-link">./passgen</span> — wordlist generator</h1>
    <p class="subtitle is-6">
      Generate a targeted wordlist from your keywords using
      <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank" rel="noopener">hashcat rules</a>.
      e.g. <b>Acme.corp</b> → <b>Acme.corp2026!</b>, <b>Acme.corp123</b>, … — all generated client-side.
    </p>

    <div class="field">
      <label class="label">Words</label>
      <p class="help">Separated by comma, whitespace or newline</p>
      <div class="control">
        <textarea class="textarea" rows="3" v-model="inputData" placeholder="Put words of interest here…"></textarea>
      </div>
    </div>

    <div class="field is-grouped is-grouped-multiline">
      <div class="control"><label class="checkbox"><input type="checkbox" v-model="showRules"> Show rules</label></div>
      <div class="control"><label class="checkbox"><input type="checkbox" v-model="filterLength"> Length &gt; 8</label></div>
      <div class="control"><label class="checkbox"><input type="checkbox" v-model="filterSpecial"> Has special</label></div>
      <div class="control"><label class="checkbox"><input type="checkbox" v-model="filterNumber"> Has numbers</label></div>
    </div>

    <div class="field is-grouped">
      <div class="control"><button class="button is-link" @click="generate">Generate</button></div>
      <div class="control"><button class="button is-success" v-if="results.trim().length > 0" @click="downloadResults">Download</button></div>
    </div>

    <div class="columns">
      <div class="column" :class="showRules ? 'is-6' : 'is-12'">
        <label class="label">Result <span class="tag is-link is-light" v-if="count">{{ count }}</span></label>
        <div class="control">
          <textarea class="textarea wp-mono" v-model="results" rows="18" spellcheck="false"></textarea>
        </div>
      </div>
      <div class="column is-6" v-if="showRules">
        <label class="label">Rules</label>
        <div class="buttons are-small">
          <button class="button is-link is-light" @click="setRules('default')">online</button>
          <button class="button is-link is-light" @click="setRules('nsa64')">nsa64</button>
          <button class="button is-link is-light" @click="setRules('hobo')">hob064</button>
          <button class="button is-link is-light" @click="setRules('top500')">top 500</button>
          <button class="button is-link is-light" @click="setRules('best64')">best64</button>
        </div>
        <div class="control">
          <textarea class="textarea wp-mono" v-model="rulesData" rows="16" spellcheck="false" placeholder="Rules"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
