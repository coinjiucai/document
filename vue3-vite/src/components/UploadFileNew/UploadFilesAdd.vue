<template>
  <div>
    <div class='list-title' v-if="title !== undefined && title !== '' && title !== null">
      {{ title }}
    </div>
    <!-- 表头按钮 -->
    <!-- <el-page-header v-if="toolBtn" @back="handleCloseTable">
      <template #content>
      <span v-if="title !== undefined && title !== ''&& title !== null" class="text-large font-600 mr-3"> {{ title }} </span>
      </template>
</el-page-header>
<el-divider v-if="toolBtn" /> -->
    <el-row :gutter="10" class="mb8 row" v-if="toolBtn">
      <el-col :span="1.5" v-if="title === undefined || title === '' || title === null || backBtn === true">
        <el-button plain icon="arrowLeftBold" size="small" @click="handleCloseTable">返回</el-button>
      </el-col>
      <right-toolbar @queryTable="refreshFileList()" :columns="columns" v-if="toolBtn"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="fileList" class="table" :default-sort="{ prop: 'xssx', order: 'ascending' }"
      border>
      <el-table-column align="center" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" width="80" v-if="columns[0].visible" />
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" v-if="columns[1].visible" />
      <el-table-column label="年度" prop="nd" :show-overflow-tooltip="true" width="80"
        v-if="columns[2].visible && showNdCol" sortable />
      <el-table-column label="类型" align="center" prop="ext" width="120" v-if="columns[3].visible">
      </el-table-column>
      <el-table-column label="是否必须" align="center" width="80" prop="required" v-if="columns[4].visible && !viewType">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.required === true ? 'Y' : 'N'" />
        </template>
      </el-table-column>
      <el-table-column label="大小限制" align="center" width="80" prop="maxSize" v-if="columns[5].visible && !viewType">
        <template #default="scope">
          <span>{{ scope.row.maxSize }}M</span>
        </template>
      </el-table-column>
      <el-table-column label="顺序" align="center" width="80" prop="xssx" v-if="columns[6].visible" sortable>
        <template #default="scope">
          <span>{{ scope.row.xssx }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预览" prop="path" v-if="columns[7].visible" :show-overflow-tooltip="true" width="200">
        <template #default="scope">
          <el-button type="primary" link v-if="scope.row.path" @click="(e, row) => handlePdfView(e, scope.row)">
            {{ scope.row.name }}.{{ scope.row.path.split('.').pop().toLowerCase() }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220" fixed="right"
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
            <el-divider direction="vertical" />
            <el-button size="small" class="w50" type="success" :loading="upload.isUploading"
              @click="submitUpload(scope.row)">上传
            </el-button>
            <el-divider direction="vertical" v-if="scope.row.del_url && scope.row.path" />
            <el-button size="small" class="w50" type="danger" :loading="upload.isUploading"
              v-if="scope.row.del_url && scope.row.path" @click="removeFiles(scope.row)">删除
            </el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-container" v-if="toolBtn && title !== undefined && title !== '' && title !== null">
      <el-button type="primary" plain icon="arrowLeftBold" @click="handleCloseTable">返回</el-button>
    </div>
  </div>
</template>

<script setup name="UploadFiles">
import request from '@/utils/request'
import { getToken } from "@/utils/auth";
import { pdfPreview, uploadFile } from '@/utils/request'
import { computed } from "vue";

const { proxy } = getCurrentInstance();
const { sys_yes_no } = proxy.useDict("sys_yes_no");

const emits = defineEmits();

const props = defineProps({
  fileList: {
    type: Array,
    default: []
  },
  title: {
    type: String,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: false
  },
  toolBtn: {
    type: Boolean,
    default: true
  },
  backBtn: {
    type: Boolean,
    default: false
  },
  viewType: {
    type: Boolean,
    default: true
  }
});

const loading = ref(props.loading || false);

const showNdCol = computed(() => {
  return (props.fileList[0] !== undefined && props.fileList[0].nd !== undefined)
})
const columns = ref([
  { key: 0, label: `ID`, visible: false },
  { key: 1, label: `名称`, visible: true },
  { key: 2, label: `年度`, visible: true },
  { key: 3, label: `类型`, visible: true },
  { key: 4, label: `是否必须`, visible: true },
  { key: 5, label: `大小限制`, visible: true },
  { key: 6, label: `显示顺序`, visible: false },
  { key: 7, label: `预览`, visible: true },
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
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const headers = ref({ Authorization: "Bearer " + getToken() });

const testFileList = ref([]);
const selectedRow = ref({});
const handleExceed = (files) => {

  proxy.$refs["uploadFile" + selectedRow.value.id].clearFiles();
  testFileList.value[selectedRow.value.id] = [];
  proxy.$refs["uploadFile" + selectedRow.value.id].handleStart(files[0]);
};
const handleChange = (file, fileList) => {
  testFileList.value[selectedRow.value.id] = [];
  testFileList.value[selectedRow.value.id].push(file);
};

function selectUpload(row) {

  selectedRow.value = row;
}

function refreshFileList() {
  loading.value = true;

  emits("refreshFileList");
  loading.value = false;
}

function handleCloseTable() {
  emits("showInfo", false);
}

async function submitUpload(row) {
  selectedRow.value = row;
  proxy.$refs["uploadFile" + row.id].submit();
}

function removeFiles(row) {
  request({
    url: row.del_url,
    method: 'delete',
    data: row
  }).then(rsp => {
    emits("refreshFileList");
    proxy.$modal.msgSuccess("删除成功")
  })
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
  let urlParam = new FormData();
  urlParam.append("file", fileObj);
  urlParam.append("param", JSON.stringify(param.data));

  console.log('request:', urlParam);
  uploadFile(param.data.url, urlParam).then((res) => {
    if (res.code === 200) {
      proxy.$modal.msgSuccess("上传成功！")
    } else {
      proxy.$modal.msgError("上传失败！")
    }
    refreshFileList();
    testFileList.value[param.data.id] = [];
    proxy.$refs["uploadFile" + sparam.data.id].clearFiles();
  }).catch(() => {
    loading.value = false;
  });
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
  let path = "/" + row.path;
  let mode = row.mode || "review";
  pdfPreview(baseUrl, "r", path, mode, null, { title: row.name });
}

function listToString(list, separator) {
  let strs = "";
  separator = separator || ",";
  for (let i in list) {
    strs += "." + list[i] + separator;
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : '';
}

watch(() => props.loading, val => {
  loading.value = val
})
</script>

<style lang="scss" scoped>
.list-title {
  margin-bottom: 10px;
  line-height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 0 20px;
  border-bottom: 1px solid rgb(76, 158, 235);
  font-size: 23px;
}
</style>

<style scoped>
.row {
  min-height: 30px;
}

.table {
  margin-top: 10px;
}

.btn-container {
  padding: 20px 40px 0px 0px;
  text-align: right;
}
</style>
