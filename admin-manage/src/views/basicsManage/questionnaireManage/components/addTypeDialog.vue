<template>
  <div class="component-addTypeDialog">
    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="400px"
      top="20vh"
    >
      <div>
        <el-form
          :model="record"
          :rules="rules"
          ref="form"
          label-width="80px"
          size="mini"
        >
          <el-form-item label="题型" prop="topicCategory">
            <el-select
              class="w100p"
              clearable
              v-model="record.topicCategory"
              placeholder="题型"
            >
              <el-option
                v-for="item in questionTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每题分值" prop="questionScore">
            <el-input-number
              class="w100p"
              :min="0"
              @blur="changeScore"
              v-model="record.questionScore"
            ></el-input-number>
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
import BaseDialog from '@/components/Base/BaseDialog';

import { questionTypeList } from '@/com/global_data';

export default {
  name: 'addTypeDialog',
  components: { BaseDialog },
  data() {
    return {
      questionTypeList,
      dialogTitle: '新增题目',
      visibleDialog: false,
      record: {
        topicName: '',
        topicCategory: '',
        questionScore: 0,
        questionBankList: []
      },
      rules: {
        topicName: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        topicCategory: [
          { required: true, message: '请选择题型', trigger: 'change' }
        ],
        questionScore: [
          { required: true, message: '请输入每题分值', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show() {
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.reset();
    },
    reset() {
      this.record = {
        topicName: '',
        topicCategory: '',
        questionScore: 0,
        questionBankList: []
      };

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.record.questionScore == 0) {
            this.$message.warning('每题分值不能为0');
            return;
          }

          let tf = this.$parent.validateRepeat(this.record.topicCategory);

          if (tf) {
            this.$message.warning('不能添加重复题型');
            return;
          }

          this.$emit(
            'addQuestionType',
            JSON.parse(JSON.stringify(this.record))
          );

          this.handleCloseDialog();
        }
      });
    },
    changeScore() {
      if (this.record.questionScore === undefined) {
        this.$set(this.record, 'questionScore', 0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.component-addTypeDialog {
}
</style>
