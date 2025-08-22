<template>
  <div class="source-manage-game flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="游戏分类"
      :default-props="{ label: 'label', value: 'id', children: 'childrenList' }"
      node-key="id"
      :tree-data.sync="treeList"
      :get-url="['source', 'psygameclassifyTreeList']"
      :disabledOption="true"
      :delete-url="['source', 'psygameclassifyDelete']"
      @current-change="handleCurrentChange"
      @edit="editCategory"
      @add="addTopDepet"
    >
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle flex-layout pa10">
      <ListPage
        ref="listPage"
        v-if="params.dictId"
        :params="params"
        :fieldsConfig="fieldsConfig"
        :showSelection="false"
        :labelList="labelList"
        :buttonList="[]"
        :listApi="['source', 'psygamesPage']"
      >
        <template slot="imageUrl_parent" slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="getValue(scope.row.imageUrl)"
            fit="cover"
            v-if="scope.row.imageUrl"
            :preview-src-list="[getValue(scope.row.imageUrl)]"
          ></el-image>
          <span v-else>--</span>
        </template>
        <template slot="action_parent" slot-scope="scope">
          <!-- <el-link type="primary" @click="edit(scope.row)">详情</el-link> -->
          <el-button @click="gameRead(scope.row)">查看游戏</el-button>
        </template>
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
    >
      <div class="full-block" style="padding: 0 20px">
        <el-form
          ref="form"
          :model="categoryRecord"
          :rules="categoryRules"
          label-position="right"
          label-width="120px"
        >
          <el-row v-if="!categoryRecord.id">
            <el-col :span="24">
              <el-form-item label="上级分类">
                <el-cascader
                  :options="treeList"
                  :show-all-levels="false"
                  v-model="categoryRecord.parentId"
                  collapse-tags
                  :props="{
                    label: 'label',
                    value: 'id',
                    multiple: false,
                    children: 'childrenList'
                  }"
                  style="width: 100%"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="类别名称" prop="label">
                <el-input
                  v-model="categoryRecord.label"
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

    <!-- 弹窗 -->
    <BaseDialog
      class="full-block"
      :title="dialogTitle2"
      center
      :visible.sync="visibleDialog2"
      @close="handleCloseDialog2"
      width="800px"
      top="20vh"
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          label-position="right"
          label-width="100px"
          style="padding-right: 20px"
        >
          <el-form-item label="游戏名称:" prop="name">
            {{ record.name }}
          </el-form-item>
          <el-form-item label="游戏类别:" prop="dictId">
            <el-cascader
              :options="treeList"
              :show-all-levels="false"
              v-model="record.dictId"
              collapse-tags
              :props="{
                label: 'label',
                value: 'id',
                multiple: false,
                children: 'childrenList'
              }"
              style="width: 100%"
              clearable
              disabled
            ></el-cascader>
          </el-form-item>
          <el-form-item label="指导语:" prop="guideLine">
            <div v-html="record.guideLine"></div>
          </el-form-item>

          <el-form-item label="游戏封面:" prop="imageUrl">
            <ImageUpload v-model="record.imageUrl" @change="changeUpload">
            </ImageUpload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog2">取消</el-button>
      </span>
    </BaseDialog>
    <!--- 去测试量表  --->
    <BaseDialog
      class="full-block component-game-dialog"
      title="游戏详情"
      center
      :visible.sync="gameVisibleDialog"
      @closed="gameCloseDialog"
      width="100%"
      top="0vh"
      destroy-on-close
    >
      <iframe
        :src="gameUrl"
        frameborder="0"
        width="100%"
        :height="wHeight"
      ></iframe>
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
  name: 'Organization',
  cname: '组织管理',
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
      // 搜索参数
      params: {
        name: '',
        dictId: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '游戏名称',
          compType: 'input',
          width: 160,
          placeholder: '游戏名称',
          prop: 'name'
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '名称', prop: 'name', width: 200 },
        { label: '指导语', prop: 'guideLine', 'show-overflow-tooltip': false },
        {
          label: '缩略图',
          prop: 'imageUrl',
          parent: 'imageUrl_parent',
          width: 160,
          special: true
        },
        {
          label: '操作',
          prop: 'action',
          width: 160,
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      type: 1,
      currentDepet: null,
      currentNode: null,
      depetParam: {
        label: '',
        // orgCode: "",
        parentId: ''
      },

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
      dialogTitle2: '详情',
      visibleDialog2: false,
      record: {
        name: '',
        dictId: [],
        imageUrl: '',
        guideLine: ''
      },
      // 添加分类
      categoryRecord: {
        label: '', // 分类名称
        id: '', // 分类id
        parentId: [] // 父级分类
      },
      categoryRules: {
        label: [{ required: true, message: '请输入类别名称', trigger: 'blur' }]
      },
      wHeight: 800,
      gameVisibleDialog: false,
      gameUrl: ''
    };
  },
  created() {},
  mounted() {
    this.pageInfo.pageSize = 6;
    this.wHeight = document.documentElement.clientHeight - 0;
    // 监听 treeList 的变化，当 treeList 有数据时，选中第一列分类
    this.$watch('treeList', (newVal) => {
      if (newVal.length > 0) {
        this.handleCurrentChange(newVal[0]);
      }
    });
  },
  methods: {
    getValue(val) {
      if (val.indexOf('http') >= 0 || val.indexOf('https') >= 0) {
        return val;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${val}`;
      }
    },
    handleCurrentChange(data) {
      this.currentDepet = { ...data };
      this.params.dictId = data.id;

      this.depetParam.parentId = data.id;
      this.$nextTick(() => {
        this.$refs.listPage.handleSearch();
      });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    addTopDepet() {
      this.categoryRecord = {
        label: '', // 分类名称
        id: '', // 分类id
        parentId: '' // 父级分类
      };
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
      let categoryRecord = { ...data };
      if (data.parentId) {
        const parentId = this.findCascadingIds(this.treeList, data.parentId);
        categoryRecord.parentId = parentId;
      }
      this.categoryRecord = categoryRecord;
      this.visibleDialog = true;
    },
    handleSave() {
      const parentId = this.categoryRecord.parentId;
      const id = parentId.length > 0 ? parentId[parentId.length - 1] : '';
      this.$api.source
        .psygameclassifySave({
          ...this.categoryRecord,
          parentId: id
        })
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
    // 获取路径数组
    findCascadingIds(data, targetId, currentPath = []) {
      for (const item of data) {
        const newPath = [...currentPath, item.id];
        if (item.id === targetId) {
          return newPath;
        }
        if (item.childrenList && item.childrenList.length > 0) {
          const result = this.findCascadingIds(
            item.childrenList,
            targetId,
            newPath
          );
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    edit(record) {
      const ids = this.findCascadingIds(this.treeList, record.dictId);
      this.visibleDialog2 = true;
      this.record = {
        ...record,
        dictId: ids
      };
    },

    handleCloseDialog2() {
      this.record = {
        name: '',
        dictId: [],
        imageUrl: ''
      };
      this.visibleDialog2 = false;
    },
    handleSave2() {
      this.$refs.form.validate((val) => {
        if (val) {
          const length = this.record.dictId.length;
          if (length == 0) {
            this.$message.error('请选择游戏类别');
          } else {
            this.$api.source
              .psygamesSave({
                ...this.record,
                dictId: this.record.dictId[length - 1]
              })
              .then((res) => {
                this.$refs.listPage.handleSearch();
                this.visibleDialog2 = false;
              });
          }
        }
      });
    },
    changeUpload(res) {
      this.record.imageUrl = res.message;
    },
    gameCloseDialog() {
      this.gameVisibleDialog = false;
    },
    gameRead(row) {
      this.gameUrl = row.testUrl;
      this.gameVisibleDialog = true;
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
.component-game-dialog {
  /deep/ .el-dialog {
    height: 100vh;
    margin-top: 0 !important;
  }
  /deep/.el-dialog__body {
    max-height: calc(100vh - 47px);
    height: calc(100vh - 47px) !important;
    padding: 0;
  }
  /deep/.el-dialog__footer {
    display: none;
  }
}
</style>
