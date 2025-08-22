<template>
  <div>
    <BaseDialog
      class="full-block component-addCatalogue"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="400px"
      top="10vh"
    >
      <div class="full-block">
        <el-form ref="form" :model="record" :rules="rules" label-width="95px">
          <el-form-item label="上级分类：">
            <tree-select
              class="w100p"
              node-key="id"
              :tree-props="{ label: 'label', children: 'childrenList' }"
              :tree-list="treeList"
              v-model="record['parentId']"
            >
            </tree-select>
          </el-form-item>
          <el-form-item label="分类名称：" prop="label">
            <el-input
              maxlength="50"
              v-model="record['label']"
              class="w100p"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="saveButtonLoading"
          @click="handleSave"
          >保存</el-button
        >
      </span>
    </BaseDialog>
  </div>
</template>

<script>
// 注意引入的路劲可能不同
import BaseDialog from '@/components/Base/BaseDialog';
import detailBase from '@/components/_extends/detailBase';
import TreeSelect from '@/components/Tree/TreeSelect.vue';
export default {
  name: 'questionCatalogueDetail',
  extends: detailBase,
  components: { TreeSelect, BaseDialog },
  props: {
    treeList: Array
  },
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      title: '课程分类',
      saveUrl: '/mlf-counsel-service/psycourseclassify/save'
    };
  },
  computed: {
    rules() {
      return {
        label: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      };
    }
  },
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
    },
    getDefaultRecord() {
      return {
        id: null,
        label: '',
        parentId: null
      };
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveButtonLoading = true;
          if (!this.record.parentId) {
            this.record.parentId = 0;
          }
          this.$api.globalAPI
            .saveRecord(this.saveUrl, this.record)
            .then((res) => {
              if (res['success']) {
                this.$message.success('保存成功');
                this.$emit('save');
                this.handleCloseDialog();
              }
            })
            .finally(() => {
              this.saveButtonLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 300px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-addCatalogue {
}
</style>
