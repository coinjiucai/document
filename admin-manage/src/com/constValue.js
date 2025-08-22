/**
 * 注意：格式请与其它常量统一，包括注释也是一样
 */
export default {
  // 字典类型
  DICTIONARY_TYPE: {
    PROJECT_TYPE: 'project_type',
    USER_TYPE: 'user_type',
    BORROW_TYPE: 'borrow_type',
    PROJECT_STAGE: 'project_stage',
    DEVICE_TYPE: 'device_type',
    DOCUMENT_TYPE: 'document_type',
    PWD_TYPE: 'pad_type'
  },
  // 菜单类型
  MENU_TYPE: {
    // 顶级菜单
    TOP_MENU: 0,
    // 子菜单
    SEC_MENU: 1,
    // 按钮
    BUTTON: 2
  },
  // 按钮权限状态
  BUTTONS_PERMS_STATUS: {
    // 无效
    DISABLE: '0',
    // 有效
    ENABLE: '1'
  },
  // 授权策略
  PERMS_TYPE: {
    // 可见/可访问(授权后可见/可访问)
    SHOW: '1',
    // 可编辑(未授权时禁用)
    DISABLE: '2'
  },
  PROJECT_TYPE: {

  },
  PROJECT_STATUS: {
    REPORT: 0, // 申报
    STAND: 1, // 立项
    EXECUTE: 2, // 实施
    ACCEPT: 3// 验收
  },
  LAYOUT_TYPE: {
    PROJECT: 1, // 项目工作台
    DEVICE: 2, // 设备工作台
    ARCHIVES: 3, // 档案工作台
    PROANDDEV: 4, // 项目和设备工作台
    PROANDARC: 5, // 项目和档案工作台
    DEVANDARC: 6, // 设备和档案工作台
    PROANDDEVANDARC: 7// 全部工作台
  }
};
