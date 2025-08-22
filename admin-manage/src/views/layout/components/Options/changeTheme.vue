<!--
  @Name 主题选择
  @Description 切换系统主题，系统基础功能，配合主题控制器和多个主题样式实现主题的切换
  @author 赖明浩
  @date 2023-2-6
-->

<template>
  <div>
    <BaseDialog
        class="component-change-theme"
        :title="title"
        center
        :visible.sync="visibleDialog"
        @closed="close"
        width="700px"
    >
      <el-form
          ref="record"
          label-width="120px"
      >
        <el-form-item label="系统主题：">
          <el-radio-group v-model="userTheme">
            <el-radio v-for="item in themeList" :label="item.value" :key="item.value" border>{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleChangeUserTheme">更换</el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import systemLocalConfig from "@/utils/systemLocalConfig";

export default {
  name: 'editPassword',
  components: {
    BaseDialog
  },
  props: {},
  data() {
    return {
      title: '更换主题',
      visibleDialog: false,
      themeList: [
        {
          value: 'light',
          label: "浅色"
        },
        {
          value: 'dark',
          label: "深色"
        },
        {
          value: 'darkBlue',
          label: "深蓝色"
        },
        {
          value: 'followSystem',
          label: "跟随系统"
        },
      ],
      userTheme: 'light',
    };
  },
  computed: {},
  methods: {
    // 显示
    show() {
      this.userTheme = systemLocalConfig.systemTheme;
      this.visibleDialog = true;
    },
    close() {
      this.visibleDialog = false
    },
    handleChangeUserTheme() {
      systemLocalConfig.systemTheme = this.userTheme
      document.location.reload();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog__header {
  line-height: 0 !important;
}

.component-change-theme {
}
</style>
