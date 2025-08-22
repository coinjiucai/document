<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
  >
    <div class="review-pro">
      <div class="status">状态：审核中</div>
      <div>
        <el-steps direction="vertical" :active="1" :space="140">
          <el-step
            title="发起人"
            description="张三 2023-05-24 12：00：15"
          ></el-step>
          <el-step
            title="部门领导"
            description="张三 2023-05-24 12：00：15"
          ></el-step>
          <el-step title="部门领导" description="王五"></el-step>
        </el-steps>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      drawer: false,
      direction: "rtl",
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？", "审核进度")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.review-pro {
  padding: 30px;
  .status {
    margin-bottom: 30px;
    color: #333333;
    font-size: 14px;
  }
}
</style>
