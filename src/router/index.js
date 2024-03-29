import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/post',
    //   name: 'post',
    //   component: PostView
    // },
    // {
    //   path: '/image',
    //   name: 'image',
    //   component: ImageView
    // }
  ]
})

export default router
