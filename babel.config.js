module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 设置按需引入配置项
  plugins: [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]
}
