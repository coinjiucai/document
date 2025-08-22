<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['delete']"
      :listApi="['consult', 'psytraineereservationPage']"
      :deleteApi="['consult', 'psytraineereservationDeleteBatch']"
      @edit="edit"
      :editApi="['consult', 'psytraineereservationSave']"
      @add="add"
      :addApi="['consult', 'psytraineereservationSave']"
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
      width="1200px"
      top="5vh"
    >
      <div class="full-block">
        <el-tabs v-model="activeName">
          <el-tab-pane label="个人预约信息" name="1">
            <el-form
              ref="form"
              :model="record"
              :rules="rules"
              label-position="right"
              label-width="120px"
              size="mini"
            >
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="姓名" prop="userName">
                    <FormItem
                      v-model="record.userName"
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
                  <el-form-item label="年龄" prop="age">
                    <!-- <FormItem
                      v-model="record.age"
                      compType="input"
                      placeholder="请输入年龄"
                    ></FormItem> -->
                    <el-input-number
                      v-model="record.age"
                      controls-position="right"
                      placeholder="请输入年龄"
                      :min="1"
                      :max="200"
                      clearable
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系方式" prop="phone">
                    <el-input
                      v-model="record.phone"
                      placeholder="请输入联系方式"
                      @input="handleInput"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="咨询导师" prop="counselorName">
                    <FormItem
                      v-model="record.counselorName"
                      compType="input"
                      placeholder="咨询导师"
                    ></FormItem>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="意向时间" prop="consultTime">
                    <FormItem
                      v-model="record.consultTime"
                      compType="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择时间"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <div style="width: 100%; display: block"></div>
                <el-col :span="8">
                  <el-form-item label="咨询地点" prop="consultAddress">
                    <FormItem
                      v-model="record.consultAddress"
                      compType="input"
                      placeholder="咨询地点"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="咨询问题" prop="consultQuestion">
                    <FormItem
                      v-model="record.consultQuestion"
                      compType="input"
                      placeholder="咨询问题"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName2">
          <el-tab-pane label="咨询记录" name="1" v-loading="rgLoading">
            <div>
              <el-button type="delete" @click="addConsultRecord(record)"
                >添加</el-button
              >
              <el-button type="delete" @click="deleteZxList">删除</el-button>
            </div>
            <div style="height: 300px">
              <BaseTable
                ref="BaseTable"
                height="100%"
                :list="znzxList"
                :page-info="pageInfo"
                :label-list="znzxLabelList"
                :total="total"
                :showSelection="true"
                :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                @page-change="getZnzxList"
                @selectRowList="selectRowList"
              >
                <template slot="files" slot-scope="scope">
                  <div>
                    {{ getValue(scope.row.files) }}
                  </div>
                  <!-- <el-image
                    style="width: 100px; height: 100px"
                    :src="getValue(scope.row.files)"
                    fit="cover"
                    v-if="scope.row.imageUrl"
                    :preview-src-list="[getValue(scope.row.files)]"
                  ></el-image>
                  <span v-else>--</span> -->
                </template>
                <template v-slot:operation>
                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button type="text" @click="detailConsultRecord(row)"
                        >查看详情</el-button
                      >
                      <el-button type="text" @click="editConsultRecord(row)"
                        >编辑</el-button
                      >
                    </template>
                  </el-table-column>
                </template>
              </BaseTable>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>

    <ConsultationDialog
      ref="consultationDialog"
      :saveOuter="true"
      @save="successRg"
    ></ConsultationDialog>
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
import ConsultationDialog from './consultationDialog';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    BaseTable,
    ConsultationDialog
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
        userName: '', // 姓名
        counselorName: '' // 咨询导师
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '姓名',
          compType: 'input',
          width: 160,
          placeholder: '姓名',
          prop: 'userName',
          clearable: true
        },
        {
          label: '咨询导师',
          compType: 'input',
          width: 160,
          placeholder: '咨询导师',
          prop: 'counselorName',
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '咨询导师',
          prop: 'counselorName'
        },
        {
          label: '意向时间',
          prop: 'consultTime'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      dialogTitle: '咨询信息',
      type: 'edit',
      record: {
        userName: '', // 姓名
        sex: '', // 性别
        age: '', // 年龄
        phone: '',
        counselorName: '', // 咨询导师
        consultTime: '', // 意向时间
        consultAddress: '', // 咨询地点
        consultQuestion: '' // 咨询问题
      },
      rules: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
        phone: [
          { validator: validateTelephone, required: true, trigger: 'blur' }
        ],
        counselorName: [
          { required: true, message: '咨询导师不能为空', trigger: 'blur' }
        ],
        consultTime: [
          { required: true, message: '意向时间不能为空', trigger: 'change' }
        ],
        consultAddress: [
          { required: true, message: '咨询地点不能为空', trigger: 'blur' }
        ],
        consultQuestion: [
          { required: true, message: '咨询问题不能为空', trigger: 'blur' }
        ]
      },
      importTips: [
        '请严格参照模板规范进行导入;',
        '一次只能导入一个不超过20MB大小的excel文件;',
        '支持的excel格式有.xls与.xlsx'
      ],
      modelUrl: '', // 下载模板
      actionUrl: '', // 导入接口
      activeName: '1',
      roleList: [],
      activeName2: '1',
      pageInfo: {
        pageSize: 10,
        pageNo: 1
      },
      total: 0,
      znzxList: [],
      znzxLabelList: [
        {
          label: '咨询时间',
          prop: 'consultTime'
        },
        {
          label: '咨询老师',
          prop: 'consultTeacher'
        },
        {
          label: '相关附件',
          prop: 'files',
          special: true
        }
      ],
      selection: [],
      rgLoading: false
    };
  },
  mounted() {
    this.modelUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psyearlywarnmanagement/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psyearlywarnmanagement/import`;
    this.getRoleList();
  },
  methods: {
    getValue(val) {
      var name = '';
      if (val && val != '无') {
        const item = JSON.parse(val);
        name = item && item.length > 0 ? item[0].name : '';
      }
      return name ? name : '--';
    },
    handleInput(inputValue) {
      // 使用正则表达式过滤非数字字符
      const filteredValue = inputValue.replace(/\D/g, '');
      // 更新绑定的值

      this.record.phone = filteredValue;
    },
    getRoleList() {
      this.$api.System.getAllRole().then((res) => {
        this.roleList = res.result;
      });
    },
    add() {
      this.type = 'add';
      this.record = {
        userName: '', // 姓名
        sex: '', // 性别
        account: '', // 账号
        userDictId: '', // 人员类别
        age: '', // 年龄
        roleIds: '', // 角色
        studentId: '', // 学号
        idNumber: '', // 身份证号码
        phone: '' // 联系方式
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.record = { ...record };
      this.znzxList = [];
      this.total = 0;
      this.getZnzxList();
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        userName: '', // 姓名
        sex: '', // 性别
        account: '', // 账号
        userDictId: '', // 人员类别
        age: '', // 年龄
        roleIds: '', // 角色
        studentId: '', // 学号
        idNumber: '', // 身份证号码
        phone: '' // 联系方式
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
            ...this.record,
            roleIds:
              this.record.roleIds && this.record.roleIds.length > 0
                ? this.record.roleIds.join(',')
                : ''
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
    // 保存人工干预
    successRg(val) {
      try {
        this.rgLoading = true;
        this.$api.consult
          .psytraineeconsultationSave(val)
          .then((res) => {
            this.$message.success('保存成功!');
            this.getZnzxList();
          })
          .catch((error) => {
            this.rgLoading = false;
          })
          .finally(() => {
            this.rgLoading = false;
          });
      } catch (error) {
        this.rgLoading = false;
      }
    },
    getZnzxList() {
      this.rgLoading = true;
      this.$api.consult
        .psytraineeconsultationage({
          ...this.pageInfo,
          traineeReservationId: this.record.id
        })
        .then((res) => {
          this.rgLoading = false;
          this.znzxList = res['result'].records;
          this.total = res['result'].total;
        });
    },
    addConsultRecord(item) {
      this.$refs.consultationDialog.show(item, null);
      this.$refs.consultationDialog.record.userName = item.userName;
      this.$refs.consultationDialog.record.userId = item.userId;
    },
    detailConsultRecord(item) {
      this.$refs.consultationDialog.show(this.record, item, false);
    },
    editConsultRecord(item) {
      this.$refs.consultationDialog.show(this.record, item, true);
    },
    selectRowList(selection) {
      this.selection = selection;
    },
    deleteZxList() {
      this.$confirm('确定删除这些咨询记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selection.map((v) => v.id);
        this.$api.consult
          .psytraineeconsultationDeleteBatch({ ids: ids.join(',') })
          .then((res) => {
            if (res.code == 200) {
              this.pageInfo.pageNo = 1;
              this.$message.success('删除成功!');
            }
          })
          .finally(() => {
            this.getZnzxList();
          });
      });
    }
  }
};
</script>
