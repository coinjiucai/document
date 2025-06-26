<template>
  <el-container>
    <el-header class="front-header navbar-fixed-top">
      <index-header />
    </el-header>
    <el-main class="index-main">
      <index-main />
    </el-main>
  </el-container>
</template>

<script setup name="frontLayoutCmp">
import { IndexHeader, IndexMain } from "./components";
</script>

<style scoped>
.front-header {
  height: 60px;
  overflow: hidden;
  position: fixed;
  width: 100%;
  z-index: 999;
  background-image: url("@/assets/home/head.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-right: 0;
}

.index-main {
  /* text-align: center; */
  margin-top: 60px;
  padding: 0;
  background-color: #eeeeee4d;
}
</style>

<style>
body {
  background-color: #ecf3fd;
}

pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  line-height: 1.5em;
}
</style>
