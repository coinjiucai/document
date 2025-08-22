<template>
  <el-checkbox-group
      v-model="dataList"
      @change="handleDataListChange"
      v-bind="$attrs">
    <slot name="default" :options="options">
      <el-checkbox v-for="(item,index) in options" :key="index" :label="item.value">
        {{ item.label }}
      </el-checkbox>
    </slot>
  </el-checkbox-group>
</template>

<script>
export default {
  name: "CheckboxGroupToString",
  components: {},
  props: {
    value: {
      type: String | null,
      required: true
    },
    options: {
      type: Array,
      default: () => ([])
    },
    isJson: {
      type: Boolean,
      default: false
    }
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
        if (this.isJson) {
          try {
            return JSON.parse(this.value) || []
          } catch (e) {
            return []
          }
        } else {
          return this.value?.split(',').filter(i => !!i) || []
        }

      },
      set(val) {
        if (this.isJson) {
          this.$emit('input', JSON.stringify(val));
        } else {
          this.$emit('input', val.toString());
        }
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
.component-checkboxGroupToString {

}
</style>
