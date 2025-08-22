// see http://vuejs-templates.github.io/webpack for documentation.
// const baseConfig = require("./config/baseConfig.js");
// const getSelectedIP = require("./config/customSeverIP.js");
// const serverIP = getSelectedIP();
// const PROXY_URL = serverIP || baseConfig.activeServer.domain;
const proxySetting = require('./dev.proxy');
const path = require('path');
const resolve = function (dir) {
  return path.join(__dirname, dir);
};

module.exports = {
  // 公共路径(必须有的)==
  publicPath: './',
  // 静态资源存放的文件夹(相对于ouputDir)
  assetsDir: 'static',
  // 环境变量目录==
  outputDir: 'dist',
  // 后端服务
  devServer: {
    // 自动打开浏览器
    open: true,
    port: 8500,
    proxy: proxySetting
  },
  configureWebpack: (config) => {
    config.resolve = {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve('src')
      }
    };
  },
  chainWebpack: (config) => {
    // 路径别名配置
    // 注意，引用别名时如果是html标签和css样式中的路径，则需要在别名前面加符号~
    // 让webstorm识别cli3的路径别名:
    // 在setting -> languages&frameworks -> webpack里"选择"配置文件 node_modules/@vue/cli-service/webpack.config.js即可。
    config.resolve.alias.set('@', resolve('./src'));
    // 添加 Babel 插件
    config.module
      .rule('js')
      .use('babel-loader')
      .tap((options) => {
        // 确保 options 存在
        options = options || {};
        options.plugins = options.plugins || [];

        // 添加需要的插件
        options.plugins.push(
          require.resolve('@babel/plugin-proposal-optional-chaining'),
          require.resolve('@babel/plugin-proposal-nullish-coalescing-operator')
        );

        return options;
      });
  },
  transpileDependencies: ['@zumer/snapdom'] // // 转译所有依赖 transpileDependencies:true
};
