<template>
  <div v-if="!hasInfo">没有相关用户信息</div>
  <div v-else>
    <el-descriptions
        class="margin-top"
        title="基本信息"
        :column="2"
        :size="size"
        :border="false"
        :style="blockMargin"
    >
      <!-- <template #extra>
        <el-button type="primary">Operation</el-button>
      </template>-->
      <el-descriptions-item label="姓名">{{ user.nickName }}</el-descriptions-item>
      <el-descriptions-item label="人员类别">
        <el-tag v-if="user.rylx === '1'" size="small">现役军官</el-tag>
        <!-- <el-tag v-if="user.rylx === '2'" size="small">文职干部</el-tag> -->
        <el-tag v-if="user.rylx === '3'" size="small">文职人员</el-tag>
        <el-tag v-if="user.rylx === '4'" size="small">地方人员</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="岗位类别">
        <el-tag v-if="user.gwlx === '1'" size="small">专业技术</el-tag>
        <el-tag v-if="user.gwlx === '2'" size="small">指挥管理</el-tag>
      </el-descriptions-item>
      <!-- <el-descriptions-item label="出生年月">{{ user.csny }}</el-descriptions-item> -->
      <el-descriptions-item label="出生年月">{{ parseTime(user.csny, "{y}-{m}-{d}") }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ user.idcardnum }}</el-descriptions-item>
    </el-descriptions>
    <!-- <el-divider content-position="right"><el-button type="primary" link size="small" @click="showMoreInfo = !showMoreInfo">{{showMoreInfo?'收起':'更多'}}</el-button></el-divider> -->
    <el-collapse v-model="active" @change="showMoreInfo = !showMoreInfo">
      <el-collapse-item :title="showMoreInfo ? '更多...' : '收起...'" name="1">
        <el-descriptions
            class="margin-top"
            :column="2"
            :size="size"
            :border="false"
            :style="blockMargin"
        >
          <el-descriptions-item label="性别">
            <el-tag v-if="user.sex === '0'" size="small">男</el-tag>
            <el-tag v-if="user.sex === '1'" type="danger" size="small">女</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="民族">
            <el-tag
                :type="computeUserPropType(sys_mz, user.mz)"
                size="small"
            >{{ computeUserPropLabel(sys_mz, user.mz) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="user.rylx !== '4'" label="军人证件号">{{ user.jrzjh }}</el-descriptions-item>
          <el-descriptions-item v-if="user.rylx === '1'" label="军衔">
            <el-tag
                :type="computeUserPropType(sys_jx, user.jx)"
                size="small"
            >{{ computeUserPropLabel(sys_jx, user.jx) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="user.rylx === '2' || user.rylx === '3'" label="文职级别">
            <el-tag
                :type="computeUserPropType(sys_wzjb, user.jx)"
                size="small"
            >{{ computeUserPropLabel(sys_wzjb, user.jx) }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="手机号码">{{ user.phonenumber }}</el-descriptions-item>
          <el-descriptions-item label="办公电话">{{ user.bgdh }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
          <el-descriptions-item v-if="user.dept !== undefined && user.dept !== null" label="所属单位">
            {{ user.dept.deptName }}
          </el-descriptions-item>
          <el-descriptions-item span="3" label="部职别">{{ user.bzb }}</el-descriptions-item>
          <el-descriptions-item span="3" label="通信地址">{{ user.txdz }}</el-descriptions-item>
          <el-descriptions-item v-if="getPostLabel != undefined && user.gwlx === '2'" label="行政职务">{{
              getPostLabel
            }}
          </el-descriptions-item>
          <!-- <el-descriptions-item v-if="getPostLabel != undefined && user.gwlx === '2'" label="行政职务任职时间">{{ user.xzzwrzsj }}</el-descriptions-item> -->
          <el-descriptions-item v-if="getPostLabel != undefined && user.gwlx === '2'" label="行政职务任职时间">
            {{ parseTime(user.xzzwrzsj, "{y}-{m}-{d}") }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            v-if="userZyinfo"
            class="margin-top"
            title="专业信息"
            :column="2"
            :size="size"
            :border="false"
            :style="blockMargin"
        >
          <el-descriptions-item label="学历">
            <el-tag
                :type="computeUserPropType(sys_xl, user.xl)"
                size="small"
            >{{ computeUserPropLabel(sys_xl, user.xl) }}
            </el-tag>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="学历时间">{{ user.xlsj }}</el-descriptions-item> -->
          <el-descriptions-item label="学历时间">{{ parseTime(user.xlsj, "{y}-{m}-{d}") }}</el-descriptions-item>
          <el-descriptions-item label="学位">
            <el-tag
                :type="computeUserPropType(sys_xw, user.xw)"
                size="small"
            >{{ computeUserPropLabel(sys_xw, user.xw) }}
            </el-tag>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="学位时间">{{ user.xwsj }}</el-descriptions-item> -->
          <el-descriptions-item label="学位时间">{{ parseTime(user.xwsj, "{y}-{m}-{d}") }}</el-descriptions-item>
          <el-descriptions-item v-if="user.zyjszw && user.gwlx === '1'" label="专业技术职务">
            <el-tag
                :type="computeUserPropType(sys_zyzw, user.zyjszw)"
                size="small"
            >{{ computeUserPropLabel(sys_zyzw, user.zyjszw) }}
            </el-tag>
          </el-descriptions-item>
          <!-- <el-descriptions-item v-if="user.zyjszw && user.gwlx === '1'" label="专业技术职务时间">{{ user.zwsj }}</el-descriptions-item> -->
          <el-descriptions-item v-if="user.zyjszw && user.gwlx === '1'" label="专业技术职务时间">
            {{ parseTime(user.zwsj, "{y}-{m}-{d}") }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup name="userDetailsCmp">
import { nextTick } from "vue";

const {proxy} = getCurrentInstance();
const {sys_normal_disable, sys_zyzw, sys_xl, sys_mz, sys_jx, sys_wzjb, sys_xw} = proxy.useDict(
    "sys_normal_disable",
    "sys_zyzw",
    "sys_xl",
    "sys_mz",
    "sys_jx",
    "sys_wzjb",
    "sys_xw"
);

const showMoreInfo = ref(true);
const active = ref('')
const size = ref('')
const props = defineProps({
  user: {type: Object, default: undefined},
  opts: {
    type: Object,
    default: {
      deptOpts: [],
      postOpts: [],
      roleOpts: []
    }
  },
  accInfo: {
    type: Boolean, default: false
  },
  userInfo: {
    type: Boolean, default: true
  },
  userZyinfo: {
    type: Boolean, default: false
  },
  defaultShowMore: {
    type: Boolean, default: false
  }
});

const getPostLabel = computed(() => {
  if (props.user.xzzw != undefined || props.user.xzzw != null) {
    if (props.opts !== undefined && props.opts.postOpts !== undefined) {
      let post = props.opts.postOpts.filter((val) => val.postId == props.user.xzzw);
      if (post.length > 0) {
        return post[0].postName
      }
    }
  }

  return undefined
})

const hasInfo = computed(() => {
  return (
      props.user !== undefined &&
      props.user !== null &&
      props.user.idcardnum !== undefined &&
      props.user.idcardnum !== null
  );
});

const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '0px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})

function computeUserPropLabel(dict, propVal) {
  for (let item of dict) {
    if (item.value === propVal) {
      return item.label;
    }
  }
  return '';
}

function computeUserPropType(dict, propVal) {
  for (let item of dict) {
    if (item.value === propVal) {
      return (item.elTagType === 'primary' || item.elTagType === 'default') ? '' : item.elTagType;
    }
  }
  return '';
}

nextTick(() => {
  active.value = props.defaultShowMore ? '1' : ''
  showMoreInfo.value = !props.defaultShowMore
})
</script>
