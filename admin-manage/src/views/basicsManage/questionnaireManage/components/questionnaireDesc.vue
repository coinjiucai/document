<template>
  <div>
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
          <div class="block-content">
            <el-form
              inline
              :model="record"
              ref="form"
              label-width="70px"
              disabled
              size="mini"
            >
              <el-form-item label="问卷名称" prop="questionnaireName">
                <el-input
                  v-model="record.questionnaireName"
                  placeholder="问卷名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="问卷类型" prop="questionnaireType">
                <el-select
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
            </el-form>
          </div>
        </div>
        <div class="block flex1 h0 flex-column">
          <div class="block-title flex-row justify-between">
            <div class="title">试卷列表</div>
            <div class="score">总分：{{ getTotalScore }}分</div>
          </div>
          <div class="block-content flex1 h0 flex-column p15">
            <el-form :inline="true" size="mini">
              <el-form-item label="题型">
                <el-select
                  clearable
                  placeholder="题型"
                  v-model="pageInfo.questionCategory"
                >
                  <el-option
                    v-for="(item, index) in questionTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题目">
                <el-input
                  clearable
                  maxlength="20"
                  v-model="pageInfo.question"
                  placeholder="题目"
                ></el-input>
              </el-form-item>
              <el-form-item label="难度">
                <el-select
                  clearable
                  v-model="pageInfo.difficulty"
                  placeholder="难度"
                >
                  <el-option
                    v-for="item in difficultyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="reset()">重置</el-button>
              </el-form-item>
            </el-form>
            <div class="flex1 h0">
              <BaseTable
                :labelList="labelList"
                :pageInfo="pageInfo"
                :list="list"
                :showSelection="false"
                :showPagination="false"
              >
                <template slot="operation">
                  <el-table-column type="expand">
                    <template slot-scope="{ row }">
                      <div class="wrap">
                        <div class="row flex-row">
                          <div class="label">题干：</div>
                          <div class="value" v-html="row.question"></div>
                        </div>
                        <div
                          class="row flex-row pl42"
                          v-html="getAnswerList(row)"
                          v-if="getAnswerList(row)"
                        ></div>
                        <div class="row flex-row">
                          <div class="flex-row mr15">
                            <div class="label">难度：</div>
                            <div class="value">
                              {{ getDifficulty(row.difficulty) }}
                            </div>
                          </div>
                          <div class="flex-row">
                            <div class="label">答案：</div>
                            <div class="value" v-html="getAnswer(row)"></div>
                          </div>
                        </div>
                        <div class="row flex-row">
                          <div class="label">解析：</div>
                          <div class="value" v-html="row.analysis"></div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </BaseTable>
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import BaseTable from '@/components/Base/BaseTable';

import {
  questionTypeList,
  difficultyList,
  rightWrong
} from '@/com/global_data';

import Common from '@/com/common';

export default {
  name: 'questionnaireDesc',
  components: {
    BaseDialog,
    BaseTable
  },
  computed: {
    getTotalScore() {
      let totalScore = 0;

      this.record.questionTopicList.forEach((el) => {
        totalScore +=
          (el?.questionScore || 0) * (el?.questionBankList?.length || 0);
      });

      return totalScore;
    },
    getAnswer() {
      return (val) => {
        let list = [];

        try {
          list = JSON.parse(val.answerJson);
        } catch (error) {}

        if (val.questionCategory == 3) {
          let index = list.findIndex((el) => el.isRight == 1);
          let tg = this.rightWrong.find((el) => el.value == index);

          return tg?.label || '-';
        } else if (val.questionCategory == 4) {
          let arr = list.map((el) => el.optionContent);
          let str = '';

          arr.forEach((el, index) => {
            str += `(${index + 1}) ${el}   `;
          });

          return str;
        } else if (val.questionCategory == 5) {
          return list?.[0]?.optionContent || '-';
        } else {
          let tg = list
            .filter((el) => el.isRight == 1)
            .map((el) => Common.decimalToBase26(el.optionCode - 1));

          return tg.length ? tg.join() : '-';
        }
      };
    },
    getAnswerList() {
      return (val) => {
        let list = [];

        try {
          list = JSON.parse(val.answerJson);
        } catch (error) {}

        if (val.questionCategory == 3) {
          return `<div style="margin-right: 10px">正确</div><div>错误</div>`;
        } else if (val.questionCategory == 4) {
          let str = '';

          list.forEach((el, index) => {
            str += `<div style="margin-right: 10px">(${index + 1})</div>`;
          });

          return str;
        } else if (val.questionCategory == 5) {
          return '';
        } else {
          let str = '';

          list.forEach((el) => {
            str += `<div style="margin-right: 10px;word-break: break-all;">${Common.decimalToBase26(
              el.optionCode - 1
            )} ${el.optionContent}</div>`;
          });

          return str;
        }
      };
    }
  },
  data() {
    return {
      questionTypeList,
      difficultyList,
      rightWrong,
      dialogTitle: '详情',
      visibleDialog: false,
      record: {
        questionnaireName: '',
        questionnaireType: '',
        questionTopicList: []
      },
      currRecord: {},
      // 表格字段列配置
      labelList: [
        { label: '题目', prop: 'question' },
        { label: '难度', prop: 'difficulty', formatter: this.getDifficulty },
        { label: '分类', prop: 'classifyLabel' },
        {
          label: '题型',
          prop: 'questionCategory',
          formatter: this.getQuestionCategory
        }
      ],
      pageInfo: {
        question: '',
        difficulty: '',
        questionCategory: ''
      },
      list: [],
      originalList: [],
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
    show(row) {
      this.currRecord = row;
      this.visibleDialog = true;
      this.$nextTick(() => {
        this.getDic();
        this.getDesc(); //
      });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.reset();
    },
    reset() {
      //   this.record = {
      //     questionnaireName: "",
      //     questionnaireType: "",
      //     questionTopicList: [],
      //   };
      this.currRecord = {};
      this.pageInfo = {
        question: '',
        difficulty: '',
        questionCategory: ''
      };
      //   this.list = [];
      //   this.originalList = [];
      this.handleSearch();
    },
    getDesc() {
      this.$api.basics.getQuestionnaireDesc(this.currRecord.id).then((res) => {
        this.record = res?.result || {};
        this.record.questionnaireType = '' + this.record.questionnaireType;

        let originalList = [];

        this.record.questionTopicList.forEach((el) => {
          originalList.push(...el.questionBankList);
        });

        this.originalList = originalList;

        this.list = JSON.parse(JSON.stringify(originalList));
      });
    },
    getDifficulty(val) {
      let tg = this.difficultyList.find((el) => el.value == val);
      return tg?.label || '-';
    },
    getQuestionCategory(val) {
      let tg = this.questionTypeList.find((el) => el.value == val);
      return tg?.label || '-';
    },
    handleSearch() {
      let list = JSON.parse(JSON.stringify(this.originalList));

      for (let key in this.pageInfo) {
        if (this.pageInfo[key]) {
          if (key === 'question') {
            list = list.filter(
              (el) => el[key].indexOf(this.pageInfo[key]) > -1
            );
          } else {
            list = list.filter((el) => el[key] == this.pageInfo[key]);
          }
        }
      }

      this.list = list;
    }
  }
};
</script>

<style lang="scss" scoped>
.block {
  .block-title {
    .title {
      font-size: 18px;
    }
    .score {
      color: #fff;
    }
    padding: 0px 0 10px 0;
    border-bottom: 1px solid #567cae;
    align-items: flex-end;
  }
  .block-content {
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

.wrap {
  padding: 20px;
}
.label {
  color: #7e9ab7;
  white-space: nowrap;
}
.value {
  color: #fff;
  word-break: break-all;
}
.mr15 {
  margin-right: 15px;
}
.pl42 {
  padding-left: 42px;
}
.row {
  /deep/ p {
    margin: 0;
  }
}
.row + .row {
  margin-top: 15px;
}
.option + .option {
  margin-left: 10px;
}
.p15 {
  padding: 15px;
}
</style>
