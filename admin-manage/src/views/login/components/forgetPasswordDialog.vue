<template>
  <div>
    <BaseDialog
        class="component-exam-manages "
        title="忘记密码"
        center
        :visible.sync="visibleDialog"
        @closed="visibleDialog=false"
        width="600px"
    >
      <el-form ref="form" :model="params" label-width="150px" :rules="formRules">
        <el-form-item label="姓名：" prop="name">
          <el-input class="w300" v-model="params.name" placeholder="请输入姓名" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="idCard">
          <el-input class="w300" v-model="params.idCard" placeholder="请输入身份证号" :maxlength="18"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleApplyResetPassword">申请重置密码</el-button>
        <el-button @click="visibleDialog=false">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";

export default {
  name: "forgetPasswordDialog",
  components: {
    BaseDialog
  },
  data() {
    return {
      visibleDialog: false,
      params: {
        name: '',
        idCard: '',
      },
      formRules: {
        name: [{required: true, message: '用户名称不能为空！', target: 'blur'},],
        idCard: [{required: true, message: '身份证号不能为空！', target: 'blur'},],
      }
    }
  },
  methods: {
    handleApplyResetPassword() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.$api.login.applyResetPassword(this.params).then(res => {
            if (res['success']) {
              this.visibleDialog = false
              //这边不用$message是为了确保用户能看清楚管理员的信息
              this.$popTip.success(`申请密码重置成功，请联系管理员:${res.data}!`)
            }
          })
        }
      })

    }
  }
}
</script>

<style scoped>

</style>
