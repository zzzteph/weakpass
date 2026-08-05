<script setup>
import { inject } from 'vue'

const navigate = inject('navigate')
const tools = inject('tools').filter(t => t.id !== 'home')
</script>

<template>
  <div>
    <h1 class="banner">weak<span class="sep">·</span>pass <span class="t">tools</span></h1>
    <p class="tagline">
      Password &amp; hash cracking tools — a <b>wordlist generator</b>, <b>password check</b>,
      <b>hash lookup</b>, and a full <b>client-side crack toolkit</b>.
      No server, nothing uploaded — everything runs in your browser.
    </p>

    <div class="home-links">
      <button v-for="t in tools" :key="t.id" class="home-link" @click="navigate(t.id)">
        <b>{{ t.label }}</b><span>{{ t.sub }}</span>
      </button>
    </div>

    <footer>weakpass tools · 100% client-side · <a href="https://github.com/zzzteph/weakpass" target="_blank" rel="noopener">github.com/zzzteph/weakpass</a></footer>
  </div>
</template>
