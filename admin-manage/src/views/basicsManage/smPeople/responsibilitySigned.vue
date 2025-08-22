<template>
  <div
    class="responsibility theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :listApi="['System', 'getSyssecrecyagreementPageList']"
      :deleteApi="['System', 'batchSyssecrecyagreementDelete']"
      @edit="edit"
      :editApi="['System', 'savesySyssecrecyagreementSave']"
      @add="add"
      :addApi="['System', 'savesySyssecrecyagreementSave']"
    >
      <template v-slot:PageButtons></template>
      <!-- <template slot="status_parent" slot-scope="scope">
        <el-link :underline="false" type="danger">{{ scope.row.id }}</el-link>
      </template> -->
    </ListPage>

    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
      top="20vh"
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="150px"
        >
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="年度">
                <FormItem
                  compType="year"
                  v-model="record.year"
                  format="yyyy"
                  value-format="yyyy"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input v-model="record.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号">
                <el-input v-model="record.idcardNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="所属部门">
                <FormItem
                  compType="depart"
                  dictCode="classification_level"
                  :row="record"
                  :item="{
                    label: '所属部门',
                    prop: 'departName',
                    propVal: 'departId',
                  }"
                  v-model="record.departName"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="保密签订日期">
                <FormItem
                  compType="datetime"
                  v-model="record.signTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></FormItem>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="保密注意事项">
                <el-input
                  v-model="record.attention"
                  type="textarea"
                  :rows="2"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="信息中心审核意见">
                <el-input
                  v-model="record.ifpAuditOpin"
                  type="textarea"
                  :rows="2"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="保密委员会审核意见">
                <el-input
                  v-model="record.secAuditOpin"
                  type="textarea"
                  :rows="2"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="附件">
                <FormItem
                  compType="upload"
                  v-model="record.attachFile"
                ></FormItem>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
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
        name: "",
        idcardNo: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "姓名",
          compType: "input",
          width: 160,
          placeholder: "姓名",
          prop: "name",
        },
        {
          label: "身份证号",
          compType: "input",
          width: 160,
          placeholder: "身份证号",
          prop: "idcardNo",
        },
      ],
      // 表格字段列配置
      labelList: [
        { label: "年度", prop: "year" },
        { label: "身份证号", prop: "idcardNo" },
        { label: "所属部门", prop: "departName" },
        { label: "保密注意事项", prop: "attention" },
        {
          label: "签订保密日期",
          prop: "signTime",
        },
        {
          label: "附件",
          prop: "attachFile",
          formatter: (val) => {
            console.log(val);
            const list = JSON.parse(val);
            if (list.length > 0) {
              return list.map((v) => v.name).join(",");
            }
            return "--";
          },
        },
      ],
      visibleDialog: false,
      dialogTitle: "保密责任书签订",
      record: {
        year: "",
        name: "",
        idcardNo: "",
        departId: "",
        departName: "",
        signTime: "",
        attention: "",
        ifpAuditOpin: "",
        secAuditOpin: "",
        attachFile: [],
      },
      rules: {},
    };
  },
  methods: {
    initRecord() {
      this.record = {
        year: "",
        name: "",
        idcardNo: "",
        departId: "",
        departName: "",
        signTime: "",
        attention: "",
        ifpAuditOpin: "",
        secAuditOpin: "",
        attachFile: [],
      };
    },
    add() {
      this.initRecord();
      this.visibleDialog = true;
    },
    edit(record) {
      const item = { ...record };
      item.attachFile = JSON.parse(record.attachFile);
      item.year = "" + record.year;
      this.record = item;
      this.visibleDialog = true;
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.initRecord();
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
          this.visibleDialog = false;
          const record = { ...this.record };
          record.year = "" + record.year;
          record.attachFile = JSON.stringify(record.attachFile);
          this.$refs.listPage.saveRow(record);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
