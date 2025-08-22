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
      :listApi="['source', 'psymusicsPage']"
      :deleteApi="['source', 'psymusicsDeleteBatch']"
      @edit="edit"
      :editApi="['source', 'psymusicsSave']"
      @add="add"
      :addApi="['source', 'psymusicsSave']"
    >
      <!-- <template v-slot:PageButtons>
        <div class="btn-type-1" @click="handleShowFileImport">导入</div>
        <FileImportDialog
          ref="fileImport"
          :model-url="modelUrl"
          model-name="心理音乐.xls"
          :tips="importTips"
          :file-type="'.xls,.xlsx'"
          :action-url="actionUrl"
          @success="getImportList"
        >
        </FileImportDialog>
      </template> -->
      <template slot="status_parent" slot-scope="scope">
        <span style="color: #409eff" v-if="scope.row.status == 1">
          <el-link type="primary">已发布</el-link>
        </span>
        <span style="color: #fff" v-else>未发布</span>
      </template>

      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)">
          <template v-if="scope.row.status == 1">查看音乐</template>
          <template v-else>编辑音乐</template>
        </el-link>
        <el-link
          v-if="scope.row.status == 0"
          :underline="false"
          type="primary"
          @click="publish(scope.row)"
          style="margin-left: 10px"
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
      destroy-on-close
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="120px"
        >
          <el-row :gutter="10">
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="音乐类别" prop="dictId">
                <FormItem
                  v-model="record.dictId"
                  compType="select"
                  dictCode="music_type"
                  :disabled="recordStatus == 1"
                ></FormItem>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="音乐名称" prop="name">
            <el-input
              v-model="record.name"
              placeholder="音乐名称"
              maxlength="30"
              :disabled="recordStatus == 1"
            ></el-input>
          </el-form-item>
          <el-form-item label="歌手" prop="singer">
            <el-input
              v-model="record.singer"
              placeholder="歌手"
              maxlength="30"
              :disabled="recordStatus == 1"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="imageUrl">
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
          <el-form-item label="上传附件" prop="file">
            <FormItem
              compType="upload"
              v-model="record.file"
              :limit="1"
              :showMode="1"
              :disabled="recordStatus == 1"
              accept=".mp3,.wav,.ogg,.m4a,.flac,.aac"
            ></FormItem>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" v-if="recordStatus == 0" @click="handleSave"
          >保存</el-button
        >
        <el-button type="primary" v-if="recordStatus == 0" @click="handlePbu"
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
          label: '音乐名称',
          compType: 'input',
          width: 160,
          placeholder: '音乐名称',
          prop: 'name'
        },
        {
          label: '音乐类别',
          compType: 'select',
          width: 160,
          dictCode: 'music_type',
          placeholder: '音乐类别',
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
        { label: '音乐名称', prop: 'name' },
        {
          label: '音乐类别',
          prop: 'type'
        },
        {
          label: '歌手',
          prop: 'singer'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      visibleDialog: false,
      recordStatus: 0,
      dialogTitle: '音乐管理',
      type: 'edit',
      dataList: [],
      sourceList: [],
      record: {
        status: 0, // // 状态 1 已发布 0 未发布
        dictId: '',
        name: '',
        singer: '',
        file: [],
        fileUrl: '',
        fileName: '',
        imageUrl: [] // 漫画封面
      },
      rules: {
        dictId: [
          { required: true, message: '请选择音乐分类', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入音乐名称', trigger: 'blur' }],
        singer: [{ required: true, message: '请输入歌手', trigger: 'blur' }],
        imageUrl: [
          { required: true, message: '请选择漫画封面', trigger: 'change' }
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
    add() {
      this.type = 'add';
      this.record = {
        status: 0,
        dictId: '',
        name: '',
        singer: '',
        file: [],
        imageUrl: [], // 漫画封面
        fileUrl: '',
        fileName: ''
      };
      this.recordStatus = 0;
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.record = { ...record, file: [] };
      this.recordStatus = record.status;
      if (this.record.fileUrl) {
        this.record['file'] = [
          {
            fileUrl: this.record.fileUrl,
            name: this.record.fileName
          }
        ];
      }
      if (this.record.imageUrl) {
        this.record['imageUrl'] = JSON.parse(record.imageUrl);
      } else {
        this.record['imageUrl'] = [];
      }

      this.visibleDialog = true;
    },

    handleCloseDialog() {
      console.log('bbbbbbb');
      this.visibleDialog = false;
      this.record = {
        status: 0,
        dictId: '',
        name: '',
        singer: '',
        file: [],
        fileUrl: '',
        fileName: ''
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.$refs.listPage.saveRow(
            {
              status: this.record.status,
              dictId: this.record.dictId,
              name: this.record.name,
              id: this.record.id,
              singer: this.record.singer,
              fileUrl:
                this.record.file && this.record.file.length > 0
                  ? this.record.file[0].fileUrl
                  : '',
              fileName:
                this.record.file && this.record.file.length > 0
                  ? this.record.file[0].name
                  : '',
              imageUrl: JSON.stringify(this.record.imageUrl)
            },
            '保存'
          );
          this.visibleDialog = false;
        }
      });
    },
    // 列表发布
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
    handlePbu() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.$refs.listPage.saveRow(
            {
              status: 1,
              dictId: this.record.dictId,
              name: this.record.name,
              id: this.record.id,
              singer: this.record.singer,
              fileUrl:
                this.record.file && this.record.file.length > 0
                  ? this.record.file[0].fileUrl
                  : '',
              fileName:
                this.record.file && this.record.file.length > 0
                  ? this.record.file[0].name
                  : ''
            },
            '发布成功'
          );
          this.visibleDialog = false;
        }
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
