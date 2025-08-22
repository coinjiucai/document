<template>
  <div v-if="visibleDialog">
    <BaseDialog
      class="full-block component-table-dialog full-dialog"
      title="选择课程"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="98%"
      style="height: 98vh"
      top="5vh"
      destroy-on-close
    >
      <div
        class="cursor-set-container"
        style="display: flex; margin-bottom: -30px"
      >
        <div class="left h100p">
          <LeftCatalogue
            ref="catalogue"
            title="课程分类"
            :default-props="{
              label: 'label',
              value: 'id',
              children: 'childrenList'
            }"
            :disabledOption="true"
            :tree-data.sync="treeList"
            :getUrl="['source', 'getXlkcflList']"
            :deleteUrl="['source', 'delXlkcfl']"
            @current-change="handleTreeNodeChange"
          >
          </LeftCatalogue>
        </div>
        <div
          class="right"
          style="
            width: calc(100% - 230px);
            height: calc(100vh - 200px);
            overflow-y: auto;
          "
        >
          <courseListMain
            ref="courseListMain"
            :treeList="treeList"
            v-on="$listeners"
            :selectLimit="$attrs.selectLimit"
            :readOnly="true"
          />
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
import courseListMain from '@/views/sourceManage/course/components/courseListMain';
import BaseDialog from '@/components/Base/BaseDialog';
export default {
  components: {
    BaseDialog,
    LeftCatalogue,
    courseListMain
  },
  data() {
    return {
      visibleDialog: false,
      treeList: [],
      selectIds: []
    };
  },
  methods: {
    show(ids) {
      this.selectIds = ids ? ids : [];
      this.visibleDialog = true;
    },
    confirm() {
      const list = this.$refs.courseListMain.list.filter((v) => v.check);
      const checkList = list.map((v) => {
        return {
          taskContent: v.courseName,
          taskContentId: v.id
        };
      });
      const hasRepeat = checkList.some((item) => {
        return this.selectIds.includes(item.taskContentId);
      });
      if (hasRepeat) {
        this.$message.error('请勿重复选择！');
        return false;
      }
      this.visibleDialog = false;
      this.$emit('confirm', checkList.length > 0 ? checkList : []);
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    handleTreeNodeChange(val) {
      this.$refs.courseListMain.pageInfo.classifyId = val.id;
      this.$refs.courseListMain.handleSearch();
    },
    handleUpdateCatalogue() {
      this.$refs.catalogue.getTree();
    }
  }
};
</script>

<style></style>
