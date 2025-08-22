<template>
  <div v-if="visibleDialog">
    <BaseDialog
      class="full-block"
      title="附件预览"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      :width="windowWidth"
      top="5vh"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <div class="preview-container">
        <div
          v-if="fileType === 'image'"
          style="height: 70vh; align-items: baseline; overflow-y: auto"
        >
          <img
            style="width: 100%; height: auto"
            :src="getValue(url)"
            alt="预览图片"
          />
        </div>
        <div v-if="fileType === 'pdf'">
          <iframe
            :name="file.name"
            :src="getValue(url)"
            width="100%"
            height="800"
          ></iframe>
        </div>
        <!-- <div v-if="fileType === 'word'">
        <iframe :src="getValue(url)" width="600" height="800"></iframe>
      </div>
      <div v-if="fileType === 'excel'">
        <iframe :src="getValue(url)" width="600" height="800"></iframe>
      </div> -->
        <div v-if="fileType === 'video'">
          <video controls :src="getValue(url)" width="600"></video>
        </div>
        <div v-if="fileType === 'audio'">
          <audio controls :src="getValue(url)"></audio>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import Browser from '@/utils/browser';
export default {
  props: {},
  components: {
    BaseDialog
  },
  data() {
    return {
      windowWidth: '1000px',
      visibleDialog: false,
      fileType: '',
      url: '',
      file: {
        name: ''
      }
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
    show(file) {
      this.file = file;
      const fileType = this.getFileTypeFromName(file.name);
      this.fileType = fileType;
      this.url = file.fileUrl;
      if (fileType == 'audio') {
        this.windowWidth = '400px';
        this.visibleDialog = true;
      } else if (fileType == 'video') {
        this.windowWidth = '800px';
        this.visibleDialog = true;
      } else if (fileType == 'image') {
        this.windowWidth = '800px';
        this.visibleDialog = true;
      } else if (fileType == 'pdf') {
        this.windowWidth = '1000px';
        this.visibleDialog = true;
      } else {
        Browser.downLoad(file.fileUrl);
        // this.$message.warning("暂不支持该格式的预览！");
      }
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    getFileTypeFromName(fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'image';
        case 'pdf':
          return 'pdf';
        case 'mp4':
        case 'avi':
        case 'mov':
          return 'video';
        case 'mp3':
        case 'wav':
        case 'ogg':
          return 'audio';
        case 'doc':
        case 'docx':
          return 'word';
        case 'xls':
        case 'xlsx':
          return 'excel';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-container {
  > div {
    display: flex;
    justify-content: center;
  }
}
</style>
