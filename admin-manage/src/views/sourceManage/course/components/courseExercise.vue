<template>
  <div class="component-courseExercise full-block flex-column">
    <div
      class="btn-wrap flex-row space mb15"
      style="padding: 10px; justify-content: space-between"
    >
      <div class="title-box">
        <div class="title">
          <div
            style="cursor: pointer"
            v-if="!editTitel"
            @click="editTitel = true"
          >
            {{ record.questionnaireName }}
          </div>
          <div v-else style="display: flex; align-items: center">
            <el-input
              v-model="record.questionnaireName"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
            <i
              class="el-icon-circle-close"
              style="margin-left: 5px; cursor: pointer"
              @click="editTitel = false"
            ></i>
          </div>
        </div>
        <div class="amount">总分:{{ amountScore }}</div>
      </div>
      <div>
        <el-button
          type="primary"
          :disabled="!record.questionTopicList.length"
          @click="openPreview"
          >预览</el-button
        >
        <el-button type="primary" :loading="loading" @click="save"
          >保存</el-button
        >
      </div>
    </div>
    <div class="bottom flex1 h0 flex-row">
      <div class="left h100p mr15">
        <questionTypeList
          ref="questionTypeList"
          :list="record.questionTopicList"
          :activeIndex="activeIndex"
          @addQuestionType="addQuestionType"
          @delQuestionType="delQuestionType"
          @clickQuestionType="clickQuestionType"
        />
      </div>
      <div class="right flex1 w0 h100p">
        <el-tabs
          class="full-block flex-column"
          v-if="record.questionTopicList.length && tabVisible"
          v-model="activeName"
        >
          <el-tab-pane label="试题列表" name="first">
            <testQuestionList
              ref="testQuestionList"
              :questionBankList="
                record.questionTopicList[activeIndex].questionBankList
              "
              :questionCategory="
                record.questionTopicList[activeIndex].topicCategory
              "
              @addQuestion="addQuestion"
            />
          </el-tab-pane>
          <el-tab-pane label="已添加试题" name="second">
            <addedTestQuestionList
              ref="addedTestQuestionList"
              :list="record.questionTopicList[activeIndex].questionBankList"
              @delQuestion="delQuestion"
            />
          </el-tab-pane>
        </el-tabs>
        <div class="full-block flex-center" v-else>
          <el-empty></el-empty>
        </div>
      </div>
    </div>

    <previewDialog ref="previewDialog" :list="record.questionTopicList" />
  </div>
</template>

<script>
import questionTypeList from '@/views/sourceManage/course/components/questionTypeList';
import testQuestionList from '@/views/sourceManage/course/components/testQuestionList';
import addedTestQuestionList from '@/views/sourceManage/course/components/addedTestQuestionList';
import previewDialog from '@/views/sourceManage/course/components/previewDialog';

export default {
  name: 'courseExercise',
  components: {
    questionTypeList,
    testQuestionList,
    addedTestQuestionList,
    previewDialog
  },
  props: {
    courseId: {
      type: String,
      default: ''
    }
  },
  computed: {
    amountScore() {
      let score = 0;
      this.record.questionTopicList.forEach((el) => {
        const questionScore = el.questionScore;
        el.questionBankList.forEach((item) => {
          score += questionScore;
        });
      });
      return score;
    }
  },
  data() {
    return {
      activeName: 'first',
      activeIndex: -1,
      record: {
        questionTopicList: []
      },
      tabVisible: false,
      loading: false,
      editTitel: false
    };
  },
  mounted() {
    this.getDesc();
  },
  methods: {
    getDesc() {
      if (!this.courseId) {
        return;
      }

      this.$api.basics.getQuestionnaireDesc(this.courseId).then((res) => {
        this.record = res?.result || { questionTopicList: [] };

        if (this.record.questionTopicList.length) {
          this.clickQuestionType(0);
        }
      });
    },
    addQuestionType(val) {
      let list = this.record.questionTopicList;

      list.push(val);

      this.$set(this.record, 'questionTopicList', list);

      if (this.activeIndex == -1) {
        this.clickQuestionType(0);
      }
    },
    clickQuestionType(val) {
      this.activeIndex = val;
      this.showTab();
      this.activeName = 'first';
    },
    showTab() {
      this.tabVisible = false;

      this.$nextTick(() => {
        this.tabVisible = true;
      });
    },
    delQuestionType() {
      let list = this.record.questionTopicList;

      list.splice(this.activeIndex, 1);

      this.$set(this.record, 'questionTopicList', list);

      if (list.length) {
        this.clickQuestionType(0);
      } else {
        this.clickQuestionType(-1);
      }
    },
    addQuestion(val) {
      let list =
        this.record.questionTopicList[this.activeIndex].questionBankList;
      const item = list.find((v) => v.id == val.id);
      if (!item) {
        list.push(val);

        this.$set(
          this.record.questionTopicList[this.activeIndex],
          'questionBankList',
          list
        );
      } else {
        this.$message.warning('该试题已存在');
      }
    },
    delQuestion(val) {
      let list =
        this.record.questionTopicList[this.activeIndex].questionBankList;

      let index = list.findIndex((el) => el.id == val.id);

      list.splice(index, 1);

      this.$set(
        this.record.questionTopicList[this.activeIndex],
        'questionBankList',
        list
      );
    },
    save() {
      this.loading = true;
      this.$api.source
        .addKcQuestion(this.record)
        .then((res) => {
          this.$message.success('保存成功');
          this.getDesc();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openPreview() {
      this.$refs.previewDialog.show();
    }
  }
};
</script>

<style lang="scss" scoped>
.component-courseExercise {
  border: 1px solid #fff;
  .mb15 {
    margin-bottom: 15px;
  }
  .mr15 {
    margin-right: 15px;
  }
  .btn-wrap {
    border-bottom: 1px solid #fff;
  }
  .bottom {
    .left {
      flex: 0 0 324px;
      width: 324px;
    }
  }
  .title-box {
    display: flex;
    align-items: center;

    .amount {
      margin-left: 10px;
    }
  }
}
</style>
