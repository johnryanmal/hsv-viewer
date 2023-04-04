import './style.scss'
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