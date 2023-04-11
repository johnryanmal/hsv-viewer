<script>
import axios from 'axios'

axios.get('https://api.color.pizza/v1/?list=bestOf')
.then((res) => {
  let colors = res.data.colors
  let colorMap = {}
  for (const {name, ...data} of colors) {
    colorMap[name] = {...data}
  }
  console.log(colorMap)
}).catch((err) => {
  console.error(err)
})
</script>

<template>
  <div class="colors">
    <h1>Colors</h1>
    <p>View colors from a handpicked list. Powered by <a href="https://github.com/meodai/color-name-api">color-name-api</a>.</p>
  </div>
</template>
