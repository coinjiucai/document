<!--
  @Name 基础时间日期范围选择器
  @Description 基于Element UI重新封装的时间日期范围选择器，
  直接传入开始（startValue.sync）和结束*(endValue.sync)的时间或者日期
-->

<template>
  <component
    :is="dateTimeComponent"
    :type="dataType"
    :class="rangeClass"
    :value-format="valueFormat"
    v-model="rangeValue"
    @change="change"
  >
  </component>
</template>

<script setup>

const emit = defineEmits(['change']);

const props = defineProps({
  rangeClass: {
    type: String
  },
  dataType: {
    type: String,
    default: 'daterange'
  },
  startValue: {
    required: true,
    type: String
  },
  endValue: {
    required: true,
    type: String
  },
  valueFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },
})

const dateTimeComponent = computed(() => {
  if (props.dataType === "daterange") return "el-date-picker";
  else if (props.dataType === "datetimerange") return "el-date-picker";
  else if (props.dataType === "monthrange") return "el-date-picker";
  else return "el-time-picker";
})

const rangeValue = computed({
  get() {
    return [props.startValue || "", props.endValue || ""];
  },
  set(val) {
    if (!val) {
      emit("update:startValue", "");
      emit("update:endValue", "");
    } else {
      emit("update:startValue", val[0]);
      emit("update:endValue", val[1]);
    }
  }
})

function change() {
  emit('change')
}

</script>

<style lang="scss" scoped>
</style>
