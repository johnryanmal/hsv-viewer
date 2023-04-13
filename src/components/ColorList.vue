<script setup>
import { computed } from 'vue'
import useColorStore from '@/stores/color.js'

const store = useColorStore()
const colors = computed(() => store.getList('bestOf'))
</script>

<template>
	<template v-for="[name, data] in colors" :key="name">
		<p :style="{ backgroundColor: data.hex, color: data.luminanceWCAG > 0.5 ? 'black' : 'white' }">
			{{ name }}
		</p>
	</template>
</template>
