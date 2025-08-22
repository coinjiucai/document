<template>
  <div>
    <BaseDialog
      class="full-block component-dictionaryContentDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="900px"
      top="10vh"
    >
      <div class="full-block flex-layout">
        <el-form ref="form" label-width="100px" :model="record" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12"
              ><el-form-item label="字典代码" prop="itemValue">
                <el-input
                  :maxlength="12"
                  v-model.trim="record.itemValue"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="字典名称" prop="itemText">
                <el-input
                  :maxlength="20"
                  v-model.trim="record.itemText"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"
              ><el-form-item label="排序" prop="dictName">
                <el-input-number
                  v-model.trim="record.sortOrder"
                  :min="1"
                  controls-position="right"
                  :controls="false"
                ></el-input-number> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="字典类型" prop="dictId">
                <el-select
                  clearable
                  v-model="record.dictId"
                  style="width: 100%"
                  @change="changeType"
                >
                  <el-option
                    v-for="(item, index) in dictionaryTypeList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"
              ><el-form-item label="备注" prop="description">
                <el-input
                  :maxlength="20"
                  v-model.trim="record.description"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="启用状态" prop="status">
                <el-radio-group v-model="record.status">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <!--  -->
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
    dictId: String,
  },
  mounted() {},
  data() {
    return {
      title: "编辑字典",
      visibleDialog: false,
      type: 1,
      record: {
        description: "",
        dictId: "",
        itemText: "",
        itemValue: "",
        sortOrder: "",
        status: 1,
      },
      rules: {
        itemValue: [
          { required: true, message: "请输入字典代码", trigger: "blur" },
        ],
        itemText: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
        dictId: [
          { required: true, message: "请选择字典类型", trigger: "change" },
        ],
      },
    };
  },
  computed: {},

  methods: {
    show(record = null, type) {
      this.type = type;
      if (type == 1) {
        this.title = "新增字典";
      } else {
        this.title = "编辑字典";
      }
      if (record) {
        console.log(record.status);
        this.record = {
          ...record,
          status: record.status ? 1 : 0,
        };
      } else {
        this.record = {
          description: "",
          dictId: this.record.dictId,
          itemText: "",
          itemValue: "",
          sortOrder: "",
          status: 1,
        };
      }
      this.visibleDialog = true;
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          const contentApi =
            this.type == 1 ? "addDictionaryContent" : "editDictionaryContent";
          this.$api.System[contentApi](this.record).then((res) => {
            this.$emit("success");
            this.handleCloseDialog();
          });
        }
      });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        description: "",
        dictId: this.record.dictId,
        itemText: "",
        itemValue: "",
        sortOrder: "",
        status: 1,
      };
    },
    changeType(val) {
      const item = this.dictionaryTypeList.find((v) => v.id == val);
      console.log(val, "sd");
      this.record.dictCode = item.dictCode;
      this.record.dictName = item.dictName;
    },
  },
  watch: {
    dictId: {
      handler(val) {
        this.record.dictId = val;
      },
      immediate: true,
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
</style>
