<template>
  <div>
    <BaseDialog
      class="full-block component-policylDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="600px"
      top="20vh"
    >
      <div class="full-block" style="padding: 0 40px">
        <el-form ref="form" label-width="100px" :model="record" :rules="rules">
          <el-form-item label="部门名:" prop="username">
            <el-input
              v-model="record.departName"
              maxlength="30"
              placeholder="请输入"
              @focus="showDepet($event)"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="部位:" prop="username">
            <el-input
              v-model="record.position"
              maxlength="30"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理责任人:" prop="username">
            <el-input
              v-model="record.responsibleName"
              @focus="showSelectDialog($event)"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否撤销:" prop="username" width>
            <el-switch
              v-model="record.status"
              active-value="1"
              inactive-value="2"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
    <TableDialog
      title="选择管理责任人"
      :selectValue="selectValue"
      searchProp="realname"
      :listApi="['System', 'getUserList']"
      :labelList="tableDialogLableList"
      ref="tableDialog"
      @confirm="confirmSmSelect"
    ></TableDialog>
    <BaseDialog
      title="选择部门"
      center
      :visible.sync="depetVisibleDialog"
      @close="depetVisibleDialog = false"
      width="600px"
      top="20vh"
    >
      <el-tree
        :data="treeList"
        :props="{ label: 'title', children: 'children' }"
        @node-click="handleNodeClick"
      ></el-tree>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import TableDialog from "@/components/TableDialog";
// import { regionData } from "element-china-area-data";
export default {
  name: "CriticalDeptDialog",
  components: { BaseDialog, TableDialog },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "add",
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    treeList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      depetVisibleDialog: false,
      record: {
        departId: "",
        departName: "",
        responsibleName: "",
        responsibleUserid: "",
        status: 1,
      },
      rules: {
        // departId: [
        //   { required: true, message: "请选择所属单位！", trigger: "change" },
        // ],
        // username: [
        //   { required: true, message: "请输入账号！", trigger: "blur" },
        // ],
      },
      renewFlag: 0,
      selectValue: "",
      tableDialogLableList: [
        {
          label: "状态",
          prop: "status",
          // parent: "status_parent",
          // special: true,
        },
        { label: "账号", prop: "username" },
        { label: "身份证号", prop: "idCard" },
        {
          label: "联系方式",
          prop: "telephone",
        },
        { label: "密级", prop: "classification" },
      ],
    };
  },
  created() {},
  methods: {
    init() {
      this.record = {
        departId: "",
        departName: "",
        position: "",
        responsibleName: "",
        responsibleUserid: "",
        status: 1,
      };
    },
    showDepet(event) {
      event.target.blur();
      this.depetVisibleDialog = true;
    },
    handleNodeClick(node) {
      this.depetVisibleDialog = false;
      this.record.departId = node.value;
      this.record.departName = node.title;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      // this.record = {
      //   id: "",
      //   username: "",
      //   departId: "",
      //   departName: "",
      //   remark: "",
      // };
      // this.$nextTick(() => {
      //   // 重置表单的校验状态
      //   this.$refs?.form?.clearValidate();
      // });
    },
    /**
     * 显示弹窗
     * @param record 用户信息，编辑时传入
     * @param defaultDepart 默认单位信息，新增时用到
     */
    show(record = null) {
      this.init();
      if (record) {
        this.record = { ...record };
      }
      this.visibleDialog = true;
    },
    /**
     * 点击保存
     * 区分新增和修改
     */
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          // const type = this.title === "新增" ? "add" : "edit";
          this.$api.System.saveSysprivacyplace(this.record).then(() => {
            this.$message.success("保存成功！");
            this.handleCloseDialog();
            this.$emit("save");
          });
        }
      });
    },
    showSelectDialog(event) {
      event.target.blur();
      this.$refs.tableDialog.show();
    },
    confirmSmSelect(selection) {
      if (selection.length == 0 || selection.length > 1) {
        this.$message.warning("请选择一条数据!");
      } else {
        this.$refs.tableDialog.handleCloseDialog();

        const { id, realname } = selection[0];
        this.selectValue = realname;
        this.$set(this.record, "responsibleUserid", id);
        this.$set(this.record, "responsibleName", realname);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  max-height: 500px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-policyDetailDialog {
}
</style>
