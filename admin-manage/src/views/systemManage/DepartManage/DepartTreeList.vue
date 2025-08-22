<template>
  <div class="component-DepartManage flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="组织架构"
      node-key="id"
      :tree-data.sync="treeList"
      :get-url="['System', 'psysysdepartTreeList']"
      :delete-url="['System', 'sysprivacyuserDeleteBatch']"
      :disabledOption="true"
      :default-props="{ label: 'name', value: 'id', children: 'childrenList' }"
      @current-change="handleCurrentChange"
    >
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle flex-layout pa10">
      <ListPage
        ref="listPage"
        :params="params"
        :fieldsConfig="fieldsConfig"
        :labelList="labelList"
        :buttonList="[]"
        :selectLimit="selectLimit"
        :listApi="['basics', 'userList']"
        @selectRowList="selectRowList"
      >
      </ListPage>
    </div>
  </div>
</template>

<script>
import LeftCatalogue from '@/components/Project/LeftCatalogue';
import BaseTable from '@/components/Base/BaseTable';
import ListPage from '@/components/ListPage';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import FormItem from '@/components/Form/Item';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';
import Common from '@/com/common';
export default {
  name: 'DepartManage',
  components: {
    LeftCatalogue,
    BaseTable,
    ListPage,
    FileImportDialog,
    FormItem,
    ImageUpload
  },
  props: {
    selectLimit: { type: Number, default: 0 }
  },
  data() {
    return {
      treeList: [],
      // 搜索参数
      params: {
        realname: '',
        idCard: '',
        age: '',
        sex: '',
        telephone: '',
        departId: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '姓名',
          compType: 'input',
          width: 160,
          placeholder: '姓名',
          prop: 'realname'
        },
        {
          label: '身份证号',
          compType: 'input',
          width: 160,
          placeholder: '身份证号',
          prop: 'idCard'
        },
        {
          label: '年龄',
          compType: 'input',
          width: 160,
          placeholder: '年龄',
          prop: 'age'
        },
        {
          label: '性别',
          compType: 'select',
          width: 160,
          prop: 'sex',
          dictCode: 'sex'
        },
        {
          label: '联系方式',
          compType: 'input',
          width: 160,
          placeholder: '联系方式',
          prop: 'telephone'
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '姓名', prop: 'realname' },
        { label: '身份证号', prop: 'idCard' },
        { label: '年龄', prop: 'age' },
        {
          label: '性别',
          prop: 'sex_dictText'
        },
        { label: '联系方式', prop: 'telephone' },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      selection: []
    };
  },
  created() {},
  mounted() {
    this.getRoleList();
  },
  filters: {},
  watch: {},
  computed: {
    currentDepartName() {
      if (this.treeList.length && this.params.departId) {
        let departName = '';
        Common.depthFirstSearch(this.treeList, (item) => {
          if (item.id === this.params.departId) {
            departName = item.departName;
          }
        });
        return departName;
      } else {
        return '';
      }
    }
  },
  methods: {
    handleInputNoChinese(value) {
      // 使用正则表达式替换所有中文字符
      this.record.username = value.replace(/[\u4e00-\u9fa5]/g, '');
    },
    /**
     * 单位保存成功后重新获取单位列表
     */
    handleReloadTree() {
      this.$refs.catalogue.getTree();
    },
    /**
     * 单位变更
     */
    handleCurrentChange(data) {
      this.params.departId = data['id'];
      const listPage = this.$refs.listPage;
      listPage.pageInfo.pageNo = 1;
      listPage.getList();
    },
    getRoleList() {
      this.$api.System.getAllRole().then((res) => {
        this.roleList = res.result;
      });
    },
    // 选中的行
    selectRowList(selection) {
      this.selection = selection;
      this.$emit('selectRowList', selection);
    }
  }
};
</script>

<style lang="scss" scoped>
.component-DepartManage {
}
</style>
