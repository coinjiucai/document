<template>
  <div class="burn theme-background-middle flex-layout full-block pa10">
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :listApi="['System', 'getSyssecrecyeduPageList']"
      :deleteApi="['System', 'batchSyssecrecyeduDelete']"
      @edit="edit"
      :editApi="['System', 'syssecrecyeduSave']"
      @add="add"
      :addApi="['System', 'syssecrecyeduSave']"
    >
      <template v-slot:PageButtons></template>
      <template slot="actionParent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >录入成绩</el-link
        >
      </template>
    </ListPage>

    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="年度">
                <FormItem
                  compType="year"
                  v-model="record.year"
                  format="yyyy"
                  value-format="yyyy"
                  style="width: 100%"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训考核计划">
                <FormItem v-model="record.planName"></FormItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="培训类型">
                <FormItem
                  compType="select"
                  dictCode="educational_type"
                  v-model="record.eduType"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训规划" prop="username">
                <FormItem v-model="record.eduContent"></FormItem>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="培训考核时间">
                <el-date-picker
                  v-model="record.examTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附件">
                <FormItem
                  compType="upload"
                  v-model="record.attachFile"
                ></FormItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div style="height: 500px">
                <ListPage
                  ref="scoreEntry"
                  :buttonList="['add', 'delete']"
                  :labelList="batchLabelList"
                  :showPagination="false"
                  :searchStyle="{ 'text-align': 'left' }"
                  :isInnerGet="false"
                >
                  <template v-slot:PageButtons>
                    <el-button type="primary" @click="handleShowFileImport"
                      >批量导入</el-button
                    >
                    <FileImportDialog
                      ref="fileImport"
                      :model-url="modelUrl"
                      :model-name="'保密教育考核.xls'"
                      :tips="importTips"
                      :isFileStream="true"
                      :file-type="'.xls,.xlsx'"
                      :action-url="actionUrl"
                      @success="getImportList"
                    >
                    </FileImportDialog>
                  </template>
                </ListPage>
              </div>
            </el-col>
          </el-row>
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
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog
  },
  data() {
    return {
      // 搜索参数
      params: {
        eduContent: '',
        year: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '培训考核计划',
          compType: 'input',
          width: 160,
          prop: 'eduContent'
        },
        {
          label: '年度',
          compType: 'year',
          width: 160,
          prop: 'year',
          format: 'yyyy',
          'value-format': 'yyyy'
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '年度', prop: 'year' },
        { label: '培训考核计划', prop: 'planName' },
        { label: '培训类型', prop: 'eduType' },
        { label: '培训规划', prop: 'eduContent' },
        {
          label: '培训考核时间',
          prop: 'examTime'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'actionParent',
          special: true
        }
      ],
      visibleDialog: false,
      dialogTitle: '保密教育管理',
      record: {
        year: '',
        planName: '',
        eduType: '',
        eduContent: '',
        examTime: '',
        attachFile: [],
        sysSecrecyExams: []
      },
      rules: {},
      batchLabelList: [
        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '身份证号',
          prop: 'idcardNo'
        },
        {
          label: '考核名称',
          prop: 'examItem'
        },
        {
          label: '考核成绩',
          prop: 'examScore'
        }
      ],
      importTips: [
        '请严格参照模板规范进行导入;',
        '一次只能导入一个不超过20MB大小的excel文件;',
        '支持的excel格式有.xls与.xlsx'
      ],
      modelUrl: '',
      actionUrl: ''
    };
  },
  mounted() {
    this.modelUrl =
      `${Browser.getApiUrl() }/mlf-csjm-service/syssecrecyexam/excelTemplate`;
    this.actionUrl =
      `${Browser.getApiUrl() }/mlf-csjm-service/syssecrecyexam/import\n`;
  },
  methods: {
    initRecord() {
      this.record = {
        year: '',
        planName: '',
        eduType: '',
        eduContent: '',
        examTime: '',
        attachFile: [],
        sysSecrecyExams: []
      };
    },
    add() {
      this.initRecord();
      this.visibleDialog = true;
    },
    edit(record) {
      const item = { ...record };
      item.attachFile = JSON.parse(record.attachFile);
      item.year = `${ record.year}`;
      this.record = item;
      // setList
      const sysSecrecyExams = record.sysSecrecyExams;
      this.visibleDialog = true;
      this.$nextTick(() => {
        this.$refs.scoreEntry.setList(sysSecrecyExams, sysSecrecyExams.length);
      });
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.initRecord();
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
          this.visibleDialog = false;
          const record = { ...this.record };
          record.year = `${ record.year}`;
          record.attachFile = JSON.stringify(record.attachFile);
          const scoreEntry = this.$refs.scoreEntry.getDataList();
          record.sysSecrecyExams = [...scoreEntry];
          this.$refs.listPage.saveRow(record);
        }
      });
    },
    /**
     * 显示文件导入弹窗
     */
    handleShowFileImport() {
      this.$refs.fileImport.visibleDialog = true;
    },
    // 模板下载
    handleExport() {
      Browser.downLoad('/mlf-csjm-service/syssecrecyexam/excelTemplate');
    },
    getImportList(response, file) {
      console.log(response, file);
      const result = response.result;
      const list = result.map((v) => {
        return {
          userName: v.userName,
          idcardNo: v.idcardNo,
          examItem: v.examItem,
          examScore: v.examScore
        };
      });
      this.$refs.scoreEntry.setList(list, list.length);
    }
  }
};
</script>

<style lang="scss" scoped></style>
