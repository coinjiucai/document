<!--
  @Name 表格基础组件
  @Description 基于el-table和el-pagination封装的基础表格组件
  @author 赖明浩
  @version 3.3.1
  @date 2023-2-6
-->

<template>
  <div class="base-table-wrap flex-layout full-block">
    <el-table
      ref="table"
      class="base-table better-scroll"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      v-bind="$props"
      :class="tableClass"
      :data="list"
      :height="height"
      v-on="$listeners"
      :header-cell-class-name="cellClass"
      @selection-change="selectRow"
      @row-click="rowClick"
    >
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="50"
        :fixed="selectionFixed"
        :selectable="selectable"
        :resizable="selectionFixed !== false"
      >
      </el-table-column>
      <el-table-column
        v-if="showIndex"
        type="index"
        :fixed="indexFixed"
        :index="indexMethod"
        label="序号"
        width="60"
      >
      </el-table-column>
      <slot name="first"></slot>
      <!-- 内容栏 -->
      <slot name="content">
        <el-table-column
          v-for="(item, index) in labelList"
          :key="index"
          v-bind="item"
          :width="item.width ? item.width : 'auto'"
          show-overflow-tooltip
        >
          <template slot="header" v-if="item.required">
            *{{ item.label }}
          </template>
          <template v-if="!item.required" v-slot="scope">
            <!-- 特殊列 -->
            <slot
              v-if="item.special"
              :name="item.prop"
              :index="index"
              :row="{ ...scope.row, ...{ iIndex: scope.$index } }"
            ></slot>
            <template v-else>
              <template v-if="scope.row.edit">
                <template v-if="item && item.compType">
                  <FormItem
                    v-if="item.dictCode"
                    v-bind="item"
                    :item="item"
                    :row="scope.row"
                    size="mini"
                    v-model="scope.row[item.prop]"
                    @changeText="
                      (val) => {
                        const prop = item.prop + '_dictText';
                        scope.row[prop] = val;
                      }
                    "
                  >
                  </FormItem>
                  <FormItem
                    v-else
                    v-bind="item"
                    :item="item"
                    :row="scope.row"
                    size="mini"
                    v-model="scope.row[item.prop]"
                    @tableDialogSelect="showTableDialog(scope.row)"
                    @speciaDialogSelect="speciaDialogSelect(scope.row)"
                  >
                  </FormItem>
                </template>

                <template v-else-if="item?.showText">
                  <span v-html="propFilter(scope.row, item)"></span>
                </template>
                <el-input
                  v-else
                  v-bind="item"
                  v-model="scope.row[item.prop]"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </template>
              <template v-else>
                <span v-html="propFilter(scope.row, item)"></span>
              </template>
            </template>
          </template>
        </el-table-column>
      </slot>
      <!-- 操作栏 -->
      <slot name="operation"></slot>
      <el-table-column v-if="itemDraggable" label="拖拽排序" width="90">
        <template>
          <div class="item-draggable-part"><i class="el-icon-more"></i></div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex-row" v-if="showPagination">
      <div
        class="flex-auto theme-color-text-regular"
        style="font-size: 13px; height: 28px; line-height: 28px"
      >
        <span v-if="selectedList.length">
          <el-tooltip content="清空勾选">
            <i class="el-icon-refresh pointer" @click="resetSelection"></i>
          </el-tooltip>
        </span>
        <span v-if="echoSelected && selectedList.length">
          当前页已选
          <span class="theme-background-middle">{{
            currentSelectedRecord.length
          }}</span>
          条 ，总计已选
          <span class="theme-background-middle">{{ selectedList.length }}</span>
          条
        </span>
        <span v-else-if="currentSelectedRecord.length">
          已选
          <span class="theme-background-middle">{{
            currentSelectedRecord.length
          }}</span>
          条
        </span>
      </div>
      <el-pagination
        class="flex-none"
        :class="paginationClass"
        :style="paginationStyle"
        v-bind="$props"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageInfo[pageInfoKeys['number']]"
        :page-size="pageInfo[pageInfoKeys['size']]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { Table, Pagination } from 'element-ui';
import Common from '@/com/common';
import Sortable from 'sortablejs';
import FormItem from '@/components/Form/Item.vue';
import moment from 'moment';
export default {
  name: 'BaseTable',
  components: {
    FormItem
  },
  filters: {},
  props: {
    ...Table.props, // el-table原有props
    ...Pagination.props, // el-pagination原有props
    // 表头信息
    labelList: {
      type: Array,
      default: () => []
    },
    // 表数据
    list: {
      type: Array,
      default: () => []
    },
    // 是否显示预设的勾选框
    showSelection: {
      type: Boolean,
      default: true
    },
    // 是否显示预设的序号
    showIndex: {
      type: Boolean,
      default: false
    },
    // 分页展示
    showPagination: {
      type: Boolean,
      default: true
    },
    // 分页信息，显示分页时必传，当前页和当前页条数是必要的，其次还可传入分页大小
    pageInfo: {
      type: Object,
      default: () => {}
    },
    // 分页信息的对应字段名
    pageInfoKeys: {
      type: Object,
      default: () => {
        return {
          // 分页大小
          size: 'pageSize',
          // 当前页
          number: 'pageNo'
        };
      }
    },
    // 表格自定义类
    tableClass: { default: '' },
    // 分页自定义类
    paginationClass: { default: '' },
    // 分页自定义样式
    paginationStyle: { default: '' },
    // 表格的加载动画
    loading: {
      type: Boolean,
      default: false
    },
    // 是否固定多选位置,注意：尽量在有横向滚动条的情况下使用
    selectionFixed: {
      type: [Boolean, String],
      default: false
    },
    // 是否固定序号位置,注意：尽量在有横向滚动条的情况下使用
    indexFixed: {
      type: [Boolean, String],
      default: false
    },
    // 勾选框是否允许勾选的逻辑处理函数,返回row, index,根据函数返回的结果进行判断
    selectableCallback: {
      type: Function,
      default: null
    },
    // 勾选框多选个数限制,正整数值,selectableCallback生效时selectLimit则失效
    selectLimit: {
      type: Number,
      default: 0
    },
    // 是否允许跨页多选（前提：可多选与可分页）
    echoSelected: {
      type: Boolean,
      default: true
    },
    // 是否可拖拽（前提：指定row-key,list加sync实现自动更新，或者通过drag-end事件手动更新）
    itemDraggable: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String, Number],
      default: () => 'auto'
    }
  },
  data() {
    return {
      // 当前页选中项
      currentSelectedRecord: [],
      // 全部选中项
      echoSelectedRecord: [],
      sortable: null,
      // 记录分页的信息
      pageRecord: {
        page: null,
        size: null
      }
    };
  },
  mounted() {
    this.setSort();
    this.updatePageRecord();
  },
  watch: {
    list() {
      // 数据发生变化，处理勾选回显
      if (this.showPagination && this.echoSelected) {
        this.handleEchoSelected();
      }
    }
  },
  computed: {
    selectedList() {
      if (this.showPagination && this.echoSelected) {
        return this.echoSelectedRecord;
      } else {
        return this.currentSelectedRecord;
      }
    },
    // 多选数量限制是否生效
    selectLimitIsActive() {
      return this.selectLimit && this.selectLimit >= 1;
    },
    // 自由勾选
    isSelectFree() {
      // 如果没有限制,或者限制的值无效,或者勾选数小于限制值视为勾选自由
      // console.log(this.selectedList.length, "sfsdf", this.selectLimit);
      return (
        !this.selectLimitIsActive || this.selectedList.length < this.selectLimit
      );
    },
    // 判断多选时前后的分页变化，和多选相关
    isPageChange() {
      return (
        this.pageRecord.size !== this.pageInfo[this.pageInfoKeys['size']] ||
        this.pageRecord.page !== this.pageInfo[this.pageInfoKeys['number']]
      );
    }
  },
  methods: {
    /**
     * 给表头加样式类名
     */
    cellClass(row) {
      // 如果多选限制生效，则隐藏表头多选
      if (
        row.columnIndex === 0 &&
        this.showSelection &&
        this.selectLimitIsActive
      ) {
        return 'DisableSelection';
      }
    },
    /**
     * 针对多选列设置是否可以勾选
     * @param {object} row 当前行
     * @param {number} index 当前行索引
     * @return {boolean}
     */
    selectable(row, index) {
      if (this.selectableCallback) {
        // 如果存在回调函数,则按照回调函数处理是否允许勾选
        return this.selectableCallback(row, index);
      } else {
        const isChecked =
          this.currentSelectedRecord.findIndex((i) => i.id === row.id) >= 0;
        // 如果勾选自由，或者当前行是已勾选行则不限制
        return this.isSelectFree || isChecked;
      }
    },
    /**
     * 重置勾选
     * 注意：在触发查询或者切换到另一个数据表的时候需要重置勾选
     */
    resetSelection() {
      this.currentSelectedRecord = [];
      this.echoSelectedRecord = [];
      this.$nextTick(() => {
        this.$refs.table.clearSelection();
      });
    },
    /**
     * 自定义索引
     * @param val
     * @returns {*}
     */
    indexMethod(val) {
      if (this.showPagination) {
        const size = this.pageInfo[this.pageInfoKeys['size']];
        const num = this.pageInfo[this.pageInfoKeys['number']] - 1;
        const current = val + 1;
        return current + size * num;
      } else {
        return val + 1;
      }
    },
    /**
     * prop判断显示内容
     * @param row 用于取同行的其他字段
     * @param item
     * @returns {string|*}
     */
    propFilter(row, item) {
      const val = row[item.prop];
      if (val === '' || val == null) {
        return '_';
      } else if (item.formatter) {
        return item.formatter(row[item.prop], row);
      } else if (item.dictCode) {
        return row[item.prop + '_dictText'];
      } else if (item['fmtdate']) {
        return moment(row[item.prop]).format(item['fmtdate']);
      } else {
        return row[item.prop];
      }
    },
    /**
     * 更新分页记录，在分页多选后触发
     */
    updatePageRecord() {
      if (this.showPagination) {
        this.pageRecord.size = this.pageInfo[this.pageInfoKeys['size']];
        this.pageRecord.page = this.pageInfo[this.pageInfoKeys['number']];
      }
    },
    /**
     * 表格多触发勾选
     * @param list
     */
    selectRow(list) {
      // 做过滤是为了避免出现list = [undefined]的情况
      const selection = list.filter((i) => Boolean(i));
      this.$emit('selectRowList', selection);
      if (this.showPagination && this.echoSelected) {
        // 判断分页是否发生变化，如果是则绕过取消勾选的处理
        if (!this.isPageChange) {
          // 获取取消勾选的
          const cancelCheckList = this.currentSelectedRecord.filter(
            (i) => !selection.find((j) => j.id === i.id)
          );
          // 总的列表中去掉取消勾选的
          cancelCheckList.forEach((i) => {
            Common.remove(this.echoSelectedRecord, (j) => j.id === i.id);
          });
        }
        // 更新分页记录信息
        this.updatePageRecord();
        // 总勾选列表和当前页面勾选列表合并去重获得新的总勾选列表
        const idMap = new Map();
        // 去重根据id去重，优先取当前页面勾选的
        this.echoSelectedRecord = [
          ...Common.CloneDeep(selection),
          ...this.echoSelectedRecord
        ].filter((item) => !idMap.has(item.id) && idMap.set(item.id, 1));
      }
      // 最后再更新当前的勾选列表
      this.currentSelectedRecord = selection;
    },
    /**
     * 分页大小改变
     * @param size
     */
    handleSizeChange(size) {
      this.pageInfo[this.pageInfoKeys['size']] = size;
      this.pageInfo[this.pageInfoKeys['number']] = 1;
      this.$emit('page-change', {
        [this.pageInfoKeys['size']]: size,
        [this.pageInfoKeys['number']]: 1
      });
      // 仅在单选的情况下重置勾选，多选不重置
      if (!this.echoSelected) {
        this.resetSelection();
      }
    },
    /**
     * 分页切换
     * @param number
     */
    handleCurrentChange(number) {
      this.pageInfo[this.pageInfoKeys['number']] = number;
      this.$emit('page-change', {
        [this.pageInfoKeys['number']]: number,
        [this.pageInfoKeys['size']]: this.pageInfo[this.pageInfoKeys['size']]
      });
    },
    /**
     * 根据数据列表主动设置跨页多选的回显处理
     * @param selectedList 对象数组，对象必须包含id属性
     */
    setEchoSelectedRecord(selectedList) {
      this.echoSelectedRecord = selectedList;
      this.$nextTick(() => {
        this.handleEchoSelected();
      });
    },
    /**
     * 跨页多选回显处理
     */
    handleEchoSelected() {
      let selectedIndexList = [];
      const ids = this.list.map((i) => i.id);
      // 根据id过滤当前页面的勾选列表
      const currentPageCheckedList = this.echoSelectedRecord.filter((i) =>
        ids.includes(i.id)
      );
      if (currentPageCheckedList && currentPageCheckedList.length) {
        selectedIndexList = currentPageCheckedList.map((item) => {
          return this.list.findIndex((v) => v.id === item.id);
        });
        this.$nextTick(() => {
          selectedIndexList
            .map((item) => this.list[item])
            .forEach((row) => {
              this.$refs.table.toggleRowSelection(row);
            });
        });
      }
    },
    /**
     * 设置拖拽
     */
    setSort() {
      if (!this.itemDraggable) {
        return;
      }
      // ref一定跟table上面的ref一致
      const el = this.$refs.table.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0];
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',

        setData(dataTransfer) {
          dataTransfer.setData('Text', '');
        },
        // 监听拖拽事件结束时触发
        onEnd: (evt) => {
          this.$emit('update:list', []);
          const cloneList = Common.CloneDeep(this.list);
          // 删除并获取拖拽行
          const targetRow = cloneList.splice(evt.oldIndex, 1)[0];
          // 将拖拽行移动到新的位置上
          cloneList.splice(evt.newIndex, 0, targetRow);
          this.$nextTick(() => {
            this.$emit('update:list', cloneList);
            this.$emit('drag-end', cloneList);
          });
        }
      });
    },
    rowClick(row) {
      this.$emit('rowClick', row);
    },
    //
    showTableDialog(row) {
      this.$emit('tableDialogShow', row);
    },
    speciaDialogSelect(row) {
      this.$emit('speciaDialogSelect', row);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .DisableSelection {
  > div {
    display: none !important;
  }
}

.item-draggable-part {
  cursor: move;
}

.base-table-wrap {
}
</style>
