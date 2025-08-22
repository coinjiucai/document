<template>
  <div
    class="major-event-year theme-background-middle flex-layout full-block pa10"
  ></div>
</template>

<script>
import BaseTable from "@/components/Base/BaseTable";
// import rangeBothValue from "@/components/Date/rangeBothValue";
const logTypeList = [
  { value: 1, label: "登录" },
  { value: 2, label: "数据库管理" },
  { value: 3, label: "数据服务" },
  { value: 4, label: "系统管理" },
];
export default {
  name: "SelfCheckManage",
  components: { BaseTable },
  props: {},
  data() {
    return {
      logTypeList,
      labelList: [
        { label: "操作账号", prop: "userid" },
        { label: "操作人", prop: "username" },
        { label: "操作模块", prop: "logType_dictText" },
        { label: "操作内容", prop: "logContent" },
        { label: "操作时间", prop: "createTime" },
        { label: "操作IP地址", prop: "ip" },
      ],
      dataList: [],
      pageInfo: {
        pageSize: 10,
        pageNo: 1,
        userid: "",
        username: "",
        logType: "",
        startTime: "",
        endTime: "",
      },
      total: 0,
    };
  },
  created() {},
  mounted() {
    this.getLogList();
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    /**
     * 获取日志列表
     */
    getLogList() {
      this.$api.System.getLogList(this.pageInfo).then((res) => {
        this.dataList = res["result"].records;
        this.total = res["result"].total;
      });
    },
    /**
     * 点击查询
     * @param reset 查询前是否重置
     */
    handleSearch(reset) {
      // 重置表格勾选
      this.$refs.table.resetSelection();
      if (reset) {
        this.pageInfo = {
          pageSize: 10,
          pageNo: 1,
          userid: "",
          username: "",
          logType: "",
          startTime: "",
          endTime: "",
        };
      } else {
        this.pageInfo.pageNo = 1;
      }
      this.getLogList();
    },
    handleExportLog() {},
  },
};
</script>

<style lang="scss" scoped></style>
