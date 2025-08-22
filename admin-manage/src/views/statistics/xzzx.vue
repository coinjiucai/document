<template>
  <div class="xzzx full-block">
    <el-row class="full-block">
      <el-col :span="6" class="left-container" style="height: 100%">
        <div class="left-header">组织架构</div>
        <div class="left-ctc">
          <el-input placeholder="请输入关键词" v-model="keyword">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <div class="user-list">
            <div>石智勇</div>
            <div>石智勇</div>
            <div>石智勇</div>
            <div>石智勇</div>
            <div>石智勇</div>
          </div>
          <div class="pagination-c">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="10"
              layout="prev, next, jumper,slot"
              :total="400"
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="18" style="height: 100%; padding-left: 10px">
        <div class="search">
          <Search
            :params="params"
            :fieldsConfig="fieldsConfig"
            @handleSearch="handleSearch"
          ></Search>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "@/components/Search/Search";
import BaseTable from "@/components/Base/BaseTable";
export default {
  components: { Search, BaseTable },
  data() {
    return {
      keyword: "",
      currentPage: 1,
      // 搜索参数
      params: {
        queryStartTime: "", //
        queryEndTime: "", //
        range: [],
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "时间选择",
          compType: "daterange",
          width: 160,
          placeholder: "时间选择",
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",
          prop: "range",
          clearable: true,
        },
      ],
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    selectRowList(list) {
      this.selection = list;
    },
    handleSearch() {},
    getList() {
      //   this.$api.System.getSysprivacyplacePageList(this.pageInfo).then((res) => {
      //     this.dataList = res["result"].records;
      //     this.total = res["result"].total;
      //   });
    },
  },
};
</script>
<style lang="scss" scoped>
.xzzx {
  padding: 20px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("~@/assets/images/main-bg.png");
  .left-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #79b1e9;
    background-color: rgba(129, 151, 189, 0.2);
    box-shadow: 5px 8px 5px 0px rgba(6, 27, 48, 0.51);
    .left-header {
      line-height: 30px;
      padding: 0 10px;
      background-color: rgba(172, 215, 255, 0.2);
    }
    .left-ctc {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 10px 10px 0;
      .user-list {
        flex: 1;
        > div {
          border-bottom: 1px solid rgba(129, 151, 189, 0.23);
          line-height: 32px;
          font-size: 14px;
        }
      }
      .pagination-c {
        margin-bottom: 10px;
      }
    }
  }
}
</style>