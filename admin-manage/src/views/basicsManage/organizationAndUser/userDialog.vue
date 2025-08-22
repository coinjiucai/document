<template>
  <div>
    <BaseDialog
      class="full-block component-userDetailDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1200px"
      top="20vh"
    >
      <div class="full-block">
        <el-form ref="form" label-width="100px" :model="record" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="姓名">
                    <el-input
                      v-model="record.realname"
                      maxlength="30"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="账号">
                    <el-input
                      v-model="record.username"
                      maxlength="30"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别">
                    <FormItem
                      compType="select"
                      dictCode="sex"
                      v-model="record.sex"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="出生日期">
                    <el-date-picker
                      v-model="record.birthday"
                      type="date"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="民族">
                    <FormItem
                      compType="select"
                      dictCode="nation_code"
                      v-model="record.nationality"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="籍贯">
                    <FormItem
                      compType="address"
                      level="province"
                      v-model="record.nativePlace"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="居住地址">
                    <el-input
                      v-model="record.address"
                      maxlength="30"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="婚姻状况">
                    <FormItem
                      compType="select"
                      dictCode="marital_status"
                      v-model="record.maritalStatus"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="身份证号">
                    <el-input
                      v-model="record.idCard"
                      maxlength="30"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="健康状况">
                    <FormItem
                      compType="select"
                      dictCode="health_status"
                      v-model="record.healthStatus"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="政治面貌">
                    <FormItem
                      compType="select"
                      dictCode="political_status"
                      v-model="record.political"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系方式">
                    <el-input
                      v-model="record.telephone"
                      maxlength="30"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="文化程度">
                    <FormItem
                      compType="select"
                      dictCode="education_level"
                      v-model="record.educationLevel"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="职务">
                    <FormItem
                      compType="select"
                      v-model="record.post"
                      dictCode="sys_position"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入伍时间">
                    <el-date-picker
                      v-model="record.joinTime"
                      type="date"
                      placeholder="选择日期"
                      width="100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="军衔">
                    <FormItem
                      compType="select"
                      dictCode="military_rank"
                      v-model="record.militaryRank"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="在位情况">
                    <FormItem
                      compType="select"
                      dictCode="work_status"
                      v-model="record.status"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密级">
                    <FormItem
                      compType="select"
                      dictCode="classification_level"
                      v-model="record.classification"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- <el-form-item label="所属单位" prop="username">
                    <el-input
                      v-model="record.username"
                      maxlength="30"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item> -->
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4">
              <div>人员照片</div>
              <div>
                <img
                  style="width: 100px; display: block; margin: 40px"
                  src="@/assets/images/person.svg"
                />
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
// 注意引入的路劲可能不同
import BaseDialog from "@/components/Base/BaseDialog";
// import DictionarySelect from "@/components/DictionarySelect";
import FormItem from "@/components/Form/Item";
export default {
  name: "userDetailDialog",
  components: { BaseDialog, FormItem },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    orgInfo: {
      type: Object,
      default: () => ({
        orgCode: "",
        orgCodeTxt: "",
      }),
    },
  },
  mounted() {},
  data() {
    return {
      visibleDialog: false,
      title: null,
      record: {
        realname: "",
        username: "",
        sex: "",
        birthday: "",
        nationality: "",
        nativePlace: [],
        address: "",
        maritalStatus: "",
        idCard: "",
        healthStatus: "",
        political: "",
        telephone: "",
        educationLevel: "",
        // 所属单位
        post: "",
        joinTime: "",
        militaryRank: "",
        status: "",
        classification: "",
      },
      rules: {
        // departId: [
        //   { required: true, message: "请选择所属单位！", trigger: "change" },
        // ],
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    initRecord() {
      this.record = {
        realname: "",
        username: "",
        sex: "",
        birthday: "",
        nationality: "",
        nativePlace: [],
        address: "",
        maritalStatus: "",
        idCard: "",
        healthStatus: "",
        political: "",
        telephone: "",
        educationLevel: "",
        // 所属单位
        post: "",
        joinTime: "",
        military_rank: "",
        status: "",
        classification: "",
      };
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        realname: "",
        username: "",
        sex: "",
        birthday: "",
        nationality: "",
        nativePlace: [],
        address: "",
        maritalStatus: "",
        idCard: "",
        healthStatus: "",
        political: "",
        telephone: "",
        educationLevel: "",
        // 所属单位
        post: "",
        joinTime: "",
        military_rank: "",
        status: "",
        classification: "",
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    show(record) {
      this.initRecord();
      this.visibleDialog = true;
      if (record) {
        this.title = "编辑用户";
        this.record = { ...record };
      } else {
        this.initRecord();
        this.title = "添加用户";
      }
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.record.nativePlace = JSON.stringify(this.record.nativePlace);
          if (this.record.id) {
            this.$api.System.editUser({
              ...this.record,
              ...this.orgInfo,
            }).then(() => {
              this.$message.success("修改成功！");
              this.handleCloseDialog();
              this.$emit("save");
            });
          } else {
            this.$api.System.addUser({
              ...this.record,
              ...this.orgInfo,
            }).then(() => {
              this.$message.success("添加成功！");
              this.handleCloseDialog();
              this.$emit("save");
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  max-height: 500px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-userDetailDialog {
}
</style>
