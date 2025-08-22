<template>
  <component :is="currentComponent" v-bind="$props"></component>
</template>

<script>
import FormItemMixin from "./FormItemMixin";
// 示例：
// const departUserPicker = ()=>import("@/components/BaseForm/customComponents/departUserPicker.vue");
export default {
  name: "CustomFormItem",
  mixins: [FormItemMixin],
  props: {},
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
    currentComponent() {
      const components = {
        // 示例
        // departUserPicker,
      }
      return components[this.itemConfig['component']]
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.component-CustomFormItem {

}
</style>
