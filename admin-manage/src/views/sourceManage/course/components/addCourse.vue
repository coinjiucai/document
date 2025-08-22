<template>
  <div class="component-addCourse full-block" v-loading="loading">
    <el-tabs
      class="full-block flex-column"
      v-model="activeName"
      @tab-click="changeTab"
    >
      <el-tab-pane label="课程信息" name="courseInfo">
        <courseInfo
          ref="courseInfo"
          v-on="$listeners"
          :treeList="treeList"
          :classifyId="classifyId"
          @setRecord="setRecord"
        />
      </el-tab-pane>
      <el-tab-pane label="课程章节" name="courseChapter">
        <courseChapter
          ref="courseChapter"
          :record="record"
          :courseId="courseId"
          v-if="activeName == 'courseChapter'"
        />
      </el-tab-pane>
      <el-tab-pane label="课程设置" name="courseSet">
        <courseSet
          ref="courseSet"
          v-on="$listeners"
          :record="record"
          @setRecord="setRecord"
          v-if="activeName == 'courseSet'"
        />
      </el-tab-pane>
      <el-tab-pane label="课程习题" name="courseExercise">
        <courseExercise
          ref="courseExercise"
          :courseId="courseId"
          v-if="activeName == 'courseExercise'"
        />
      </el-tab-pane>
    </el-tabs>
    <el-button class="btn" type="primary" @click="back">返回</el-button>
  </div>
</template>

<script>
import courseInfo from '@/views/sourceManage/course/components/courseInfo';
import courseChapter from '@/views/sourceManage/course/components/courseChapter';
import courseSet from '@/views/sourceManage/course/components/courseSet';
import courseExercise from '@/views/sourceManage/course/components/courseExercise';

export default {
  name: 'addCourse',
  components: {
    courseInfo,
    courseChapter,
    courseSet,
    courseExercise
  },
  props: {
    courseId: {
      type: String,
      default: ''
    },
    classifyId: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.getTreeList();
  },
  data() {
    return {
      activeName: 'courseInfo',
      record: {},
      treeList: [],
      loading: false
    };
  },
  methods: {
    getTreeList() {
      this.$api.source.getXlkcflList().then((res) => {
        this.treeList = res?.result || [];

        if (this.courseId) {
          this.getDesc();
        }
      });
    },
    getDesc() {
      this.loading = true;

      this.$api.source
        .getXlkcDesc(this.courseId)
        .then((res) => {
          this.record = res?.result || {};

          this.$refs.courseInfo.form = JSON.parse(JSON.stringify(this.record));
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeTab() {
      if (!Object.keys(this.record).length) {
        this.$message.warning('请先保存课程信息');
        this.$nextTick(() => {
          this.activeName = 'courseInfo';
        });
      }
    },
    back() {
      this.$emit('back');
    },
    setRecord(val) {
      this.record = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-addCourse {
  position: relative;
  margin-left: 16px;
  padding: 0 30px;
  /deep/ .el-tabs__content {
    flex: 1;
    height: 0;
  }
  /deep/ .el-tab-pane {
    width: 100%;
    height: 100%;
  }
  .btn {
    position: absolute;
    top: 0;
    right: 20px;
  }
}
</style>
