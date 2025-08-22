export default {
  props: {
    itemConfig: Object,
    record: Object,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 设置placeholder
     * @param text
     * @returns {string|*}
     */
    setPlaceholder(text) {
      return this.readonly ? '' : text
    },
    /**
     * 触发change事件
     * @param col
     * @param val
     */
    doChange(col, val) {
      if (col.hasOwnProperty('componentEvent') && col['componentEvent'].hasOwnProperty('change')) {
        col['componentEvent']['change'](this.record, val);
      }
    }
  }
}
