module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'common': '@/common',
        'components': '@/components',
        'base': '@/base',
        'router': '@/router'
      }
    }
  },
  devServer: {
    proxy: 'http://localhost:8800'
  },
}