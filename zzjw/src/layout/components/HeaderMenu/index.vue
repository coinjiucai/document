<template>
  <el-menu
    v-if="isLogin"
    mode="horizontal"
    :background-color="menuBgcolor"
    text-color="#fff"
    active-text-color="#fff"
    @select="handleSelect"
    :default-active="defActiveIndex"
    :ellipsis="false"
    style="width: 100%"
  >
    <template v-for="item in topMenus" :key="item.path">
      <el-menu-item :index="item.path" v-if="!item.children">
        <!-- <div class="menu-icon">
          <svg-icon :icon-class="item.meta.icon"/>
        </div> -->
        {{ item.meta.title }}
      </el-menu-item>
      <el-sub-menu
        v-if="item.children && item.children.length > 0"
        :index="item.path"
      >
        <template #title>
          <!-- <div class="menu-icon">
            <svg-icon :icon-class="item.meta.icon"/>
          </div> -->
          {{ item.meta.title }}
        </template>
        <el-menu-item
          v-for="subItem in item.children"
          :index="resolvePath(item.path, subItem.path)"
          :key="subItem.path"
        >
          <!-- <div class="menu-icon">
            <svg-icon :icon-class="subItem.meta.icon"/>
          </div> -->
          {{ subItem.meta.title }}
        </el-menu-item>
      </el-sub-menu>
    </template>
    <el-sub-menu
      index="10000"
      class="menulast"
      :expand-close-icon="CaretBottom"
      :expand-open-icon="CaretTop"
      style="margin-left: auto"
    >
      <template #title>
        <div class="avatar-wrapper">
          <img :src="useUserStore().avatar" class="user-avatar" />
        </div>
        {{ userNickname }}
        <!-- <el-icon><CaretBottom /></el-icon> -->
      </template>
      <el-menu-item index="/user/proList" v-hasPermi="['main:project:tbList']">
        项目列表
      </el-menu-item>
      <el-menu-item index="/user/profile"> 个人资料 </el-menu-item>
      <el-menu-item index="logout"> 退出登录 </el-menu-item>
    </el-sub-menu>
  </el-menu>
  <!-- <el-menu
    class="login-menu"
    v-else
    mode="horizontal"
    :background-color="menuBgcolor"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true"
  >
    <el-menu-item index="/login">登录</el-menu-item>
    <el-menu-item index="/register" v-if="register">注册</el-menu-item>
  </el-menu> -->
</template>

<script setup name="HeaderMenu">
import { ElMessageBox } from "element-plus";
import { isExternal } from "@/utils/validate";
import { getNormalPath } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
import { getRegisterConfig } from "@/api/frontIndex/frontIndex";
import usePermissionStore from "@/store/modules/permission";
import useUserStore from "@/store/modules/user";
import { CaretBottom, CaretTop } from "@element-plus/icons-vue";
const menuBgcolor = ref("#0a5ac6");

const route = useRoute();
const router = useRouter();

const register = ref(false);

const currentIndex = ref(null);

const routes = computed(() => usePermissionStore().topbarRouters);

const userNickname = computed(() => useUserStore().nickName || ref("个人中心"));
let isLogin = ref(getToken() != undefined && getToken() != null);
let activeIndex = ref("/index");

const defActiveIndex = computed(() => {
  const path = route.path;
  return path;
});
const defaultRouter = computed(() => {
  let route;
  Object.keys(routes.value).some((key) => {
    if (!routes.value[key].hidden) {
      route = routes.value[key].path;
      return true;
    }
  });
  return route;
});
const topMenus = computed(() => {
  let topMenus = [];
  // 这边必须深度拷贝，不然会影响到后面路由
  let rs = JSON.parse(JSON.stringify(routes.value));
  rs.map((menu) => {
    if (menu.hidden !== true) {
      if (menu.children && menu.children !== undefined) {
        menu.children = menu.children.filter((val) => {
          return val.hidden === false;
        });
      }
      if (
        menu.children &&
        menu.children !== undefined &&
        menu.children.length === 1
      ) {
        menu.children[0].path = menu.path + "/" + menu.children[0].path;
        topMenus.push(menu.children[0]);
      } else if (menu.path === "/") {
        topMenus.push(menu.children[0]);
      } else {
        topMenus.push(menu);
      }
    }
  });
  console.log(topMenus);

  return topMenus;
});

function resolvePath(basePath, routePath, routeQuery) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery);
    return {
      path: getNormalPath(basePath + "/" + routePath),
      query: query,
    };
  }
  return getNormalPath(basePath + "/" + routePath);
}

function handleSelect(key, keyPath) {
  console.log(key, keyPath);
  if (key == "logout") logout();
  else router.push({ path: key || "/index" });
}

function getRegisterOnOff() {
  getRegisterConfig().then((res) => {
    register.value =
      res.registerOnOff === undefined ? false : res.registerOnOff;
  });
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      useUserStore()
        .logOut()
        .then(() => {
          sessionStorage.clear();
          location.href = "/index";
        });
    })
    .catch(() => {});
}

getRegisterOnOff();
</script>

<style lang="scss" scoped>
.el-menu {
  border-bottom: 1px solid #0a5ac6;
  background-color: transparent;
}

.el-menu-item,
:deep(.el-sub-menu__title) {
  font-size: 20px;
}

.is-active {
  font-family: "SourceHanSansSC-Bold";
}

.menu-icon {
  padding: 0 6px;
}

.avatar-wrapper {
  margin-right: 7px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .user-avatar {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    // position: relative;
    // top: 50%;
    // transform: translateY(-9%);
  }

  i {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
}
</style>
