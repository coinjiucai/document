<template>
  <div class="register">
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form" label-width="80px">
      <h3 class="title">帐号注册</h3>
      <el-form-item label="登录帐号" prop="username">
        <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="登录账号">
          <template #prefix>
            <svg-icon icon-class="logininfor" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
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
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="registerForm.password" type="password" show-password auto-complete="off" placeholder="密码"
          @keyup.enter="handleRegister">
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" show-password auto-complete="off"
          placeholder="确认密码" @keyup.enter="handleRegister">
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
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
            <span v-if="!loading">注 册</span>
            <span v-else>注 册 中...</span>
          </el-button>
        </div>
        <div class="bottom-left">
          <router-link class="link-type" :to="'/login'">已有账号登录</router-link>
        </div>
        <div class="bottom-right">
          <router-link class="link-type" :to="'/regetAccount'">帐号查询</router-link>
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
import { getCodeImg, register } from "@/api/login";
import { IdentityCodeValid } from '@/utils/IdentityCodeValid.js'

const router = useRouter();
const { proxy } = getCurrentInstance();

const registerForm = ref({
  nickname: "",
  idcardnum: "",
  username: "",
  password: "",
  confirmPassword: "",
  code: "",
  uuid: ""
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

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
  username: [
    { required: true, trigger: "blur", message: "请输入您的账号" },
    { min: 2, max: 20, message: "用户账号长度必须介于 2 和 20 之间", trigger: "blur" }
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入您的密码" },
    { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" }
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
      register(registerForm.value).then(res => {
        const username = registerForm.value.username;
        ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", "系统提示", {
          dangerouslyUseHTMLString: true,
          type: "success",
        }).then(() => {
          router.push("/login");
        }).catch(() => {
        });
      }).catch(() => {
        loading.value = false;
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
.register-form {
  ::v-deep(.el-form-item__label) {
    width: 80px !important;
  }
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  background-size: cover;
  background-color: rgb(48, 65, 86);
}

.bottom-left {
  float: left;
  padding: 10px 10px;
  font-size: 16px;
}

.bottom-right {
  float: right;
  padding: 10px 10px;
  font-size: 16px;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
  font-size: 18px;
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
