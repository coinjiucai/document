<template>
  <div>
    <!-- 管理员查看 -->
    <div v-if="isadmin">
      <el-tabs type="border-card">
        <el-tab-pane label="专家投票情况">
          <el-table
              v-loading="expert_loading"
              :data="expertVoteList"
              @expand-change="expertRowExpand"
              :row-key='getExpertRowKeys'
              :expand-row-keys="expertExpands"
          >
            <el-table-column type="expand">
              <template #default="">
                <!-- header-cell-class="child-table-header" -->
                <el-table :data="expertDetailData" border class="child-table" v-loading="detail_loading">
                  <el-table-column label="名称" prop="proMc" align="center" :show-overflow-tooltip="true"/>
                  <el-table-column label="类型" prop="lx" align="center">
                    <template #default="scope">
                      <dict-tag :options="pdmg_cglx" :value="scope.lx"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="负责人" prop="fzrNickName" align="center"/>
                  <el-table-column label="填报单位" prop="deptName" align="center" :show-overflow-tooltip="true"/>
                </el-table>
                <pagination
                    v-show="expertDetailTotal > 0"
                    :total="expertDetailTotal"
                    v-model:page="expertDetailQuery.pageNum"
                    v-model:limit="expertDetailQuery.pageSize"
                    @pagination="getExpertDetailList"
                />
              </template>
            </el-table-column>
            <el-table-column
                label="ID"
                align="center"
                prop="expertId"
                :show-overflow-tooltip="true"
                v-if="false"
            />
            <el-table-column
                label="专家名称"
                align="center"
                prop="nickName"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="投票状态"
                align="center"
                prop="statuscode"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="已投"
                align="center"
                prop="passProNum"
                :show-overflow-tooltip="true"
            />

            <el-table-column
                label="未投"
                align="center"
                width="120"
                prop=""
                :show-overflow-tooltip="true"
            />
          </el-table>
          <pagination
              v-show="expertVoteTotal > 0"
              :total="expertVoteTotal"
              v-model:page="expertVoteQuery.pageNum"
              v-model:limit="expertVoteQuery.pageSize"
              @pagination="getExpertVoteList"
          />
        </el-tab-pane>
        <el-tab-pane label="项目投票情况">
          <el-table
              v-loading="project_loading"
              :data="projectVoteList"
              @expand-change="projectRowExpand"
              :row-key='getProjectRowKeys'
              :expand-row-keys="projectExpands"
          >
            <el-table-column type="expand">
              <template #default="">
                <el-table :data="projectDetailData" border class="child-table" v-loading="detail_loading">
                  <el-table-column label="专家名称" prop="project.mc" :show-overflow-tooltip="true"/>
                  <el-table-column label="投票状态" prop="project.lx">

                  </el-table-column>
                  <el-table-column label="已投" prop="project.nickName"/>
                  <el-table-column label="未投" prop="project.deptName" :show-overflow-tooltip="true"/>
                </el-table>
                <pagination
                    v-show="projectDetailTotal > 0"
                    :total="projectDetailTotal"
                    v-model:page="projectDetailQuery.pageNum"
                    v-model:limit="projectDetailQuery.pageSize"
                    @pagination="getProjectDetailList"
                />
              </template>
            </el-table-column>
            <el-table-column
                label="ID"
                align="center"
                prop="projectId"
                :show-overflow-tooltip="true"
                v-if="false"
            />
            <el-table-column
                label="项目名称"
                align="center"
                prop="mc"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="类型"
                align="center"
                prop="lx"
                :show-overflow-tooltip="true"
            >
              <template #default="scope">
                <dict-tag :options="pdmg_cglx" :value="scope.row.lx"/>
              </template>
            </el-table-column>
            <el-table-column
                label="负责人"
                align="center"
                prop="project.fzrNickName"
                :show-overflow-tooltip="true"
            />

            <el-table-column
                label="申报单位"
                align="center"
                width="120"
                prop="project.deptName"
                :show-overflow-tooltip="true"
            />
          </el-table>
          <pagination
              v-show="projectVoteTotal > 0"
              :total="projectVoteTotal"
              v-model:page="projectVoteQuery.pageNum"
              v-model:limit="projectVoteQuery.pageSize"
              @pagination="getProjectVoteList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 专家查看 -->
    <div v-if="!isadmin">
      <el-table
          v-loading="project_loading"
          :data="projectVoteList"
          @expand-change="projectRowExpand"
          :row-key='getProjectRowKeys'
          :expand-row-keys="projectExpands"
      >
        <el-table-column type="expand">
          <template #default="">
            <el-table :data="projectDetailData" border class="child-table" v-loading="detail_loading">
              <el-table-column label="专家名称" prop="project.mc" :show-overflow-tooltip="true"/>
              <el-table-column label="投票状态" prop="project.lx">

              </el-table-column>
              <el-table-column label="已投" prop="project.nickName"/>
              <el-table-column label="未投" prop="project.deptName" :show-overflow-tooltip="true"/>
            </el-table>
            <pagination
                v-show="projectDetailTotal > 0"
                :total="projectDetailTotal"
                v-model:page="projectDetailQuery.pageNum"
                v-model:limit="projectDetailQuery.pageSize"
                @pagination="getProjectDetailList"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="ID"
            align="center"
            prop="projectId"
            :show-overflow-tooltip="true"
            v-if="false"
        />
        <el-table-column
            label="项目名称"
            align="center"
            prop="mc"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="类型"
            align="center"
            prop="lx"
            :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <dict-tag :options="pdmg_cglx" :value="scope.row.lx"/>
          </template>
        </el-table-column>
        <el-table-column
            label="负责人"
            align="center"
            prop="project.fzrNickName"
            :show-overflow-tooltip="true"
        />

        <el-table-column
            label="申报单位"
            align="center"
            width="120"
            prop="project.deptName"
            :show-overflow-tooltip="true"
        />
      </el-table>
      <pagination
          v-show="projectVoteTotal > 0"
          :total="projectVoteTotal"
          v-model:page="projectVoteQuery.pageNum"
          v-model:limit="projectVoteQuery.pageSize"
          @pagination="getProjectVoteList"
      />
    </div>
  </div>
</template>
<script setup name="VoteDetail">
import {ref} from 'vue'

const {proxy} = getCurrentInstance();
const {pdmg_pro_state, sys_mj, sys_yes_no, pdmg_cglx} = proxy.useDict(
    "pdmg_pro_state",
    "sys_mj",
    "sys_yes_no",
    "pdmg_cglx"
);
const props = defineProps({
  atvId: {type: String, default: ''},

  isadmin: {type: Boolean, default: false}
})

const expert_loading = ref(false)
const project_loading = ref(false)
const detail_loading = ref(false)
const expertVoteList = ref([])
const expertDetailData = ref([])
const projectVoteList = ref([])
const projectDetailData = ref([])

const expertVoteTotal = ref(0)
const expertVoteQuery = reactive({
  pageNum: 1,
  pageSize: 10,
})
const expertDetailTotal = ref(0)
const expertDetailQuery = reactive({
  pageNum: 1,
  pageSize: 10,
})
const projectVoteTotal = ref(0)
const projectVoteQuery = reactive({
  pageNum: 1,
  pageSize: 10,
})
const projectDetailTotal = ref(0)
const projectDetailQuery = reactive({
  pageNum: 1,
  pageSize: 10,
})

const expertExpands = ref([])

function getExpertRowKeys(row) {
  return row.expertId
}

const projectExpands = ref([])

function getProjectRowKeys(row) {
  return row.projectId
}

function getExpertVoteList() {

}

function getExpertDetailList() {

}

function getProjectVoteList() {

}

function getProjectDetailList() {

}

function init() {
  expertVoteList.value = [{
    expertId: '1',
    nickName: '测试1',
    statuscode: '1',
    passProNum: '1',
    detail: [],
  },
    {
      expertId: '2',
      nickName: '测试2',
      statuscode: '1',
      passProNum: '1',
    },
    {
      expertId: '3',
      nickName: '测试3',
      statuscode: '1',
      passProNum: '1',
    }]

  projectVoteList.value = [{
    projectId: '2',
    mc: '2',
    lx: '1',
    project: {
      lx: '1',
      fzrNickName: '1',
      deptName: '1'
    }
  },
    {
      projectId: '3',
      mc: '3',
      lx: '1',
      project: {
        lx: '1',
        fzrNickName: '1',
        deptName: '1'
      }
    },
    {
      projectId: '4',
      mc: '4',
      lx: '1',
      project: {
        lx: '1',
        fzrNickName: '1',
        deptName: '1'
      }
    },]

}

function expertRowExpand(row, expandedRows) {
  console.log("expandedRows:", expandedRows)

  if (expandedRows.length) {
    expertExpands.value = [];
    if (row) {
      expertExpands.value.push(row.expertId);
    }
  } else {
    expertExpands.value = [];
  }

  expertDetailData.value = [{
    proMc: row.nickName,
    lx: '1',
    fzrNickName: '1',
    deptName: '1'

  }];

}

function projectRowExpand(row, expandedRows) {
  console.log("expandedRows:", expandedRows)

  if (expandedRows.length) {
    projectExpands.value = [];
    if (row) {
      projectExpands.value.push(row.projectId);
    }
  } else {
    projectExpands.value = [];
  }

  console.log(row)
  projectDetailData.value = [{
    project: {
      mc: '测试' + row.projectId,
      lx: '1',
      nickName: '1',
      deptName: '1'
    }
  }];

}

init();
</script>

<style lang='scss' scoped>
.child-table {
  margin: 0 auto;
  width: 96%;
}
</style>
