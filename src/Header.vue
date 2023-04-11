<script setup>
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const routes = router.options.routes
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">Colors</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="(route, index) of routes" :key="index">
            <RouterLink :to="route" custom v-slot="{ isActive, href, navigate }">
              <a
                class="nav-link"
                :href="href"
                @click="navigate"
                
                v-bind="
                  (isActive) && {
                    'class': 'active',
                    'aria-current': 'page'
                  }
                "
              >
                {{ route.name }}
              </a>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
