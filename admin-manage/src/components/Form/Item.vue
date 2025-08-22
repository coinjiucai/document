<template>
  <!-- 表单业务组件封装 -->
  <div class="form-item">
    <el-input
      v-if="['input', 'textarea'].includes(compType)"
      class="form-input"
      v-bind="$attrs"
      v-model="itemValue"
      :disabled="disabled"
      @input="changeValue"
      @clear="changeValue"
    ></el-input>
    <el-input-number
      v-else-if="['inputNumber'].includes(compType)"
      class="form-input"
      v-bind="$attrs"
      v-model="itemValue"
      :disabled="disabled"
      @change="changeValue"
      @clear="changeValue"
      controls-position="right"
    ></el-input-number>

    <!--地址组件-->
    <Address
      v-else-if="compType == 'address'"
      v-bind="$attrs"
      v-model="itemValue"
      @change="changeValue"
      clearable
      :disabled="disabled"
    ></Address>
    <template v-else-if="compType == 'select'">
      <!-- 数据字典下拉选择 -->
      <DictionarySelect
        v-if="$attrs.dictCode"
        :dictCode="$attrs.dictCode"
        v-model="itemValue"
        v-bind="$attrs"
        :disabled="disabled"
        @change="changeValue"
        @changeText="
          (val) => {
            $emit('changeText', val);
          }
        "
      ></DictionarySelect>
      <!-- 其他下拉选择 -->
      <el-select
        v-else-if="$attrs.options"
        v-model="itemValue"
        v-bind="$attrs"
        style="width: 100%"
        :disabled="disabled"
        @change="changeValue"
      >
        <el-option
          v-for="(item, idx) in $attrs.options"
          :key="idx"
          :label="item.label"
          :value="item.value"
          :disabled="disabled"
        >
        </el-option>
      </el-select>
    </template>
    <!-- 日期时间 -->
    <template
      v-else-if="
        [
          'year',
          'month',
          'date',
          'week',
          'datetime',
          'datetimerange',
          'daterange',
        ].includes(compType)
      "
    >
      <el-date-picker
        v-model="itemValue"
        :type="compType"
        v-bind="$attrs"
        :transfer="true"
        style="width: 100%"
        :disabled="disabled"
        @change="changeValue"
      >
      </el-date-picker>
    </template>
    <!--附件上传-->
    <template v-else-if="compType == 'upload'">
      <FileUpload
        :fileList="itemValue"
        :showMode="$attrs.showMode ? $attrs.showMode : 2"
        v-bind="$attrs"
        @on-success="changeUploadValue"
      ></FileUpload>
    </template>
    <!-- 弹窗选择 -->
    <template v-else-if="compType == 'dialogSelect'">
      <el-input
        v-bind="$attrs"
        v-model="itemValue"
        :disabled="disabled"
        @focus="changeDialogSelect($event)"
      ></el-input>
    </template>
    <template v-else-if="compType == 'specialDialog'">
      <el-input
        v-bind="$attrs"
        v-model="itemValue"
        :disabled="disabled"
        @focus="speciaDialogSelect($event)"
      ></el-input>
    </template>
    <!-- 组织架构 -->
    <template v-else-if="compType == 'organize'">
      <el-input
        v-bind="$attrs"
        v-model="originNames"
        :disabled="disabled"
        @focus="organizeSelect"
      ></el-input>
      <selectOrganize
        v-bind="$attrs"
        :checked_arr="originIds"
        ref="choosePeople"
        @confirm="organizeConfirm"
        @multiConfirm="multiOrganizeConfirm"
      ></selectOrganize>
    </template>
    <!-- 人员选择 -->
    <template v-else-if="compType == 'user'">
      <el-input
        v-bind="$attrs"
        v-model="itemValue"
        :disabled="disabled"
        @focus="showUserSelectDialog"
      ></el-input>
      <UserSelectDialog
        ref="userSelectDialog"
        @confirm="userSelect"
      ></UserSelectDialog>
    </template>
  </div>
</template>

<script>
import Address from "./components/address";
import DictionarySelect from "@/components/DictionarySelect";
import FileUpload from "@/components/ElFileUpload/FileUpload";
import selectOrganize from "./components/selectOrganize.vue";
import { isArray, isObject, isString } from "@/utils/utils";
import BaseDialog from "@/components/Base/BaseDialog";
import UserSelectDialog from "./components/UserSelectDialog";
export default {
  name: "FormItem",
  model: {
    prop: "value",
    event: "change",
  },
  components: {
    Address,
    DictionarySelect,
    FileUpload,
    BaseDialog,
    selectOrganize,
    UserSelectDialog,
  },
  props: {
    value: [String, Array, Number],
    // 组件类型
    compType: {
      type: String,
      default: () => {
        return "input";
      },
    },
    // 是否可编辑
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    item: {
      type: Object,
      default: () => {},
    },
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      itemValue: "",
      // 附件
      fileList: [],
      // 组织架构
      originIds: [],
      originNames: "",
    };
  },
  mounted() {},
  methods: {
    propFilter(row, item) {
      const val = row[item.prop];
      if (val === "" || val == null) {
        return "_";
      } else if (item.formatter) {
        return item.formatter(row[item.prop], row);
      } else {
        return row[item.prop];
      }
    },
    changeValue(val) {
      this.$emit("change", val);
    },
    // 附件处理
    changeUploadValue(val) {
      const showMode = this.$attrs.showMode;

      if (showMode == 1) {
        // 支持多个附件
        this.$emit("change", val);
      } else {
        // 支持一个附件
        const result = val?.length ? val[0] : null;
        if (isArray(result)) {
          this.$emit("change", result);
        } else if (isObject(result) && result) {
          this.$emit("change", [result]);
        }
      }
    },
    // 组织架构
    organizeSelect(event) {
      event.target.blur();
      this.$refs.choosePeople.show(this.originIds);
    },
    multiOrganizeConfirm(user, depart) {
      if (this.$attrs.user) {
        // 人员，
        this.$emit("change", user);
      } else {
        this.$emit("change", depart);
      }
    },
    organizeConfirm(val) {
      this.$emit("confirm", val);
    },
    // 选择人员
    showUserSelectDialog(event) {
      event.target.blur();
      this.$refs.userSelectDialog.show();
    },
    userSelect(val) {
      this.$emit("change", val.realname);
      this.$emit("confirm", val);
    },
    // 弹窗选择处理
    changeDialogSelect(event) {
      event.target.blur();
      this.$emit("tableDialogSelect");
    },
    // 特殊弹窗
    speciaDialogSelect(event) {
      event.target.blur();
      this.$emit("speciaDialogSelect");
    },
  },
  watch: {
    value: {
      handler(nVal) {
        if (this.compType == "year") {
          this.itemValue = "" + nVal;
        } else if (this.compType == "address" && isString(nVal)) {
          this.itemValue = nVal ? JSON.parse(nVal) : [];
        } else if (this.$attrs.dictCode) {
          this.itemValue = "" + nVal;
        } else {
          this.itemValue = nVal;
        }
      },
      deep: true,
      immediate: true,
    },
    // 部门监听
    "$attrs.ids": {
      handler(nVal) {
        if (this.compType == "organize") {
          if (nVal) {
            this.originIds = nVal.split(",").filter((v) => v);
            this.originNames = this.$attrs.names;
          } else {
            this.originIds = [];
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
