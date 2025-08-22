<template>
  <div class="search-actions">
    <el-button type="primary" size="mini" @click="$emit('handleSearch')"
      >查询</el-button
    >
    <el-button type="primary" size="mini" @click="$emit('reset')"
      >重置</el-button
    >
    <slot name="special"></slot>
  </div>
</template>

<script>
export default {
  name: "SearchActions",
  components: {},
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  filters: {},
  watch: {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.search-actions {
  display: inline-block;
}
</style>
