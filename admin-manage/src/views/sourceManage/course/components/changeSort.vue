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
        <el-form 
          ref="form" 
          :model="record" 
          :rules="rules" 
          label-width="95px"
        >
          <el-form-item label="分类：">
            <treeSelect
              class="w100p"
              node-key="id"
              :tree-props="{label: 'label', children: 'childrenList'}"
              :tree-list="treeList"
              v-model="record['classifyId']"
            >
            </treeSelect>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
        <el-button 
          type="primary" 
          :loading="loading" 
          @click="handleSave"
        >保存</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import treeSelect from '@/components/Tree/TreeSelect';

export default {
  name: 'changeSort',
  components: {
    BaseDialog,
    treeSelect,
  },
  props: {
    treeList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      title: '更换分类',
      visibleDialog: false,
      loading: false,
      record: {
        classifyId: '',
      },
      rules: {
        classifyId: [{required:true, message: "请选择分类",trigger:"change"}]
      },
      list: [],
    }
  },
  methods: {
    show(val) {
      this.list = val;
      this.$set(this.record, 'classifyId', this.list[0].classifyId);
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.reset();
    },
    reset() {
      this.loading = false;
      this.record = {
        classifyId: '',
      };
      this.list = [];

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
    },
    handleSave() {
      this.loading = true;

      let param = JSON.parse(JSON.stringify(this.record));

      param.ids = this.list.map(el => el.id).join();

      this.$api.source.changeKcSort(param).then(res => {
        this.$message.success('保存成功');
        this.$emit('save');
        this.handleCloseDialog();
      }).finally(() => {
        this.loading = false;
      });
    },
  }
}
</script>

<style lange="scss" scoped>

</style>