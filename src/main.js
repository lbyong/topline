import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局css样式
import '@/assets/css/global.css'

import '@/utils/ax.js'

// 引入、注册Element-ui模块
// import ElenemtUI from 'element-ui'  // 引入
// Vue.use(ElenemtUI)  // 注册

// 引入element.js文件
import '@/utils/element.js'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
