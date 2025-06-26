<template>
  <el-upload
      ref="uploadFile"
      action="null"
      :accept="accpet"
      :limit="limit"
      :http-request="httpRequest"
      :fileType="fileType"
      :headers="headers"
      :multiple="false"
      :show-file-list="true"
      :auto-upload="false"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :file-list="fileList"
  >
    <template #trigger>
      <el-button size="small" class="w50" type="primary">选择</el-button>
    </template>
    <el-divider direction="vertical"/>
    <el-button
        size="small"
        type="success"
        class="w50"
        :loading="loading"
        @click="submitUpload"
    >上传
    </el-button>
  </el-upload>
</template>

<script setup name="uploadFile">

import {getToken} from "@/utils/auth";

const props = defineProps({

  limit: {
    type: Number,
    default: 5,
  },

  fileSize: {
    type: Number,
    default: 5,
  },

  fileType: {
    type: Array,
    default: () => ["doc", "xls", "ppt", "txt", "pdf"],
  },
  accpet: {
    type: String,
    default: ".pdf",
  },
});
const loading = ref(false);
const headers = ref({Authorization: "Bearer " + getToken()});
const {proxy} = getCurrentInstance();
const emit = defineEmits();
const fileList = ref([]);

function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
}

function handleUploadError(err) {

  console.log("handleUploadError:上传成功")
  uploadEnd();
}

function handleUploadSuccess(res, file) {

  console.log("handleUploadSuccess:上传成功")
  uploadEnd();
}

function submitUpload() {
  proxy.$refs["uploadFile"].submit();

}

async function httpRequest(param) {
  let fileObj = param.file;

  let fileType = param.file.name.split('.').pop().toLowerCase();
  let fileSize = fileObj.size / 1024 / 1024;
  let isLtSize = fileSize < props.fileSize
  let ext = props.fileType
  if (!isLtSize) {
    proxy.$modal.msgError("请上传小于" + fileSize + "M的文件");
    return;
  }
  if (ext.indexOf(fileType) < 0) {
    proxy.$modal.msgError("请上传" + ext + "格式的文件");
    return;
  }
  loading.value = true;
  emit("uploadByApi", param);

}

function uploadEnd() {
  loading.value = false;

  fileList.value = []
}

const sonFn = () => {
  console.log("被父组件调用")
};

defineExpose({
  sonFn
})
</script>
