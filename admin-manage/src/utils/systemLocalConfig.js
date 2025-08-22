/**
 * 系统本地配置信息
 * @description 用与管理存储在本地localStorage中系统配置信息。
 * @author 赖明浩
 * @date 2023-5-25
 */
class SystemLocalConfig {
  _systemKey = 'base_system_'
  _systemThemeKey = this._systemKey + 'theme';
  _menuCollapseKey = this._systemKey + 'menu_collapse';

  get systemTheme() {
    return window.localStorage.getItem(this._systemThemeKey);
  }

  set systemTheme(theme) {
    window.localStorage.setItem(this._systemThemeKey, theme);
  }

  get menuCollapse() {
    return window.localStorage.getItem(this._menuCollapseKey) === 'true';
  }

  set menuCollapse(isCollapse) {
    return window.localStorage.setItem(this._menuCollapseKey, isCollapse);
  }
}

export default new SystemLocalConfig()
