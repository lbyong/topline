import Vue from 'vue'

// 引入axios请求模块
import axios from 'axios'

// 导入路由文件
import router from '@/router'

// 引入json-bigint
import JSONbig from 'json-bigint'

// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios

// 1 设置请求拦截器
axios.interceptors.request.use((config) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 检测是否存在userinfo存在
  if (userinfo) {
    config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 2 设置响应拦截器（处理401报错问题）
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  console.dir(error)
  // error.response.status  // 报错信息中返回401
  // 判断如果返回401就强制用户登录
  if (error.response.status === 401) {
    router.push('/login') // 需要在上方导入路由文件
  }
  return Promise.reject(error)
})

// 3. 配置数据转换器(处理大数字信息)
axios.defaults.transformResponse = function (data) {
  // console.log(data)
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}
