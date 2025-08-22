<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
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
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="姓名" prop="realname">
                <el-input
                  v-model="record.realname"
                  placeholder="姓名"
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
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号" prop="username">
                <el-input
                  v-model="record.username"
                  placeholder="账号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="人员类型" prop="userType">
                <FormItem
                  v-model="record.userType"
                  compType="select"
                  dictCode="userType"
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
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="身份证号" prop="idCard">
                <el-input
                  v-model="record.idCard"
                  placeholder="身份证号"
                  @blur="calculateAge"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
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
  </div>
</template>
<script>
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
import Browser from "@/utils/browser";
import FileImportDialog from "@/components/FileImport/FileImportDialog";
import FormItem from "@/components/Form/Item";
import ImageUpload from "@/components/FileUpload/ImageUpload.vue";
export default {
  components: {
    ListPage,
    BaseDialog,
    FileImportDialog,
    FormItem,
    ImageUpload,
  },
  data() {
    const validateIdCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入身份证号"));
      }
      const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!idCardReg.test(value)) {
        return callback(new Error("身份证号格式不正确"));
      }
      // 18位身份证号码的校验
      //   if (value.length === 18) {
      //     const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
      //     const idCardY = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码
      //     let sum = 0;
      //     for (let i = 0; i < 17; i++) {
      //       sum += parseInt(value.charAt(i), 10) * idCardWi[i];
      //     }
      //     const mod = sum % 11;
      //     const idCardLast = value.charAt(17);
      //     if (idCardY[mod] !== idCardLast) {
      //       return callback(new Error('身份证号校验不通过'));
      //     }
      //   }
      callback();
    };
    return {
      // 搜索参数
      params: {
        realname: "",
        idCard: "",
        age: "",
        sex: "",
        telephone: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "姓名",
          compType: "input",
          width: 160,
          placeholder: "姓名",
          prop: "realname",
        },
        {
          label: "身份证号",
          compType: "input",
          width: 160,
          placeholder: "身份证号",
          prop: "idCard",
        },
        {
          label: "年龄",
          compType: "input",
          width: 160,
          placeholder: "年龄",
          prop: "age",
        },
        {
          label: "性别",
          compType: "select",
          width: 160,
          prop: "sex",
          dictCode: "sex",
        },
        {
          label: "联系方式",
          compType: "input",
          width: 160,
          placeholder: "联系方式",
          prop: "telephone",
        },
      ],
      // 表格字段列配置
      labelList: [
        { label: "姓名", prop: "realname" },
        { label: "身份证号", prop: "idCard" },
        { label: "年龄", prop: "age" },
        {
          label: "性别",
          prop: "sex_dictText",
        },
        { label: "联系方式", prop: "telephone" },
        {
          label: "操作",
          prop: "action",
          parent: "action_parent",
          special: true,
        },
      ],
      visibleDialog: false,
      dialogTitle: "用户信息",
      type: "add",
      roleList: [],
      record: {
        realname: "",
        sex: "1",
        userType: "", // 人员类型
        username: "",
        idCard: "",
        age: "",
        roleIds: [],
        telephone: "",
        avatar: "", // 用户头像
      },
      rules: {
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        userType: [
          { required: true, message: "请选择人员类型", trigger: "change" },
        ],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        idCard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: validateIdCard, trigger: "blur" },
        ],
        telephone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
      },
      importTips: [
        "请严格参照模板规范进行导入;",
        "一次只能导入一个不超过20MB大小的excel文件;",
        "支持的excel格式有.xls与.xlsx",
      ],
      modelUrl: "",
      actionUrl: "",
    };
  },
  mounted() {
    this.modelUrl = `${Browser.getApiUrl()}/mlf-csjm-service/product/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-csjm-service/product/import\n`;
    this.getRoleList();
  },
  methods: {
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
        const birth = new Date(birthDate.replace(/(.{4})(.{2})/, "$1-$2-"));
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
      this.type = "add";
      this.record = {
        realname: "",
        sex: "",
        userType: "", // 人员类型
        username: "",
        idCard: "",
        age: "",
        roleIds: [],
        telephone: "",
        avatar: "", // 用户头像
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = "edit";
      this.$api.basics.userQueryById({ id: record.id }).then((res) => {
        const record = res.result;
        this.record = { ...record };

        if (this.record.roleIds) {
          this.record.roleIds = this.record.roleIds.split(",");
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
      this.$confirm("重置后的密码为123456，是否确认重置该用户密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.basics
          .resetPass({ ids: row.id })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("重置成功");
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
        realname: "",
        sex: "",
        userType: "", // 人员类型
        username: "",
        idCard: "",
        age: "",
        roleIds: [],
        telephone: "",
        avatar: "", // 用户头像
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
          const roleIds = this.record.roleIds;
          console.log(roleIds, "ssss");
          this.$refs.listPage.saveRow({
            ...this.record,
            roleIds: roleIds.join(","),
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
  },
};
</script>
