<template>
  <div class="component-courseListMain full-block flex-column">
    <el-form class="btn-wrap" v-if="!readOnly">
      <el-button
        type="primary"
        style="width: 90px"
        @click="
          () => {
            checkAll = !checkAll;
            changeCheckAll();
          }
        "
        >{{ checkAll ? '取消全选' : '全选' }}</el-button
      >
      <el-button type="primary" @click="openAddCourse">新建课程</el-button>
      <el-button type="primary" @click="changeSort">更换分类</el-button>
      <el-button type="primary" @click="handleDelMul">删除课程</el-button>
    </el-form>
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-checkbox v-model="checkAll" @change="changeCheckAll"></el-checkbox>
      </el-form-item> -->
      <el-form-item label="课程名称">
        <el-input
          clearable
          maxlength="50"
          v-model="pageInfo.courseName"
          placeholder="课程名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable v-model="pageInfo.courseState" placeholder="状态">
          <el-option
            v-for="(item, index) in courseStatus"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="course-warp flex1 h0" v-loading="loading">
      <courseList
        ref="courseList"
        :pageInfo="pageInfo"
        :total="total"
        :list="list"
        v-on="$listeners"
        :readOnly="readOnly"
        :selectLimit="$attrs.selectLimit"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @handleDel="handleDel"
      />
    </div>

    <changeSort ref="changeSort" v-bind="$attrs" @save="handleSearch" />
  </div>
</template>

<script>
import courseList from '@/views/sourceManage/course/components/courseList';
import changeSort from '@/views/sourceManage/course/components/changeSort';

import { courseStatus } from '@/com/global_data';

export default {
  name: 'courseListMain',
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    selectIds: {
      type: Array,
      default: () => []
    }
  },
  components: {
    courseList,
    changeSort
  },
  data() {
    return {
      courseStatus,
      pageInfo: {
        classifyId: '',
        courseName: '',
        courseState: '',
        pageNo: 1,
        pageSize: 10
      },
      list: [],
      total: 0,
      checkAll: false,
      loading: false
    };
  },
  methods: {
    changeSort() {
      let checkList = this.list.filter((el) => el.check);

      if (!checkList.length) {
        this.$message.warning('请勾选数据');
        return;
      }

      this.$refs.changeSort.show(checkList);
    },
    getList() {
      this.checkAll = false;

      this.loading = true;

      this.$api.source
        .getXlkcList(this.pageInfo)
        .then((res) => {
          let list = res?.result?.records || [];
          list.forEach((el) => {
            el.check =
              this.selectIds && this.selectIds.includes(el.id) ? true : false;
          });

          this.list = list;

          this.total = res?.result?.total || 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.pageInfo.pageNo = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.handleSearch();
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val;
      this.getList();
    },
    changeCheckAll() {
      console.log('----', this.checkAll);
      let list = this.list;

      if (this.checkAll) {
        list.forEach((el) => {
          el.check = true;
        });
      } else {
        list.forEach((el) => {
          el.check = false;
        });
      }

      this.list = list;
    },
    handleDelMul() {
      let checkList = this.list.filter((el) => el.check);

      if (!checkList.length) {
        this.$message.warning('请勾选数据');
        return;
      }

      this.$confirm('确认删除？', '提示', { type: 'warning' }).then(() => {
        let ids = checkList.map((el) => el.id).join();

        this.loading = true;

        this.$api.source
          .delMulXlkc({ ids })
          .then((res) => {
            this.$message.success('删除成功');
            this.handleSearch();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    openAddCourse() {
      this.$emit('openAddCourse');
    },
    handleDel(ids) {
      this.$confirm('确认删除？', '提示', { type: 'warning' }).then(() => {
        this.loading = true;

        this.$api.source
          .delMulXlkc({ ids })
          .then((res) => {
            this.$message.success('删除成功');
            this.handleSearch();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.component-courseListMain {
  .btn-wrap {
    margin-bottom: 22px;
  }
  .course-warp {
    padding: 0 20px 20px 0;
  }
}
</style>
