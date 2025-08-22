<template>
  <div>
    <BaseDialog
      class="full-block component-roleUserDetailDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1200px"
      top="10vh"
      :loading="listLoading"
    >
      <div class="full-block flex-layout">
        <div class="flex-none">
          <el-form inline>
            <el-form-item label="姓名：">
              <el-input
                size="mini"
                class="w160"
                v-model="pageInfo.realname"
                placeholder="请输入"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="所属单位：">
              <el-input
                size="mini"
                class="w160"
                v-model="pageInfo.departname"
                placeholder="请输入"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <!-- <el-button size="mini" type="primary" @click="handleSearch(false)"
                >查询</el-button
              >
              <el-button size="mini" type="info" @click="handleSearch(true)"
                >重置</el-button
              > -->
              <div class="btn-type-2" @click="handleSearch(false)">查询</div>
              <div class="btn-type-2" @click="handleSearch(true)">重置</div>
            </el-form-item>
          </el-form>
        </div>
        <div class="flex-auto flex-layout">
          <BaseTable
            ref="BaseTable"
            height="100%"
            class="flex-auto"
            stripe
            :show-selection="false"
            :page-info="pageInfo"
            :total="total"
            :label-list="labelList"
            :list="dataList"
            @page-change="getUserByRoleId"
          >
          </BaseTable>
        </div>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import BaseTable from "@/components/Base/BaseTable.vue";
export default {
  name: "roleUserDetailDialog",
  components: { BaseTable, BaseDialog },
  props: {},
  mounted() {},
  data() {
    return {
      listLoading: false,
      visibleDialog: false,
      title: "查看人员",
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        realname: "",
        departname: "",
        roleId: "",
      },
      total: 0,
      labelList: [
        { label: "账号", prop: "username" },
        { label: "用户名", prop: "realname" },
        {
          label: "性别",
          prop: "sex",
          formatter: (i) => (i === 0 ? "男" : "女"),
        },
        { label: "单位", prop: "departname" },
        { label: "职务", prop: "post" },
      ],
      dataList: [],
    };
  },
  computed: {},
  watch: {
    visibleDialog(val) {
      if (val) {
      } else {
      }
    },
  },
  created() {},
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    /**
     * 显示弹窗
     * @param row
     */
    show(row) {
      this.pageInfo.roleId = row["id"];
      this.handleSearch(true);
      this.visibleDialog = true;
    },
    /**
     * 查询
     * @param isReset
     */
    handleSearch(isReset = false) {
      this.pageInfo.pageNo = 1;
      if (isReset) {
        this.pageInfo.realname = "";
        this.pageInfo.departname = "";
      }
      this.getUserByRoleId();
    },
    /**
     * 获取角色相关用户
     */
    getUserByRoleId() {
      this.listLoading = true;
      this.$api.System.getUserListByRoleId(this.pageInfo)
        .then((res) => {
          this.dataList = res["result"]["records"];
          this.total = res["result"]["total"];
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 60vh;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-roleUserDetailDialog {
}
</style>
