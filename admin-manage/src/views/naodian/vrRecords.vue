<template>
  <div
    class="training-manage theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="[]"
      :listApi="['analysis', 'uservrtrainrecordsPage']"
      :deleteApi="['analysis', 'uservrtrainrecordsDeleteBatch']"
      @edit="edit"
      :editApi="['analysis', 'uservrtrainrecordsSave']"
      @add="add"
      :addApi="['analysis', 'uservrtrainrecordsSave']"
    >
      <template slot="imageUrl_parent" slot-scope="scope">
        <el-image
          style="width: 50px; height: 50px"
          :src="getValue(scope.row.imageUrl)"
          fit="cover"
          v-if="scope.row.imageUrl"
          :preview-src-list="[getValue(scope.row.imageUrl)]"
        ></el-image>
        <span v-else>--</span>
      </template>
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >查看</el-link
        >
      </template>
    </ListPage>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import BaseTable from '@/components/Base/BaseTable';
import BaseQuillEditor from '@/views/basicsManage/questionBankManage/components/BaseQuillEditor.vue';
import moment from 'moment';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    BaseTable,
    BaseQuillEditor
  },
  data() {
    return {
      // 搜索参数
      params: {
        userName: '', // 姓名
        queryStartTime: '', //
        queryEndTime: '', //
        range: []
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '用户名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入',
          prop: 'userName',
          clearable: true
        },
        {
          label: '时间选择',
          compType: 'daterange',
          width: 160,
          placeholder: '时间选择',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          prop: 'range',
          valueFormat: 'yyyy-MM-dd',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          },
          clearable: true
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '训练类型',
          prop: 'trainType'
        },
        {
          label: '训练名称',
          prop: 'trainName'
        },
        {
          label: '等级',
          prop: 'level',
          formatter: (val) => {
            // 简单  中等 困难 挑战
            if (val == 0) {
              return '简单';
            } else if (val == 1) {
              return '中等';
            } else if (val == 2) {
              return '困难';
            } else if (val == 3) {
              return '挑战';
            }
            return '--';
          }
        },
        {
          label: '训练时间',
          prop: 'startTime'
        },
        {
          label: '训练耗时',
          prop: 'totalTime',
          formatter: (val) => {
            return this.formatSeconds(val);
          }
        },
        {
          label: '脑电报告',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ]
    };
  },
  mounted() {},
  methods: {
    formatSeconds(seconds) {
      if (seconds < 60) {
        // 不足1分钟，直接显示秒
        return `${seconds}秒`;
      } else if (seconds < 3600) {
        // 不足1小时，显示 "分:秒"
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}分${secs}秒`;
      } else {
        // 超过1小时，显示 "时:分:秒"
        const hours = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        return `${hours}时${mins}分${secs}秒`;
      }
    },

    getValue(value) {
      if (!value) {
        return '';
      }
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    }
  }
};
</script>
