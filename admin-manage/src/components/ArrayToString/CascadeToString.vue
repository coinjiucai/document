<template>
  <el-cascader
      v-model="dataList"
      @change="handleDataListChange"
      :options="options"
      :props="props"
      v-bind="$attrs">
  </el-cascader>
</template>

<script>
export default {
  name: "CascadeToString",
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    // multiple:true,emitPath:false需固定不变，否则数据格式不匹配会导致回显会出问题
    props: {
      type: Object,
      default: () => ({multiple: true, emitPath: false,})
    }
  },
  computed: {
    dataList: {
      get() {
        return this.value.split(',').filter(i => !!i)
      },
      set(val) {
        this.$emit('input', val.toString());
      }
    }
  },
  methods: {
    handleDataListChange(val) {
      this.$emit('change', val);
    }
  }
}
</script>

<style scoped>

</style>
