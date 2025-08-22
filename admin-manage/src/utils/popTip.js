import {MessageBox} from "element-ui";

let instance
export default {
  info(text = "这是一个提示信息", title = null) {
    instance = null
    if (!title) title = '提示'
    instance = MessageBox.alert(text, title, {type: 'info'})
    return instance
  },

  warning(text = "这是一个警告信息", title = null) {
    instance = null
    if (!title) title = '警告'
    instance = MessageBox.alert(text, title, {type: 'warning'})
    return instance
  },
  error(text = "这是一个错误信息", title = null) {
    instance = null
    if (!title) title = '错误'
    instance = MessageBox.alert(text, title, {type: 'error'})
    return instance
  },

  webError(text = "这是一个错误信息", title = null) {
    instance = null
    if (!title) title = '错误#web'
    instance = MessageBox.alert(`系统错误：${text}`, title, {type: 'error'})
    return instance
  },
  success(text, title = null) {
    instance = null
    if (!title) title = '操作成功'
    instance = MessageBox.alert(text, title, {type: 'success'})
    return instance
  },

  failed(text, title = null) {
    instance = null
    if (!title) title = '操作失败'
    instance = MessageBox.alert(text, title, {type: 'error'})
    return instance
  },
  close() {
    try {
      MessageBox.close()
    } catch (e) {
      console.log(e);
    }
  }
}
