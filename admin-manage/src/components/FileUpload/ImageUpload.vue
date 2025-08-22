<template>
  <div style="display: inline-block">
    <el-upload
      class="avatar-uploader"
      :action="attachAction"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <el-image v-if="value" :src="getValue(value)" class="avatar">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <slot name="tips">
      <div v-if="tips" class="el-upload__tip">{{ tips }}</div>
    </slot>
  </div>
</template>

<script>
import Browser from '@/utils/browser';
export default {
  name: 'ImageUpload',
  props: {
    // 使用v-model模式交互数据
    value: {
      type: String | undefined,
      required: true
    },
    //文件类型，如.jpg,.png，注意中间用英文的逗号隔开
    fileType: {
      type: String,
      default: '.jpg,.png,.jpeg,.JPG,.PNG,.JPEG,.gif,.GIF'
    },
    //导入大小限制，单位MB
    sizeLimit: {
      type: Number,
      default: 5
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      attachAction: `${this.getApiUrl()}/mlf-system-service/sys/common/upload`
    };
  },
  methods: {
    getValue(value) {
      if (!value) {
        return '';
      }
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    getApiUrl() {
      return window.VUE_APP_BASE_URL;
    },
    handleAvatarSuccess(res) {
      this.$emit('change', res);
    },
    beforeAvatarUpload(file) {
      const types = this.fileType.replaceAll(',', '|');
      let strRegex = `(${types})$`;
      let re = new RegExp(strRegex);
      if (!re.test(file.name)) {
        this.$popTip.warning(`格式错误，只能上传${this.fileType}类型的图片`);
        return false;
      }
      if (file.size > 1024000 * this.sizeLimit) {
        this.$popTip.warning(`图片过大，不能超过${this.sizeLimit}MB`);
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped lang="scss">
.avatar-uploader {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
