<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="[]"
      :showSelection="false"
      :listApi="['source', 'psyearlywarnmanagementPage']"
      :deleteApi="['source', 'psyearlywarnmanagementDeleteBatch']"
      @edit="edit"
      :editApi="['source', 'psyearlywarnmanagementSave']"
    >
      <template slot="warnLevel_parent" slot-scope="scope">
        <span v-if="scope.row.warnLevel == 1" style="color: #d9001b"
          >一级预警</span
        >
        <span v-else-if="scope.row.warnLevel == 2" style="color: #f59a23"
          >二级预警</span
        >
        <span v-else-if="scope.row.warnLevel == 3" style="color: #bfbf00"
          >三级预警</span
        >
        <span v-else>--</span>
      </template>
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row, 1)"
          >查看</el-link
        >
        <el-link
          :underline="false"
          type="primary"
          @click="edit(scope.row, 2)"
          style="margin-left: 10px"
          >预警干预</el-link
        >
      </template>
    </ListPage>
    <!-- 弹窗 -->
    <BaseDialog
      v-if="visibleDialog"
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1200px"
      top="20vh"
    >
      <div class="full-block">
        <el-tabs v-model="activeName">
          <el-tab-pane label="预警信息" name="1">
            <el-form
              ref="form"
              :model="record"
              :rules="rules"
              label-position="right"
              label-width="120px"
            >
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="学员名称" prop="userName">
                    <FormItem
                      v-model="record.userName"
                      compType="input"
                      placeholder="请输入"
                      maxlength="30"
                      readonly
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预警等级" prop="warnLevel">
                    <FormItem
                      v-model="record.warnLevel"
                      compType="select"
                      :options="[
                        {
                          label: '一级预警',
                          value: 1
                        },
                        {
                          label: '二级预警',
                          value: 2
                        },
                        {
                          label: '三级预警',
                          value: 3
                        }
                      ]"
                      readonly
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预警时间" prop="warnTime">
                    <FormItem
                      v-model="record.warnTime"
                      compType="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择预警时间"
                      readonly
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预警来源" prop="warnSource">
                    <FormItem
                      v-model="record.warnSource"
                      compType="input"
                      placeholder="请输入预警来源"
                      maxlength="50"
                      readonly
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="身份证号" prop="idNumber">
                    <el-input
                      :value="maskIdCard(record.idNumber)"
                      placeholder="请输入身份证号"
                      readonly
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预警内容" prop="content">
                    <FormItem
                      v-model="record.content"
                      compType="input"
                      placeholder="请输入预警内容"
                      maxlength="100"
                      readonly
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <template v-if="watchType == 2">
          <el-tabs v-model="activeName2" @tab-click="changeTabList">
            <el-tab-pane label="智能干预" name="1">
              <div style="height: 230px">
                <BaseTable
                  ref="BaseTable"
                  height="100%"
                  :list="znList"
                  :page-info="pageInfo"
                  :label-list="znLabelList"
                  :total="total"
                  :showSelection="false"
                  :showPagination="true"
                  :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                  @page-change="getZnList"
                  @selectRowList="selectRowList"
                >
                </BaseTable>
              </div>
            </el-tab-pane>
            <el-tab-pane label="人工干预" name="2" v-loading="rgLoading">
              <div class="buttons">
                <el-button @click="addRg">添加</el-button>
                <el-button @click="delteRgBatch">删除</el-button>
              </div>
              <div style="height: 230px">
                <BaseTable
                  ref="BaseTable"
                  height="100%"
                  :list="rgList"
                  :page-info="pageInfo2"
                  :label-list="rgLabelList"
                  :total="total2"
                  :showSelection="true"
                  :showPagination="true"
                  :page-info-keys="{ size: 'pageSize', number: 'pageNo' }"
                  @page-change="getRgList"
                  @selectRowList="selectRgRowList"
                >
                  <template v-slot:fileUrl="scope">
                    <div
                      v-for="(file, index) in getFileList(scope.row.files)"
                      :key="index"
                    >
                      {{ file.name }}
                    </div>
                  </template>
                  <template v-slot:operation>
                    <el-table-column label="操作" width="200">
                      <template #default="{ row }">
                        <el-button type="text" @click="detailRg(row)"
                          >查看详情</el-button
                        >
                        <el-button type="text" @click="editRg(row)"
                          >编辑</el-button
                        >
                      </template>
                    </el-table-column>
                  </template>
                </BaseTable>
              </div>
            </el-tab-pane>
          </el-tabs></template
        >
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          @click="watchDoc(record)"
          v-if="watchType == 1"
          >查看档案</el-button
        >
        <el-button type="primary" @click="handleSave" v-if="watchType == 2"
          >保存</el-button
        >
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>

    <ConsultationDialog
      ref="consultationDialog"
      :saveOuter="true"
      @save="successRg"
      :title="consultDialogTitle"
    ></ConsultationDialog>
    <fileDetailDialog ref="fileDetailDialog"></fileDetailDialog>
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
import ConsultationDialog from './../consultManage/consultationDialog';
import fileDetailDialog from '@/views/fileManagement/fileDetailDialog';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    BaseTable,
    ConsultationDialog,
    fileDetailDialog
  },
  data() {
    return {
      // 搜索参数
      params: {
        userName: '',
        warnLevel: '',
        queryStartTime: '', //
        queryEndTime: '', //
        range: []
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '学员名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入学员名称',
          prop: 'userName'
        },
        {
          label: '预警等级',
          compType: 'select',
          width: 160,
          placeholder: '请选择预警等级',
          prop: 'warnLevel',
          options: [
            {
              label: '一级预警',
              value: 1
            },
            {
              label: '二级预警',
              value: 2
            },
            {
              label: '三级预警',
              value: 3
            }
          ]
        },
        {
          label: '预警时间',
          compType: 'daterange',
          width: 160,
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          'value-format': 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          prop: 'range',
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '学员名称',
          prop: 'userName'
        },
        {
          label: '身份证号',
          prop: 'idNumber',
          formatter: (val) => {
            return this.maskIdCard(val);
          }
        },
        {
          label: '症状类型',
          prop: 'risk'
        },
        {
          label: '预警内容',
          prop: 'content',
          'min-width': 200
        },
        {
          label: '预警来源',
          prop: 'warnSource'
        },
        {
          label: '预警时间',
          prop: 'warnTime'
        },
        {
          label: '预警等级',
          prop: 'warnLevel',
          parent: 'warnLevel_parent',
          special: true
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true,
          'min-width': 120
        }
      ],
      visibleDialog: false,
      dialogTitle: '预警报告',
      type: 'edit',
      record: {
        userName: '',
        warnLevel: '',
        warnTime: '',
        warnSource: '',
        idNumber: '',
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入预警内容', trigger: 'blur' }
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
      watchType: 1,
      activeName2: '1',
      // 智能干预
      znSelection: [],
      znList: [],
      pageInfo: {
        pageSize: 10,
        pageNo: 1
        // earlyWarnManagementId: ''
      },
      znLabelList: [
        {
          label: '干预时间',
          prop: 'interveneTime'
        },
        {
          label: '干预内容',
          prop: 'interveneContent'
        },
        {
          label: '干预情况',
          prop: 'status',
          formatter: (val) => {
            if (val == 0) {
              return '未读';
            } else {
              return '已读';
            }
          }
        }
      ],
      total: 0,
      // 人工干预
      rgSelection: [],
      rgList: [],
      pageInfo2: {
        pageSize: 10,
        pageNo: 1
      },
      rgLabelList: [
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
          prop: 'fileUrl',
          special: true
        }
      ],
      total2: 0,
      rgLoading: false,
      consultDialogTitle: ''
    };
  },
  created() {
    const query = this.$route.query;
    if (query.warnLevel) {
      this.params.warnLevel = query.warnLevel;
    }
  },
  mounted() {
    this.modelUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psyearlywarnmanagement/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psyearlywarnmanagement/import`;
  },
  methods: {
    // 身份证脱敏函数
    maskIdCard(idCard) {
      // 清除所有空格
      idCard = idCard.replace(/\s/g, '');

      // 验证身份证格式（15位或18位）
      const idCardPattern = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
      if (!idCardPattern.test(idCard)) {
        throw new Error('身份证号码格式不正确，请输入15位或18位有效身份证号码');
      }

      // 脱敏处理：保留前4位和后4位，中间用*代替
      if (idCard.length === 15) {
        return idCard.substring(0, 4) + '*'.repeat(7) + idCard.substring(11);
      } else {
        return idCard.substring(0, 4) + '*'.repeat(10) + idCard.substring(14);
      }
    },
    getFileList(val) {
      if (val) {
        console.log(val);
        const list = JSON.parse(val);
        return Array.isArray(list) ? list : [];
      } else {
        return [];
      }
    },
    edit(record, type) {
      this.type = 'edit';
      this.record = { ...record, file: [] };
      this.watchType = type;
      this.activeName2 = '1';
      this.pageInfo.earlyWarnManagementId = record.id;
      if (type == 2) {
        this.getZnList();
      }

      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        status: 0,
        dictId: '',
        name: '',
        singer: '',
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
          //   const record = {
          //     ...this.record
          //   };
          //   delete record.file;
          //   this.$refs.listPage.saveRow(record);
          this.$refs.listPage.handleSearch();
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
    changeTabList(val) {
      const name = val.name;
      if (name == '1') {
        this.getZnList();
      } else if (name == '2') {
        this.getRgList();
      }
    },
    selectRowList(selection) {
      this.znSelection = selection;
    },
    selectRgRowList(selection) {
      this.rgSelection = selection;
    },
    getZnList() {
      this.$api.source
        .psyearlywarnmanagementintervenePage({
          ...this.pageInfo
          //   userId: this.record.id
        })
        .then((res) => {
          this.znList = res['result'].records;
          this.total = res['result'].total;
        });
    },
    delteZnBatch() {
      const ids = this.znSelection.map((v) => v.id);
      this.$confirm('确认删除选中数据？', '提示', { type: 'warning' })
        .then(() => {
          this.$api.source
            .psyearlywarnmanagementinterveneDeleteBatch({ ids: ids.join(',') })
            .then((res) => {
              if (res['success']) {
                this.getZnList();
              } else {
                this.$message.warning(res['message']);
              }
            });
        })
        .catch(() => {
          this.$message.info('已取消操作！');
        });
    },
    delteRgBatch() {
      const ids = this.rgSelection.map((v) => v.id);
      this.$confirm('确认删除选中数据？', '提示', { type: 'warning' })
        .then(() => {
          this.$api.source
            .psyearlywarnmanagementintraocularDeleteBatch({
              ids: ids.join(',')
            })
            .then((res) => {
              if (res['success']) {
                this.getRgList();
              } else {
                this.$message.warning(res['message']);
              }
            });
        })
        .catch(() => {
          this.$message.info('已取消操作！');
        });
    },
    getRgList() {
      this.$api.source
        .psyearlywarnmanagementintraocularPage({
          ...this.pageInfo2,
          userId: this.record.id
        })
        .then((res) => {
          this.rgList = res['result'].records;
          this.total2 = res['result'].total;
        });
    },
    addRg() {
      this.consultDialogTitle = '新增';
      this.$refs.consultationDialog.show(this.record, null);
      this.$refs.consultationDialog.record.userName = this.record.userName;
      this.$refs.consultationDialog.record.userId = this.record.userId;
      console.log(this.record, '======');
    },
    detailRg(item) {
      this.$api.source
        .getPsyearlywarnmanagementintraocularById({
          id: item.id
        })
        .then((res) => {
          this.consultDialogTitle = '查看详情';
          this.$refs.consultationDialog.show(this.record, res.result, false);
        });
    },
    // 查看详情
    editRg(item) {
      this.$api.source
        .getPsyearlywarnmanagementintraocularById({
          id: item.id
        })
        .then((res) => {
          this.consultDialogTitle = '编辑';
          this.$refs.consultationDialog.show(this.record, res.result, true);
        });
    },
    // 保存人工干预
    successRg(val) {
      try {
        this.rgLoading = true;
        this.$api.source
          .psyearlywarnmanagementintraocularSave({
            ...val,
            userId: this.record.id
          })
          .then((res) => {
            this.getRgList(this.activeName2);
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
    watchDoc(record) {
      //   this.$router.push({
      //     path: '/fileManagement/fileManagement',
      //     query: {
      //       userId: record.userId
      //     }
      //   });
      this.$refs.fileDetailDialog.edit(record);
    }
  }
};
</script>
