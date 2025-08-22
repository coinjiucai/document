<!--
  IconFont的Symbol引用
  这是一种全新的使用方式，应该说这才是未来的主流，也是平台目前推荐的用法。
  相关介绍可以参考这篇文章 这种用法其实是做了一个 SVG 的集合，与另外两种相比具有如下特点：
    *支持多色图标了，不再受单色限制。
    *通过一些技巧，支持像字体那样，通过 font-size, color 来调整样式。
    *兼容性较差，支持 IE9+，及现代浏览器。
    *浏览器渲染 SVG 的性能一般，还不如 png。
-->
<template>
  <span>
    <svg
      v-if="name"
      class="icon"
      :width="iconSize"
      :height="iconSize"
      aria-hidden="true"
    >
      <use :xlink:href="iconName"></use>
    </svg>
  </span>
</template>

<script>
export default {
  name: "symbolIcon",
  props: {
    name: {
      type: String,
      default: null,
    }, //一般以#开头
    size: {
      type: String,
      default: "1.2",
    }, //单位em
  },
  data() {
    return {};
  },
  computed: {
    iconName() {
      //输入整个名称如：#icon-shouye
      if (this.name.substring(0, 1) === "#") {
        return this.name;
      }
      //输入整个名称的后半部分如：shouye
      else {
        return "#icon-" + this.name;
      }
    },
    iconSize() {
      return this.size + "em";
    },
  },
};
</script>

<style scoped>
.icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
