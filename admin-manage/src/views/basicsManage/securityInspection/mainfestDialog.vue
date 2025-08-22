<template>
  <div>
    <BaseDialog
      class="full-block self-check-dialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="800px"
      top="20vh"
    >
      <div class="full-block scroll-y">
        <el-form ref="form" label-width="120px" :model="record" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="类型" prop="username">
                <el-select v-model="record.username" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检查清单名称" prop="username" width>
                <el-input
                  v-model="record.username"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间" prop="username" width>
                <el-date-picker
                  v-model="record.username"
                  type="year"
                  placeholder="选择年"
                  value-format="yyyy"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人" prop="username">
                <el-input
                  v-model="record.username"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button type="primary" @click="addItem">添加内容</el-button>
            <el-button type="danger" @click="deleteItems">删除明细</el-button>
          </el-row>
          <el-row style="margin-top: 10px">
            <BaseTable
              ref="table"
              height="100%"
              :label-list="labelList"
              :list="dataList"
              :showPagination="false"
              @selectRowList="selectRowList"
            >
              <template v-slot:action="scope">
                <el-link type="primary" :underline="false">编辑</el-link>
                &nbsp;&nbsp;
                <el-link type="danger" :underline="false">删除</el-link>
              </template>
            </BaseTable>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          style="background-color: rgba(255, 102, 0, 1); color: #fff"
          @click="release"
          >发布</el-button
        >
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import rangeBothValue from "@/components/Date/rangeBothValue";
import BaseTable from "@/components/Base/BaseTable";
export default {
  name: "CriticalDeptDialog",
  components: { BaseDialog, rangeBothValue, BaseTable },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    type: {
      type: String,
      default: () => "add",
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      record: {
        id: "",
        status: "",
        username: "",
        title: "",
        content: "",
        startTime: "",
        endTime: "",
      },
      rules: {
        // departId: [
        //   { required: true, message: "请选择所属单位！", trigger: "change" },
        // ],
        // username: [
        //   { required: true, message: "请输入账号！", trigger: "blur" },
        // ],
      },

      labelList: [
        { label: "检查内容", prop: "dept" },
        { label: "操作", prop: "action", special: true },
      ],
      dataList: [
        {
          dept: "产品组",
          statue: "已完成",
        },
        {
          dept: "产品组",
          statue: "已完成",
        },
        {
          dept: "产品组",
          statue: "已完成",
        },
        {
          dept: "产品组",
          statue: "已完成",
        },
        {
          dept: "产品组",
          statue: "已完成",
        },
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },
  created() {},
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
      // this.record = {
      //   id: "",
      //   username: "",
      //   departId: "",
      //   departName: "",
      //   remark: "",
      // };
      // this.$nextTick(() => {
      //   // 重置表单的校验状态
      //   this.$refs?.form?.clearValidate();
      // });
    },
    /**
     * 显示弹窗
     * @param record 用户信息，编辑时传入
     * @param defaultDepart 默认单位信息，新增时用到
     */
    show(record, defaultDepart) {
      this.visibleDialog = true;
      // if (record) {
      //   this.title = "编辑";
      //   this.record = Common.partOfObject(
      //     record,
      //     Object.keys(this.record),
      //     true
      //   );
      // } else {
      //   this.record.departId = defaultDepart.id;
      //   this.record.departName = defaultDepart.name;
      //   this.title = "新增";
      // }
    },
    /**
     * 点击保存
     * 区分新增和修改
     */
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          // const type = this.title === "新增" ? "add" : "edit";
          // this.$api.System.saveUser(type, this.record).then(() => {
          //   this.$message.success("保存成功！");
          //   this.handleCloseDialog();
          //   this.$emit("save");
          // });
        }
      });
    },
    selectRowList(val) {
      // console.log(val, "sfsdf");
    },
    addItem() {},
    deleteItems() {},
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 60vh;
  overflow-y: hidden;
  .el-form {
    padding: 0 20px;
  }
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.mainfest-dialog {
}
</style>
