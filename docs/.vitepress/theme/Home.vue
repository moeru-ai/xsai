<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <section class="wrapper bg-[var(--vp-c-bg)] py-14">
    <h1 class="text-center text-[var(--vp-c-text-1)]">
      {{ site.title }}
    </h1>
    <p class="text-center">
      <a href="/getting-started">Get started</a>
    </p>
  </section>
</template>
