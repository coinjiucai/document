<template>
  <div>
    <BaseDialog
      class="component-news-Detail"
      title="资讯详情"
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1200px"
      destroy-on-close
      top="5vh"
    >
      <div class="full-block flex-layout">
        <div class="flex-auto scroll-y" v-if="item.introduction">
          <div class="introduction" v-html="item.introduction"></div>
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
  computed: {},
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
    show(item) {
      this.item = item;
      console.log(item, 'sdd');
      this.visibleDialog = true;
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

  .introduction {
    color: #fff;
    font-size: 14px;
  }
}
</style>
