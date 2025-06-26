<template>
  <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :rules="rules" :inline="true">
    <el-form-item prop="idcardnum" label="身份证号">
      <el-input v-model="queryParams.idcardnum" maxlength="18" class="mw800" placeholder="输入身份证号查询"
        @keyup.enter="handleSearch" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="search" :loading="loading" @click.prevent="handleSearch">
        查找
      </el-button>
    </el-form-item>
  </el-form>

  <div v-show="!showSearch">
    <edit-user v-if="dlgType === 'edit'" :user="userObj" :opts="opts" :editSubmit="editSubmit" :accInfo="accInfo"
      :userInfo="userInfo" :userZyinfo="userZyinfo" @reloadInfo="handleUpdateUserInfo" />
    <user-details v-if="dlgType === 'info'" :accInfo="accInfo" :userInfo="userInfo" :userZyinfo="userZyinfo"
      :user="userObj" :opts="opts" />
  </div>
</template>

<script setup name="sysuserInfo">
import { listPost } from "@/api/system/post";
import editUser from "./editUser.vue";
import userDetails from "./userDetails.vue";
import { checkIdcard } from "@/utils/IdentityCodeValid.js";
import { getUser, getUserByIdcard } from "@/api/system/user";
import { treeselectAllDept, treeselect, treeselectByDeptId } from "@/api/system/dept";
import { getDept } from "@/api/system/dept";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore();
const { proxy } = getCurrentInstance();

const userDeptId = computed(() => userStore.dept === (undefined || null) ? undefined : userStore.dept.deptId);

const emit = defineEmits(["reloadInfo"]);
const props = defineProps({
  showSearch: { type: Boolean, default: true },
  type: { type: String, default: "edit" },
  user: { type: Object, default: {} },
  removeArray: { type: Object, default: { "userList": [], "msg": undefined } },

  editSubmit: { type: Boolean, default: true },
  accInfo: { type: Boolean, default: undefined },
  userInfo: { type: Boolean, default: undefined },
  userZyinfo: { type: Boolean, default: undefined },
});

const loading = ref(false);
const userObj = ref(undefined);
const opts = ref(undefined);
const deptOptions = ref(undefined);
const postOptions = ref(undefined);
const roleOptions = ref(undefined);

watch(() => props.user, (val) => {
  userObj.value = val;
});

onMounted(() => {
  resetUserObj();
  let val = props.user;

  if (val.userId === undefined || val.userId === null || val.deptId === undefined || val.deptId === null) {
    initOptions(1);
  } else {
    initOptions(0);
  }

})

const dlgType = ref(props.type);
const showSearch = computed(() => {
  if (props.showSearch) {
    return (
      userObj.value === undefined ||
      userObj.value.idcardnum === undefined ||
      userObj.value.idcardnum === null ||
      userObj.value.idcardnum == ""
    );
  }
  return false;
});

const queryParams = ref({
  idcardnum: "",
});

const rules = {
  idcardnum: [
    { required: true, message: "身份证号不能空", trigger: "blur" },
    { required: true, validator: checkIdcard, trigger: "blur" },
  ],
};

function handleSearch() {
  proxy.$refs.queryForm.validate((valid) => {
    if (valid) {
      let removeList = props.removeArray.userList.filter(item => item.idcardnum === queryParams.value.idcardnum);
      if (removeList.length > 0) {
        let rstMsg = props.removeArray.msg || "";
        rstMsg += "[" + queryParams.value.idcardnum + "]";
        proxy.$modal.msgError(rstMsg);
        return;
      }
      loading.value = true;
      getUserByIdcard(queryParams.value.idcardnum)
        .then((response) => {
          loading.value = false;
          if (response.data !== undefined) {

            if (response.data.xzzw !== (undefined || null)) {
              response.data.xzzw = parseInt(response.data.xzzw);
            }
            userObj.value = response.data;
            if (props.type === "info") {
              emit("reloadInfo", userObj.value);
            }
          } else {

          }
        })
        .catch((response) => {
          loading.value = false;
          if (props.type === "edit") {
            proxy.$modal
              .confirm(
                '未找到身份证号为"' +
                queryParams.value.idcardnum +
                '"的人员信息，需要添加该人员信息么？'
              )
              .then(function () {
                resetUserObj();
                userObj.value.idcardnum = queryParams.value.idcardnum;
                queryParams.value.idcardnum = "";
              })
              .then(() => {
                queryParams.value.idcardnum = "";
              })
              .catch(() => {
              });
          } else {
            emit("reloadInfo");
          }
        });
    }
  });
}

function resetUserObj() {
  userObj.value = reactive({
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

function getDeptOptions(opt) {
  return new Promise((resolve, reject) => {
    if (opt === 1) {

      treeselectAllDept()
        .then((response) => {
          deptOptions.value = response.data;
          resolve(response.data);
        })
        .catch((err) => {
          reject("获取部门列表错误");
        });
    } else {
      if (props.user.userId !== undefined && props.user.userId !== null) {

        treeselectByDeptId(userDeptId.value)
          .then((response) => {
            deptOptions.value = response.data;
            resolve(response.data);
          })
          .catch((err) => {
            reject("获取用户部门列表错误");
          });
      } else {
        treeselect()
          .then((response) => {
            deptOptions.value = response.data;
            resolve(response.data);
          })
          .catch((err) => {
            reject("获取用户部门列表错误");
          });
      }
    }
  });
}

function getPostAndRoleOptions() {
  return new Promise((resolve, reject) => {
    getUser()
      .then((response) => {
        postOptions.value = response.posts;
        roleOptions.value = response.roles;
        resolve({ posts: response.posts, roles: response.roles });
      })
      .catch((err) => {
        reject("获取行政级别和角色列表错误");
      });
  });
}

function handleUpdateUserInfo(val) {
  if (!props.editSubmit) {
    getDept(val.deptId).then(resp => {
      userObj.value.dept = resp.data;
    })
  }
  emit("reloadInfo", val);
}

async function initOptions(opt) {
  let dept = await getDeptOptions(opt);
  let { posts, roles } = await getPostAndRoleOptions();
  opts.value = {
    deptOpts: dept,
    postOpts: posts,
    roleOpts: roles
  }

  userObj.value = props.user;
}
</script>
