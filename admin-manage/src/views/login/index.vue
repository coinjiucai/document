<template>
  <div
    class="login-container"
    tabindex="1"
    v-if="show"
    :style="getScale"
    @keydown.enter="handleLogin"
  >
    <div class="form-container">
      <div class="htmlTitle">{{ systemName }}</div>
      <el-form
        autoComplete="on"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        class="login-form"
      >
        <!-- <el-form-item class="flex-auto">

        </el-form-item> -->
        <div class="title loginTitle">登录</div>
        <el-form-item prop="username" class="flex-none">
          <el-input
            v-model.trim="loginForm.username"
            placeholder="请输入账号"
            :maxlength="100"
          >
            <i slot="prefix" class="login-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="flex-none">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model.trim="loginForm.password"
          >
            <i slot="prefix" class="login-pwd"></i>
          </el-input>
        </el-form-item>
        <!-- <el-form-item
          class="flex-none"
          style="margin: 0"
          :style="{
            color: '#b9bed1',
            marginTop: '-18px',
            marginBottom: '20px',
          }"
        >
          <span
            class="forget-pwd"
            style="cursor: pointer; float: right"
            @click="forgetBtn"
            >忘记密码?</span
          >
        </el-form-item> -->
        <el-form-item class="flex-auto" style="margin: 0">
          <div>
            <div class="login-btn" @click="handleLogin" v-loading="loading">
              登录
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <forgetPasswordDialog ref="dialog" />
  </div>
</template>
<script>
import forgetPasswordDialog from './components/forgetPasswordDialog';
import config from '../../../package.json';
import dateTimeUtils from '@/utils/dateTimeUtils';

export default {
  name: 'login',
  components: {
    forgetPasswordDialog
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      show: true,
      systemImg: require('@/assets/images/login/bg.png')
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.version = config.version;
    });
    // const that = this;
    window.onresize = () => {
      return (() => {
        this.show = false;
        this.show = true;
      })();
    };
    this.$store.dispatch('getUserPublicKey');
  },
  computed: {
    // 获取系统名称
    systemName() {
      document.title = `${this.$store.state.app.systemName}-登录`;
      return this.$store.state.app.systemName;
    },
    // 获取缩放样式
    getScale() {
      let dRatioX = window.innerWidth / window.screen.width;
      let dRatioY = window.innerHeight / window.screen.height;
      if (dRatioX < 0.5) {
        dRatioX = 0.5;
      }
      if (dRatioY < 0.5) {
        dRatioY = 0.5;
      }
      return this.show
        ? {
            // width: `${window.screen.width}px`,
            // height: `${window.screen.height}px`,
            // minWidth: "1000px",
            // minHeight: "600px",
            // transform: `scale(${dRatioX},${dRatioY})`,
            // transformOrigin: "left top",
            overflow: 'hidden',
            backgroundImage: `url(${this.systemImg})`
          }
        : {};
    }
  },
  methods: {
    /**
     * 登录逻辑
     */
    handleLogin() {
      if (!this.loading) {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            const form = {
              username: this.loginForm.username,
              password: this.$rsa.encrypt(
                this.loginForm.password,
                this.$store.state.user.publicKey
              ),
              userType: 99
            };
            this.$store
              .dispatch('Login', form)
              .then((res) => {
                if (res.success) {
                  // 账号密码正确就请求用户权限信息
                  this.getInfo();
                }
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      }
    },
    /**
     * 获取用户信息
     *
     *
     */
    getInfo() {
      this.$api.login.getUserPermissionByToken().then((res) => {
        if (res['success']) {
          if (res['result'].menu.length == 0) {
            this.$popTip.error('用户没有授权');
          } else {
            const menuList = res['result'].menu;
            const children = menuList[0].children;
            if (children.length > 0) {
              const path = children[0].path;
              this.$router.push({ path: path });
              this.$notify({
                title: '欢迎',
                message: `${dateTimeUtils.greetBasedOnTime()}，欢迎回来`,
                type: 'success',
                duration: 2000
              });
            } else {
              this.$popTip.error('用户没有授权');
            }
          }
        } else {
          this.$message.error(res['message']);
        }
      });
    },
    /**
     * 点击忘记密码
     */
    forgetBtn() {
      this.$refs.dialog.visibleDialog = true;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import '~@/styles/mixin.scss';

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: 'Alibaba-PuHuiTi-H';
  font-weight: 400;
  src: url('~@/assets/font/Alibaba-PuHuiTi-Heavy.woff2') format('woff2'),
    url('~@/assets/font/Alibaba-PuHuiTi-Heavy.woff') format('woff');
  font-display: swap;
}

.login-container {
  @include relative;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  min-height: 600px;
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .role {
    width: 100%;
    position: absolute;
  }
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;

  .form-container {
    position: absolute;
    top: 50%;
    right: 214px;
    margin-top: -300px;
  }

  .htmlTitle {
    margin-bottom: 100px;
    font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
    font-size: 70px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 1;
    // letter-spacing: 6px;
    color: #fff;
    text-align: center;
  }

  .el-input--medium {
    .el-input__inner {
      height: 60px;
      line-height: 60px;
      background-color: #ffffff !important;
      font-size: 20px;
    }
  }

  .el-input__prefix {
    height: 110%;
  }
  .forget-pwd {
    font-size: 20px;
    color: #b9bed1;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }

  .svg-container {
    padding: 2px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;

    &_login {
      font-size: 20px;
    }
  }

  .title {
    font-size: 30px;
    font-family: MicrosoftYaHei-Bold;
    color: #fff;
    text-align: center;
    letter-spacing: 0px;
    color: #ffffff;
  }

  .login-form {
    width: 485px;
    height: 359px;
    background-size: 100% 100%;
    padding: 0 50px;
    background-image: url('~@/assets/images/login/form-bg.png');
    box-sizing: border-box;
    .loginTitle {
      width: 100%;
      text-align: center;
      padding: 20px 0 20px;
      color: #fff;
      font-size: 30px;
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-input {
      height: 54px;
      > input {
        padding-left: 50px;
        height: 100%;
      }
      input:valid {
        border: solid 2px #eeeeee;
        background: #fff;
        background-color: #fff;
      }
    }

    .el-input__inner {
      background-color: #1e2d2b !important;
      border-radius: 2px;
      border: solid 1px #438273 !important;
    }

    .el-input__inner::placeholder {
      color: #b9bed1;
    }
    /* 谷歌 */
    .el-input__inner::-webkit-input-placeholder {
      color: #b9bed1;
    }
    /* 火狐 */
    .el-input__inner:-moz-placeholder {
      color: #b9bed1;
    }
    /*ie*/
    .el-input__inner:-ms-input-placeholder {
      color: #b9bed1;
    }
    .login-user::before,
    .login-pwd::before {
      position: absolute;
      content: '';
      width: 30px;
      height: 30px;
      top: 12px;
      left: 10px;
      background-size: 100%;
    }
    .login-user::before {
      background-image: url('~@/assets/images/login/user.png');
    }
    .login-pwd::before {
      background-image: url('~@/assets/images/login/password.png');
    }
  }

  .login-btn {
    margin-top: 30px;
    font-size: 24px;
    width: 391px;
    height: 52px;
    background-color: #4d816d;
    border-radius: 2px;
    color: #fff;
    text-align: center;
    line-height: 52px;
    cursor: pointer;
  }
}
</style>
