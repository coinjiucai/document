module.exports = {
  '/mlf2024': {
    target: 'http://192.168.1.188:30008',
    ws: false,
    changeOrigin: true
    // pathRewrite: {
    //   '^/mlf2024': ''
    // }
  },
  '/jody': {
    target: 'http://10.0.3.94:9098/',
    ws: false,
    changeOrigin: true,
    pathRewrite: {
      '^/jody': ''
    }
  }
};
