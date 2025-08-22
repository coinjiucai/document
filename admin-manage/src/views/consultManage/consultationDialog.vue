<template>
  <div v-if="visibleDialog">
    <BaseDialog
      class="full-block component-vector-ledger-dialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1200px"
      top="20vh"
      destroy-on-close
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="85px"
          size="mini"
        >
          <el-row :gutter="20">
            <div class="vector-claim">
              <TitleBar title="状态信息" />
              <div style="overflow: hidden">
                <el-col :span="8">
                  <el-form-item
                    label="咨询次数:"
                    prop="consultNums"
                    style="margin-bottom: 0"
                  >
                    <FormItem
                      v-model="record.consultNums"
                      compType="inputNumber"
                      :disabled="!isEdit"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="是否结案:"
                    prop="isClosed"
                    style="margin-bottom: 0"
                  >
                    <FormItem
                      v-model="record.isClosed"
                      compType="select"
                      :options="[
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                      ]"
                      :disabled="!isEdit"
                    >
                    </FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="就医服药"
                    prop="isMedication"
                    style="margin-bottom: 0"
                  >
                    <FormItem
                      v-model="record.isMedication"
                      compType="select"
                      :options="[
                        { label: '否', value: 0 },
                        { label: '是', value: 1 }
                      ]"
                      :disabled="!isEdit"
                    >
                    </FormItem>
                  </el-form-item>
                </el-col>
              </div>
            </div>
            <div class="vector-claim" style="margin-bottom: 0">
              <TitleBar title="基础信息" />
              <div style="overflow: hidden">
                <el-col :span="8">
                  <el-form-item label="咨询老师:" prop="consultTeacher">
                    <FormItem
                      v-model="record.consultTeacher"
                      compType="input"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="咨询时间:" prop="consultTime">
                    <FormItem
                      v-model="record.consultTime"
                      compType="datetime"
                      fromat="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :disabled="!isEdit"
                    >
                    </FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="姓名" prop="userName">
                    <!-- <FormItem
                      v-model="record.userName"
                      compType="input"
                      :disabled="!isEdit"
                      @focus="selectRy"
                    >
                    </FormItem> -->
                    <el-input
                      v-model="record.userName"
                      :disabled="!isEdit"
                      @focus="selectRy"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别" prop="gender">
                    <FormItem
                      v-model="record.gender"
                      compType="select"
                      dictCode="sex"
                      :disabled="!isEdit"
                    >
                    </FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="年龄" prop="age">
                    <!-- <FormItem v-model="record.age" compType="inputNumber">
                    </FormItem> -->
                    <el-input-number
                      v-model="record.age"
                      controls-position="right"
                      :min="1"
                      :disabled="!isEdit"
                      :max="200"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </div>
            </div>
            <div style="overflow: hidden">
              <el-col :span="12">
                <el-form-item label="既往病史:" prop="pastMedicalHistory">
                  <div style="display: flex; align-items: center; height: 30px">
                    <el-radio-group
                      v-model="record.pastMedicalHistory"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="0">无</el-radio>
                      <el-radio :label="1">有</el-radio>
                    </el-radio-group>
                    <FormItem
                      v-if="record.pastMedicalHistory == 1"
                      v-model="record.pastMedicalHistoryRemark"
                      compType="input"
                      placeholder="请输入"
                      style="margin-left: 10px"
                      :disabled="!isEdit"
                    ></FormItem>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="家族史:" prop="familyHistory">
                  <div style="display: flex; align-items: center; height: 30px">
                    <el-radio-group
                      v-model="record.familyHistory"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="0">无</el-radio>
                      <el-radio :label="1">有</el-radio>
                    </el-radio-group>
                    <FormItem
                      v-if="record.familyHistory == 1"
                      v-model="record.familyHistoryRemark"
                      compType="input"
                      placeholder="请输入"
                      style="margin-left: 10px"
                      :disabled="!isEdit"
                    ></FormItem>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="家庭结构:" prop="familyStructure">
                  <div style="display: flex; align-items: center; height: 30px">
                    <el-radio-group
                      v-model="record.familyStructure"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="1">完整</el-radio>
                      <el-radio :label="2">单亲</el-radio>
                      <el-radio :label="3">离异</el-radio>
                      <el-radio :label="4">重组</el-radio>
                      <el-radio :label="5">其他</el-radio>
                    </el-radio-group>
                  </div>
                  <FormItem
                    v-if="record.familyStructure == 5"
                    v-model="record.familyStructureRemark"
                    :disabled="!isEdit"
                    compType="input"
                    placeholder="请输入"
                    style="width: 200px; margin-top: 10px"
                  ></FormItem>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="个人信息:" prop="personalInfoShow">
                  <div style="display: flex; align-items: center; height: 30px">
                    <el-radio-group
                      v-model="record.personalInfoShow"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="1">愿意报告</el-radio>
                      <el-radio :label="0">不愿意报告</el-radio>
                    </el-radio-group>
                  </div>
                </el-form-item>
              </el-col>
            </div>

            <div class="vector-claim">
              <TitleBar title="精神疾病排查" />
              <div style="overflow: hidden">
                <el-col :span="6">
                  <el-form-item label="妄想:" prop="isDelusion">
                    <el-radio-group
                      v-model="record.isDelusion"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="0">无</el-radio>
                      <el-radio :label="1">有</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="幻觉:" prop="isHallucination">
                    <el-radio-group
                      v-model="record.isHallucination"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="0">无</el-radio>
                      <el-radio :label="1">有</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="思维（语言混乱）"
                    prop="isThinkingDisorder"
                    label-width="140px"
                  >
                    <el-radio-group
                      v-model="record.isThinkingDisorder"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="0">无</el-radio>
                      <el-radio :label="1">有</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="异常运动行为"
                    prop="isMotorBehavior"
                    label-width="120px"
                  >
                    <el-radio-group
                      v-model="record.isMotorBehavior"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="0">无</el-radio>
                      <el-radio :label="1">有</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </div>
            </div>

            <div class="vector-claim">
              <TitleBar title="来访者主述" />
              <div style="overflow: hidden">
                <el-col :span="8">
                  <el-form-item
                    label="睡眠状态:"
                    prop="sleepStatus"
                    label-width="140px"
                  >
                    <el-radio-group
                      v-model="record.sleepStatus"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="1">好</el-radio>
                      <el-radio :label="2">中</el-radio>
                      <el-radio :label="3">差</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="饮食情况:" prop="dietStatus">
                    <el-radio-group
                      v-model="record.dietStatus"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="1">好</el-radio>
                      <el-radio :label="2">中</el-radio>
                      <el-radio :label="3">差</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="身体疾病"
                    prop="physicalAilments"
                    label-width="110px"
                  >
                    <el-radio-group
                      v-model="record.physicalAilments"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="0">无</el-radio>
                      <el-radio :label="1">有</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="环境适应程度"
                    prop="envAdaptation"
                    label-width="140px"
                  >
                    <el-radio-group
                      v-model="record.envAdaptation"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="1">好</el-radio>
                      <el-radio :label="2">中</el-radio>
                      <el-radio :label="3">差</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="人际关系" prop="interRelationship">
                    <el-radio-group
                      v-model="record.interRelationship"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="1">好</el-radio>
                      <el-radio :label="2">中</el-radio>
                      <el-radio :label="3">差</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="家庭和睦关系"
                    prop="familyHarmony"
                    label-width="110px"
                  >
                    <el-radio-group
                      v-model="record.familyHarmony"
                      :disabled="!isEdit"
                    >
                      <el-radio :label="1">好</el-radio>
                      <el-radio :label="2">中</el-radio>
                      <el-radio :label="3">差</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="近期重大事项"
                    prop="recentMajorEvent"
                    label-width="140px"
                  >
                    <FormItem
                      v-model="record.recentMajorEvent"
                      compType="input"
                      placeholder="请输入"
                      :disabled="!isEdit"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="成长中的重大事项"
                    prop="growingMmilestones"
                    label-width="200px"
                  >
                    <FormItem
                      v-model="record.growingMmilestones"
                      compType="input"
                      placeholder="请输入"
                      :disabled="!isEdit"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="不良情绪处理方式"
                    prop="badEmotionalCoping"
                    label-width="140px"
                  >
                    <FormItem
                      v-model="record.badEmotionalCoping"
                      compType="input"
                      placeholder="请输入"
                      :disabled="!isEdit"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="其他" prop="other" label-width="200px">
                    <FormItem
                      v-model="record.other"
                      compType="input"
                      placeholder="请输入"
                      :disabled="!isEdit"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </div>
            </div>
            <div class="vector-claim">
              <TitleBar title="心理问题分析及咨询建议" />
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="请输入内容"
                v-model="record.analysisPsychological"
                :disabled="!isEdit"
              >
              </el-input>
            </div>
            <div class="vector-claim">
              <TitleBar title="备注" />
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="请输入内容"
                v-model="record.remark"
                :disabled="!isEdit"
              >
              </el-input>
            </div>
            <div class="vector-claim">
              <el-form-item label="文件上传" prop="files" label-width="70px">
                <FormItem
                  compType="upload"
                  v-model="record.files"
                  :limit="10"
                  :showMode="1"
                  :disabled="!isEdit"
                  accept=".doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf,.xls,.xlsx,.ppt,.pptx,.gif"
                ></FormItem>
              </el-form-item>
            </div>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave" v-if="isEdit"
          >确定</el-button
        >
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>

    <BaseDialog
      class="full-block component-vector-ledger-dialog"
      title="人员选择"
      center
      :visible.sync="ryVisibleDialog"
      @closed="handleCloseRyDialog"
      width="98%"
      top="5vh"
      destroy-on-close
    >
      <div style="width: 100%; height: 65vh">
        <DepartTreeList
          ref="departTreeList"
          @selectRowList="selectRowList"
          :selectLimit="selectLimit"
        ></DepartTreeList>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="conirmSelect">确定</el-button>
        <el-button type="info" @click="ryVisibleDialog = false">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import TitleBar from '@/components/TitleBar';
import FormItem from '@/components/Form/Item';
import DepartTreeList from '@/views/systemManage/DepartManage/DepartTreeList.vue';
export default {
  name: 'ConsultationDialog',
  components: { BaseDialog, TitleBar, FormItem, DepartTreeList },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    type: {
      type: String,
      default: () => 'add'
    },
    saveOuter: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  mounted() {},
  data() {
    return {
      isEdit: true,
      item: null,
      visibleDialog: false,
      record: {
        consultNums: 1, // 咨询次数
        isClosed: 1, // 是否结案
        isMedication: 0, // 就医服药
        consultTeacher: '', // 咨询老师
        consultTime: '', // 咨询时间
        userName: '', // 姓名
        userId: '',
        gender: '1', // 性别
        age: '', // 年龄
        pastMedicalHistory: '', // 既往病史
        pastMedicalHistoryRemark: '', // 既往病史备注
        familyHistory: '', // 家族史
        familyHistoryRemark: '',
        familyStructure: '', // 家庭结构
        familyStructureRemark: '', // 家庭结构备注
        personalInfoShow: '', // 个人信息 1 愿意报告 0 不愿意报告
        isDelusion: '', // 妄想
        isHallucination: '', // 幻觉
        isThinkingDisorder: '', // 思维（语言混乱）
        isMotorBehavior: '', // 异常运动行为
        sleepStatus: '', // 睡眠状态
        dietStatus: '', // 饮食情况
        physicalAilments: '', // 身体疾病
        envAdaptation: '', // 环境适应程度
        interRelationship: '', // 人际关系
        familyHarmony: '', // 家庭和睦关系
        recentMajorEvent: '', // 近期重大事项
        growingMmilestones: '', // 成长中的重大事项
        badEmotionalCoping: '', // 不良情绪处理方式
        other: '', // 其他
        analysisPsychological: '', // 心理问题分析及咨询建议
        remark: '', // 备注
        files: [] // 附件
      },
      rules: {
        consultNums: [{ required: true, message: '', trigger: 'change' }],
        isClosed: [{ required: true, message: '', trigger: 'change' }],
        isMedication: [{ required: true, message: '', trigger: 'change' }],
        consultTeacher: [
          { required: true, message: '咨询老师不能为空', trigger: 'blur' }
        ],
        consultTime: [
          { required: true, message: '咨询时间不能为空', trigger: 'change' }
        ],
        gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
        pastMedicalHistory: [
          { required: true, message: '既往病史不能为空', trigger: 'blur' }
        ],
        familyHistory: [
          { required: true, message: '家族史不能为空', trigger: 'change' }
        ],
        familyStructure: [
          { required: true, message: '家庭结构不能为空', trigger: 'change' }
        ],
        personalInfoShow: [
          { required: true, message: '个人信息不能为空', trigger: 'change' }
        ],
        isDelusion: [
          { required: true, message: '妄想不能为空', trigger: 'change' }
        ],
        isHallucination: [
          { required: true, message: '幻觉不能为空', trigger: 'change' }
        ],
        isThinkingDisorder: [
          {
            required: true,
            message: '思维（语言混乱）不能为空',
            trigger: 'change'
          }
        ],
        isMotorBehavior: [
          {
            required: true,
            message: '异常运动行为不能为空',
            trigger: 'change'
          }
        ],
        sleepStatus: [
          { required: true, message: '睡眠状态不能为空', trigger: 'change' }
        ],
        dietStatus: [
          { required: true, message: '饮食情况不能为空', trigger: 'change' }
        ],
        physicalAilments: [
          { required: true, message: '身体疾病不能为空', trigger: 'change' }
        ],
        envAdaptation: [
          {
            required: true,
            message: '环境适应程度不能为空',
            trigger: 'change'
          }
        ],
        interRelationship: [
          { required: true, message: '人际关系不能为空', trigger: 'change' }
        ],
        familyHarmony: [
          {
            required: true,
            message: '家庭和睦关系不能为空',
            trigger: 'change'
          }
        ],
        recentMajorEvent: [
          { required: true, message: '近期重大事项不能为空', trigger: 'blur' }
        ],
        growingMmilestones: [
          {
            required: true,
            message: '成长中的重大事项不能为空',
            trigger: 'blur'
          }
        ],
        badEmotionalCoping: [
          {
            required: true,
            message: '不良情绪处理方式不能为空',
            trigger: 'blur'
          }
        ],
        other: [{ required: true, message: '其他不能为空', trigger: 'blur' }]
      },
      selectLimit: 1,
      ryVisibleDialog: false,
      selection: []
      //   @closed="handleCloseRyDialog"
    };
  },
  created() {},
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    show(item, record = null, isEdit = true) {
      this.item = item;
      this.isEdit = isEdit;
      if (record) {
        var files = [];
        if (record.files) {
          files = JSON.parse(record.files);
        }
        this.record = {
          ...record,
          files
        };
      } else {
        this.record = {
          consultNums: 1, // 咨询次数
          isClosed: 1, // 是否结案
          isMedication: 0, // 就医服药
          consultTeacher: '', // 咨询老师
          consultTime: '', // 咨询时间
          userName: '', // 姓名
          userId: '',
          gender: '1', // 性别
          age: '', // 年龄
          pastMedicalHistory: '', // 既往病史
          pastMedicalHistoryRemark: '', // 既往病史备注
          familyHistory: '', // 家族史
          familyHistoryRemark: '',
          familyStructure: '', // 家庭结构
          familyStructureRemark: '', // 家庭结构备注
          personalInfoShow: '', // 个人信息 1 愿意报告 0 不愿意报告
          isDelusion: '', // 妄想
          isHallucination: '', // 幻觉
          isThinkingDisorder: '', // 思维（语言混乱）
          isMotorBehavior: '', // 异常运动行为
          sleepStatus: '', // 睡眠状态
          dietStatus: '', // 饮食情况
          physicalAilments: '', // 身体疾病
          envAdaptation: '', // 环境适应程度
          interRelationship: '', // 人际关系
          familyHarmony: '', // 家庭和睦关系
          recentMajorEvent: '', // 近期重大事项
          growingMmilestones: '', // 成长中的重大事项
          badEmotionalCoping: '', // 不良情绪处理方式
          other: '', // 其他
          analysisPsychological: '', // 心理问题分析及咨询建议
          remark: '', // 备注
          files: [] // 附件
        };
        this.record.consultTeacher = this.$store.state.user.username;
      }
      this.visibleDialog = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          if (this.saveOuter) {
            this.visibleDialog = false;
            this.$emit('save', {
              ...this.record,
              files: JSON.stringify(this.record.files),
              traineeReservationId: this.item.id
            });
          } else {
            this.$api.consult
              .psytraineeconsultationSave({
                ...this.record,
                files: JSON.stringify(this.record.files),
                traineeReservationId: this.item.id
              })
              .then((res) => {
                this.$message.success('保存成功!');
                this.$emit('success');
              })
              .finally(() => {
                this.visibleDialog = false;
              });
          }
        }
      });
    },
    selectRy() {
      if (this.isEdit) {
        this.ryVisibleDialog = true;
      }
    },
    handleCloseRyDialog() {
      this.ryVisibleDialog = false;
    },
    selectRowList(selection) {
      this.selection = selection;
    },
    conirmSelect() {
      if (this.selection.length > 0) {
        const item = this.selection[0];
        this.record.userName = item.realname;
        this.record.userId = item.id;
        this.ryVisibleDialog = false;
      } else {
        this.$message.error('请选择一个用户');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  max-height: 800px;
  overflow-y: auto;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}
.component-vector-ledger-dialog {
  .vertor-ledger-title {
    margin-bottom: 10px;
  }
  .vector-claim {
    margin-bottom: 20px;
  }
}
</style>
