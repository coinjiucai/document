import systemLocalConfig from "@/utils/systemLocalConfig";
//主题样式切换控件
const PROJECT_DOM = document.documentElement
const PROJECT_CLASS_LIST = PROJECT_DOM.classList
//不同主题对应的样式名
const THEME_CLASS_NAMES = {
  darkBlue: '__theme_dark_blue',
  dark: '__theme_dark',
  light: '__theme_light'
}
//当前浏览器的主题
const BROWSER_THEME = window.matchMedia('(prefers-color-scheme:dark)');

/**
 * 更换当前主题为用户的主题
 * @param _theme 要跟换的主题，默认不传获取配置的
 */
const setUserTheme = function (_theme = null) {
  // 如果当前系统没有主题则默认主题为‘light’
  // let _currentTheme = systemLocalConfig?.systemTheme || 'darkBlue'
  let _currentTheme = 'darkBlue'
  //如果和当前系统的主题一致，那就不需要更换主题
  if (_theme === _currentTheme) return
  //传入theme则根据theme更改主题
  else if (_theme) _currentTheme = _theme;

  if (_currentTheme === "followSystem") setHtmlProjectByBrowser()
  else setHtmlProject(_currentTheme);
  systemLocalConfig.systemTheme = _currentTheme;
}

/**
 * 设置系统主题
 * @param _themeName 主题名称
 */
const setHtmlProject = function (_themeName) {
  let _project = THEME_CLASS_NAMES[_themeName]
  if (typeof _project === "string") {
    _project = _project.split(" ")
  }
  let {
    _needAdd,
    _needDel,
  } = filterHtmlProject(_project)
  addHtmlProject(_needAdd)
  delHtmlProject(_needDel)
}
/**
 * 与浏览器主题保持一致
 * 目前仅在windows系统中得到验证
 */
const setHtmlProjectByBrowser = function () {
  if (BROWSER_THEME) {
    const _themeName = BROWSER_THEME.matches ? 'dark' : 'light'
    setHtmlProject(_themeName)
    //这边设置监听事件，当浏览器的主题发生变更时让本系统跟随变更
    BROWSER_THEME.addEventListener('change', setHtmlProjectByBrowser)
  }
}
/**
 * 过滤出真正需要添加或删除的类
 * @param _project
 * @returns {{_needDel: String[], _needAdd: string[]}}
 */
const filterHtmlProject = function (_project) {
  if (typeof _project == "string") {
    _project = _project.split(" ")
  }
  let _htmlProject = Array.from(PROJECT_CLASS_LIST) //已有类
  let _needDel = []
  let _needAdd = Array.from(_project) //新set的类

  _htmlProject.forEach((hv) => { // 遍历已有的
    let addIndex = _needAdd.findIndex((pv) => {
      return pv === hv
    })
    if (addIndex >= 0) {//已经有的
      _needAdd.splice(addIndex, 1) //不需要添加
    } else {
      _needDel.push(hv) //需要删除
    }
  })
  return { _needAdd, _needDel }
}
/**
 * 往Dom的类列表中添加类
 * @param _project
 */
const addHtmlProject = function (_project) {
  if (typeof _project == "string") {
    _project = _project.split(" ")
  }
  _project = _project.filter(v => v)
  _project.length && PROJECT_CLASS_LIST.add(..._project)
}
/**
 * 从Dom的类列表中删除类
 * @param _project
 */
const delHtmlProject = function (_project) {
  if (typeof _project == "string") {
    _project = _project.split(" ")
  }
  _project = _project.filter(v => v)
  _project.length && PROJECT_CLASS_LIST.remove(..._project)
}

export {
  setUserTheme,
  BROWSER_THEME
}
