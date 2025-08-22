<!-- 组织架构 -->
<template>
  <!-- 确保组件类名 class="component- -->
  <div class="component-TreeBase-data">
    <div class="content">
      <div class="tree_content" v-loading="listLoading">
        <el-input
          v-if="is_search"
          :maxlength="100"
          :placeholder="placeholder"
          class="search"
          v-model.trim="keyword"
        >
          <template slot="append">
            <el-button @click="handleFilter">
              <i class="el-icon-search"></i>
            </el-button>
          </template>
        </el-input>
        <el-tree
          class="filter-tree better-scroll"
          :data="treeData"
          :filter-node-method="filterNode"
          highlight-current
          :node-key="nodeKey"
          :expand-on-click-node="true"
          :show-checkbox="multi"
          :default-expanded-keys="keys"
          :default-checked-keys="checked"
          v-bind="$attrs"
          @check-change="handleCheckChange"
          @node-click="nodeClick"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          ref="tree"
        >
          <template v-slot="{ node, data }">
            <span
              class="custom-tree-node full-block theme-font-medium flex-row"
              :class="itemClass"
            >
              <span class="flex-auto">
                <slot name="content" :node="node" :data="data">
                  <TextTooltip
                    v-if="is_tooltip"
                    class="item"
                    style="text-align: left"
                    :value="node.data | getTitle"
                  />
                  <span v-else>{{ node.data | getTitle }}</span>
                </slot>
              </span>
              <span class="flex-none">
                <slot name="option" :node="node" :data="data"></slot>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
// default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点
// default-expand-all是否默认展开所有节点
// filter-node-method对节点过滤 查询
import TextTooltip from "@/components/TextTooltip/TextTooltip";

export default {
  name: "TreeBase",
  components: { TextTooltip },
  props: {
    // 模式，原生模式(Natural)，单位模式(默认,Depart)
    treeMode: {
      type: String,
      default: "Depart",
    },
    // 是否多选
    multi: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 默认显示搜索框
    is_search: {
      type: Boolean,
      default: true,
      required: false,
    },
    // 为true时为选人，当与depart同时为true时，即可选人又可选单位
    enableDepartUsers: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 树子项的样式
    itemClass: {
      type: String,
      default: "",
    },
    // get请求的接口地址，mode为Natural时需要
    apiOfGet: {
      type: Array,
      default: () => [],
    },
    // get请求的参数
    paramsOfGet: {
      type: Object,
      default: () => {},
    },
    // 默认选中数据
    checked_arr: {
      type: Array,
      default: () => [],
    },
    // 溢出文本弹窗显示
    is_tooltip: {
      type: Boolean,
      default: false,
    },
    // 查询输入框提示文本
    placeholder: {
      type: String,
      default: "请输入搜索内容",
    },
    default_click: {
      // 默认点击
      type: Boolean,
      default: false,
    },

    depart_click: {
      // 是否默认选中父级id，与checked_arr結合使用
      type: Boolean,
      default: false,
    },
    filter_id: {
      type: String,
      default: null,
    },
    multi_value_type: {
      type: String,
      default: "id",
    },
    need_top_depart: {
      type: Boolean,
      default: false,
    },
    nodeKey: {
      type: String,
      default: "value",
    },
  },
  data() {
    return {
      treeType: "",
      keys: [], // 默认展开的节点
      checked: this.checked_arr, // 默认选中的节点
      keyword: "", // 搜索关键字
      treeData: [],
      listLoading: false,
    };
  },

  computed: {
    chosenData() {
      if (this.multi) {
        if (this.data) {
          if (this.enableDepartUsers) {
            const arrChosen = this.data.split(",").map((uid) => {
              return `u${uid}`;
            });
            return arrChosen.join(",");
          } else {
            return this.data;
          }
        } else {
          return "";
        }
      } else {
        return `u${this.data}`;
      }
    },
    refTree() {
      return this.$refs.tree;
    },
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val);
    },
    treeMode: {
      handler() {
        this.getTreeList();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getTreeList();
  },
  filters: {
    getTitle(nodeData) {
      if (nodeData.hasOwnProperty("realname")) {
        return nodeData.realname;
      } else if (nodeData.hasOwnProperty("title")) {
        return nodeData.title;
      }
    },
  },
  methods: {
    /**
     * 点击过滤
     */
    handleFilter() {
      this.$refs.tree.filter(this.keyword);
    },
    /**
     * 节点过滤的具体实现
     * @param value
     * @param data
     * @returns {boolean}
     */
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      const index =
        this.treeMode === "Natural"
          ? data.title.indexOf(value) !== -1
          : data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      return index;
    },

    /**
     *  在节点展开是添加到默认展开数组
     * @param data
     */
    nodeExpand(data) {
      if (data.id) {
        this.keys.push(data.id);
      }
    },
    /**
     * 收起时删除数组里对应选项
     * @param data
     */
    nodeCollapse(data) {
      this.keys.splice(this.keys.indexOf(data.id), 1);
    },
    /**
     * 获取组织架构
     */
    getTreeList() {
      let url1 = "System";
      let url2 = "getDepartTree";
      if (this.treeMode === "Natural") {
        url1 = this.apiOfGet[0];
        url2 = this.apiOfGet[1];
      }
      const params = this?.paramsOfGet || {};
      this.listLoading = true;
      this.$api[url1][url2](params)
        .then(({ result }) => {
          const data = result;
          if (this.need_top_depart) {
            this.treeData = [
              {
                id: 0,
                label: "全部单位",
                level: 0,
                orgCategory: null,
                parentId: 0,
                sort: 0,
                children: [],
              },
            ];
            if (this.filter_id) {
              const res = this.findNodeByKey(data, "id", this.filter_id);
              this.treeData[0].children = [res];
            } else {
              this.treeData[0].children = data;
            }
          } else {
            if (this.filter_id) {
              const res = this.findNodeByKey(data, "id", this.filter_id);
              this.treeData = [res];
            } else {
              this.treeData = data;
            }
          }
          if (this.depart_click) {
            this.$nextTick(() => {
              this.keys = this.checked_arr;
              this.$refs.tree.setCurrentKey(this.checked_arr[0]);
              let obj = {};
              for (let i = 0; i < this.treeData.length; i++) {
                obj = this.locateByDId(this.treeData[i], this.checked_arr);
                if (obj && obj.hasOwnProperty("id")) {
                  this.$emit("nodeClick", obj);
                  return;
                }
              }
            });
          }
          if (this.default_click && this.treeData.length > 0) {
            this.$emit("nodeClick", this.treeData[0]);
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.$store.state.user.departId);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    /**
     * 根据属性名找到对应节点及其子节点
     * @param jsonObj
     * @param key
     * @param value
     * @returns {*}
     */
    findNodeByKey(tree, key, value) {
      for (const v in tree) {
        const element = tree[v];
        if (typeof element == "object") {
          const result = this.findNodeByKey(element, key, value);
          if (result) {
            return result;
          }
        } else {
          if (v == key) {
            if (element == value) {
              return tree;
            }
          }
        }
      }
    },
    /**
     * 在this.treeData 递归找到部门的节点并定位
     * @param nodeRow
     * @param departId
     * @returns {null}
     */
    locateByDId(nodeRow, departId) {
      let objRet = null;
      if (Array.isArray(nodeRow)) {
        for (const index in nodeRow) {
          objRet = this.locateByDId(nodeRow[index], departId);
          if (objRet) {
            break;
          }
        }
      } else if (nodeRow.id == departId) {
        objRet = nodeRow;
      } else {
        if (nodeRow.hasOwnProperty("children") && nodeRow.children) {
          for (let i = 0; i < nodeRow.children.length; i++) {
            const objNode = this.locateByDId(nodeRow.children[i], departId);
            if (objNode) {
              objRet = objNode;
              break;
            }
          }
        }
      }
      return objRet;
    },
    /**
     * 勾选节点发生变化
     * @param data
     * @param checked
     * @param indeterminate
     */
    handleCheckChange(data, checked, indeterminate) {
      let multiValue = null;
      if (this.multi_value_type && data.hasOwnProperty(this.multi_value_type)) {
        multiValue = data[this.multi_value_type];
      } else {
        multiValue = data;
      }
      const idx = this.checked.indexOf(multiValue);
      if (checked) {
        if (idx == -1) {
          this.checked.push(multiValue);
        }
      } else {
        if (idx > -1) {
          this.checked.splice(idx, 1);
        }
      }
      this.$emit("handleCheckChange", this.$refs.tree.getCheckedNodes());
    },
    /**
     * 节点点击事件
     * @param data
     * @param node
     * @param obj
     */
    nodeClick(data, node, obj) {
      this.treeMode === "Depart"
        ? this.nodeClickSystem(data, node, obj)
        : this.nodeClickTree(data, node, obj);
    },
    /**
     * 自建点击事件
     * @param data
     * @param node
     * @param obj
     */
    nodeClickTree(data, node, obj) {
      if (data.hasOwnProperty("realname") || data.hasOwnProperty("name")) {
        // 点击人
        this.$emit("nodeClick", data);
      } else {
        // 点击部门
        const selectNode = this.$refs.tree.getNode(node); // 获取当前节点信息
        const agencyName = selectNode.data.name;
        let topAgency = "";
        if (node.parent.data.hasOwnProperty("name")) {
          topAgency = node.parent.data.name;
        }
        const parentName = []; // 点击父类名字数据
        let currentNode = node;
        parentName.push(currentNode.data.name);
        while (currentNode.parent && currentNode.parent.level != 0) {
          parentName.push(currentNode.parent.data.name);
          currentNode = currentNode.parent;
        }
        parentName.reverse();
        const agencyObj = {};
        agencyObj.agencyName = agencyName;
        agencyObj.topAgency = topAgency;
        agencyObj.parentName = parentName;
        if (this.enableDepartUsers) {
          this.getUsers(data); // 部门下的用户获取
        }

        this.$emit("nodeClick", data, agencyObj);
      }
    },

    /**
     * 系统点击事件
     * @param data
     * @param node
     * @param obj
     */
    nodeClickSystem(data, node, obj) {
      if (data.hasOwnProperty("realname") || data.hasOwnProperty("name")) {
        // 点击人
        const selectNode = this.$refs.tree.getNode(node);
        const agencyName = selectNode.data.realname;
        let topAgency = "";
        const parentName = []; // 点击父类名字数据
        let currentNode = node;
        while (currentNode.parent && currentNode.parent.level != 0) {
          parentName.push(currentNode.parent.data.label);
          currentNode = currentNode.parent;
        }
        parentName.reverse();
        topAgency = node.parent.data.label;
        const agencyObj = {};
        agencyObj.agencyName = agencyName;
        agencyObj.topAgency = topAgency;
        agencyObj.parentName = parentName;
        this.$emit("chosen", data, agencyObj);
      } else {
        // 点击单位
        let topAgency = "";
        const parentName = []; // 点击父类名字数据
        let currentNode = node;
        while (currentNode.parent && currentNode.parent.level != 0) {
          parentName.push(currentNode.parent.data.label);
          currentNode = currentNode.parent;
        }
        parentName.unshift(data.label);
        parentName.reverse();
        topAgency = node.label;
        const agencyObj = {};
        agencyObj.topAgency = topAgency;
        agencyObj.parentName = parentName;
        if (this.enableDepartUsers && !data.departId) {
          this.getUsers(data); // 部门下的用户获取
          this.$emit("chosen", data, agencyObj);
        }
        if (!this.enableDepartUsers) {
          this.$emit("chosen", data, agencyObj);
        }
      }
    },

    /**
     * 点击全选选人员筛选出来
     * @param data
     */
    clickAll(data) {
      const Arr = [];
      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          if (item.hasOwnProperty("userId")) {
            Arr.push(item);
          }
        });
      }
      this.$emit("clickAll", Arr);
    },

    /**
     * 获取组织架构下人员列表
     * @param depart
     */
    getUsers(depart) {
      const url1 = "System";
      const url2 = "getUserList";
      const data = {
        pageSize: 100000,
        pageNo: 1,
        realname: "",
        idCard: "",
        logType: "",
        orgCode: depart.orgCode,
      };
      this.$api[url1][url2](data).then((res) => {
        this.decorateDepartUsers(depart, res.result.records);
      });
    },
    /**
     * 寻找数组中匹配的第一笔数据
     */
    findFirst(ary, callBack) {
      let objRet = null;
      let arrMatch = ary.filter((item) => callBack(item));
      if (arrMatch.length) {
        objRet = arrMatch[0];
      }
      return objRet;
    },
    /**
     * 把部门下的用户挂到部门节点下
     * @param depart
     * @param users
     */
    decorateDepartUsers(depart, users) {
      if (users.length) {
        this.keys.push(depart.id);
        let arrChilds = [];
        if (depart.hasOwnProperty("children") && depart.children) {
          arrChilds = depart.children;
        }
        users.forEach((user, index) => {
          const fCb = function (child) {
            return child.id == user.id;
          };
          if (!this.findFirst(arrChilds, fCb)) {
            arrChilds.unshift(user);
            if (this.chosenData.split(",").indexOf(user.id) > -1) {
              this.$nextTick(() => {
                this.checked = this.chosenData.split(",");
                this.$refs.et.setCurrentKey(user.id);
              });
            }
          } else {
            // 判断是否已经挂载过人员
            const state = arrChilds.findIndex(
              (item) => item.userId == user.userId
            );
            if (state == -1) {
              arrChilds.push(user);
            }
          }
        });
        this.$set(depart, "children", arrChilds);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.self-setting {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .node-setting {
    display: none;
  }

  &:hover {
    .node-setting {
      display: inline;
    }
  }
}

.component-TreeBase-data {
  height: 100%;

  .search {
    margin-bottom: 10px;
  }

  .content {
    height: 100%;
    .unit_tree {
      display: inline-block;
      width: 105px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml20 {
      margin-left: 5px;

      .checkAll {
        height: 23px;
        padding: 0 5px;
      }
    }

    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
      font-weight: 800;
    }

    .tree_content {
      padding: 0 10px;
      height: 100%;

      .filter-tree {
        overflow-y: auto;
        height: calc(100% - 46px);
      }
    }
  }

  .btn {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
