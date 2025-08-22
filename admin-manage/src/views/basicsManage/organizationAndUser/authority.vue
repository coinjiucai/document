<template>
  <div class="component-authority flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="角色名称"
      :default-props="{ label: 'roleName', value: 'id' }"
      node-key="id"
      :tree-data.sync="treeList"
      :delete-url="['System', 'deleteDepart']"
      :option-permission-flag="'depart:manage||depart:permission'"
      :add-permission-flag="'depart:manage'"
      :edit-permission-flag="'depart:manage'"
      :delete-permission-flag="'depart:manage'"
      :disabledOption="true"
      @add="handleAddDepart"
      @edit="handleEditDepart"
      @current-change="handleCurrentChange"
    >
      <template v-slot:dropdown-top="{ node, data }">
        <el-dropdown-item
          v-has="'depart:permission'"
          @click.native="handleShowPermissionSetting(node, data)"
          >授权
        </el-dropdown-item>
      </template>
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle flex-layout pa10">
      <div class="flex-auto">
        <el-tabs v-model="authorityActive" @tab-click="handleClick">
          <el-tab-pane label="功能权限" name="one"
            ><AuthorityTree v-model="authorityData"></AuthorityTree
          ></el-tab-pane>
          <el-tab-pane label="数据权限" name="two">数据权限</el-tab-pane>
        </el-tabs>
        <div class="save-button">
          <el-button type="primary" size="small">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftCatalogue from "@/components/Project/LeftCatalogue";
import AuthorityTree from "@/components/AuthorityTree/AuthorityTree";
import Common from "@/com/common";

export default {
  name: "Authority",
  cname: "权限管理",
  components: {
    LeftCatalogue,
    AuthorityTree,
  },
  props: {},
  data() {
    return {
      treeList: [],
      pageInfo: {
        id: "",
        username: "",
        pageSize: 10,
        pageNo: 1,
        total: 0,
      },
      authorityActive: "one",
      authorityData: [],
    };
  },
  created() {},
  mounted() {
    this.getRoleList();
  },
  filters: {},
  watch: {},
  computed: {
    currentDepartName() {
      if (this.treeList.length && this.pageInfo.id) {
        let departName = "";
        Common.depthFirstSearch(this.treeList, (item) => {
          if (item.id === this.pageInfo.id) departName = item.departName;
        });
        return departName;
      } else {
        return "";
      }
    },
  },
  methods: {
    /**
     * 获取角色列表
     */
    getRoleList() {
      this.$api.System.getRoleList({}).then((res) => {
        this.pageInfo.total = res["result"]["total"];
        this.treeList = res["result"]["records"];
      });
    },
    /**
     * 获取用户列表
     */
    getUserList() {
      this.pageInfo = {};
      this.$api.System.getUserList(this.pageInfo).then((res) => {
        this.pageInfo.total = res["result"]["total"];
        this.dataList = res["result"]["records"];
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="scss" scoped>
.component-authority {
  .save-button {
    margin-top: 20px;
  }
}
</style>
