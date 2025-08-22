<!--
  @Name 系统菜单栏
  @Description 左侧的系统菜单栏，包含系统菜单和系统名称、LOGO、版本。可折叠。
  @author 赖明浩
  @date 2023-4-17
  @version 1.0.2
-->

<template>
  <div
    class="full-block flex-layout not-select theme-background-middle sidebar-container"
    :class="isCollapse ? 'hide-sideBar' : ''"
  >
    <div class="full-block theme-menu scroll-y better-scroll">
      <el-menu
        mode="vertical"
        unique-opened
        :default-active="activeMenu"
        :collapse="isCollapse"
        router
      >
        <sidebar-item
          :routes="menuRouters"
          :is-collapse="isCollapse"
        ></sidebar-item>
      </el-menu>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import config from "../../../../../package.json";

export default {
  name: "sidebar",
  components: { SidebarItem },
  mounted() {
    this.version = config.version;
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      version: null,
    };
  },
  created() {},
  computed: {
    ...mapGetters(["menuRouters", "systemName"]),
    activeMenu() {
      return this.$route.path;
    },
  },
  methods: {
    /**
     * 点击返回主页
     */
    handleGoHome() {
      this.$router.push("/home");
    },
  },
};
</script>
<style lang="scss" scoped>
.sidebar-container {
  transition: all 0.28s;
  width: 280px;

  a {
    display: inline-block;
    width: 100%;
  }

  .svg-icon {
    margin-right: 16px;
  }

  .el-menu {
    border: none;
    width: 100%;
  }
}

.hide-sideBar {
  width: 60px;

  .header {
    height: 60px;

    h1 {
      width: 0;
      height: 0;
      margin: 0;
    }

    .img {
      width: 40px;
      height: 40px;
    }
  }
}

.header {
  transition: all 0.5s;
  height: 170px;

  .img {
    transition: all 0.5s;
    width: 60px;
    height: 60px;
  }

  h1 {
    transition: all 0.5s;
    height: 55px;
    overflow: hidden;
    display: inline-block;
    font-size: 20px;
    margin: 0;
    color: #fff;
    vertical-align: 20px;
  }
}

.HomeButton {
  cursor: pointer;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.version {
  text-align: right;
  font-size: 10px;
  color: #d3dce6;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu--collapse > .menu-wrapper .el-menu-item .el-submenu__icon-arrow,
.el-menu--collapse > .menu-wrapper .el-submenu .el-submenu__icon-arrow {
  display: none;
}

.el-menu--collapse > .menu-wrapper > .el-menu-item .content,
.el-menu--collapse > .menu-wrapper > .el-submenu > .el-submenu__title .content {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>
