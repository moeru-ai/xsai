<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{ to: string }>()
onMounted(() => {
  window.location.replace(props.to + window.location.search + window.location.hash)
})
</script>

<template>
  <main class="legacy-redirect">
    <h1>This page moved to the v0 archive</h1>
    <p><a :href="to" target="_self">Open the archived page</a>.</p>
  </main>
</template>

<style scoped>
.legacy-redirect { max-width: 48rem; margin: 4rem auto; padding: 1rem; }
</style>
