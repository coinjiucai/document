<template>
  <div class="component-DepartManage flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="组织架构"
      node-key="id"
      :tree-data.sync="treeList"
      :get-url="['System', 'psysysdepartTreeList']"
      :delete-url="['System', 'sysprivacyuserDeleteBatch']"
      :disabledOption="false"
      :default-props="{ label: 'name', value: 'id', children: 'childrenList' }"
      @add="handleAddDepart"
      @edit="handleEditDepart"
      @current-change="handleCurrentChange"
    >
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle flex-layout pa10">
      <ListPage
        ref="listPage"
        :params="params"
        :fieldsConfig="fieldsConfig"
        :labelList="labelList"
        :listApi="['basics', 'userList']"
        :deleteApi="['basics', 'deleteBatch']"
        @edit="edit"
        :editApi="['basics', 'userEdit']"
        @add="add"
        :addApi="['basics', 'userAdd']"
      >
        <template slot="action_parent" slot-scope="scope">
          <!-- <el-link :underline="false" type="danger">{{ scope.row.id }}</el-link> -->
          <el-link :underline="false" type="primary" @click="edit(scope.row)"
            >编辑</el-link
          >
          <el-link
            :underline="false"
            type="primary"
            style="margin-left: 10px"
            @click="reset(scope.row)"
            >重置密码</el-link
          >
        </template>
      </ListPage>
    </div>
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
          label-width="100px"
        >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="部门" prop="departId">
                <el-cascader
                  v-model="departPath"
                  :options="treeNotEmpty"
                  :props="{
                    label: 'name',
                    value: 'id',
                    children: 'childrenList',
                    checkStrictly: true
                  }"
                  :show-all-levels="true"
                  style="width: 100%"
                  @change="changeDepartId"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" prop="realname">
                <el-input
                  v-model="record.realname"
                  placeholder="姓名"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="sex">
                <FormItem
                  v-model="record.sex"
                  compType="select"
                  dictCode="sex"
                  placeholder="性别"
                  style="width: 100%"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号" prop="username">
                <el-input
                  v-model="record.username"
                  placeholder="账号"
                  maxlength="30"
                  @input="handleInputNoChinese"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="人员类型" prop="userType">
                <FormItem
                  v-model="record.userType"
                  compType="select"
                  dictCode="userType"
                  style="width: 100%"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄" prop="age">
                <el-input-number
                  v-model="record.age"
                  controls-position="right"
                  placeholder="年龄"
                  :min="1"
                  :max="200"
                  clearable
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="角色" prop="roleIds">
                <el-select
                  v-model="record.roleIds"
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号" prop="idCard">
                <el-input
                  v-model="record.idCard"
                  placeholder="身份证号"
                  @blur="calculateAge"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系方式" prop="telephone">
                <el-input
                  v-model="record.telephone"
                  placeholder="联系方式"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="头像" prop="avatar">
                <ImageUpload v-model="record.avatar" @change="changeUpload">
                </ImageUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
    <departDetailDialog
      ref="detail"
      @save="handleReloadTree"
    ></departDetailDialog>
  </div>
</template>

<script>
import LeftCatalogue from '@/components/Project/LeftCatalogue';
import departDetailDialog from '@/views/systemManage/DepartManage/departDetailDialog';
import BaseTable from '@/components/Base/BaseTable';
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import FormItem from '@/components/Form/Item';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import Common from '@/com/common';
import utilsCommon from '@/utils/common';
export default {
  name: 'DepartManage',
  components: {
    LeftCatalogue,
    departDetailDialog,
    BaseTable,
    ListPage,
    BaseDialog,
    FileImportDialog,
    FormItem,
    ImageUpload
  },
  props: {},
  data() {
    const validateIdCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入身份证号'));
      }

      // 基本格式校验（支持15位和18位）
      const idCardReg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
      if (!idCardReg.test(value)) {
        return callback(new Error('身份证号格式不正确'));
      }

      // 15位身份证校验
      if (value.length === 15) {
        // 校验出生日期
        const birthDate = `19${value.substring(6, 8)}-${value.substring(
          8,
          10
        )}-${value.substring(10, 12)}`;
        if (isNaN(Date.parse(birthDate))) {
          return callback(new Error('身份证出生日期无效'));
        }
        return callback();
      }

      // 18位身份证校验
      if (value.length === 18) {
        // 校验出生日期
        const birthDate = `${value.substring(6, 10)}-${value.substring(
          10,
          12
        )}-${value.substring(12, 14)}`;
        if (isNaN(Date.parse(birthDate))) {
          return callback(new Error('身份证出生日期无效'));
        }

        // 校验码验证
        const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const checkCodes = [
          '1',
          '0',
          'X',
          '9',
          '8',
          '7',
          '6',
          '5',
          '4',
          '3',
          '2'
        ];

        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += parseInt(value[i]) * weights[i];
        }

        const mod = sum % 11;
        const computedCheck = checkCodes[mod];

        if (computedCheck !== value[17].toUpperCase()) {
          return callback(new Error('身份证校验码不正确'));
        }

        // 简单地区代码校验（前两位）
        const provinceCode = parseInt(value.substring(0, 2));
        if (provinceCode < 11 || provinceCode > 91) {
          return callback(new Error('身份证地区编码无效'));
        }
      }

      callback();
    };
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'));
      }

      // 手机号正则（严格模式）
      const mobileReg = /^1[3-9]\d{9}$/;

      if (!mobileReg.test(value)) {
        return callback(new Error('手机号码格式不正确'));
      }

      // 运营商号段验证（2023年最新）
      const operatorSegments = {
        中国电信: /^(133|149|153|173|177|180|181|189|190|191|193|199)\d{8}$/,
        中国联通:
          /^(130|131|132|145|155|156|166|167|171|175|176|185|186|196)\d{8}$/,
        中国移动:
          /^(134|135|136|137|138|139|147|148|150|151|152|157|158|159|172|178|182|183|184|187|188|195|197|198)\d{8}$/,
        虚拟运营商: /^(162|165|167|170|171)\d{8}$/,
        广电: /^(192)\d{8}$/
      };

      let validOperator = false;
      for (const [operator, regex] of Object.entries(operatorSegments)) {
        if (regex.test(value)) {
          validOperator = true;
          break;
        }
      }

      if (!validOperator) {
        return callback(new Error('手机号段不存在'));
      }

      callback();
    };
    return {
      treeList: [],
      treeNotEmpty: [],
      // 搜索参数
      params: {
        realname: '',
        idCard: '',
        age: '',
        sex: '',
        telephone: '',
        departId: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '姓名',
          compType: 'input',
          width: 160,
          placeholder: '姓名',
          prop: 'realname'
        },
        {
          label: '身份证号',
          compType: 'input',
          width: 160,
          placeholder: '身份证号',
          prop: 'idCard'
        },
        {
          label: '年龄',
          compType: 'input',
          width: 160,
          placeholder: '年龄',
          prop: 'age'
        },
        {
          label: '性别',
          compType: 'select',
          width: 160,
          prop: 'sex',
          dictCode: 'sex'
        },
        {
          label: '联系方式',
          compType: 'input',
          width: 160,
          placeholder: '联系方式',
          prop: 'telephone'
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '姓名', prop: 'realname' },
        {
          label: '身份证号',
          prop: 'idCard'
        },
        { label: '年龄', prop: 'age' },
        {
          label: '性别',
          prop: 'sex_dictText'
        },
        { label: '联系方式', prop: 'telephone' },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      dialogTitle: '用户信息',
      type: 'add',
      roleList: [],
      record: {
        departId: '',
        realname: '',
        sex: '1',
        userType: '', // 人员类型
        username: '',
        idCard: '',
        age: '',
        roleIds: [],
        telephone: '',
        avatar: '' // 用户头像
      },
      departPath: [],
      rules: {
        departId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        // username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        userType: [
          { required: true, message: '请选择人员类型', trigger: 'change' }
        ],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      importTips: [
        '请严格参照模板规范进行导入;',
        '一次只能导入一个不超过20MB大小的excel文件;',
        '支持的excel格式有.xls与.xlsx'
      ],
      modelUrl: '',
      actionUrl: ''
    };
  },
  created() {},
  mounted() {
    this.modelUrl = `${Browser.getApiUrl()}/mlf-csjm-service/product/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-csjm-service/product/import\n`;
    this.getRoleList();
  },
  filters: {},
  watch: {},
  computed: {
    currentDepartName() {
      if (this.treeList.length && this.params.departId) {
        let departName = '';
        Common.depthFirstSearch(this.treeList, (item) => {
          if (item.id === this.params.departId) {
            departName = item.departName;
          }
        });
        return departName;
      } else {
        return '';
      }
    }
  },
  methods: {
    isValidIdCard(idCard) {
      // 简单的格式验证
      const reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
      return reg.test(idCard);
    },
    maskIdCard(idCard, start = 4, end = 4, maskChar = '*') {
      if (!idCard || idCard.length < start + end) return idCard;

      const visibleStart = idCard.substring(0, start);
      const visibleEnd = idCard.substring(idCard.length - end);
      const maskedLength = idCard.length - start - end;
      const maskedPart = maskChar.repeat(maskedLength);

      return visibleStart + maskedPart + visibleEnd;
    },
    maskIdCardSecure(idCard) {
      if (!this.isValidIdCard(idCard)) {
        console.warn('Invalid ID card number');
        return '--';
      }

      return this.maskIdCard(idCard); // 使用前面的脱敏方法
    },
    handleInputNoChinese(value) {
      // 使用正则表达式替换所有中文字符
      this.record.username = value.replace(/[\u4e00-\u9fa5]/g, '');
    },
    /**
     * 单位保存成功后重新获取单位列表
     */
    handleReloadTree() {
      this.$refs.catalogue.getTree();
    },
    /**
     * 单位变更
     */
    handleCurrentChange(data) {
      this.params.departId = data['id'];
      const listPage = this.$refs.listPage;
      listPage.pageInfo.pageNo = 1;
      listPage.getList();
    },
    /**
     * 点击新增单位
     * @param tree
     */
    handleAddDepart(tree) {
      this.$refs.detail.show(tree);
    },
    /**
     * 点击修改
     * @param tree
     * @param current
     */
    handleEditDepart(tree, current) {
      this.$refs.detail.show(tree, current);
    },
    getRoleList() {
      this.$api.System.getAllRole().then((res) => {
        this.roleList = res.result;
      });
    },
    calculateAge() {
      const idCard = this.record.idCard;
      // 身份证号码长度为 18 位或 15 位才进行处理
      if (idCard.length === 18 || idCard.length === 15) {
        let birthDate;
        if (idCard.length === 18) {
          // 18 位身份证号码，出生日期在第 7 到 14 位
          birthDate = idCard.slice(6, 14);
        } else {
          // 15 位身份证号码，出生日期在第 7 到 12 位，年份需补全为 19XX
          birthDate = `19${idCard.slice(6, 12)}`;
        }
        // 将出生日期字符串转换为 Date 对象
        const birth = new Date(birthDate.replace(/(.{4})(.{2})/, '$1-$2-'));
        const now = new Date();
        // 计算年龄
        let age = now.getFullYear() - birth.getFullYear();
        const monthDiff = now.getMonth() - birth.getMonth();
        // 如果当前月份小于出生月份，或者当前月份等于出生月份但日期小于出生日期，则年龄减 1
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && now.getDate() < birth.getDate())
        ) {
          age--;
        }
        this.record.age = age;
      }
    },
    add() {
      this.type = 'add';
      this.record = {
        departId: '',
        realname: '',
        sex: '',
        userType: '', // 人员类型
        username: '',
        idCard: '',
        age: '',
        roleIds: [],
        telephone: '',
        avatar: '' // 用户头像
      };
      this.treeNotEmpty = utilsCommon.removeEmptyChildrenList(this.treeList);
      const departPath = utilsCommon.findPathById(
        this.treeList,
        this.params.departId
      );
      this.departPath = departPath;
      if (this.departPath.length > 0) {
        this.record.departId = this.departPath[this.departPath.length - 1];
      }
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.$api.basics.userQueryById({ id: record.id }).then((res) => {
        const record = res.result;
        this.record = { ...record };
        this.treeNotEmpty = utilsCommon.removeEmptyChildrenList(this.treeList);
        const departPath = utilsCommon.findPathById(
          this.treeList,
          record.departId
        );
        this.departPath = departPath;
        if (this.record.roleIds) {
          this.record.roleIds = this.record.roleIds.split(',');
        } else {
          this.record.roleIds = [];
        }
        this.visibleDialog = true;
      });
    },
    changeUpload(res) {
      this.record.avatar = res.message;
    },
    reset(row) {
      this.$confirm('重置后的密码为123456，是否确认重置该用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.basics
          .resetPass({ ids: row.id })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('重置成功');
            }
          })
          .finally(() => {
            this.$refs.listPage.getList();
          });
      });
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        realname: '',
        sex: '',
        userType: '', // 人员类型
        username: '',
        idCard: '',
        age: '',
        roleIds: [],
        telephone: '',
        avatar: '' // 用户头像
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave() {
      console.log(this.record, '================');
      this.$refs.form.validate((val) => {
        if (val) {
          const roleIds = this.record.roleIds;
          const departPath = this.departPath;
          this.$refs.listPage.saveRow({
            ...this.record,
            roleIds: roleIds.join(','),
            departId: departPath[departPath.length - 1]
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
    changeDepartId(val) {
      const departId = val[val.length - 1];
      console.log(departId, 'sdd');
      this.record.departId = departId;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-DepartManage {
}
</style>
