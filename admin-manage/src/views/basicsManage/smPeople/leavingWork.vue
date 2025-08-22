<template>
  <div
    class="smpeople-leaving-work theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :listApi="['System', 'getLogList']"
      :deleteApi="['System', 'delete']"
      @edit="edit"
      :editApi="['System', 'edit']"
      @add="add"
      :addApi="['System', 'add']"
    >
      <template v-slot:PageButtons></template>
    </ListPage>

    <BaseDialog
      class="full-block component-alter"
      title="涉密人员变更"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
      top="20vh"
    >
      <div class="full-block" style="padding: 0 20px">
        <el-form ref="form" label-position="right" label-width="120px">
          <el-row :gutter="0">
            <el-col :span="24">
              <el-form-item label="审核状态" prop="username">
                审核中
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="变更类型" prop="username">
                <el-input v-model="from.username" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input
                  v-model="from.username"
                  maxlength="30"
                  placeholder=""
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="所属单位" prop="username">
                <el-input
                  v-model="from.username"
                  maxlength="30"
                  placeholder=""
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="from.username"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  disabled
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="原密级" prop="username">
                <el-input v-model="from.username" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号" prop="username">
                <el-input
                  v-model="from.username"
                  maxlength="30"
                  placeholder=""
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="现密级" prop="username">
                <el-input v-model="from.username" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附件" prop="username">
                <!-- <el-input
                  v-model="from.username"
                  maxlength="30"
                  placeholder=""
                ></el-input> -->
                <FileUpload :fileList="fileList"></FileUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">提交审核</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span></BaseDialog
    >
  </div>
</template>

<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FileUpload from '@/components/ElFileUpload/FileUpload';
export default {
  name: 'SmPeopleLeavingWork',
  components: { ListPage, BaseDialog, FileUpload },
  props: {},
  data() {
    return {
      params: {
        userid: '',
        username: '',
        logType: '',
        startTime: '',
        endTime: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '姓名',
          compType: 'input',
          width: 160,
          placeholder: '',
          prop: 'userid'
        },
        {
          label: '身份证号',
          compType: 'input',
          width: 160,
          placeholder: '',
          prop: 'userid'
        },
        {
          label: '状态',
          compType: 'select',
          width: 160,
          dictCode: 'audit_status',
          prop: 'logType'
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '审核状态',
          prop: 'username'
        },
        { label: '姓名', prop: 'logContent' },
        { label: '身份证号', prop: 'logContent' },
        {
          label: '离职类型',
          prop: 'createTime'
        },
        { label: '职务', prop: 'ip' },
        {
          label: '所属部门',
          prop: 'ip'
        },
        {
          label: '申请日期',
          prop: 'ip'
        },
        {
          label: '离职原因',
          prop: 'ip'
        }
      ],
      visibleDialog: false,
      from: {
        username: ''
      },
      fileList: []
    };
  },
  created() {},
  mounted() {},
  filters: {},
  watch: {},
  computed: {},
  methods: {
    edit() {},
    add() {
      this.visibleDialog = true;
    },
    handleSave() {},
    handleCloseDialog() {
      this.visibleDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
