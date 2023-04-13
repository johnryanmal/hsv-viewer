import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({ baseURL: 'https://api.color.pizza' })

export default defineStore('counter', () => {
  const memo = ref({})

  function get(query, process) {
    if (query in memo.value) {
      return memo.value[query]
    }

    return api.get(query)
      .then(process)
      .then((result) => {
        memo.value[query] = result
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function getList(name='') {
    const processColors = (response) => {
      const colors = response.data.colors.sort()

      let result = new Map() // use map to maintain insertion order (sorted)
      for (const {name, ...data} of colors) {
        result.set(name, data)
      }
      return result
    }

    return get(`/v1/?list=${name}`, processColors)
  }

  return { getList }
})
