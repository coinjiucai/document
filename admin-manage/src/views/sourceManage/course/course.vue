<template>
  <div class="component-course full-block">
    <courseMain
      ref="courseMain"
      v-show="!showAddCourse"
      @openAddCourse="openAddCourse"
    />
    <addCourse
      ref="addCourse"
      :courseId="courseId"
      :classifyId="classifyId"
      @back="showAddCourse = false"
      @refresh="refresh"
      @setId="setId"
      v-if="showAddCourse"
    />
  </div>
</template>

<script>
import courseMain from '@/views/sourceManage/course/components/courseMain';
import addCourse from '@/views/sourceManage/course/components/addCourse';

export default {
  name: 'course',
  components: {
    courseMain,
    addCourse
  },
  data() {
    return {
      showAddCourse: false,
      courseId: '',
      classifyId: ''
    };
  },
  methods: {
    openAddCourse(courseId = '') {
      this.courseId = courseId;
      const courseMain = this.$refs.courseMain;
      this.classifyId = courseMain.classifyId; // 获取分类id;
      this.$nextTick(() => {
        this.showAddCourse = true;
      });
    },
    refresh() {
      this.$refs.courseMain.$refs.courseListMain.getList();
    },
    setId(id) {
      this.courseId = id;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-course {
}
</style>
