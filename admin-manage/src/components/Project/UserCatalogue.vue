<template>
  <div
    class="component-LeftCatalogue-user flex-none mr5 theme-background-middle flex-layout treeContent"
  >
    <div class="flex-none treeTitle theme-background-light">
      <span class="name">{{ title }}</span>
    </div>
    <div class="flex-none pa10">
      <el-input
        size="mini"
        :placeholder="$attrs.placeholder ? $attrs.placeholder : '搜索内容'"
        suffix-icon="el-icon-search"
        v-model.trim="keyword"
        @keyup.enter.native="handleTreeFilter"
      >
      </el-input>
    </div>
    <div class="flex-auto scroll-y better-scroll" style="padding: 0 10px 10px">
      <TransitionGroup name="tree-list-fade" tag="div">
        <div v-show="loading" key="skeleton">
          <el-skeleton class="mt10" :rows="6" animated />
        </div>
        <div v-show="!loading" key="tree">
          <el-tree
            class="allowChange"
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            v-bind="$attrs"
            :default-expanded-keys="[currentNodeKey]"
            :current-node-key="currentNodeKey"
            :node-key="nodeKey"
            style="overflow: hidden; height: calc(100vh - 280px)"
            :filter-node-method="filterNode"
            :highlight-current="highlightCurrent"
            @current-change="handleCurrentChange"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="TreeItem" :departid="data.departId">
                <div class="inline-block flex-auto overflow-hidden">
                  <slot name="content" :node="node" :data="data">
                    <img
                      v-show="labelIcon"
                      :src="labelIcon"
                      class="img"
                      style="margin-right: 6px"
                    />
                    <text-tooltip
                      style="text-align: left; line-height: 1.4"
                      :value="node.label"
                    ></text-tooltip>
                  </slot>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import TextTooltip from '@/components/TextTooltip/TextTooltip';
import Common from '@/com/common';
import SymbolIcon from '@/components/IconFont/symbolIcon';
export default {
  name: 'LeftCatalogue',
  components: {
    TextTooltip,
    SymbolIcon
  },
  props: {
    //列表数据
    treeData: {
      type: [Array, Object],
      required: true
    },
    //左侧列表标题
    title: {
      type: String,
      required: true
    },
    //列表获取的API
    getUrl: {
      type: [String, Array],
      default: null
    },
    //列表选项删除的API，，[API模块, API名称],disabledEdit时可不传,
    deleteUrl: {
      type: Array
    },
    //选项节点标识
    nodeKey: {
      type: String,
      default: 'id'
    },
    //选项节点标识
    defaultKeyValue: {
      type: String,
      default: null
    },
    //默认选项的节点标识的值
    defaultProps: {
      type: Object,
      default: () => {
        return {
          label: 'name',
          value: 'id'
        };
      }
    },
    //只对叶子节点做出响应
    onlyLeaf: {
      type: Boolean,
      default: false
    },
    //列表数据清洗的回调
    dataCleaning: {
      type: [Function, null],
      default: () => null
    },
    //是否高亮当前所选,若为false时将不设置默认选项
    highlightCurrent: {
      type: Boolean,
      default: true
    },
    labelIcon: {
      type: String,
      default: () => ''
    },
    hasUser: {
      type: Boolean,
      default: false
    },
    filterUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //查询内容
      keyword: '',
      //当前选中的节点
      currentNodeKey: '',
      //加载动画
      loading: true
    };
  },
  created() {},
  mounted() {
    this.getTree();
    this.initScroll();
  },
  filters: {},
  watch: {},
  methods: {
    initScroll() {
      document.addEventListener('scroll', this.handleScroll, true);
    },
    removeEmptyChildrenList(node) {
      if (Array.isArray(node)) {
        return node.map((item) => this.removeEmptyChildrenList(item));
      }
      if (typeof node === 'object' && node !== null) {
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
            let result = res['result'].map((v) => {
              return {
                ...v,
                departId: v.id
              };
            });

            if (typeof result === 'object' && result !== null) {
              if (result.departList) {
                result = result.departList;
              }
            }
            //列表数据清洗
            if (this?.dataCleaning()) result = this.dataCleaning(res['result']);
            result = this.removeEmptyChildrenList(result);
            if (result?.length) {
              this.currentNodeKey = result[0].id;
              this.$api.basics
                .userList({
                  departId: result[0].id,
                  pageNo: 1,
                  pageSize: 50
                })
                .then((res) => {
                  var records = res?.result?.records || [];
                  const list = records.map((v) => {
                    return {
                      id: v.id,
                      name: v.realname,
                      isUser: true,
                      departId: result[0].id
                    };
                  });

                  result[0].childrenList = list;
                  this.$emit('update:treeData', result);
                  // 列表为空则不设置当前选中节点
                  if (result?.length) {
                    if (this.highlightCurrent) {
                      this.$nextTick(() => {
                        //如果高亮选择,则在获取数据后设置默认选择的节点
                        this.setDefaultCurrentNode();
                      });
                    } else {
                      this.$emit('list-change');
                    }
                  }
                });
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
      this.currentNodeKey = this.nodeKey ? currentNodeData[this.nodeKey] : '';
      if (this.currentNodeKey)
        this.$refs.tree.setCurrentKey(this.currentNodeKey);
      const currentData = Object.entries(currentNodeData).reduce((pre, cur) => {
        if (cur[0] !== (this.defaultProps?.children || 'children'))
          pre[cur[0]] = cur[1];
        return pre;
      }, {});
      const currentNode = this.$refs.tree.getNode(this.currentNodeKey);
      this.$emit('current-change', currentData, currentNode);
    },
    /**
     * 获取第一个叶子节点
     * @param tree
     * @returns {*}
     */
    getFirstLeafNodeData(tree) {
      if (tree[0].hasOwnProperty('children') && tree[0]['children'].length) {
        return this.getFirstLeafNodeData(tree[0]['children']);
      } else {
        return tree[0];
      }
    },
    /**
     * 触发过滤
     */
    handleTreeFilter() {
      if (this.filterUser) {
        this.$emit('filter', this.keyword);
      } else {
        const currentNode = this.$refs.tree.getNode(this.currentNodeKey);
        if (currentNode && currentNode.data && currentNode.data.isUser) {
          //
          this.$emit('filter', this.keyword);
        } else {
          this.$refs.tree.filter(this.keyword);
        }
      }
    },
    /**
     * 树过滤
     * @param value
     * @param data
     * @returns {boolean}
     */
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps?.label || 'label'].indexOf(value) !== -1;
    },
    /**treeList
     * 点击树
     * @param data
     * @param node
     */
    handleCurrentChange(data, node) {
      this.$emit('current-change', data, node);
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
    setUser(node, list) {
      this.$set(node, 'childrenList', list);
      this.$nextTick(() => {
        const tree = this.$refs.tree;
        const parentTreeNode = tree.getNode(node.id);
        if (parentTreeNode) {
          // 展开父节点
          parentTreeNode.expand();
        }
      });
    },
    handleScroll(event) {
      event.stopPropagation();
      const target = event.target;
      if (target.scrollTop + target.clientHeight + 10 >= target.scrollHeight) {
        const treeNodeElement = target.closest('.el-tree-node');
        if (treeNodeElement) {
          const treeItemElement = treeNodeElement.querySelector('.TreeItem');
          if (treeItemElement) {
            // 找到了 TreeItem 元素
            const nodeId = treeItemElement.getAttribute('departid');
            this.$emit('scroll', nodeId);
          }
        }
      }
    },
    handleNodeClick(data, node) {
      this.$emit('node-click', data, node);
    },
    getNodeData(id) {
      const tree = this.$refs.tree;
      const node = tree.getNode(id);
      return node;
    },
    // 获取指定key的节点
    getNodeByKey(key) {
      return this.$refs.tree.getNode(key);
    },

    // 设置节点选中状态
    setSelected(key) {
      this.$refs.tree.setCurrentKey(key);
    },

    // 展开所有节点
    expandAll() {
      this.$refs.tree.expandAll();
    },

    // 折叠所有节点
    collapseAll() {
      this.$refs.tree.expandAll(false);
    }
  }
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
/deep/ .el-tree-node__content {
  cursor: pointer;
}
/deep/ .el-tree-node__children {
  max-height: 300px;
  overflow-y: auto !important;
}
.component-LeftCatalogue-user {
  /deep/ .el-input__inner {
    border-width: 0.5px !important;
  }

  .el-dropdown {
    color: inherit;
  }

  .treeContent {
    width: 250px;
    border-right: 1px solid #e6e6e6;
  }

  .treeTitle {
    // border-bottom: solid 1px #e6e6e6;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-family: 'Microsoft YaHei', sans-serif;
    background-image: url('~@/assets/images/p2.png');
    background-size: auto 100%;
    background-position: center;
    .name {
      //   border-left: 3px solid rgb(6, 101, 161);
      //   padding-left: 10px;
      font-weight: bold;
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
