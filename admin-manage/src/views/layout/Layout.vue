<template>
  <div class="full-block frow theme-background-base">
    <div
      class="app-wrapper flex-layout full-block frow theme-background-base"
      @click="handleUpdateState"
    >
      <div class="flex-layout flex-auto overflow-hidden">
        <navbar class="flex-none" @collapse="handleCollapse" />
        <div class="quickly-entry-menu" ref="menu">
          <div
            v-for="(item, index) in menuList"
            :key="index"
            :class="{
              active: currentHash == item.path,
            }"
            @click="changeRoute(item)"
          >
            <span class="iconfont" @click="deleteMenuTag(item)">&#xe613;</span
            >{{ item.meta.title }}
          </div>
        </div>
        <app-main class="flex-auto" />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "@/views/layout/components";
import { MessageBox } from "element-ui";
import { mapGetters } from "vuex";
export default {
  name: "layout",
  mounted() {
    setInterval(this.handleTimeOut, 1000);
  },
  destroyed() {
    // clearInterval(this.handleTimeOut)
  },
  data() {
    return {
      lastTime: new Date().getTime(),
      currentTime: new Date().getTime(),
      // 2小时不操作退出
      timeOut: 1000 * 60 * 60 * 2,
      isCollapse: false,
      currentHash: "",
    };
  },

  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  computed: {
    ...mapGetters(["menuRouters", "systemName"]),
    menuList() {
      var quicklyMenuList = this.$store.state.user.quicklyMenuList;
      const hash = this.$route.path ? this.$route.path : window.location.hash;
      console.log(hash, "=====");
      this.currentHash = hash;
      var allMenu = [];
      for (let i = 0; i < this.menuRouters.length; i++) {
        if (this.menuRouters[i].children) {
          allMenu = [...allMenu, ...this.menuRouters[i].children];
        }
      }
      const item = allMenu.find((v) => hash.indexOf(v.path) >= 0);
      if (quicklyMenuList.length == 0) {
        const menuItem = {
          name: item.name,
          path: item.path,
          meta: item.meta,
        };
        this.$store.commit("SET_QUICKLY_MENU", menuItem);
      }
      this.$nextTick(() => {
        this.scrollToEnd();
      });
      console.log(quicklyMenuList, "sss");
      return quicklyMenuList;
    },
  },
  methods: {
    /**
     * 超时登出
     */
    handleTimeOut() {
      this.currentTime = new Date().getTime();
      if (
        this.currentTime - this.lastTime > this.timeOut - 11 * 1000 &&
        this.currentTime - this.lastTime < this.timeOut - 10 * 1000
      ) {
        MessageBox.confirm("即将在10秒左右退出登录！", "警告", {
          type: "warning",
          showCancelButton: false,
          confirmButtonText: "取消",
        })
          .then(() => {
            this.handleUpdateState();
          })
          .catch(() => {
            this.handleUpdateState();
          });
      }
      if (this.currentTime - this.lastTime > this.timeOut) {
        this.lastTime = this.currentTime;
        clearInterval(this.handleTimeOut);
        MessageBox.close();
        this.$store.dispatch("LogOut").then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      }
    },
    handleUpdateState() {
      this.lastTime = new Date().getTime();
    },
    /**
     * 点击菜单折叠
     * @param val
     */
    handleCollapse(val) {
      this.isCollapse = val;
    },
    changeRoute(item) {
      this.$router.push(item.path);
      this.$nextTick(() => {
        const hash = this.$route.path;
        this.currentHash = hash;
      });
    },
    deleteMenuTag(item) {
      if (this.menuList.length > 1) {
        this.$store.commit("DELETE_QUICKLY_MENU", item);
        if (this.currentHash.indexOf(item.path) >= 0) {
          this.changeRoute(this.menuList[this.menuList.length - 1]);
        }
      }
    },
    scrollToEnd() {
      const container = this.$refs.menu;
      // 如果是水平滚动，使用 scrollLeft
      container.scrollLeft = container.scrollWidth;
      // 如果是垂直滚动，使用 scrollTop
      // container.scrollTop = container.scrollHeight;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-wrapper {
  height: 100%;
  background-image: url("~@/assets/images/main-bg.png");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  .quickly-entry-menu {
    margin: 16px 10px 0px;
    padding: 0 10px;
    font-size: 12px;
    color: #99afcc;
    overflow-x: auto;
    white-space: nowrap;
    overflow-y: hidden;
    padding-bottom: 10px;
    /* 滚动条整体样式 */
    &::-webkit-scrollbar {
      height: 4px;
    }
    > div:first-child {
      margin-left: -16px;
    }
    > div {
      padding: 0 10px;
      height: 22px;
      border-radius: 2px;
      display: inline-block;
      line-height: 18px;
      // border: solid 1px #142643;
      background-color: rgba(33, 149, 101, 0.1);
      border: 1px solid rgba(33, 149, 101, 0.1);
      margin-right: 5px;
      box-sizing: border-box;
      cursor: pointer;
      .iconfont {
        display: inline-block;
        background-color: #99afcc;
        width: 12px;
        height: 12px;
        color: #0e4383;
        font-size: 10px;
        line-height: 12px;
        text-align: center;
        border-radius: 50%;
        margin-right: 4px;
        cursor: pointer;
      }
    }
    .active {
      background: rgba(33, 149, 101, 0.5);
    }
  }
}
</style>
