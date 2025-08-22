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
      :listApi="['source', 'psynewsPage']"
      :deleteApi="['source', 'psynewsDeleteBatch']"
      @edit="edit"
      :editApi="['source', 'psynewsSave']"
      @add="add"
      :addApi="['source', 'psynewsSave']"
    >
      <!-- <template v-slot:PageButtons>
        <div class="btn-type-1" @click="handleShowFileImport">导入</div>
        <FileImportDialog
          ref="fileImport"
          :model-url="modelUrl"
          model-name="心理资讯.xls"
          :tips="importTips"
          :file-type="'.xls,.xlsx'"
          :action-url="actionUrl"
          @success="getImportList"
        >
        </FileImportDialog>
      </template> -->
      <template slot="status_parent" slot-scope="scope">
        <span style="color: #409eff" v-if="scope.row.status == 1">已发布</span>
        <span style="color: #fff" v-else>未发布</span>
      </template>
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)">
          <template v-if="scope.row.status == 1">查看资讯</template>
          <template v-else>编辑资讯</template>
        </el-link>
        <el-link
          :underline="false"
          type="primary"
          @click="publish(scope.row)"
          style="margin-left: 10px"
          v-if="scope.row.status != 1"
          >发布</el-link
        >
      </template>
    </ListPage>
    <!-- 弹窗 -->
    <div v-if="visibleDialog">
      <BaseDialog
        class="full-block"
        :title="dialogTitle"
        center
        :visible.sync="visibleDialog"
        @close="handleCloseDialog"
        width="1200px"
        top="5vh"
      >
        <div class="full-block">
          <el-form
            ref="form"
            :model="record"
            :rules="rules"
            label-position="right"
            label-width="120px"
          >
            <el-row>
              <el-col :span="12"
                ><el-form-item label="状态" prop="status">
                  <el-select
                    v-model="record.status"
                    placeholder="请选择"
                    style="width: 100%"
                    :disabled="true"
                  >
                    <el-option label="已发布" :value="1"> </el-option>
                    <el-option label="未发布" :value="0"> </el-option>
                  </el-select> </el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="资讯分类" prop="dictId">
                  <FormItem
                    v-model="record.dictId"
                    compType="select"
                    dictCode="consultType"
                    :disabled="recordStatus == 1"
                  ></FormItem> </el-form-item
              ></el-col>
            </el-row>

            <el-form-item label="资讯名称" prop="name">
              <el-input
                v-model="record.name"
                placeholder="资讯名称"
                maxlength="100"
                show-word-limit
                :disabled="recordStatus == 1"
              ></el-input>
            </el-form-item>

            <el-form-item label="详情" prop="introduction">
              <div style="height: 500px">
                <TinyMceEditor
                  height="500px"
                  v-model="record['introduction']"
                  :disabled="recordStatus == 1"
                ></TinyMceEditor>
              </div>
            </el-form-item>

            <el-form-item label="上传附件">
              <FormItem
                compType="upload"
                v-model="record.fileUrl"
                :limit="1"
                :showMode="1"
                :disabled="recordStatus == 1"
              ></FormItem>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer">
          <el-button
            type="primary"
            @click="handleSave(0)"
            v-if="recordStatus != 1"
            >保存</el-button
          >
          <el-button
            type="primary"
            @click="handleSave(1)"
            v-if="recordStatus != 1"
            >发布</el-button
          >
          <el-button type="info" @click="handleCloseDialog">取消</el-button>
        </span>
      </BaseDialog>
    </div>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';

import TinyMceEditor from '@/components/TinyMceEditor.vue';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    TinyMceEditor
  },
  data() {
    return {
      // 搜索参数
      params: {
        status: '',
        name: '',
        dictId: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '状态',
          compType: 'select',
          options: [
            {
              label: '已发布',
              value: 1
            },
            {
              label: '未发布',
              value: 0
            }
          ],
          width: 160,
          placeholder: '状态',
          prop: 'status'
        },
        {
          label: '资讯名称',
          compType: 'input',
          width: 160,
          placeholder: '资讯名称',
          prop: 'name'
        },
        {
          label: '资讯分类',
          compType: 'select',
          width: 160,
          dictCode: 'consultType',
          placeholder: '资讯分类',
          prop: 'dictId'
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
          label: '资讯类别',
          prop: 'type'
        },
        { label: '资讯名称', prop: 'name' },
        { label: '编辑人', prop: 'updateBy' },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      recordStatus: 0,
      dialogTitle: '添加资讯',
      type: 'edit',
      dataList: [],
      sourceList: [],
      renewFlag: 0,
      ss: '',
      record: {
        status: 0, // 状态 1 已发布 0 未发布
        dictId: '',
        name: '',
        introduction: '',
        fileUrl: []
      },
      rules: {},
      importTips: [
        '请严格参照模板规范进行导入;',
        '一次只能导入一个不超过20MB大小的excel文件;',
        '支持的excel格式有.xls与.xlsx'
      ],
      modelUrl: '', // 下载模板
      actionUrl: '' // 导入接口
    };
  },
  mounted() {
    this.modelUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psypaper/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-counsel-service/psypaper/import`;
  },
  methods: {
    add() {
      this.type = 'add';
      this.record = {
        status: 0,
        dictId: '',
        name: '',
        introduction: '',
        fileUrl: []
      };
      this.dialogTitle = '添加资讯';
      this.recordStatus = 0;
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.dialogTitle = '资讯详情';
      this.$api.source
        .getPsynewsById({
          id: record.id
        })
        .then((res) => {
          const result = res.result;
          var fileUrl = [];
          if (result.fileUrl) {
            fileUrl = JSON.parse(result.fileUrl);
          }
          this.record = {
            ...record,
            fileUrl: fileUrl
          };
          this.recordStatus = result.status;
          this.visibleDialog = true;
        });
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        status: 0,
        dictId: '',
        name: '',
        introduction: '',
        fileUrl: []
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave(status) {
      this.$refs.form.validate((val) => {
        if (val) {
          this.$refs.listPage.saveRow({
            ...this.record,
            status: status,
            fileUrl: JSON.stringify(this.record.fileUrl)
          });
          this.visibleDialog = false;
        }
      });
    },
    // 发布
    publish(record) {
      this.$confirm('是否确认发布该资讯?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.listPage
          .saveRow({
            ...record,
            status: 1
          })
          .then((res) => {
            this.$refs.listPage.handleSearch();
            this.$message.success('发布成功');
          });
      });
    },
    handleShowFileImport() {
      this.$refs.fileImport.visibleDialog = true;
    },
    // 导入
    getImportList(response, file) {
      console.log(response, file);
    }
  }
};
</script>
