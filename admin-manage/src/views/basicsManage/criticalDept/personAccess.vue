<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :listApi="['System', 'getSysprivacyplaceaccessList']"
      :deleteApi="['System', 'batchSysprivacyplaceaccessDelete']"
      @edit="edit"
      :editApi="['System', 'savesySprivacyplaceaccessSave']"
      @add="add"
      :addApi="['System', 'savesySprivacyplaceaccessSave']"
    >
      <template v-slot:PageButtons>
        <el-button type="primary" @click="batchVisibleDialog = true"
          >批量添加</el-button
        >
      </template>
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
          label-width="120px"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="部门名" prop="productName">
                <FormItem
                  compType="place"
                  v-model="record.placeName"
                  @placeSelect="
                    (v) => {
                      record.placeId = v.placeId;
                    }
                  "
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名" prop="productCode">
                <el-input v-model="record.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="单位信息">
                <el-input v-model="record.company" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进入时间">
                <el-date-picker
                  v-model="record.enterTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="离开时间" prop="destructionTime">
                <el-date-picker
                  v-model="record.levelTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事由">
                <el-input v-model="record.reason" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="接待人员">
                <el-input v-model="record.accessUser" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="record.memo"
                  placeholder=""
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
    <!-- 批量添加弹窗 -->
    <BaseDialog
      class="full-block"
      title="批量添加"
      center
      :visible.sync="batchVisibleDialog"
      @close="batchHandleCloseDialog"
      width="1000px"
      top="10vh"
    >
      <div style="height: 500px"></div>
      <span slot="footer">
        <el-button type="primary" @click="batchHandleSave">确定</el-button>
        <el-button type="info" @click="batchHandleCloseDialog">取消</el-button>
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
        placeName: "",
        productName: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "部门名",
          compType: "input",
          width: 160,
          prop: "placeName",
        },
        {
          label: "姓名",
          compType: "input",
          width: 160,
          prop: "name",
        },
      ],
      // 表格字段列配置
      labelList: [
        { label: "身份证号", prop: "idCard" },
        { label: "姓名", prop: "name" },
        { label: "单位信息", prop: "company" },
        { label: "进入部门", prop: "placeName" },
        { label: "进入时间", prop: "enterTime" },
        { label: "离开时间", prop: "levelTime" },
        { label: "事由", prop: "reason" },
        { label: "接待人员", prop: "accessUser" },
      ],
      visibleDialog: false,
      dialogTitle: "人员出入登记",
      record: {
        placeId: "",
        placeName: "",
        name: "",
        company: "",
        enterTime: "",
        levelTime: "",
        accessUser: "",
        memo: "",
      },
      rules: {
        placeId: [{ required: true, message: "", trigger: "change" }],
      },
      batchVisibleDialog: false,
    };
  },
  methods: {
    add() {
      this.visibleDialog = true;
    },
    edit(record) {
      this.record = { ...record };
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        productName: "",
        productCode: "",
        productType: "",
        modelCode: "",
        destructionTime: "",
        userName: "",
        reason: "",
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
          this.$refs.listPage.saveRow({ ...this.record });
          this.visibleDialog = false;
        }
      });
    },
    batchHandleCloseDialog() {
      this.batchVisibleDialog = false;
    },
    batchHandleSave() {
      // const batchList = this.$refs.batchDestruction.getDataList();
      // this.$api.System
      //   .batchSysprivacyplaceDelete(batchList)
      //   .then((res) => {
      //     if (res.code == 200) {
      //       this.$message.success("新增成功");
      //     }
      //   })
      //   .finally(() => {
      //     this.batchVisibleDialog = false;
      //     this.$refs.listPage.getList();
      //   });
    },
  },
};
</script>
