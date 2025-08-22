<template>
  <div>
    <BaseDialog
      class="component-informationDetail"
      title="资讯详情"
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1200px"
    >
      <div class="full-block flex-layout">
        <!-- <img
          src="@/assets/images/personalCenter/information1.png"
          class="flex-none img"
        /> -->
        <div class="flex-auto scroll-y">
          <viewPDF :src="getFileUrl(item.fileUrl)" />
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import viewPDF from '@/components/FileViewer/viewPDF';
export default {
  name: 'informationDetail',
  components: {
    BaseDialog,
    viewPDF
  },
  data() {
    return {
      item: {},
      visibleDialog: false
    };
  },
  methods: {
    getValue(value) {
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    getFileUrl(value) {
      if (value) {
        const fileArray = JSON.parse(value);
        if (fileArray.length > 0) {
          const fileUrl = fileArray[0].fileUrl;
          return this.getValue(fileUrl);
        } else {
          return '';
        }
      } else {
        return '';
      }
    },
    show(item) {
      this.item = item;
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-informationDetail {
  /deep/ .el-dialog .el-dialog__body {
    height: 600px;
    overflow-y: hidden;
  }

  /deep/ .mp-dialog_body {
    height: 100%;
  }
  .img {
    height: 235px;
    margin-bottom: 10px;
  }
  .item {
    min-height: 60px;
    padding: 0 20px;
    span:nth-child(1) {
      font-weight: 600;
      font-size: 24px;
      margin-right: 5px;
    }
    span:nth-child(2) {
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 1px;
    }
  }

  .item:nth-child(odd) {
    background: rgba(33, 149, 101, 0.2);
  }
  .item:nth-child(even) {
    background: rgba(33, 149, 101, 0.1);
  }
}
</style>
