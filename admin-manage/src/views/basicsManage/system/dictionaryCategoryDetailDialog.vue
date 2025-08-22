<template>
  <div>
    <BaseDialog
      class="full-block component-detailDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="600px"
      top="30vh"
    >
      <div class="full-block flex-layout">
        <el-form ref="form" label-width="150px" :model="record" :rules="rules">
          <el-form-item label="*字典分类代码" prop="dictCode">
            <el-input
              class="w230"
              :maxlength="20"
              v-model.trim="record.dictCode"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="*字典分类名称" prop="dictName">
            <el-input
              class="w230"
              :maxlength="20"
              v-model.trim="record.dictName"
              clearable
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="排序" prop="dictName">
            <el-input
              class="w230"
              :maxlength="20"
              v-model.trim="record.sortOrder"
              clearable
            ></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
// 注意引入的路劲可能不同
import BaseDialog from "@/components/Base/BaseDialog";

export default {
  name: "detailDialog",
  components: { BaseDialog },
  props: {
    dictionaryTypeList: Array,
  },
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      title: "新增内容",
      type: 1,
      record: {
        dictCode: "",
        dictName: "",
        // sortOrder: "",
        id: "",
      },
      rules: {
        dictCode: [
          { required: true, message: "请输入字典分类代码", trigger: "blur" },
        ],
        dictName: [
          { required: true, message: "请输入字典分类名称", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  methods: {
    show(record = null, type) {
      this.type = type;
      if (record) {
        this.record = record;
      } else {
        this.record = {
          dictCode: "",
          dictName: "",
          // sortOrder: "",
          id: "",
        };
      }
      this.visibleDialog = true;
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          const categoryApi =
            this.type == 1 ? "dictionaryCategoryAdd" : "dictionaryCategoryEdit";
          this.$api.System[categoryApi](this.record).then((res) => {
            this.$emit("success");
            this.$message.success("字典内容已更新！");
            this.handleCloseDialog();
          });
        }
      });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        dictCode: "",
        dictName: "",
        sortOrder: "",
        id: "",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 200px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-detailDialog {
}
</style>
