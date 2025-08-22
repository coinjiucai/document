<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="[]"
      :showIndex="true"
      :showSelection="false"
      :listApi="['file', 'psyarchivemanagementPage']"
      @edit="edit"
      :editApi="['file', 'psyarchivemanagementSave']"
    >
      <template slot="userDictName_parent" slot-scope="scope">
        {{ getRylb(scope.row.userDictId) }}
      </template>
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >查看详情</el-link
        >
        <el-link
          style="margin-left: 10px"
          :underline="false"
          type="primary"
          @click="portrait(scope.row)"
          >人物画像</el-link
        >
      </template>
    </ListPage>
    <fileDetailDialog ref="fileDetailDialog"></fileDetailDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import fileDetailDialog from './fileDetailDialog';
import { mapGetters } from 'vuex';
export default {
  components: {
    ListPage,
    fileDetailDialog
  },
  data() {
    return {
      rylb: [],
      // 搜索参数
      params: {
        idNumber: '',
        userName: '',
        userDictId: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '姓名',
          compType: 'input',
          width: 160,
          placeholder: '姓名',
          prop: 'userName'
        },
        {
          label: '身份证号',
          compType: 'input',
          width: 160,
          placeholder: '身份证号',
          prop: 'idNumber'
        },
        {
          label: '人员类别',
          compType: 'select',
          width: 160,
          placeholder: '症状类型',
          dictCode: 'userType',
          prop: 'userDictId'
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '姓名',
          prop: 'userName',
          width: 160
        },
        {
          label: '身份证号',
          prop: 'idNumber'
        },
        {
          label: '人员类别',
          prop: 'userDictName',
          parent: 'userDictName_parent',
          special: true
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          width: 250,
          special: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    const query = this.$route.query;
    if (query.idNumber) {
      this.params.idNumber = query.idNumber;
    }
    if (query.userName) {
      this.params.userName = query.userName;
    }
    if (query.userDictId) {
      this.params.userDictId = query.userDictId;
    }
    this.getRylbList();
  },
  methods: {
    getRylb(val) {
      const item = this.rylb.find((v) => v.itemValue == val);
      if (item) {
        return item.itemText;
      } else {
        return '--';
      }
    },
    // 人员类别
    getRylbList() {
      this.$api.System.getDictionaryContentPageList({
        pageSize: 50,
        pageNumber: 1,
        dictCode: 'userType'
      }).then((res) => {
        const result = res.result;
        this.rylb = result.records;
      });
    },
    edit(record) {
      this.$refs.fileDetailDialog.edit(record);
    },

    portrait(row) {
      this.$router.push({
        path: '/person/portrait',
        query: {
          account: row.account,
          userId: row.userId, // 高id： 1897263788999438338
          ...this.params
        }
      });
    }
  }
};
</script>
