<template>
  <div class="component-courseInfo full-block">
    <el-form label-width="80px" ref="form" :rules="rules" :model="form">
      <el-form-item label="课程名称" prop="courseName">
        <el-input
          class="w258"
          clearable
          maxlength="50"
          v-model="form.courseName"
          placeholder="课程名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="课程分类" prop="classifyId">
        <treeSelect
          class="w258"
          node-key="id"
          placeholder="课程分类"
          :tree-props="{ label: 'label', children: 'childrenList' }"
          :tree-list="treeList"
          v-model="form.classifyId"
        >
        </treeSelect>
      </el-form-item>
      <el-form-item label="课程难度" prop="courseLevel">
        <el-select
          class="w258"
          clearable
          v-model="form.courseLevel"
          placeholder="课程难度"
        >
          <el-option
            v-for="(item, index) in courseDifficulty"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否热门" prop="isHot">
        <el-switch v-model="form.isHot" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="LOGO">
        <ImageUpload v-model="form.logo" @change="changeUpload"> </ImageUpload>
      </el-form-item>
      <el-form-item label="课程介绍">
        <el-input
          clearable
          type="textarea"
          :rows="4"
          maxlength="400"
          v-model="form.introduction"
          placeholder="课程介绍"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="flex-row justify-end">
          <el-button type="primary" :loading="loading" @click="save"
            >保存</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImageUpload from '@/components/FileUpload/ImageUpload';
import treeSelect from '@/components/Tree/TreeSelect';

import { courseDifficulty } from '@/com/global_data';

export default {
  name: 'courseInfo',
  components: { ImageUpload, treeSelect },
  props: {
    treeList: {
      type: Array,
      default: () => ({})
    },
    classifyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      courseDifficulty,
      rules: {
        courseName: {
          required: true,
          message: '请输入课程名称',
          trigger: 'blur'
        },
        classifyId: {
          required: true,
          message: '请选择课程分类',
          trigger: 'change'
        },
        courseLevel: {
          required: true,
          message: '请选择课程难度',
          trigger: 'change'
        }
      },
      form: {
        courseName: '',
        classifyId: '',
        courseLevel: '',
        logo: '',
        isHot: 0,
        introduction: ''
      },
      loading: false
    };
  },
  mounted() {
    const st = setTimeout(() => {
      if (this.classifyId) {
        this.form.classifyId = this.classifyId;
      }
      clearTimeout(st);
    }, 500);
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.source
            .addXlkc(this.form)
            .then((res) => {
              this.$message.success('保存成功');
              this.$emit('setId', res?.result?.id || '');
              this.$emit('setRecord', res?.result || {});
              this.$emit('refresh');
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    changeUpload(res) {
      this.form.logo = res.message;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-courseInfo {
  padding: 24px 24px 24px 0;
  .w258 {
    display: block;
    width: 258px;
  }
}
</style>
