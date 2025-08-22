<template>
  <!--multiple必须为true-->
  <el-select
      v-model="dataList"
      @change="handleDataListChange"
      multiple
      v-bind="$attrs">
    <slot></slot>
  </el-select>
</template>

<script>
export default {
  name: "SelectToString",
  components: {},
  props: {
    value: {
      type: String,
      required: true
    },
  },
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  filters: {},
  watch: {},
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
  },
}
</script>

<style lang="scss" scoped>
.component-SelectToString {

}
</style>
