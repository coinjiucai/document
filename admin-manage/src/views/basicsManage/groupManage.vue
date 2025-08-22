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
      :listApi="['basics', 'sysgroupPage']"
      :deleteApi="['basics', 'sysgroupDeleteBatch']"
      @edit="edit"
      :editApi="['basics', 'sysgroupSave']"
      @add="add"
      :addApi="['basics', 'sysgroupSave']"
    >
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
        >
        <el-link
          style="margin-left: 10px"
          :underline="false"
          type="primary"
          @click="showRoleUserDetail(scope.row)"
          >人员设置</el-link
        >
      </template>
    </ListPage>

    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="500px"
      top="20vh"
      destroy-on-close
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="小组名称" prop="name">
            <el-input
              v-model="record.name"
              placeholder="小组名称"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
    <UserSetDialog
      title="人员设置"
      ref="userSetDialog"
      @confirm="confirmSelectUser"
    ></UserSetDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import FormItem from '@/components/Form/Item';
import UserSetDialog from '@/components/UserSetDialog.vue';
export default {
  components: {
    ListPage,
    BaseDialog,
    FileImportDialog,
    FormItem,
    UserSetDialog
  },
  data() {
    return {
      // 搜索参数
      params: {
        name: '',
        createBy: '',
        queryStartTime: '', //
        queryEndTime: '', //
        range: []
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '小组名称',
          compType: 'input',
          width: 160,
          placeholder: '小组名称',
          prop: 'name'
        },
        {
          label: '创建人',
          compType: 'input',
          width: 160,
          placeholder: '创建人',
          prop: 'createBy'
        },
        {
          label: '创建时间',
          compType: 'daterange',
          width: 160,
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          'value-format': 'yyyy-MM-dd HH:mm:ss',
          prop: 'range',
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '小组名称', prop: 'name' },
        { label: '创建人', prop: 'createBy' },
        { label: '创建时间', prop: 'createTime' },
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
      record: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入小组名称', trigger: 'blur' }]
      }
    };
  },
  mounted() {},
  methods: {
    add() {
      this.type = 'add';
      this.record = {
        name: ''
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.record = { ...record };
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        name: ''
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
    showRoleUserDetail(row) {
      this.selectItem = row;
      this.listLoading = true;
      this.$api.basics
        .sysgroupuserList({
          groupId: row.id
        })
        .then((res) => {
          const records = res['result'].map((v) => {
            return {
              id: v.userId,
              realname: v.userName
            };
          });
          this.$refs.userSetDialog.show(records);
        })
        .finally(() => {
          this.listLoading = false;
        });

      // this.$refs.userDetail.show(row);
    },
    confirmSelectUser(users) {
      this.$api.basics
        .sysgroupUserSet({
          groupId: this.selectItem.id,
          userList: users
            ? users.map((v) => {
                return {
                  userId: v.id,
                  userName: v.realname
                };
              })
            : []
        })
        .then((res) => {
          this.$refs.listPage.getList();
        });
    }
  }
};
</script>
