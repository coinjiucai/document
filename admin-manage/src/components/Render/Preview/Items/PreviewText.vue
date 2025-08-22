<template>
  <div
    class="render-text"
    :style="{
      color: color,
      'text-decoration': underline ? 'underline' : 'unset',
      fontSize: fontSize + 'px',
    }"
    :class="{
      ellipsis: ellipsis,
      className,
    }"
  >
    {{ value }}
  </div>
</template>

<script>
export default {
  name: "PreviewText",
  props: {
    value: {
      type: String,
      default: () => "",
    },
    color: {
      type: String,
      default: () => "",
    },
    underline: {
      type: Boolean,
      default: () => false,
    },
    ellipsis: {
      type: Boolean,
      default: () => false,
    },
    fontSize: {
      type: String,
      default: () => "14",
    },
    className: {
      type: String,
      default: () => "",
    },
  },
};
</script>

<style lang="scss" scoped>
.render-text {
}
.render-text.ellipsis {
  // 超出省略
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}
</style>
