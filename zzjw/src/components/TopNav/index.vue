<template>
  <el-menu
      :default-active="activeMenu"
      mode="horizontal"
      @select="handleSelect"
  >
    <template v-for="(item, index) in topMenus">
      <el-menu-item :style="{'--theme': theme}" :index="item.path" :key="index" v-if="index < visibleNumber"
      >
        <svg-icon :icon-class="item.meta.icon"/>
        {{ item.meta.title }}
      </el-menu-item
      >
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu :style="{'--theme': theme}" index="more" v-if="topMenus.length > visibleNumber">
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
            :index="item.path"
            :key="index"
            v-if="index >= visibleNumber"
        >
          <svg-icon :icon-class="item.meta.icon"/>
          {{ item.meta.title }}
        </el-menu-item
        >
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {constantRoutes} from "@/router"
import {isHttp} from '@/utils/validate'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

const visibleNumber = ref(null);

const isFrist = ref(null);

const currentIndex = ref(null);

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const route = useRoute();
const theme = computed(() => settingsStore.theme);

const routers = computed(() => permissionStore.topbarRouters);
const topMenus = computed(() => {
  let topMenus = [];
  routers.value.map((menu) => {
    if (menu.hidden !== true) {

      if (menu.path === "/") {
        topMenus.push(menu.children[0]);
      } else {
        topMenus.push(menu);
      }
    }
  })
  return topMenus;
})
const childrenMenus = computed(() => {
  let childrenMenus = [];
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
        if (router.path === "/") {
          router.children[item].path = "/redirect/" + router.children[item].path;
        } else {
          if (!isHttp(router.children[item].path)) {
            router.children[item].path = router.path + "/" + router.children[item].path;
          }
        }
        router.children[item].parentPath = router.path;
      }
      childrenMenus.push(router.children[item]);
    }
  })
  return constantRoutes.concat(childrenMenus);
})
const activeMenu = computed(() => {
  const path = route.path;
  let activePath = defaultRouter.value;
  if (path !== undefined && path.lastIndexOf("/") > 0) {
    const tmpPath = path.substring(1, path.length);
    activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
    appStore.toggleSideBarHide(false);
  } else if ("/index" == path || "" == path) {
    if (!isFrist.value) {
      isFrist.value = true;
    } else {
      activePath = "index";

    }
  }
  let routes = activeRoutes(activePath);
  if (routes.length === 0) {
    activePath = currentIndex.value || defaultRouter.value
    activeRoutes(activePath);
  }
  return activePath;
})

const defaultRouter = computed(() => {
  let router;
  Object.keys(routers.value).some((key) => {
    if (!routers.value[key].hidden) {
      router = routers.value[key].path;
      return true;
    }
  });
  return router;
})

function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt(width / 85);
}

function handleSelect(key, keyPath) {
  currentIndex.value = key;
  if (isHttp(key)) {

    window.open(key, "_blank");
  } else if (key.indexOf("/redirect") !== -1) {

    router.push({path: key.replace("/redirect", "")});
  } else {

    activeRoutes(key);
  }
}

function activeRoutes(key) {
  let routes = [];
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      if (key == item.parentPath || (key == "index" && "" == item.path)) {
        routes.push(item);
      }
    });
  }
  if (routes.length > 0) {
    store.commit("SET_SIDEBAR_ROUTERS", routes);
  }
  return routes;
}

onMounted(() => {
  window.addEventListener('resize', setVisibleNumber)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber)
})

onMounted(() => {
  setVisibleNumber()
})
</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  color: #999093 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active, .el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
  border-bottom: 2px solid #{'var(--theme)'} !important;
  color: #303133;
}

.topmenu-container.el-menu--horizontal > .el-sub-menu .el-submenu__title {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  color: #999093 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}
</style>
