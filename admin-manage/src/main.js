//css
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "@/styles/theme/index.js"; // 主题样式
//base
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import './vant';

//plugin
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/zh-CN";
import moment from "moment"; //JavaScript 日期处理类库
import * as echarts from 'echarts';
import 'echarts-wordcloud'
import "babel-polyfill";
import RSA from "@/utils/RSA";

//js
import "@/utils/prototypeExpand"; //对象原型扩展方法
import "@/permission"; // 菜单权限控制-路由导航守卫
import hasPermission from "@/utils/hasPermission"; //按钮权限控制
import checkPermission from "@/utils/checkPermission"; //按钮权限判断方法
import "@/utils/dialogDragable.js";
import "@/assets/icons/iconfonts/symbol";
import api from "@/api";
import constValue from "@/com/constValue";
import popTip from "./utils/popTip";
// 自定义组件
import "@/utils/customizeComponents";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

moment.locale("zh-cn"); //设置语言 或 moment.lang('zh-cn');

ElementUI.TableColumn.props.align = { default: "center", type: String };
// 2.Dialog: 通过点击modal关闭Dialog属性默认不开启
ElementUI.Dialog.props.closeOnClickModal.default = false;
// 在范围选择器里取消两个日期面板之间的联动
ElementUI.DatePicker.props.unlinkPanels = { default: true, type: Boolean };
// 文本框不可输入
ElementUI.DatePicker.props.editable = { default: false, type: Boolean };

Vue.use(ElementUI, { locale, size: "medium" });
Vue.use(hasPermission);
Vue.use(VueAwesomeSwiper);

Vue.prototype.$popTip = popTip;
Vue.prototype.$moment = moment; //赋值使用
Vue.prototype.$permission = checkPermission;
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;
Vue.prototype.$cv = constValue;
Vue.prototype.$rsa = RSA;
//生产环境时自动设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = process.env.NODE_ENV != "production";
//防抖处理-立即执行
const on = Vue.prototype.$on;
Vue.prototype.$on = function (event, func) {
  let timer;
  let flag = true;
  let newFunc = func;
  if (event === "click") {
    newFunc = function () {
      if (flag) {
        func.apply(this, arguments);
        flag = false;
      }
      clearTimeout(timer);
      timer = setTimeout(function () {
        flag = true;
      }, 200);
    };
  }
  on.call(this, event, newFunc);
};

Vue.prototype.$eventBus = new Vue();

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App },
});
