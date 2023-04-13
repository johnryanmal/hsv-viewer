<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<template>
  <Header
    :routes="[
      {
        name: 'Home',
        to: 'home'
      }
    ]"
  />
  <div class="container">
    <RouterView />
  </div>
</template>
