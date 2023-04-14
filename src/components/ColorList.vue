<script setup>
import { computed } from 'vue'
import useColorStore from '@/stores/color.js'

const store = useColorStore()
const colors = computed(() => store.getList('bestOf'))

//https://www.w3.org/TR/WCAG20/#contrast-ratiodef
//calculates contrast ratio given the luminance of two colors where l1 > l2
function contrastWCAG(l1, l2) {
	return (l1 + 0.05) / (l2 + 0.05)
}

function contrast(colorA, colorB) {
	const lA = colorA.luminanceWCAG
	const lB = colorB.luminanceWCAG
	return lA > lB ? contrastWCAG(lA, lB) : contrastWCAG(lB, lA)
}

const white = computed(() => colors.value.get('White'))
const black = computed(() => colors.value.get('Black'))

function textColor(color) {
	if (contrast(color, white.value) > contrast(color, black.value)) {
		return white.value
	} else {
		return black.value
	}
}
</script>

<template>
	<template v-for="[name, color] in colors" :key="name">
		<p :style="{ 'backgroundColor': color.hex, 'color': textColor(color).hex }">
			{{ name }}
		</p>
	</template>
</template>
