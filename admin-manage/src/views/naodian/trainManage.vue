<template>
  <div
    class="training-manage theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['add', 'delete']"
      :listApi="['analysis', 'vruserbindPage']"
      :deleteApi="['analysis', 'vruserbindDeleteBatch']"
      @edit="edit"
      :editApi="['analysis', 'vruserbindSave']"
      @add="add"
      :addApi="['analysis', 'vruserbindSave']"
    >
    </ListPage>

    <!-- 弹窗 -->
    <BaseDialog
      custom-class="consult-ant-dialog"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="450px"
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
          <el-form-item label="设备编号" prop="imei">
            <el-input v-model="record.imei" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="人员选择" prop="userName">
            <el-input
              v-model="record.userName"
              placeholder="请选择"
              @focus="selectRy"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
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
import DepartTreeList from '@/views/systemManage/DepartManage/DepartTreeList.vue';
export default {
  components: {
    ListPage,
    BaseDialog,
    DepartTreeList
  },
  data() {
    return {
      // 搜索参数
      params: {},
      // 搜索字段列配置
      fieldsConfig: [],
      // 表格字段列配置
      labelList: [
        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '设备编号',
          prop: 'imei'
        }
      ],
      visibleDialog: false,
      dialogTitle: '咨询师信息',
      type: 'edit',
      record: {
        imei: '',
        userName: '',
        userId: ''
      },
      rules: {
        imei: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        userName: [{ required: true, message: '请选择人员', trigger: 'change' }]
      },
      selectLimit: 1,
      ryVisibleDialog: false,
      selection: []
    };
  },
  mounted() {},
  methods: {
    add() {
      this.type = 'add';
      this.record = {
        imei: '',
        userName: '',
        userId: ''
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.$api.analysis
        .getVruserbindById({
          id: record.id
        })
        .then((res) => {
          this.record = res.result;
          this.visibleDialog = true;
        });
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        imei: '',
        userName: '',
        userId: ''
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
    // ===================
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
        this.record.userName = item.realname;
        this.record.userId = item.id;
        this.ryVisibleDialog = false;
      } else {
        this.$message.error('请选择一个用户');
      }
    }
  }
};
</script>
