<template>
  <div class="component-questionTypeList full-block flex-column">
    <div class="btn-wrap flex-row justify-around">
      <el-button
        class="flex1"
        type="primary"
        @click="openAddTypeDialog"
        size="small"
        >新增</el-button
      >
      <el-button
        class="flex1"
        type="primary"
        :disabled="activeIndex == -1"
        @click="delQuestionType"
        size="small"
        >删除</el-button
      >
    </div>
    <div class="sortList-wrap flex1 h0 scroll-y">
      <template v-if="list && list.length">
        <div
          :class="[
            'cell flex-column align-center justify-center pointer',
            { active: activeIndex == index }
          ]"
          v-for="(item, index) in list"
          :key="index"
          @click="clickQuestionType(index)"
        >
          <div class="flex-row align-center justify-center">
            <div>
              <div class="text-center">
                {{ item.topicName }}，每题
                <el-input-number
                  class="num"
                  :controls="false"
                  v-model="item.questionScore"
                ></el-input-number>
                分
              </div>
            </div>
          </div>
          <div>
            （共{{ getQuestionNum(item) }}题，共{{
              getQuestionTotalScore(item)
            }}分）
          </div>
        </div>
      </template>
      <div class="empty-wrap full-block flex-center" v-else>
        <el-empty></el-empty>
      </div>
    </div>

    <addTypeDialog ref="addTypeDialog" v-on="$listeners" />
  </div>
</template>

<script>
import addTypeDialog from '@/views/basicsManage/questionnaireManage/components/addTypeDialog';

export default {
  name: 'questionTypeList',
  components: { addTypeDialog },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: -1
    }
  },
  computed: {
    getQuestionNum() {
      return (val) => {
        let list = val?.questionBankList || [];

        return list.length;
      };
    },
    getQuestionTotalScore() {
      return (val) => {
        let list = val?.questionBankList || [];
        let scroe = val?.questionScore || 0;

        return list.length * scroe;
      };
    }
  },
  data() {
    return {
      a: ''
    };
  },
  methods: {
    openAddTypeDialog() {
      this.$refs.addTypeDialog.show();
    },
    validateRepeat(val) {
      return !!this.list.find((el) => el.topicCategory == val);
    },
    clickQuestionType(val) {
      this.$emit('clickQuestionType', val);
    },
    delQuestionType() {
      this.$confirm('是否删除该题型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delQuestionType');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.component-questionTypeList {
  .btn-wrap {
    margin-bottom: 16px;
  }
  .sortList-wrap {
    .cell {
      background: #1e355a;
      padding: 8px;
      &.active {
        background: #84b7eb;
      }
      .num {
        width: 28px;
      }
      /deep/ .el-input--medium .el-input__inner {
        height: 18px;
        line-height: 18px;
      }
      /deep/ .el-input-number.is-without-controls .el-input__inner {
        padding-left: 2px;
        padding-right: 2px;
      }
    }
    .cell + .cell {
      margin-top: 15px;
    }
  }
}
</style>
