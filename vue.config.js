module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.resolve.extensions.add('.yml').add('.yaml')
    config.module
      .rule('yaml')
      .test(/\.ya?ml?$/)
      .use('yaml-loader')
      .loader('yaml-loader')
      .end()
  },
};
