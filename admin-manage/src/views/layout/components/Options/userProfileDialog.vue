<template>
  <div>
    <BaseDialog
      class="full-block component-userProfileDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1200px"
      top="10vh"
    >
      <div class="full-block flex-layout">
        <el-tabs
          v-model="activeName"
          @tab-click="activeTabChange"
          class="flex-layout"
          style="height: 100%"
        >
          <!-- <el-tab-pane label="个人资料" name="base">
            <div>
              个人资料
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="账户安全" name="safe">
            <div>
              <editPassword></editPassword>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
// 注意引入的路劲可能不同
import BaseDialog from '@/components/Base/BaseDialog';
import editPassword from './editPassword';

export default {
  name: 'userProfileDialog',
  components: {
    BaseDialog,
    editPassword
  },
  props: {},
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      title: '个人中心',
      activeName: 'safe'
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
  created() {},
  methods: {
    show() {
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    /**
     * 页签变更
     * @param val
     * @param olVal
     */
    activeTabChange(value) {
      switch (value.name) {
        case 'safe':
          break;
        case 'base':
          break;
        case 'train':
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  line-height: 0 !important;
}

.component-userProfileDialog {
}
</style>
