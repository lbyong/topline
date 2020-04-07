module.exports = {

  lintOnSave: false,
  devServer: {
    open: true,
    port: 8787
  },
  // 配置externals外部优化处理
  configureWebpack: config => {
    config.externals = {
      // 模块名：变量名
      vue: 'Vue',
      axios: 'axios',
      'vue-router': 'VueRouter',
      echarts: 'echarts',
      nprogress: 'NProgress'
    }
  }
}
