<script setup>
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'
import reverse from 'hashcat-reverse-rules-js'
import hashcatEngine from 'hashcat-rules-js'
import { reverseRuleSet } from '../data/passcheckRules.js'

const API_URL = 'https://weakpass.com/api/v1/range/'
const rulesLines = reverseRuleSet.split('\n')

const password = ref('')
const isHide = ref(true)
const isProcessing = ref(false)
const progress = ref(0)
const progressMessage = ref('')
const currentProgress = ref(0)
const showReport = ref(0)
const revealed = ref(new Map())
const allInOneSize = 267

async function lookupMD5(pass) {
  const hash = CryptoJS.MD5(pass).toString()
  try {
    const resp = await fetch(`${API_URL}${hash.substring(0, 6)}.json?type=md5&filter=hash`)
    const data = await resp.json()
    for (const item of data) if (item && item.hash === hash) return true
  } catch (e) {
    console.error('lookup', e)
  }
  return false
}

async function handleLookup() {
  const candidates = new Map()
  revealed.value = new Map()
  currentProgress.value = 0
  showReport.value = 0
  if (password.value.length === 0) return
  isProcessing.value = true
  progress.value = 0
  const seenRules = new Set()
  const seenPasswords = new Set()

  const rev = reverse.reversePassword(password.value, true)
  for (const [key, value] of rev) {
    if (hashcatEngine.applyRule(key, value) !== password.value) continue
    candidates.set(key, value)
  }
  for (const ruleEntry of rulesLines) {
    if (!ruleEntry.trim()) continue
    const entries = reverse.applyReverseRule(password.value, ruleEntry)
    for (const entry of entries) {
      if (!candidates.has(entry)) {
        if (hashcatEngine.applyRule(entry, ruleEntry) !== password.value) continue
        candidates.set(entry, ruleEntry)
      }
    }
  }

  if (await lookupMD5(password.value)) {
    revealed.value.set(password.value, 'plain')
    showReport.value = 1
  }

  for (const [key, value] of candidates.entries()) {
    currentProgress.value++
    progressMessage.value = isHide.value
      ? `***** — ${value} (${currentProgress.value} of ${candidates.size})`
      : `${key} — ${value} (${currentProgress.value} of ${candidates.size})`
    progress.value = Math.round((currentProgress.value / candidates.size) * 100)
    if (seenPasswords.has(key) || seenRules.has(value)) continue
    if (!(await lookupMD5(key))) continue
    if (showReport.value === 1) showReport.value = 2
    if (showReport.value === 0) showReport.value = 3
    seenRules.add(value)
    seenPasswords.add(key)
    revealed.value.set(key, value)
  }

  isProcessing.value = false
  if (showReport.value === 0) showReport.value = 4
}

const humanReadable = computed(() => {
  const num = allInOneSize * 100_000_000 * currentProgress.value
  const f = (n, w) => (Number.isInteger(n) ? `${n} ${w}` : `${n.toFixed(1)} ${w}`)
  if (num >= 1e15) return f(num / 1e15, 'quadrillion')
  if (num >= 1e12) return f(num / 1e12, 'trillion')
  if (num >= 1e9) return f(num / 1e9, 'billion')
  if (num >= 1e6) return f(num / 1e6, 'million')
  if (num >= 1e3) return f(num / 1e3, 'thousand')
  return String(num)
})
</script>

<template>
  <div>
    <h2 class="ptitle"><span class="cmd">./passcheck</span> — has your password been compromised?</h2>
    <p class="psub">
      Check whether your password is in the <a href="https://weakpass.com/all_in_one" target="_blank" rel="noopener">all_in_one</a>
      wordlist (27B passwords) <b>or</b> reachable by a
      <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank" rel="noopener">rule-based</a> attack.
      Runs client-side — your password is never sent.
    </p>

    <div class="controls">
      <button class="btn ghost" @click="isHide = !isHide">{{ isHide ? 'reveal' : 'hide' }}</button>
      <input :type="isHide ? 'password' : 'text'" v-model="password" placeholder="password"
             style="flex:1 1 220px" @keydown.enter="handleLookup" />
      <button class="btn" @click="handleLookup" :disabled="isProcessing">{{ isProcessing ? 'checking…' : 'check' }}</button>
    </div>

    <div class="progress" :class="{ on: isProcessing }"><i :style="{ width: progress + '%' }"></i></div>
    <div class="statusline" v-if="isProcessing">{{ progressMessage }}</div>

    <div class="report bad" v-if="showReport === 1">
      This password is in the weakpass wordlist. <b>Change it immediately.</b>
      <div class="em">Checked across {{ humanReadable }} passwords.</div>
    </div>
    <div class="report bad" v-if="showReport === 2">
      In the wordlist <b>and</b> {{ revealed.size }} rule(s) can reach it. <b>Change it immediately.</b>
      <div class="em">Checked across {{ humanReadable }} passwords.</div>
    </div>
    <div class="report warn" v-if="showReport === 3">
      Not in the wordlist, but <b>{{ revealed.size }}</b> common hashcat rule(s) could crack it. Recommended to change.
      <div class="em">Checked across {{ humanReadable }} passwords.</div>
    </div>
    <div class="report good" v-if="showReport === 4">
      This password is <b>strong</b> — not in the wordlist and not reachable by common hashcat rules.
      <div class="em">Checked across {{ humanReadable }} passwords.</div>
    </div>

    <div class="tblwrap mt" v-if="revealed.size">
      <table>
        <thead><tr><th></th><th>Password</th><th><a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank" rel="noopener">hashcat rule</a></th></tr></thead>
        <tbody>
          <tr v-for="[key, value] in Array.from(revealed.entries())" :key="key">
            <td class="accent">✓</td>
            <td>{{ isHide ? '******' : key }}</td>
            <td style="color:var(--modecol);white-space:nowrap">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="hint mt">TL;DR — use a password manager (1Password, KeePass) for strong, unique passwords.</p>
  </div>
</template>
