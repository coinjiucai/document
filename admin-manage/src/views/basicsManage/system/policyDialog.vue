<template>
  <div>
    <BaseDialog
      class="full-block component-policylDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1000px"
      top="10vh"
      destroy-on-close
    >
      <div class="full-block">
        <el-form ref="form" label-width="60px" :model="record" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-form-item label="状态:"> {{ statusText }} </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="发布人:">
                <el-input
                  v-model="record.sender"
                  class="w230"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="标题:">
                <el-input
                  v-model="record.titile"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="username"
                label-width="20px"
                style="height: 360px"
              >
                内容
                <Tinymce
                  v-if="visibleDialog"
                  v-model="record.msgContent"
                  menubar=""
                  :fix-height="true"
                  :height="300"
                  :renew-flag="renewFlag"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="附件上传" label-width="120px">
                <FileUpload :fileList="fileList"></FileUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          style="background: #ff9933; border-color: #ff9933"
          @click="contentPublic"
          >发布</el-button
        >
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import Tinymce from "@/components/Tinymce";
import FileUpload from "@/components/ElFileUpload/FileUpload";
export default {
  name: "userDetailDialog",
  components: { BaseDialog, Tinymce, FileUpload },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "add",
    },
  },
  computed: {
    statusText() {
      const val = this.record.sendStatus;
      if (val == 1) {
        return "已发布";
      } else if (val == 2) {
        return "已撤销";
      } else {
        return "未发布";
      }
    },
  },
  data() {
    return {
      visibleDialog: false,
      record: {
        id: "",
        sendStatus: "0",
        sender: "",
        titile: "",
        msgContent: "",
      },
      rules: {},
      renewFlag: 0,
      fileList: [],
    };
  },
  created() {},
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        id: "",
        sendStatus: "0",
        sender: "",
        titile: "",
        msgContent: "",
      };
    },
    show(record) {
      this.visibleDialog = true;
      if (record) {
        this.record = { ...record };
      } else {
        delete this.record?.id;
      }
    },
    contentPublic() {},
    handleSave() {
      this.$api.System.savePolicy(this.record).then(() => {
        this.$message.success("保存成功！");
        this.handleCloseDialog();
        this.$emit("save");
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
