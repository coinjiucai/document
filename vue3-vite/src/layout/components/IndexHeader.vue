<template>
  <el-row class="title-and-menu">
    <div class="left" ref="left1">
      <span id="title" class="title" ref="title1">{{ title }}</span>
      <div class="type-box" ref="box" v-if="showTypeBox">
        <span 
          class="type" 
          @click="changeType" 
          v-show="route && route.path != '/index'"
        >
          {{ businessType == consts.businessTypeObj.topic ? "成果" : "课题"}}
          <el-icon>
            <Sort />
          </el-icon>
        </span>
      </div>
      <header-menu v-if="width" :style="{ width: width + 'px' }" v-show="route && route.path != '/index'" />
    </div>
    <div class="right">
      <div class="logout" @click="toLogin" v-if="!getToken()">登录</div>
    </div>
  </el-row>
</template>

<script setup>
import HeaderMenu from "./HeaderMenu";
import { getSysTitle } from "@/api/frontIndex/frontIndex";
import { ElMessageBox } from "element-plus";
import useUserStore from "@/store/modules/user";
import consts from "@/utils/consts";
import { getToken } from "@/utils/auth";
import { ref, onMounted, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const title1 = ref(null);
const left1 = ref(null);
const box = ref(null);
const title = ref("");
const businessType = ref(localStorage.getItem("businessType"));
const width = ref(0);
const businessTypeNew = ref('');
const route = useRoute();
const router = useRouter();

onMounted(() => {
  // initSysTitle();
});

const showTypeBox = computed(() => {
  if (businessTypeNew.value != 1 && businessTypeNew.value != 2) {
    return true;
  }

  return false;
})

function initSysTitle() {
  businessTypeNew.value = localStorage.getItem('businessTypeNew');

  getSysTitle().then((res) => {
    title.value = !res.sysTitle ? "教育科研及教学成果数据平台" : res.sysTitle;
    // 动态计算出来
    document.getElementById('title').style.setProperty('width', (title.value.length * 25 / 1920) * 100 + 'vw')
    nextTick(() => {
      if (title1.value) {
        const titlew = title1.value.offsetWidth;
        const boxw = box.value?.offsetWidth || 0;
        const leftw = left1.value.offsetWidth;
        width.value = leftw - (titlew + boxw) - 110;
      }
    });
  });
}

function changeType() {
  businessType.value =
  businessType.value == consts.businessTypeObj.topic
      ? consts.businessTypeObj.achievement
      : consts.businessTypeObj.topic;
  localStorage.setItem("businessType", businessType.value);
  proxy.emitter.emit("businessType-change", businessType.value);
}

function toLogin() {
  router.push({
    path: "/login",
    query: { 
      redirect: route.path
    }
  });
}

onMounted(() => {
  proxy.emitter.on("businessType-change", (value) => {
    localStorage.setItem("businessType", value);
    businessType.value = value;
  });
});

initSysTitle();
</script>

<style lang="scss" scoped>
.title-and-menu {
  color: #fff;
  display: flex;
  justify-content: space-between;

  .left {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    .title {
      min-width: 146px;
      float: left;
      font-size: 24px;
      font-family: SourceHanSansSC-Bold;
      line-height: 60px;
      margin-right: 10px;
    }

    .type-box {
      width: 80px;
      height: 30px;
      margin-right: 87px;
      margin-top: 2px;

      .type {
        width: 80px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ee9a22;
        border-radius: 15px;
        border: solid 2px #fff;
        font-size: 18px;
        color: #fff;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }

  .right {
    position: absolute;
    top: 1px;
    right: 1px;

    .logout {
      width: 120px;
      height: 58px;
      line-height: 58px;
      text-align: center;
      margin-left: 60px;
      margin-right: 1px;
      background-color: #e0edff;
      color: #177add;
      font-size: 20px;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}
</style>
