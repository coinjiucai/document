<template>
  <div class="team-report theme-background-middle flex-layout full-block pa10">
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['add', 'delete']"
      :listApi="['analysis', 'groupreportPage']"
      :deleteApi="['analysis', 'groupreportDeleteBatch']"
      @edit="edit"
      :editApi="['analysis', 'groupreportSave']"
      @add="add"
      :addApi="['analysis', 'groupreportSave']"
    >
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)">
          查看报告
        </el-link>
      </template>
    </ListPage>
    <!-- 弹窗 -->
    <BaseDialog
      class="full-block"
      :title="type == 'edit' ? '编辑团体报告' : '新增团体报告'"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="600px"
      top="20vh"
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="报告名称" prop="name">
            <el-input v-model="record.name" placeholder="报告名称"></el-input>
          </el-form-item>
          <el-form-item label="年份" prop="year">
            <el-date-picker
              v-model="record.year"
              type="year"
              placeholder="选择年份"
              style="width: 100%"
              value-format="yyyy"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上传附件" prop="file">
            <FormItem
              compType="upload"
              v-model="record.file"
              :limit="1"
              :showMode="1"
              @change="() => {}"
            ></FormItem>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';

export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload
  },
  data() {
    return {
      // 搜索参数
      params: {
        year: '',
        name: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '年份',
          compType: 'year',
          width: 160,
          placeholder: '年份',
          prop: 'year',
          valueFormat: 'yyyy'
        },
        {
          label: '报告名称',
          compType: 'input',
          width: 160,
          placeholder: '报告名称',
          prop: 'name'
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '年份', prop: 'year' },
        {
          label: '报告名称',
          prop: 'name'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      type: 'edit',
      dataList: [],
      sourceList: [],
      record: {
        name: '',
        year: '',
        file: [],
        fileUrl: '',
        fileName: ''
      },
      rules: {
        name: [{ required: true, message: '请输入报告名称', trigger: 'blur' }],
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        file: [{ required: true, message: '请上传附件', trigger: 'change' }]
      },
      importTips: [
        '请严格参照模板规范进行导入;',
        '一次只能导入一个不超过20MB大小的excel文件;',
        '支持的excel格式有.xls与.xlsx'
      ],
      modelUrl: '', // 下载模板
      actionUrl: '' // 导入接口
    };
  },
  mounted() {
    this.modelUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psypaper/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psypaper/import`;
  },
  methods: {
    add() {
      this.type = 'add';
      this.record = {
        name: '',
        year: '',
        file: [],
        fileUrl: '',
        fileName: ''
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.record = { ...record, file: [], year: record.year + '' };
      if (this.record.fileUrl) {
        this.record['file'] = [
          {
            fileUrl: this.record.fileUrl,
            name: this.record.fileName
          }
        ];
      }
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        name: '',
        year: '',
        file: [],
        fileUrl: '',
        fileName: ''
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.$refs.listPage.saveRow(
            {
              name: this.record.name,
              id: this.record.id,
              year: this.record.year,
              fileUrl:
                this.record.file && this.record.file.length > 0
                  ? this.record.file[0].fileUrl
                  : '',
              fileName:
                this.record.file && this.record.file.length > 0
                  ? this.record.file[0].name
                  : ''
            },
            '保存'
          );
          this.visibleDialog = false;
        }
      });
    },
    handleShowFileImport() {
      this.$refs.fileImport.visibleDialog = true;
    },
    // 导入
    getImportList(response, file) {
      console.log(response, file);
    }
  }
};
</script>
