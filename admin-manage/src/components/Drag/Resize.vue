<template>
  <div
    class="resize-box"
    v-if="!isActive"
    :style="{
      width: item.width + 'px',
      height: item.height + 'px',
      top: item.top + 'px',
      left: item.left + 'px',
    }"
  >
    <slot></slot>
  </div>
  <VueDragResize
    v-else
    :isActive="isActive"
    :w="item.width"
    :h="item.height"
    :x="item.left"
    :y="item.top"
    @resizing="resize"
    @dragging="resize"
  >
    <slot></slot>
  </VueDragResize>
</template>

<script>
import VueDragResize from "vue-drag-resize";
export default {
  components: {
    VueDragResize,
  },
  props: {
    isActive: {
      type: Boolean,
      default: () => false,
    },
    item: {
      type: Object,
      default: () => {
        return {
          width: 200,
          height: 200,
          top: 0,
          left: 0,
        };
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    resize(newRect) {
      const { width, height, top, left } = newRect;
      const item = {
        ...this.item,
      };
      item.width = width;
      item.height = height;
      item.top = top;
      item.left = left;
      // 更新设置的值
      this.$emit("resize", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.resize-box {
  position: absolute;
  box-sizing: border-box;
}
</style>
