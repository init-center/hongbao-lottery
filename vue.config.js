module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "罗锦雅迪分享抽红包";
      return args;
    });
  }
};
