<!-- 卡片头部 -->
<template>
  <div class="card-header">
    <div class="left" :class="{ 'left-bar': showBar }">{{ title }}</div>
    <div class="right" v-if="more" @click="$emit('more')">{{ more }}</div>
  </div>
</template>

<script>
export default {
  name: "CardHeader",
  props: {
    title: {
      type: String,
      default: () => "",
    },
    more: {
      type: String,
      default: () => "更多>>",
    },
    showBar: {
      type: Boolean,
      default: () => true,
    },
  },
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  .left-bar {
    position: relative;
    padding-left: 14px;
    color: #0099ff;
  }
  .left-bar::before {
    content: "";
    position: absolute;
    width: 4px;
    height: 100%;
    left: 0px;
    background: #0099ff;
  }
  .left {
    font-size: 14px;
  }
  .right {
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
