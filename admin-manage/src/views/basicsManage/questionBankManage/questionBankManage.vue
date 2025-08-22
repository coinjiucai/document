<!--
  @Name 题库管理
  @Description
  @author 表单设计器0.1.5
  @date 2024-12-6
-->
<template>
  <div 
    class="component-QuestionBankManage theme-background-base full-block flex-row"
    v-loading="listLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <div class="left mr5 theme-background-middle h100p">
      <LeftCatalogue
          ref="catalogue"
          :tree-data.sync="treeData"
          :default-props="{label:'label', children:'childrenList'}"
          title="题目分类"
          :getUrl="['basics','taclassifyList']"
          :deleteUrl="['basics','taclassifyDelete']"
          @add="handleAddCatalogue"
          @edit="handleEditCatalogue"
          @current-change="handleTreeNodeChange">
      </LeftCatalogue>
    </div>
    <div class="flex1 h0 h100p flex-layout theme-background-middle pa10 w0">
      <div class="flex-none pb10 text-align-left">
        <el-button v-bind="{'type':'primary','icon':'el-icon-plus'}" @click="handleAddItem">新增</el-button>
        <el-button v-bind="{'type':'danger','icon':'el-icon-delete'}" :loading="deleteBtnLoading"
                   @click="handleDeleteItems">删除
        </el-button>
      </div>
      <el-divider></el-divider>
      <div class="flex-none text-align-left">
        <el-form ref="form" inline :model="pageInfo" size="small">
          <el-form-item label="题目" prop="question">
            <el-input
              clearable
              v-model="pageInfo['question']" 
              v-bind="{'size':'small'}" 
              class="w230"
              placeholder="题目"
              maxlength="20"
              @change="handleSearch"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="题型" prop="questionCategory">
            <el-select clearable v-model="pageInfo['questionCategory']" class="w230" placeholder="题型">
              <el-option v-for="(item,index) in questionTypeList" :key="index" v-bind="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度" prop="difficulty">
            <el-select clearable v-model="pageInfo['difficulty']" class="w230" placeholder="难度">
              <el-option v-for="(item,index) in difficultyList" :key="index" v-bind="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-bind="{'size':'small','type':'primary'}" @click="handleSearch">查询</el-button>
            <el-button v-bind="{'size':'small','type':'info'}" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="flex-auto theme-background-middle">
        <BaseTable
            ref="BaseTable"
            :list="dataList"
            height="100%"
            show-index
            stripe
            :label-list="labelList"
            :page-info="pageInfo"
            :total="pageInfo['total']"
            @page-change="getList">
          <template #operation>
            <el-table-column label="操作">
              <template #default="{row}">
                <el-button type="text" icon="el-icon-edit" @click="handleEditItem(row)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column width="50" label="详情" type="expand">
              <template #default="{row}">
                <div class="wrap">
                  <div class="row flex-row">
                    <div class="label">题干：</div>
                    <div class="value" v-html="row.question"></div>
                  </div>
                  <div 
                    class="row flex-row pl42"
                    v-html="getAnswerList(row)" 
                    v-if="getAnswerList(row)"
                  >
                  </div>
                  <div class="row flex-row">
                    <div class="flex-row mr15">
                      <div class="label">难度：</div>
                      <div class="value">{{ getDifficulty(row.difficulty)  }}</div>
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
    <questionCatalogueDetail 
      ref="treeDetail" 
      :tree-list="treeData" 
      @save="handleUpdateCatalogue"
    ></questionCatalogueDetail>
    <questionDetail 
      ref="detail" 
      :treeList="treeData" 
      :currentClassify="pageInfo['classifyId']"
      @save="handleSearch"
    ></questionDetail>
  </div>
</template>

<script>
import BaseTable from "@/components/Base/BaseTable";
import listBase from "@/components/_extends/listBase";
import LeftCatalogue from "@/components/Project/LeftCatalogue.vue";
import questionCatalogueDetail from './components/questionCatalogueDetail.vue';
import questionDetail from '@/views/basicsManage/questionBankManage/components/questionDetail.vue';

import { difficultyList, questionTypeList, rightWrong } from '@/com/global_data';
import Common from '@/com/common';

export default {
  name: "QuestionBankManage",
  extends: listBase,
  components: {
    questionDetail,
    BaseTable,
    LeftCatalogue,
    questionCatalogueDetail
  },
  data() {
    return {
      difficultyList,
      questionTypeList,
      rightWrong,
      dataList: [],
      pageInfo: null,
      treeData: [],
      batchDeleteUrl: "/mlf-counsel-service/taquestionbank/deleteBatch",
      labelList: [
        {
          "label": "题目",
          "prop": "question"
        },
        {
          "label": "难度",
          "prop": "difficulty",
          formatter:(val)=>this.difficultyList.find((item)=>item.value===val)?.label || '-'
        },
        {
          "label": "分类",
          "prop": "classifyLabel",
        },
        {
          "label": "题型",
          "prop": "questionCategory",
          formatter:(val)=>this.questionTypeList.find((item)=>item.value===val)?.label || '-'
        },
        {
          "label": "创建人",
          "prop": "createBy"
        }
      ],
      getListUrl: "/mlf-counsel-service/taquestionbank/page",
    };
  },
  computed: {
    getAnswer() {
      return (val) => {
        let list = [];

        try {
          list = JSON.parse(val.answerJson);
        } catch(error) {}

        if (val.questionCategory == 3) {
          let index = list.findIndex(el => el.isRight == 1);
          let tg = this.rightWrong.find(el => el.value == index);

          return tg?.label || '-';
        } else if (val.questionCategory == 4) {
          let arr = list.map(el => el.optionContent);
          let str = '';
          
          arr.forEach((el, index) => {
            str += `(${index + 1}) ${el}   `;
          });
          
          return str;
        } else if (val.questionCategory == 5) {
          return list?.[0]?.optionContent || '-';
        } else {
          let tg = list.filter(el => el.isRight == 1).map(el => Common.decimalToBase26(el.optionCode - 1));

          return tg.length ? tg.join() : '-';
        }
      }
    },
    getAnswerList() {
      return (val) => {
        let list = [];

        try {
          list = JSON.parse(val.answerJson);
        } catch(error) {}

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

          list.forEach(el => {
            str += `<div style="margin-right: 10px;word-break: break-all;">${Common.decimalToBase26(el.optionCode - 1)} ${el.optionContent}</div>`
          });

          return str;
        }
      }
    },
  },
  methods: {
    reset() {
      this.pageInfo.question = '';
      this.pageInfo.questionCategory = '';
      this.pageInfo.difficulty = '';
      this.handleSearch();
    },
    getDifficulty(val) {
      let tg = this.difficultyList.find(el => el.value == val);
      return tg?.label || '-';
    },
    // overwrite
    getDefaultPageInfo() {
      return {
        "pageSize": 10,
        "pageNo": 1,
        "total": null,
        "classifyId": "",
        "question": null,
        "questionCategory": null,
        "difficulty": null
      };
    },
    handleAddCatalogue(){
      this.$refs.treeDetail.showEdit(null)
    },
    handleEditCatalogue(list,data){
      this.$refs.treeDetail.showEdit(data);
    },
    handleTreeNodeChange(val) {
      this.pageInfo["classifyId"] = val['id'];
      this.handleSearch();
    },
    handleUpdateCatalogue(){
      this.$popTip.success("保存成功！");
      this.$refs.catalogue.getTree();
    }
  }
};
</script>

<style lang="scss" scoped>
.component-QuestionBankManage {
  .left {
    flex: 0 0 268px;
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
}
</style>
