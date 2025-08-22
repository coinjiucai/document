<template>
  <div
    class="component-questionnaireManage theme-background-middle full-block pa10"
  >
    <ListPage
      ref="listPage"
      :buttonList="['add', 'delete']"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :listApi="['basics', 'getQuestionnaireList']"
      :deleteApi="['basics', 'delMulQuestionnaire']"
      :editApi="['basics', 'addQuestionnaire']"
      @add="openAdd('add')"
      :addApi="['basics', 'addQuestionnaire']"
    >
      <template slot="action_parent" slot-scope="{ row }">
        <el-link
          class="mr15"
          :underline="false"
          type="primary"
          @click="openAdd('edit', row)"
          >编辑</el-link
        >
        <el-link :underline="false" type="primary" @click="openDesc(row)"
          >查看详情</el-link
        >
      </template>
    </ListPage>

    <addQuestionnaire ref="addQuestionnaire" @save="handleSearch" />
    <questionnaireDesc ref="questionnaireDesc" />
    <issuedDialog ref="issuedDialog" />
  </div>
</template>

<script>
import ListPage from '@/components/ListPage';
import addQuestionnaire from '@/views/basicsManage/questionnaireManage/components/addQuestionnaire';
import questionnaireDesc from '@/views/basicsManage/questionnaireManage/components/questionnaireDesc';
import issuedDialog from '@/views/basicsManage/questionnaireManage/components/issuedDialog';

export default {
  name: 'questionnaireManage',
  components: {
    ListPage,
    addQuestionnaire,
    questionnaireDesc,
    issuedDialog
  },
  data() {
    return {
      // 搜索参数
      params: {
        createBy: '',
        startTime: '',
        endTime: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '用户名',
          compType: 'input',
          width: 160,
          placeholder: '用户名',
          prop: 'createBy'
        },
        {
          label: '创建时间',
          compType: 'rangeTime',
          width: 250,
          placeholder: '创建时间',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          propEnd: 'endTime',
          propStart: 'startTime',
          valueFormat: 'yyyy-MM-dd'
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '问卷名称', prop: 'questionnaireName' },
        {
          label: '问卷类型',
          prop: 'questionnaireType',
          formatter: this.getQSortName
        },
        { label: '创建人', prop: 'createBy' },
        { label: '创建时间', prop: 'createTime' },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      questionnaireTypeList: []
    };
  },
  created() {
    this.getDic();
  },
  methods: {
    getDic() {
      this.$api.System.getDictionaryContentPageList({
        dictCode: 'questionnaireType',
        pageSize: 9999,
        pageNumber: 1
      }).then((res) => {
        this.questionnaireTypeList = res?.result?.records || [];
      });
    },
    getQSortName(val) {
      let tg = this.questionnaireTypeList.find((el) => el.itemValue == val);

      return tg?.itemText || '-';
    },
    openDesc(row) {
      this.$refs.questionnaireDesc.show(row);
    },
    openAdd(type, row) {
      this.$refs.addQuestionnaire.show(type, row);
    },
    openIssued(row) {
      this.$refs.issuedDialog.show(row);
    },
    handleSearch() {
      this.$refs.listPage.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
.component-questionnaireManage {
  .mr15 {
    margin-right: 15px;
  }
}
</style>
