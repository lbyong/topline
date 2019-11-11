import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局css样式
import '@/assets/css/global.css'

// 引入axios请求模块
import axios from 'axios'

// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios

// 引入、注册Element-ui模块
import ElenemtUI from 'element-ui'  // 引入
Vue.use(ElenemtUI)  // 注册



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
