/*
 
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat',
      name: 'chat',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/chat.vue'),
    },
    {
      path: '/talk',
      name: 'talk',
      component: () => import('../views/talk.vue'),
    },
    {
      path: '/imageTalk',
      name: 'imageTalk',
      component: () => import('../views/imageTalk.vue'),
    },
    {
      path: '/soil',
      name: 'soil',
      component: () => import('../views/soil.vue'),
    }

  ],
})

export default router
