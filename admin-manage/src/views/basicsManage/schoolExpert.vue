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
      :listApi="['basics', 'psyexpertPage']"
      :deleteApi="['basics', 'psyexpertDeleteBatch']"
      @edit="edit"
      :editApi="['basics', 'psyexpertSave']"
      @add="add"
      :addApi="['basics', 'psyexpertSave']"
    >
      <template slot="imageUrl_parent" slot-scope="scope">
        <el-image
          style="width: 50px; height: 50px"
          :src="getValue(scope.row.imageUrl)"
          fit="cover"
          v-if="scope.row.imageUrl"
          :preview-src-list="[getValue(scope.row.imageUrl)]"
        ></el-image>
        <span v-else>--</span>
      </template>
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
        >
      </template>
    </ListPage>
    <!-- 弹窗 -->
    <BaseDialog
      custom-class="consult-ant-dialog"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
      top="5vh"
      destroy-on-close
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="80px"
          size="mini"
        >
          <el-row :gutter="0">
            <el-col :span="24">
              <el-form-item label="专家姓名" prop="name">
                <FormItem
                  v-model="record.name"
                  compType="input"
                  placeholder="请输入专家姓名"
                  maxlength="20"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="专家学派" prop="school">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  placeholder="请输入专家学派"
                  v-model="record.school"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="专家简介" prop="introduction">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  placeholder="请输入专家简介"
                  v-model="record.introduction"
                  maxlength="500"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="自我介绍" prop="say">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  placeholder="请输入自我介绍"
                  v-model="record.say"
                  maxlength="1000"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="图片上传" prop="imageUrl">
                <FormItem
                  compType="upload"
                  v-model="record.imageUrl"
                  :limit="1"
                  :showMode="1"
                  accept=".png,.jpg,.jpeg,.gif"
                  title="上传"
                ></FormItem>
              </el-form-item>
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
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import BaseTable from '@/components/Base/BaseTable';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    BaseTable
  },
  data() {
    return {
      // 搜索参数
      params: {
        name: '' // 姓名
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '专家姓名',
          compType: 'input',
          width: 160,
          placeholder: '专家姓名',
          prop: 'name',
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '图片',
          prop: 'imageUrl',
          parent: 'imageUrl_parent',
          special: true
        },
        {
          label: '专家姓名',
          prop: 'name'
        },
        {
          label: '学派',
          prop: 'school'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      dialogTitle: '新增专家信息',
      type: 'edit',
      record: {
        name: '', // 专家姓名
        school: '', // 学派
        introduction: '', // 专家简介
        say: '', // 自我介绍
        imageUrl: [] // 图片上传
      },
      rules: {
        name: [{ required: true, message: '请输入专家姓名', trigger: 'blur' }],
        school: [
          { required: true, message: '请输入专家学派', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入专家简介', trigger: 'blur' }
        ],
        say: [{ required: true, message: '请输入专家介绍', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请选择图片', trigger: 'change' }]
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
    this.modelUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psyearlywarnmanagement/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psyearlywarnmanagement/import`;
  },
  methods: {
    getValue(val) {
      const item = JSON.parse(val);
      const value = item[0].fileUrl;
      if (!value) {
        return '';
      }
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    add() {
      this.type = 'add';
      this.dialogTitle = '新增专家信息';
      this.record = {
        name: '', // 专家姓名
        school: '', // 学派
        introduction: '', // 专家简介
        say: '', // 自我介绍
        imageUrl: [] // 图片上传
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.dialogTitle = '编辑专家信息';
      var imageUrl = [];
      if (record.imageUrl) {
        imageUrl = JSON.parse(record.imageUrl);
      }
      this.record = { ...record, imageUrl: imageUrl };

      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        name: '', // 专家姓名
        school: '', // 学派
        introduction: '', // 专家简介
        say: '', // 自我介绍
        imageUrl: [] // 图片上传
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
          var imageUrl = '';
          if (this.record.imageUrl && this.record.imageUrl.length > 0) {
            imageUrl = JSON.stringify(this.record.imageUrl);
          }
          this.$refs.listPage.saveRow({
            ...this.record,
            imageUrl: imageUrl
          });
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
    },
    changeUpload(res) {
      this.record.imageUrl = res.message;
    },
    changewebchatImg(res) {
      this.record.webchatImg = res.message;
    }
  }
};
</script>
