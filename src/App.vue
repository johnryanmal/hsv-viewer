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
  <div class="animate-size pt-2 px-2 pt-sm-3 px-sm-3 pt-md-4 px-md-4 pt-xl-5 px-xl-5">
    <RouterView />
  </div>
</template>
