<template>
  <el-tooltip v-bind="$attrs">
    <template v-slot:content>
      <slot name="content">
        <div class="w150" style="line-height: 18px">{{ content }}</div>
      </slot>
    </template>
    <i :class="elIconName"></i>
  </el-tooltip>
</template>

<script>
export default {
  name: "IconTooltip",
  components: {},
  props: {
    elIconName: {type: String, default: 'el-icon-info'},
    content: {type: String, default: '这是一个提示信息！'},
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
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.component-IconTooltip {

}
</style>
