<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
              class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const levelList = ref([])

function getBreadcrumb() {

  let matched = route.matched.filter(item => item.meta && item.meta.title);
  const first = matched[0]
  if (isDashboard(first) === 2) {
    // matched = [{path: '/index', meta: {title: '首页', icon: 'dashboard'}}].concat(matched)
  } else if (isDashboard(first) == 1) {
    matched = [{path: '/admin/index', meta: {title: '后台首页', icon: 'dashboard'}}].concat(matched)
  }

  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}

function isDashboard(route) {
  const name = route && route.name
  if (!name) {
    return 0
  } else if (name.trim() === 'adminIndex' || route.path.indexOf("/admin") == 0)
    return 1
  else
    return 2
}

function handleLink(item) {
  const {redirect, path} = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watchEffect(() => {

  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})

getBreadcrumb();
</script>

<style lang='scss' scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 40px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>