<template>
  <div class="page-top flex-layout full-block">
    <!-- 操作按钮 -->
    <PageButtons
      :list="buttonList"
      @add="add"
      @edit="edit"
      @batchDelete="batchDelete"
    >
      <!-- 页面特殊按钮加这里 -->
      <slot name="PageButtons"></slot>
    </PageButtons>
    <el-divider></el-divider>
    <!-- 搜索框 -->
    <Search
      v-if="Object.keys(params)?.length > 0"
      :params="params"
      :fieldsConfig="fieldsConfig"
      @handleSearch="handleSearch"
    ></Search>
    <el-divider></el-divider>
  </div>
</template>

<script>
import PageButtons from "./PageButtons.vue";
import Search from "@/components/Search/Search.vue";
export default {
  name: "ListPage",
  components: {
    PageButtons,
    Search,
  },
  props: {
    buttonList: {
      type: [Array, String],
      default: () => ["add", "edit", "delete"],
    },
    // 查询参数
    params: {
      type: Object,
      default: () => ({}),
    },
    fieldsConfig: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    add() {
      this.$emit("add");
    },
    // 编辑内容
    edit() {
      this.$emit("edit");
    },
    batchDelete() {
      this.$emit("batchDelete");
    },
    handleSearch() {
      this.$emit("handleSearch", this.params);
    },
  },
};
</script>

<style lang="scss" scoped>
// 页面头部
.page-top {
}
</style>
