<template>
  <div class="component-readonlyContent el-input el-input--medium" :class="cursorNotAllowed? 'readonly-fix' : ''"
       style="display: grid">
    <template v-if="placeholder&&!value">
      <input class="el-input__inner" :placeholder="placeholder" :value="value"></input>
    </template>
    <template v-else>
      <div v-if="disabledTooltip"
           readonly="readonly"
           class="el-textarea__inner"
           style="white-space: pre-wrap">
        {{ value }}
      </div>
      <div v-else class="el-input__inner overflow-hidden" readonly="readonly">
        <textTooltip :value="value"></textTooltip>
      </div>
    </template>
  </div>
</template>

<script>
import textTooltip from "@/components/TextTooltip/TextTooltip";

export default {
  name: "readonlyContent",
  components: {
    textTooltip
  },
  props: {
    itemConfig: Object,
    value: String | Number | null | undefined,
    placeholder: {
      type: String,
      default: null
    },
    cursorNotAllowed: {
      type: Boolean,
      default: true
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
    disabledTooltip() {
      const type = this.itemConfig?.['componentProp']?.['type']
      return type === 'textarea'
    },
    contentClass() {
      return this.disabledTooltip ? 'el-textarea__inner' : 'el-input__inner'
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.component-readonlyContent {

}
</style>
