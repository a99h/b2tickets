module.exports = {
  // https://cli.vuejs.org/config/#productionsourcemap
  productionSourceMap: false,

  // https://cli.vuejs.org/config/#css-extract
  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: {
        prependData: '@import \'~@/assets/scss/vuetify/variables\''
      },
      scss: {
        prependData: '@import \'~@/assets/scss/vuetify/variables\';'
      }
    }
  },

  chainWebpack: (config) => {
    // Remove the following lines to add Vue Prefetch and Preload on index.html
    // https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugin('html')
      .tap((args) => {
        args[0].title = 'B2Tickets'

        return args
      })
  },

  // https://cli.vuejs.org/config/#transpiledependencies
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
    'vuetify'
  ]
}
