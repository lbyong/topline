import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 给登录页面配置路由文件   @ src的绝对路径地址
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  // 配置首页路由
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home')
  },
]

const router = new VueRouter({
  routes
})

// 设置全局守卫进行非登录限制
router.beforeEach((to, from, next) => {
  // 获取用户的存储信息
  let userinfo = sessionStorage.getItem('userinfo')
  // 判断用户是否登录或者访问非登录页面
  if(!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
