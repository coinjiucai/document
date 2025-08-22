<template>
  <div>
    <BaseDialog
      class="full-block component-departDetailDialog"
      :title="title"
      center
      :loading="loading"
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="400px"
      top="20vh"
    >
      <div class="full-block flex-layout">
        <el-form ref="form" :model="record" :rules="rules" label-width="100px">
          <el-form-item label="上级单位">
            <el-cascader
              class="w230"
              placeholder="新增顶级单位时不选"
              v-model="record['parentId']"
              clearable
              :show-all-levels="false"
              :options="treeList"
              :props="{
                value: 'id',
                label: 'name',
                checkStrictly: true,
                children: 'childrenList',
                emitPath: false
              }"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="部门名称" prop="name">
            <el-input
              class="w230"
              v-model="record['name']"
              maxlength="50"
              placeholder="请输入"
            ></el-input>
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
import BaseDialog from '@/components/Base/BaseDialog';
import Common from '@/com/common';

export default {
  name: 'departDetailDialog',
  components: { BaseDialog },
  props: {},
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      title: null,
      loading: false,
      record: {
        id: '',
        name: '',
        parentId: ''
      },
      treeList: [],
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
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
  created() {},
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        id: '',
        name: '',
        parentId: ''
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        this.$refs?.form?.clearValidate();
      });
    },
    show(treeList, record = null) {
      this.treeList = treeList;
      this.visibleDialog = true;
      console.log(record);
      if (record && record.id) {
        this.record = {
          id: record.id,
          name: record.name,
          parentId: record.parentId
        };
        this.title = '编辑';
      } else {
        this.title = '新增';
      }
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.loading = true;
          //这个type决定了走哪个接口
          const type = this.title === '新增' ? 'add' : 'edit';
          console.log(type, '----------');

          const keys = Object.keys(this.record);
          const record = { ...this.record };
          for (let i = 0; i < keys.length; i++) {
            if (this.record[keys[i]] === '') delete record[keys[i]];
          }
          if (!record.parentId) {
            record.parentId = 0;
          }
          this.$api.System.psysysdepartSave(record)
            .then((res) => {
              if (res['success']) {
                this.$message.success('保存成功！');
                this.$emit('save');
                this.handleCloseDialog();
              } else this.$popTip.error(res['message']);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 200px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-departDetailDialog {
}
</style>
