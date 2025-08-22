<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['add', 'delete']"
      :listApi="['analysis', 'psytaskPages']"
      :deleteApi="['analysis', 'psytaskDeleteBatch']"
      @edit="edit"
      @add="add"
    >
      <template slot="status_parent" slot-scope="scope">
        <span v-if="scope.row.status == 0">未下发</span>
        <el-link
          :underline="false"
          type="primary"
          v-else-if="scope.row.status == 1"
          >已下发</el-link
        >
      </template>
      <template slot="rwTime_parent" slot-scope="scope">
        <span v-if="scope.row.startTime && scope.row.endTime"
          >{{ formatVal(scope.row.startTime) }}至{{
            formatVal(scope.row.endTime)
          }}</span
        >
        <span v-else>--</span>
      </template>

      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
        >
      </template>
    </ListPage>
    <editTopic
      ref="editTopic"
      @refresh="$refs.listPage.handleSearch()"
      @finished="finished"
    ></editTopic>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import rangeBothValue from '@/components/Date/rangeBothValue';
import editTopic from './components/editTopic';
import moment from 'moment';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    rangeBothValue,
    editTopic
  },
  data() {
    return {
      // 搜索参数
      params: {
        status: '', // 任务状态
        taskCode: '', // 任务代码
        name: '' // 任务名称
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '任务状态',
          compType: 'select',
          width: 160,
          placeholder: '任务状态',
          options: [
            {
              label: '未下发',
              value: 0
            },
            {
              label: '已下发',
              value: 1
            }
          ],
          prop: 'status',
          clearable: true
        },
        {
          label: '任务代码',
          compType: 'input',
          width: 160,
          placeholder: '任务代码',
          prop: 'taskCode',
          clearable: true
        },
        {
          label: '任务名称',
          compType: 'input',
          width: 160,
          placeholder: '任务名称',
          prop: 'name',
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '状态',
          prop: 'status',
          parent: 'status_parent',
          special: true
        },
        {
          label: '任务代码',
          prop: 'taskCode'
        },
        {
          label: '任务名称',
          prop: 'name'
        },
        {
          label: '任务时间',
          prop: 'rwTime',
          parent: 'rwTime_parent',
          special: true
        },
        {
          label: '任务对象',
          prop: 'groupName'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      item: null
    };
  },
  mounted() {},
  methods: {
    formatVal(val) {
      return moment(val).format('YYYY-MM-DD HH:mm');
    },
    add() {
      this.$refs.editTopic.show();
    },
    edit(record) {
      this.item = record;
      this.$api.analysis
        .psytaskTaskInfo({
          id: record.id
        })
        .then((res) => {
          const result = res.result;
          const newData = this.replaceNullWithEmptyString(result);
          this.$refs.editTopic.show(newData);
        });
    },
    replaceNullWithEmptyString(obj) {
      if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            obj[i] = this.replaceNullWithEmptyString(obj[i]);
          }
        } else {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (obj[key] === null) {
                obj[key] = '';
              } else {
                obj[key] = this.replaceNullWithEmptyString(obj[key]);
              }
            }
          }
        }
      }
      return obj;
    },
    finished(record) {
      console.log(record);
      this.$api.analysis
        .psytaskTaskInfo({
          id: record.id
        })
        .then((res) => {
          const result = res.result;
          this.$refs.editTopic.show({
            ...result,
            status: record.status
          });
          this.$message.success('一键任务已完成');
        });
    }
  }
};
</script>
