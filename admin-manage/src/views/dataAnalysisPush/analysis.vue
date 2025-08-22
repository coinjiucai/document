<template>
  <div class="push-analysis full-block">
    <el-row class="full-block">
      <el-col class="left-container tree-container">
        <UserCatalogue
          ref="catalogue"
          title="组织架构"
          node-key="id"
          :tree-data.sync="treeList"
          :get-url="['System', 'psysysdepartTreeList']"
          :delete-url="['System', 'sysprivacyuserDeleteBatch']"
          :disabledOption="true"
          :default-props="{
            label: 'name',
            value: 'id',
            children: 'childrenList'
          }"
          :hasUser="true"
          @current-change="handleCurrentChange"
          @scroll="handleScroll"
          @filter="filter"
        >
        </UserCatalogue>
      </el-col>
      <el-col
        style="
          display: flex;
          flex-direction: column;
          width: calc(100% - 340px);
          height: 100%;
          padding-left: 10px;
        "
      >
        <template>
          <div class="search">
            <el-form size="mini" :inline="true">
              <el-form-item label="类别">
                <el-select
                  v-model="params.type"
                  placeholder="请选择"
                  style="width: 160px"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间选择">
                <rangeBothValue
                  dataType="daterange"
                  size="mini"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd"
                  :end-value.sync="params['endTime']"
                  :start-value.sync="params['startTime']"
                  :picker-options="pickerOptions"
                >
                </rangeBothValue>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search()">查询</el-button>
              </el-form-item>
            </el-form>
          </div>

          <template v-if="compKey">
            <xlcp
              ref="xlcp"
              v-if="params.type == 1"
              :userInfo="userInfo"
              :compKey="compKey"
              :param="params"
            ></xlcp>
            <xljy
              ref="xljy"
              v-else-if="params.type == 2"
              :userInfo="userInfo"
              :compKey="compKey"
              :param="params"
            ></xljy>
            <rzxl
              ref="rzxl"
              v-else-if="params.type == 3"
              :userInfo="userInfo"
              :compKey="compKey"
              :param="params"
            ></rzxl>
            <znxlzx
              ref="znxlzx"
              v-else-if="params.type == 4"
              :userInfo="userInfo"
              :compKey="compKey"
              :param="params"
            ></znxlzx>
          </template>
        </template>
        <!-- <template v-else>
          <el-empty :image-size="80" :image="noData"></el-empty>
        </template> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserCatalogue from '@/components/Project/UserCatalogue';
import rangeBothValue from '@/components/Date/rangeBothValue';
import BaseTable from '@/components/Base/BaseTable';
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
import xlcp from './components/xlcp';
import xljy from './components/xljy';
import rzxl from './components/rzxl';
import znxlzx from './components/znxlzx';
import { generateId } from '@/utils/utils';
const noData = require('@/assets/images/no-data.png');
import Common from '@/com/common';
export default {
  components: {
    UserCatalogue,
    rangeBothValue,
    BaseTable,
    chart,
    xlcp,
    xljy,
    rzxl,
    znxlzx
  },
  mixins: [chartsBase],
  data() {
    return {
      noData,
      loading: false,
      compKey: generateId(),
      originTreeList: [],
      treeList: [],
      depart: null,
      pageObj: {},
      pageInfo: {
        pageNo: 1,
        pageSize: 50
      },
      list: [],
      realname: '',
      // 搜索参数
      params: {
        type: 1,
        startTime: '',
        endTime: ''
      },
      typeOptions: [
        {
          label: '心理测评',
          value: 1
        },
        {
          label: '心理教育',
          value: 2
        },
        {
          label: '认知训练',
          value: 3
        },
        {
          label: '智能心理咨询',
          value: 4
        }
      ],
      userInfo: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getTreeList();
  },
  mounted() {},
  methods: {
    getTreeList() {
      this.$api.System.psysysdepartTreeList().then((res) => {
        this.originTreeList = res.result;
      });
    },
    search() {
      this.compKey = generateId();
      if (this.params.type == 1) {
        this.$refs.xlcp.init();
      } else if (this.params.type == 2) {
        this.$refs.xljy.init();
      } else if (this.params.type == 3) {
        this.$refs.rzxl.init();
      } else if (this.params.type == 4) {
        this.$refs.znxlzx.init();
      }
    },
    handleCurrentChange(data) {
      if (!data.isUser) {
        this.depart = data;
      }
      if (!data.isUser) {
        this.treeList = Common.CloneDeep(this.originTreeList);
        this.list = [];
        this.pageInfo = { pageNo: 1, pageSize: 50 };
        this.getList();
      } else if (data.isUser) {
        this.compKey = generateId();
        this.userInfo = data;
      }
    },
    removeDuplicatesById(arr) {
      return arr.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
    },
    getList(departId, callback = null) {
      this.loading = true;
      const keyword = this.$refs.catalogue.keyword;
      this.$api.basics
        .userList({
          departId: departId ? departId : this.depart ? this.depart.id : '',
          ...this.pageInfo,
          realname: keyword
        })
        .then((res) => {
          var records = res?.result?.records || [];
          this.pageObj[this.depart.id] = res.result.pages;
          const list = records.map((v) => {
            return {
              ...v,
              id: v.id,
              name: v.realname,
              isUser: true,
              departId: this.depart.id
            };
          });
          const node = this.$refs.catalogue.getNodeData(this.depart.id);
          if (list?.length) {
            this.list = [...this.list, ...list];

            const childrenList = node.data.childrenList
              ? node.data.childrenList
              : [];
            node.data.childrenList = [...childrenList, ...this.list];

            node.data.childrenList = this.removeDuplicatesById(
              node.data.childrenList
            );
            this.treeList = [...this.treeList];
            this.userInfo = this.list[0];
            this.$nextTick(() => {
              this.$refs.catalogue.currentNodeKey = this.userInfo.id;
              this.$refs.catalogue.setCurrentNode(this.userInfo.id);
            });
          } else {
            node.data.childrenList = [];
            this.userInfo = null;
          }
          if (callback) {
            callback();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleScroll() {
      if (this.depart && this.depart.id) {
        const departId = this.depart.id;
        const pages = this.pageObj[departId];
        if (this.pageInfo.pageNo < pages) {
          this.pageInfo.pageNo++;
        }
        this.getList(departId);
      }
    },
    filter(val) {
      if (!this.depart) {
        this.$message.error('请先选择一个部门');
      } else {
        this.list = [];
        this.pageInfo.pageNo = 1;
        this.realname = val;
        this.treeList = Common.CloneDeep(this.originTreeList);
        this.getList(this.depart.id, () => {
          this.$refs.catalogue.initScroll();
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.push-analysis {
  padding: 10px 20px;
  .left-container {
    width: 330px;
    padding-top: 25px;
    background-image: url('~@/assets/images/person-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 10px;
  }
}
</style>
