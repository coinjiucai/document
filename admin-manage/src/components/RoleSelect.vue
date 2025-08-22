<template>
  <div class="role-select">
    <el-select
      v-model="selectValue"
      v-bind="$attrs"
      filterable
      remote
      style="width: 100%"
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in dataList"
        :key="item.itemValue"
        :label="item.itemText"
        :value="item.itemValue"
        :disabled="disabled"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "RoleSelect",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
    // dictCode: String,
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    selectValue() {
      return this.value;
    },
  },
  data() {
    return {
      loading: false,
      pageInfo: {
        pageSize: 50,
        pageNumber: 1,
        roleName: "",
      },
      dataList: [],
    };
  },
  mounted() {},
  methods: {
    changeSelect(val) {
      this.$emit("change", val);
    },
    remoteMethod(query) {
      this.pageInfo.roleName = query;
      this.loading = true;
      this.$api.globalAPI
        .getList("/mlf-csjm-service/sys/sysDepartRole/list", this.pageInfo)
        .then((res) => {
          this.loading = false;
          this.dataList = res["result"].records;
          this.total = res["result"].total;
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
