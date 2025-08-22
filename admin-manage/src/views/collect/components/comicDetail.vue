<template>
  <div>
    <BaseDialog
      class="component-comicDetail"
      title="漫画详情"
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="700px"
    >
      <div class="full-block flex-layout">
        <div class="flex-auto scroll-y">
          <img :src="fileUrl" class="mb10 img" />
        </div>
        <div class="flex-none flex-row justify-center mt10">
          <span class="last" @click="changePre">上一页</span>
          <span class="next" @click="changeNext">下一页</span>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';

export default {
  name: 'comicDetail',
  components: {
    BaseDialog
  },
  data() {
    return {
      item: {},
      visibleDialog: false,
      index: 0,
      fileList: []
    };
  },
  computed: {
    fileUrl() {
      const fileUrl =
        this.fileList.length > 0 && this.fileList[this.index]
          ? this.fileList[this.index].fileUrl
          : '';
      return fileUrl ? this.getValue(fileUrl) : '';
    }
  },
  methods: {
    getValue(value) {
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    show(item) {
      this.item = item;
      const fileUrl = this.item.fileUrl;
      this.fileList = fileUrl ? JSON.parse(fileUrl) : [];
      this.visibleDialog = true;
    },
    // 上一页
    changePre() {
      if (this.fileList.length == 0) {
        return false;
      }
      if (this.index == 0) {
        this.$message.warning('当前页已经是第一页！');
      } else {
        this.index -= 1;
      }
    },
    // 下一页
    changeNext() {
      if (this.fileList.length == 0) {
        return false;
      }
      if (this.index == this.fileList.length - 1) {
        this.$message.warning('当前页已经是最后一页！');
      } else {
        this.index += 1;
      }
    },
    handleCloseDialog() {
      this.fileList = [];
      this.visibleDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-comicDetail {
  /deep/ .el-dialog .el-dialog__body {
    height: 700px;
    padding-bottom: 10px;
    // overflow-y: hidden;
  }

  /deep/ .mp-dialog_body {
    height: 100%;
  }
  .img {
    width: 100%;
  }
  .last {
    width: 160px;
    height: 47px;
    line-height: 47px;
    text-align: center;
    border: solid 1px #1e9d66;
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
  .next {
    width: 160px;
    height: 47px;
    background-color: #1e9d66;
    line-height: 47px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
