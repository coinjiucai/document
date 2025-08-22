<template>
  <div class="document-type-manage flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="标签分类体系"
      :default-props="{ label: 'name', value: 'code', children: 'child' }"
      node-key="code"
      :tree-data.sync="treeList"
      :get-url="getUrl"
      :disabledOption="false"
      :labelIcon="labelIcon"
      :deleteUrl="['documentManageAPI', 'classfyDelete']"
      @edit="editCategory"
      @current-change="handleCurrentChange"
    >
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle pa10">
      <div>
        <el-button type="primary" size="small" @click="addTopDepet"
          >添加顶级分类</el-button
        >
        <el-button type="primary" size="small" @click="addDepet"
          >添加子分类</el-button
        >
      </div>
    </div>
    <BaseDialog
      class="full-block"
      title="添加顶级单位"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
      top="20vh"
      destroy-on-close
    >
      <div class="full-block" style="padding: 0 20px">
        <el-form ref="form" label-position="right" label-width="120px">
          <el-row v-if="type == 2">
            <el-col :span="24">
              <el-form-item label="所属分类">
                <el-input
                  v-model="parentTitle"
                  maxlength="30"
                  placeholder="文件类型/项目类型"
                  @focus="selectParent($event)"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="分类名称">
                <el-input
                  v-model="depetParam['name']"
                  maxlength="30"
                  placeholder="项目文件"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="分类编码">
                <el-input
                  v-model="depetParam['classfyCode']"
                  maxlength="30"
                  placeholder="项目文件编码"
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
        :default-props="{ label: 'name', value: 'code', children: 'child' }"
        node-key="code"
        :tree-data.sync="parentTreeList"
        :get-url="getUrl"
        :disabledOption="true"
        :labelIcon="labelIcon"
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
import labelIcon from "@/assets/images/file.png";
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
      labelIcon,
      getUrl: "/mlf-csjm-service/archives/classfy/list",
      treeList: [],
      type: 1,
      currentDepet: null,
      visibleDialog: false,
      depetParam: {
        id: "",
        name: "",
        classfyCode: "",
        pid: "",
      },
      parentTitle: "",
      parentVisibleDialog: false,
      parentTreeList: [],
      parentCurrentDept: null,
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
      this.depetParam.pid = data.id;
    },
    addTopDepet() {
      this.depetParam = {
        name: "",
        classfyCode: "",
        pid: "0",
      };
      this.visibleDialog = true;
      this.type = 1;
    },
    addDepet() {
      this.depetParam = {
        name: "",
        classfyCode: "",
        pid: this.depetParam.pid ? this.depetParam.pid : "",
      };

      this.visibleDialog = true;
      this.type = 2;
    },
    handleSave() {
      this.$api.documentManageAPI
        .classfySave(this.depetParam)
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
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    parentHandleCurrentChange(data) {
      this.parentCurrentDept = { ...data };
    },
    handleParentSave() {
      this.parentTitle = this.parentCurrentDept.name;
      this.depetParam.pid = this.parentCurrentDept.id;
      this.parentVisibleDialog = false;
    },
    selectParent(event) {
      event.target.blur();
      this.parentVisibleDialog = true;
      if (this.depetParam.pid) {
        this.$nextTick(() => {
          this.$refs.catalogueParent.setCurrentNode(this.depetParam.pid);
        });
      }
    },
    editCategory(treeData, data) {
      this.depetParam = {
        name: data.name,
        classfyCode: data.code,
        id: data.id,
      };

      this.visibleDialog = true;
      this.type = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.document-type-manage {
}
</style>
