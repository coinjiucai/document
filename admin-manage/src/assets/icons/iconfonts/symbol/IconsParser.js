/**
 * 图标解析器
 * @description 改解析器用过Node命令执行，可以将当前目录的iconfont文件的所有图标名称解析出来，并存入allIcon文件中
 * @author 赖明浩
 * @date 2023-5-18
 * @version 1.0.0
 */
const fs = require("fs");
const fileList = fs
  .readdirSync(__dirname)
  .map((i) => i.replace(/(.*)\.js/, "$1"))
  .filter((i) => i !== "index" && i !== "IconsParser" && i !== "allIcons");
const iconGroupList = [];
for (let item of fileList) {
  const filePath = `./${item}.js`;
  const data = fs.readFileSync(filePath, "utf8");
  const res = data.replace(/\s/g, "").replace(/.*<svg>(.*)<\/svg>.*/, "$1");
  const icons = res
    .split(/<symbol|<\/symbol>/)
    .filter((s) => s.trim().length > 0)
    .map((i) => i.replace(/id="(.*)"viewBox.*/, "#$1"));
  iconGroupList.push({ name: item, icons: icons });
}
const code = `export default ${JSON.stringify(iconGroupList)}`;
fs.writeFile("./allIcons.js", code, (err) => {
  if (err) throw err;
  console.info("Data written to file!");
});
