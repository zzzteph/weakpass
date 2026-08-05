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
    <h1 class="title is-4"><span class="wp-mono has-text-link">./passcheck</span> — has your password been compromised?</h1>
    <p class="subtitle is-6">
      Check whether your password is in the <a href="https://weakpass.com/all_in_one" target="_blank" rel="noopener">all_in_one</a>
      wordlist (27B passwords) <b>or</b> could be reached by a
      <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank" rel="noopener">rule-based</a> attack.
      Checks run client-side — your password is never sent.
    </p>

    <form @submit.prevent="handleLookup">
      <div class="field has-addons">
        <div class="control">
          <a class="button is-large" :class="isHide ? 'is-link' : 'is-danger'" @click="isHide = !isHide">
            <span v-if="isHide">&check;</span><span v-else>&cross;</span>
          </a>
        </div>
        <div class="control is-expanded">
          <input class="input is-large" :type="isHide ? 'password' : 'text'" placeholder="password" v-model="password" />
        </div>
        <div class="control">
          <button type="submit" class="button is-link is-large" :class="{ 'is-loading': isProcessing }" :disabled="isProcessing">Check</button>
        </div>
      </div>
    </form>

    <div v-if="isProcessing" class="notification is-info is-light mt-3">
      <label class="label is-small">Progress · {{ progressMessage }}</label>
      <progress class="progress is-link" :value="progress" max="100">{{ progress }}%</progress>
    </div>

    <div class="mt-3">
      <div class="notification is-danger" v-if="showReport === 1">
        This password is in the weakpass wordlist. Change it immediately.
        <br /><i>Checked across <b>{{ humanReadable }}</b> passwords.</i>
      </div>
      <div class="notification is-danger" v-if="showReport === 2">
        This password is in the wordlist <b>and</b> {{ revealed.size }} rule(s) can reach it. Change it immediately.
        <br /><i>Checked across <b>{{ humanReadable }}</b> passwords.</i>
      </div>
      <div class="notification is-warning" v-if="showReport === 3">
        Not in the wordlist, but <b>{{ revealed.size }}</b> common hashcat rule(s) could crack it. Recommended to change.
        <br /><i>Checked across <b>{{ humanReadable }}</b> passwords.</i>
      </div>
      <div class="notification is-success" v-if="showReport === 4">
        This password is <b>strong</b> — not in the wordlist and not reachable by common hashcat rules.
        <br /><i>Checked across <b>{{ humanReadable }}</b> passwords.</i>
      </div>
    </div>

    <div class="table-container wp-scroll mt-3" v-if="revealed.size">
      <table class="table is-fullwidth">
        <thead><tr><th></th><th>Password</th><th><a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank" rel="noopener">Hashcat rule</a></th></tr></thead>
        <tbody>
          <tr v-for="[key, value] in Array.from(revealed.entries())" :key="key">
            <td><span class="has-text-danger">&check;</span></td>
            <td class="wp-mono">{{ isHide ? '******' : key }}</td>
            <td class="wp-mono">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="notification is-link is-light mt-4">
      <b>TL;DR</b> — use a password manager like 1Password or KeePass to create strong, unique passwords.
    </div>
  </div>
</template>
