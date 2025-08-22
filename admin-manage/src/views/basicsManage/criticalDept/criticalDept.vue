<template>
  <div
    class="component-policy theme-background-middle flex-layout full-block pa10"
  >
    <div class="flex-none theme-buttons">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="showContentDetailDialog(false)"
        >添加</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="showContentDetailDialog(true)"
        >编辑</el-button
      >
      <el-button type="danger" icon="el-icon-delete" @click="batchDelete"
        >删除</el-button
      >
    </div>
    <el-divider></el-divider>
    <div class="flex-none">
      <el-form inline style="text-align: right">
        <el-form-item label="标题:">
          <el-input
            class="w160"
            size="mini"
            v-model="pageInfo.userid"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleSearch(false)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-auto">
      <BaseTable
        ref="table"
        :page-info="pageInfo"
        height="100%"
        :label-list="labelList"
        :list="dataList"
        :total="total"
        @page-change="getList"
        @selectRowList="selectRowList"
      >
        <template v-slot:status="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </BaseTable>
    </div>
    <CriticalDeptDialog
      ref="criticalDialog"
      :treeList="treeList"
      :title="criticalDialogTitle"
      :type="criticalDialogType"
      @save="getList"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/Base/BaseTable";
// import SymbolIcon from "@/components/IconFont/symbolIcon";
import CriticalDeptDialog from "./criticalDeptDialog.vue";
export default {
  name: "CriticalDept",
  components: { BaseTable, CriticalDeptDialog },
  props: {},
  data() {
    return {
      treeList: [],
      labelList: [
        { label: "部门名", prop: "departName" },
        { label: "部位", prop: "position" },
        { label: "管理负责人", prop: "responsibleName" },
        { label: "撤销", prop: "status", special: true },
      ],
      dataList: [],
      pageInfo: {
        pageSize: 10,
        pageNo: 1,
        userid: "",
        username: "",
        logType: "",
        startTime: "",
        endTime: "",
      },
      total: 0,
      // 弹窗
      criticalDialogTitle: "添加要害部门",
      criticalDialogType: "add",
      selection: [],
    };
  },
  created() {},
  mounted() {
    this.getTreeList();
    this.getList();
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    getTreeList() {
      this.$api.System.getDepartTree().then(({ code, result }) => {
        console.log(code, result);
        if (code == 200) {
          this.treeList = result;
        }
      });
    },
    selectRowList(list) {
      this.selection = list;
    },
    /**
     * 获取列表
     */
    getList() {
      this.$api.System.getSysprivacyplacePageList(this.pageInfo).then((res) => {
        this.dataList = res["result"].records;
        this.total = res["result"].total;
      });
    },
    /**
     * 点击查询
     * @param reset 查询前是否重置
     */
    handleSearch(reset) {
      // 重置表格勾选
      this.$refs.table.resetSelection();
      if (reset) {
        this.pageInfo = {
          pageSize: 10,
          pageNo: 1,
          userid: "",
          username: "",
          logType: "",
          startTime: "",
          endTime: "",
        };
      } else {
        this.pageInfo.pageNo = 1;
      }
      this.getList();
    },
    showContentDetailDialog(type) {
      if (type) {
        this.criticalDialogTitle = "编辑要害部门";
        this.criticalDialogType = "edit";
        if (this.selection.length == 0 || this.selection.length > 1) {
          this.$message.warning("请选择一条数据!");
          return;
        } else {
          this.$refs.criticalDialog.show(this.selection[0]);
        }
      } else {
        this.criticalDialogTitle = "添加要害部门";
        this.criticalDialogType = "add";
        this.$refs.criticalDialog.show();
      }
    },
    changeStatus(row) {
      this.$api.System.saveSysprivacyplace(row).then(() => {});
    },
    batchDelete() {
      const ids = this.selection.map((v) => v.id);
      this.$confirm("是否确认删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.System.batchSysprivacyplaceDelete({ ids: ids.join(",") })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
            }
          })
          .finally(() => {
            this.getList();
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.component-policy {
}
</style>
