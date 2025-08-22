<!--
  @Name 基础弹窗组件
  @Description 基于el-dialog封装的弹窗组件，可以自由拖拽，加入动画特效
  @author 赖明浩
  @date 2023-6-5
  @version 1.0.3
-->

<template>
  <elDialog
    ref="elDialog"
    v-bind="{ ...$props }"
    :top="autoTop"
    :destroy-on-close="destroyOnClose"
    v-on="$listeners"
    v-dialog-drag="[dragEnable]"
  >
    <template v-slot:title>
      <slot name="title" />
    </template>
    <template v-slot>
      <div
        v-loading="loading"
        element-loading-text="加载中……"
        class="mp-dialog_body flex-layout"
        v-resize:throttle="autoTopSync"
      >
        <slot />
      </div>
    </template>
    <template v-slot:footer>
      <!--loading时一并隐藏footer-->
      <Transition name="dialog-footer-fade">
        <div v-if="!loading">
          <slot name="footer" />
        </div>
      </Transition>
    </template>
  </elDialog>
</template>

<script>
import Vue from "vue";
import { Dialog } from "element-ui";

let DialogComponent = Vue.component(Dialog.name, Dialog);
let objOptions = DialogComponent.options;

export default {
  name: "BaseDialog",
  components: {
    elDialog: Dialog,
  },
  props: {
    ...objOptions.props,
    // 关闭时销毁 Dialog 中的元素，overwrite原属性，默认为false
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    // 加载动画
    loading: {
      type: Boolean,
      default: false,
    },
    //允许拖拽
    drag: {
      type: Boolean,
      default: true,
    },
    //Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
    appendToBody: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      autoTop: undefined,
    };
  },
  computed: {
    visibleDialog() {
      return this["visible"];
    },
    dragEnable() {
      return this.drag ? "" : "disable";
    },
  },
  methods: {
    autoTopSync() {
      let height = this.$refs.elDialog.$refs.dialog.clientHeight;
      let top = (window.innerHeight - height) / 2;
      this.$set(this, "autoTop", `${Math.max(0, (top * 0.7).toFixed(0))}px`);
    },
  },
};
</script>

<style lang="scss" scoped>
// .dialog-footer-fade-enter-active,
// .dialog-footer-fade-leave-active {
//   transition: all 0.4s;
// }

// .dialog-footer-fade-enter,
// .dialog-footer-fade-leave-to {
//   opacity: 0;
//   transform: translateY(-100%);
// }

// .dialog-footer-fade-enter-to,
// .dialog-footer-fade-leave {
//   opacity: 1;
//   transform: translateY(0);
// }
</style>
<style lang="scss">
.el-dialog {
  .el-dialog__header {
    padding: 10px;
  }

  .el-dialog__headerbtn {
    top: 10px;
  }
}
</style>
