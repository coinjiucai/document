import store from "@/store";

function checkPermission(flagStr) {
  const ruleReg = /([!()])|(&&)|(\|\|)/g
  //当前权限信息不存在则不通过权限进行控制，返回true
  if (!flagStr) return true;
  //根据'&&'、'||'、'!'、'('、')'将单个授权标识或表达式拆分成表达式数组
  const ruleArr = flagStr.split(ruleReg).filter(Boolean)
  //提取授权标识信息与所处位置
  const buttonFlag = ruleArr.map((item, index) => {
    // 别拿上面的ruleReg到这边用，上面的正则带'g'，多次判断会出问题。
    if (/([!()])|(&&)|(\|\|)/.test(item)) return false;
    else return {
      value: item,
      index: index
    }
  }).filter(Boolean)
  //获取全部的按钮权限列表和当前用户所具备的按钮权限列表
  let allAuthList = store.getters.allAuth
  let authList = store.getters.userAuth
  let allPermissionList = allAuthList?.filter(i => i.type === '1') || [];
  let permissionList = authList?.filter(i => i.type === '1') || [];
  //当前用户不具备任何按钮权限时为false
  if (!permissionList || permissionList.length <= 0) return false;
  let permissions = [];
  for (let item of permissionList) {
    //type:权限策略1控制显示2控制禁用
    //action可存放合并的权限，如：'depart:edit,depart:add'，可以同时控制 'depart:edit' 和 'depart:add' 的权限
    if (item.type === '1' && item.action) {
      //将合并的权限拆分出来
      if (item.action.includes(",")) {
        let split = item.action.split(",")
        for (let i = 0; i < split.length; i++) {
          if (!split[i] || split[i].length === 0) {
            continue;
          }
          permissions.push(split[i]);
        }
      } else {
        permissions.push(item.action);
      }
    }
  }
  buttonFlag.map(item => {
    //判断按钮的权限是否存在，并返回Boolean值的字符串，并返回给表达式数组
    let result = false;
    if (allPermissionList && allPermissionList.length > 0) {
      //确保按钮权限在全部权限列表中能找到对应的信息
      const detail = allPermissionList.find(i => i.action === item.value);
      //status判断按钮权限是否有效(0-无效、1-有效)
      if (detail && detail.status === '1') {
        result = permissions.includes(item.value)
      } else if (detail && detail.status === '0') {
        //若按钮权限失效，则当前条件判断为真
        result = true;
      }
    }
    ruleArr[item.index] = result.toString();
  })
  let finalPermission = false
  try {
    //将表达式数组重新组合成字符串，效果如：'false&&(true||false)'，然后eval执行表达式并返回最终结果
    finalPermission = eval(ruleArr.join(''))
  } catch (e) {
    //若表达式执行出错，则表达式为false，就会不显示按钮
    console.log(e);
  }
  return finalPermission;
}

export default checkPermission;
