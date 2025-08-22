<template>
  <div
    class="person-report theme-background-middle flex-layout flex-row full-block pa10"
  >
    <div class="tree-container">
      <div class="left-header">
        <span class="name">小组管理</span>
        <span class="add" @click="showGroup()">+</span>
      </div>
      <div class="left-ctc">
        <el-input
          placeholder="请输入关键词"
          v-model="keyword"
          size="mini"
          @keyup.enter.native="queryKeyword()"
          @clear="queryKeyword()"
          clearable
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="getList()"
          ></i>
        </el-input>
        <div class="user-list" v-loading="loading">
          <template v-if="list.length > 0">
            <el-checkbox-group v-model="checkList" @change="changGroup">
              <template v-for="v in list">
                <div :key="v.id">
                  <el-checkbox :label="v.id">
                    {{ v.name }}
                  </el-checkbox>
                </div>
              </template>
            </el-checkbox-group>
          </template>
          <div v-else>
            <el-empty :image-size="80" :image="noData"></el-empty>
          </div>
        </div>
        <div class="pagination-c">
          <div class="pre" @click="pre()">
            <span class="iconfont" style="font-size: 14px">&#xe60e;</span>
          </div>
          <div class="center-page">{{ current }}/{{ pages }}</div>
          <div class="next" @click="next()">
            <span class="iconfont" style="font-size: 14px">&#xe610;</span>
          </div>
          <el-input
            size="mini"
            v-model="pageInfo.pageNo"
            style="width: 55px; margin-left: 16px"
            @input="handleInput"
            :max="pages"
          />
          <div class="jumper" @click="jumper">跳转</div>
        </div>
      </div>
    </div>
    <div style="width: calc(100% - 330px)">
      <ListPage
        ref="listPage"
        :params="params"
        :fieldsConfig="fieldsConfig"
        :labelList="labelList"
        :buttonList="['add']"
        :showSelection="false"
        :isInnerGet="true"
        :listApi="['analysis', 'aigroupreportPage']"
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
          <el-link :underline="false" type="primary" @click="edit(scope.row)">
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
    <TableDialog
      title="选择小组"
      :selectValue="selectValue"
      searchProp="name"
      :listApi="['basics', 'sysgroupPage']"
      :labelList="[{ label: '小组名称', prop: 'name' }]"
      ref="tableDialog"
      @confirm="confirmSmSelect"
    ></TableDialog>

    <!-- 弹窗 -->
    <BaseDialog
      class="full-block full-dialog"
      :title="type == 'edit' ? 'ai智能报告' : 'ai智能报告'"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="98%"
      top="2vh"
    >
      <div class="full-block" style="height: 78vh">
        <aiReportDesc
          ref="aiReportDesc"
          :info="reportInfo"
          type="2"
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
          <el-form-item label="分析小组" prop="groupNames">
            <el-input
              v-model="addRecord.groupNames"
              placeholder="输入报告名称"
              @focus="showGroupSelect()"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="save()">确定</el-button>
        <el-button type="info" @click="addVisible = false">取消</el-button>
      </span>
    </BaseDialog>
    <GroupSetDialog
      title="添加小组"
      ref="groupSetDialog"
      @confirm="groupSave"
    ></GroupSetDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import aiReportDesc from './components/aiReportDesc.vue';
import TableDialog from '@/components/TableDialog';
import GroupSetDialog from '@/components/GroupSetDialog.vue';
const noData = require('@/assets/images/no-data.png');
import moment from 'moment';
export default {
  //团体报告
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    aiReportDesc,
    TableDialog,
    GroupSetDialog
  },
  data() {
    return {
      noData,
      loading: false,
      keyword: '',
      pageInfo: {
        pageSize: 18,
        pageNo: 1
      },
      checkList: [],
      list: [],
      total: 0,
      pages: 1,
      current: 1,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 搜索参数
      params: {
        groupIds: '',
        pageNo: 1,
        pageSize: 10,
        name: '',
        queryStartTime: '', //
        queryEndTime: '', //
        range: []
      },
      // 搜索字段列配置
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
          valueFormat: 'yyyy-MM-dd',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          },
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '预警数量', prop: 'warnCount' },
        { label: '报告名称', prop: 'name' },
        { label: '智能咨询', prop: 'smartConsultationCount' },
        { label: '心理测评', prop: 'psychologicalAssessmentCount' },
        { label: '心理教育', prop: 'psychologicalEducationCount' },
        { label: '认知训练', prop: 'cognitiveTrainingCount' },
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
      type: 'edit',
      list: [],
      addVisible: false,
      addTitle: '',
      addRecord: {
        name: '',
        range: [],
        groupIds: '',
        groupNames: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        range: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ],
        groupNames: [
          { required: true, message: '请选择分析小组', trigger: 'change' }
        ]
      },
      selectValue: '',
      reportInfo: null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    changGroup() {
      this.getPageList();
    },
    formatDate(time) {
      if (!time) {
        return '';
      }

      return moment(time).format('YYYY-MM-DD');
    },
    handleInput(value) {
      // 只允许整数
      let val = value.replace(/[^\d]/g, '');

      // 限制最大值
      if (val > this.pages) {
        val = this.pages;
      }
      this.pageInfo.pageNo = val;
    },
    queryKeyword() {
      this.pageInfo.pageNo = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$api.basics
        .sysgroupPage({
          ...this.pageInfo,
          name: this.keyword
        })
        .then((res) => {
          this.loading = false;
          const result = res.result;
          this.current = result.current;
          this.pages = result.pages;

          this.list = res['result'].records;

          this.total = res['result'].total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    jumper() {
      this.getList();
    },
    pre() {
      if (this.pageInfo.pageNo <= 1) {
        this.$message('已经是第一页了');
      } else {
        this.pageInfo.pageNo--;
        this.getList();
      }
    },
    next() {
      if (this.pageInfo.pageNo < this.pages) {
        this.pageInfo.pageNo++;
        this.getList();
      } else {
        this.$message('已经最后一页了');
      }
    },
    getPageList() {
      this.params.groupIds = this.checkList.join(',');
      this.$refs.listPage.handleSearch();
    },
    edit(record) {
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      //   this.$nextTick(() => {
      //     // 重置表单的校验状态
      //     if (this.$refs?.form) {
      //       this.$refs.form.clearValidate();
      //     }
      //   });
    },
    add() {
      this.addTitle = '新增';
      //   if (this.userInfo) {
      //     this.addRecord.userId = this.userInfo.id;
      //     this.addRecord.userName = this.userInfo.name;
      //   } else {
      //     this.addRecord.userId = '';
      //     this.addRecord.userName = '';
      //   }
      console.log('dfdsf');
      this.addRecord.name = '';
      this.addRecord.range = [];
      this.addVisible = true;
    },
    showGroupSelect() {
      this.$refs.tableDialog.show();
    },
    confirmSmSelect(val) {
      if (val.length > 0) {
        this.addRecord.groupNames = val.map((item) => item.name).join(',');
        this.addRecord.groupIds = val.map((item) => item.id).join(',');
      } else {
        this.$message.error('请选择小组');
      }
      this.$refs.tableDialog.handleCloseDialog();
    },
    save() {
      this.$refs.addRecordForm.validate((valid) => {
        if (valid) {
          const params = {
            groupIds: this.addRecord.groupIds,
            name: this.addRecord.name,
            startTime: this.addRecord.range[0],
            endTime: this.addRecord.range[1],
            groupNames: this.addRecord.groupNames
          };
          this.$api.analysis.aigroupreportSave(params).then((res) => {
            this.$refs.listPage.getList();
            this.addVisible = false;
          });
        }
      });
    },
    preview(row) {
      this.$api.analysis.getAigroupreportById({ id: row.id }).then((res) => {
        this.reportInfo = res.result;
        this.visibleDialog = true;
      });
    },
    showGroup() {
      this.$refs.groupSetDialog.show([]);
    },
    groupSave() {
      this.pageInfo.pageNo = 1;
      this.getList();
    },
    downloadLongPDF() {
      //   window.print();
      this.$refs.aiReportDesc.downloadAsPDF();
    }
  }
};
</script>
<style lang="scss" scoped>
.person-report {
  .tree-container {
    width: 330px;
    padding: 25px 10px 20px;
    background-image: url('~@/assets/images/person-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 10px;

    display: flex;
    flex-direction: column;
    .left-header {
      line-height: 30px;
      padding: 0 10px;
      background-color: rgba(75, 101, 137, 0.2);
      .name {
        border-left: 3px solid #219565;
        padding-left: 10px;
      }

      .add {
        float: right;
        margin-right: 10px;
        font-size: 30px;
        color: #219565;
        cursor: pointer;
      }
    }
    .left-ctc {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 10px 10px 0;
      .user-list {
        height: calc(100dvh - 344px);
        overflow-y: auto;
        > div {
          border-bottom: 1px solid rgba(129, 151, 189, 0.23);
          line-height: 32px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .pagination-c {
        margin-bottom: 10px;
        .pre,
        .next {
          display: inline-flex;
          // background: rgba(172, 215, 255, 0.2);
          align-items: center;
          //   padding: 7.5px;
          border-radius: 4px;
          cursor: pointer;
        }
        .center-page {
          display: inline-flex;
          // background: rgba(172, 215, 255, 0.2);
          align-items: center;
          //   padding: 0 16px;
          border-radius: 4px;
          font-size: 14px;
          margin: 0 16px;
        }
        .jumper {
          display: inline-flex;
          margin-left: 6px;
          // background: rgba(172, 215, 255, 0.2);
          align-items: center;
          padding: 7.5px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
  ::v-deep .el-icon-search {
    &::before {
      color: rgb(48, 205, 140);
      font-size: 12px;
    }
  }
}
</style>
