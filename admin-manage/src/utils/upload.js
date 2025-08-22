/**
 * 文件格式化显示
 * @param {数组} list
 */
const formatter = function (list) {
  if (list.length > 0) {
    return list.map((v) => v.name).join(",");
  }
  return "--";
};
module.exports = {
  formatter,
};
