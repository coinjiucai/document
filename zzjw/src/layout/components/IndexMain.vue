<template>
  <el-row>
    <el-col :span="2" class="hidden-md-and-down" />
    <el-col :xs="24" :lg="24">
      <div v-if="indexMainPage">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
      <div v-if="!indexMainPage">
        <div v-if="!routeNames.includes(route.name)" class="bcrumb-container">
          <breadcrumb id="front-bcrumb" />
        </div>
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <div
              class="shadow-container"
              :class="!routeNames.includes(route.name) ? 'comp-box' : 'full'"
            >
              <component :is="Component" :key="route.path" />
            </div>
          </transition>
        </router-view>
      </div>
    </el-col>
    <el-col :span="2" class="hidden-md-and-down" />
  </el-row>
</template>

<script setup>
import Breadcrumb from "@/components/Breadcrumb";

const indexMainPage = ref(true);
const route = useRoute();
const routeNames = ref([
  "Home",
  "Homepage",
  "More",
  "Detail",
  "SearchHome",
  "Result",
  "Repetition",
]);

watch(route, () => {
  indexMainPage.value = route.path == "/" || route.path == "/index";
});

indexMainPage.value = route.path == "/" || route.path == "/index";
</script>

<style lang="scss" scoped>
.bcrumb-container {
  height: 38px;
  text-align: left;
  margin-left: 80px;
  margin-right: 80px;
}

.shadow-container {
  // background-color: var(--bg-color, white);
  // border: 1px solid rgb(230, 227, 227);
  text-align: left;
  border-radius: 5px;
}

.shadow-container:has(> [data-full]) {
  background-color: unset;
}

.comp-box {
  padding: 18px 30px;
  margin: 0px 80px 20px 80px;
  // border-top: 2px solid #fff;
  background-image: url("@/assets/home/cond-bg.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-color: #ffffff;
  // box-shadow: 0px 1px 9px 0px rgba(0, 0, 0, 0.08);
}
.comp-box1 {
  // padding: 20px 30px;
  margin: 0px 20px 20px 20px;

  border-top: 2px solid #fff;
  // background-image: url("@/assets/home/cond-bg.png");
  background-size: 100%;
  background-repeat: no-repeat;
}
.shadow-container.full {
  background-color: unset;
  height: calc(100vh - 60px);
}
</style>