<template>
  <div>
    <BaseDialog
        class="full-block component-userDetailDialog"
        :title="title"
        center
        :visible.sync="visibleDialog"
        @closed="handleCloseDialog"
        width="400px"
        top="20vh">
      <div class="full-block">
        <el-form ref="form" label-width="100px" :model="record" :rules="rules">
          <el-form-item label="所属单位：" prop="departId">
            <el-cascader
                class="w230"
                v-model="record.departId"
                clearable
                :show-all-levels="false"
                :options="treeList"
                :props="{value:'id',label:'departName',checkStrictly:true,emitPath:false}"
                @change="handleDepartChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="账号：" prop="username">
            <el-input v-model="record.username" class="w230" maxlength="30" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
                v-model="record.remark"
                type="textarea"
                autosize
                maxlength="200"
                class="w230"
                placeholder="请输入"
                show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
         <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>

// 注意引入的路劲可能不同
import BaseDialog from "@/components/Base/BaseDialog";
import Common from "@/com/common";

export default {
  name: "userDetailDialog",
  components: {BaseDialog},
  props: {
    treeList: {
      type: Array,
      default: () => []
    }
  },
  mounted() {

  },
  data() {
    return {
      visibleDialog: false,
      title: null,
      record: {
        id: '',
        username: '',
        departId: '',
        departName: '',
        remark: ''
      },
      rules: {
        departId: [{required: true, message: '请选择所属单位！', trigger: 'change'}],
        username: [{required: true, message: '请输入账号！', trigger: 'blur'}],
      }
    };
  },
  computed: {},
  watch: {
    visibleDialog(val) {
      if (val) {

      } else {

      }
    }
  },
  created() {
  },
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false
      this.record = {
        id: '',
        username: '',
        departId: '',
        departName: '',
        remark: ''
      }
      this.$nextTick(() => {
        // 重置表单的校验状态
        this.$refs?.form?.clearValidate();
      })
    },
    /**
     * 显示弹窗
     * @param record 用户信息，编辑时传入
     * @param defaultDepart 默认单位信息，新增时用到
     */
    show(record, defaultDepart) {
      this.visibleDialog = true
      if (record) {
        this.title = '编辑'
        this.record = Common.partOfObject(record, Object.keys(this.record), true);
      } else {
        this.record.departId = defaultDepart.id
        this.record.departName = defaultDepart.name
        this.title = '新增'
      }
    },
    /**
     * 单位切换的时候，获取单位名称
     * @param val
     */
    handleDepartChange(val) {
      Common.depthFirstSearch(this.treeList, (item) => {
        if (item.id === val) this.record.departName = item.departName
      })
    },
    /**
     * 点击保存
     * 区分新增和修改
     */
    handleSave() {
      this.$refs.form.validate(val => {
        if (val) {
          const type = this.title === '新增' ? 'add' : 'edit';
          this.$api.System.saveUser(type, this.record).then(() => {
            this.$message.success('保存成功！');
            this.handleCloseDialog();
            this.$emit('save');
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  max-height: 500px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-userDetailDialog {

}
</style>
