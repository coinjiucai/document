<!--
 @Name 文本溢出隐藏悬停显示
 @version 4.3.2
 @Description
   注意：
   1.部分class引自全局文件，复用时注意这些确据样式是否需要一并复制
   2.组件基于el-tooltip,固然支持el-tooltip的所有属性
 @author 赖明浩
 @date 2023-4-23
-->

<template>
  <div class="text-over-tooltip-components full-block flex-layout">
    <el-tooltip
        v-if="wrapLine>0"
        class="flex-none"
        v-bind="$attrs"
        :effect="effect"
        :enterable="enterable"
        :disabled="disabled||isDisabledTooltip"
        :content="JSON.stringify(value)"
        :placement="position">
      <template v-slot:content>
        <slot name="content"></slot>
      </template>
      <div :ref="refValue"
           :style="{'-webkit-line-clamp': wrapLine,'line-clamp': wrapLine}"
           class="ellipsis"
           :class="className"
           @mouseover="onMouseOver">
        <slot>
          <span v-if="!is_html" :class="contentClass" :style="contentStyle">{{ value }}</span>
          <span v-else v-html="value" :class="contentClass" :style="contentStyle"></span>
        </slot>
      </div>
    </el-tooltip>
    <span v-else>
      <slot>
        <span v-if="!is_html" :class="contentClass" :style="contentStyle">{{ value }}</span>
        <span v-else v-html="value" :class="contentClass" :style="contentStyle"></span>
      </slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TextTooltip',
  props: {
    // 显示的文字内容
    value: String | Number,
    // 设置父元素的样式，作用性不强，有待优化
    className: String,
    // 默认提供的主题 dark/light
    effect: {
      type: String,
      default: () => {
        return 'dark';
      }
    },
    // 子元素标识（如在同一页面中调用多次组件，此参数不可重复）
    refValue: {
      type: String,
      default: 'box'
    },
    // Tooltip 的出现位置
    // top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    position: {
      type: String,
      default: 'bottom'
    },
    //控制显示几行
    wrapLine: {
      type: Number,
      default: 1,
    },
    //校准值
    calibration: {
      type: Number,
      default: 0
    },
    //是否显示html文本
    is_html: {
      type: Boolean,
      default: false,
    },
    //禁用提示，注意：溢出隐藏仍然有效
    disabled: {
      type: Boolean,
      default: false
    },
    //鼠标是否可进入到 tooltip 中
    enterable: {
      type: Boolean,
      default: false
    },
    //内容部分样式自定义
    contentStyle: {
      type: Object,
      default: () => {
      }
    },
    //内容部分自定义样式类名
    contentClass: {
      type: String,
      default: ''
    },
  },
  mounted() {
  },
  updated() {
  },
  data() {
    return {
      // 是否需要禁止提示
      isDisabledTooltip: true,
    };
  },
  methods: {
    /**
     * 移入事件: 判断内容的宽度contentWidth是否大于父级的宽度
     */
    onMouseOver() {
      let parentWidth = this.$refs[this.refValue]['offsetWidth'];
      let contentWidth = this.getTextWidth(this.value)
      // 判断是否禁用tooltip功能
      this.isDisabledTooltip = contentWidth <= parentWidth + this.calibration;
    },
    /**
     * 计算文本宽度
     * @param value
     * @returns {number}
     */
    getTextWidth(value = '') {
      //思路：创建一个节点，通过该节点计算出文本宽度，拿到宽度后移除该节点
      const dom = document.createElement('span');
      //确保样式上尽量保持一直，特别是那些影响长度的（如字体大小），这样计算出来的长度才能更精确
      for (let i in this.contentStyle) {
        dom.style[i] = this.contentStyle[i]
      }
      dom.style.display = 'inline-block';
      dom.style.position = 'absolute';
      dom.style.top = '0';
      dom.style.left = '0';
      dom.textContent = value;
      document.body.appendChild(dom);
      const width = dom.clientWidth;
      document.body.removeChild(dom);
      return width;
    }
  }
};
</script>

<style lang="scss" scoped>
.text-over-tooltip-components {
  white-space: normal;
  /* 文字超出宽度显示省略号 单行 */
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
}
</style>
