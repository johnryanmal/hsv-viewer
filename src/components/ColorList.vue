<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useColorStore } from '@/stores/color.js'
import VirtualScroller from '@/components/VirtualScroller.vue'
import { Tooltip } from 'bootstrap'

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

function copy(event, text) {
  navigator.clipboard?.writeText(text).then(() => {
    createTooltip(event, 'Copied!', 1000)
  })
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

const rowHeight = ref(calcRowHeight())
const headHeight = computed(() => rowHeight.value * 2)
const bodyHeight = computed(() => rowHeight.value * colors.value.size)
const tableHeight = computed(() => headHeight.value + bodyHeight.value-1000)

const wrapper = ref(null)
const scroller = ref(null)
const outertop = ref(0)
const top = ref(0)

const viewWidth = ref(0)
const viewHeight = ref(0)

const root = ref(null)
const view = ref(null)

function calcRowHeight() {
  const rem = parseInt(window.getComputedStyle(document.body).fontSize)
  const vw = window.innerWidth / 100
  return Math.round(3.5*rem + 1*vw)
}

function calcViewWidth() {
  return Math.round(wrapper.value?.clientWidth - rowHeight.value)
}

function calcViewHeight() {
  return Math.round(wrapper.value?.clientHeight - headHeight.value)
}

function onResize() {
  rowHeight.value = calcRowHeight()
}

function onScroll() {
  outertop.value = wrapper.value.getBoundingClientRect().top
  top.value = scroller.value.getBoundingClientRect().top
}


const currentTooltip = ref(null)

function calcTooltipPadding() {
  return {
    top: outertop.value + headHeight.value,
    left: rowHeight.value
  }
}

function createTooltip(event, title, timeout) {
  clearTooltip()

  const element = event.target
  const tooltip = new Tooltip(element, {
    boundary: view.value,
    container: view.value,
    title,
    placement: 'top',
    fallbackPlacements: ['bottom', 'left', 'right'],
    trigger: 'manual',
    popperConfig(config) {
      const modifiers = Object.fromEntries(config.modifiers.map((modifier) => [modifier.name, modifier]))
      modifiers.flip.options.padding = calcTooltipPadding()
      
      config.modifiers = Object.values(modifiers)
      return config
    }
  })
  tooltip.show()

  if (timeout) {
    //resolves on timeout
    //resolves on resize (hides floating tooltips)
    const waitTimeout = new Promise((resolve, reject) => {
      window.addEventListener('resize', resolve, { once: true })

      setTimeout(() => {
        window.removeEventListener('resize', resolve)
        resolve()
      }, timeout)
    })
    waitTimeout.then(
      () => { tooltip.hide() },
    )
  } else {
    currentTooltip.value = tooltip
  }
}

function destroyTooltip() {
  currentTooltip.value?.hide()
  currentTooltip.value = null
}

function clearTooltip() {
  currentTooltip.value?.dispose()
  currentTooltip.value = null
}

function updateTooltip() {
  currentTooltip.value?.update()
}

const resize = ref(false)
const scroll = ref(false)
const animate = ref(true)
function onFrame() {
  if (resize.value) {
    onResize()
    clearTooltip()
    resize.value = false
  }
  if (scroll.value) {
    onScroll()
    scroll.value = false
  }

  viewWidth.value = calcViewWidth()
  viewHeight.value = calcViewHeight()
  updateTooltip()

  if (animate.value) {
    requestAnimationFrame(onFrame)
  }
}

function queueResize() {
  resize.value = true
}

function queueScroll() {
  scroll.value = true
}

onMounted(() => {
  window.addEventListener('resize', queueResize)
  wrapper.value.addEventListener('scroll', queueScroll)
  requestAnimationFrame(onFrame)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', queueResize)
  wrapper.value.removeEventListener('scroll', queueScroll)
  animate.value = false
})
</script>

<template>
  <div ref="root" class="position-relative">
    <div ref="view" class="pe-none position-absolute bottom-0 end-0" :style="{'width': viewWidth+'px', 'height': viewHeight+'px', 'z-index': 1}"></div>
    <div ref="wrapper" class="table-responsive border-top border-bottom rounded" :style="{ 'height': rowHeight*10+'px'}">
      <table class="table table-borderless table-dark align-middle table-striped" :style="{ 'height': tableHeight+'px' }">
        <thead class="sticky-top" :style="{ 'height': headHeight+'px' }">
          <tr :style="{'height': rowHeight+'px'}">
            <template :key="name" v-for="span, name, index in {
              '': 1,
              'General': 2, // name, hex
              'Values': 6, //r, g, b, h, s, l
              'CSS': 2 // rgb, hsl
            }">
              <th scope="colgroup" class="p-0" v-bind="(index === 0 ? {class: 'position-sticky', style: {'left': 0, 'z-index': 1}} : {})"  :colspan="span">
                <th class="position-sticky" :style="{'left': rowHeight+'px'}">
                  <h5>{{ name }}</h5>
                </th>
              </th>
            </template>
          </tr>
          <tr :style="{'height': rowHeight+'px'}">
            <template :key="name" v-for="width, name, index in {
              // General
              'Color': rowHeight+'px',
              'Name': '250px',
              'Hex': '100%',

              // Values
              'Red': '100%',
              'Green': '100%',
              'Blue': '100%',
              'Hue': '100%',
              'Saturation': '100%',
              'Lightness': '100%',

              // CSS
              'RGB': '100%',
              'HSL': '100%'
            }">
              <th scope="col" :class="(index === 0 ? 'position-sticky' : '')" :style="{ 'left': 0, 'min-width': width }">
                {{ name }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody ref="scroller" :style="{ 'height': bodyHeight+'px' }">
          <VirtualScroller
            v-if="colors.entries"
            :item-list="Array.from(colors.entries())"
            :item-key="([name, color]) => name"
            :item-height="rowHeight"
            :item-cluster="2"
            :view-height="viewHeight"
            :view-scroll="-top"
          >
            <template #default="{ item: [name, color] }">
              <tr :style="{'height': rowHeight+'px'}">
                <th scope="row" class="position-sticky m-0" :style="{'left': 0, 'z-index': 1}">
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
                    <a href="#" @mouseenter="createTooltip($event, 'Copy to Clipboard')" @mouseleave="destroyTooltip" @click.prevent="copy($event, data)">{{ data }}</a>
                  </td>
                </template>
              </tr>
            </template>
          </VirtualScroller>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  th, td {
    height: calc(3.5rem + 1vw);
    padding: calc(0.5rem + 0.5vw);
    white-space: nowrap;
  }
</style>