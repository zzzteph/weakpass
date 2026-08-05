<script setup>
import { inject } from 'vue'

const navigate = inject('navigate')
const tools = inject('tools').filter(t => t.id !== 'home')
</script>

<template>
  <div>
    <h1 class="title is-1 wp-mono">weak<span class="has-text-link">·</span>pass <span class="has-text-grey">tools</span></h1>
    <p class="subtitle is-6 mt-2">
      Password &amp; hash cracking tools — <b>100% client-side</b>, nothing uploaded. Pick one:
    </p>

    <div class="columns is-multiline mt-2">
      <div v-for="t in tools" :key="t.id" class="column is-4-desktop is-6-tablet">
        <a class="wp-card" @click="navigate(t.id)">
          <p class="t wp-mono">{{ t.label.toLowerCase() }}</p>
          <p class="d">{{ t.sub }}</p>
        </a>
      </div>
    </div>

    <p class="is-size-7 has-text-grey mt-4">
      weakpass · client-side toolkit ·
      <a href="https://github.com/zzzteph/weakpass" target="_blank" rel="noopener">github.com/zzzteph/weakpass</a>
    </p>
  </div>
</template>
