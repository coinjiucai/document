<template>
  <div class="component-courseMain flex-row full-block">
    <div class="left h100p">
      <LeftCatalogue
        ref="catalogue"
        title="课程分类"
        :default-props="{
          label: 'label',
          value: 'id',
          children: 'childrenList'
        }"
        :tree-data.sync="treeList"
        :getUrl="['source', 'getXlkcflList']"
        :deleteUrl="['source', 'delXlkcfl']"
        @add="handleAddCatalogue"
        @edit="handleEditCatalogue"
        @current-change="handleTreeNodeChange"
      >
      </LeftCatalogue>
    </div>
    <div class="right flex1 h100p w0">
      <courseListMain
        ref="courseListMain"
        :treeList="treeList"
        v-on="$listeners"
      />
    </div>

    <addCatalogue
      ref="addCatalogue"
      :treeList="treeList"
      @save="handleUpdateCatalogue"
    />
  </div>
</template>

<script>
import LeftCatalogue from '@/components/Project/LeftCatalogue';
import addCatalogue from '@/views/sourceManage/course/components/addCatalogue';
import courseListMain from '@/views/sourceManage/course/components/courseListMain';

export default {
  name: 'courseMain',
  components: {
    LeftCatalogue,
    addCatalogue,
    courseListMain
  },
  data() {
    return {
      treeList: [],
      classifyId: ''
    };
  },
  methods: {
    handleAddCatalogue() {
      this.$refs.addCatalogue.showEdit(null);
    },
    handleEditCatalogue(list, data) {
      this.$refs.addCatalogue.showEdit(data);
    },
    handleTreeNodeChange(val) {
      this.classifyId = val.id;
      this.$refs.courseListMain.pageInfo.classifyId = val.id;
      this.$refs.courseListMain.handleSearch();
    },
    handleUpdateCatalogue() {
      this.$refs.catalogue.getTree();
    }
  }
};
</script>

<style lang="scss" scoped>
.component-courseMain {
  .left {
    flex: 0 0 268px;
    width: 268px;
    margin-right: 5px;
  }
  .right {
  }
}
</style>
