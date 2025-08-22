<template>
  <div class="system-role theme-background-middle flex-layout full-block pa10">
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :showPagination="false"
      :labelList="labelList"
      :listApi="['System', 'getRoleList']"
      :deleteApi="['System', 'roleAdd']"
      @edit="edit"
      :editApi="['System', 'roleAdd']"
      @add="add"
      :addApi="['System', 'roleAdd']"
      border
    >
      <template v-slot:PageButtons></template>

      <template slot="action_parent" slot-scope="scope">
        <!-- <el-link :underline="false" type="danger">{{ scope.row.id }}</el-link> -->
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
        >
        &nbsp;&nbsp;
        <el-link :underline="false" type="primary">查看人员</el-link
        >&nbsp;&nbsp;
        <el-link
          :underline="false"
          type="primary"
          @click="showPermissionDetail(scope.row)"
          >权限设置</el-link
        >
      </template>
    </ListPage>

    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="600px"
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
            <el-col :span="24">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="record.roleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="角色类型" prop="roleCode">
                <el-input v-model="record.roleCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="角色描述" prop="description">
                <el-input v-model="record.description"></el-input>
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
    <permissionSettingDrawer ref="permission"></permissionSettingDrawer>
  </div>
</template>
<script>
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
import permissionSettingDrawer from "./components/permissionSettingDrawer.vue";
// import FormItem from "@/components/Form/Item";
export default {
  components: {
    ListPage,
    BaseDialog,
    permissionSettingDrawer,
    // FormItem,
  },
  data() {
    return {
      // 搜索参数
      params: {
        roleName: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "角色",
          compType: "input",
          width: 160,
          prop: "roleName",
        },
      ],
      // 表格字段列配置
      labelList: [
        { label: "角色", prop: "roleName" },
        { label: "描述", prop: "description" },
        {
          label: "操作",
          prop: "action",
          parent: "action_parent",
          special: true,
        },
      ],
      visibleDialog: false,
      dialogTitle: "添加角色",
      record: {
        roleCode: "",
        roleName: "",
        description: "",
      },
      rules: {
        roleName: [{ required: true, message: "", trigger: "blur" }],
        roleCode: [{ required: true, message: "", trigger: "blur" }],
      },
    };
  },
  methods: {
    initRecord() {
      this.record = {
        roleCode: "",
        roleName: "",
        description: "",
      };
    },
    add() {
      this.initRecord();
      this.visibleDialog = true;
    },
    edit(record) {
      this.record = { ...record };
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {};
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
          this.$refs.listPage.saveRow([{ ...this.record }]);
          this.visibleDialog = false;
        }
      });
    },
    /**
     * 权限设置详情
     * @param row
     */
    showPermissionDetail(row) {
      console.log(row, "---");
      this.$refs.permission.showDrawer(row["id"]);
    },
  },
};
</script>
