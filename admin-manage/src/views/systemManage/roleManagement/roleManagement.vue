<!--
  @Name 角色管理
  @Description 包含角色的维护，角色相关人员查看和角色权限的设置
  @author 赖明浩
  @date 2023-6-19
-->

<template>
  <div
    class="component-roleManagement theme-background-middle flex-layout full-block pa10"
    v-loading="listLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <div class="flex-none theme-buttons">
      <!-- <el-button
        type="primary"
        icon="el-icon-plus"
        @click="showRoleInfoDetail()"
        >新增</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="batchDeleteRole"
        :loading="delBtnLoading"
        >删除</el-button
      > -->

      <div class="btn-type-1 el-icon-plus" @click="showRoleInfoDetail()">
        新增
      </div>
      <div class="btn-type-1 el-icon-close" @click="batchDeleteRole">删除</div>
    </div>
    <!-- <el-divider></el-divider> -->
    <div class="flex-none" style="margin-top: 10px">
      <el-form inline>
        <el-form-item label="角色:" style="margin-bottom: 0">
          <el-input
            class="w160"
            size="mini"
            v-model="pageInfo.roleName"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <div class="btn-type-2" @click="handleSearch(false)">查询</div>
          <div class="btn-type-2" @click="handleSearch(true)">重置</div>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-auto flex-layout">
      <BaseTable
        ref="table"
        stripe
        show-index
        :page-info="pageInfo"
        height="100%"
        class="flex-auto"
        :label-list="labelList"
        :list="dataList"
        :total="total"
        @page-change="getRoleInfoList"
      >
        <template v-slot:operation>
          <el-table-column label="操作">
            <template #default="{ row }">
              <div>
                <el-button type="text" @click="showRoleInfoDetail(row)"
                  >编辑</el-button
                >
                <el-button type="text" @click="showRoleUserDetail(row)"
                  >人员设置</el-button
                >
                <el-button type="text" @click="showPermissionDetail(row)"
                  >权限设置</el-button
                >
              </div>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </div>
    <roleDetailDialog ref="detail" @save="getRoleInfoList"></roleDetailDialog>
    <roleUserDetailDialog ref="userDetail"></roleUserDetailDialog>
    <permissionSettingDrawer ref="permission"></permissionSettingDrawer>
    <UserSetDialog
      title="人员设置"
      ref="userSetDialog"
      @confirm="confirmSelectUser"
    ></UserSetDialog>
  </div>
</template>

<script>
import BaseTable from "@/components/Base/BaseTable.vue";
import roleDetailDialog from "./components/roleDetailDialog.vue";
import roleUserDetailDialog from "./components/roleUserDetailDialog.vue";
import permissionSettingDrawer from "./components/permissionSettingDrawer.vue";
import UserSetDialog from "@/components/UserSetDialog.vue";
export default {
  name: "roleManagement",
  components: {
    BaseTable,
    roleDetailDialog,
    roleUserDetailDialog,
    permissionSettingDrawer,
    UserSetDialog,
  },
  props: {},
  data() {
    return {
      listLoading: false,
      delBtnLoading: false,
      total: 0,
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        roleName: "",
      },
      labelList: [
        { label: "角色名称", prop: "roleName" },
        { label: "用户类型", prop: "roleType" },
        { label: "描述", prop: "description" },
      ],
      dataList: [],
      selectItem: null,
    };
  },
  created() {},
  mounted() {
    this.getRoleInfoList();
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    handleSearch(isReset = false) {
      this.pageInfo.pageNo = 1;
      if (isReset) {
        this.pageInfo.roleName = "";
      }
      this.getRoleInfoList();
    },
    /**
     * 列表获取
     */
    getRoleInfoList() {
      this.listLoading = true;
      this.$api.System.getRoleList(this.pageInfo)
        .then((res) => {
          this.total = res["result"]["total"];
          this.dataList = res["result"]["records"];
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    /**
     * 新增/编辑
     * @param row
     */
    showRoleInfoDetail(row = null) {
      const type = row ? "edit" : "new";
      this.$refs.detail.show(type, row);
    },
    /**
     * 查看人员
     * @param row
     */
    showRoleUserDetail(row) {
      this.selectItem = row;
      console.log(row, "-=----------");
      this.listLoading = true;
      this.$api.System.getUserListByRoleId({
        pageNo: 1,
        pageSize: 999,
        roleId: row.id,
      })
        .then((res) => {
          const records = res["result"]["records"].map((v) => {
            return {
              id: v.id,
              realname: v.realname,
            };
          });
          this.$refs.userSetDialog.show(records);
        })
        .finally(() => {
          this.listLoading = false;
        });

      // this.$refs.userDetail.show(row);
    },
    confirmSelectUser(users) {
      this.$api.basics
        .addSysUserRole({
          roleId: this.selectItem.id,
          userIdList: users ? users.map((v) => v.id) : [],
        })
        .then((res) => {
          console.log(res, "ssssss");
        });
    },
    /**
     * 权限设置详情
     * @param row
     */
    showPermissionDetail(row) {
      this.$refs.permission.showDrawer(row["id"]);
    },
    /**
     * 批量删除
     */
    batchDeleteRole() {
      this.$confirm("是否确认删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const ids = this.$refs.table.selectedList.map((i) => i.id);
        if (ids.length) {
          this.delBtnLoading = true;
          this.$api.System.batchDeleteRole({ ids: ids.toString() })
            .then((res) => {
              this.handleSearch();
            })
            .finally(() => {
              this.delBtnLoading = false;
            });
        } else {
          this.$popTip.info("请选择要删除的角色！");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.component-roleManagement {
  /deep/ .el-input__suffix {
    top: -4px !important;
  }
}
</style>
