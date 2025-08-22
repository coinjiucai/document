<!--
  @Name 基础单选项
  @Description 配合el-radio-group使用，
    主要为了方便数据的的传递，
    label对应名称（原先radio对应的是值不是名称），value对应值。
  @author 赖明浩
  @date 2023-8-10
  @version 0.0.1
-->

<template>
  <el-radio-button v-if="radioButton" :label="value" v-bind="$attrs">{{ label }}</el-radio-button>
  <el-radio v-else :label="value" v-bind="$attrs">{{ label }}</el-radio>
</template>

<script>

export default {
  name: "BaseRadioItem",
  props: {
    radioButton: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean | String | Number | null,
    },
    label: {
      type: Boolean | String | Number | null,
    }
  }
}
</script>

<style scoped>

</style>
