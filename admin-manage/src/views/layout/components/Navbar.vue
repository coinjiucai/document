<template>
  <div class="not-select navbar tr bg1 flex-none">
    <div class="title" @click="goHome">{{ systemName }}</div>
    <div class="menus">
      <el-menu
        ref="menuContainer"
        class="el-menu-demo"
        mode="horizontal"
        :default-active="activeMenu"
        @select="handleSelect"
      >
        <template v-for="item in menuRouters.slice(0, menuLength)">
          <el-submenu
            v-if="item.children"
            :index="item.name || item.path"
            :key="item.name"
          >
            <template v-slot:title>
              <span class="ml5">{{ item.meta.title }}</span>
            </template>
            <template v-for="child in item.children">
              <template v-if="!child.hidden">
                <el-menu-item
                  :key="child.path"
                  :index="child.path"
                  :router="child.path"
                  @click="goRoute(child)"
                  v-if="!menuTypeList.includes(child.path)"
                >
                  <span
                    v-if="child.meta && child.meta.title"
                    slot="title"
                    class="ml5"
                  >
                    {{ child.meta.title }}
                  </span>
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
          <template v-else>
            <el-submenu
              :key="item.name"
              :index="item.path"
              class="el-menu-module"
            >
              <template v-slot:title>
                <span class="ml5" @click="moduleClick(item)">{{
                  item.meta.title
                }}</span>
              </template>
            </el-submenu>
          </template>
        </template>
      </el-menu>
      <div class="more" v-if="mores.length > 0">
        <div @click="showMore = !showMore">
          <span class="iconfont">&#xe600;</span>
        </div>
        <div class="more-menu" v-if="showMore">
          <div
            class="more-item"
            v-for="item in mores"
            :key="item.path"
            @click="changeRoute(item)"
          >
            {{ item.meta.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-btns">
      <el-badge
        :value="messageNum"
        class="item"
        :max="99"
        v-if="messageNum > 0"
      >
        <img
          src="@/assets/images/message.png"
          alt=""
          style="width: 17px; height: 17px"
          @click="detailUserMessage()"
          title="系统消息"
        />
      </el-badge>
      <img
        v-else
        src="@/assets/images/message.png"
        alt=""
        style="width: 17px; height: 17px"
        @click="detailUserMessage()"
        title="系统消息"
      />
      <i
        class="el-icon-setting"
        style="font-size: 17px; margin: 0 5px; color: rgba(255, 255, 255, 0.8)"
        @click="changeUserProfile"
        title="系统设置"
      ></i>
      <img
        src="@/assets/images/logout.png"
        alt=""
        @click="logout"
        title="退出登录"
      />
    </div>
    <user-message
      ref="userMessage"
      @changeRead="getUnreadMessageNum()"
    ></user-message>
    <change-theme ref="theme" />
    <userProfileDialog ref="userProfile"></userProfileDialog>
  </div>
</template>

<script>
import userMessage from './Options/userMessage';
import changeTheme from './Options/changeTheme';
import userProfileDialog from './Options/userProfileDialog';
import websocket from '@/components/_extends/websocket';
import systemLocalConfig from '@/utils/systemLocalConfig';
import { mapGetters } from 'vuex';
import SidebarItem from './Sidebar/SidebarItem';
export default {
  components: { userMessage, changeTheme, userProfileDialog, SidebarItem },
  extends: websocket,

  created() {
    // 禁用websocket,需要时在开启
    // this.init(this.$store.state.user.userId);
  },
  //   mounted() {
  //     setInterval(() => {
  //       this.updateDateTime();
  //     }, 1000);
  //     this.initCollapse();
  //   },
  destroyed() {
    clearInterval(this.updateDateTime);
  },
  props: {},
  data() {
    return {
      src: '../../../../src/assets/images/logo.png',
      dateTime: '',
      isCollapse: false,
      activeIndex: '1',
      fullscreen: false,
      menuLength: 8,
      mores: [],
      showMore: false,
      menuTypeList: ['/userInfo'],
      messageNum: 0
    };
  },
  computed: {
    ...mapGetters(['menuRouters', 'systemName', 'menus']),
    activeMenu() {
      return this.$route.path;
    }
  },
  mounted() {
    const width = this.$refs.menuContainer.$el.clientWidth;
    this.menuLength = Math.floor(width / 120) - 1;

    // item.children
    for (let i = this.menuLength; i < this.menuRouters.length; i++) {
      const item = this.menuRouters[i];
      if (item.children) {
        this.mores = [...this.mores, ...item.children];
      }
    }
    this.getUnreadMessageNum();
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({
        path: key
      });
      console.log(key, keyPath);
    },
    /**
     * 更新时间
     */
    updateDateTime() {
      this.dateTime = this.$moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss dddd'
      );
    },
    /**
     * 控制单态登录
     * @param val
     */
    websocketOnmessage(val) {
      const res = JSON.parse(val.data)['sendMessageType'];
      if (res === 2) {
        this.$popTip.close();
        this.$popTip.error('您的账号已在其他地方登录！');
        setTimeout(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        }, 1000);
      }
    },
    /**
     * 点击退出
     */
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    detailUserMessage() {
      this.$refs.userMessage.show();
    },

    /**
     * 显示主题切换
     */
    changeTheme() {
      this.$refs.theme.show();
    },
    /**
     * 点击打开用户中心
     */
    changeUserProfile() {
      this.$refs.userProfile.show();
    },
    /**
     * 初始化菜单折叠
     */
    initCollapse() {
      this.isCollapse = systemLocalConfig.menuCollapse;
      this.$emit('collapse', this.isCollapse);
    },
    /**
     * 点击菜单折叠
     */
    handleMenuCollapse() {
      this.isCollapse = !this.isCollapse;
      systemLocalConfig.menuCollapse = this.isCollapse;
      this.$emit('collapse', this.isCollapse);
    },
    changeFullScreen() {
      const element = document.documentElement;
      // 如果是全屏状态
      if (this.fullscreen) {
        // 如果浏览器有这个Function
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        // 如果浏览器有这个Function
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
      // 判断全屏状态的变量
      this.fullscreen = !this.fullscreen;
    },
    goRoute(item) {
      const menuItem = {
        name: item.name,
        path: item.path,
        meta: item.meta
      };
      this.$store.commit('SET_QUICKLY_MENU', menuItem);
    },
    changeRoute(route) {
      this.showMore = false;
      this.$router.push(route.path);

      const menuItem = {
        name: route.name,
        path: route.path,
        meta: route.meta
      };
      this.$store.commit('SET_QUICKLY_MENU', menuItem);
    },
    goHome() {
      const menuRouters = this.menuRouters;
      if (menuRouters?.length > 0) {
        const children = menuRouters[0].children;
        if (children?.length > 0) {
          this.$router.push({ path: children[0].path });
        }
      }
    },
    getUnreadMessageNum() {
      this.$api.System.sysmsgUnreadNum().then((res) => {
        this.messageNum = res.result;
      });
    },
    moduleClick(item) {
      if (item.path == '/naodian') {
        this.$router.push({ path: '/naodianSystem' });
      } else {
        this.$router.push(item.path);

        const menuItem = {
          name: item.name,
          path: item.path,
          meta: item.meta
        };
        this.$store.commit('SET_QUICKLY_MENU', menuItem);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dropdown {
  color: #ffffff;
}

.navbar {
  position: relative;
  display: flex;
  height: 64px;
  // line-height: 65px;
  color: #fff;
  background-image: url('~@/assets/images/header-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 94px;

  .title {
    margin-left: 30px;
    padding-top: 5px;
    font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
    font-size: 42px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #e2f0fe;
    opacity: 0.89;
    cursor: pointer;
  }
  .menus {
    position: absolute;
    left: 380px;
    right: 75px;
    margin-right: 0;
    .more {
      position: absolute;
      right: 30px;
      top: 13px;
      color: #999;
      font-size: 12px;
      z-index: 999;
      > div:nth-child(1) {
        text-align: right;
        cursor: pointer;
      }
    }
    .more-menu {
      padding: 10px;
      background: rgba(21, 33, 53, 0.8);
      border-radius: 4px;
    }
    .more-item {
      line-height: 1.6;
      cursor: pointer;
    }
  }
  ::v-deep .el-menu.el-menu--horizontal {
    border-bottom: unset;
    background: transparent;
  }
  .el-submenu {
    height: 40px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    line-height: 40px;
    overflow: hidden;
    &:hover {
      background-image: url('~@/assets/images/menu-hover.png');
      background-color: transparent !important;
      ::v-deep .el-submenu__title {
        i {
          color: #fff;
        }
      }
    }
  }

  ::v-deep .el-submenu .el-submenu__title {
    height: 40px;
    line-height: 40px;
    border-bottom: 0 !important;
    background-color: transparent !important;
    background-size: 100%;
    background-size: 100%;
    background-position: center -8px;
    font-size: 16px;
    color: #466659;
    i {
      color: #466659;
    }
  }

  ::v-deep .is-active {
    background-image: url('~@/assets/images/menu-hover.png');
    background-color: transparent !important;
    border-bottom: none !important;
    .el-submenu__title {
      i {
        color: #fff;
      }
    }
  }

  .img {
    width: 50px;
    height: 50px;
    margin: 6px 20px;
  }

  h1 {
    display: inline-block;
    font-size: 20px;
    margin: 0;
    vertical-align: 20px;
  }
  .right-btns {
    position: absolute;
    top: 12px;
    right: 20px;
    display: flex;
    align-items: center;
    img {
      width: 18px;
      height: 18px;
      margin: 0 5px;
      cursor: pointer;
    }
  }
}
::v-deep .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
  margin-top: 0px !important;
  margin-left: 5px;
}
::v-deep .el-badge {
  top: 2px;
}
::v-deep .el-badge__content {
  color: #fff !important;
  line-height: 14px;
  border: unset;
}
.FoldIcon {
  position: absolute;
  font-size: 25px;
  padding-left: 10px;

  i {
    transition: all 500ms;
  }

  .IconTurnRight {
    transform: rotate(180deg);
  }
}
::v-deep .el-menu-module i {
  display: none;
}
</style>
