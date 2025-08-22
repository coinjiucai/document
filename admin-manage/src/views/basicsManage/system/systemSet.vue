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
      :listApi="['basics', 'psycounselcarouselPage']"
      :deleteApi="['basics', 'psycounselcarouselDeleteBatch']"
      :showIndex="false"
      @edit="edit"
      :editApi="['basics', 'psycounselcarouselSave']"
      @add="add"
      :addApi="['basics', 'psycounselcarouselSave']"
    >
      <template slot="imageUrl_parent" slot-scope="scope">
        <el-image
          style="width: 120px; height: 60px"
          :src="getFullUrl(scope.row.imageUrl)"
          fit="cover"
          v-if="scope.row.imageUrl"
          :preview-src-list="[getFullUrl(scope.row.imageUrl)]"
        ></el-image>
        <span v-else>--</span>
      </template>
      <template slot="introduction_parent" slot-scope="scope">
        <div
          v-html="
            scope.row.introduction.length > 0
              ? scope.row.introduction.slice(0, 50) + '...'
              : scope.row.introduction
          "
          style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
        ></div>
      </template>

      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
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
      width="1200px"
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
          <el-form-item label="排序" prop="sort">
            <el-input v-model="record.sort" placeholder="排序"></el-input>
          </el-form-item>
          <el-form-item label="标题名称" prop="title">
            <el-input v-model="record.title" placeholder="标题名称"></el-input>
          </el-form-item>
          <el-form-item label="简介内容" prop="introduction">
            <BaseQuillEditor
              v-model="record['introduction']"
              @change="handleIntroductionChange"
            ></BaseQuillEditor>
          </el-form-item>

          <el-form-item label="图片" prop="imageUrl">
            <ImageUpload v-model="record.imageUrl" @change="changeUpload">
            </ImageUpload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>
<script>
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
import FormItem from "@/components/Form/Item";
import FileImportDialog from "@/components/FileImport/FileImportDialog";
import ImageUpload from "@/components/FileUpload/ImageUpload.vue";
import BaseQuillEditor from "@/views/basicsManage/questionBankManage/components/BaseQuillEditor.vue";
import Browser from "@/utils/browser";
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    ImageUpload,
    BaseQuillEditor,
  },
  data() {
    return {
      // 搜索参数
      params: {
        title: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "标题名称",
          compType: "input",
          width: 160,
          placeholder: "标题名称",
          prop: "title",
        },
      ],
      // 表格字段列配置
      labelList: [
        {
          label: "序号",
          prop: "sort",
        },
        { label: "标题名称", prop: "title" },
        {
          label: "图片",
          prop: "imageUrl",
          parent: "imageUrl_parent",
          special: true,
        },
        {
          label: "简介内容",
          prop: "introduction",
          parent: "introduction_parent",
          special: true,
        },
        {
          label: "操作",
          prop: "action",
          parent: "action_parent",
          special: true,
        },
      ],
      visibleDialog: false,
      dialogTitle: "图文管理",
      type: "edit",
      dataList: [],
      sourceList: [],
      record: {
        sort: 1,
        title: "",
        introduction: "",
        imageUrl: "",
      },
      rules: {
        sort: [{ required: true, message: "请输入序号", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        introduction: [
          { required: true, message: "简介内容不能为空", trigger: "change" },
        ],
        imageUrl: [
          { required: true, message: "图片不能为空", trigger: "change" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    add() {
      this.type = "add";
      this.record = {
        sort: 1,
        title: "",
        introduction: "",
        imageUrl: "",
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = "edit";
      this.record = { ...record };
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        sort: 1,
        title: "",
        introduction: "",
        imageUrl: "",
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave() {
      console.log(this.record, "ssss");
      this.$refs.form.validate((val) => {
        if (val) {
          this.$refs.listPage.saveRow({
            ...this.record,
          });
          this.visibleDialog = false;
        }
      });
    },
    changeUpload(res) {
      this.record.imageUrl = res.message;
      console.log(res, "ssss");
    },
    handleIntroductionChange(val, text) {
      //   this.record["questionText"] = text;
    },
    getFullUrl(val) {
      return Browser.getFullUrl(val);
    },
  },
};
</script>
      