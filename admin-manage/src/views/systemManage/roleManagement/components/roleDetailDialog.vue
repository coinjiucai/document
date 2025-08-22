<template>
  <div>
    <BaseDialog
      class="full-block component-roleDetailDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="600px"
      top="10vh"
    >
      <div class="full-block flex-layout">
        <el-form ref="form" :model="form" :rules="rules" label-width="105px">
          <el-form-item label="用户类型" prop="roleType">
            <FormItem
              v-model="form.roleType"
              compType="input"
              placeholder="用户类型"
            ></FormItem>
          </el-form-item>
          <el-form-item label="角色名称：" prop="roleName">
            <el-input
              placeholder="请输入角色名称"
              maxlength="150"
              v-model.trim="form.roleName"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input
              placeholder="请输入角色描述"
              maxlength="200"
              type="textarea"
              show-word-limit
              :rows="4"
              v-model.trim="form.description"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save"
          >确定</el-button
        >
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import FormItem from "@/components/Form/Item";
export default {
  name: "roleDetailDialog",
  components: { BaseDialog, FormItem },
  props: {},
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      // 弹框的标题
      title: "新增",
      // 表单
      form: {
        // 角色名称
        roleName: "",
        roleType: "",
        // 角色描述
        description: "",
        // 角色编码（没有显示，设置的是当前时间戳）
        roleCode: "",
      },
      // 表单校验规则
      rules: {
        roleType: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      // 保存按钮加载动画
      saveLoading: false,
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
      this.reset();
    },
    /**
     * 显示弹框
     * @param type
     * @param row
     */
    show(type, row) {
      this.type = type;
      if (type === "new") {
        this.title = "新增";
        this.form.roleCode = new Date().getTime();
      } else {
        this.title = "编辑";
        this.form = {
          id: row.id,
          roleName: row.roleName,
          description: row.description,
          roleType: row.roleType ? row.roleType : "",
          roleCode: row.roleCode,
        };
      }
      this.visibleDialog = true;
    },

    /**
     * 重置数据
     */
    reset() {
      this.title = "新增";
      this.form = {
        roleName: "",
        description: "",
        roleType: "",
        roleCode: "",
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        this.$refs?.form?.clearValidate();
      });
    },
    /**
     * 新增编辑角色
     */
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          this.$api.System.saveRoleInfo(this.type, this.form)
            .then(() => {
              this.$message.success("保存成功!");
              this.$emit("save");
              this.handleCloseDialog();
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 260px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-roleDetailDialog {
}
</style>
