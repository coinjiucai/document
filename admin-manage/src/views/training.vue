<template>
  <div class="component-training full-block" v-loading="loading">
    <iframe
      id="myIframe"
      src=""
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
    <div class="close" @click="back()">
      <i class="el-icon-circle-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'training',
  data() {
    return {
      loading: false,
      testUrl: ''
    };
  },
  methods: {},
  mounted() {
    const query = this.$route.query;
    if (query.url) {
      this.testUrl = query.url;
      // 获取 iframe 元素
      this.loading = true;
      const iframe = document.getElementById('myIframe');

      // 为 iframe 添加 load 事件监听器
      iframe.addEventListener('load', () => {
        this.loading = false;
        console.log('iframe 已加载完成');
        // 在这里可以添加在 iframe 加载完成后要执行的代码
      });

      // 为 iframe 设置链接
      iframe.src = this.testUrl;
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.component-training {
  position: relative;
  .close {
    position: absolute;
    z-index: 2;
    right: 20px;
    top: 10px;
    font-size: 40px;
    color: #999;
    cursor: pointer;
  }
}
</style>
