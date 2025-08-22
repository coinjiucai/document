<template>
  <div>
    <BaseDialog
      class="full-block component-policylDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="800px"
      top="20vh"
    >
      <div class="full-block">
        <el-form ref="form" label-width="100px" :model="record" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门名:" prop="username" width>
                <el-input
                  v-model="record.username"
                  class="w230"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名:" prop="username">
                <el-input
                  v-model="record.username"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="单位信息" prop="username" width>
                <el-input
                  v-model="record.username"
                  class="w230"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进入时间" prop="username">
                <el-input
                  v-model="record.username"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="离开时间" prop="username" width>
                <el-input
                  v-model="record.username"
                  class="w230"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事由" prop="username">
                <el-input
                  v-model="record.username"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="接待人员" prop="username" width>
                <el-input
                  v-model="record.username"
                  class="w230"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="username">
                <el-input
                  v-model="record.username"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
export default {
  name: "CriticalDeptDialog",
  components: { BaseDialog },
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
  },
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      record: {
        id: "",
        status: "",
        username: "",
        title: "",
        content: "",
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
    };
  },
  created() {},
  methods: {
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
    show(record, defaultDepart) {
      this.visibleDialog = true;
      // if (record) {
      //   this.title = "编辑";
      //   this.record = Common.partOfObject(
      //     record,
      //     Object.keys(this.record),
      //     true
      //   );
      // } else {
      //   this.record.departId = defaultDepart.id;
      //   this.record.departName = defaultDepart.name;
      //   this.title = "新增";
      // }
    },
    /**
     * 点击保存
     * 区分新增和修改
     */
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          // const type = this.title === "新增" ? "add" : "edit";
          // this.$api.System.saveUser(type, this.record).then(() => {
          //   this.$message.success("保存成功！");
          //   this.handleCloseDialog();
          //   this.$emit("save");
          // });
        }
      });
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
