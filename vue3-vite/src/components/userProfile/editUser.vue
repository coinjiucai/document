<template>
  <el-form
      ref="userRef"
      :model="userForm"
      :rules="formRules"
      :label-width="computeWidth(80)"
  >
    <!-- <el-tabs v-model="showTab"> -->
    <!-- 账号信息 -->
    <!-- <el-tab-pane label="账号信息" name="useraccinfo" v-if="accInfo"> -->
    <!-- <div v-if="accInfo" id="useraccinfo">
      <el-form-item label="登录账号" prop="userName">
        <el-input
          v-model="userForm.userName"
          placeholder="请输入登录账号"
          style="max-width: 400px"
        />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input
          v-model="userForm.password"
          placeholder="请输入登录密码"
          type="password"
          style="max-width: 400px"
          show-password
        />
      </el-form-item>
      <el-form-item label="姓名" prop="nickName">
        <el-input v-model="userForm.nickName" style="max-width: 400px" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idcardnum">
        <el-input
          :disabled="!editIdcard"
          v-model="userForm.idcardnum"
          style="max-width: 400px"
          placeholder="填入身份证号"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="userForm.status">
          <el-radio
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.value"
            >{{ dict.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="userForm.roleIds" multiple placeholder="请选择">
          <el-option
            v-for="item in opts.roleOpts"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
            :disabled="item.status == 1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="userForm.remark"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </div> -->
    <!-- </el-tab-pane> -->
    <!-- 基本信息 -->
    <!-- <el-tab-pane label="基本资料" name="userinfo" v-if="userInfo"> -->
    <div v-if="userInfo" id="userinfo">
      <el-row>
        <el-col :span="12">
          <el-form-item label="人员类型" prop="rylx">
            <el-select
                v-model="userForm.rylx"
                placeholder="请选择"
                class="mw200"
            >
              <el-option
                  v-for="dict in sys_rylx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              ></el-option>
            </el-select>
            <!-- <el-radio-group v-model="userForm.rylx">
              <el-radio label="1">现役军官</el-radio>
              <el-radio label="3">文职人员</el-radio>
            </el-radio-group> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位类型" prop="gwlx">
            <el-radio-group v-model="userForm.gwlx">
              <el-radio label="1">专业技术</el-radio>
              <el-radio label="2">指挥管理</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="nickName">
            <el-input
                v-model="userForm.nickName"
                class="mw200"
                placeholder="填入用户姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="民族" prop="mz">
            <el-select
                v-model="userForm.mz"
                placeholder="请选择"
                class="mw200"
            >
              <el-option
                  v-for="dict in sys_mz"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group v-model="userForm.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- :disabled="!useUserStore().isAdmin" -->
          <el-form-item label="出生日期" prop="csny">
            <el-date-picker
                v-model="userForm.csny"
                type="date"
                placeholder="选择出生年月日"
                class="mw200"
                value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idcardnum">
            <el-input
                :disabled="!editIdcard"
                v-model="userForm.idcardnum"
                class="mw400"
                placeholder="填入身份证号"
                @blur="getBirthday"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="userForm.rylx !== '4'">
          <el-form-item label="军队证件" prop="jrzjh">
            <el-input
                v-model="userForm.jrzjh"
                class="mw400"
                placeholder="填入军队证件号"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="userForm.rylx === '1'" label="军衔" prop="jx">
        <el-select
            v-model="userForm.jx"
            placeholder="请选择"
            class="mw200"
        >
          <el-option
              v-for="dict in sys_jx"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
          v-if="userForm.rylx === '3'"
          label="文职级别"
          prop="jx"
      >
        <el-select
            v-model="userForm.jx"
            placeholder="请选择"
            class="mw200"
        >
          <el-option
              v-for="dict in sys_wzjb"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 联系方式 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="userForm.phonenumber" class="mw400"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公电话" prop="bgdh">
            <el-input v-model="userForm.bgdh" class="mw400"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="邮箱" prop="email">
        <el-input
            v-model="userForm.email"
            placeholder="请填写Internet 邮箱"
            class="mw200"
        />
      </el-form-item>
      <!-- 单位相关信息 -->
      <el-form-item label="所属单位" prop="deptId" v-if="userForm.rylx !== '4'">
        <tree-select
            class="mw200"
            v-model:value="userForm.deptId"
            :options="opts.deptOpts"
            placeholder="请选择单位"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="部职别" prop="bzb">
        <el-input v-model="userForm.bzb" maxlength="50"/>
      </el-form-item>
      <el-form-item label="通信地址" prop="txdz">
        <el-input v-model="userForm.txdz" maxlength="50"/>
      </el-form-item>
      <el-row v-if="userForm.gwlx === '2'">
        <el-col :span="12">
          <el-form-item label="行政职务" prop="xzzw">
            <el-select v-model="userForm.xzzw" placeholder="请选择">
              <el-option
                  v-for="item in opts.postOpts"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                  class="mw200"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任职时间" prop="xzzwrzsj">
            <el-date-picker
                v-model="userForm.xzzwrzsj"
                type="date"
                placeholder="选择任职时间"
                class="mw200"
                value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <!-- </el-tab-pane> -->
    <!-- 专业信息 -->
    <!-- <el-tab-pane label="专业信息" name="userzyinfo" v-if="userZyinfo"> -->
    <div v-if="userZyinfo" id="userzyinfo">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学历" prop="xl">
            <el-select v-model="userForm.xl" placeholder="请选择">
              <el-option
                  v-for="dict in sys_xl"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历时间" prop="xlsj">
            <el-date-picker
                v-model="userForm.xlsj"
                type="date"
                placeholder="选择学历时间"
                class="mw200"
                value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="学位" prop="xw">
            <el-select v-model="userForm.xw" placeholder="请选择">
              <el-option
                  v-for="dict in sys_xw"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学位时间" prop="xwsj">
            <el-date-picker
                v-model="userForm.xwsj"
                type="date"
                placeholder="选择学位时间"
                class="mw200"
                value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="userForm.gwlx === '1'">
        <el-col :span="12">
          <el-form-item label="技术职务" prop="zyjszw">
            <el-select v-model="userForm.zyjszw" placeholder="请选择">
              <el-option
                  v-for="dict in sys_zyzw"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务时间" prop="zwsj">
            <el-date-picker
                v-model="userForm.zwsj"
                type="date"
                placeholder="选择职务任职时间"
                class="mw200"
                value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <template solt="others">
      <slot/>
    </template>
    <!-- </el-tab-pane> -->
    <!-- </el-tabs> -->
    <el-form-item>
      <el-button
          v-if="props.user.userId"
          :loading="loadBtn"
          type="primary"
          @click="submitUpdate"
          v-hasPermi="['system:user:edit']"
      >修改
      </el-button
      >
      <el-button
          v-else
          :loading="loadBtn"
          type="primary"
          @click="submitAdd"
      >保存
      </el-button
      >
      <!-- <el-button type="danger" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script setup name="componentUser">
import {updateUserProfile} from "@/api/system/user";
import {
  getUser,
  getUserByIdcard,
  addUserInfo,
  updateUserInfo,
} from "@/api/system/user";
import {checkIdcard,getBirthdayFromIdCard} from "@/utils/IdentityCodeValid.js";
import { computeWidth } from '@/utils/ruoyi.js'
import useUserStore from "@/store/modules/user";

const {proxy} = getCurrentInstance();

const props = defineProps({
  user: {
    type: Object,
    default: {},
  },
  opts: {
    type: Object,
    default: {
      deptOpts: [],
      postOpts: [],
      roleOpts: [],
    },
  },
  otherRules: {
    type: Object,
    default: {},
  },
  editSubmit: {type: Boolean, default: true},
  accInfo: {
    type: Boolean,
    default: false,
  },
  userInfo: {
    type: Boolean,
    default: true,
  },
  userZyinfo: {
    type: Boolean,
    default: true,
  },
});

const loadBtn = ref(false);

const rules = {
  userName: [
    {required: true, message: "用户名称不能为空", trigger: "blur"},
    {
      min: 2,
      max: 20,
      message: "用户名称长度必须介于 2 和 20 之间",
      trigger: "blur",
    },
  ],
  password: [
    {required: true, message: "用户密码不能为空", trigger: "blur"},
    {
      min: 5,
      max: 20,
      message: "用户密码长度必须介于 5 和 20 之间",
      trigger: "blur",
    },
  ],
  nickName: [{required: true, message: "用户姓名不能为空", trigger: "blur"}],
  rylx: [{required: true, message: "人员类型不能为空", trigger: "blur"}],
  gwlx: [{required: true, message: "岗位类型不能为空", trigger: "blur"}],
  idcardnum: [
    {required: true, message: "身份证号不能空", trigger: "blur"},
    {required: true, validator: checkIdcard, trigger: "blur"},
  ],
  jrzjh: [{required: true, message: "军人证件号不能为空", trigger: "blur"}],
  jx: [{required: true, message: "军衔不能为空", trigger: "blur"}],
  mz: [{required: true, message: "民族不能为空", trigger: "blur"}],
  sex: [{required: true, message: "姓别不能为空", trigger: "blur"}],
  csny: [{required: true, message: "出生年月不能为空", trigger: "blur"}],
  deptId: [{required: true, message: "所属单位不能为空", trigger: "blur"}],
  bzb: [{required: true, message: "部职别不能为空", trigger: "blur"}],
  txdz: [{required: true, message: "通信地址不能为空", trigger: "blur"}],
  bgdh: [{required: true, message: "办公电话不能为空", trigger: "blur"}],
  email: [
    {required: true, message: "邮箱地址不能为空", trigger: "blur"},
    {
      type: "email",
      message: "'请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  phonenumber: [
    {required: true, message: "手机号码不能为空", trigger: "blur"},
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  xzzw: [{required: true, message: "行政职务不能为空", trigger: "blur"}],
  xzzwrzsj: [{required: true, message: "任职时间不能为空", trigger: "blur"}],
  xl: [{required: true, message: "学历不能为空", trigger: "blur"}],
  xlsj: [{required: true, message: "学历时间不能为空", trigger: "blur"}],
  xw: [{required: true, message: "学位不能为空", trigger: "blur"}],
  xwsj: [{required: true, message: "学位时间不能为空", trigger: "blur"}],
  zyjszw: [
    {required: true, message: "专业技术职务不能为空", trigger: "blur"},
  ],
  zwsj: [{required: true, message: "专业技术职务不能为空", trigger: "blur"}],
  zyandzc: [{required: true, message: "专业及专长不能空", trigger: "blur"}],
  jyqs: [{required: true, message: "教育起始时间不能空", trigger: "blur"}],
};
const formRules = computed(() => {
  if (props.otherRules === undefined) {
    return ref(rules);
  }

  let tmpRules = {};
  for (let obj in rules) {
    tmpRules[obj] = rules[obj];
  }
  for (let obj in props.otherRules) {
    tmpRules[obj] = props.otherRules[obj];
  }

  return ref(tmpRules);
});
const postOptions = ref([]);
const userForm = ref({});

watch(
    () => props.user,
    (val) => {
      if (val !== undefined) {
        editIdcard.value = getIdcardState();
      }
    }
);

onMounted(() => {
  reset();
  userForm.value = props.user;
});

const editIdcard = ref(false);

function getIdcardState() {
  return props.user.idcardnum == (undefined || null);
}

const isShowXzzwsj = computed(() => {
  return userForm.value.xzzw > 0;
});
const isShowZwsj = computed(() => {
  return userForm.value.zyjszw > 0;
});
const emit = defineEmits(["reloadInfo"]);

watch(props, (val) => {

  userForm.value = val.user;
});

const {
  sys_normal_disable,
  sys_zyzw,
  sys_xl,
  sys_xw,
  sys_mz,
  sys_rylx,
  sys_gwlx,
  sys_jx,
  sys_wzjb,
} = proxy.useDict(
    "sys_normal_disable",
    "sys_zyzw",
    "sys_xl",
    "sys_xw",
    "sys_mz",
    "sys_rylx",
    "sys_gwlx",
    "sys_jx",
    "sys_wzjb"
);

function reset() {
  userForm.value = reactive({
    userName: undefined,
    password: undefined,
    status: "0",
    nickName: "",
    rylx: "1",
    gwlx: "1",
    idcardnum: undefined,
    jrzjh: undefined,
    jx: undefined,
    mz: undefined,
    sex: "0",
    csny: "1980-01-01",
    phonenumber: undefined,
    bgdh: undefined,
    email: undefined,
    deptName: undefined,
    bzb: undefined,
    xzzw: undefined,
    xzzwrzsj: undefined,
    xl: undefined,
    xlsj: undefined,
    xw: undefined,
    xwsj: undefined,
    zyjszw: undefined,
    zwsj: undefined,
    zyandzc: undefined,
    xsttandzw: undefined,
    jl: undefined,
    jyqs: undefined,
    jyjs: undefined,
  });
}

function submitAdd() {

  proxy.$refs.userRef.validate((valid) => {
    if (valid) {
      loadBtn.value = true;
      addUserInfo(userForm.value)
          .then((resp) => {
            proxy.$modal.msgSuccess("添加成功");
            loadBtn.value = false;
            getUserByIdcard(userForm.value.idcardnum).then((response) => {
              emit("reloadInfo", response.data);
            });
          })
          .catch((err) => {
            loadBtn.value = false;
          });
    }
  });
}

function submitUpdate() {

  proxy.$refs.userRef.validate((valid) => {
    if (valid) {
      if (props.editSubmit) {
        loadBtn.value = true;
        updateUserInfo(userForm.value)
            .then((response) => {

              proxy.$modal.msgSuccess("修改成功");
              emit("reloadInfo", userForm.value);
              loadBtn.value = false;
            })
            .catch((err) => {
              loadBtn.value = false;
            });
      } else {
        emit("reloadInfo", userForm.value);
      }
    }
  });
}

function close() {
  proxy.$tab.closePage();
}


function getBirthday() {
  let birthday = getBirthdayFromIdCard(userForm.value.idcardnum)
  userForm.value.csny = birthday
}
</script>
