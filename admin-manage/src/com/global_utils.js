/*
* 在此处存放系统业务的公共方法
* */
const baseConfig = require('../../config/baseConfig.js')

class Global_utils {
  /**
   * 获取后端地址
   * @returns {string}
   */
  static getBaseConfig() {
    return baseConfig.activeServer.domain
  }

  /**
   * 文件下载
   * @param url
   */
  static downloadFile(url) {
    const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
    a.href = url;
    a.click()
    a.remove()
  }
}

export default Global_utils
