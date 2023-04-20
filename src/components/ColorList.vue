<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useColorStore } from '@/stores/color.js'
import VirtualScroller from '@/components/VirtualScroller.vue'

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

const rem = ref(parseInt(window.getComputedStyle(document.body).fontSize))
const vw = ref(window.innerWidth / 100)
const rowHeight = computed(() => 3.5*rem.value + 1*vw.value)

const innerHeight = ref(window.innerHeight)

const scroller = ref(null)
const top = ref(null)

function onResize() {
  innerHeight.value = window.innerHeight
}

function onScroll() {
  rem.value = parseInt(window.getComputedStyle(document.body).fontSize)
  vw.value = window.innerWidth / 100
  top.value = scroller.value.getBoundingClientRect().top
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="table-responsive">
    <table class="table table-borderless table-dark align-middle table-striped overflow-hidden">
      <thead>
        <tr class="border-bottom">
          <template :key="name" v-for="span, name in {
            'General': 3,
            'Values': 6,
            'CSS': 2
          }">
            <th scope="colgroup" :colspan="span"><h5>{{ name }}</h5></th>
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
      <tbody ref="scroller" :style="{ 'height': Math.round(rowHeight * colors.size)+'px'}">
        <VirtualScroller
          v-if="colors.entries"
          :item-list="Array.from(colors.entries())"
          :item-height="rowHeight"
          :item-cluster="2"
          :view-height="innerHeight"
          :view-scroll="-top"
          :view-buffer="0"
        >
          <template #default="{item: [name, color], top} " :key="name">
            <tr :style="{ 'transform': `translateY(${top}px)`, 'height': Math.round(rowHeight)+'px'}">
              <th scope="row" class="m-0">
                <div class="d-flex align-items-center justify-content-center" :style="{ 'width': '2.5rem', 'height': '2.5rem', 'backgroundColor': color.hex }">
                  <p class="m-auto" :style="{ 'color': textColor(color).hex } ">Aa</p>
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
        </VirtualScroller>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  th, td {
    height: calc(3.5rem + 1vw);
    padding: calc(0.5rem + 0.5vw);
    white-space: nowrap;
  }
</style>