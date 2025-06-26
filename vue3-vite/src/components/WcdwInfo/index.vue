<template>
  <div v-if="!hasInfo">没有相关单位信息</div>
  <div v-else>
    <el-descriptions
        class="margin-top"
        title="基本信息"
        :column="2"
        :size="size"
        :border="false"
        :style="blockMargin"
    >
      <div v-if="dept.deptMc">
        <el-descriptions-item label="单位名称">{{ dept.deptMc }}</el-descriptions-item>
        <el-descriptions-item label="主管部门">{{ dept.parentDeptMc }}</el-descriptions-item>
        <div v-if="dept.dept">
          <el-descriptions-item v-if="dept.dept.lxr !== undefined" label="联系人">{{
              dept.dept.lxr
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dept.dept.bgdh !== undefined" label="办公电话">{{
              dept.dept.bgdh
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dept.dept.phone !== undefined" label="手机号码">{{
              dept.dept.phone
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dept.dept.txdz !== undefined" label="通讯地址">{{
              dept.dept.txdz
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dept.dept.yzbm !== undefined" label="邮政编码">{{
              dept.dept.yzbm
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dept.dept.cz !== undefined" label="传真">{{ dept.dept.cz }}</el-descriptions-item>
        </div>
      </div>
      <div v-else>
        <el-descriptions-item label="单位名称">{{ dept.deptName }}</el-descriptions-item>
        <el-descriptions-item label="主管部门">{{ dept.parentName }}</el-descriptions-item>
        <el-descriptions-item v-if="dept.lxr !== undefined" label="联系人">{{ dept.lxr }}</el-descriptions-item>
        <el-descriptions-item v-if="dept.bgdh !== undefined" label="办公电话">{{ dept.bgdh }}</el-descriptions-item>
        <el-descriptions-item v-if="dept.phone !== undefined" label="手机号码">{{ dept.phone }}</el-descriptions-item>
        <el-descriptions-item v-if="dept.txdz !== undefined" label="通讯地址">{{ dept.txdz }}</el-descriptions-item>
        <el-descriptions-item v-if="dept.yzbm !== undefined" label="邮政编码">{{ dept.yzbm }}</el-descriptions-item>
        <el-descriptions-item v-if="dept.cz !== undefined" label="传真">{{ dept.cz }}</el-descriptions-item>
      </div>
    </el-descriptions>
  </div>
</template>

<script setup name="deptDetailsCmp">
const {proxy} = getCurrentInstance();
const size = ref('')
const props = defineProps({
  dept: {type: Object, default: undefined},
});

const hasInfo = computed(() => {
  console.log("!!!!", props.dept);
  return (
      props.dept !== undefined &&
      props.dept !== null &&
      props.dept.deptId !== undefined &&
      props.dept.deptId !== null
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
</script>
