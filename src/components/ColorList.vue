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

function copy(text) {
  navigator.clipboard.writeText(text)
}

function listed(...args) {
  return args.join(', ')
}

function toRGB(color) {
  const { r, g, b } = color.rgb
  return `rgb(${listed(r, g, b)})`
}

function toHSL(color) {
  const { h, s, l } = color.hsl
  return `hsl(${listed(h, s, l)})`
}
</script>

<template>
  <div class="table-responsive">
    <table class="table table-dark table-borderless align-middle table-striped">
      <thead>
        <tr>
          <template v-for="name in ['Color', 'Name', 'Hex', 'RGB', 'HSL']" :key="name">
            <th scope="col">
              {{ name }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="[name, color] in colors" :key="name">
          <tr>
            <th scope="row">
              <div class="d-flex align-items-center justify-content-center" :style="{ 'width': '2.5em', 'height': '2.5em', 'backgroundColor': color.hex }">
                <p class="m-0" :style="{ 'color': textColor(color).hex } ">Aa</p>
              </div>
            </th>
            <td>
              <p class="m-0">
                {{ name }}
              </p>
            </td>
            <template v-for="data in [color.hex, toRGB(color), toHSL(color)]">
              <td>
                <a href="#" @click.prevent="copy(data)">{{ data }}</a>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  th, td {
    padding: calc(0.5rem + 0.5vw);
    white-space: nowrap;
  }
</style>