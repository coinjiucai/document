<template>
  <BaseDialog
    class="full-block component-table-dialog"
    title="人员选择"
    center
    :visible.sync="visibleDialog"
    @close="handleCloseDialog"
    width="98%"
    top="20vh"
    destroy-on-close
  >
    <div class="flex-row full-block" style="min-height: 500px">
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
        <ListPage
          v-if="listApi.length > 0"
          :selectLimit="1"
          ref="listPage"
          :params="params"
          :fieldsConfig="fieldsConfig"
          :labelList="labelList"
          :buttonList="[]"
          :listApi="listApi"
          @selectRowList="selectRowList"
        >
        </ListPage>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button type="info" @click="handleCloseDialog">取消</el-button>
    </span>
  </BaseDialog>
</template>

<script>
import LeftCatalogue from "@/components/Project/LeftCatalogue";
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
export default {
  name: "UserSelectDialog",
  cname: "人员选择弹窗",
  components: {
    LeftCatalogue,
    ListPage,
    BaseDialog,
  },
  props: {},
  data() {
    return {
      visibleDialog: false,
      getUrl: "/mlf-csjm-service/sys/sysDepart/queryIdTree",
      treeList: [],
      params: {
        realname: "",
        orgCode: "",
      },
      fieldsConfig: [
        {
          label: "姓名",
          compType: "input",
          width: 160,
          placeholder: "",
          prop: "realname",
        },
      ],
      // 表格字段列配置
      labelList: [
        {
          label: "状态",
          prop: "status",
          compType: "select",
          dictCode: true,
        },
        { label: "账号", prop: "username" },
        { label: "姓名", prop: "realname" },
        { label: "单位", prop: "orgCodeTxt" },
        { label: "身份证号", prop: "idCard" },
        {
          label: "联系方式",
          prop: "telephone",
        },
      ],
      listApi: [],
      selection: [],
    };
  },
  methods: {
    show() {
      this.visibleDialog = true;
    },
    handleCurrentChange(data) {
      this.params.orgCode = data.orgCode;
      this.listApi = ["System", "getUserList"];
      this.$nextTick(() => {
        this.$refs.listPage.getList();
      });
    },
    selectRowList(selection) {
      this.selection = selection;
    },
    confirm() {
      this.visibleDialog = false;
      if (this.selection.length > 0) {
        // this.$api.System.userQueryById({
        //   id: this.selection[0].id,
        // }).then((res) => {
        //   const item = res.result.records[0];
        //   if (item.nativePlace) {
        //     item.nativePlace = JSON.parse(item.nativePlace);
        //   }
        //   this.$emit("confirm", item);
        // });
        this.$emit("confirm", this.selection[0]);
      } else {
        this.$emit("confirm", "");
      }
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
  },
};
</script>
