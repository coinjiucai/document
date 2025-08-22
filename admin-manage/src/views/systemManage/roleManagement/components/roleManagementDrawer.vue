<template>
  <div class="component-roleManagementDrawer">
    <el-drawer
      title="角色权限"
      direction="rtl"
      :visible="visible"
      :before-close="beforeClose"
    >
      <div class="container scroll-y pall-mid">
        <el-tree show-checkbox :data="data" :props="defaultProps"></el-tree>
      </div>
      <div class="footer flex-row justify-center">
        <el-button class="flex1" @click="beforeClose">取消</el-button>
        <el-button class="flex1" type="primary" @click="beforeClose"
          >保存并关闭</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "component-roleManagementDrawer",
  data() {
    return {
      visible: false,
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    beforeClose() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.component-roleManagementDrawer {
  /deep/ .el-drawer__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 0;
    padding: 15px 20px;
  }

  .container {
    height: calc(100% - 66px);
  }

  .footer {
    height: 66px;
    padding: 15px 20px;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
