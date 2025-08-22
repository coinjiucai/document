<template>
  <BaseDialog
    title="选择人员"
    center
    :visible.sync="visibleDialog"
    @close="visibleDialog = false"
    :destroy-on-close="true"
    width="1200px"
    top="20vh"
  >
    <div class="flex-row full-block">
      <LeftCatalogue
        ref="catalogue"
        title="组织架构"
        :default-props="{ label: 'title', value: 'value' }"
        node-key="key"
        :tree-data.sync="treeList"
        :get-url="getUrl"
        :disabledOption="true"
        @current-change="handleCurrentChange"
      >
      </LeftCatalogue>
      <div class="flex-auto theme-background-middle flex-layout pa10">
        <Jmtable
          ref="alistPage"
          :params="params"
          :fieldsConfig="fieldsConfig"
          :buttonList="[]"
          :labelList="labelList"
          :listApi="listApi"
          :showPagination="false"
          @selectRowList="selectRowList"
        >
        </Jmtable>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button type="info" @click="handleCloseDialog">取消</el-button>
    </span>
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import LeftCatalogue from "@/components/Project/LeftCatalogue";
export default {
  name: "UserSelectDialog",
  components: {
    BaseDialog,
    LeftCatalogue,
  },
  data() {
    return {
      visibleDialog: false,
      getUrl: "/mlf-csjm-service/sys/sysDepart/queryIdTree",
      alistPage: null,
      treeList: [],
      // 搜索参数
      params: {
        realname: "",
        orgCode: "",
      },
      fieldsConfig: [
        {
          label: "姓名",
          compType: "input",
          width: 160,
          prop: "realname",
        },
      ],
      // 表格字段列配置
      labelList: [
        {
          label: "姓名",
          prop: "realname",
        },
        { label: "账号", prop: "username" },
      ],
      orgInfo: {
        orgCode: "",
        orgCodeTxt: "",
      },
      listApi: [],
      selection: [],
    };
  },
  mounted() {},
  methods: {
    show() {
      this.visibleDialog = true;
    },
    handleCurrentChange(data) {
      this.params.orgCode = data.orgCode;
      this.listApi = ["System", "getUserList"];
      this.orgInfo.orgCode = data.orgCode;
      this.orgInfo.orgCodeTxt = data.title;
      this.$nextTick(() => {
        this.$refs.alistPage.getList();
      });
    },
    selectRowList(val) {
      this.selection = val;
    },
    confirm() {
      const ids = this.selection.map((v) => v.id);
      if (ids.length == 0 || ids.length > 1) {
        this.$message.warning("请选择一条数据!");
      } else {
        this.$emit("confirm", this.selection[0]);
        this.visibleDialog = false;
      }
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
  },
};
</script>
