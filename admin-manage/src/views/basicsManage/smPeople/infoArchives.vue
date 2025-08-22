<template>
  <div class="info-archives flex-row full-block">
    <LeftCatalogue
      ref="catalogue"
      title="保密要害部门"
      :default-props="{ label: 'title', value: 'value' }"
      node-key="key"
      :tree-data.sync="treeList"
      :get-url="getUrl"
      :disabledOption="true"
      @current-change="handleCurrentChange"
    >
    </LeftCatalogue>
    <div class="flex-auto theme-background-middle flex-layout pa10">
      <ListPage
        :params="params"
        :fieldsConfig="fieldsConfig"
        :labelList="labelList"
        :buttonList="['add', 'delete']"
        :listApi="['System', 'getLogList']"
        @add="add"
      >
        <template v-slot:PageButtons> </template>
      </ListPage>
    </div>
    <BaseDialog
      class="full-block"
      title="人员信息"
      center
      :visible.sync="visibleDialog"
      @close="visibleDialog = false"
      width="1000px"
      top="20vh"
    >
      <div class="person-container">
        <div class="person-box">
          <div class="title"></div>
          <div class="info">
            <el-form ref="form" label-position="right" label-width="80px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="姓名">
                    <FormItem
                      v-model="form.sysUser.realname"
                      compType="specialDialog"
                      @speciaDialogSelect="speciaDialogSelect"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别">
                    <FormItem
                      v-model="form.sysUser.sex"
                      compType="select"
                      dictCode="sex"
                      :disabled="true"
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出生日期">
                    <FormItem
                      v-model="form.sysUser.birthday"
                      compType="date"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="民族">
                    <FormItem
                      v-model="form.sysUser.nationality"
                      compType="select"
                      dictCode="nation_code"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="籍贯">
                    <FormItem
                      v-model="form.sysUser.nativePlace"
                      compType="address"
                      level="province"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="居住地址">
                    <FormItem
                      v-model="form.sysUser.address"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="婚姻状况">
                    <FormItem
                      v-model="form.sysUser.maritalStatus"
                      compType="select"
                      dictCode="marital_status"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="身份证号">
                    <FormItem v-model="form.sysUser.idCard" disabled></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="健康状况">
                    <FormItem
                      v-model="form.sysUser.healthStatus"
                      compType="select"
                      dictCode="health_status"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="政治面貌">
                    <FormItem
                      v-model="form.sysUser.political"
                      compType="select"
                      dictCode="political_status"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系方式">
                    <FormItem v-model="form.sysUser.phone" disabled></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="文化程度">
                    <FormItem
                      v-model="form.sysUser.educationLevel"
                      compType="select"
                      dictCode="education_level"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属部门">
                    <FormItem
                      :row="form.sysUser"
                      :item="{
                        propVal: 'orgCode',
                      }"
                      v-model="form.sysUser.orgCodeTxt"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="职务">
                    <FormItem
                      v-model="form.sysUser.post"
                      compType="select"
                      dictCode="sys_position"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入伍时间">
                    <FormItem
                      v-model="form.sysUser.joinTime"
                      compType="date"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="军衔">
                    <FormItem
                      v-model="form.sysUser.militaryRank"
                      compType="select"
                      dictCode="military_rank"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="在位情况">
                    <FormItem
                      v-model="form.sysUser.workStatus"
                      compType="select"
                      dictCode="work_status"
                      disabled
                    ></FormItem>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密级">
                    <FormItem
                      v-model="form.sysUser.classification"
                      compType="select"
                      dictCode="classification_level"
                    ></FormItem>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <div class="pic">
            <div>人员照片</div>
            <div><img src="@/assets/images/person.svg" /></div>
          </div>
        </div>

        <div>
          <el-tabs v-model="activeName" @tab-click="(val) => {}">
            <el-tab-pane label="资产信息登记" name="first">
              <div style="height: 500px">
                <ListPage
                  ref="batchAssets"
                  :buttonList="['add', 'delete']"
                  :labelList="batchLabelList"
                  :showPagination="false"
                  :searchStyle="{ 'text-align': 'left' }"
                  :isInnerGet="false"
                >
                  <template v-slot:PageButtons></template>
                </ListPage>
              </div>
            </el-tab-pane>
            <el-tab-pane label="涉密载体" name="second">
              <div style="height: 500px">
                <ListPage
                  ref="batchCarriers"
                  :buttonList="['add', 'delete']"
                  :labelList="batchLabelList"
                  :showPagination="false"
                  :searchStyle="{ 'text-align': 'left' }"
                  :isInnerGet="false"
                >
                  <template v-slot:PageButtons></template>
                </ListPage>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button type="info" @click="visibleDialog = false">取消</el-button>
      </span>
    </BaseDialog>
    <UserSelectDialog
      ref="userSelectDialog"
      @confirm="userSelect"
    ></UserSelectDialog>
  </div>
</template>

<script>
import LeftCatalogue from "@/components/Project/LeftCatalogue";
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
import FormItem from "@/components/Form/Item";
import UserSelectDialog from "@/views/components/UserSelectDialog";
export default {
  name: "InfoArchives",
  cname: "人员信息档案",
  components: {
    LeftCatalogue,
    ListPage,
    BaseDialog,
    FormItem,
    UserSelectDialog,
  },
  props: {},
  data() {
    return {
      getUrl: "/mlf-csjm-service/sys/sysDepart/queryIdTree",
      treeList: [],
      // 搜索参数
      params: {
        placeId: "",
        realname: "",
        idCard: "",
        workStatus: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "姓名",
          compType: "input",
          width: 160,
          placeholder: "",
          prop: "realname",
        },
        {
          label: "身份证号",
          compType: "input",
          width: 160,
          placeholder: "",
          prop: "idCard",
        },
        {
          label: "在位情况",
          compType: "select",
          width: 160,
          prop: "workStatus",
          dictCode: "work_status",
        },
      ],
      // 表格字段列配置
      labelList: [
        {
          label: "在位情况",
          prop: "workStatus",
        },
        { label: "姓名", prop: "realname" },
        { label: "部位", prop: "placeId" },
        { label: "身份证号", prop: "idCard" },
        {
          label: "联系方式",
          prop: "phone",
        },
        { label: "密级", prop: "classification" },
        {
          label: "角色",
          prop: "roleName",
        },
      ],
      visibleDialog: false,
      activeName: "first",
      form: {
        placeId: "",
        userId: "",
        sysUser: {
          realname: "",
          workNo: "",
          sex: "",
          birthday: "",
          nationality: "",
          nativePlace: "",
          address: "",
          maritalStatus: "",
          idCard: "",
          healthStatus: "",
          political: "",
          phone: "",
          educationLevel: "",
          orgCode: "",
          orgCodeTxt: "",
          post: "",
          joinTime: "",
          militaryRank: "",
          workStatus: "",
          classification: "",
        },
        assets: {
          deviceNo: "",
          deviceName: "",
          createTime: "",
          sn: "",
          owner: "",
        },
        carriers: {
          deviceNo: "",
          deviceName: "",
          createTime: "",
          sn: "",
          owner: "",
        },
      },
      batchLabelList: [
        {
          label: "资产编号",
          prop: "deviceNo",
        },
        {
          label: "资产名称",
          prop: "deviceName",
        },
        {
          label: "创建时间",
          prop: "createTime",
          compType: "date",
          fmtdate: "YYYY.MM.DD", // 显示格式化
          "value-format": "yyyy-MM-dd HH:mm:ss",
        },
        {
          label: "唯一标识",
          prop: "sn",
        },
        {
          label: "责任人",
          prop: "owner",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  filters: {},
  watch: {},
  computed: {},
  methods: {
    handleCurrentChange(data) {
      this.params.placeId = data.value;
      this.form.placeId = data.value;
    },
    add() {
      this.visibleDialog = true;
    },
    speciaDialogSelect() {
      this.$refs.userSelectDialog.show();
    },
    userSelect(userInfo) {
      if (userInfo) {
        this.form.sysUser = userInfo;
      }
    },
    confirm() {
      const batchAssets = this.$refs.batchAssets.getDataList();
      const batchCarriers = this.$refs.batchCarriers.getDataList();
      this.form.assets = batchAssets;
      // delete this.form.sysUser.id;
      this.form.carriers = batchCarriers;
      this.$api.System.sysprivacyuserSave(this.form).then((res) => {
        console.log(res, "sfsdfsfd");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.info-archives {
}
.person-container {
  .person-box {
    display: flex;
    font-size: 14px;
    .title {
      position: absolute;
      padding: 10px;
      font-size: 14px;
      top: -18px;
      width: 80px;
      &::before {
        position: absolute;
        content: "基本信息";
        width: 100%;
        height: 50%;
        background: #fff;
        z-index: 2;
        text-align: center;
        left: 1px;
      }
    }
    .info {
      flex: 1;
      border: 1px solid #e4e7ed;
      margin-right: 20px;
      padding: 10px;
    }
    .pic {
      img {
        width: 100px;
        margin: 40px;
      }
    }
  }
}
</style>
