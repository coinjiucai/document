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
      :listApi="['consult', 'psycounselorPage']"
      :deleteApi="['consult', 'psycounselorDeleteBatch']"
      @edit="edit"
      :editApi="['consult', 'psycounselorSave']"
      @add="add"
      :addApi="['consult', 'psycounselorSave']"
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
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <FormItem
                  v-model="record.name"
                  compType="input"
                  placeholder="请输入姓名"
                  maxlength="20"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="sex">
                <FormItem
                  v-model="record.sex"
                  compType="select"
                  dictCode="sex"
                  placeholder="请选择性别"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号" prop="account">
                <FormItem
                  v-model="record.account"
                  compType="input"
                  placeholder="请输入账号"
                  maxlength="30"
                  show-word-limit
                  @input="handleInputNoChinese"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系方式" prop="phone">
                <FormItem
                  v-model="record.phone"
                  compType="input"
                  placeholder="请输入联系方式"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职称" prop="post">
                <FormItem
                  v-model="record.post"
                  compType="input"
                  placeholder="请输入职称"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄" prop="age">
                <FormItem
                  v-model="record.age"
                  compType="input"
                  placeholder="请输入年龄"
                  oninput="value=value.replace(/[^0-9]/g,'')"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="咨询地点" prop="address">
                <FormItem
                  v-model="record.address"
                  compType="input"
                  placeholder="请输入咨询地点"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序" prop="sort">
                <el-input-number
                  v-model="record.sort"
                  style="width: 100%"
                  placeholder="请输入序号"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="个人简介" prop="introduction">
                <!-- <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="record.introduction"
                >
                </el-input> -->
                <BaseQuillEditor
                  v-model="record.introduction"
                  @change="handleIntroductione"
                ></BaseQuillEditor>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="照片" prop="imageUrl">
                <ImageUpload v-model="record.imageUrl" @change="changeUpload">
                </ImageUpload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="二维码" prop="webchatImg">
                <ImageUpload
                  v-model="record.webchatImg"
                  @change="changewebchatImg"
                >
                </ImageUpload>
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
import BaseQuillEditor from '@/views/basicsManage/questionBankManage/components/BaseQuillEditor.vue';

export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    BaseTable,
    BaseQuillEditor
  },
  data() {
    // 定义手机号码和座机号码的校验规则函数
    const validateTelephone = (rule, value, callback) => {
      // 手机号码正则表达式
      const phoneReg = /^1[3-9]\d{9}$/;
      // 座机号码正则表达式，支持带区号和横杠的格式
      const landlineReg = /^0\d{2,3}-?\d{7,8}$/;

      if (!value) {
        // 如果输入为空，提示不能为空
        return callback(new Error('联系方式不能为空'));
      } else if (!phoneReg.test(value) && !landlineReg.test(value)) {
        // 如果既不是有效的手机号码也不是有效的座机号码，提示格式错误
        return callback(new Error('请输入正确的手机号码或座机号码'));
      } else {
        // 输入格式正确，通过校验
        callback();
      }
    };
    return {
      // 搜索参数
      params: {
        name: '', // 姓名
        post: '' // 职称
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '咨询师姓名',
          compType: 'input',
          width: 160,
          placeholder: '咨询师姓名',
          prop: 'name',
          clearable: true
        },
        {
          label: '职称',
          compType: 'input',
          width: 160,
          placeholder: '职称',
          prop: 'post',
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '照片',
          prop: 'imageUrl',
          parent: 'imageUrl_parent',
          special: true
        },
        {
          label: '职称',
          prop: 'post'
        },
        {
          label: '排序',
          prop: 'sort'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      dialogTitle: '咨询师信息',
      type: 'edit',
      record: {
        name: '', // 姓名
        sex: '', // 性别
        account: '', // 账号
        phone: '', // 联系方式
        post: '', // 职称
        age: '', // 年龄
        address: '', // 咨询地点
        sort: '',
        introduction: '', // 个人简介
        imageUrl: '', // 照片
        webchatImg: '' // 二维码
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        // phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        phone: [
          { validator: validateTelephone, required: true, trigger: 'blur' }
        ],
        post: [{ required: true, message: '请输入职称', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入咨询地点', trigger: 'blur' }
        ],
        introduction: [{ required: true, message: '请输入', trigger: 'blur' }],
        imageUrl: [
          { required: true, message: '请上传照片', trigger: 'change' }
        ],
        webchatImg: [
          { required: true, message: '请上传二维码', trigger: 'change' }
        ]
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
    handleInputNoChinese(value) {
      // 使用正则表达式替换所有中文字符
      this.record.account = value.replace(/[\u4e00-\u9fa5]/g, '');
    },
    getValue(value) {
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
      this.record = {
        name: '', // 姓名
        sex: '', // 性别
        account: '', // 账号
        phone: '', // 联系方式
        post: '', // 职称
        age: '', // 年龄
        address: '', // 咨询地点
        sort: '',
        introduction: '', // 个人简介
        imageUrl: '', // 照片
        webchatImg: '' // 二维码
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.$api.consult
        .getPsycounselorById({
          id: record.id
        })
        .then((res) => {
          this.record = res.result;
          this.visibleDialog = true;
        });
    },
    handleIntroductione(val) {
      console.log(val, 'sss');
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        name: '', // 姓名
        sex: '', // 性别
        account: '', // 账号
        phone: '', // 联系方式
        post: '', // 职称
        age: '', // 年龄
        address: '', // 咨询地点
        sort: '',
        introduction: '', // 个人简介
        imageUrl: '', // 照片
        webchatImg: '' // 二维码
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
          this.$refs.listPage.saveRow({
            ...this.record
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
