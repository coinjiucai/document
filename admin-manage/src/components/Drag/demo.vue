<!-- <template>
	<div class="design-configuring-panel scrollBar">
					<draggable
				v-if="getDataSource().length > 0"
				v-model="dataSource"
				chosen-class="chosen-drag"
				ghost-class="ghost-drag"
				@update="updateSource"
			>
				<a-row
					v-for="item in getDataSource()"
					:key="item.formFieldId"
					:gutter="0"
					class="field-row"
				>
					<a-col :span="1">
						<a-checkbox
							:disabled="item.compType === 'dynamicTable' && item.disabled"
							:checked="!item.hidden && item.formFieldId ? true : false"
							@change="onChangeOne(item)"
						/>
					</a-col>
					<a-col
						class="field-text ellipsis mr4"
						:span="item.compType === 'dynamicTable' ? 16 : 18"
					>
						<img
							class="list-icon"
							src="@/assets/img/form-comp/drag.png"
						>
						<CompIcon
							v-if="item.compType"
							:comp-type="item.compType"
						/>{{
							isERP && item.parentId ? `${curDynamicTableName}.` : ''
						}}{{ item.dbFieldTxt }}
					</a-col>
					<a-col
						v-if="item.compType === 'dynamicTable'"
						class="operation-text"
						:span="2"
						@click="setDynamicTableColumn(item)"
					>
						设置
					</a-col>
					<a-col
						v-if="!isPhoneDesign"
						:class="item?.freeze ? 'is-freeze' : 'un-freeze'"
						:span="2"
						:title="item?.freeze ? '解除冻结' : '冻结'"
						@click="toggleFreeze(item)"
					/>
					<a-col
						v-show="isSummaryChecked"
						:span="2"
						class="flex-center"
					>
						<SummaryMethods
							v-if="item.compType !== 'dynamicTable'"
							:key="`${item.summaryMethod}${item.key}${uuidv4()}`"
							v-model="item.summaryMethod"
							:comp-type="item.compType"
							:is-need-position="false"
							:cur-item="item"
							@updateSummaryMethod="updateSummaryMethod"
						/>
					</a-col>
				</a-row>
			</draggable>
	</div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
const EVENT_TOGGLEFREEZE = 'onToggleFreeze'
const EVENT_SELECTCHANGE = 'onSelectChange'
const EVENT_DRAGEND = 'onDragEnd'
import draggable from 'vuedraggable'
import { cloneDeep, union } from 'lodash'
import CompIcon from '@/components/Icon/CompIcon'
import DragCheckedField from '../../components/DragCheckedFields.vue'
import FieldConfigureFilterCondition from '../../components/FieldConfigureFilterCondition.vue'
import SummaryMethods from '@/pages/appFormDesign/viewDesign/components/SummaryMethods.vue'
const DYNAMIC_TABLE = 'dynamicTable'
const setDynamicTableDisabled = columns => {
  let checkedDynamic = columns.filter(
    c => c.compType === DYNAMIC_TABLE && !c.hidden
  )
  let checkedDynamicIds = checkedDynamic.map(c => c.formFieldId)
  if (checkedDynamic?.length) {
    columns.forEach(v => {
      if (
        v.compType === DYNAMIC_TABLE &&
        !checkedDynamicIds.includes(v.formFieldId)
      ) {
        v.disabled = true
      }
    })
  } else {
    columns.forEach(item => {
      if (item.compType === DYNAMIC_TABLE) {
        item.disabled = false
      }
    })
  }
  return columns
}

const setParentId = (arr, parentId = null) => {
  return arr.map(c => {
    c.parentId = parentId
    if (c.children) {
      c.children = setParentId(c.children, c.formFieldId)
    }
    return { ...c }
  })
}

/**
 * 一维数组转换成带children的结构
 */
export const arrToTree = arr => {
  const result = []
  //判断参数是否为数组
  if (!Array.isArray(arr)) {
    return result
  }
  //防止参数对象数组中，存在children
  arr.forEach(item => {
    delete item.children
  })
  //id为key
  let map = new Map()
  arr.forEach(item => {
    map.set(item.formFieldId, item)
  })
  //parentId为父节点
  arr.forEach(item => {
    if (map.has(item.parentId)) {
      let parent = map.get(item.parentId)
      ;(parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  result.forEach(c => {
    if (c.compType === DYNAMIC_TABLE && c.children?.length) {
      c.sortNumber = c.children[0].sortNumber
    }
  })
  return result
}

/**
 * erp下转成一维数组，只拿显示(!hidden)的子表，返回一维数组
 */
const treeToArrayERP = node => {
  const nodeToArray = (node, arr) => {
    if (Array.isArray(node)) {
      node.forEach(c => nodeToArray(c, arr))
    } else {
      const { children, ...item } = node
      arr.push(item)
      !item.hidden &&
        children &&
        children.forEach(child => nodeToArray(child, arr))
    }
    return arr.sort((a, b) => a.sortNumber - b.sortNumber)
  }
  return nodeToArray(node, [])
}

// 在塞子表的时候，不需要再sortNumber排序了
const treeToArray = node => {
  const nodeToArray = (node, arr) => {
    if (Array.isArray(node)) {
      node.forEach(c => nodeToArray(c, arr))
    } else {
      const { children, ...item } = node
      arr.push(item)
      children && children.forEach(child => nodeToArray(child, arr))
    }
    return arr
  }
  return nodeToArray(node, [])
}

const getFlatArr = (val = []) => {
  let arr = setParentId(val)
  return treeToArray(arr)
}

export const getFlatArrERP = (val = []) => {
  let arr = setParentId(val)
  return treeToArrayERP(arr)
}

const findNodeById = (allActionButtons, id) => {
  for (let i = 0; i < allActionButtons.length; i++) {
    const node = allActionButtons[i]
    if (node.compType === DYNAMIC_TABLE) {
      // 如果是分组节点，则递归查找
      const found = findNodeById(node.children, id)
      if (found) {
        return found
      }
    } else if (node.formFieldId === id) {
      // 如果是按钮节点，则直接返回
      return node
    }
  }
}

export const filterDynamicFn = c => c.compType !== DYNAMIC_TABLE

export default {
  name: 'FieldConfiguring',
  components: {
    draggable,
    CompIcon,
    DragCheckedField,
    FieldConfigureFilterCondition,
    SummaryMethods
  },
  props: {
    columnsData: {
      type: Array,
      default: () => []
    },
    summaryEnabled: {
      type: Boolean,
      default: false
    },
    isPhoneDesign: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    getAppDesign: {
      value: 'getAppDesign',
      default: () => () => 'DEFAULT'
    }
  },
  data() {
    return {
      keyword: '',
      filterType: 'all',
      dataSource: [],
      // columns: [
      //   {
      //     title: '全部显示',
      //     dataIndex: 'dbFieldTxt',
      //     filteredValue: [],
      //     onFilter: (value, record) => record?.dbFieldTxt?.includes(value)
      //   },
      //   {
      //     title: '操作',
      //     align: 'center',
      //     dataIndex: 'operation',
      //     scopedSlots: { customRender: 'operation' }
      //   }
      // ],
      // dragstartObj: null // 记录开始拖拽时的行数据
      modalConfig: {
        title: '子表字段配置',
        visible: false,
        loading: false,
        currentTable: null,
        dynamicKeyword: ''
      },
      allFlatDataSource: [], // 包含子表外层拍平的
      showWhichDynamic: '',
      curDynamicTableName: '' // 当前子表名称，用于erp拍平下展示
    }
  },
  computed: {
    selectedKeys({ columnsData, isERP }) {
      const keys = []
      const key = this.keyword.trim()
      let realColumns = columnsData
      if (isERP) {
        realColumns = getFlatArrERP(columnsData).filter(filterDynamicFn)
      }
      realColumns.forEach(item => {
        if (!item.hidden && item.formFieldId && item.dbFieldTxt.includes(key)) {
          keys.push(item.formFieldId)
        }
      })
      return keys
    },
    isSummaryChecked: {
      get({ summaryEnabled }) {
        return summaryEnabled
      },
      set(val) {
        return val
      }
    },
    isERP({ getAppDesign }) {
      return getAppDesign() === 'ERP'
    },
    dynamicTableDataSource({ columnsData }) {
      return columnsData.filter(c => c.compType === DYNAMIC_TABLE)
    }
  },
  watch: {
    columnsData: {
      handler(val) {
        let presetDataSource = setDynamicTableDisabled(val)
        this.setDataSource(cloneDeep(presetDataSource))
      },
      deep: true
    },
    showWhichDynamic(newVal) {
      let dataSource = cloneDeep(this.columnsData)
      dataSource.forEach(c => {
        if (c.compType === DYNAMIC_TABLE) {
          c.hidden = c.formFieldId !== newVal
          if (c.formFieldId === newVal) {
            this.curDynamicTableName = c.dbFieldTxt
          }
        }
      })
      // console.warn(dataSource, 'dataSource00000')
      this.$emit(EVENT_SELECTCHANGE, dataSource)
    }
  },
  created() {
    this.dataSource = setDynamicTableDisabled(this.columnsData)
    this.setDataSource(this.dataSource)
    // console.warn(
    //   this.getAppDesign(),
    //   'this.getAppDesign',
    //   this.columnsData,
    //   this.isERP
    // )
  },
  methods: {
    uuidv4,
    getDataSource() {
      const key = this.keyword.trim()
      const { dataSource, filterType, isERP } = this
      let resultDataSource = dataSource
      if (filterType !== 'all') {
        resultDataSource = resultDataSource.filter(c => {
          return filterType === 'hidden' ? c.hidden : !c.hidden
        })
      }
      return resultDataSource.filter(item => item.dbFieldTxt.includes(key))
    },
    getDataSourceWithoutDisabled() {
      const key = this.keyword.trim()
      const { dataSource, filterType } = this
      let resultDataSource = dataSource
      if (filterType !== 'all') {
        resultDataSource = resultDataSource.filter(c => {
          return filterType === 'hidden' ? c.hidden : !c.hidden
        })
      }
      return resultDataSource.filter(
        item => item.dbFieldTxt.includes(key) && !item?.disabled
      )
    },
    onChangeSelectAll(val) {
      const checked = val.target.checked
      const key = this.keyword.trim()
      const dataSource = [...this.columnsData]
      // dataSource.forEach(item => {
      //   item.hidden = !checked
      // })
      if (this.isERP) {
        const setChecked = (arr, checked) => {
          arr.forEach(v => {
            if (v.compType === DYNAMIC_TABLE) {
              if (v.hidden === false) {
                v.children?.length && setChecked(v.children, checked)
              }
            } else {
              if (v.dbFieldTxt.includes(key)) {
                v.hidden = !checked
              }
            }
          })
        }
        setChecked(dataSource, checked)
        // console.error(dataSource, 'dataSource0.0.0.0.0.', checked)
      } else {
        let isCheckedDynamicTable = dataSource.some(
          c => c.compType === DYNAMIC_TABLE && !c.hidden
        )
        dataSource.forEach(item => {
          if (checked) {
            if (item.dbFieldTxt.includes(key)) {
              if (!isCheckedDynamicTable && item.compType === DYNAMIC_TABLE) {
                item.hidden = false
                isCheckedDynamicTable = true
                return
              }
              if (item.compType !== DYNAMIC_TABLE) {
                item.hidden = false
                return
              }
              if (item.hidden) {
                item.disabled = true
              }
            }
          } else {
            if (item.compType === DYNAMIC_TABLE && item?.disabled) {
              item.disabled = false
            }
            if (item.dbFieldTxt.includes(key)) {
              item.hidden = true
            }
          }
        })
      }

      this.$emit(EVENT_SELECTCHANGE, dataSource)
    },
    onChangeOne(item) {
      item.hidden = !item.hidden
      let dataSource = [...this.columnsData]
      if (!this.isERP) {
        dataSource.forEach(v => {
          const formFieldId = v.formFieldId
          const item = this.dataSource.find(
            item => item.formFieldId === formFieldId
          )
          if (item) {
            v.hidden = item.hidden
          } else {
            v.hidden = true
          }
        })
      } else {
        const setHidden = (arr, val) => {
          arr.forEach(c => {
            if (c.formFieldId === val.formFieldId) {
              c.hidden = val.hidden
            }
            c.children?.length && setHidden(c.children, val)
          })
        }
        setHidden(dataSource, item)
      }

      if (item.compType === DYNAMIC_TABLE) {
        dataSource = setDynamicTableDisabled(dataSource)
      }
      this.$emit(EVENT_SELECTCHANGE, dataSource)
    },
    toggleFreeze(record) {
      let dataSource = []
      const setFreeze = (arr, record) => {
        arr.forEach(c => {
          if (c.compType === DYNAMIC_TABLE && c.children?.length) {
            setFreeze(c.children, record)
          }
          c.freeze =
            c.formFieldId === record.formFieldId ? !record.freeze : false
        })
      }
      if (this.isERP) {
        dataSource = cloneDeep(this.columnsData)
        setFreeze(dataSource, record)
      } else {
        dataSource = [...this.dataSource]
        dataSource.forEach(item => {
          if (record.formFieldId === item.formFieldId) {
            item.freeze = !record.freeze
          } else {
            item.freeze = false
          }
        })
      }

      this.$emit(EVENT_TOGGLEFREEZE, dataSource)
    },
    updateSource({ to, from, item, clone, oldIndex, newIndex }) {
      let dataSource = [...this.dataSource]
      // console.warn(JSON.parse(JSON.stringify(dataSource)), '-1-1-1')
      // 调正序号
      dataSource.forEach((item, index) => (item.sortNumber = index))
      // console.warn(JSON.parse(JSON.stringify(dataSource)), '000')
      if (this.isERP) {
        let flatArr = getFlatArr(this.columnsData)
        flatArr.forEach(el => {
          let item = dataSource.find(item => item.formFieldId == el.formFieldId)
          if (item) {
            el.sortNumber = item.sortNumber
          }
        })
        // console.error(JSON.parse(JSON.stringify(dataSource)), '7777777')
        dataSource = arrToTree(flatArr)
        // console.warn(
        //   this.dataSource,
        //   'this.dataSource',
        //   this.allFlatDataSource,
        //   'dataSource',
        //   dataSource,
        //   'flatArr:',
        //   flatArr
        // )
      } else {
        let flatDataSource = getFlatArr(cloneDeep(dataSource))
        let dataSourceExcludeDynamic = flatDataSource.filter(filterDynamicFn)
        dataSourceExcludeDynamic.forEach((c, i) => (c.sortNumber = i))
        dataSource = union(flatDataSource, dataSourceExcludeDynamic)
        dataSource = arrToTree(dataSource)
      }

      this.$emit(EVENT_DRAGEND, dataSource)
    },
    setDynamicTableColumn(record) {
      this.modalConfig.currentTable = cloneDeep(record)
      this.modalConfig.visible = true
      this.modalConfig.title = `${record?.dbFieldTxt ?? '子表'}字段配置`
    },
    resetForm() {
      this.modalConfig.currentTable = null
      this.modalConfig.dynamicKeyword = ''
      this.modalConfig.filterType = 'all'
      this.modalConfig.visible = false
    },
    modalOk() {
      const dataSource = [...this.dataSource]
      let replaceIndex = dataSource.findIndex(
        c => c.formFieldId === this.modalConfig.currentTable.formFieldId
      )
      if (replaceIndex > -1) {
        dataSource[replaceIndex] = this.modalConfig.currentTable
      }
      this.$emit(EVENT_DRAGEND, dataSource)
      this.resetForm()
    },
    dynamicDragUpdate(item) {
      this.modalConfig.currentTable.children = cloneDeep(item)
    },
    dynamicCheckChangeOne(item) {
      this.modalConfig.currentTable.children = cloneDeep(item)
    },
    onChangeSummaryCheck(checked) {
      this.$emit('update:summaryEnabled', checked)
    },
    setDataSource(val = []) {
      if (this.isERP) {
        this.allFlatDataSource = getFlatArrERP(val)
        this.dataSource = this.allFlatDataSource.filter(filterDynamicFn)
        let showItem = this.dynamicTableDataSource.find(c => !c.hidden)
        if (showItem) {
          this.showWhichDynamic = showItem.formFieldId
        }
      } else {
        this.dataSource = val
      }
    },
    toggleSelectValue(formFieldId) {
      if (this.showWhichDynamic === formFieldId) {
        this.showWhichDynamic = ''
      }
    },
    updateSummaryMethod(curItem) {
      // if (!this.isERP) return
      let dataSource = [...this.columnsData]
      const setSummaryMethod = (arr, val) => {
        arr.forEach(c => {
          if (c.formFieldId === val.formFieldId) {
            c.summaryMethod = val.summaryMethod
          }
          c.children?.length && setSummaryMethod(c.children, val)
        })
      }
      setSummaryMethod(dataSource, curItem)
      this.$emit(EVENT_SELECTCHANGE, dataSource)
    }
  }
}
</script>
<style lang="less">
.design-configuring-panel,
.dynamicSettingsModal {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .search-bar {
    margin: 8px 24px 12px;
    .ant-input {
      width: 100%;
      background: #f5f6f8;
      border: none;
    }
  }
}
</style>
<style lang="less" scoped>
.summary-title {
  word-break: keep-all;
}
.search-icon-pre {
  width: 18px;
}
.search-bar {
  ::v-deep .ant-input {
    padding-left: 42px;
    box-shadow: none;
  }
}
.dynamicSettingsModal {
  ::v-deep .ant-modal-body {
    .field-selections {
      position: unset;
    }
  }
}
.field-selections {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 54px;
  top: 44px;
  margin: 0 24px;
  padding: 6px 12px 12px;
  background: #f5f6f8;
  border-radius: 4px;
  overflow-y: auto;
  box-sizing: border-box;
  .ant-row {
    display: flex;
    height: 36px;
    margin-top: 6px;
    background: #fff;
    margin-left: 0px !important;
    margin-right: 0px !important;
    line-height: 36px;
    border-radius: 2px;
    padding-left: 12px;
    cursor: move;
  }
  > div:nth-child(1) {
    cursor: default;
  }
  .field-row {
    // cursor: pointer;
    > div:nth-child(1) {
      margin-right: 24px;
    }
    &:hover {
      .list-icon {
        display: inline-block;
      }
    }
  }
}
.erp-field-selections {
  top: 110px;
}
.dynamic-title {
  padding-left: 24px;
  .cursor {
    cursor: pointer;
  }
}
.dynamic-radio {
  width: 100%;
  overflow: auto hidden;
  padding: 8px 24px 0;
  white-space: nowrap;
}
.gutter-row {
  font-weight: bold;
  color: #16191d;
  font-size: 14px;
}
.field-text {
  font-size: 14px;
  color: #16191d;
  display: flex;
  align-items: center;
}
.list-icon {
  display: none;
  width: 6px;
  margin-right: 12px;
}
.is-freeze,
&.un-freeze {
  width: 18px;
  background: url('~@/assets/img/dyncmicTableIcon/lock.png') center no-repeat;
  background-size: 100%;
  background-position: center;
}
.un-freeze {
  background: url('~@/assets/img/dyncmicTableIcon/unlock.png') center no-repeat;
  background-size: 100%;
}
.operation-text {
  color: #057aff;
  user-select: none;
  &:hover {
    cursor: pointer;
  }
}
.tip {
  position: absolute;
  bottom: 22px;
  left: 24px;
  // margin-top: 10px;
  font-size: 12px;
  color: #ccc;
}
</style> -->
