import Vue from "vue";
// 全局注册自定义组件
// 列表页面
import Jmtable from "@/components/ListPage";
// 弹窗
import JmDialog from "@/components/Base/BaseDialog";
// 表格弹窗
import JmTableDialog from "@/components/TableDialog";

// 表单组件
import JmFormItem from "@/components/Form/Item";
// 文件导入导出弹窗
import JmFileImportDialog from "@/components/FileImport/FileImportDialog";
// iconfont 图标展示组件
import JmSymbolIcon from "@/components/IconFont/symbolIcon";
// 标题，带竖线
import JmTitleBar from "@/components/TitleBar";

Vue.component("Jmtable", Jmtable);
Vue.component("JmDialog", JmDialog);
Vue.component("JmTableDialog", JmTableDialog);
Vue.component("JmFormItem", JmFormItem);
Vue.component("JmFileImportDialog", JmFileImportDialog);
Vue.component("JmSymbolIcon", JmSymbolIcon);
Vue.component("JmTitleBar", JmTitleBar);
