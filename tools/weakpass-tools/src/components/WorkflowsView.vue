<script setup>
import { ref, reactive, inject } from 'vue'
import { workflows, saveWorkflows, crackRunWorkflow } from '../store.js'

const navigate = inject('navigate')
const editing = ref(false)
const draft = reactive({ id: '', name: '', steps: [] })

const CHARSET = { l: 'a-z', u: 'A-Z', d: '0-9', s: 'symbols' }

function newId() { return String(Date.now()) + '-' + Math.floor(Math.random() * 1e6) }
function defaultStep(type) {
  return type === 'brute'
    ? { type: 'brute', charset: { l: true, u: false, d: true, s: false, custom: '' }, min: 1, max: 4 }
    : { type: 'dict', rules: '' }
}
function newWorkflow() { draft.id = newId(); draft.name = ''; draft.steps = [defaultStep('dict')]; editing.value = true }
function editWorkflow(wf) {
  draft.id = wf.id; draft.name = wf.name
  draft.steps = wf.steps.map(s => s.type === 'brute'
    ? { type: 'brute', charset: { ...s.charset }, min: s.min, max: s.max }
    : { type: 'dict', rules: s.rules || '' })
  editing.value = true
}
function addStep(type) { draft.steps.push(defaultStep(type)) }
function removeStep(i) { draft.steps.splice(i, 1) }
function moveStep(i, d) {
  const j = i + d; if (j < 0 || j >= draft.steps.length) return
  const s = draft.steps.splice(i, 1)[0]; draft.steps.splice(j, 0, s)
}
function save() {
  if (!draft.name.trim()) draft.name = 'workflow ' + (workflows.value.length + 1)
  if (!draft.steps.length) return
  const wf = {
    id: draft.id,
    name: draft.name.trim(),
    steps: draft.steps.map(s => s.type === 'brute'
      ? { type: 'brute', charset: { ...s.charset }, min: s.min, max: s.max }
      : { type: 'dict', rules: s.rules || '' })
  }
  const i = workflows.value.findIndex(w => w.id === wf.id)
  if (i >= 0) workflows.value[i] = wf; else workflows.value.push(wf)
  saveWorkflows(); editing.value = false
}
function cancel() { editing.value = false }
function del(wf) {
  if (!confirm(`Delete workflow "${wf.name}"?`)) return
  workflows.value = workflows.value.filter(w => w.id !== wf.id); saveWorkflows()
}
function run(wf) { crackRunWorkflow.value = wf.id; navigate('crack') }

function stepSummary(s) {
  if (s.type === 'brute') {
    const cs = Object.keys(CHARSET).filter(k => s.charset[k]).map(k => CHARSET[k])
    if (s.charset.custom) cs.push('custom')
    return `brute · ${cs.join('+') || '∅'} · len ${s.min}-${s.max}`
  }
  return (s.rules && s.rules.trim()) ? 'wordlist + rules' : 'wordlist'
}
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./workflows</span> — chained attacks</h2>
    <p class="psub">
      Preconfigure a sequence of steps — e.g. <i>quick wordlist → wordlist + rules → bruteforce</i>.
      weakpass runs them in order against your hashes and stops the moment everything is cracked.
      Saved in this browser; run one from the <b>crack</b> tab (its wordlists feed the wordlist steps).
    </p>

    <div class="controls" v-if="!editing">
      <button class="btn" @click="newWorkflow">new workflow</button>
    </div>

    <!-- editor -->
    <div v-if="editing" class="cfgbox">
      <label class="field mb">name
        <input type="text" v-model="draft.name" placeholder="e.g. quick → rules → brute" style="min-width:240px" />
      </label>

      <div v-for="(s, i) in draft.steps" :key="i" class="wf-step">
        <div class="wf-step-head">
          <span class="stepno">{{ i + 1 }}.</span>
          <label class="field">type
            <select v-model="s.type">
              <option value="dict">wordlist</option>
              <option value="brute">bruteforce</option>
            </select>
          </label>
          <span class="sp">
            <button class="btn ghost sm" @click="moveStep(i, -1)" :disabled="i === 0">↑</button>
            <button class="btn ghost sm" @click="moveStep(i, 1)" :disabled="i === draft.steps.length - 1">↓</button>
            <button class="btn ghost sm" @click="removeStep(i)">remove</button>
          </span>
        </div>

        <div v-if="s.type === 'dict'">
          <label class="blocklabel">rules <span class="hint">— one per line; leave empty for a plain wordlist run</span></label>
          <textarea v-model="s.rules" rows="3" spellcheck="false" placeholder=":"></textarea>
        </div>
        <div v-else class="wf-mini">
          <span class="charset-toggles">
            <label class="cs-tog"><input type="checkbox" v-model="s.charset.l" /> a-z</label>
            <label class="cs-tog"><input type="checkbox" v-model="s.charset.u" /> A-Z</label>
            <label class="cs-tog"><input type="checkbox" v-model="s.charset.d" /> 0-9</label>
            <label class="cs-tog"><input type="checkbox" v-model="s.charset.s" /> symbols</label>
          </span>
          <label class="field">custom <input type="text" v-model="s.charset.custom" placeholder="extra chars" style="width:120px" /></label>
          <label class="field">min <input type="number" class="len-in" v-model.number="s.min" min="1" max="12" /></label>
          <label class="field">max <input type="number" class="len-in" v-model.number="s.max" min="1" max="12" /></label>
        </div>
      </div>

      <div class="controls" style="margin-top:6px">
        <button class="btn ghost sm" @click="addStep('dict')">+ wordlist step</button>
        <button class="btn ghost sm" @click="addStep('brute')">+ bruteforce step</button>
      </div>
      <div class="controls" style="margin-top:10px">
        <button class="btn" @click="save">save workflow</button>
        <button class="btn ghost" @click="cancel">cancel</button>
      </div>
    </div>

    <!-- list -->
    <div class="mt" v-if="!editing">
      <div v-if="!workflows.length" class="empty">No workflows yet — create one to preconfigure a chained attack.</div>
      <div v-for="wf in workflows" :key="wf.id" class="wf-card">
        <div class="wf-name">{{ wf.name }}</div>
        <div class="wf-desc">
          <template v-for="(s, i) in wf.steps" :key="i">
            <span class="step-tag">{{ stepSummary(s) }}</span><span v-if="i < wf.steps.length - 1" class="accent"> → </span>
          </template>
        </div>
        <div class="wf-actions">
          <button class="btn sm" @click="run(wf)">run</button>
          <button class="btn ghost sm" @click="editWorkflow(wf)">edit</button>
          <button class="btn ghost sm" @click="del(wf)">delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
