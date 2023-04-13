const view = (file) => () => import(`@/views/${file}.vue`)

export default [
  {
    path: '/',
    name: 'colors',
    component: view('Colors')
  },
  {
    path: '/home',
    name: 'home',
    component: view('Home')
  }
]
