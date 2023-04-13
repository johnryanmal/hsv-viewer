<script setup>
import { RouterLink } from 'vue-router'
import { toRefs } from 'vue'

const props = defineProps({
  routes: Array
})

const { routes } = toRefs(props)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <RouterLink to="/" custom v-slot="{ href, navigate }">
        <a
          class="navbar-brand"
          :href="href"
          @click="navigate"
        >
          Colors
        </a>
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li v-for="(route, index) in routes" class="nav-item" :key="index">
            <RouterLink :to="{name: route.to}" custom v-slot="{ isActive, href, navigate }">
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
