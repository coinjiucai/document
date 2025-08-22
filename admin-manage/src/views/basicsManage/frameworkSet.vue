<template>
  <div class="theme-background-middle flex-layout full-block pa10">
    <ListPage
      ref="listPage"
      :labelList="labelList"
      :listApi="''"
      :deleteApi="['basics', '']"
      @edit="edit"
      :editApi="['basics', '']"
      @add="add"
      :addApi="['basics', '']"
    >
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
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
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="record.name"
              placeholder="请输入"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="record.description"
              placeholder="请输入"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="级别" prop="level">
            <el-input
              v-model="record.level"
              placeholder="请输入"
              maxlength="10"
              disabled
            ></el-input>
          </el-form-item>
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
import FileImportDialog from "@/components/FileImport/FileImportDialog";
import FormItem from "@/components/Form/Item";
export default {
  components: {
    ListPage,
    BaseDialog,
    FileImportDialog,
    FormItem,
  },
  data() {
    return {
      // 表格字段列配置
      labelList: [
        { label: "名称", prop: "name" },
        { label: "描述", prop: "description" },
        { label: "级别", prop: "level" },
        {
          label: "操作",
          prop: "action",
          parent: "action_parent",
          special: true,
        },
      ],
      visibleDialog: false,
      dialogTitle: "新增架构",
      type: "add",
      record: {
        name: "",
        description: "",
        level: "",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    let list = [
      { name: "心理服务框架", description: "1000人", level: "一级" },
      { name: "心理咨询服务", description: "100人", level: "二级" },
      { name: "心理治疗服务", description: "100人", level: "二级" },
      { name: "心理教育服务", description: "100人", level: "二级" },
      { name: "心理教育宣传", description: "100人", level: "二级" },
      { name: "心理危机干预", description: "100人", level: "二级" },
      { name: "心理评估宣传", description: "100人", level: "二级" },
    ];
    this.$refs.listPage.dataList = list;
    this.$refs.listPage.total = list.length;
  },
  methods: {
    add() {
      this.type = "add";
      this.record = {
        name: "",
        description: "",
        level: this.$refs.listPage.total > 0 ? "二级" : "一级",
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = "edit";
      this.record = { ...record };
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        name: "",
        description: "",
        level: "",
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
          // this.$refs.listPage.saveRow({
          //   ...this.record,
          // });
          this.visibleDialog = false;
        }
      });
    },
  },
};
</script>
    