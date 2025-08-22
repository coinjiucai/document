<!--
  @Name 系统菜单项
  @Description 菜单路由，通过routes接收来自Store的menuRouters，递归显示
  @author 赖明浩
  @date 2023-4-17
-->

<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden">
      <el-submenu
        v-if="item.children"
        :index="item.name || item.path"
        :key="item.name"
      >
        <template v-slot:title>
          <span
            class="ml5"
            v-if="!isCollapse && item.meta && item.meta.title"
            >{{ item.meta.title }}</span
          >
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item
            class="nest-menu"
            :key="child.path"
            :topLevel="topLevel ? topLevel + '/' + item.path : item.path"
            :routes="[child]"
            v-if="!menuTypeList.includes(item.path)"
          >
          </sidebar-item>
        </template>
      </el-submenu>
      <template v-else>
        <el-menu-item
          :key="item.name"
          :index="itemPath(item)"
          :route="itemPath(item)"
          v-if="!menuTypeList.includes(item.path)"
        >
          <span v-if="item.meta && item.meta.title" slot="title" class="ml5">
            {{ item.meta.title }}
          </span>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>

<script>
import SymbolIcon from "@/components/IconFont/symbolIcon";

export default {
  name: "SidebarItem",
  components: {
    SymbolIcon,
  },
  props: {
    routes: {
      type: Array,
    },
    topLevel: {
      type: String,
      default: "",
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuTypeList: ["/userInfo"],
    };
  },
  methods: {
    /**
     * 每个菜单路由拼接处理
     * @param {object} item 当前菜单项对象
     * @return {string} 菜单项路径
     */
    itemPath(item) {
      return item.path;
      // return this.topLevel ? `${this.topLevel}/${item.path}` : item.path;
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.menu-wrapper {
}
</style>
