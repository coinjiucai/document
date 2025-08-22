<template>
  <BaseDialog
    class="full-block component-table-dialog full-dialog"
    :title="title"
    center
    :visible.sync="visibleDialog"
    @closed="handleCloseDialog"
    :width="width"
    top="0.5vh"
    destroy-on-close
  >
    <div class="full-block" style="height: 82vh">
      <viewPDF :src="pdfUrl"></viewPDF>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import viewPDF from '@/components/FileViewer/viewPDF.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'ltDialog',
  components: { BaseDialog, FormItem, viewPDF },
  props: {
    title: {
      type: String,
      default: () => {
        return '预览';
      }
    },
    width: {
      type: String,
      default: () => {
        return '1200px';
      }
    }
  },
  data() {
    return {
      pdfUrl: '',
      visibleDialog: false
    };
  },
  computed: {
    ...mapGetters(['userId'])
  },
  mounted() {
    // this.getInfo();
  },
  methods: {
    show(url) {
      this.pdfUrl = url;
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-bottom: 10px;
}
/deep/.table-dialog-list {
  height: 363px;
}
/deep/.el-table__body-wrapper,
/deep/.el-table__header-wrapper {
  width: 100% !important;
}
.base-table-wrap {
  overflow-x: auto;
}
</style>
