<!--
  @Name 文件导入
  @Description 文件导入和模板下载以及导入规范说明
  @author 赖明浩
  @date 2023-6-21
  @version 1.0.2
-->

<template>
  <div class="component-fileImportDialog">
    <BaseDialog
      class="importDialog"
      :title="title"
      :visible.sync="visibleDialog"
      @close="visibleDialog = false"
      width="400px"
    >
      <div style="padding: 0 10px 10px">
        <div class="flex-row justify-between" style="justify-content: center">
          <el-button
            type="primary"
            :loading="importLoading"
            icon="el-icon-upload"
            @click="openFilePicker"
          >
            {{ importButtonLabel }}
          </el-button>
          <el-button
            style="margin-left: 60px"
            v-if="showModel"
            type="info"
            class="full_click"
            icon="el-icon-s-order"
            :loading="downloadLoading"
            @click="handleDownloadModel"
          >
            {{ modelButtonLabel }}
          </el-button>
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            :accept="fileType"
            @change="handleFileChange"
          />
        </div>
        <div class="el-upload__tip" style="padding-top: 10px">
          <span><i class="el-icon-star-on"></i>导入规范：</span>
          <ul class="Tips">
            <li v-for="(tip, index) in tips" :key="index">{{ tip }}</li>
          </ul>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog.vue";
import Browser from "@/utils/browser";
export default {
  name: "fileImportDialog",
  components: { BaseDialog },
  props: {
    //弹窗标题
    title: {
      type: String,
      default: "导入",
    },
    //导入按钮名称
    importButtonLabel: {
      type: String,
      default: "点击导入",
    },

    //文件上传地址
    actionUrl: {
      type: String,
      required: true,
    },
    // 是否显示模板下载按钮
    showModel: {
      type: Boolean,
      default: true,
    },
    //模板下载地址
    modelUrl: {
      type: String,
      required: true,
    },
    //模板下载按钮名称
    modelButtonLabel: {
      type: String,
      default: "模板下载",
    },
    //模板名称(包含后缀)
    modelName: {
      type: String,
      required: true,
    },
    //文件类型，如.jpg,.png，注意中间用英文的逗号隔开
    fileType: {
      type: String,
      required: true,
    },
    //导入规范信息
    tips: {
      type: Array,
      default: () => [],
    },
    //导入大小限制，单位MB
    sizeLimit: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      visibleDialog: false,
      downloadLoading: false,
      importLoading: false,
    };
  },
  created() {},
  mounted() {},
  filters: {},
  watch: {},
  computed: {},
  methods: {
    show() {
      this.visibleDialog = true;
    },
    /**
     * 点击上传文件
     */
    openFilePicker() {
      // 触发文件选择对话框
      this.$refs.fileInput.click();
    },
    /**
     * 用户选择文件后的处理
     * @param event
     */
    handleFileChange(event) {
      // 获取选择的文件对象
      const file = event.target.files[0];
      const checked = this.beforeAvatarUpload(file);
      if (!checked) return;
      // 文件上传通常需要将文件的二进制数据包含在请求体中，而不是简单的将文件名作为请求的一部分。
      // 将文件添加到 formData 中可以将文件的内容正确地封装到请求中。
      const formData = new FormData();
      formData.append("file", file);

      this.importLoading = true;
      this.$api.globalAPI
        .fileUpload(this.actionUrl, formData)
        .then((res) => {
          this.handleAvatarSuccess(res, file);
        })
        .finally(() => {
          this.importLoading = false;
          // 清空已选文件
          event.target.value = "";
        });
    },
    /**
     * 文件上传前的校验
     * @param file
     * @returns {boolean}
     */
    beforeAvatarUpload(file) {
      const types = this.fileType.replaceAll(",", "|");
      let strRegex = `(${types})$`;
      let re = new RegExp(strRegex);
      if (!re.test(file.name)) {
        this.$popTip.warning(`文件格式不正确，详情参见导入规范！${file.name}`);
        return false;
      }
      if (file.size > 1024000 * this.sizeLimit) {
        this.$popTip.warning("文件过大，详情参见导入规范！");
        return false;
      }
      return true;
    },
    /**
     * 文件添加
     * @param response
     * @param file
     */
    handleAvatarSuccess(response, file) {
      if (response.hasOwnProperty("success") && response["success"]) {
        this.$message.success("信息已导入！");
        this.$emit("success", response, file);
        this.visibleDialog = false;
      } else {
        this.$popTip.failed(response["message"]);
      }
    },
    /**
     * 点击下载模板
     * @return {*}
     */
    handleDownloadModel() {
      // 直接使用下载模板链接下载
      const downloadLink = document.createElement("a");
      downloadLink.href = this.modelUrl;
      downloadLink.setAttribute("download", this.modelName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-dialog__header {
    padding: 10px;
  }

  .el-dialog__headerbtn {
    top: 10px;
  }
}

.component-fileImportDialog {
}
</style>
<style lang="scss"></style>
