<template>
  <div class="dictionary-select">
    <el-select
      v-model="selectValue"
      v-bind="$attrs"
      style="width: 100%"
      :disabled="disabled"
      @change="changeSelect"
    >
      <el-option
        v-for="v in dataList"
        :key="v.id"
        :label="v.itemText"
        :value="v.itemValue"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "DictionarySelect",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: [String, Array, Number],
    dictCode: [String, Number],
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      selectValue: "",
      pageInfo: {
        pageSize: 50,
        pageNumber: 1,
        dictCode: "",
      },
      dataList: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    changeSelect(val) {
      const item = this.dataList.find((v) => v.itemValue == val);
      this.$emit("change", val);
      this.$emit("changeText", item.itemText);
    },
    getList() {
      this.$api.System.getDictionaryContentPageList(this.pageInfo)
        .then((res) => {
          this.dataList = res["result"].records;
          this.dataList = Object.freeze(this.dataList);
          console.log(this.dictCode, this.dataList);
          this.total = res["result"].total;
        })
        .finally(() => {
          console.log(this.pageInfo.dictCode, "数据字典类型");
        });
    },
  },
  watch: {
    value: {
      handler(nVal) {
        // if (nVal) {
        this.selectValue = nVal;
        // }
      },
      deep: true,
      immediate: true,
    },
    dictCode: {
      handler(nVal) {
        if (nVal) {
          this.pageInfo.dictCode = nVal;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
