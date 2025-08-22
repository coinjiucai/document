import store from "@/store";
import checkPermission from "@/utils/checkPermission";

const hasPermission = {
  install(Vue, options) {
    Vue.directive('has', {
      inserted: (el, binding, vnode) => {
        filterGlobalPermission(el, binding, vnode);
      }
    });
  }
};

/**
 * 全局权限控制
 */
export function filterGlobalPermission(el, binding, vnode) {
  //当前按钮具备的权限信息，它可以是一个授权的标识如（'depart:add'），
  //也可以是多个标识组合的逻辑运算表达式如（'depart:add&&(depart:edit||!depart:delete)'）
  //只要有一个授权标识失效就退出授权判断
  //逻辑必须严谨有效，否则可能导致报错！
  const flagStr = binding.value
  //校验函数
  const finalPermission = checkPermission(flagStr);
  if (!finalPermission) {
    el.parentNode.removeChild(el);
  }
}

export default hasPermission;
