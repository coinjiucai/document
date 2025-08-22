<template>
  <div
    class="security-inspection-bigcheck theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['add']"
      addText="添加计划"
      :listApi="['System', 'checkplanPageList']"
      :deleteApi="['System', 'batchCheckplanDelete']"
      @edit="edit"
      :editApi="['System', 'checkplanSave']"
      @add="add"
      :addApi="['System', 'checkplanSave']"
    >
      <template v-slot:PageButtons>
        <el-button
          type="primary"
          style="
            background: rgba(255, 102, 0, 1);
            border-color: rgba(255, 102, 0, 1);
          "
          size="mini"
          @click="sentPlan"
          >发布计划</el-button
        >
        <el-button
          type="danger"
          @click="$refs.listPage.batchDelete()"
          size="mini"
          >删除计划</el-button
        >
        <el-button type="primary" @click="unSentPlan" size="mini"
          >撤销发布</el-button
        >
      </template>
      <template v-slot:actionParent="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >查看详情</el-link
        >
      </template>
    </ListPage>

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
          label-position="right"
          label-width="120px"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="状态"> 未下发 </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="年度">
                <FormItem
                  v-model="record.year"
                  compType="year"
                  value-format="yyyy"
                  format="yyyy"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自查计划名称">
                <el-input
                  v-model="record.checkPlanName"
                  placeholder=""
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="检查对象" prop="useTime">
                <FormItem
                  :ids="record.checkTargetIds"
                  :multi="true"
                  :user="false"
                  :names="record.checkTargetNames"
                  compType="organize"
                  @change="changeOrganize"
                  placeholder="请选择部门"
                ></FormItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="保密检查时间">
                <FormItem
                  v-model="rangeTime"
                  range-separator="至"
                  compType="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></FormItem>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="产品简介">
                <el-input
                  v-model="record.memo"
                  placeholder=""
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          style="
            background: rgba(255, 102, 0, 1);
            border-color: rgba(255, 102, 0, 1);
          "
          v-if="record.id && record.sentStatus != 2"
          @click="checkPlanSent(record.id, 2)"
          >发布</el-button
        >
        <el-button
          type="primary"
          v-if="record.id && record.sentStatus == 2"
          @click="checkPlanSent(record.id, 1)"
          >撤销发布</el-button
        >
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>
<script>
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
import FormItem from "@/components/Form/Item";
import { isArray } from "@/utils/utils";
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
  },
  data() {
    return {
      // 搜索参数
      params: {
        checkPlanName: "",
        sentStatus: "",
        isCheckSelf: 2,
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "自查计划",
          compType: "input",
          width: 160,
          prop: "checkPlanName",
        },
        {
          label: "状态",
          compType: "select",
          width: 160,
          prop: "sentStatus",
          dictCode: "sentstatus_code",
        },
      ],
      // 表格字段列配置
      labelList: [
        { label: "状态", prop: "sentStatus" },
        { label: "年度", prop: "year" },
        { label: "自查计划名称", prop: "checkPlanName" },
        { label: "检查对象", prop: "checkTargetNames" },
        { label: "检查开始时间", prop: "beginTime" },
        { label: "预计结束时间", prop: "endTime" },
        {
          label: "操作",
          prop: "action",
          parent: "actionParent",
          special: true,
        },
      ],
      visibleDialog: false,
      dialogTitle: "保密大检查管理",
      rangeTime: [],
      record: {
        isCheckSelf: 2,
        sentStatus: "1",
        year: "",
        checkPlanName: "",
        checkTargetIds: "",
        checkTargetNames: "",
        beginTime: "",
        endTime: "",
        memo: "",
      },
      rules: {},
    };
  },
  methods: {
    add() {
      this.visibleDialog = true;
    },
    edit(record) {
      this.rangeTime = [];
      this.$api.System.getCheckplanOne(record.id).then((res) => {
        const result = res.result;
        if (result.beginTime && result.endTime) {
          this.rangeTime = [result.beginTime, result.endTime];
        }
        this.record = result;
        this.visibleDialog = true;
      });
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        isCheckSelf: "2",
        sentStatus: "1",
        year: "",
        checkPlanName: "",
        checkTargetIds: "",
        checkTargetNames: "",
        beginTime: "",
        endTime: "",
        memo: "",
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
          if (this.rangeTime.length > 0) {
            this.record.beginTime = this.rangeTime[0];
            this.record.endTime = this.rangeTime[1];
          }
          this.$refs.listPage.saveRow({ ...this.record });
          this.visibleDialog = false;
        }
      });
    },
    // 发布和撤销计划
    checkPlanSent(ids, sentStatus) {
      if (ids.length == 0) {
        this.$message.warning("请至少选择一列数据!");
        return false;
      }
      this.$api.System.checkPlanSent(
        {
          ids: ids,
        },
        sentStatus
      ).then((res) => {
        if (sentStatus == 2) {
          this.$message.success("发布成功!");
        } else {
          this.$message.success("撤销发布成功!");
        }
        this.$refs.listPage.getList();
        this.visibleDialog = false;
      });
    },
    changeOrganize(depart) {
      if (isArray(depart.ids)) {
        this.record.checkTargetIds = depart.ids.join(",");
      } else {
        this.record.checkTargetIds = depart.ids;
        this.record.checkTargetNames = depart.names;
      }
    },
    sentPlan() {
      const selection = this.$refs.listPage.selection;
      const ids = selection.map((v) => v.id).join(",");
      this.checkPlanSent(ids, 2);
    },
    unSentPlan() {
      const selection = this.$refs.listPage.selection;
      const ids = selection.map((v) => v.id).join(",");
      this.checkPlanSent(ids, 1);
    },
  },
};
</script>
