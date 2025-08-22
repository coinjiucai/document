<template>
  <el-input-number
      class="base-input-number"
      v-bind="$attrs"
      :value="numberValue"
      @change="numberChange">
  </el-input-number>
</template>

<script>
export default {
  name: "BaseInputNumber",
  components: {},
  props: {
    value: {
      type: undefined | null | Number,
      default: undefined
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
    numberValue() {
      if (this.value === null) {
        return undefined
      } else {
        return this.value
      }
    }
  },
  methods: {
    numberChange(val) {
      const res = val === undefined ? null : val
      this.$emit('input', res);
      this.$emit('change', res);
    }
  },
}
</script>

<style lang="scss" scoped>
.component-BaseInputNumber {

}
</style>
