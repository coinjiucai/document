<template>
  <div class="component-testQuestionList full-block flex-layout">
    <el-form :inline="true" size="mini">
      <el-form-item label="题型">
        <el-select
          disabled
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
          v-model="pageInfo.question"
          placeholder="题目"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="难度">
        <el-select v-model="pageInfo.difficulty" placeholder="难度" clearable>
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
      </el-form-item>
    </el-form>
    <div class="flex1 h0">
      <BaseTable
        :labelList="labelList"
        :pageInfo="pageInfo"
        :list="dataList"
        :listLoading="listLoading"
        :showSelection="false"
      >
        <template slot="first">
          <el-table-column width="30">
            <template slot-scope="{ row }">
              <img
                class="pointer"
                src="../../../../assets/images/icon_add.png"
                alt=""
                width="20"
                height="20"
                v-show="isAdd(row)"
                @click="addQuestion(row)"
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
  </div>
</template>

<script>
import BaseTable from '@/components/Base/BaseTable';

import listBase from '@/components/_extends/listBase';

import {
  questionTypeList,
  difficultyList,
  rightWrong
} from '@/com/global_data';

import Common from '@/com/common';

export default {
  name: 'testQuestionList',
  extends: listBase,
  components: {
    BaseTable
  },
  props: {
    questionCategory: {
      type: [Number, String],
      default: ''
    },
    addList: {
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
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        question: '',
        difficulty: '',
        questionCategory: ''
      },
      getListUrl: '/mlf-counsel-service/taquestionbank/page'
    };
  },
  mounted() {
    this.pageInfo.questionCategory = this.questionCategory;
    this.getList();
  },
  methods: {
    isAdd(row) {
      const id = row.id;
      const item = this.addList.find((v) => v.id == id);
      return item ? false : true;
    },
    getDefaultPageInfo() {
      return {
        pageNo: 1,
        pageSize: 10,
        question: '',
        difficulty: '',
        questionCategory: ''
      };
    },
    getDifficulty(val) {
      let tg = this.difficultyList.find((el) => el.value == val);
      return tg?.label || '-';
    },
    getQuestionCategory(val) {
      let tg = this.questionTypeList.find((el) => el.value == val);
      return tg?.label || '-';
    },
    addQuestion(row) {
      this.$emit('addQuestion', row);
    }
  }
};
</script>

<style lang="scss" scoped>
.component-testQuestionList {
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
