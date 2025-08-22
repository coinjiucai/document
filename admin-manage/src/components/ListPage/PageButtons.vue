<template>
  <div class="table-buttons">
    <!-- <el-button
      type="primary"
      size="mini"
      v-if="list.includes('add')"
      @click="add"
      >{{ $attrs["addText"] ? $attrs["addText"] : "添加" }}</el-button
    > -->

    <div
      class="btn-type-1 el-icon-plus"
      v-if="list.includes('add')"
      @click="add"
    >
      {{ $attrs["addText"] ? $attrs["addText"] : "添加" }}
    </div>

    <!-- <el-button
      type="success"
      size="mini"
      v-if="list.includes('edit')"
      @click="edit"
      >{{ $attrs["editText"] ? $attrs["editText"] : "编辑" }}</el-button
    > -->
    <div
      class="btn-type-1 el-icon-edit"
      v-if="list.includes('edit')"
      @click="edit"
    >
      {{ $attrs["editText"] ? $attrs["editText"] : "编辑" }}
    </div>

    <!-- <el-button
      type="danger"
      size="mini"
      v-if="list.includes('delete')"
      @click="batchDelete"
      >{{ $attrs["deleteText"] ? $attrs["deleteText"] : "删除" }}</el-button
    > -->
    <div
      class="btn-type-1 el-icon-close"
      v-if="list.includes('delete')"
      @click="batchDelete"
    >
      {{ $attrs["deleteText"] ? $attrs["deleteText"] : "删除" }}
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return ["add", "edit", "delete"];
      },
    },
  },
  methods: {
    refresh() {
      this.$emit("refresh");
    },
    add() {
      this.$emit("add");
    },
    edit() {
      this.$emit("edit");
    },
    batchDelete() {
      this.$emit("batchDelete");
    },
  },
};
</script>

<style lang="scss" scoped>
.table-buttons {
  display: inline-block;
}
</style>
