<template>
  <div>
    <BaseDialog
      class="full-block self-check-dialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="60%"
      top="20vh"
    >
      <div class="full-block scroll-y">
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-top: 20px"
          header-row-class-name="self-check-result-header"
        >
          <el-table-column prop="id" label="序号" width="180">
          </el-table-column>
          <el-table-column prop="name" label="检查内容"> </el-table-column>
          <el-table-column prop="amount1" label="检查事项"> </el-table-column>
          <el-table-column label="合格">
            <template slot-scope="scope">
              <el-input
                v-model="scope.amount1"
                class="w100"
                maxlength="30"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount3" label="备注"> </el-table-column>
        </el-table>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">我已完成</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
export default {
  name: 'CriticalDeptDialog',
  components: { BaseDialog },
  props: {
    title: {
      type: String,
      default: () => ''
    }
  },
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      tableData: [
        {
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        },
        {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        },
        {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        },
        {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        },
        {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        },
        {
          id: '12987126',
          name: '王小虎2',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        },
        {
          id: '12987126',
          name: '王小虎2',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        },
        {
          id: '12987126',
          name: '王小虎2',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }
      ]
    };
  },
  created() {},
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    show(record, defaultDepart) {
      this.visibleDialog = true;
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(column, "----");
      if (columnIndex === 1) {
        const length = this.tableData.filter((v) => v.name == row.name).length;
        const findIndex = this.tableData.findIndex((v) => v.name == row.name);
        if ((rowIndex - findIndex) % length === 0) {
          return {
            rowspan: length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    /**
     * 点击保存
     * 区分新增和修改
     */
    handleSave() {}
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 60vh;
  overflow-y: hidden;
  .el-form {
    padding: 0 20px;
  }
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.self-check-dialog {
}
/deep/.self-check-result-header {
  th.el-table__cell {
    background: transparent;
    color: #333333;
    font-weight: normal;
  }
}
</style>
