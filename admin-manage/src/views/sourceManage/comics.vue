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
      :listApi="['source', 'psycomicsPage']"
      :deleteApi="['source', 'psycomicsDeleteBatch']"
      @edit="edit"
      :editApi="['source', 'psycomicsSave']"
      @add="add"
      :addApi="['source', 'psycomicsSave']"
    >
      <template v-slot:PageButtons>
        <div class="btn-type-1" @click="handleShowFileImport">导入</div>
        <FileImportDialog
          ref="fileImport"
          :model-url="modelUrl"
          model-name="心理漫画.xls"
          :tips="importTips"
          :file-type="'.xls,.xlsx'"
          :action-url="actionUrl"
          @success="getImportList"
        >
        </FileImportDialog>
      </template>
      <template slot="status_parent" slot-scope="scope">
        <span style="color: #409eff" v-if="scope.row.status == 1">已发布</span>
        <span style="color: #fff" v-else>未发布</span>
      </template>
      <template slot="imageUrl_parent" slot-scope="scope">
        <template
          v-if="scope.row.imageUrl && JSON.parse(scope.row.imageUrl).length > 0"
        >
          <el-image
            style="width: 30px; height: 30px"
            :src="getValue(scope.row.imageUrl)"
            fit="cover"
            :preview-src-list="[getValue(scope.row.imageUrl)]"
          ></el-image>
        </template>
        <template v-else>--</template>
      </template>
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)">
          <template v-if="scope.row.status == 1">查看漫画</template>
          <template v-else>编辑漫画</template>
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
    <BaseDialog
      class="full-block"
      :title="dialogTitle"
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
          :rules="rules"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="record.status"
              placeholder="请选择"
              style="width: 100%"
              :disabled="true"
            >
              <el-option label="已发布" :value="1"> </el-option>
              <el-option label="未发布" :value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="漫画名称" prop="name">
            <el-input
              v-model="record.name"
              placeholder="漫画名称"
              :disabled="recordStatus == 1"
            ></el-input>
          </el-form-item>
          <el-form-item label="漫画类别" prop="dictId">
            <FormItem
              v-model="record.dictId"
              compType="select"
              dictCode="comisType"
              :disabled="recordStatus == 1"
            ></FormItem>
          </el-form-item>
          <el-form-item label="漫画封面" prop="imageUrl">
            <FormItem
              compType="upload"
              v-model="record.imageUrl"
              :limit="1"
              :showMode="1"
              accept=".png,.jpg,.jpeg,.gif"
              title="上传"
              :disabled="recordStatus == 1"
            ></FormItem>
          </el-form-item>
          <el-form-item label="漫画文件" prop="fileUrl">
            <FormItem
              compType="upload"
              v-model="record.fileUrl"
              :limit="200"
              :showMode="1"
              accept=".png,.jpg,.jpeg,.gif"
              title="上传"
              :disabled="recordStatus == 1"
            ></FormItem>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          @click="handleSave(0)"
          v-if="record.status == 0"
          >保存</el-button
        >
        <el-button
          type="primary"
          @click="handleSave(1)"
          v-if="record.status == 0"
          >发布</el-button
        >
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import ImageUpload from '@/components/FileUpload/ImageUpload.vue';

export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload
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
          label: '漫画名称',
          compType: 'input',
          width: 160,
          placeholder: '漫画名称',
          prop: 'name'
        },
        {
          label: '漫画类别',
          compType: 'select',
          width: 160,
          dictCode: 'comisType',
          placeholder: '漫画类别',
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
        { label: '漫画名称', prop: 'name' },
        {
          label: '漫画类别',
          prop: 'type'
        },
        {
          label: '漫画封面',
          prop: 'imageUrl',
          parent: 'imageUrl_parent',
          special: true
        },
        { label: '更新时间', prop: 'updateTime' },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      recordStatus: 0,
      dialogTitle: '漫画详情',
      type: 'edit',
      dataList: [],
      sourceList: [],
      record: {
        status: 0,
        name: '',
        dictId: '',
        imageUrl: [], // 漫画封面
        fileUrl: [] // 漫画文件
      },
      rules: {
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        name: [{ required: true, message: '请输入漫画名称', trigger: 'blur' }],
        dictId: [
          { required: true, message: '请选择漫画分类', trigger: 'change' }
        ],
        imageUrl: [
          { required: true, message: '请选择漫画封面', trigger: 'change' }
        ],
        fileUrl: [
          { required: true, message: '请选择漫画文件', trigger: 'change' }
        ]
      },
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
    getValue(val) {
      const item = JSON.parse(val);
      const value = item[0].fileUrl;
      if (!value) {
        return '';
      }
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    add() {
      this.type = 'add';
      this.record = {
        status: 0,
        name: '',
        dictId: '',
        imageUrl: [], // 漫画封面
        fileUrl: [] // 漫画文件
      };
      this.recordStatus = 0;
      this.dialogTitle = '新增漫画';
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.dialogTitle = record.status == 1 ? '查看漫画' : '编辑漫画';
      this.record = {
        ...record,
        dictId: '' + record.dictId,
        imageUrl: JSON.parse(record.imageUrl),
        fileUrl: JSON.parse(record.fileUrl)
      };
      this.recordStatus = record.status;
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        status: 0,
        name: '',
        dictId: '',
        imageUrl: [], // 漫画封面
        fileUrl: [] // 漫画文件
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
            imageUrl: JSON.stringify(this.record.imageUrl),
            fileUrl: JSON.stringify(this.record.fileUrl)
          });
          this.visibleDialog = false;
        }
      });
    },
    // 发布
    publish(record) {
      this.$confirm('是否确认发布该漫画?', '提示', {
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
    },
    changeUpload(res) {
      this.record.imageUrl = res.message;
      console.log(res, 'ssss');
    }
  }
};
</script>
