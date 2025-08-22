<template>
  <div>
    <BaseDialog
        class="full-block component-FileViewerDialog"
        :title="title"
        center
        :visible.sync="visibleDialog"
        @closed="handleCloseDialog"
        width="1200px"
        top="10vh">
      <div class="full-block flex-layout">
        <FileViewer :file-list="fileList" :current-file.sync="currentFile"></FileViewer>
      </div>
    </BaseDialog>
  </div>
</template>

<script>

// 注意引入的路劲可能不同
import BaseDialog from "@/components/Base/BaseDialog";
import FileViewer from "@/components/FileViewer/FileViewer.vue";

export default {
  name: "FileViewerDialog",
  components: {FileViewer, BaseDialog},
  props: {},
  mounted() {

  },
  data() {
    return {
      visibleDialog: false,
      title: '文件预览',
      fileList: [],
      currentFile: {}
    };
  },
  computed: {},
  watch: {
    visibleDialog(val) {
      if (val) {

      } else {

      }
    }
  },
  created() {
  },
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false
    },
    show(fileList, current) {
      this.fileList = fileList;
      this.currentFile = current;
      this.visibleDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 60vh;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-FileViewerDialog {

}
</style>
