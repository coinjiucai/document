<template>
  <div>
    <BaseDialog
      class="full-block component-qutstionCatalogueDetail"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="400px"
      top="10vh"
    >
      <div class="full-block">
        <el-form ref="=form" :model="record" :rules="rules" inline>
          <el-form-item label="上级分类：">
            <tree-select
              node-key="id"
              :tree-props="{ label: 'label', children: 'childrenList' }"
              :tree-list="treeList"
              v-model="record['parentId']"
              reference-class="w230"
            >
            </tree-select>
          </el-form-item>
          <el-form-item label="分类名称：">
            <el-input
              maxlength="50"
              v-model="record['label']"
              class="w230"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
        <el-button
          type="primary"
          @click="saveCatagory"
          v-loading="saveButtonLoading"
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
      title: '题目分类详情',
      saveUrl: '/mlf-counsel-service/taclassify/save'
    };
  },
  computed: {
    rules() {
      return {
        label: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      };
    }
  },
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
    },
    getDefaultRecord() {
      return {
        id: null,
        label: '',
        parentId: null
      };
    },
    saveCatagory() {
      if (!this.record['parentId']) {
        this.record['parentId'] = 0;
      }
      this.handleSave();
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

.component-qutstionCatalogueDetail {
}
</style>
