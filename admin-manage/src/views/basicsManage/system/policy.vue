<template>
  <div
    class="component-policy theme-background-middle flex-layout full-block pa10"
  >
    <div class="flex-none theme-buttons">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="showContentDetailDialog(false)"
        >发布</el-button
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
            v-model="pageInfo.titile"
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
        <template v-slot:action="scope">
          <div class="action-buttons">
            <div class="edit" @click="edit(scope.row)">
              <div>
                <SymbolIcon name="#icon-tianxie" />
              </div>
              <div>修改</div>
            </div>
            <div class="delete" @click="batchDelete(scope.row.id)">
              ✘&nbsp;删除
            </div>
            <!-- <div class="to-top">
              <div><SymbolIcon name="#icon-xiangshangzhanhang" /></div>
              <div>置顶</div>
            </div> -->
            <div class="cancel-top">
              <div><SymbolIcon name="#icon-zhongzhi" /></div>
              <div>取消置顶</div>
            </div>
          </div>
        </template>
      </BaseTable>
    </div>
    <PolicyDialog
      ref="policyDialog"
      :title="policyDialogTitle"
      :type="policyDialogType"
      @save="getList"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/Base/BaseTable";
import SymbolIcon from "@/components/IconFont/symbolIcon";
import PolicyDialog from "./policyDialog.vue";
export default {
  name: "LogManage",
  components: { BaseTable, SymbolIcon, PolicyDialog },
  props: {},
  data() {
    return {
      labelList: [
        {
          label: "状态",
          prop: "sendStatus",
          formatter: (val) => {
            // （0未发布，1已发布，2已撤销）
            if (val == 1) {
              return "已发布";
            } else if (val == 2) {
              return "已撤销";
            } else {
              return "未发布";
            }
          },
        },
        { label: "标题", prop: "titile" },
        { label: "发布人", prop: "sender" },
        { label: "发布时间", prop: "sendTime" },
        { label: "操作", prop: "action", special: true },
      ],
      dataList: [],
      pageInfo: {
        pageSize: 10,
        pageNo: 1,
        titile: "",
      },
      total: 0,
      selection: [],
      // 弹窗
      policyDialogTitle: "发布信息",
      policyDialogType: "add",
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    selectRowList(list) {
      this.selection = list;
    },
    getList() {
      this.$api.System.getPolicyList(this.pageInfo).then((res) => {
        this.dataList = res["result"].records;
        this.total = res["result"].total;
      });
    },
    handleSearch(reset) {
      // 重置表格勾选
      this.$refs.table.resetSelection();
      if (reset) {
        this.pageInfo = {
          pageSize: 10,
          pageNo: 1,
          titile: "",
        };
      } else {
        this.pageInfo.pageNo = 1;
      }
      this.getList();
    },
    showContentDetailDialog() {
      this.policyDialogType = "add";
      this.$refs.policyDialog.show();
    },
    // 批量删除
    batchDelete(id = "") {
      if (this.selection.length == 0 && !id) {
        this.$message.warning("请选择请选择删除内容!");
      } else {
        const ids = this.selection.map((v) => v.id);
        this.$confirm("是否确认删除该数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$api.System.batchPolicyDelete({ ids: id ? id : ids.join(",") })
            .then((res) => {
              if (res.code == 200) {
                this.$message.success("删除成功");
              }
            })
            .finally(() => {
              this.getList();
            });
        });
      }
    },
    edit(record) {
      this.policyDialogType = "edit";
      this.$refs.policyDialog.show(record);
    },
  },
};
</script>

<style lang="scss" scoped>
.component-policy {
  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    > div {
      display: flex;
      cursor: pointer;
      font-weight: 700;
      > div:nth-child(1) {
        margin-top: 2px;
        font-size: 12px;
        margin-right: 6px;
      }
      margin: 0 10px;
    }
    .edit {
      color: #009933;
    }
    .delete {
      color: #ff0033;
    }
    .to-top {
      color: #ff9933;
    }
    .cancel-top {
      color: #999999;
    }
  }
}
</style>
