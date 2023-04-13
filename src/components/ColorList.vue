<script setup>
import { computed } from 'vue'
import useColorStore from '@/stores/color.js'

const store = useColorStore()
const colors = computed(() => store.getList('bestOf'))
</script>

<template>
	<template v-for="[name, data], index in colors" :key="name">
		<p>
			{{ name }}
		</p>
	</template>
</template>
