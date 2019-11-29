import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入nprogress进度条文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 解决同页面点击报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  // 给登录页面配置路由文件   @ src的绝对路径地址
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: '',
    redirect:'/home', // 给首页子组件配置重定向显示内容
    component: () => import('@/views/home')
  },
  // 配置首页路由
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect:'/welcome', // 给首页子组件配置重定向显示内容
      // 给首页配置相关子路由
      children:[
        { 
          path: '/welcome',
          name: 'welcomre',
          component: () => import('@/views/welcome')
        },
        { // 文章列表子路由
          path: '/article',
          name: 'article',
          component: () => import('@/views/article')
        },
        { // 发布文章子路由
          path: '/articleadd',
          name: 'articleadd',
          component: () => import('@/views/articleadd/articleadd.vue')
        },
        { // 修改文章子路由，通过id获取相关内容
          path: '/articleedit/:id',
          name: 'articleedit',
          component: () => import('@/views/articleedit/articleedit.vue')
        },
        { // 账户信息子路由
          path: '/account',
          name: 'account',
          component: () => import('@/views/account/account.vue')
        },
        { // 素材管理子路由
          path: '/material',
          name: 'material',
          component: () => import('@/views/material/material.vue')
        },
        { // 粉丝管理子路由
          path: '/fans',
          name: 'fans',
          component: () => import('@/views/fans/fans.vue')
        },
      ]
  },


]

const router = new VueRouter({
  routes
})

// 设置全局守卫进行非登录限制
router.beforeEach((to, from, next) => {
  NProgress.inc()  // 开启进度条
  // 获取用户的存储信息
  let userinfo = sessionStorage.getItem('userinfo')
  // 判断用户是否登录或者访问非登录页面
  if(!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})

// 设置路由后置守卫， 结束进度条
router.afterEach((to, from) => {
  NProgress.done()
})



export default router

