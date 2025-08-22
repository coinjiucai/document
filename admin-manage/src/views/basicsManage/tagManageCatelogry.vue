<template>
  <div class="source-manage-game flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="标签分类"
      :default-props="{ label: 'name', value: 'id' }"
      node-key="id"
      :tree-data.sync="treeList"
      :get-url="['basics', 'sysmateriallabelTreeList']"
      :disabledOption="false"
      :delete-url="['basics', 'sysmateriallabelDelete']"
      @current-change="handleCurrentChange"
      @edit="editCategory"
      @add="addTopDepet"
    >
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle flex-layout pa10">
      <ListPage
        ref="listPage"
        :params="params"
        :fieldsConfig="fieldsConfig"
        :labelList="labelList"
        :listApi="['basics', 'sysmateriallabelPage']"
        :deleteApi="['basics', 'sysmateriallabelDeleteBatch']"
        @edit="edit"
        :editApi="['basics', 'sysmateriallabelSave']"
        @add="add"
        :addApi="['basics', 'sysmateriallabelSave']"
        @refresh="$refs.catalogue.getTree()"
        @rowClick="edit"
      >
      </ListPage>
    </div>
    <BaseDialog
      class="full-block"
      title="添加顶级分类"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
      top="20vh"
      destroy-on-close
    >
      <div class="full-block" style="padding: 0 20px">
        <el-form ref="form" label-position="right" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="标签分类名称">
                <el-input
                  v-model="label"
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
    <!-- 选择上级 -->
    <BaseDialog
      class="full-block"
      title="选择上级"
      center
      :visible.sync="parentVisibleDialog"
      @close="parentVisibleDialog = false"
      width="1000px"
      top="20vh"
      destroy-on-close
    >
      <LeftCatalogue
        ref="catalogueParent"
        title="组织架构"
        :default-props="{
          label: 'name',
          value: 'id',
          children: 'childrenList'
        }"
        node-key="key"
        :tree-data.sync="parentTreeList"
        :get-url="['basics', 'sysmateriallabelTreeList']"
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

    <BaseDialog
      class="full-block"
      :title="labelTitle"
      center
      :visible.sync="labelShow"
      @close="labelShow = false"
      width="500px"
      top="20vh"
      destroy-on-close
    >
      <!-- <div>
        <el-input
          v-model="name"
          maxlength="30"
          placeholder="标签名称"
          @input="nameChange"
        ></el-input>
      </div> -->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名称">
          <el-input
            v-model="form.name"
            maxlength="30"
            placeholder="标签名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签说明">
          <el-input
            v-model="form.introduce"
            type="textarea"
            maxlength="100"
            placeholder="标签说明"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="labelSave">确定</el-button>
        <el-button type="info" @click="labelShow = false">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import LeftCatalogue from '@/components/Project/LeftCatalogue';
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import BaseTable from '@/components/Base/BaseTable';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import FormItem from '@/components/Form/Item';
export default {
  name: 'tagCatelogryManage',
  cname: '标签分类管理',
  components: {
    LeftCatalogue,
    ListPage,
    BaseDialog,
    BaseTable,
    ImageUpload,
    FormItem
  },
  props: {},
  data() {
    return {
      treeList: [],
      visibleDialog: false,
      type: 1,
      currentDepet: null,
      currentNode: null,
      depetParam: {
        label: '',
        parentId: ''
      },
      parentTitle: '',
      parentVisibleDialog: false,
      parentTreeList: [],
      parentCurrentDept: null,
      listApi: [],
      pageInfo: {
        pageNo: 1,
        pageSize: 6
      },
      list: [],
      total: 0,
      // 添加分类
      title: '',
      calategoryId: '',
      label: '',
      treeItem: null,

      // 搜索参数
      params: {
        name: '',
        parentId: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '标签类型名称',
          compType: 'input',
          width: 160,
          placeholder: '标签类型名称',
          prop: 'name'
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '标签类型名称',
          prop: 'name'
        },
        {
          label: '标签说明',
          prop: 'introduce'
        }
      ],
      //
      labelTitle: '新增标签',
      labelShow: false,
      name: '',
      labelItem: null,
      form: {
        name: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { max: 30, message: '长度在30个字符以内', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入标签描述', trigger: 'blur' }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.pageInfo.pageSize = 6;
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    nameChange(val) {
      if (val.length >= 30) {
        this.$message.warning('最多可以30个字符！');
      }
    },
    getValue(val) {
      if (val.indexOf('http') >= 0 || val.indexOf('https') >= 0) {
        return val;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${val}`;
      }
    },
    handleCurrentChange(data) {
      this.currentDepet = { ...data };
      this.params.parentId = data.id;
      this.$nextTick(() => {
        this.getList();
      });
      setTimeout(() => {
        // this.$refs.catalogue.setCurrentNode(data.id);
      }, 1000);
    },
    getList() {
      this.$refs.listPage.handleSearch();
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    addTopDepet() {
      this.treeItem = null;
      this.title = '';
      this.calategoryId = '';
      this.label = '';
      this.visibleDialog = true;
    },
    // 通过id 获取对应的对象
    findMatchingParentId(data, parentId) {
      let result = [];
      data.forEach((item) => {
        if (item.id === parentId) {
          result.push(item);
        }
        // 递归查找子级
        if (item.childrenList && item.childrenList.length > 0) {
          result = result.concat(
            this.findMatchingParentId(item.childrenList, parentId)
          );
        }
      });
      return result;
    },
    // 修改分类
    editCategory(treeData, data) {
      if (data.parentId) {
        const matchingItems = this.findMatchingParentId(
          treeData,
          data.parentId
        );
        console.log('pppp', matchingItems, data.parentId);
        if (matchingItems && matchingItems.length > 0) {
          this.title = matchingItems[0].label;
          this.calategoryId = matchingItems[0].id;
        }
      } else {
        this.title = '';
      }

      this.label = data.name;
      this.treeItem = data;
      this.visibleDialog = true;
    },
    handleSave() {
      let params = {
        parentId: this.calategoryId,
        name: this.label
      };
      if (this.treeItem) {
        params = {
          ...this.treeItem,
          parentId: this.calategoryId,
          name: this.label
        };
      }
      this.$api.basics
        .sysmateriallabelSave(params)
        .then((res) => {
          if (res.code == 200) {
            this.$refs.catalogue.getTree();
            this.$message.success('操作成功！');
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
      this.title = this.parentCurrentDept.name;
      this.calategoryId = this.parentCurrentDept.id;
      this.parentVisibleDialog = false;
    },
    selectParent(event) {
      event.target.blur();
      this.parentVisibleDialog = true;
    },
    add() {
      this.labelTitle = '新增标签';
      this.name = '';
      this.labelItem = null;
      this.labelShow = true;
      this.form.name = '';
      this.form.introduce = '';
    },
    edit(item) {
      this.labelTitle = '编辑标签';
      this.labelItem = item;
      this.name = item.name;
      this.form.name = item.name;
      this.form.introduce = item.introduce;
      this.labelShow = true;
    },
    // 标签保存
    labelSave() {
      let param = {};
      if (this.labelItem) {
        param = {
          ...this.labelItem,
          name: this.form.name,
          introduce: this.form.introduce
        };
      } else {
        param = {
          name: this.form.name,
          introduce: this.form.introduce,
          parentId: this.params.parentId
        };
      }
      this.$api.basics
        .sysmateriallabelSave(param)
        .then((res) => {
          if (res.code == 200) {
            // this.$refs.catalogue.getTree();
            this.$refs.listPage.getList();
            this.$message.success('操作成功！');
            this.labelShow = false;
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.source-manage-game {
  .list-container {
    flex: 1;
    .game-item {
      position: relative;

      text-align: center;
      > div {
        position: relative;
        width: 100%;
      }
      img {
        display: block;
        width: 100%;
        height: 300px;
        border: 2px solid #fff;
      }
      .iconfont {
        position: absolute;
        left: 50%;
        font-size: 24px;
        margin-left: -12px;
        top: 38%;
        color: #cdbe97;
      }
    }
    .title {
      margin-top: 6px;
      margin-bottom: 10px;
    }
  }
  .page-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
