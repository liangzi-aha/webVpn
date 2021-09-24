import { createRouter,createWebHistory } from 'vue-router'   //createWebHistory,createWebHashHistory
import adminHome from '../views/adminHome.vue'

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
    path: '/admin',
    name: 'adminHome',
    component: adminHome,
    meta: {
      title: '首页',
      name: "首页",
      admin: true,   // 路由添加admin 属性，在路由拦截时判断当前用户等级是否可访问该路由
    },
    children: [
      // 管理员路由
      {
        path: '/admin',
        name: 'HomePage',
        component: () => import(/* webpackChunkName: "HomePage" */ '../components/HomePage.vue'),
        
        meta: {
          name: "首页/主题",
          path: ['/admin', '/admin'],
          title: '主题',
          admin: true,   // 路由添加admin 属性，在路由拦截时判断当前用户等级是否可访问该路由
        }
      },
      {
        path: '/admin/DomainManagement',
        name: 'DomainManagement',
        component: () => import(/* webpackChunkName: "DomainManagement" */ '../components/DomainManagement.vue'),
        meta: {
          name: "首页/域名管理",
          path: ['/admin', '/admin/DomainManagement'],
          title: '域名管理',
          admin: true,   // 路由添加admin 属性，在路由拦截时判断当前用户等级是否可访问该路由
        },
      },
      {
        path: '/admin/roleManagement',
        name: 'roleManagement',
        component: () => import(/* webpackChunkName: "roleManagement" */ '../components/roleManagement.vue'),
        meta: {
          name: "首页/角色管理",
          path: ['/admin', '/admin/roleManagement'],
          title: '角色管理',
          admin: true,   // 路由添加admin 属性，在路由拦截时判断当前用户等级是否可访问该路由
        },
      },
      {
        path: '/admin/UserManagement',
        name: 'UserManagement',
        component: () => import(/* webpackChunkName: "UserManagement" */ '../components/UserManagement.vue'),
        meta: {
          name: "首页/用户管理",
          path: ['/admin', '/admin/UserManagement'],
          title: '用户管理',
          admin: true,   // 路由添加admin 属性，在路由拦截时判断当前用户等级是否可访问该路由
        },
      },
      {
        path: '/admin/ResultManagement',
        name: 'ResultManagement',
        component: () => import(/* webpackChunkName: "ResultManagement" */ '../components/ResultManagement.vue'),
        meta: {
          name: "首页/资源管理",
          path: ['/admin', '/admin/ResultManagement'],
          title: '资源管理',
          admin: true,   // 路由添加admin 属性，在路由拦截时判断当前用户等级是否可访问该路由
        },
      },

      // 用户路由
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
