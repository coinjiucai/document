<template>
  <div class="component-addedTestQuestionList full-block">
    <BaseTable
      :labelList="labelList"
      :pageInfo="pageInfo"
      :list="list"
      :showSelection="false"
      :showPagination="false"
      :showIndex="true"
    >
      <template slot="first">
        <el-table-column width="30">
          <template slot-scope="{ row }">
            <img
              class="pointer"
              src="../../../../assets/images/icon_del.png"
              alt=""
              width="20"
              height="20"
              @click="delQuestion(row)"
            />
          </template>
        </el-table-column>
      </template>
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
                  <div class="value">{{ getDifficulty(row.difficulty) }}</div>
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
</template>

<script>
import BaseTable from '@/components/Base/BaseTable';
import {
  questionTypeList,
  difficultyList,
  rightWrong
} from '@/com/global_data';

import Common from '@/com/common';

export default {
  name: 'addedTestQuestionList',
  components: { BaseTable },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
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
      pageInfo: {}
    };
  },
  methods: {
    getDifficulty(val) {
      let tg = this.difficultyList.find((el) => el.value == val);
      return tg?.label || '-';
    },
    delQuestion(row) {
      this.$emit('delQuestion', row);
    },
    getQuestionCategory(val) {
      let tg = this.questionTypeList.find((el) => el.value == val);
      return tg?.label || '-';
    }
  }
};
</script>

<style lang="scss" scoped>
.component-addedTestQuestionList {
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
}
</style>
