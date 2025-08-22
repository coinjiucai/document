<template>
  <div class="el-file-upload">
    <!-- 加载状态显示 -->
    <div v-if="isUploading" class="upload-loading">
      <i class="el-icon-loading"></i> 上传中...
    </div>
    <el-upload
      ref="upload"
      :limit="limit"
      multiple
      :action="attachAction"
      :file-list="file"
      :on-preview="handlePreview"
      :on-success="handleAvatarSuccess"
      :on-remove="handleAvatarRemove"
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :headers="{ 'X-Access-Token': token }"
      v-bind="$attrs"
      :accept="$attrs.accept ? $attrs.accept : '*'"
      :class="{
        'upload-box': true,
        'hide-button':
          limit == 0 || (limit > 0 && fileList.length < limit) ? false : true,
        'list-show': showMode != 1 && fileList.length > 0
      }"
    >
      <el-button :size="size" type="primary" :disabled="isUploading">{{
        $attrs.title ? $attrs.title : '上传附件'
      }}</el-button>
      <div slot="tip" class="el-upload__tip" v-if="tips.length > 0">
        <ul class="Tips">
          <li v-for="(tip, index) in tips" :key="index">{{ tip }}</li>
        </ul>
      </div>
    </el-upload>
    <previewFile ref="previewFile"></previewFile>
  </div>
</template>

<script>
import previewFile from './previewFile.vue';
import { getToken } from '@/utils/auth';
export default {
  name: 'FileUpload',
  components: {
    previewFile
  },
  props: {
    fileList: {
      type: Array,
      required: true
    },
    limit: {
      type: Number,
      default: 1
    },
    tips: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => 'mini'
    },
    showMode: {
      type: Number,
      default: 1 // 显示上传按钮
    },
    record: {
      type: Object,
      default: () => {} // 用于标识表格父级编辑的row数字
    }
  },
  data() {
    return {
      attachAction: `${this.getApiUrl()}/mlf-system-service/sys/common/upload`,
      token: '',
      isUploading: false // 新增上传状态变量
    };
  },
  created() {
    const token = getToken();
    this.token = token;
  },
  mounted() {},
  filters: {},
  watch: {},
  computed: {
    file() {
      if (this.fileList.length) {
        this.fileList.map((item) => {
          this.$set(
            item,
            'name',
            item.hasOwnProperty('name') ? item.name : item.file_name
          );
        });
      }
      return this.fileList;
    }
  },
  methods: {
    getApiUrl() {
      return window.VUE_APP_BASE_URL;
    },
    /**
     * 文件添加
     * @param response
     * @param file
     * @param fileList
     */
    handleAvatarSuccess(response, file, fileList) {
      const arr = [];

      fileList.forEach((item) => {
        if (item.hasOwnProperty('response')) {
          const message = item.response.message;
          if (message) {
            arr.push({
              name: file.name,
              fileUrl: message
            });
          } else {
            arr.push(item.response.result);
          }
        } else {
          arr.push(item);
        }
      });
      this.$emit('update:fileList', arr);
      this.$emit('on-success', arr, this.record);
      this.isUploading = false; // 上传成功，关闭加载状态
    },
    /**
     * 删除之前
     * @param file
     * @param fileList
     * @returns {Promise<MessageBoxData>}
     */
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, '提示', {
        type: 'warning'
      });
    },
    /**
     * 文件删除
     * @param file
     * @param fileList
     */
    handleAvatarRemove(file, fileList) {
      this.$emit('update:fileList', fileList);
      this.$emit('on-success', fileList);
      this.isUploading = false; // 删除文件，关闭加载状态
    },
    /**
     * 文件上传前的校验
     * @param file
     * @returns {boolean}
     */
    beforeAvatarUpload(file) {
      const accept = this.$attrs.accept;
      let extensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'tiff',
        'tif',
        'webp',
        'ico',
        'svg',
        'doc',
        'docx',
        'pdf',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'txt',
        'zip',
        'rar',
        'mp3',
        'mp4'
      ];
      if (accept) {
        extensions = accept.replaceAll('.', '').split(',');
      }
      const fileExtensions = extensions.join('|');
      const strRegex = new RegExp(`\\.(${fileExtensions})$`, 'i');
      const re = new RegExp(strRegex, 'ig');
      console.log(strRegex, '--------', file.name);
      if (!re.test(file.name)) {
        this.$message({
          type: 'error',
          message: `只能上传${extensions.join('、')}格式！`,
          duration: 2000
        });
        return false;
      }
      this.isUploading = true; // 开始上传，开启加载状态
      return true;
    },
    handlePreview(file) {
      if (file.id) {
        window.open(file.url, '_blank');
      } else {
        // this.$message.error("预览新增的附件前请先保存");
        this.$refs.previewFile.show(file);
      }
    },
    /**
     * 多选个数超出提示
     */
    handleExceed(files, fileList) {
      this.$popTip.warning(
        `当前限制选择 ${this.limit}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-file-upload {
  .list-show {
    /deep/.el-upload {
      display: none;
    }
    /deep/.el-upload-list__item:first-child {
      margin-top: 6px;
    }
  }
  .Tips {
    > li {
      line-height: 20px;
      padding-bottom: 5px;
    }
  }
  .hide-button {
    /deep/.el-upload {
      display: none;
    }
  }
  .upload-loading {
    margin-bottom: 10px;
    color: #606266;
  }
}
</style>
