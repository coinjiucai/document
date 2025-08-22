import {JSEncrypt} from 'jsencrypt'

export default {
  /**
   * 加密方法
   * @param pas
   * @param publicKey
   * @returns {string | false}
   */
  encrypt(pas, publicKey) {
    // 如果获取的key为空或者获取失败则不加密
    if (publicKey && publicKey.length) {
      //实例化jsEncrypt对象
      let jse = new JSEncrypt();
      //设置公钥
      jse.setPublicKey(publicKey);
      return jse.encrypt(pas);
    } else {
      return pas;
    }
  },
  /**
   * 解密方法
   * @param pas
   * @param privateKey
   * @returns {string | false}
   */
  decrypt(pas, privateKey) {
    let jse = new JSEncrypt();
    // 私钥
    jse.setPrivateKey(privateKey)
    return jse.decrypt(pas);
  },
}
