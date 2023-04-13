<script setup>
import ColorList from '@/components/ColorList.vue'
</script>

<template>
  <div>
    <h1>Colors</h1>
    <p>View colors from a handpicked list. Powered by <a href="https://github.com/meodai/color-name-api">color-name-api</a>.</p>
  </div>
  <Suspense>
    <template #default>
      <ColorList />
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>
