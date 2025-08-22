/*对象原型的扩展*/
/**
 * 移除数组某一元素
 * 注意：改方法会在对数组for in的时候跟在索引的后面被遍历出来，
 *      所以不推荐使用，要是使用，那开发者需要约定好使用方式，避免冲突
 * @param callback 回调函数
 * @returns {number}
 */
Object.defineProperty(Array.prototype, "remove", {
  value(callback) {
    const index = this.findIndex(callback);
    if (index > -1) {
      this.splice(index, 1);
    }
    return index;
  },
  enumerable: false,
  writable: true,
  configurable: true
});

