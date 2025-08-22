<template>
  <div v-if="visibleDialog">
    <BaseDialog
      class="full-block component-table-dialog full-dialog"
      title="选择游戏"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="98%"
      top="20vh"
      destroy-on-close
    >
      <div
        class="cursor-set-container"
        style="display: flex; margin-bottom: -30px"
      >
        <div class="left h100p">
          <LeftCatalogue
            ref="catalogue"
            title="游戏分类"
            :default-props="{
              label: 'label',
              value: 'id',
              children: 'childrenList'
            }"
            :disabledOption="true"
            :tree-data.sync="treeList"
            :getUrl="['source', 'psygameclassifyTreeList']"
            :deleteUrl="['source', 'psygameclassifyDelete']"
            @current-change="handleTreeNodeChange"
          >
          </LeftCatalogue>
        </div>
        <div
          class="right flex-auto theme-background-middle flex-layout pa10"
          style="height: 78vh"
        >
          <ListPage
            v-if="params.dictId"
            ref="listPage"
            :params="params"
            :fieldsConfig="fieldsConfig"
            :labelList="labelList"
            :buttonList="[]"
            :selectLimit="$attrs.selectLimit"
            :showIndex="true"
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
          </ListPage>
          <div v-else v-loading="true"></div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import LeftCatalogue from '@/components/Project/LeftCatalogue';
// import courseListMain from "@/views/sourceManage/course/components/courseListMain";
import BaseDialog from '@/components/Base/BaseDialog';
import ListPage from '@/components/ListPage';
export default {
  components: {
    BaseDialog,
    LeftCatalogue,
    ListPage
    // courseListMain,
  },
  data() {
    return {
      visibleDialog: false,
      treeList: [],
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
          placeholder: '',
          prop: 'name'
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '名称', prop: 'name' },
        { label: '指导语', prop: 'guideLine', 'show-overflow-tooltip': false },
        {
          label: '缩略图',
          prop: 'imageUrl',
          parent: 'imageUrl_parent',
          special: true
        }
      ]
    };
  },
  methods: {
    getValue(val) {
      if (val.indexOf('http') >= 0 || val.indexOf('https') >= 0) {
        return val;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${val}`;
      }
    },
    show() {
      this.visibleDialog = true;
    },
    confirm() {
      const list = this.$refs.listPage.getAllSelection();
      var arr =
        list.length > 0
          ? list.map((v) => {
              return {
                taskContent: v.name,
                taskContentId: v.id
              };
            })
          : [];
      this.$emit('confirm', arr);
      this.visibleDialog = false;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    handleTreeNodeChange(val) {
      this.params.dictId = val.id;
      this.$nextTick(() => {
        if (this.$refs.listPage) this.$refs.listPage.handleSearch();
      });
    },
    handleUpdateCatalogue() {
      this.$refs.catalogue.getTree();
    }
  }
};
</script>

<style></style>
