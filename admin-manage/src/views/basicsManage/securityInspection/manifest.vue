<template>
  <div class="mainfest theme-background-middle flex-layout full-block pa10">
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :listApi="['System', 'checklistPageList']"
      :deleteApi="['System', 'batchChecklistDelete']"
      @edit="edit"
      :editApi="['System', 'checklistSave']"
      @add="add"
      :addApi="['System', 'checklistSave']"
    >
      <template v-slot:PageButtons></template>

      <template slot="actionParent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >查看详情</el-link
        >
      </template>
    </ListPage>

    <BaseDialog
      class="full-block"
      title="清单检查"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="800px"
      top="20vh"
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          label-position="right"
          label-width="120px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="类型">
                <FormItem
                  dictCode="check_plan_type"
                  compType="select"
                  v-model="record.checkType"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检查清单名称">
                <el-input v-model="record.checklistName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="record.createTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input v-model="record.createBy" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <div style="height: 300px">
              <ListPage
                ref="batchCheckContent"
                :buttonList="['add', 'edit', 'delete']"
                addText="添加内容"
                deleteText="删除明细"
                editText="编辑内容"
                :labelList="[{ label: '检查内容', prop: 'checkContent' }]"
                :showPagination="false"
                :searchStyle="{ 'text-align': 'left' }"
                :isInnerGet="false"
                @edit="editItemList"
              >
                <template v-slot:PageButtons></template>
              </ListPage>
            </div>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
    <BaseDialog
      class="full-block"
      title="检查项编辑"
      center
      :visible.sync="visibleDialog2"
      @close="visibleDialog2 = false"
      width="500px"
      top="20vh"
    >
      <div style="height: 300px">
        <ListPage
          ref="itemList"
          :buttonList="['add', 'delete']"
          addText="添加"
          deleteText="删除"
          :labelList="[{ label: '检查项', prop: 'itemName' }]"
          :showPagination="false"
          :searchStyle="{ 'text-align': 'left' }"
          :isInnerGet="false"
        >
        </ListPage>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave2">确定</el-button>
        <el-button type="info" @click="visibleDialog2 = false">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
// import { isArray, isObject } from "@/utils/utils";
import FormItem from '@/components/Form/Item';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem
  },
  data() {
    return {
      // 搜索参数
      params: {
        checklistName: '',
        checkType: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '检查清单名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入清单名称',
          prop: 'checklistName'
        },
        {
          label: '产品类型',
          compType: 'select',
          width: 160,
          prop: 'checkType',
          dictCode: 'check_plan_type'
        }
      ],
      // 表格字段列配置
      labelList: [
        {
          label: '检查清单类型',
          prop: 'checkType'
        },
        { label: '检查清单名称', prop: 'checklistName' },
        { label: '创建时间', prop: 'createTime' },
        { label: '创建人', prop: 'createBy' },
        {
          label: '操作',
          prop: 'action',
          parent: 'actionParent',
          special: true
        }
      ],
      visibleDialog: false,
      dialogTitle: '产品入库登记',
      record: {
        checkType: '',
        checklistName: '',
        createTime: '',
        createBy: '',
        contentList: []
      },
      visibleDialog2: false,
      row: []
    };
  },
  methods: {
    add() {
      this.record = {
        checkType: '',
        checklistName: '',
        createTime: '',
        createBy: '',
        createByName: '',
        contentList: []
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.record = { ...record };
      this.visibleDialog = true;
      this.$nextTick(() => {
        const list = record.contentList;
        this.$refs.batchCheckContent.setList(list, list.length);
      });
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        checkType: '',
        checklistName: '',
        createTime: '',
        contentList: []
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave() {
      const batchList = this.$refs.batchCheckContent.getDataList();
      this.record.contentList = batchList;
      this.$refs.form.validate((val) => {
        if (val) {
          this.$refs.listPage.saveRow({ ...this.record });
          this.visibleDialog = false;
        }
      });
    },
    editItemList(row) {
      this.row = row;
      this.visibleDialog2 = true;
      this.$nextTick(() => {
        if (row.itemList) {
          this.$refs.itemList.dataList = row.itemList;
          this.$refs.itemList.setList(row.itemList, row.itemList.length);
        } else {
          this.$refs.itemList.setList([], 0);
        }
      });
    },
    handleSave2() {
      const batchList = this.$refs.itemList.getDataList();
      this.$set(this.row, 'itemList', batchList);
      this.visibleDialog2 = false;
    }
  }
};
</script>
