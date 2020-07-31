module.exports = {
  publicPath: process.env.DEPLOY ? '././' : '/',
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: '.'
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
};
