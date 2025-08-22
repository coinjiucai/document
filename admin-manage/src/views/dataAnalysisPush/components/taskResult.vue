<template>
  <div>
    <el-button @click="finish">一键完成</el-button>
    <div style="margin-top: 10px">
      <el-progress
        :percentage="parseFloat(summary.rate)"
        :format="format"
        :stroke-width="16"
        color="#F5A82A"
      ></el-progress>
    </div>
    <div class="result-a">
      <div>
        <div>{{ summary.finished }}人</div>
        <div>已完成</div>
      </div>
      <div style="color: #949ca8">
        <div>{{ summary.total - summary.finished }}</div>
        <div>未完成</div>
      </div>
      <div style="color: #949ca8">
        <div>{{ summary.rate }}</div>
        <div>完成率</div>
      </div>
      <div style="color: red">
        <div>{{ summary.warnning }}</div>
        <div>预警人员</div>
      </div>
    </div>
    <div>
      <BaseTable
        :labelList="labelList"
        :pageInfo="pageInfo"
        :list="members"
        :showSelection="false"
        :showPagination="false"
      >
        <template v-slot:range="scope"> {{ scope.row.iIndex + 1 }}</template>
        <template v-slot:action="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="detailReport(scope.row.report)"
            >查看报告</el-link
          ></template
        >
      </BaseTable>
    </div>

    <BaseDialog
      class="full-block component-report-dialog"
      title="报告详情"
      center
      :visible.sync="reportVisibleDialog"
      @closed="reportCloseDialog"
      width="100%"
      top="0vh"
      destroy-on-close
    >
      <iframe
        :src="reportUrl"
        frameborder="0"
        width="100%"
        :height="wHeight"
      ></iframe>
    </BaseDialog>
  </div>
</template>

<script>
import BaseTable from '@/components/Base/BaseTable.vue';
import BaseDialog from '@/components/Base/BaseDialog';
export default {
  props: {
    task: {
      type: Object,
      default: () => {
        return null;
      }
    },
    summary: {
      type: Object,
      default: () => {
        return {
          finished: 0,
          onGoing: 0,
          rate: '0%',
          total: 0,
          warnning: 0
        };
      }
    },
    members: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: {
    BaseTable,
    BaseDialog
  },
  data() {
    return {
      pageInfo: {},
      labelList: [
        {
          label: '名次',
          prop: 'range',
          special: true
        },
        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '用时',
          prop: 'duration'
        },
        {
          label: '分数',
          prop: 'score'
        },
        {
          label: '操作',
          prop: 'action',
          special: true
        }
      ],
      reportVisibleDialog: false,
      wHeight: 800,
      reportUrl: ''
    };
  },
  mounted() {
    this.wHeight = document.documentElement.clientHeight - 0;
  },
  methods: {
    format(percentage) {
      return `${this.summary.finished}/${this.members.length}`;
    },
    finish() {
      this.$api.analysis
        .finishTopicTask({
          id: this.task.id
        })
        .then((res) => {
          this.$emit('finished');
        });
    },
    reportCloseDialog() {
      this.reportVisibleDialog = false;
    },
    detailReport(url) {
      this.reportUrl = url;
      this.reportVisibleDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.result-a {
  display: flex;
  margin: 16px 0;
  > div {
    flex: 1;
    text-align: center;
    border-right: 1px solid #fff;
    > div:nth-child(1) {
      font-size: 24px;
      margin-bottom: 10px;
    }
    > div:nth-child(2) {
      font-size: 14px;
    }
  }
  > div:last-child {
    border-right: none;
  }
}
v-deep .el-progress__text {
  width: 100px !important;
}
.component-report-dialog {
  /deep/ .el-dialog {
    height: 100vh;
    margin-top: 0 !important;
  }
  /deep/.el-dialog__body {
    max-height: calc(100vh - 47px);
    height: calc(100vh - 47px) !important;
    padding: 0;
  }
  /deep/.el-dialog__footer {
    display: none;
  }
}
</style>
