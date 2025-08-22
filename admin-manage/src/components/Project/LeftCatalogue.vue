<!--
  @Name 左侧目录栏
  @Description 该组件用于显示模块的右侧列表，用于实现右侧列表增删改查等操作。
  @author 赖明浩
  @date 2023-4-23
  @version 1.0.5
-->

<template>
  <div
    class="component-LeftCatalogue flex-none mr5 theme-background-middle flex-layout treeContent"
  >
    <div class="flex-none treeTitle theme-background-light">
      <span class="name">{{ title }}</span>
      <span
        v-if="!loading && showAdd"
        class="catalogue"
        @click="showAddCatalogue('add')"
        >+</span
      >
    </div>
    <div class="flex-none pa10">
      <el-input
        size="mini"
        :placeholder="$attrs.placeholder ? $attrs.placeholder : '搜索内容'"
        clearable
        v-model.trim="keyword"
        @keyup.enter.native="handleTreeFilter"
      >
        <template v-slot:append>
          <el-button
            icon="el-icon-search"
            @click="handleTreeFilter"
          ></el-button>
        </template>
      </el-input>
    </div>
    <div class="flex-auto scroll-y better-scroll" style="padding: 0 10px 10px">
      <TransitionGroup name="tree-list-fade" tag="div">
        <div v-show="loading" key="skeleton">
          <el-skeleton class="mt10" :rows="6" animated />
        </div>
        <div v-show="!loading" key="tree">
          <el-tree
            :class="disabledChange ? 'disabledChange' : 'allowChange'"
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            v-bind="$attrs"
            :default-expanded-keys="[currentNodeKey]"
            :current-node-key="currentNodeKey"
            :node-key="nodeKey"
            style="overflow-y: auto; height: calc(100% - 50px)"
            :filter-node-method="filterNode"
            :highlight-current="highlightCurrent"
            @current-change="handleCurrentChange"
          >
            <template #default="{ node, data }">
              <div class="TreeItem">
                <div class="inline-block flex-auto overflow-hidden">
                  <slot name="content" :node="node" :data="data">
                    <img
                      v-show="labelIcon"
                      :src="labelIcon"
                      class="img"
                      style="margin-right: 6px"
                    />
                    <text-tooltip
                      style="text-align: left"
                      :value="node.label"
                    ></text-tooltip>
                  </slot>
                </div>
                <span class="TreeItemBtn" v-if="!disabledOption">
                  <el-dropdown trigger="click" v-has="optionPermissionFlag">
                    <span
                      class="el-dropdown-link"
                      @click="(e) => e.stopPropagation()"
                      style="padding-right: 15px"
                    >
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu>
                      <slot
                        :node="node"
                        :data="data"
                        name="dropdown-top"
                      ></slot>
                      <el-dropdown-item
                        v-if="showEdit"
                        @click.native="showAddCatalogue('edit', data)"
                      >
                        修改
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="showDelete"
                        @click.native="deleteCatalogue(data)"
                        style="color: rgb(255, 89, 98)"
                      >
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import TextTooltip from "@/components/TextTooltip/TextTooltip";
import Common from "@/com/common";
import SymbolIcon from "@/components/IconFont/symbolIcon";
export default {
  name: "LeftCatalogue",
  components: {
    TextTooltip,
    SymbolIcon,
  },
  props: {
    //选项的下拉操作菜单的权限标识
    optionPermissionFlag: {
      type: String,
      default: null,
    },
    //列表新增选项的权限标识
    addPermissionFlag: {
      type: String,
      default: null,
    },
    //选项编辑的权限标识
    editPermissionFlag: {
      type: String,
      default: null,
    },
    //选项删除的权限标识
    deletePermissionFlag: {
      type: String,
      default: null,
    },
    //列表数据
    treeData: {
      type: [Array, Object],
      required: true,
    },
    //左侧列表标题
    title: {
      type: String,
      required: true,
    },
    //列表获取的API
    getUrl: {
      type: [String, Array],
      default: null,
    },
    //列表选项删除的API，，[API模块, API名称],disabledEdit时可不传,
    deleteUrl: {
      type: Array,
    },
    //选项节点标识
    nodeKey: {
      type: String,
      default: "id",
    },
    //选项节点标识
    defaultKeyValue: {
      type: String,
      default: null,
    },
    //默认选项的节点标识的值
    defaultProps: {
      type: Object,
      default: () => {
        return {
          label: "name",
          value: "id",
        };
      },
    },
    //只对叶子节点做出响应
    onlyLeaf: {
      type: Boolean,
      default: false,
    },
    //是否禁用选择
    disabledChange: {
      type: Boolean,
      default: false,
    },
    //禁用所有操作
    disabledOption: {
      type: Boolean,
      default: false,
    },
    //禁用编辑操作
    disabledEdit: {
      type: Boolean,
      default: false,
    },
    //禁用删除操作
    disabledDelete: {
      type: Boolean,
      default: false,
    },
    //列表数据清洗的回调
    dataCleaning: {
      type: [Function, null],
      default: () => null,
    },
    //是否高亮当前所选,若为false时将不设置默认选项
    highlightCurrent: {
      type: Boolean,
      default: true,
    },
    labelIcon: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      //查询内容
      keyword: "",
      //当前选中的节点
      currentNodeKey: "",
      //加载动画
      loading: true,
    };
  },
  created() {},
  mounted() {
    this.getTree();
  },
  filters: {},
  watch: {},
  computed: {
    showAdd() {
      return this.$permission(this.addPermissionFlag) && !this.disabledOption;
    },
    showEdit() {
      return this.$permission(this.addPermissionFlag) && !this.disabledEdit;
    },
    showDelete() {
      return this.$permission(this.addPermissionFlag) && !this.disabledEdit;
    },
  },
  methods: {
    removeEmptyChildrenList(node) {
      if (Array.isArray(node)) {
        return node.map((item) => this.removeEmptyChildrenList(item));
      }
      if (typeof node === "object" && node !== null) {
        if (
          Array.isArray(node.childrenList) &&
          node.childrenList.length === 0
        ) {
          delete node.childrenList;
        }
        for (const key in node) {
          if (Object.prototype.hasOwnProperty.call(node, key)) {
            node[key] = this.removeEmptyChildrenList(node[key]);
          }
        }
      }
      return node;
    },
    /**
     * 获取树
     */
    getTree() {
      // 如果没有传入获取列表接口则不触发请求且关闭动画
      if (!this.getUrl) {
        this.loading = false;
        return;
      }
      this.loading = true;
      return this.$api[this.getUrl[0]]
        [this.getUrl[1]]()
        .then((res) => {
          // 提前关闭动画，否则调用树组件的时候会出问题
          this.loading = false;
          // 设置定时器是因为动画加载过程需要.6s
          setTimeout(() => {
            let result = res["result"];

            if (typeof result === "object" && result !== null) {
              if (result.departList) {
                result = result.departList;
              }
            }
            //列表数据清洗
            if (this?.dataCleaning()) result = this.dataCleaning(res["result"]);
            result = this.removeEmptyChildrenList(result);

            this.$emit("update:treeData", result);
            // 列表为空则不设置当前选中节点
            if (result?.length) {
              if (this.highlightCurrent) {
                this.$nextTick(() => {
                  //如果高亮选择,则在获取数据后设置默认选择的节点
                  this.setDefaultCurrentNode();
                });
              } else {
                this.$emit("list-change");
              }
            }
          }, 600);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 设置默认选中的节点,并触发current-change
     */
    setDefaultCurrentNode() {
      let currentNodeData = this.treeData[0];

      if (this.onlyLeaf)
        currentNodeData = this.getFirstLeafNodeData(this.treeData);
      if (this.defaultKeyValue)
        Common.depthFirstSearch(this.treeData, (item) => {
          if (item.id === this.defaultKeyValue) {
            currentNodeData = item;
            // 终止遍历
            return true;
          }
        });
      this.currentNodeKey = this.nodeKey ? currentNodeData[this.nodeKey] : "";
      if (this.currentNodeKey)
        this.$refs.tree.setCurrentKey(this.currentNodeKey);
      const currentData = Object.entries(currentNodeData).reduce((pre, cur) => {
        if (cur[0] !== (this.defaultProps?.children || "children"))
          pre[cur[0]] = cur[1];
        return pre;
      }, {});
      const currentNode = this.$refs.tree.getNode(this.currentNodeKey);
      this.$emit("current-change", currentData, currentNode);
    },
    /**
     * 获取第一个叶子节点
     * @param tree
     * @returns {*}
     */
    getFirstLeafNodeData(tree) {
      if (tree[0].hasOwnProperty("children") && tree[0]["children"].length) {
        return this.getFirstLeafNodeData(tree[0]["children"]);
      } else {
        return tree[0];
      }
    },
    /**
     * 触发过滤
     */
    handleTreeFilter() {
      this.$refs.tree.filter(this.keyword);
    },
    /**
     * 树过滤
     * @param value
     * @param data
     * @returns {boolean}
     */
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps?.label || "label"].indexOf(value) !== -1;
    },
    /**
     * 点击树
     * @param data
     * @param node
     */
    handleCurrentChange(data, node) {
      if (this.disabledChange) {
        this.$refs.tree.setCurrentKey(this.currentNodeKey);
        return;
      }
      this.$emit("current-change", data, node);
    },
    /**
     * 新增修改目录
     */
    showAddCatalogue(type, data) {
      this.$emit(type, this.treeData, data);
    },
    /**
     * 删除目录
     * @param data
     */
    deleteCatalogue(data) {
      if (!this.deleteUrl) {
        this.$emit("delete", data);
      } else {
        this.$confirm("是否确定删除该目录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.loading = true;
          this.$api[this.deleteUrl[0]]
            [this.deleteUrl[1]]({ id: data.id })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功！");
                this.getTree();
              } else {
                this.loading = false;
                this.$popTip.error(res.message);
              }
            })
            .catch(() => {
              this.loading = false;
            });
        });
      }
    },
    // 设置当前节点
    setCurrentNode(key) {
      let count = 0;
      if (this.loading) {
        const st = setInterval(() => {
          if (this.loading) {
            count = count + 1;
          } else {
            count = 0;
            this.$refs.tree.setCurrentKey(key);
            clearInterval(st);
          }
        }, 500);
      } else {
        this.$refs.tree.setCurrentKey(key);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-list-fade-enter-active {
  transition: all 0.6s ease;
}

.tree-list-fade-enter,
.tree-list-fade-leave-to {
  opacity: 0;
}

.component-LeftCatalogue {
  .disabledChange {
    /deep/ .el-tree-node__content {
      cursor: not-allowed;
    }
  }

  .allowChange {
    /deep/ .el-tree-node__content {
      cursor: pointer;
    }
  }

  .el-dropdown {
    color: inherit;
  }

  .treeContent {
    width: 250px;
    border-right: 1px solid #e6e6e6;
  }

  .treeTitle {
    border-bottom: solid 1px #e6e6e6;
    height: 50px;
    line-height: 50px;
    font-family: "Microsoft YaHei", sans-serif;

    .name {
      border-left: 3px solid rgb(6, 101, 161);
      padding-left: 10px;
    }

    .catalogue {
      float: right;
      margin-right: 10px;
      font-size: 30px;
      color: rgb(1, 140, 205);
      cursor: pointer;
    }
  }

  .TreeItem {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    > div {
      display: flex;
      align-items: center;
    }
  }
}
</style>
