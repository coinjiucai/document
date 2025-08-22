<!--
  @Name 表格树形组件
  @Description 基于el-tree和el-input封装，主要特性如下：
    1. 在el-tree的基础上添加节点查询过滤的功能；
    2. 提供头部、底部、节点内容、节点操作栏的插槽，供大家灵活扩展；
    3. 对内容文本做溢出隐藏弹窗提示的优化处理；
  @author 赖明浩
  @version 1.0.2
  @date 2024-8-30
-->
<template>
  <div class="component-BaseTree flex-layout full-block">
    <slot name="header"></slot>
    <div class="TreeFilter flex-none">
      <el-input
          v-model="treeFilterText"
          :size="filterSize"
          placeholder="过滤"
          maxlength="20"
          show-word-limit
          clearable
          @clear="$refs.tree.filter(treeFilterText);">
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="$refs.tree.filter(treeFilterText);"></el-button>
        </template>
      </el-input>
    </div>
    <div class="TreeContent flex-auto better-scroll">
      <el-tree
          ref="tree"
          :highlight-current="true"
          :data="treeList"
          :props="treeProps"
          v-bind="$attrs"
          v-on="$listeners"
          :default-expand-all="expandAll"
          :filter-node-method="filterNode">
        <template #default="{node,data}">
          <div class="TreeItem">
            <div class="inline-block flex-auto overflow-hidden">
              <slot name="content" :node="node" :data="data">
                <text-tooltip style="text-align: left" :value="nodeLabel(node)"></text-tooltip>
              </slot>
            </div>
            <span class="TreeItemBtn">
              <slot name="edit" :node="node" :data="data"></slot>
            </span>
          </div>
        </template>
      </el-tree>
    </div>
    <div class="TreeOption flex-none">
      <slot name="option"></slot>
    </div>
  </div>
</template>

<script>
import textTooltip from "@/components/TextTooltip/TextTooltip";

export default {
  name: "BaseTree",
  provide() {
    return {
      // 这边是防止el-input触发elFormItem的validateState
      elFormItem: null
    };
  },
  components: {
    textTooltip
  },
  props: {
    filterSize: {
      type: String,
      default: "small",
      validator: (value) => ["medium", "small", "mini"].includes(value)
    },
    treeList: {
      type: Array,
      required: true
    },
    treeProps: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ""
    },
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeFilterText: ""
    };
  },
  created() {
  },
  mounted() {
  },
  filters: {},
  watch: {
    // 控制展开所有和折叠所有
    expandAll(val) {
      this.$nextTick(() => {
        const treeNode = this.$refs.tree.store.nodesMap;
        for(const key in treeNode) {
          treeNode[key].expanded = val;
        }
      });
    }
  },
  computed: {},
  methods: {
    /**
     * 搜索过滤
     * @param value
     * @param data
     * @returns {boolean}
     */
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      const labelName = this.treeProps&&this.treeProps.hasOwnProperty("label")? this.treeProps["label"] : "label";
      return data[labelName].indexOf(value) !== -1;
    },
    /**
     * 节点要显示的内容
     */
    nodeLabel(node) {
      if (this.treeProps && this.treeProps.hasOwnProperty("label") && node[this.treeProps.label]) {
        return node[this.treeProps.label];
      } else if (node["label"]) {
        return node["label"];
      } else {
        return "-";
      }
    }

  }
};
</script>

<style lang="scss" scoped>
.component-BaseTree {
  padding: 10px 0;
  .TreeFilter {
    margin-bottom: 10px;
  }

  .TreeContent {
    overflow-y: auto;

    .TreeItem {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

  }
}
</style>
