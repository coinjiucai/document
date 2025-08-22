// 该工具用于统计出多个自定义特殊组件，可以导出用于下来选择
const requireComponent = require.context('./', true, /\w+\.vue$/);
const componentList = [];
requireComponent.keys().map((fileName) => {
  const comp = requireComponent(fileName).default;
  componentList.push({
    label: comp.cname,
    value: comp.name,
    comp
  });
});
export default componentList;
