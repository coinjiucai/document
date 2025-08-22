<template>
  <div class="list-page flex-layout full-block">
    <!-- 操作按钮 -->
    <div v-if="buttonList.length">
      <slot name="prePageButtons"></slot>
      <PageButtons
        :list="buttonList"
        v-bind="$attrs"
        @add="add"
        @edit="edit"
        @batchDelete="batchDelete"
      >
        <!-- 页面特殊按钮加这里 -->

        <slot name="PageButtons"></slot>
      </PageButtons>
    </div>

    <el-divider v-if="buttonList.length > 0"></el-divider>
    <!-- 搜索框 -->
    <Search
      ref="search"
      v-if="showSearchComponent"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :styleObj="searchStyle"
      @handleSearch="handleSearch"
      @reset="reset"
    ></Search>
    <slot name="search"></slot>
    <el-divider v-if="Object.keys(params)?.length > 0"></el-divider>
    <!-- 表格 -->
    <div class="flex-auto">
      <BaseTable
        ref="table"
        :page-info="pageInfo"
        :loading="loading"
        :height="height"
        :label-list="labelList"
        :list="dataList"
        :total="total"
        :itemDraggable="itemDraggable"
        :showSelection="showSelection"
        :showPagination="showPagination"
        :pageInfoKeys="pageInfoKeys"
        v-bind="$attrs"
        :selectLimit="
          $attrs.selectLimit && $attrs.selectLimit > 0 ? $attrs.selectLimit : 0
        "
        @page-change="getList"
        @selectRowList="selectRowList"
        @rowClick="rowClick"
        @drag-end="dragEnd"
        @tableDialogShow="tableDialogShow"
        @speciaDialogSelect="speciaDialogSelect"
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

    <TableDialog
      v-if="$attrs?.tableDialogConfig"
      :selectValue="selectValue"
      v-bind="$attrs?.tableDialogConfig"
      ref="tableDialog"
      @confirm="confirmSmSelect"
    ></TableDialog>
  </div>
</template>

<script>
import PageButtons from './PageButtons';
import Search from '@/components/Search/Search';
import BaseTable from '@/components/Base/BaseTable';
import { isArray, generateId } from '@/utils/utils';
import TableDialog from '@/components/TableDialog';
export default {
  name: 'ListPage',
  components: {
    PageButtons,
    BaseTable,
    Search,
    TableDialog
  },
  props: {
    buttonList: {
      type: [Array, String],
      default: () => ['add', 'edit', 'delete']
    },
    // 查询参数
    params: {
      type: Object,
      default: () => ({})
    },
    fieldsConfig: {
      type: Array,
      default: () => []
    },
    searchStyle: {
      type: Object,
      default: () => ({})
    },
    // 表格列
    labelList: {
      type: Array,
      default: () => []
    },
    // 内部列表
    isInnerGet: {
      type: Boolean,
      default: () => true
    },
    listApi: {
      type: [Array],
      default: () => []
    },
    deleteApi: {
      type: [Array],
      default: () => []
    },
    editApi: {
      type: [Array],
      default: () => []
    },
    batchEdit: {
      type: Boolean,
      default: () => false
    },
    addApi: {
      type: [Array],
      default: () => []
    },
    // 是否可拖拽
    itemDraggable: {
      type: Boolean,
      default: () => false
    },
    tableSoltList: {
      type: Array,
      default: () => []
    },
    height: {
      type: [String, Number],
      default: () => '100%'
    },
    showPagination: {
      type: Boolean,
      default: () => true
    },
    showSelection: {
      type: Boolean,
      default: () => true
    },
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
    }
  },
  data() {
    return {
      loading: false,
      dataList: [],
      pageInfo: {
        pageSize: 10,
        pageNo: 1
      },
      total: 0,
      selection: [],
      selectValue: '',
      dialogSelectRow: null
    };
  },
  computed: {
    showSearchComponent() {
      return Object.keys(this.params)?.length > 0 && !this.$slots.search;
    }
  },
  created() {
    this.pageInfo = {
      pageSize: this.pageInfo.pageSize,
      pageNo: this.pageInfo.pageNo,
      ...this.params
    };
    if (!this.showPagination) {
      this.pageInfo.pageSize = 100;
    }
    if (this.isInnerGet && this.listApi.length > 0) {
      this.getList();
    }
  },
  methods: {
    // 查询
    handleSearch() {
      const params = {
        ...this.params
      };
      console.log(this.params, 'sfsdfffffffff');
      if (params['range'] && params['range'].length > 0) {
        const keys = Object.keys(this.params);
        if (keys.includes('queryStartTime')) {
          params['queryStartTime'] = params['range'][0];
          params['queryEndTime'] = params['range'][1];
        }
        if (keys.includes('startTime')) {
          params['startTime'] = params['range'][0];
          params['endTime'] = params['range'][1];
        }
      }
      const keys = this.fieldsConfig.map((v) => v.prop);
      for (let i = 0; i < keys.length; i++) {
        if (params[keys[i]] != 0 && !params[keys[i]]) {
          delete params[keys[i]];
        }
      }

      this.pageInfo = {
        pageSize: this.pageInfo.pageSize,
        pageNo: 1,
        ...params
      };
      this.getList();
    },
    getAllSelection() {
      return this.$refs.table.selectedList;
    },
    resetEmptyValues(obj, keys) {
      for (const key in obj) {
        if (keys && keys.indexOf(key) !== -1 && obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (Array.isArray(value) && value.length > 0) {
            // 若为非空数组，重置为 []
            obj[key] = [];
          } else if (typeof value === 'string' && value !== '') {
            // 若为非空字符串，重置为 ''
            obj[key] = '';
          } else if (typeof value == 'number') {
            obj[key] = '';
          } else if (
            typeof value === 'object' &&
            value !== null &&
            Object.keys(value).length > 0
          ) {
            // 若为非空对象，重置为 {}
            obj[key] = {};
          }
        }
      }
    },
    reset() {
      if (this.params['range']) {
        const keys = Object.keys(this.params);
        if (keys.includes('queryStartTime')) {
          this.params['queryStartTime'] = '';
          this.params['queryEndTime'] = '';
        }
        if (keys.includes('startTime')) {
          this.params[' startTime'] = '';
          this.params['endTime'] = '';
        }
      }
      const keys = this.fieldsConfig.map((v) => v.prop);
      this.resetEmptyValues(this.params, keys);
      this.handleSearch();
    },
    setList(list, total) {
      const nList = [];
      list.forEach((item) => {
        this.labelList.forEach((v) => {
          if (v?.compType == 'upload' && !item[v.prop]) {
            item[v.prop] = [];
          }
          if (v?.compType == 'depart' && v?.propVal && !item[v.propVal]) {
            item[v.propVal] = '';
          }
        });
        nList.push(item);
      });
      if (this.isInnerGet) {
        this.dataList = nList;
      } else {
        const outList = nList.map((v) => {
          return {
            ...v,
            edit: false,
            unId: generateId()
          };
        });
        this.dataList = outList;
      }

      this.total = total;
    },
    getList(outerParams = null) {
      const useParams = outerParams ? outerParams : {};
      const params = {
        ...useParams,
        ...this.params
      };

      if (params['range'] && params['range'].length > 0) {
        const keys = Object.keys(this.params);
        if (keys.includes('queryStartTime')) {
          params['queryStartTime'] = params['range'][0];
          params['queryEndTime'] = params['range'][1];
        }
        if (keys.includes('startTime')) {
          params['startTime'] = params['range'][0];
          params['endTime'] = params['range'][1];
        }
      }
      const keys = this.fieldsConfig.map((v) => v.prop);
      for (let i = 0; i < keys.length; i++) {
        if (params[keys[i]] != 0 && !params[keys[i]]) {
          delete params[keys[i]];
        }
      }
      delete params['range'];
      this.pageInfo = {
        pageSize: this.pageInfo.pageSize,
        pageNo: this.pageInfo.pageNo,
        ...params
      };
      if (this.isInnerGet && this.listApi.length > 1) {
        this.loading = true;
        const apiOne = this.listApi[0];
        const apiTwo = this.listApi[1];
        this.$api[apiOne][apiTwo](this.pageInfo).then((res) => {
          this.loading = false;
          this.dataList = res['result'].records;
          this.total = res['result'].total;
        });
      } else {
        this.$emit('getList', this.pageInfo);
      }
    },
    dragEnd(cloneList) {
      this.$emit('drag-end', cloneList);
    },
    // 选中的行
    selectRowList(selection) {
      this.selection = selection;
      this.$emit('selectRowList', selection);
    },
    //
    add(item = null) {
      if (this.isInnerGet) {
        this.$emit('add');
      } else {
        let record = {
          edit: true,
          unId: generateId()
        };
        this.labelList.forEach((v) => {
          if (v.prop != 'action') {
            const prop = v.prop;
            if (v?.compType == 'upload') {
              record[prop] = [];
            } else if (v?.compType == 'select' && v.dictCode) {
              record[prop] = '';
              record[prop + '_dictText'] = '';
            } else {
              record[prop] = '';
            }
            if (v?.compType == 'depart' && v?.propVal) {
              record[v.propVal] = '';
            }
          }
        });
        if (item) {
          record = {
            ...record,
            ...item
          };
        }
        this.dataList.push(record);
      }
    },
    // 编辑内容
    edit() {
      const ids = this.selection.map((v) => v.id || v.unId);
      if (this.batchEdit) {
        if (ids.length == 0) {
          this.$message.warning('请选择一条数据!');
        } else {
          this.$emit('edit', this.selection);
        }
      } else if (this.isInnerGet) {
        if (ids.length == 0 || ids.length > 1) {
          this.$message.warning('请选择一条数据!');
        } else {
          this.$emit('edit', this.selection[0]);
        }
      } else {
        if (ids.length == 0 || ids.length > 1) {
          this.$message.warning('请选择一条数据!');
        } else {
          console.log(this.selection, this.dataList);
          this.dataList.forEach((v) => {
            if (ids.includes(v.id)) {
              this.$set(v, 'edit', true);
            }
          });
          this.$emit('edit', this.selection[0]);
        }
      }
    },
    // 保存编辑或新增的内容
    saveRow(row, message = '', callback = null) {
      if (row.id || row?.length > 0) {
        const editOne = this.editApi[0];
        const editTwo = this.editApi[1];
        this.$api[editOne][editTwo](row)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('编辑成功');
            }
            if (callback) {
              callback(res);
            }
          })
          .finally(() => {
            this.getList();
          });
      } else {
        const addOne = this.addApi[0];
        const addTwo = this.addApi[1];
        this.$api[addOne][addTwo]({ ...row })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(message ? message : '成功');
            }
            if (callback) {
              callback(res);
            }
          })
          .finally(() => {
            this.getList();
          });
      }
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length == 0) {
        this.$message.warning('请选择请选择删除内容!');
      } else {
        if (this.isInnerGet) {
          const ids = this.selection.map((v) => v.id);
          this.$confirm('是否确认删除该数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api[this.deleteApi[0]]
              [this.deleteApi[1]]({ ids: ids.join(',') })
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success('删除成功');
                  this.$emit('refresh');
                }
              })
              .finally(() => {
                this.getList();
              });
          });
        } else if (this.selection.length > 0) {
          const unIds = this.selection.map((v) => v.unId);
          this.dataList = this.dataList.filter((v) => !unIds.includes(v.unId));
        }
      }
    },
    rowClick(row) {
      const keys = Object.keys(row);
      if (keys.includes('edit') && row.unId) {
        this.dataList.forEach((v) => {
          if (v.unId == row.unId) {
            v.edit = true;
          } else {
            v.edit = false;
          }
        });
      }
      this.$emit('rowClick', row);
    },
    getDataList() {
      return this.dataList.map((v) => {
        const item = { ...v };
        delete item['edit'];
        // delete item["unId"];
        return item;
      });
    },
    // 表格弹窗选择
    tableDialogShow(row) {
      this.dialogSelectRow = row;
      if (this.$refs.tableDialog) {
        this.$refs.tableDialog.show();
      }
    },
    confirmSmSelect(selection) {
      if (selection.length == 0 || selection.length > 1) {
        this.$message.warning('请选择一条数据!');
      } else {
        this.$refs.tableDialog.handleCloseDialog();
        const dialogPropsArry = this.labelList.filter(
          (v) => v.compType && v.compType == 'dialogSelect'
        );
        if (this.$attrs?.tableDialogConfig?.searchProp) {
          const searchProp = this.$attrs.tableDialogConfig.searchProp;
          this.selectValue = selection[0][searchProp];
        }
        const unId = this.dialogSelectRow.unId;
        const findIndex = this.dataList.findIndex((v) => v.unId == unId);
        for (let i = 0; i < dialogPropsArry.length; i++) {
          console.log(dialogPropsArry, 'sfsf');
          const prop = dialogPropsArry[i].prop;
          if (selection[0][prop]) {
            this.$set(this.dataList[findIndex], prop, selection[0][prop]);
          }
        }
      }
    },
    // 特殊弹窗选择
    speciaDialogSelect(row) {
      this.$emit('speciaDialogSelect', row);
    }
  }
  // watch: {
  //   params: {
  //     handler(nVal) {
  //       this.pageInfo = {
  //         pageSize: this.pageInfo.pageSize,
  //         pageNo: this.pageInfo.pageNo,
  //         ...nVal,
  //       };
  //     },
  //     immediate: true,
  //     deep: true,
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.base-table-wrap {
  overflow-x: auto;
}
</style>
