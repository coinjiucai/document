<template>
  <div
    class="person-report theme-background-middle flex-layout flex-row full-block pa10"
  >
    <div class="tree-container" v-loading="loading">
      <UserCatalogue
        ref="catalogue"
        title="组织架构"
        node-key="id"
        :tree-data.sync="treeList"
        :get-url="['System', 'psysysdepartTreeList']"
        :delete-url="['System', 'sysprivacyuserDeleteBatch']"
        :disabledOption="true"
        :default-props="{
          label: 'name',
          value: 'id',
          children: 'childrenList'
        }"
        :hasUser="true"
        :filterUser="true"
        @current-change="handleCurrentChange"
        @scroll="handleScroll"
        @filter="filter"
      >
      </UserCatalogue>
    </div>
    <div style="width: calc(100% - 330px)">
      <ListPage
        ref="listPage"
        :params="listPageInfo"
        :fieldsConfig="fieldsConfig"
        :labelList="labelList"
        :buttonList="['add']"
        :showSelection="false"
        :isInnerGet="true"
        :listApi="['analysis', 'aipersonreportPage']"
        :deleteApi="['analysis', 'aipersonreportDelete']"
        @add="add"
      >
        <template slot="updateTime_parent" slot-scope="scope">
          {{ formatDate(scope.row.startTime) }} -
          {{ formatDate(scope.row.endTime) }}
        </template>
        <template slot="action_parent" slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="preview(scope.row)"
          >
            <i
              class="el-icon-search"
              style="font-size: 14px; color: #30cd8c"
            ></i>
          </el-link>

          &nbsp;&nbsp;
          <el-link
            :underline="false"
            type="primary"
            @click="preview(scope.row)"
          >
            <i class="el-icon-download"></i>
          </el-link>

          <template v-if="scope.row.isResult == 0">
            &nbsp;&nbsp;
            <el-link
              :underline="false"
              type="primary"
              @click="editBaogao(scope.row)"
            >
              <i class="el-icon-edit"></i>
            </el-link>
          </template>
          &nbsp;&nbsp;
          <el-link
            :underline="false"
            type="primary"
            @click="deleteItem(scope.row)"
          >
            <i class="el-icon-delete" style="color: red"></i>
          </el-link>
        </template>
      </ListPage>
    </div>

    <!-- 弹窗 -->
    <BaseDialog
      class="full-block full-dialog"
      title="ai智能报告"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="98%"
      top="2vh"
      destroy-on-close
    >
      <div class="full-block" style="height: 80vh" ref="contentToPrint">
        <aiReportDesc
          ref="aiReportDesc"
          :info="reportInfo"
          type="1"
        ></aiReportDesc>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleCloseDialog">确定</el-button>
        <el-button type="primary" @click="downloadLongPDF()">下载</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>

    <!-- 新增弹窗 -->
    <BaseDialog
      class="full-block"
      :visible.sync="addVisible"
      :title="addTitle"
      width="500px"
      height="300px"
      :destroy-on-close="true"
      @close="addVisible = false"
    >
      <div class="flex-row">
        <el-form
          :model="addRecord"
          :rules="rules"
          label-width="80px"
          size="mini"
          ref="addRecordForm"
        >
          <el-form-item label="报告名称" prop="name">
            <el-input
              v-model="addRecord.name"
              placeholder="输入报告名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="分析时间" prop="range">
            <el-date-picker
              v-model="addRecord.range"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :pickerOptions="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="分析人员" prop="userId">
            <el-input
              v-model="addRecord.userName"
              placeholder="选择分析人员"
              @focus="ryVisibleDialog = true"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="save()">确定</el-button>
        <el-button type="info" @click="addVisible = false">取消</el-button>
      </span>
    </BaseDialog>

    <BaseDialog
      class="full-block component-vector-ledger-dialog"
      title="人员选择"
      center
      :visible.sync="ryVisibleDialog"
      @closed="handleCloseRyDialog"
      width="98%"
      top="5vh"
      destroy-on-close
    >
      <div style="width: 100%; height: 65vh">
        <DepartTreeList
          ref="departTreeList"
          @selectRowList="selectRowList"
          :selectLimit="selectLimit"
        ></DepartTreeList>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="conirmSelect">确定</el-button>
        <el-button type="info" @click="ryVisibleDialog = false">取消</el-button>
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
import UserCatalogue from '@/components/Project/UserCatalogue';
import aiReportDesc from './components/aiReportDesc.vue';
import DepartTreeList from '@/views/systemManage/DepartManage/DepartTreeList.vue';
import { generateId } from '@/utils/utils';
import Common from '@/com/common';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as echarts from 'echarts';
export default {
  // 个人报告
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    UserCatalogue,
    aiReportDesc,
    DepartTreeList
  },
  data() {
    return {
      loading: false,
      compKey: generateId(),
      treeList: [],
      originTreeList: [],
      depart: null,
      pageObj: {},
      pageInfo: {
        pageNo: 1,
        pageSize: 50
      },
      list: [], // 用户列表
      realname: '',
      userInfo: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 表格字段列配置
      listPageInfo: {
        departId: '',
        userId: '',
        pageNo: 1,
        pageSize: 10,
        name: '',
        queryStartTime: '', //
        queryEndTime: '', //
        range: []
      },
      fieldsConfig: [
        {
          label: '报告名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入名称',
          prop: 'name',
          clearable: true
        },
        {
          label: '时间选择',
          compType: 'daterange',
          width: 160,
          placeholder: '时间选择',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          prop: 'range',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          },
          valueFormat: 'yyyy-MM-dd',
          clearable: true
        }
      ],
      labelList: [
        { label: '预警数量', prop: 'warnCount' },
        { label: '报告名称', prop: 'name' },
        { label: '智能咨询', prop: 'smartConsultationCount' },
        { label: '心理测评', prop: 'psychologicalAssessmentCount' },
        { label: '心理教育', prop: 'psychologicalEducationCount' },
        { label: '认知训练', prop: 'cognitiveTrainingCount' },
        { label: '任务中心', prop: 'taskCenterCount' },
        {
          label: '时间',
          prop: 'updateTime',
          parent: 'updateTime_parent',
          width: 200,
          special: true
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      addVisible: false,
      addTitle: '',
      addRecord: {
        name: '',
        range: [],
        userId: '',
        userName: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        range: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请选择分析人员', trigger: 'change' }
        ]
      },
      selectLimit: 1,
      ryVisibleDialog: false,
      selection: [],
      reportInfo: null
    };
  },
  created() {
    this.getTreeList();
  },
  mounted() {},
  methods: {
    formatDate(time) {
      if (!time) {
        return '';
      }

      return moment(time).format('YYYY-MM-DD');
    },
    getTreeList() {
      this.$api.System.psysysdepartTreeList().then((res) => {
        this.originTreeList = res.result;
      });
    },
    handleCurrentChange(data) {
      if (!data.isUser) {
        this.depart = data;
      }
      const realname = this.$refs.catalogue.keyword;
      this.realname = realname;
      if (!data.isUser) {
        this.treeList = Common.CloneDeep(this.originTreeList);
        this.list = [];
        this.pageInfo = { pageNo: 1, pageSize: 50 };
        this.listPageInfo.departId = data.id;
        this.listPageInfo.userId = '';
        this.getList();
        this.$refs.listPage.handleSearch();
      } else if (data.isUser) {
        this.compKey = generateId();
        this.userInfo = data;
        this.listPageInfo.userId = data.id;
        if (this.listPageInfo.departId) {
          this.listPageInfo.departId = '';
        }
        this.$refs.listPage.handleSearch();
      }
    },
    removeDuplicatesById(arr) {
      return arr.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
    },
    getList(departId, callback = null) {
      this.loading = true;
      this.$api.basics
        .userList({
          departId: departId ? departId : this.depart ? this.depart.id : '',
          ...this.pageInfo,
          realname: this.realname
        })
        .then((res) => {
          var records = res?.result?.records || [];
          this.pageObj[this.depart.id] = res.result.pages;
          const list = records.map((v) => {
            return {
              id: v.id,
              name: v.realname,
              isUser: true,
              departId: this.depart.id
            };
          });
          const node = this.$refs.catalogue.getNodeData(this.depart.id);
          if (list?.length) {
            this.list = [...this.list, ...list];
            const childrenList = node.data.childrenList
              ? node.data.childrenList
              : [];
            node.data.childrenList = [...childrenList, ...this.list];
            node.data.childrenList = this.removeDuplicatesById(
              node.data.childrenList
            );
            this.treeList = [...this.treeList];

            // this.userInfo = this.list[0];
            this.$nextTick(() => {
              this.$refs.catalogue.currentNodeKey = this.list[0].id;
              //   this.$refs.catalogue.setCurrentNode(this.list[0].id);
            });
          } else {
            node.data.childrenList = [];
            this.userInfo = null;
          }
          if (callback) {
            callback();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleScroll() {
      if (this.depart && this.depart.id) {
        const departId = this.depart.id;
        const pages = this.pageObj[departId];
        if (this.pageInfo.pageNo < pages) {
          this.pageInfo.pageNo++;
        }
        this.getList(departId);
      }
    },
    filter(val) {
      console.log(val, 'sdfdsf');
      if (!this.depart) {
        this.$message.error('请先选择一个部门');
      } else {
        this.list = [];
        this.pageInfo.pageNo = 1;
        this.realname = val;
        this.treeList = Common.CloneDeep(this.originTreeList);
        this.getList(this.depart.id, () => {
          this.$refs.catalogue.initScroll();
        });
      }
    },
    add() {
      this.addTitle = '新增';
      if (this.userInfo) {
        this.addRecord.userId = this.userInfo.id;
        this.addRecord.userName = this.userInfo.name;
      } else {
        this.addRecord.userId = '';
        this.addRecord.userName = '';
      }
      this.addRecord.name = '';
      this.addRecord.range = [];
      this.addVisible = true;
    },
    editBaogao(item) {
      this.addTitle = '编辑';
      this.addRecord = { ...item, range: [] };
      if (item.startTime && item.endTime) {
        this.addRecord.range = [
          this.formatDate(item.startTime),
          this.formatDate(item.endTime)
        ];
      }
      this.addVisible = true;
    },
    downloadLongPDF() {
      //   window.print();
      this.$refs.aiReportDesc.downloadAsPDF();
    },

    handleCloseDialog() {
      this.visibleDialog = false;
    },
    selectRy() {
      this.ryVisibleDialog = true;
    },
    handleCloseRyDialog() {
      this.ryVisibleDialog = false;
    },
    selectRowList(selection) {
      this.selection = selection;
    },
    conirmSelect() {
      if (this.selection.length > 0) {
        const item = this.selection[0];
        this.addRecord.userName = item.realname;
        this.addRecord.userId = item.id;
        this.ryVisibleDialog = false;
      } else {
        this.$message.error('请选择一个用户');
      }
    },
    save() {
      this.$refs.addRecordForm.validate((valid) => {
        if (valid) {
          const params = {
            id: this.addRecord.id ? this.addRecord.id : '',
            userId: this.addRecord.userId,
            name: this.addRecord.name,
            startTime: this.addRecord.range[0],
            endTime: this.addRecord.range[1]
          };
          if (!params.id) {
            delete params.id;
          }
          this.$api.analysis.aipersonreportSave(params).then((res) => {
            this.$refs.listPage.getList();
            this.addVisible = false;
          });
        }
      });
    },
    deleteItem(row) {
      this.$confirm('确认删除选中数据？', '提示', { type: 'warning' })
        .then(() => {
          this.$api.analysis
            .aipersonreportDelete({ id: row.id })
            .then((res) => {
              if (res['success']) {
                this.$refs.listPage.getList();
              } else {
                this.$popTip.warning(res['message']);
              }
            });
        })
        .catch(() => {
          this.$message.info('已取消操作！');
        });
    },
    preview(row) {
      this.$api.analysis.getAipersonreportById({ id: row.id }).then((res) => {
        this.reportInfo = res.result;
        this.visibleDialog = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.person-report {
  .tree-container {
    width: 330px;
    padding-top: 25px;
    background-image: url('~@/assets/images/person-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 10px;
  }
  ::v-deep .el-icon-search {
    &::before {
      color: rgb(48, 205, 140);
      font-size: 12px;
    }
  }
}
</style>
