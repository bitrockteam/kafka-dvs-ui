module.exports = {
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  },
};