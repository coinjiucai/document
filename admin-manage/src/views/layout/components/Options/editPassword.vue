<template>
  <div>
    <el-form
        :model="record"
        ref="record"
        :rules="rules"
        label-width="90px">
      <el-form-item label="原密码:" prop="currentPassword">
        <el-input show-password class="w230" v-model.trim="record.currentPassword"/>
      </el-form-item>
      <el-form-item label="新密码:" prop="newPassword">
        <el-input show-password class="w230" v-model.trim="record.newPassword"/>
      </el-form-item>
      <el-form-item label="确认密码:" prop="editAgain">
        <el-input show-password class="w230" v-model.trim="record.editAgain"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain size="small" @click="submitForm">更新密码</el-button>
        <el-button type="info" plain size="small" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'editPassword',
  components: {},
  props: {},
  data() {
    const validateSamePass = (rule, value, callback) => {
      if (value !== this.record.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validateSameWithOld = (rule, value, callback) => {
      if (value === this.record.currentPassword) {
        callback(new Error('新密码不能与旧密码一致!'));
      } else {
        callback();
      }
    }
    return {
      title: '修改密码',
      record: {
        currentPassword: '',
        newPassword: '',
        editAgain: '',
      },
      rules: {
        currentPassword: [
          {required: true, message: "请输入原密码", trigger: "blur"}
        ],
        newPassword: [
          {required: true, message: "请输入新密码", trigger: "blur"},
          {pattern: /^[0-9a-zA-Z~!@&%#_]+$/, message: "只能由数字、字母和标点符号（~!@&%#_）组成", trigger: "blur"},
          {validator: validateSameWithOld, trigger: "blur"}
        ],
        editAgain: [
          {required: true, message: "请输入确认密码", trigger: "blur"},
          {validator: validateSamePass, trigger: "blur"}
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * 重置表单
     */
    resetForm() {
      Object.keys(this.record).forEach(v => {
        this.$set(this.record, v, '')
      })
    },
    /**
     * 保存变更
     */
    submitForm() {
      this.$refs['record'].validate(valid => {
        if (valid) {
          const params = {
            username: this.$store.state.user.username,
            password: this.$rsa.encrypt(this.record.newPassword, this.$store.state.user.publicKey),
            confirmpassword: this.$rsa.encrypt(this.record.editAgain, this.$store.state.user.publicKey),
            oldpassword: this.$rsa.encrypt(this.record.currentPassword, this.$store.state.user.publicKey)
          }
          this.$api.home.editPassword(params).then(res => {
            this.$message.success('更改密码成功！')
            this.resetForm()
          })
        } else {
          return false
        }
      })
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.component-edit-password {
}
</style>
