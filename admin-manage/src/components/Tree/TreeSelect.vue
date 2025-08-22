<!--
  @Name 树形选择组件
  @Description 基于el-table和el-pagination封装的基础表格组件
  @author 赖明浩
  @version 1.0.3
  @date 2024-10-15
-->

<template>
  <el-popover
      ref="popover"
      :placement="popPosition"
      :width="popWidth"
      :disabled="readonly"
      @show="selectInit"
      trigger="click">
    <template #reference>
      <div v-if="multiple&&((stringValue&&value) || value&&value.length)"
           ref="reference"
           class="tree-select_multiple theme-border-base pointer theme-background-middle flex-row"
           :class="[
             referenceClass,
             inputSize ? 'tree-select_multiple--' + inputSize : '',
           ]">
        <div class="flex-row overflow-hidden">
          <div class="flex-auto overflow-hidden">
            <template v-for="item in tagList">
              <transition name="el-zoom-in-center" :key="item['value']">
                <div :key="item['value']"
                     style="max-width: 100%;"
                     class="tree-select_tag el-tag el-tag--light"
                     :class="[inputSize==='mini'? 'el-tag--mini' : 'el-tag--small']">
                  <div>
                    <div class="flex-row overflow-hidden">
                      <div class="flex-auto">
                        <text-tooltip :contentStyle="{fontSize:'12px'}" :value="item['label']">{{item["label"]}}</text-tooltip>
                      </div>
                      <div v-if="!readonly"
                           class="flex-none"
                           style="width: 15px"
                           @click="handleRemoveTag(item)">
                        <i style="margin-left: -4px" class="el-tag__close el-icon-close"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </template>
          </div>
          <div class="flex-none tree-select_multiple_clearable" v-if="showClear">
            <div style="padding-right: 8px">
              <i class="el-input__icon el-icon-circle-close el-input__clear" @click.stop="handleClear"></i>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="multiple"
           :class="[
             referenceClass,
             inputSize ? 'el-input--' + inputSize : '',
           ]"
           class="el-input el-input--suffix tree-select pointer">
        <input type="text" class="el-input__inner pointer" :placeholder="placeholder" readonly :value="inputValue">
      </div>
      <div v-else ref="reference"
           :class="[
             referenceClass,
             inputSize ? 'el-input--' + inputSize : '',
           ]"
           class="el-input el-input--suffix tree-select pointer">
        <input type="text" class="el-input__inner pointer" :placeholder="placeholder" readonly :value="inputValue">
        <span v-if="showClear" class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-input__icon el-icon-circle-close el-input__clear" @click.stop="handleClear"></i>
          </span>
        </span>
      </div>
    </template>
    <template #default>
      <div :style="{width: popWidth,height: popHeight}" style="overflow-y: auto">
        <base-tree
            ref="BaseTree"
            :filter-size="inputSize==='mini'? 'mini' : 'small'"
            :tree-list="treeList"
            :show-checkbox="multiple"
            :node-key="nodeKey"
            :check-strictly="checkStrictly"
            :expand-all="expandAll"
            :tree-props="treeProps"
            v-bind="$attrs"
            @check="handleNodeCheck"
            @check-change="handleCheckChange"
            @node-click="handleNodeClick"></base-tree>
      </div>
    </template>
  </el-popover>
</template>

<script>
import BaseTree from "@/components/Tree/BaseTree.vue";
import TextTooltip from "@/components/TextTooltip/TextTooltip.vue";
import emitter from "element-ui/src/mixins/emitter";
import propsValidator from "@/utils/propsValidator";

export default {
  name: "TreeSelect",
  mixins: [emitter],
  inject: {
    elFormItem: {
      default: ""
    }
  },
  components: {TextTooltip, BaseTree},
  props: {
    // 值
    value: {
      // 支持String, Number, Array, null
      validator: (value) => {
        try {
          return propsValidator(value, ["string", "number", "array", "null"]);
        } catch (e) {
          console.error(e);
        }
      },
      default: null
    },
    // 组件大小，兼容element的三种size
    size: String,
    // 选择框的样式类
    referenceClass: {
      type: String
    },
    // 浮窗的高度
    popHeight: {
      type: [String, Number],
      default: "200px"
    },
    // 浮窗的位置
    popPosition: {
      type: String,
      default: "bottom-start"
    },
    // 文本提示
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 是否允许清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 树列表
    treeList: {
      type: Array,
      default: () => []
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选的值是否为字符串，true时，value为数组转为字符串的值，反之为数组本身
    stringValue: {
      type: Boolean,
      default: false
    },
    // 多选是否互不关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 节点的KEY
    nodeKey: {
      type: String,
      required: true
    },
    // 节点各参数的名称
    treeProps: {
      type: Object,
      default: () => ({
        label: "label",
        children: "children"
      })
    },
    // 是否默认展开全部
    expandAll: {
      type: Boolean,
      default: false
    },
    // 选择时是否只返回叶子节点的值，仅多选时有效
    leafOnly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectNodes: null,
      popWidth: "auto"
    };
  },
  watch: {
    value: {
      handler() {
        this.selectInit();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.selectInit();
    // 根据窗口大小动态调整popover宽度
    window.onresize = () => {
      this.popWidth = this.$refs.reference?.offsetWidth || "auto";
    };
  },
  computed: {
    elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    inputSize() {
      return this.size || this.elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputValue() {
      if (this.multiple) {
        return null;
      } else {
        if (this.selectNodes) {
          return this.selectNodes.label;
        } else {
          return null;
        }
      }
    },
    nativeInputValue() {
      return this.value === null || typeof this.value === "undefined" ? "" : String(this.value);
    },
    showClear() {
      return this.clearable && !this.readonly && this.nativeInputValue;
    },
    tagList() {
      if (this.multiple && this.selectNodes) {
        return this.selectNodes.map((item) => ({
          value: item[this.nodeKey],
          label: item[this.treeProps["label"]]
        }));
      } else {
        return [];
      }
    }
  },
  methods: {
    /**
     * 初始化所选项，每次显示popover的时候触发
     */
    selectInit() {
      const tree = this.$refs.BaseTree?.$refs.tree;
      if (tree) {
        if (this.multiple) {
          if (Array.isArray(this.value)) {
            tree.setCheckedKeys(this.value, this.leafOnly);
          } else if (typeof this.value === "string") {
            tree.setCheckedKeys(this.value.split(","), this.leafOnly);
          } else {
            tree.setCheckedKeys([], this.leafOnly);
          }
        } else {
          tree.setCurrentKey(this.value);
          // this.value可能不是一个有效的nodeKey，所以得验证一下是否生效，不生效则置空
          if(this.value!==tree.getCurrentKey()) {
            tree.setCurrentKey(null);
          }
        }
        this.$nextTick(() => {
          this.updateSelectNodes();
        });
      }
      this.$nextTick(() => {
        this.popWidth = this.$refs.reference?.offsetWidth || "auto";
      });
    },
    /**
     * 更新当前所选节点
     */
    updateSelectNodes() {
      if (this.$refs.BaseTree&&this.treeList.length) {
        const tree = this.$refs.BaseTree.$refs.tree;
        if (this.multiple) {
          this.selectNodes = tree.getCheckedNodes?.(this.leafOnly) || null;
        } else if(typeof this.value === "string" || typeof this.value !== "number") {
          // 注意：getCurrentNode拿到的不是node，而是data。
          // 所以要拿到当前的node得通过xxx.getNode(xxx.getCurrentKey())获取。
          const key = tree.getCurrentKey?.() || null;
          if(key) {
            this.selectNodes = tree.getNode?.(key) || null;
          }else{
            this.selectNodes = null;
          }
        }else{
          this.selectNodes = null;
        }
      } else {
        this.selectNodes = null;
      }
    },
    /**
     * 清空所有选择
     */
    handleClear() {
      this.handleValueChange(null, true);
      this.clearSelect();
    },
    /**
     * 删除多选项
     * @param item
     */
    handleRemoveTag(item) {
      const list = this.selectNodes.filter((node) => node[this.nodeKey] !== item["value"]);
      this.$refs.BaseTree.$refs.tree.setCheckedKeys(list.map((i) => i[this.nodeKey]), this.leafOnly);
      this.$nextTick(() => {
        this.handleCheckChange();
      });
    },
    /**
     * 清空全部所选
     */
    clearSelect() {
      if (this.multiple) {
        this.$refs.BaseTree.$refs.tree.setCheckedKeys([], this.leafOnly);
      } else {
        this.$refs.BaseTree.$refs.tree.setCurrentKey(null);
      }
      this.selectNodes = null;
    },
    /**
     * 节点点击处理
     * @param data
     */
    handleNodeClick(data) {
      if (!this.multiple) {
        this.updateSelectNodes();
        this.$nextTick(() => {
          this.handleValueChange(data[this.nodeKey]);
        });
      }
    },
    /**
     * 点击勾选时处理
     */
    handleNodeCheck() {
      this.$nextTick(() => {
        // 为什么有两次调用？
        // 第一次调用是为了确保，在值变化后popper位置能及时更新；第二次之所以是在0.31s后执行是因为el-tag关闭时存在关闭动画，时长0.3s，
        // 为了确保删除时popper位置计算正常，所以得在动画结束后进行调用（没有去判断值的变化是新增还是删除，统一执行两次，如果要判断建议考虑性能问题）。
        this.$refs?.popover?.["updatePopper"]?.();
        setTimeout(() => {
          this.$refs?.popover?.["updatePopper"]?.();
        }, 310);
      });
    },
    /**
     * 勾选变化处理
     */
    handleCheckChange() {
      this.updateSelectNodes();
      this.$nextTick(() => {
        this.handleValueChange();
      });
    },
    /**
     * 值变化处理
     * @param data
     * @param clearAll
     */
    handleValueChange(data = null, clearAll = false) {
      if (this.multiple) {
        if(clearAll) {
          this.selectNodes = [];
          this.$emit("input", []);
          this.dispatch("ElFormItem", "el.form.change", []);
        }else{
          if (this.stringValue) {
            const value = this.tagList.map((i) => i["value"]).toString();
            this.$emit("input", value);
            this.dispatch("ElFormItem", "el.form.change", value);
          } else {
            const value = this.tagList.map((i) => i["value"]);
            this.$emit("input", value);
            this.dispatch("ElFormItem", "el.form.change", value);
          }
        }
      } else {
        this.$emit("input", data);
        this.dispatch("ElFormItem", "el.form.change", data);
      }
    }
  }
};

</script>

<style scoped lang="scss">
.tree-select_multiple {
  position: relative;
  -webkit-appearance: none;
  background-image: none;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  font-size: inherit;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;

  .tree-select_tag {
    margin: 2.5px;
  }

  .tree-select_multiple_clearable{
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    vertical-align: middle;
    visibility: hidden;
    color: #C0C4CC;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    .el-input__icon{
      line-height: unset;
    }
    &:hover{
      color: #909399;
    }
  }

  &:hover {
    .tree-select_multiple_clearable {
      visibility: visible;
    }
  }

  &.tree-select_multiple--medium {
    min-height: 36px;
    line-height: 27px;
    padding: 2.5px;

    .tree-select_multiple_clearable{
      width: 25px;
      height: auto;
    }
  }
  &.tree-select_multiple--small {
    min-height: 32px;
    line-height: 23px;
    padding-left: 2.5px;

    .tree-select_multiple_clearable{
      width: 25px;
      height: auto;
    }
  }
  &.tree-select_multiple--mini {
    min-height: 28px;
    line-height: 19px;
    padding-left: 2px;

    .tree-select_multiple_clearable{
      width: 25px;
      height: auto;
    }
  }
}

.tree-select, {
  .el-input__suffix {
    visibility: hidden;
  }

  &:hover {
    .el-input__suffix {
      visibility: visible;
    }
  }
}
</style>
