<template>
  <div
    class="teacher-prepare"
    v-loading="padingLoading"
    :element-loading-text="loadingText"
  >
    <div class="teacher-one">
      <!-- <el-button @click="history()">返回</el-button> -->
      <el-button @click="clearContent">清空</el-button>

      <el-button @click="history">历史记录</el-button>
    </div>
    <div class="teacher-two">
      <TinyMceEditor
        v-model="content"
        ref="cursorContent"
        height="100%"
      ></TinyMceEditor>
      <div class="buttons">
        <el-button @click="coursewareFormat">教案格式处理</el-button>
        <el-button @click="coursewarePolish">智能化润色</el-button>
        <el-button @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import detailBase from '@/components/_extends/detailBase';
import BaseQuillEditor from '@/views/basicsManage/questionBankManage/components/BaseQuillEditor.vue';
import TinyMceEditor from '@/components/TinyMceEditor.vue';
import axios from 'axios';

export default {
  name: 'TeacherPrepare',
  extends: detailBase,
  components: {
    BaseQuillEditor,
    TinyMceEditor
  },
  data() {
    return {
      padingLoading: false,
      loadingText: '智能化润色中，请稍等...',
      content: ''
    };
  },
  created() {
    const query = this.$route.query;
    if (query.id) {
      this.getCoursewareById(query.id);
    }
  },
  methods: {
    clearContent() {
      this.content = '';
    },
    history() {
      this.$router.push({
        path: '/teacherPrepare/history'
      });
    },
    coursewareFormat() {
      if (this.content.length > 15000) {
        this.$message.error('教案内容不能超过15000字');
        return false;
      }
      //   const title = this.$refs.cursorContent.getFirstParagraph();
      const title = this.getFirstSentence();
      this.loadingText = '教案格式化处理中，请稍等...';
      try {
        this.padingLoading = true;
        this.$api.teacherPrepare
          .coursewareFormat({
            coursewareTitle: title,
            coursewareContent: this.content
          })
          .then((res) => {
            const result = res.result;

            this.content = result.coursewareContent;
            this.$message.success('格式化成功');
          })
          .finally(() => {
            this.padingLoading = false;
          });
      } catch (error) {
        this.padingLoading = false;
        throw new Error(error);
      }
    },
    getFirstSentence() {
      const content = this.content; // 获取编辑器全部内容
      // 去除HTML标签
      const textOnly = content.replace(/<[^>]*>/g, '');
      // 获取第一句（以句号、问号或感叹号分割）
      const firstSentence =
        textOnly.match(/[^。！？.!?]+[。！？.!?]/)?.[0] ||
        textOnly.split(/\s+/)[0];
      return firstSentence.trim();
    },
    // 保存
    save() {
      const query = this.$route.query;
      const title = this.getFirstSentence();
      if (!title) {
        this.$message.error('请输入课件标题');
        return;
      }
      let params = {
        coursewareTitle: title,
        coursewareContent: this.content
      };
      if (this.content.length > 15000) {
        this.$message.error('教案内容不能超过15000字');
        return false;
      }
      if (query.id) {
        params['id'] = query.id;
      }
      this.loadingText = '教案保存中，请稍等...';
      try {
        this.padingLoading = true;
        this.$api.teacherPrepare
          .coursewareSave(params)
          .then((res) => {
            this.$message.success('课件保存成功！');
          })
          .finally(() => {
            this.padingLoading = false;
          });
      } catch (error) {
        this.padingLoading = false;
      }
    },

    // 智能化润色
    coursewarePolish() {
      if (this.content.length > 15000) {
        this.$message.error('教案内容不能超过15000字');
        return false;
      }
      const baseUrl = window.VUE_APP_CHART;
      const requestUrl = `${baseUrl}/v1/teach/polish`;
      this.loadingText = '智能化润色中，请稍等...';
      try {
        this.padingLoading = true;
        axios
          .post(requestUrl, {
            text: this.content
          })
          .then((response) => {
            console.log(response.data, 'fdsfsdf');
            if (response.data.data && response.data.data.text) {
              const text = response.data.data.text;
              this.content = text;
              this.$message.success('智能化润色成功');
            }
          })
          .finally(() => {
            this.padingLoading = false;
          });
      } catch (error) {
        this.padingLoading = false;
        throw new Error(error);
      }
    },
    // 后台润色
    afterPolish(content) {
      const title = this.$refs.cursorContent.getFirstParagraph();
      this.$api.teacherPrepare
        .coursewarePolish({
          coursewareTitle: title,
          coursewareContent: content
        })
        .then((res) => {
          const result = res.result;
          this.content = result.coursewareContent;
          this.$message.success('智能化润色成功');
        });
    },
    // 获取课件对象
    getCoursewareById(id) {
      this.$api.teacherPrepare
        .getCoursewareById({
          id
        })
        .then((res) => {
          this.content = res.result.coursewareContent;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-prepare {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .teacher-one {
    padding: 0 10px;
  }
  .teacher-two {
    width: 100%;
    height: calc(100vh - 247px);
    padding: 10px;
  }
  .buttons {
    position: absolute;
    width: 100%;
    left: 0px;
    bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
