<template>
  <div class="register">
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form" label-width="80px">
      <h3 class="title">帐号查询</h3>
      <el-form-item label="用户姓名" prop="nickname">
        <el-input v-model="registerForm.nickname" type="text" auto-complete="off" placeholder="姓名">
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idcardnum">
        <el-input v-model="registerForm.idcardnum" type="text" auto-complete="off" placeholder="身份证号">
          <template #prefix>
            <svg-icon icon-class="textarea" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code" v-if="captchaOnOff">
        <el-input v-model="registerForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
          @keyup.enter="handleRegister">
          <template #prefix>
            <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <div style="width:100%;text-align: center;">
        <div style="width: 100%">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
            @click.prevent="handleRegister">
            <span v-if="!loading">账号查询</span>
            <span v-else>查询中，请稍后...</span>
          </el-button>
        </div>
        <div class="padding-10-10-left">
          <router-link class="link-type" :to="'/login'">已有账号登录</router-link>
        </div>
        <div class="padding-10-10-right">
          <router-link class="link-type" :to="'/register'">帐号注册</router-link>
        </div>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2021-2022 xd.mtn All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { getCodeImg, getAccName } from "@/api/login";
import { IdentityCodeValid } from '@/utils/IdentityCodeValid.js'

const router = useRouter();
const { proxy } = getCurrentInstance();

const registerForm = ref({
  nickname: "",
  idcardnum: "",
  code: "",
  uuid: ""
});
const checkIdcard = (rule, value, callback) => {
  let rstMsg = IdentityCodeValid(value)
  if (rstMsg.rst !== true) {
    callback(new Error(rstMsg.msg));
  } else
    callback();
}

const registerRules = {
  nickname: { required: true, message: "请输入用户真实姓名", trigger: "blur" },
  idcardnum: [
    { required: true, message: "请输入用户身份证号", trigger: "blur" },
    { required: true, validator: checkIdcard, trigger: 'blur' }
  ],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
const captchaOnOff = ref(true);

function handleRegister() {
  proxy.$refs.registerRef.validate(valid => {
    if (valid) {
      loading.value = true;
      getAccName(registerForm.value).then(res => {
        const nickname = registerForm.value.nickname;
        ElMessageBox.alert(nickname + " 的系统账号为 ：<font color='red'>" + res.userName + "</font> ，即将为您跳转到系统登录页面！", "系统提示", {
          dangerouslyUseHTMLString: true,
          type: "success",
        }).then(() => {
          router.push("/login");
        }).catch(() => {
        });
      }).catch(() => {
        loading.value = false;
        registerForm.value.code = ''
        if (captchaOnOff) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaOnOff.value = res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (captchaOnOff.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      registerForm.value.uuid = res.uuid;
    }
  });
}

getCode();
</script>

<style lang='scss' scoped>
.padding-10-10-left {
  float: left;
  padding: 10px 10px
}

.padding-10-10-right {
  float: right;
  padding: 10px 10px
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  background-size: cover;
  background-color: rgb(48, 65, 86);
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 500px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.register-code-img {
  height: 38px;
}
</style>
