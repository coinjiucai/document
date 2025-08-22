<!--
 @Name 角色权限设置
 @Description 根据角色ID获取和调整角色的权限
 @author 赖明浩
 @date 2023-4-13
-->

<template>
  <el-drawer
    :visible.sync="visibleDrawer"
    title="角色权限配置"
    direction="rtl"
    size="600px"
    :before-close="handleClose"
  >
    <div
      v-if="!this.drawerLoading"
      class="full-block flex-layout overflow-hidden"
    >
      <div class="flex-auto better-scroll pa10">
        所拥有的权限：
        <BaseTree
          v-if="visibleDrawer"
          ref="baseTree"
          :tree-list="dataList"
          :tree-props="defaultProps"
          :expand-all="isExpand"
          :default-checked-keys="defaultChecked"
          :expand-on-click-node="false"
          show-checkbox
          check-strictly
          node-key="value"
          @check-change="handleCheckChange"
        >
          <template v-slot:edit="{ node, data }">
            <div v-if="data['ruleFlag']" @click.stop="">
              <Transition name="permission-option">
                <el-dropdown v-if="node['isCurrent']">
                  <el-button size="mini" plain type="primary"
                    >批处理<i class="el-icon-arrow-down"></i
                  ></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="batchCheckButtons('edit', node)"
                      >全选编辑</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="batchCheckButtons('view', node)"
                      >全选查看</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="batchCheckButtons('cancel', node)"
                      >取消勾选</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </Transition>
              <Transition name="list-permission">
                <el-radio-group
                  :key="data['value']"
                  class="ml5"
                  v-if="node['checked']"
                  v-model="data['listPermission']"
                  size="small"
                >
                  <el-radio-button :label="LIST_PERMISSION.DEPART"
                    >本部门</el-radio-button
                  >
                  <el-radio-button :label="LIST_PERMISSION.UNIT"
                    >本单位</el-radio-button
                  >
                  <el-radio-button :label="LIST_PERMISSION.ALL"
                    >全部</el-radio-button
                  >
                </el-radio-group>
              </Transition>
            </div>
          </template>
        </BaseTree>
      </div>
      <el-divider></el-divider>
      <div class="flex-none pb10 text-center flex-row">
        <div class="flex-none">
          <el-dropdown class="pl10" placement="top">
            <el-button type="primary" plain>
              树操作<i class="el-icon-arrow-up el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCheckAll(true)"
                >全部勾选</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleCheckAll(false)"
                >全部不选</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleExpandAll(true)"
                >展开所有</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleExpandAll(false)"
                >折叠所有</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="flex-auto pr10" style="text-align: right">
          <el-button type="info" @click="handleClose(false)">取消</el-button>
          <el-button type="primary" :loading="saveLoading" @click="handleSave"
            >保存并关闭</el-button
          >
        </div>
      </div>
    </div>
    <div v-else class="full-block pa10">
      <el-skeleton :rows="15" animated />
    </div>
  </el-drawer>
</template>

<script>
import BaseTree from "@/components/Tree/BaseTree";
import Common from "@/com/common";
import { systemTypes } from "@/com/global_data";
// 模块列表权限
const LIST_PERMISSION = {
  // 本部门
  DEPART: 1,
  //本单位
  UNIT: 2,
  //全部
  ALL: 3,
};
export default {
  name: "permissionSettingDrawer",
  components: {
    BaseTree,
  },
  props: {},
  data() {
    return {
      LIST_PERMISSION,
      visibleDrawer: false,
      dataList: [],
      allIds: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      checkList: [],
      lastCheckList: [],
      isExpand: true,
      roleId: null,
      defaultChecked: [],
      saveLoading: false,
      drawerLoading: false,
    };
  },
  created() {},
  mounted() {
    this.getAllPermissionTreeList();
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    /**
     * 获取全部的权限信息
     */
    getAllPermissionTreeList() {
      this.$api.System.getPermissionTreeList().then((res) => {
        this.dataList = Common.depthFirstSearchMap(
          res["result"]["treeList"],
          (item) => {
            //设置模块的列表查看权限，默认查看本部门的
            if (item.hasOwnProperty("ruleFlag") && item["ruleFlag"] === 1) {
              item["listPermission"] = this.LIST_PERMISSION.DEPART;
            }
            return item;
          }
        );
        this.allIds = res["result"]["ids"];
      });
    },
    /**
     * 显示权限详情抽屉面板
     * @param roleId
     */
    showDrawer(roleId) {
      this.visibleDrawer = true;
      this.drawerLoading = true;
      Promise.all([
        this.$api.System.getRolePermissionList(roleId),
        // this.$api.System.getModelListPermission(roleId),
      ])
        .then(([r1, r2]) => {
          const ids = r1["result"];
          //   const listPermissionList = r2["result"].map((i) => {
          //     return { id: i["menuId"], value: i["radius"] };
          //   });
          // 设置模块的列表查看权限的回显
          Common.depthFirstSearch(this.dataList, (item) => {
            if (item.hasOwnProperty("listPermission")) {
              item["listPermission"] =
                listPermissionList?.find((i) => i["id"] === item["value"])
                  ?.value || this.LIST_PERMISSION.DEPART;
            }
          });
          this.lastCheckList = ids ? Common.CloneDeep(ids) : [];
          this.checkList = ids ? ids : [];
          this.roleId = roleId;
          this.defaultChecked = this.checkList;
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    /**
     * 关闭抽屉
     * @param done
     */
    handleClose(done = false) {
      this.$confirm("确认关闭？", "提示", { type: "info" })
        .then(() => {
          if (done) done();
          else this.visibleDrawer = false;
        })
        .catch(() => {});
    },
    /**
     * 点击保存
     */
    handleSave() {
      this.saveLoading = true;
      Promise.all([this.saveMenuPermission(), this.saveListPermission()])
        .then(([r1, r2]) => {
          if (r1["success"] && r2["success"]) {
            this.$message.success("保存成功！");
            this.visibleDrawer = false;
          }
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    /**
     * 保存菜单按钮权限
     */
    saveMenuPermission() {
      const params = {
        roleId: this.roleId,
        permissionIds: this.checkList.toString(),
        lastpermissionIds: this.lastCheckList.toString(),
      };
      return this.$api.System.saveRolePermissionList(params).then((res) => {
        if (!res["success"]) {
          this.$popTip.error(res["message"]);
        }
        return res;
      });
    },
    /**
     * 保存模块列表查看权限
     */
    saveListPermission() {
      const params = {
        roleId: this.roleId,
        list: [],
      };
      Common.depthFirstSearch(this.dataList, (item) => {
        if (item.hasOwnProperty("listPermission")) {
          params["list"].push({
            menuId: item["value"],
            radius: item["listPermission"],
          });
        }
      });
      return this.$api.System.saveModelListPermission(params).then((res) => {
        if (!res["success"]) {
          this.$popTip.error(res["message"]);
        }
        return res;
      });
    },
    /**
     * 点击勾选
     * @param data 传递给 data 属性的数组中该节点所对应的对象
     * @param isCheck 节点本身是否被选中
     */
    handleCheckChange(data, isCheck) {
      this.checkList = this.$refs.baseTree.$refs.tree.getCheckedKeys();
      //将当前节点的子节点设为和当前节点相同的状态
      if (
        data.hasOwnProperty("children") &&
        data["children"] &&
        data["children"].length
      ) {
        const childList = [];
        Common.depthFirstSearch([data], (i) => {
          childList.push(i["value"]);
        });
        if (isCheck) {
          childList.map((child) => {
            if (!this.checkList.includes(child)) this.checkList.push(child);
          });
        } else {
          childList.map((child) => {
            if (this.checkList.includes(child))
              Common.remove(this.checkList, (i) => i === child);
          });
        }
        this.$refs.baseTree.$refs.tree.setCheckedKeys(this.checkList);
      }
    },
    /**
     * 点击全选
     */
    handleCheckAll(check = true) {
      this.$refs.baseTree.$refs.tree.setCheckedKeys(check ? this.allIds : []);
      this.checkList = this.$refs.baseTree.$refs.tree.getCheckedKeys();
    },
    /**
     * 点击折叠和展开
     * @param expand
     */
    handleExpandAll(expand = false) {
      this.isExpand = expand;
    },
    /**
     * 模块按钮权限批处理
     * @param type
     * @param node
     */
    batchCheckButtons(type, node) {
      this.checkList = this.$refs.baseTree.$refs.tree.getCheckedKeys();
      switch (type) {
        case "edit":
          node["childNodes"].forEach((i) => {
            if (/^编辑/.test(i["data"]["label"])) {
              this.$set(i, "checked", true);
            }
          });
          break;
        case "view":
          node["childNodes"].forEach((i) => {
            if (/^查看/.test(i["data"]["label"])) {
              this.$set(i, "checked", true);
            }
          });
          break;
        case "cancel":
          node["childNodes"].forEach((i) => {
            this.$set(i, "checked", false);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-drawer,
/deep/ .el-drawer__body {
  overflow: hidden;
}

.list-permission-enter-active,
.list-permission-leave-active {
  transition: all 0.8s ease;
}

.list-permission-enter-to,
.list-permission-leave {
  width: 200px;
}

.list-permission-enter,
.list-permission-leave-to {
  opacity: 0;
  width: 0;
}

.permission-option-enter-active,
.permission-option-leave-active {
  transition: all 0.8s ease;
}

.permission-option-enter,
.permission-option-leave-to {
  opacity: 0;
}
</style>
