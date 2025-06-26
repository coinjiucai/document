<template>
  <div class="app-container">
    <!-- 表头按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="arrowLeftBold" @click="handleCloseTable">返回</el-button>
      </el-col>
      <right-toolbar @queryTable="getList()" :columns="columns"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="proUploadFilesList">
      <el-table-column label="序号" align="center" prop="id" v-if="columns[0].visible">
        <template #default="scope"><span class="reviewMode content-style">{{ scope.row.id }}</span></template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true" v-if="columns[1].visible">
        <template #default="scope"><span class="reviewMode content-style">{{ scope.row.name }}</span></template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="ext" width="120" v-if="columns[2].visible">
        <template #default="scope"><span class="reviewMode content-style" v-if="scope.row.ext && scope.row.ext[0]">{{ scope.row.ext[0] }}</span></template>
      </el-table-column>
      <el-table-column label="是否必须" align="center" width="80" prop="required" v-if="columns[3].visible">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.required === true ? 'Y' : 'N'" />
        </template>
      </el-table-column>
      <el-table-column label="预览" align="center" width="180" prop="path" v-if="columns[4].visible"
        :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button type="primary" text v-if="scope.row.path" @click="(e, row) => handlePdfView(e, scope.row)">
            {{ scope.row.name }}.{{ scope.row.path.split('.').pop().toLowerCase() }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right"
        v-if="!viewType">
        <template #default="scope">
          <el-upload :ref="'uploadFile' + scope.row.id" action="scope.row.id" :limit="1" :data=scope.row
            :accept="listToString(scope.row.ext)" :http-request="httpRequest" :fileType="scope.row.ext"
            :headers="headers" :multiple="false" :show-file-list="true" :file-list="testFileList[scope.row.id]"
            :on-exceed="handleExceed" :on-change="handleChange" :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess" :on-error="handleUploadError" :auto-upload="false">
            <template #trigger>
              <el-button size="small" class="w50" type="primary" @click="selectUpload(scope.row)">选取
              </el-button>
            </template>
            <!-- <el-button size="small" type="primary">选取文件 </el-button> -->
            <el-divider direction="vertical" />
            <el-button size="small" class="w50" type="success" :loading="upload.isUploading"
              @click="submitUpload(scope.row)">上传
            </el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="UploadFiles">

import { getToken } from "@/utils/auth";
import { pdfPreview } from '@/utils/request'

const { proxy } = getCurrentInstance();
const { sys_yes_no } = proxy.useDict("sys_yes_no");

const emits = defineEmits();

const props = defineProps({
  selectedId: {
    type: Number,
    default: 1,
  },
  projectId: {
    type: String,
    default: ""
  },
  atvId: {
    type: String,
    default: ""
  },
  viewType: {
    type: Boolean,
    default: false
  }
});

const loading = ref(true);
const proUploadFilesList = ref([]);

const columns = ref([
  { key: 0, label: `ID`, visible: false },
  { key: 1, label: `名称`, visible: true },
  { key: 2, label: `类型`, visible: true },
  { key: 3, label: `是否必须`, visible: true },
  { key: 4, label: `文件名`, visible: true },
]);

const upload = ref({

  isUploading: false,

  headers: {},

  url: "",

  fileList: [],

  fileType: {
    type: Array,
    default: () => ["doc", "xls", "ppt", "txt", "pdf"],
  },
});
const form = ref({});

const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/project/project/upload/file");
const headers = ref({ Authorization: "Bearer " + getToken() });

const testFileList = ref([]);
const selectedRow = ref({});
const handleExceed = (files) => {
  console.log(files);
  proxy.$refs["uploadFile" + selectedRow.value.id].clearFiles();
  testFileList.value[selectedRow.value.id] = [];
  proxy.$refs["uploadFile" + selectedRow.value.id].handleStart(files[0]);
};
const handleChange = (file, fileList) => {
  console.log(file);
  console.log(fileList);
  testFileList.value[selectedRow.value.id] = [];
  testFileList.value[selectedRow.value.id].push(file);
};

function selectUpload(row) {
  console.log(row);
  selectedRow.value = row;
}

onMounted(() => {
  if (props.selectedId !== undefined && props.selectedId !== null && props.selectedId !== 0) {
    getList();
  }
})

function getList() {
  loading.value = true;

  emits("getList");
}

function getListCallBack(data) {
  if (data != undefined && data != null) {
    proUploadFilesList.value = data
    if (props.viewType) {
      proUploadFilesList.value = data.filter(item => item.path !== undefined)
    }
  }
  loading.value = false;
}

function handleCloseTable() {
  emits("showInfo", false);
}

async function submitUpload(row) {
  selectedRow.value = row;
  proxy.$refs["uploadFile" + row.id].submit();
}

function httpRequest(param) {

  let fileObj = param.file;
  let fileType = param.file.name.split('.').pop().toLowerCase();
  let fileSize = fileObj.size / 1024 / 1024;
  let isLtSize = fileSize < param.data.maxSize
  let ext = param.data.ext
  if (!isLtSize) {

    proxy.$modal.msgError("请上传小于" + param.data.maxSize + "M的文件");
    return;
  }
  if (ext.indexOf(fileType) < 0) {
    proxy.$modal.msgError("请上传" + ext + "格式的文件");
    return;
  }
  loading.value = true;
  let index = param.data.id - 1
  emits("upload", param)
}

function handleFileUploadProgress(event, file, fileList) {
  loading.value = proxy.$loading({
    lock: true,
    text: "上传中",
    background: "rgba(0, 0, 0, 0.7)",
  });
  upload.isUploading = true;
}

function handleFileSuccess(response, file, fileList) {
  upload.isUploading = false;

  loading.close();
  upload.value.fileList = [];
}

function handleUploadError() {
  loading.close();
}

function handlePdfView(e, row) {
  console.log('handlePdfView', row)

  if (!(row.path.indexOf('files') === 0 || row.path.indexOf('tjFile') === 0 || row.path.indexOf('actFile') === 0)) {
    if (row.path.indexOf('project') === 0) {
      let pathArray = row.path.split('tjFile', 2);
      row.path = 'tjFile' + pathArray[1];
    } else if (row.path.indexOf('files') !== 0) {
      row.path = 'files/' + row.path;
    } else if (row.path.indexOf('actFile') !== 0) {
      let pathArray = row.path.split('actFile', 2);
      row.path = 'actFile' + pathArray[1];
    }
  }

  if (row.path.indexOf('files/recommend/') === 0) {
    let pathArray = row.path.split('files', 2);
    let path = pathArray[1];
    pdfPreview(baseUrl, "r", path, null, null, { title: row.name });
  } else if (row.path.indexOf('actFile/') === 0) {
    let path = 'activity/' + props.selectedId + '/' + row.path;

    if (!props.viewType) {

      pdfPreview(baseUrl, "r", path, null, null, { title: row.name });
    } else if (row.mode != undefined && row.mode == 'primary' && props.viewType) {
      pdfPreview(baseUrl, "r", path, null, null, { title: row.name });
    } else {
      pdfPreview(baseUrl, "r", path, "review", null, { title: row.name });
    }
  } else {
    let path = props.projectId + '/' + row.path;
    let reviewFlag = undefined;
    pdfPreview(baseUrl, "b", path, reviewFlag, null, { title: row.name });
  }
}

function getuploadCallBack(index) {
  if (index != undefined && index != null) {
    testFileList.value[selectedRow.value.id] = [];
    proxy.$refs["uploadFile" + selectedRow.value.id].clearFiles();
  }
  loading.value = false;
}

function listToString(list, separator) {
  let strs = "";
  separator = separator || ",";
  for (let i in list) {
    strs += "." + list[i] + separator;
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : '';
}

defineExpose({
  getListCallBack,
  getuploadCallBack
})
</script>
