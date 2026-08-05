import { ref } from 'vue'

// Hashes handed from the Extract tab to the Crack tab (one per line).
export const crackPrefill = ref('')

// A workflow id to auto-run when the Crack tab activates (set from the Workflows tab).
export const crackRunWorkflow = ref('')

// Saved cracking workflows (chained attacks), persisted in localStorage.
const KEY = 'wp_workflows'
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch (e) { return [] }
}
export const workflows = ref(load())
export function saveWorkflows() {
  try { localStorage.setItem(KEY, JSON.stringify(workflows.value)) } catch (e) { /* ignore quota */ }
}
