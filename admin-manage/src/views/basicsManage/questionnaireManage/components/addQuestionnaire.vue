<template>
  <BaseDialog
    class="full-block"
    :title="dialogTitle"
    center
    :visible.sync="visibleDialog"
    @close="handleCloseDialog"
    width="1200px"
    top="5vh"
  >
    <div class="flex-column" style="height: 62vh">
      <div class="block">
        <!-- <div class="block-title">
          <div class="title">问卷信息</div>
        </div> -->
        <div class="block-content">
          <el-form
            inline
            :model="record"
            :rules="rules"
            ref="form"
            label-width="80px"
            size="mini"
          >
            <el-form-item label="问卷名称" prop="questionnaireName">
              <el-input
                clearable
                maxlength="20"
                v-model="record.questionnaireName"
                placeholder="问卷名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="问卷类型" prop="questionnaireType">
              <el-select
                clearable
                v-model="record.questionnaireType"
                placeholder="问卷类型"
              >
                <el-option
                  v-for="item in questionnaireTypeList"
                  :key="item.itemValue"
                  :label="item.itemText"
                  :value="item.itemValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="
                  () => {
                    record.questionnaireName = '';
                    record.questionnaireType = '';
                  }
                "
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="block flex1 h0 flex-column">
        <div class="block-title flex-row justify-between">
          <div class="title">试卷设置</div>
          <div class="score">总分：{{ getTotalScore }}分</div>
        </div>
        <div class="block-content flex1 h0 flex-row">
          <div class="left h100p">
            <questionTypeList
              ref="questionTypeList"
              :activeIndex="activeIndex"
              :list="record.questionTopicList"
              @addQuestionType="addQuestionType"
              @delQuestionType="delQuestionType"
              @clickQuestionType="clickQuestionType"
            />
          </div>
          <div class="right flex1 h100p p15">
            <el-tabs
              class="full-block flex-column"
              v-model="activeName"
              v-if="record.questionTopicList.length && tabVisible"
            >
              <el-tab-pane label="试题列表" name="first">
                <testQuestionList
                  ref="testQuestionList"
                  :questionCategory="
                    record.questionTopicList[activeIndex].topicCategory
                  "
                  :add-list="
                    record.questionTopicList[activeIndex].questionBankList
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
      </div>
    </div>
    <span slot="footer">
      <el-button
        type="primary"
        :loading="saveLoading"
        @click="handleSave"
        size="small"
        >确定</el-button
      >
      <el-button type="info" @click="handleCloseDialog" size="small"
        >取消</el-button
      >
    </span>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import questionTypeList from '@/views/basicsManage/questionnaireManage/components/questionTypeList';
import testQuestionList from '@/views/basicsManage/questionnaireManage/components/testQuestionList';
import addedTestQuestionList from '@/views/basicsManage/questionnaireManage/components/addedTestQuestionList';
import FormItem from '@/components/Form/Item';

export default {
  name: 'addQuestionnaire',
  components: {
    BaseDialog,
    questionTypeList,
    testQuestionList,
    addedTestQuestionList,
    FormItem
  },
  computed: {
    getTotalScore() {
      let list = this.record.questionTopicList;

      let totalScore = 0;

      list.forEach((el) => {
        totalScore +=
          (el?.questionScore || 0) * (el?.questionBankList?.length || 0);
      });

      return totalScore;
    }
  },
  data() {
    return {
      // 弹框标题
      dialogTitle: '问卷设置',
      visibleDialog: false,
      rules: {
        questionnaireName: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' }
        ],
        questionnaireType: [
          { required: true, message: '请选择问卷类型', trigger: 'change' }
        ]
      },
      record: {
        questionnaireName: '',
        questionnaireType: '',
        questionTopicList: []
      },
      activeName: 'first',
      activeIndex: -1,
      tabVisible: false,
      saveLoading: false,
      currRecord: {},
      type: 'add',
      questionnaireTypeList: []
    };
  },
  methods: {
    getDic() {
      this.$api.System.getDictionaryContentPageList({
        dictCode: 'questionnaireType',
        pageSize: 50,
        pageNo: 1
      }).then((res) => {
        let list = res.result.records;

        this.questionnaireTypeList = list;
      });
    },
    getDesc() {
      this.$api.basics.getQuestionnaireDesc(this.currRecord.id).then((res) => {
        this.record = res?.result || {
          questionnaireName: '',
          questionnaireType: '',
          questionTopicList: []
        };
        this.record.questionnaireType = '' + this.record.questionnaireType;

        this.clickQuestionType(0);
      });
    },
    show(type, row = {}) {
      this.type = type;
      this.currRecord = row;

      this.getDic();

      if (type == 'edit') {
        this.getDesc();
      }

      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.reset();
    },
    reset() {
      this.record = {
        questionnaireName: '',
        questionnaireType: '',
        questionTopicList: []
      };
      this.activeName = 'first';
      this.activeIndex = -1;
      this.tabVisible = false;
      this.saveLoading = false;
      this.currRecord = {};
      this.type = 'add';
      this.questionnaireTypeList = [];

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let tf = this.validate();

          if (!tf) {
            return;
          }

          this.saveLoading = true;
          this.$api.basics
            .addQuestionnaire(this.record)
            .then((res) => {
              this.$message.success('保存成功');

              this.handleCloseDialog();
              this.$emit('save');
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      });
    },
    validate() {
      if (!this.record.questionTopicList.length) {
        this.$message.warning('题型不能为空');
        return false;
      }

      let tf = true;

      for (let i = 0; i < this.record.questionTopicList.length; i++) {
        let item = this.record.questionTopicList[i];
        if (!item.questionBankList || !item.questionBankList.length) {
          this.$message.warning(`题型“${item.topicName}”中的试题列表不能为空`);
          tf = false;
          break;
        }
      }

      return tf;
    },
    showTab() {
      this.tabVisible = false;

      this.$nextTick(() => {
        this.tabVisible = true;
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
    delQuestionType(row) {
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
      const ids = list.map((v) => v.id);
      if (ids.includes(val.id)) {
        this.$message.warning('该试题已存在');
      } else {
        list.push(val);
        this.$set(
          this.record.questionTopicList[this.activeIndex],
          'questionBankList',
          list
        );
        this.$message.success('添加成功');
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
    clickQuestionType(val) {
      this.activeIndex = val;
      this.showTab();
      this.activeName = 'first';
    }
  }
};
</script>

<style lang="scss" scoped>
.block {
  .block-title {
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .score {
      color: #fff;
    }
    padding: 0px 0 15px 0;
    border-bottom: 1px solid #567cae;
  }
  .block-content {
    .left {
      flex: 0 0 224px;
      border-right: 1px solid #567cae;
      padding: 16px 20px 16px 0;
    }
    .right {
      /deep/ .el-tabs__content {
        flex: 1;
        height: 0;
      }
      /deep/ .el-tab-pane {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.block:first-child {
  .block-content {
    padding: 10px 0 0;
  }
}
.block:last-child {
  border-bottom: 1px solid #567cae;
}
.p15 {
  padding: 15px;
}
</style>
