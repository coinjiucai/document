<template>
  <el-page-header v-if="showSearchRst" @back="showSearchRstDetails(false)"></el-page-header>
  <el-divider v-if="showSearchRst" />
  <el-row style="width: 100%;">
    <el-tabs v-model="activeName" class="search-tabs" @tab-click="handleClick">
      <el-tab-pane v-if="showJxcgSearchPane" label="教学成果" name="jxcg" class="search-tabs-pane">
        <el-form class="search_form" :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-row>
            <el-form-item label="" prop="">
              <el-text class="w50"></el-text>
            </el-form-item>
            <el-form-item label="" prop="key">
              <el-select ref="jxcgSearchSelectRef" v-model="queryParams.key1" placeholder="全部" clearable>
                <el-option key="1" value="bh" label="成果编号"></el-option>
                <el-option key="2" value="mc" label="名称"></el-option>
                <el-option key="3" value="fzrNickName" label="负责人"></el-option>
                <el-option key="4" value="tjdwmc" label="完成单位"></el-option>
                <el-option key="5" value="lx" label="成果类型"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="keyword1">
              <el-input class="search_input" v-model="queryParams.keyword1" placeholder="请输入成果关键词" clearable
                @keyup.enter="handleQuery" v-if="queryParams.key1 !== 'cglx'">
                <!-- <template #prepend>
                <el-select ref="jxcgSearchSelectRef" v-model="queryParams.key1" placeholder="全部" clearable>
            <el-option key="1" value="bh" label="成果编号"></el-option>
            <el-option key="2" value="mc" label="名称"></el-option>
            <el-option key="3" value="fzrNickName" label="负责人"></el-option>
            <el-option key="4" value="tjdwmc" label="完成单位"></el-option>
            <el-option key="5" value="lx" label="成果类型"></el-option>
        </el-select>
            </template> -->
                <template #prefix>
                  <svg-icon icon-class="search" class="el-input__icon input-icon" />
                </template>
              </el-input>
              <el-form-item label="" prop="cglx" v-if="queryParams.key1 === 'cglx'">
                <el-select ref="jxcgSearchSelectRef" v-model="queryParams.cglx" placeholder="全部" clearable>
                  <el-option v-for="dict in pdmg_cglx" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item v-if="!showMutiCond">
              <el-button type="primary" icon="search" @click="handleQuery" :loading="rstLoading">查询
              </el-button>
              <el-button type="primary" link @click="handleMultiConditions(true)"
                :loading="rstLoading"><u>高级检索</u></el-button>
            </el-form-item>
          </el-row>
          <el-row v-if="showMutiCond">
            <el-form-item label="" prop="">
              <div class="w50">
                <el-text type="primary">AND</el-text>
              </div>
            </el-form-item>
            <el-form-item label="" prop="key2">
              <el-select ref="jxcgSearchSelectRef" v-model="queryParams.key2" placeholder="全部" clearable>
                <el-option key="1" value="bh" label="成果编号"></el-option>
                <el-option key="2" value="mc" label="名称"></el-option>
                <el-option key="3" value="fzrNickName" label="负责人"></el-option>
                <el-option key="4" value="tjdwmc" label="完成单位"></el-option>
                <el-option key="5" value="lx" label="成果类型"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="keyword2">
              <el-input class="search_input" v-model="queryParams.keyword2" placeholder="请输入成果关键词" clearable
                @keyup.enter="handleQuery" v-if="queryParams.key2 !== 'proLx'">
                <template #prefix>
                  <svg-icon icon-class="search" class="el-input__icon input-icon" />
                </template>
              </el-input>
              <el-form-item label="" prop="proLx" v-if="queryParams.key2 === 'proLx'">
                <el-select ref="jxcgSearchSelectRef" v-model="queryParams.cglx" placeholder="全部" clearable>
                  <el-option v-for="dict in pdmg_cglx" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row v-if="showMutiCond">
            <el-form-item label="" prop="">
              <div class="w50">
                <el-text type="primary">AND</el-text>
              </div>
            </el-form-item>
            <el-form-item label="" prop="key3">
              <el-select ref="jxcgSearchSelectRef" v-model="queryParams.key3" placeholder="全部" clearable>
                <el-option key="1" value="bh" label="成果编号"></el-option>
                <el-option key="2" value="mc" label="名称"></el-option>
                <el-option key="3" value="fzrNickName" label="负责人"></el-option>
                <el-option key="4" value="tjdwmc" label="完成单位"></el-option>
                <el-option key="5" value="lx" label="成果类型"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="keyword3">
              <el-input class="search_input" v-model="queryParams.keyword3" placeholder="请输入成果关键词" clearable
                @keyup.enter="handleQuery" v-if="queryParams.key3 !== 'proLx'">
                <template #prefix>
                  <svg-icon icon-class="search" class="el-input__icon input-icon" />
                </template>
              </el-input>
              <el-form-item label="" prop="proLx" v-if="queryParams.key3 === 'proLx'">
                <el-select ref="jxcgSearchSelectRef" v-model="queryParams.cglx" placeholder="全部" clearable>
                  <el-option v-for="dict in pdmg_cglx" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-row>
          <div style="width: 100%;text-align: center;" v-if="showMutiCond">
            <el-button type="primary" icon="search" @click="handleQuery" :loading="rstLoading">查询
            </el-button>
            <el-button type="primary" link @click="handleMultiConditions(false)"
              :loading="rstLoading"><u>普通检索</u></el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="showGhktSearchPane" label="规划课题" name="ghkt" class="search-tabs-pane">
        <el-form class="search_form" :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-row>
            <el-form-item label="" prop="">
              <el-text class="w50"></el-text>
            </el-form-item>
            <el-form-item label="" prop="key1">
              <el-select ref="jxcgSearchSelectRef" v-model="queryParams.key1" placeholder="全部" clearable>
                <el-option key="1" value="bh" label="课题编号"></el-option>
                <el-option key="2" value="mc" label="名称"></el-option>
                <el-option key="3" value="fzrNickName" label="负责人"></el-option>
                <el-option key="4" value="tjdwmc" label="完成单位"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="keyword1">
              <el-input class="search_input" v-model="queryParams.keyword1" placeholder="请输入课题关键词" clearable
                @keyup.enter="handleQuery">
                <template #prefix>
                  <svg-icon icon-class="search" class="el-input__icon input-icon" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="!showMutiCond">
              <el-button type="primary" icon="search" @click="handleQuery" :loading="rstLoading">查询
              </el-button>
              <el-button type="primary" link @click="handleMultiConditions(true)"
                :loading="rstLoading"><u>高级检索</u></el-button>
            </el-form-item>
          </el-row>
          <el-row v-if="showMutiCond">
            <el-form-item label="" prop="">
              <div class="w50">
                <el-text type="primary">AND</el-text>
              </div>
            </el-form-item>
            <el-form-item label="" prop="key2">
              <el-select ref="jxcgSearchSelectRef" v-model="queryParams.key2" placeholder="全部" clearable>
                <el-option key="1" value="bh" label="课题编号"></el-option>
                <el-option key="2" value="mc" label="名称"></el-option>
                <el-option key="3" value="fzrNickName" label="负责人"></el-option>
                <el-option key="4" value="tjdwmc" label="完成单位"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="keyword2">
              <el-input class="search_input" v-model="queryParams.keyword2" placeholder="请输入课题关键词" clearable
                @keyup.enter="handleQuery">
                <template #prefix>
                  <svg-icon icon-class="search" class="el-input__icon input-icon" />
                </template>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row v-if="showMutiCond">
            <el-form-item label="" prop="">
              <div class="w50">
                <el-text type="primary">AND</el-text>
              </div>
            </el-form-item>
            <el-form-item label="" prop="key3">
              <el-select ref="jxcgSearchSelectRef" v-model="queryParams.key3" placeholder="全部" clearable>
                <el-option key="1" value="bh" label="课题编号"></el-option>
                <el-option key="2" value="mc" label="名称"></el-option>
                <el-option key="3" value="fzrNickName" label="负责人"></el-option>
                <el-option key="4" value="tjdwmc" label="完成单位"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="keyword3">
              <el-input class="search_input" v-model="queryParams.keyword3" placeholder="请输入课题关键词" clearable
                @keyup.enter="handleQuery">
                <template #prefix>
                  <svg-icon icon-class="search" class="el-input__icon input-icon" />
                </template>
              </el-input>
            </el-form-item>
          </el-row>
          <div style="width: 100%;text-align: center;" v-if="showMutiCond">
            <el-button type="primary" icon="search" @click="handleQuery" :loading="rstLoading">查询
            </el-button>
            <el-button type="primary" link @click="handleMultiConditions(false)"
              :loading="rstLoading"><u>普通检索</u></el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-row>
  <el-row style="width: 100%;" v-if="showSearchRst">
    <project-search-rst :loading="rstLoading" :proList="searchRstList" />
  </el-row>
  <el-row class="pagination-row" v-if="showSearchRst">
    <el-pagination background layout="total, prev, pager, next" :total="total" :current-page="queryParams.pageNum"
      :page-size="queryParams.pageSize" @current-change="handleCurrentChange">
    </el-pagination>
  </el-row>
</template>

<script setup>
import projectSearchRst from "./projectSearchRst.vue";
import { projectSearchJxcg, projectSearchGhkt } from "@/api/frontIndex/frontIndex";
import auth from '@/plugins/auth'

const { proxy } = getCurrentInstance();

const { pdmg_cglx } = proxy.useDict("pdmg_cglx");

const emit = defineEmits(["showIndexContent"]);

const props = defineProps({});

const rstLoading = ref(false)
const showMutiCond = ref(false)
const showSearchRst = ref(false)
const searchRstList = ref([])
const total = ref(0)
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  type: "jxcg",
  key1: "mc",
  key2: "fzrNickName",
  key3: "tjdwmc",
  cglx: undefined,
  keyword: undefined
})
const activeName = ref('jxcg')
const handleClick = (tab, event) => {

  queryParams.value.type = tab.props.name
}

function handleMultiConditions(val) {
  showMutiCond.value = val
  if (val === false) {
    queryParams.value.keyword2 = undefined
    queryParams.value.keyword3 = undefined
  }
}

function showSearchRstDetails(val) {
  showSearchRst.value = val
  emit("showIndexContent", !val)
  if (val) {
    searchRstList.value = []
  }
}

function handleCurrentChange(pageVal) {
  queryParams.value.pageNum = pageVal;
  handleQuery();
}

function handleQuery() {
  let query = getQueryInfo();
  if (JSON.stringify(query) === "{}") {
    proxy.$modal.notifyWarning("请输入查询关键词");
    return;
  }

  rstLoading.value = true;

  query = Object.assign(query, { pageNum: queryParams.value.pageNum, pageSize: queryParams.value.pageSize })
  console.log("handleQuery", query)
  if (queryParams.value.type === 'jxcg') {
    projectSearchJxcg(query).then(rsp => {
      total.value = rsp.total
      searchRstList.value = rsp.rows;
      showSearchRst.value = true;
      rstLoading.value = false;
      emit("showIndexContent", false)
    })
  } else {
    projectSearchGhkt(query).then(rsp => {
      total.value = rsp.total
      searchRstList.value = rsp.rows;
      showSearchRst.value = true;
      rstLoading.value = false;
      emit("showIndexContent", false)
    })
  }
}

function getQueryInfo() {
  let query = {}
  for (let i in [1, 2, 3]) {
    if (queryParams.value["keyword" + i] !== undefined && queryParams.value["keyword" + i] !== '') {
      if (queryParams.value["key" + i] === undefined || queryParams.value["key" + i] === '') {
        query.params = { all: queryParams.value["keyword" + i] }
      } else {
        query[queryParams.value["key" + i]] = queryParams.value["keyword" + i]
      }
    }
  }
  return query;
}

const showJxcgSearchPane = ref(false)
const showGhktSearchPane = ref(false)

function initActiveTab() {
  if (auth.hasPermi("main:search:searchJxcg")) {
    activeName.value = 'jxcg';
    showJxcgSearchPane.value = true;
  } else if (auth.hasPermi("main:search:searchGhkt")) {
    activeName.value = 'ghkt';
    showGhktSearchPane.value = true;
  }
}

initActiveTab()
</script>

<style scoped>
.search-tabs-pane {
  padding-top: 30px;
}

.pagination-row {
  padding-top: 20px;
}
</style>

<style lang='scss' scoped>
.search_form {
  .el-select {
    max-width: 180px;
  }

  .search_input {
    width: 500px;
    height: 38px;

    input {
      height: 38px;
    }
  }
}

.search-tabs {
  width: 100%;
}

.search-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
