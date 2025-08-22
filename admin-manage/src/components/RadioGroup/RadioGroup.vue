<template>
  <div class="tabs-radio-group">
    <el-radio-group v-model="radioValue" @input="input" :size="size">
      <el-radio-button :label="v.value" v-for="v in list" :key="v.value">{{
        v.name
      }}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "RadioGroup",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
    list: Array,
    size: String,
  },
  data() {
    return {
      radioValue: "",
    };
  },
  methods: {
    input(val) {
      this.$emit("change", val);
    },
  },
  watch: {
    value: {
      handler(nVal) {
        this.radioValue = nVal;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-radio-group {
  display: inline-block;
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #1890ff;
    background-color: #ffffff;
    border-color: #1890ff;
  }
}
</style>
