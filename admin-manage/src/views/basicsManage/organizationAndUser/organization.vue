<template>
  <div class="organization flex-row full-block">
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
        :buttonList="[]"
        :listApi="listApi"
      >
        <template v-slot:PageButtons>
          <el-button type="primary" size="small" @click="addTopDepet"
            >添加顶级单位</el-button
          >
          <el-button type="primary" size="small" @click="addDepet"
            >添加单位</el-button
          >
        </template>
        <!-- <template slot="status_parent" slot-scope="scope">
          <el-link :underline="false" type="danger">{{ scope.row.id }}</el-link>
        </template> -->
      </ListPage>
    </div>
    <BaseDialog
      class="full-block"
      title="添加顶级单位"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
      top="20vh"
    >
      <div class="full-block" style="padding: 0 20px">
        <el-form ref="form" label-position="right" label-width="120px">
          <el-row v-if="type == 2">
            <el-col :span="24">
              <el-form-item label="上级单位">
                <el-input
                  v-model="parentTitle"
                  maxlength="30"
                  placeholder="请选择上级单位"
                  @focus="selectParent($event)"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="单位名称">
                <el-input
                  v-model="depetParam['name']"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="单位代码">
                <el-input
                  v-model="depetParam['orgCode']"
                  maxlength="30"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>

    <BaseDialog
      class="full-block"
      title="选择上级"
      center
      :visible.sync="parentVisibleDialog"
      @close="parentVisibleDialog = false"
      width="1000px"
      top="20vh"
    >
      <LeftCatalogue
        ref="catalogueParent"
        title="组织架构"
        :default-props="{ label: 'title', value: 'value' }"
        node-key="key"
        :tree-data.sync="parentTreeList"
        :get-url="getUrl"
        :disabledOption="true"
        @current-change="parentHandleCurrentChange"
      >
      </LeftCatalogue>
      <span slot="footer">
        <el-button type="primary" @click="handleParentSave">确定</el-button>
        <el-button type="info" @click="parentVisibleDialog = false"
          >取消</el-button
        >
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import LeftCatalogue from "@/components/Project/LeftCatalogue";
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
export default {
  name: "Organization",
  cname: "组织管理",
  components: {
    LeftCatalogue,
    ListPage,
    BaseDialog,
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
          // parent: "status_parent",
          // special: true,
        },
        { label: "账号", prop: "username" },
        { label: "身份证号", prop: "idCard" },
        {
          label: "联系方式",
          prop: "telephone",
        },
        { label: "密级", prop: "classification" },
        {
          label: "角色",
          prop: "ip",
        },
      ],
      visibleDialog: false,
      type: 1,
      currentDepet: null,
      currentNode: null,
      depetParam: {
        name: "",
        orgCode: "",
        parentId: "",
      },
      parentTitle: "",
      parentVisibleDialog: false,
      parentTreeList: [],
      parentCurrentDept: null,
      listApi: [],
    };
  },
  created() {},
  mounted() {},
  filters: {},
  watch: {},
  computed: {},
  methods: {
    handleCurrentChange(data) {
      this.currentDepet = { ...data };
      this.depetParam.parentId = data.key;
      this.parentTitle = data.title;
      this.params.orgCode = data.orgCode;
      this.listApi = ["System", "getUserList"];

      this.$nextTick(() => {
        this.$refs.listPage.getList();
      });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    addTopDepet() {
      this.depetParam = {
        name: "",
        orgCode: "",
        parentId: "",
      };
      this.visibleDialog = true;
      this.type = 1;
    },
    addDepet() {
      this.depetParam = {
        name: "",
        orgCode: "",
        parentId: this.depetParam.parentId ? this.depetParam.parentId : "",
      };

      this.visibleDialog = true;
      this.type = 2;
    },
    handleSave() {
      this.$api.System.addDepartTree(this.depetParam)
        .then((res) => {
          if (res.code == 200) {
            this.$refs.catalogue.getTree();
            this.$message.success("操作成功！");
            this.visibleDialog = false;
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    parentHandleCurrentChange(data) {
      this.parentCurrentDept = { ...data };
    },
    handleParentSave() {
      this.parentTitle = this.parentCurrentDept.title;
      this.depetParam.parentId = this.parentCurrentDept.value;
      this.parentVisibleDialog = false;
    },
    selectParent(event) {
      event.target.blur();
      this.parentVisibleDialog = true;
      if (this.depetParam.parentId) {
        this.$nextTick(() => {
          this.$refs.catalogueParent.setCurrentNode(this.depetParam.parentId);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.organization {
}
</style>
