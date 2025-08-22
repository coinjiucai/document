<template>
  <BaseDialog
    class="full-block component-table-dialog"
    :title="title"
    center
    :visible.sync="visibleDialog"
    @closed="handleCloseDialog"
    :width="width"
    top="20vh"
    destroy-on-close
  >
    <div class="search-box" v-if="searchVisible">
      <template v-if="showSearchComponent">
        <el-input
          placeholder="请输入内容"
          v-model="name"
          class="input-with-select"
          size="mini"
          clearable
          @keyup.enter.native="toSearch"
        >
          <i class="el-icon-search el-input__icon" slot="suffix"> </i>
        </el-input>
        <el-button
          type="primary"
          style="margin-left: 10px"
          size="mini"
          @click="toSearch"
          >查询</el-button
        >
      </template>
      <slot name="search"></slot>
    </div>

    <!-- 表格 -->
    <div class="flex-auto table-dialog-list" :style="tableStyle">
      <BaseTable
        ref="table"
        :page-info="pageInfo"
        height="100%"
        :showIndex="showIndex"
        :label-list="labelList"
        :list="dataList"
        :total="total"
        :showPagination="showPagination"
        :selectLimit="selectLimit"
        :showSelection="showSelection"
        :selectableCallback="selectableCallback"
        @page-change="getList"
        @selectRowList="selectRowList"
      >
        <!-- 父及使用 <template :slot="item.parent"></template> -->
        <template
          v-for="item in labelList"
          :slot="item.prop"
          slot-scope="scope"
        >
          <slot :name="item.parent" :row="scope.row"></slot>
        </template>
      </BaseTable>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button type="info" @click="handleCloseDialog">取消</el-button>
    </span>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import BaseTable from '@/components/Base/BaseTable';
export default {
  name: 'TableDialog',
  components: { BaseDialog, BaseTable },
  props: {
    width: {
      type: String,
      default: () => {
        return '1000px';
      }
    },
    tableStyle: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: () => ''
    },
    selectValue: {
      type: [String, Number],
      default: () => ''
    },
    searchVisible: {
      type: Boolean,
      default: () => true
    },
    param: {
      type: Object,
      default: () => {}
    },

    searchProp: {
      type: String,
      default: () => ''
    },
    labelList: {
      type: Array,
      default: () => []
    },
    listApi: {
      type: [Array],
      default: () => []
    },
    showPagination: {
      type: Boolean,
      default: () => true
    },
    showIndex: {
      type: Boolean,
      default: () => true
    },
    showSelection: {
      type: Boolean,
      default: () => true
    },
    selectLimit: {
      type: Number,
      default: () => 0
    },
    selectableCallback: {
      type: Function,
      default: null
    }
  },
  computed: {
    showSearchComponent() {
      return !this.$slots.search;
    }
  },
  data() {
    return {
      name: '',
      visibleDialog: false,
      dataList: [],
      pageInfo: {
        pageSize: 10,
        pageNo: 1
      },
      total: 0,
      selection: []
    };
  },
  created() {
    this.pageInfo[this.searchProp] = '';
  },
  methods: {
    show(ids) {
      this.pageInfo.pageNo = 1;
      this.visibleDialog = true;
      this.getList();
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    getList() {
      this.pageInfo[this.searchProp] = this.name;
      this.pageInfo = {
        ...this.pageInfo,
        ...this.param
      };
      this.$api[this.listApi[0]][this.listApi[1]](this.pageInfo).then((res) => {
        this.dataList = res['result'].records;
        this.total = res['result'].total;
      });
    },
    // 选中的行
    selectRowList(selection) {
      this.selection = selection;
    },
    confirm() {
      const selectedList = this.$refs.table.selectedList;
      this.$emit('confirm', selectedList);
    },
    toSearch() {
      this.getList();
    },
    // 回显处理
    setEchoSelectedRecord(list) {
      this.$refs.table.setEchoSelectedRecord(list);
    }
  },
  watch: {
    selectValue: {
      handler(nval) {
        if (nval) {
          const list = this.dataList.filter((v) => v[this.searchProp] == nval);
          if (list.length > 0) {
            this.setEchoSelectedRecord(list);
          }
        }
      },
      immediate: true
    },
    param: {
      handler(nval) {
        if (nval?.pageSize) {
          this.pageInfo.pageSize = nval.pageSize;
        }
        if (nval?.pageNo) {
          this.pageInfo.pageNo = nval.pageNo;
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;

  margin-bottom: 10px;
}
/deep/.table-dialog-list {
  height: 363px;
}
/deep/.el-table__body-wrapper,
/deep/.el-table__header-wrapper {
  width: 100% !important;
}
.base-table-wrap {
  overflow-x: auto;
}
</style>
