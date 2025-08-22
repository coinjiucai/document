<template>
  <div>
    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1200px"
      top="5vh"
    >
      <div class="full-block" v-if="record">
        <el-tabs v-model="activeName" style="margin-top: -20px">
          <el-tab-pane label="个人基本信息" name="1">
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
                  <el-form-item label="姓名" prop="realname">
                    <FormItem
                      v-model="record.realname"
                      compType="input"
                      placeholder="姓名"
                      readonly
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="性别"
                    prop="sex"
                    style="position: relative"
                  >
                    <FormItem
                      v-model="record.sex"
                      compType="select"
                      dictCode="sex"
                      placeholder="性别"
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="账号" prop="username">
                    <FormItem
                      v-model="record.username"
                      compType="input"
                      readonly
                      placeholder="账号"
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="人员类别" prop="userType">
                    <FormItem
                      v-model="record.userType"
                      compType="select"
                      readonly
                      dictCode="userType"
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="年龄" prop="age">
                    <FormItem
                      v-model="record.age"
                      compType="input"
                      placeholder="年龄"
                      readonly
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <div style="width: 100%; display: block"></div>
                <el-col :span="8" style="position: relative">
                  <el-form-item label="角色" prop="roleIds">
                    <el-select
                      v-model="record.roleIds"
                      multiple
                      placeholder="请选择"
                      :disabled="true"
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
                <el-col :span="24">
                  <el-form-item label="身份证号" prop="idCard">
                    <FormItem
                      v-model="record.idCard"
                      compType="input"
                      readonly
                      placeholder="身份证号"
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="联系方式" prop="telephone">
                    <FormItem
                      v-model="record.telephone"
                      compType="input"
                      readonly
                      placeholder="联系方式"
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预警处理" prop="disposeStatus">
                    <el-radio-group
                      v-model="record.disposeStatus"
                      @change="changeDisposeStatus"
                    >
                      <el-radio :label="0">处理中</el-radio>
                      <el-radio :label="1">已完成</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="预警处理时间:" prop="disposeTime">
                    <FormItem
                      v-model="record.disposeTime"
                      compType="datetime"
                      fromat="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择时间"
                    >
                    </FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName2" @tab-click="changeTabList">
          <el-tab-pane label="智能咨询记录" name="1">
            <div style="height: 350px">
              <BaseTable
                ref="BaseTable"
                height="100%"
                :list="znzxList"
                :page-info="pageInfo"
                :label-list="znzxLabelList"
                :total="total"
                :showIndex="true"
                :showSelection="false"
                :showPagination="true"
                :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                @page-change="getZnzxList"
              >
                <template v-slot:operation>
                  <el-table-column label="预警情况">
                    <template #default="{ row }">
                      {{ row.isWarn == 1 ? row.introduction : '无' }}
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button type="text" @click="znzxDetail(row)"
                        >查看对话详情</el-button
                      >
                    </template>
                  </el-table-column>
                </template>
              </BaseTable>
            </div>
          </el-tab-pane>
          <el-tab-pane label="心理测评记录" name="2">
            <div style="height: 350px">
              <BaseTable
                ref="BaseTable"
                height="100%"
                :list="xlcpList"
                :page-info="pageInfo2"
                :label-list="xlcpLabelList"
                :total="total2"
                :showSelection="false"
                :showPagination="true"
                :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                @page-change="getXlcpList"
              >
                <template v-slot:operation>
                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button type="text" @click="xlcpDetail(row)"
                        >查看测评报告</el-button
                      >
                    </template>
                  </el-table-column>
                </template>
              </BaseTable>
            </div>
          </el-tab-pane>
          <el-tab-pane label="心理学习记录" name="3">
            <div style="height: 350px">
              <BaseTable
                ref="BaseTable"
                height="100%"
                :list="xlxxList"
                :page-info="pageInfo3"
                :label-list="xlxxLabelList"
                :total="total3"
                :showSelection="false"
                :showPagination="true"
                :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                @page-change="getXlxxList"
              >
                <template #content>
                  <el-table-column
                    label="课程名称"
                    prop="courseName"
                    :min-width="200"
                  >
                  </el-table-column>
                  <el-table-column label="学习时间" :min-width="200">
                    <template #default="{ row }">
                      <span v-if="row.startTime"
                        >{{ formatterDate(row.startTime) }}至{{
                          formatterDate(row.endTime)
                        }}</span
                      >
                      <span v-else>--</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="学习进度" width="160">
                    <template #default="{ row }">
                      <span>{{
                        row.progress ? row.progress + '%' : '0%'
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button type="text" @click="kcDetail(row)"
                        >查看详情</el-button
                      >
                    </template>
                  </el-table-column>
                </template>
              </BaseTable>
            </div>
          </el-tab-pane>
          <el-tab-pane label="认知训练记录" name="4">
            <div style="height: 350px">
              <BaseTable
                ref="BaseTable"
                height="100%"
                :list="rzxlList"
                :page-info="pageInfo4"
                :label-list="rzxlLabelList"
                :total="total4"
                :showSelection="false"
                :showPagination="true"
                :showIndex="true"
                :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                @page-change="getRzxljlList"
              >
                <template v-slot:operation>
                  <el-table-column label="训练时间" :min-width="200">
                    <template #default="{ row }">
                      <span v-if="row.startTime"
                        >{{ formatterDate(row.startTime) }}至{{
                          formatterDate(row.endTime)
                        }}</span
                      >
                      <span v-else>--</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button type="text" @click="rzxlDetail(row)"
                        >查看报告</el-button
                      >
                    </template>
                  </el-table-column>
                </template>
              </BaseTable>
            </div>
          </el-tab-pane>
          <el-tab-pane label="咨询预约记录" name="5">
            <div style="height: 350px">
              <BaseTable
                ref="BaseTable"
                height="100%"
                :list="zxyyList"
                :page-info="pageInfo5"
                :label-list="zxyyLabelList"
                :total="total5"
                :showSelection="false"
                :showPagination="true"
                :showIndex="true"
                :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                @page-change="getZxyyjlList"
              >
                <template v-slot:operation>
                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button type="text" @click="zxDetail(row)"
                        >查看详情</el-button
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
        <el-button type="prymary" @click="saveDisposeStatus">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
    <zxDialog ref="zxDialog"></zxDialog>
    <ltDialog ref="ltDialog"></ltDialog>
    <!-- pdf 预览 -->
    <viewPdfDialog width="98%" ref="viewPdfDialog" title="详情"></viewPdfDialog>
    <BaseDialog
      class="full-block component-study-dialog full-dialog"
      title="课程详情"
      center
      :visible.sync="kcDialog"
      @closed="handldCloseDialog"
      width="98%"
      top="5vh"
      destroy-on-close
    >
      <div class="full-block">
        <Study
          ref="study"
          :courseId="courseId"
          :courseName="courseName"
          :course="course"
        ></Study>
      </div>
    </BaseDialog>
  </div>
</template>
<script>
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import BaseTable from '@/components/Base/BaseTable';
import zxDialog from './components/zxDialog.vue';
import ltDialog from './components/ltDialog.vue';
import viewPdfDialog from './components/viewPdfDialog.vue';
import Study from '@/views/study/study';
import { mapGetters } from 'vuex';
import moment from 'moment';
export default {
  components: {
    BaseDialog,
    FormItem,
    ImageUpload,
    BaseTable,
    zxDialog,
    ltDialog,
    viewPdfDialog,
    Study
  },
  data() {
    return {
      rylb: [],
      aa: 1,
      visibleDialog: false,
      dialogTitle: '人员档案',
      type: 'edit',
      record: {
        realname: '', // 姓名
        sex: '', // 性别
        username: '', // 账号
        userType: '', // 人员类别
        age: '', // 年龄
        roleIds: '', // 角色
        // studentId: "", // 学号
        idCard: '', // 身份证号码
        telephone: '', // 联系方式
        disposeStatus: 0, // 1 已处理，0 处理中
        disposeTime: ''
      },
      rules: {
        realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        // account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        userType: [
          { required: true, message: '请选择人员类别', trigger: 'change' }
        ],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        // studentId: [{ required: true, message: "请输入学号", trigger: "blur" }],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        disposeStatus: [
          {
            required: true,
            validator: (rule, value, callback) => {
              return true;
            },
            message: '请选择处理状态',
            trigger: 'change'
          }
        ]
        // phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
      },
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
          prop: 'startTime'
        }
      ],
      // 心理测评记录
      pageInfo2: {
        pageSize: 10,
        pageNo: 1
      },
      total2: 0,
      xlcpList: [],
      xlcpLabelList: [
        {
          label: '量表名称',
          prop: 'paperName'
        },
        {
          label: '测评时间',
          prop: 'testTime'
        }
      ],
      // 心理学习记录
      pageInfo3: {
        pageSize: 10,
        pageNo: 1
      },
      total3: 0,
      xlxxList: [],
      xlxxLabelList: [
        {
          label: '课程名称',
          prop: 'courseName'
        },
        {
          label: '学习时间',
          prop: 'xxTime'
        },
        {
          label: '学习进度',
          prop: 'progress'
        }
      ],
      // 认知训练记录
      pageInfo4: {
        pageSize: 10,
        pageNo: 1
      },
      total4: 0,
      rzxlList: [],
      rzxlLabelList: [
        {
          label: '训练名称',
          prop: 'trainName'
        },
        {
          label: '训练类型',
          prop: 'classifyName'
        }
      ],
      // 咨询预约记录
      pageInfo5: {
        pageSize: 10,
        pageNo: 1
      },
      total5: 0,
      zxyyList: [],
      zxyyLabelList: [
        {
          label: '咨询老师',
          prop: 'counselorName'
        },
        {
          label: '咨询时间',
          prop: 'consultTime'
        }
      ],
      courseId: '',
      courseName: '',
      course: null,
      kcDialog: false,
      userTypeList: []
    };
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    this.getRoleList();
  },
  methods: {
    getMessage(row) {
      const content = JSON.parse(row.content);
      return content.messageList[0];
    },
    formatterDate(val) {
      return moment(val).format('YYYY-MM-DD HH:mm');
    },
    getRoleList() {
      this.$api.System.getAllRole().then((res) => {
        this.roleList = res.result;
      });
    },
    edit(record) {
      this.type = 'edit';
      this.activeName = '1';
      this.activeName2 = '1';

      this.$api.basics.userQueryById({ id: record.userId }).then((res) => {
        const rs = res.result;
        const roleIds = rs.roleIds ? rs.roleIds.split(',') : [];
        this.record = {
          ...rs,
          roleIds,
          rId: record.id,
          disposeStatus: 0,
          disposeTime: ''
        };
        this.getPsyarchivemanagementById(record);
        this.getZnzxList();
        this.visibleDialog = true;
      });
    },
    getPsyarchivemanagementById(record) {
      this.$api.file
        .getPsyarchivemanagementById({ id: record.id })
        .then((res) => {
          const result = res.result;
          this.record.disposeStatus = result.disposeStatus;
          //   this.record.disposeTime = result.disposeTime
          //     ? result.disposeTime
          //     : moment().format('YYYY-MM-DD HH:mm:ss');
        });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        realname: '', // 姓名
        sex: '', // 性别
        username: '', // 账号
        userType: '', // 人员类别
        age: '', // 年龄
        roleIds: '', // 角色
        idCard: '', // 身份证号码
        telephone: '' // 联系方式
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
    getZnzxList() {
      this.$api.file
        .usersmartcounselrecordsPages({
          ...this.pageInfo,
          userId: this.record.id
        })
        .then((res) => {
          this.znzxList = res['result'].records;
          this.total = res['result'].total;
        });
    },
    getXlcpList() {
      this.$api.source
        .getPsypapermemberPage({
          ...this.pageInfo2,
          testStatus: 1,
          userId: this.record.id
        })
        .then((res) => {
          this.xlcpList = res['result'].records;
          this.total2 = res['result'].total;
        });
    },
    getXlxxList() {
      this.$api.file
        .usercourserecordsPages({
          ...this.pageInfo3,
          userId: this.record.id
        })
        .then((res) => {
          this.xlxxList = res['result'].records;
          this.total3 = res['result'].total;
        });
    },
    getRzxljlList() {
      this.$api.file
        .usercognitivetrainrecordsPages({
          ...this.pageInfo4,
          testStatus: 1,
          userId: this.record.id
        })
        .then((res) => {
          this.rzxlList = res['result'].records;
          this.total4 = res['result'].total;
        });
    },
    getZxyyjlList() {
      this.$api.file
        .psytraineereservationPage({
          ...this.pageInfo5,
          userId: this.record.id
        })
        .then((res) => {
          this.zxyyList = res['result'].records;
          this.total5 = res['result'].total;
        });
    },
    changeTabList(val) {
      const name = val.name;
      if (name == '1') {
        this.getZnzxList();
      } else if (name == '2') {
        this.getXlcpList();
      } else if (name == '3') {
        this.getXlxxList();
      } else if (name == '4') {
        this.getRzxljlList();
      } else if (name == '5') {
        this.getZxyyjlList();
      }
    },
    zxDetail(row) {
      this.$api.file
        .getPsytraineereservationById({ id: row.id })
        .then((res) => {
          console.log(res, '-----');
          this.$refs.zxDialog.show(res.result);
        });
    },
    // 智能咨询详情
    znzxDetail(record) {
      this.$refs.ltDialog.show(record);
    },
    xlcpDetail(record) {
      if (record.paperWebUrl) {
        this.$refs.viewPdfDialog.show(record.paperWebUrl);
      } else {
        this.$message('暂无报告');
      }
    },
    rzxlDetail(record) {
      if (record.reportUrl) {
        this.$refs.viewPdfDialog.show(record.reportUrl);
      } else {
        this.$message('暂无报告');
      }
    },
    kcDetail(row) {
      // 课程详情
      this.courseId = row.courseId;
      this.courseName = row.courseName;
      this.course = row;
      if (!row.treeJson) {
        this.$message('旧数据，请用别的数据测试');
      } else {
        this.$nextTick(() => {
          this.kcDialog = true;
        });
      }
    },
    handldCloseDialog() {
      this.kcDialog = false;
    },
    saveDisposeStatus() {
      this.$api.file
        .psyarchivemanagementSave({
          id: this.record.rId,
          disposeStatus: this.record.disposeStatus,
          disposeTime: this.record.disposeTime
        })
        .then((res) => {
          this.$message.success('保存成功');
          this.visibleDialog = false;
        });
    },
    changeDisposeStatus() {
      this.record.disposeTime = moment().format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>
