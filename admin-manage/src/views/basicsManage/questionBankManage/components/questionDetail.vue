<template>
  <div v-if="visibleDialog">
    <BaseDialog
      class="full-block component-questionDetail"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1200px"
      top="10vh"
      :destroyOnClose="true"
    >
      <div class="full-block scroll-y" style="padding-right: 30px">
        <el-form
          ref="form"
          label-width="120px"
          :rules="rules"
          :model="record"
          size="mini"
        >
          <el-form-item label="题型：" prop="questionCategory">
            <el-radio-group
              v-model="record['questionCategory']"
              @change="changeQuestionCategory"
            >
              <el-radio-button
                :label="item.value"
                v-for="(item, index) in questionTypeList"
                :key="index"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分类：" prop="classifyId">
            <tree-select
              node-key="id"
              :tree-props="{ label: 'label', children: 'childrenList' }"
              :tree-list="treeList"
              v-model="record['classifyId']"
              reference-class="w230"
            >
            </tree-select>
          </el-form-item>
          <el-form-item label="难度：" prop="difficulty">
            <el-radio-group v-model="record['difficulty']">
              <el-radio-button
                :label="item.value"
                v-for="(item, index) in difficultyList"
                :key="index"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="题干：" prop="question">
            <!-- <BaseQuillEditor
              v-model="record['question']"
              @change="handleQuestionChange"
            ></BaseQuillEditor> -->
            <div style="height: 400px">
              <Editor
                style="height: 400px"
                v-model="record['question']"
              ></Editor>
            </div>
          </el-form-item>
          <el-form-item label="答案：" prop="options">
            <AnswerOptions
              :questionCategory="record['questionCategory']"
              v-model="record['options']"
            ></AnswerOptions>
          </el-form-item>
          <el-form-item label="试题解析：">
            <!-- <BaseQuillEditor v-model="record['analysis']"></BaseQuillEditor> -->
            <Editor style="height: 400px" v-model="record['analysis']"></Editor>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
        <el-button type="info" :loading="saveButtonLoading" @click="handleSave"
          >保存</el-button
        >
      </span>
    </BaseDialog>
  </div>
</template>

<script>
// 注意引入的路劲可能不同
import BaseDialog from '@/components/Base/BaseDialog';
import detailBase from '@/components/_extends/detailBase';
import TreeSelect from '@/components/Tree/TreeSelect.vue';
import BaseQuillEditor from '@/views/basicsManage/questionBankManage/components/BaseQuillEditor.vue';
import AnswerOptions from '@/views/basicsManage/questionBankManage/components/answerOptions.vue';
import Editor from '@/components/TinyMceEditor';
import { questionTypeList, difficultyList } from '@/com/global_data';

export default {
  name: 'questionDetail',
  extends: detailBase,
  components: {
    AnswerOptions,
    BaseQuillEditor,
    TreeSelect,
    BaseDialog,
    Editor
  },
  props: {
    treeList: Array,
    currentClassify: String
  },
  mounted() {},
  data() {
    return {
      questionTypeList,
      difficultyList,
      visibleDialog: false,
      title: '',
      saveUrl: '/mlf-counsel-service/taquestionbank/save',
      getDetailUrl: '/mlf-counsel-service/taquestionbank/',
      rules: {
        questionCategory: [
          { required: true, message: '请选择题型', trigger: 'change' }
        ],
        classifyId: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        difficulty: [
          { required: true, message: '请选择难度', trigger: 'change' }
        ],
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        options: [{ required: true, message: '请添加答案', trigger: 'change' }]
      }
    };
  },
  methods: {
    showEdit(record = null) {
      this.readonly = false;
      if (record) {
        this.title = '编辑题目';

        this.setRecord(record);
        const st = setTimeout(() => {
          this.visibleDialog = true;
          clearTimeout(st);
        }, 500);
      } else {
        this.title = '新增题目';
        this.record = { ...this.getDefaultRecord() };
        this.visibleDialog = true;

        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate();
        });
      }
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    getDefaultRecord() {
      return {
        analysis: '',
        answerJson: '',
        classifyId: this.currentClassify,
        difficulty: 1,
        id: null,
        options: [],
        question: '',
        questionCategory: 1,
        questionText: ''
      };
    },
    handleQuestionChange(val, text) {
      console.log(val, text, 'ddd');
      this.record['questionText'] = text;
    },
    changeQuestionCategory() {
      let options = [];

      if (this.record.questionCategory == 3) {
        options.push(this.getDefaultItem(0));
        options.push(this.getDefaultItem(1));
      } else if (this.record.questionCategory == 5) {
        let item = this.getDefaultItem(0);

        item.isRight = 1;

        options.push(item);
      }

      this.$set(this.record, 'options', options);
    },
    getDefaultItem(index) {
      return {
        audioUrl: '',
        createBy: '',
        createTime: '',
        id: Symbol(),
        imageUrl: '',
        isRight: 0,
        optionCode: index + 1,
        optionContent: '',
        questionId: '',
        sort: 0,
        updateBy: '',
        updateTime: ''
      };
    },
    handleSave() {
      const { questionCategory, options } = this.record;
      // 1单选题、2多选题、3判断题
      if ([1, 2, 3].includes(questionCategory)) {
        // 判断是否至少一个争取答案
        const item = options.find((item) => item.isRight === 1);
        if (!item) {
          this.$message.error('请至少选择一个正确答案');
          return false;
        }
      } else if ([4, 5].includes(questionCategory)) {
        // 填空题
        const item = options.find((item) => !item.optionContent);
        if (item) {
          this.$message.error('答案不能为空');
          return false;
        }
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveButtonLoading = true;
          this.$api.globalAPI
            .saveRecord(this.saveUrl, this.record)
            .then((res) => {
              if (res['success']) {
                this.$emit('save');
                this.handleCloseDialog();
              }
            })
            .finally(() => {
              this.saveButtonLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 60vh;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-questionDetail {
}
</style>
