<template>
  <div>
    <BaseDialog
      class="dialog"
      title=""
      :visible.sync="visible"
      @closed="handleCloseDialog"
      width="600px"
    >
      <template slot="title"></template>
      <div class="full-block">
        <div class="flex-column flex-center">
          <img
            src="@/assets/images/psychologicalEducation/ok.png"
            class="img"
          />
          <div class="content">您已完成《托马斯沟通的艺术》的学习！</div>
          <div>
            点击进行<el-link type="primary" class="font-18"
              >课程习题训练</el-link
            >
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleCloseDialog"
          >文件上传</el-button
        >
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';

export default {
  name: 'FinishStudyDialog',
  components: {
    BaseDialog
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    handleCloseDialog() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  img {
    width: 143px;
    height: 143px;
    margin-top: 60px;
  }
  .content {
    font-size: 20px;
    margin-top: 40px;
    margin-bottom: 15px;
  }
}
</style>
