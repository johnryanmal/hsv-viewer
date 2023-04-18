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
    <table class="table table-borderless table-dark align-middle table-striped">
      <thead>
        <tr class="border-bottom">
          <template :key="name" v-for="span, name in {
            'General': 3,
            'Values': 6,
            'CSS': 2
          }">
            <th scope="colgroup" :colspan="span">{{ name }}</th>
          </template>
        </tr>
        <tr>
          <template :key="name" v-for="name in [
            'Color', 'Name', 'Hex',
            'Red', 'Green', 'Blue', 'Hue', 'Satuation', 'Lightness',
            'RGB', 'HSL'
          ]">
            <th scope="col">
              {{ name }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template :key="name" v-for="[name, color] in colors">
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
            <template :key="index" v-for="data, index in [
              color.hex,
              color.rgb.r, color.rgb.g, color.rgb.b, color.hsl.h, color.hsl.s, color.hsl.l,
              toRGB(color), toHSL(color)
            ]">
              <td :class="{ 'text-center': typeof data === 'number'}">
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