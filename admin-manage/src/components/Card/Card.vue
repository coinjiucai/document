<!-- 卡片 -->
<template>
  <div class="component-card" :style="styleObj" :class="className">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    // 样式
    styleObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 类名
    className: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.component-card {
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(204, 204, 204, 1);
}
</style>
