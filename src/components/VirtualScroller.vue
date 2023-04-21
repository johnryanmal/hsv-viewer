<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  itemKey: { type: Function, required: false, default: JSON.stringify },
  itemList: { type: Array, required: false, default: [] },
  itemHeight: { type: Number, required: false, default: 0 },
  itemCluster: { type: Number, required: false, default: 1 },
  viewScroll: { type: Number, required: false, default: 0 },
  viewHeight: { type: Number, required: false, default: 0 },
  viewBuffer: { type: Number, required: false, default: 1 }
})

const { itemKey, itemList, itemHeight, itemCluster, viewHeight, viewBuffer, viewScroll } = toRefs(props)

const itemCount = computed(() => itemList.value.length)
const itemListHeight = computed(() => itemCount.value * itemHeight.value)
const useScroll = computed(() => 0 < viewHeight.value && viewHeight.value < itemListHeight.value)

const clusterSize = computed(() => Math.max(itemCluster.value, 1))
const clusterHeight = computed(() => clusterSize.value * itemHeight.value)
const viewSize = computed(() => clusterSize.value * Math.ceil( viewHeight.value / clusterHeight.value + 1 ))
const bufferSize = computed(() => clusterSize.value * Math.floor( (viewHeight.value * viewBuffer.value) / clusterHeight.value ))
const renderSize = computed(() => viewSize.value + 2*bufferSize.value)
const renderOffset = computed(() => bufferSize.value)

const viewStart = computed(() => clusterSize.value * Math.floor( viewScroll.value / clusterHeight.value ))
const renderStart = computed(() => viewStart.value - renderOffset.value)

const renderBegin = computed(() => Math.max(renderStart.value, 0))
const renderEnd = computed(() => Math.min(renderStart.value + renderSize.value, itemCount.value))

const renderCount = computed(() => Math.max(renderEnd.value - renderBegin.value, 0))

const renderItems = computed(() => {
  if (useScroll) {
    return itemList.value.slice(renderBegin.value, renderEnd.value)
  }
  return itemList.value
})

const renderBefore = computed(() => Math.min(renderBegin.value, itemCount.value - renderCount.value))
const renderAfter = computed(() => itemCount.value - renderBefore.value - renderCount.value)
const renderTop = computed(() => renderBefore.value * itemHeight.value)
const renderBottom = computed(() => renderAfter.value * itemHeight.value)
</script>

<template>
  <div :style="{ 'height': Math.round(renderTop)+'px' }"></div>
  <slot name="default" v-for="item in renderItems" v-bind="{ item }" :key="itemKey(item)"></slot>
  <div :style="{ 'height': Math.round(renderBottom)+'px' }"></div>
</template>
