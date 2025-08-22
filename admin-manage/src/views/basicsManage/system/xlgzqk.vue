<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['add', 'delete']"
      :listApi="['basics', 'psyworkconditionPage']"
      :deleteApi="['basics', 'psyworkconditionBatch']"
      :showIndex="true"
      @edit="edit"
      :editApi="['basics', 'psyworkconditionSave']"
      @add="add"
      :addApi="['basics', 'psyworkconditionSave']"
    >
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
        >
      </template>
    </ListPage>
    <!-- 弹窗 -->
    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="400px"
      top="20vh"
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="心理工作" prop="workName">
            <el-input
              v-model="record.workName"
              placeholder="请输入"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="工作情况" prop="workValue">
            <el-input-number
              v-model="record.workValue"
              controls-position="right"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import BaseQuillEditor from '@/views/basicsManage/questionBankManage/components/BaseQuillEditor.vue';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    BaseQuillEditor
  },
  data() {
    return {
      // 搜索参数
      params: {},
      // 搜索字段列配置
      fieldsConfig: [],
      // 表格字段列配置
      labelList: [
        { label: '心理工作', prop: 'workName' },
        {
          label: '心理工作情况',
          prop: 'workValue'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true,
          width: 160
        }
      ],
      visibleDialog: false,
      dialogTitle: '心理工作情况管理',
      type: 'edit',
      record: {
        workName: '',
        workValue: ''
      },
      rules: {
        workName: [
          { required: true, message: '请输入心理工作名称', trigger: 'blur' }
        ],
        workValue: [
          { required: true, message: '清输入心理工作情况', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    add() {
      this.type = 'add';
      this.record = {
        workName: '',
        workValue: ''
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.record = { ...record };
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        workName: '',
        workValue: ''
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave() {
      console.log(this.record, 'ssss');
      this.$refs.form.validate((val) => {
        if (val) {
          this.$refs.listPage.saveRow({
            ...this.record
          });
          this.visibleDialog = false;
        }
      });
    }
  }
};
</script>
