<template>
  <el-divider content-position="left" v-if="showList"><span style="color: gray;">查询结果</span></el-divider>
  <div class="searchRst" v-if="showList" v-loading="loading">
    <el-row class="searchRstListDiv" v-for="item in proList">
      <div class="searchRstTitle"><a href="javascript:void(0)" @click="handleSearchDetails(item)">{{ item.mc }}</a>
      </div>
      <div class="searchRstDetails">
        <el-text>{{ item.params.details }} - {{ item.params.data }}</el-text>
      </div>
    </el-row>
  </div>
</template>

<script name="searchRst" setup>
const {proxy} = getCurrentInstance();

const props = defineProps({
  loading: {type: Boolean, default: true},
  proList: {type: Array, default: []}
});

const showList = computed(() => props.proList.length > 0)

function handleSearchDetails(item) {
  console.log("item clicked: ", item)
  proxy.$modal.alert("获取详细资料，请与管理员联系...");
}

function getProjectDetails(item) {
  let data = JSON.parse(item);
}
</script>

<style lang='scss' scoped>
.searchRst {
  width: 100%;
  min-height: 200px;

  .searchRstListDiv {
    width: 100%;
    padding: 5px 5px;
    line-height: 25px;
    border-bottom: 1px dashed #e0e3e9;

    .searchRstTitle {
      width: 100%;
      padding: 5px 0px;
      color: rgb(39, 126, 213);
      font-size: 20px;
      line-height: 30px;
    }

    .searchRstDetails {
      max-height: 250px;
      overflow: hidden;
      width: 100%;
      color: gray;
      font-size: 15px;
    }
  }
}
</style>
