<template>
  <div class="user flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="组织架构"
      :default-props="{ label: 'title', value: 'value' }"
      node-key="key"
      :tree-data.sync="treeList"
      :get-url="getUrl"
      :disabledOption="true"
      @current-change="handleCurrentChange"
    >
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle flex-layout pa10">
      <ListPage
        ref="listPage"
        :params="params"
        :fieldsConfig="fieldsConfig"
        :labelList="labelList"
        :buttonList="['add', 'edit', 'delete']"
        :listApi="listApi"
        :deleteApi="['System', 'batchDeleteUser']"
        @add="$refs.userDialog.show()"
        @edit="edit"
      >
        <!-- <template v-slot:PageButtons> </template>
        <template slot="status_parent" slot-scope="scope">
          <el-link :underline="false" type="danger">{{ scope.row.id }}</el-link>
        </template> -->
      </ListPage>
    </div>
    <userDialog
      title="添加用户"
      :orgInfo="orgInfo"
      ref="userDialog"
      @save="refreshList"
    ></userDialog>
  </div>
</template>

<script>
import LeftCatalogue from "@/components/Project/LeftCatalogue";
import ListPage from "@/components/ListPage";
import userDialog from "./userDialog";
export default {
  name: "User",
  cname: "用户管理",
  components: {
    LeftCatalogue,
    ListPage,
    userDialog,
  },
  props: {},
  data() {
    return {
      getUrl: "/mlf-csjm-service/sys/sysDepart/queryIdTree",
      treeList: [],
      // 搜索参数
      params: {
        realname: "",
        idCard: "",
        logType: "",
        orgCode: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "姓名",
          compType: "input",
          width: 160,
          placeholder: "",
          prop: "realname",
        },
        {
          label: "身份证号",
          compType: "input",
          width: 160,
          placeholder: "",
          prop: "idCard",
        },
        {
          label: "角色",
          compType: "roleSelect",
          width: 160,
          prop: "logType",
        },
      ],
      // 表格字段列配置
      labelList: [
        {
          label: "状态",
          prop: "status",
          compType: "select",
          dictCode: true,
          // parent: "status_parent",
          // special: true,
        },
        { label: "账号", prop: "username" },
        { label: "姓名", prop: "realname" },
        { label: "单位", prop: "orgCodeTxt" },
        { label: "身份证号", prop: "idCard" },
        {
          label: "联系方式",
          prop: "telephone",
        },
        { label: "密级", prop: "classification", dictCode: true },
        {
          label: "角色",
          prop: "ip",
        },
      ],
      orgInfo: {
        orgCode: "",
        orgCodeTxt: "",
      },
      listApi: [],
    };
  },
  methods: {
    handleCurrentChange(data) {
      this.params.orgCode = data.orgCode;
      this.listApi = ["System", "getUserList"];
      this.orgInfo.orgCode = data.orgCode;
      this.orgInfo.orgCodeTxt = data.title;
      this.$nextTick(() => {
        this.$refs.listPage.getList();
      });
    },
    refreshList() {
      this.$refs.listPage.getList();
    },
    edit(row) {
      this.$api.System.userQueryById({
        id: row.id,
      }).then((res) => {
        const item = res.result.records[0];
        if (item.nativePlace) {
          item.nativePlace = JSON.parse(item.nativePlace);
        }
        this.$refs.userDialog.show(item);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user {
}
</style>
