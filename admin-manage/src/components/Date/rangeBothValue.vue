<template>
  <component
      :is="dateTimeComponent"
      :type="dataType"
      :class="rangeClass"
      v-bind="$attrs"
      v-on="$listeners"
      :is-range="dataType!=='daterange'&&dataType!=='datetimerange'"
      v-model="rangeValue"
  >
  </component>
</template>

<script>

export default {
  name: "rangeBothValue",
  components: {},
  props: {
    rangeClass: String,
    dataType: {
      type: String,
      //日期选择器：daterange，时间日期选择器：datetimerange，时间选择器：任意值
      default: "daterange"
    },
    startValue: {
      type: String,
      required: true
    },
    endValue: {
      type: String,
      required: true
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
    /**
     * 时间日期选择器选择
     * 日期，日期时间选择器：el-date-picker，时间选择器：el-time-picker
     * 如果是时间选择器需要加上is-range属性，会根据传入的dataType自动判断is-range的值是否为true
     * @returns {string}
     */
    dateTimeComponent() {
      if (this.dataType === 'daterange') return 'el-date-picker'
      else if (this.dataType === 'datetimerange') return 'el-date-picker'
      else return 'el-time-picker'
    },
    /**
     * 将startValue、endValue与日期时间范围返回的数组绑定
     */
    rangeValue: {
      get() {
        return [this.startValue, this.endValue]
      },
      set(newValue) {
        if (!newValue) {
          this.$emit('update:startValue', '')
          this.$emit('update:endValue', '')
        } else {
          this.$emit('update:startValue', newValue[0])
          this.$emit('update:endValue', newValue[1])
        }
      }
    }
  },
  methods: {
    handleValueChange(val) {
      if (!val) {
        this.$emit('update:startValue', '')
        this.$emit('update:endValue', '')
      } else {
        this.$emit('update:startValue', val[0])
        this.$emit('update:endValue', val[1])
      }

    }
  },
}
</script>

<style lang="scss" scoped>
.component-rangeBothValue {

}
</style>
