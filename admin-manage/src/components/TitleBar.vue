<template>
  <div class="title-bar" :style="styleObj">
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => "",
    },
    styleObj: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.title-bar {
  position: relative;
  font-size: 14px;
  color: #fff;
  padding-left: 10px;
  padding-bottom: 10px;
  &::before {
    content: "";
    position: absolute;
    left: 0px;
    width: 4px;
    height: 16px;
    background-color: #0099ff;
  }
}
</style>
