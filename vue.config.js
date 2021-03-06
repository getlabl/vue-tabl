module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/vue-tabl/',
  outputDir: process.env.NODE_ENV === 'production' ? __dirname + '/lib' : __dirname + '/demo',
  css: {
    extract: false,
  },
}
