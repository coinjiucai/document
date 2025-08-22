<template>
  <div id="app" class="app-container">
    <router-view></router-view>
  </div>
</template>

<script>
import { setUserTheme } from '@/utils/themeControl';
import projectName from '@/assets/arts/projectName.min';

export default {
  name: 'app',
  mounted() {
    setUserTheme();
    console.log(projectName);
    console.debug(process.env);
    this.$store.dispatch('getCustomValue');
  },
  methods: {}
};
</script>

<style lang="scss">
@import './styles/index.scss'; // 全局自定义的css样式
</style>
