import { createRouter,createWebHistory } from 'vue-router'   //createWebHistory,createWebHashHistory

const routes = [
  {
    path:'/',
    name:'Loding',
    component: () => import(/* webpackChunkName: "Loding" */ '../components/Loding.vue'),
    meta:{
      title: '加载页'
    }
  },
  {
    path: '/user',
    name: 'userHome',
    // 路由懒加载，跳转到该路由时进行渲染  webpackChunkName 可以合并多个路由进行加载
    component: () => import(/* webpackChunkName: "userHome" */ '../views/userHome.vue'),
    meta: {
      title: '首页'
    },
    children:[
      {
        path: '/user',
        name: 'userResource',
        // 路由懒加载，跳转到该路由时进行渲染  webpackChunkName 可以合并多个路由进行加载
        component: () => import(/* webpackChunkName: "userResource" */ '../components/userResource.vue'),
        meta: {
          name: '首页/用户资源',
          path: ['/user', '/user'],
          title: '用户资源',
        },
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    // 路由懒加载，跳转到该路由时进行渲染  webpackChunkName 可以合并多个路由进行加载
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      title: '登录页面'
    },
    children: [
      {
        path: '/login',
        name: 'LoginCommon',
        // 路由懒加载，跳转到该路由时进行渲染  webpackChunkName 可以合并多个路由进行加载
        component: () => import(/* webpackChunkName: "login" */ '../components/LoginCommon.vue'),
        meta: {
          title: '登录页面'
        },
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),  //因为vue时单页面应用，所以要根据路由展示不同页面 createWebHistory(使用浏览器历史模式记录路由),createWebHashHistory（使用hash模式记录路由）
  routes
})

export default router
