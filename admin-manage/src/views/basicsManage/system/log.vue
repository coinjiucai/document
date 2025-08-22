<template>
  <div
    class="component-LogManage theme-background-middle flex-layout full-block pa10"
  >
    <div class="flex-none theme-buttons">
      <el-button type="warning" icon="el-icon-upload2" @click="handleExportLog"
        >导出日志</el-button
      >
    </div>
    <el-divider></el-divider>
    <div class="flex-none">
      <el-form inline style="text-align: right" size="small">
        <el-form-item label="操作账号:">
          <el-input
            class="w160"
            v-model="pageInfo.userid"
            placeholder="操作账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="操作人:">
          <el-input
            class="w160"
            v-model="pageInfo.username"
            placeholder="操作人"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="日志类型:">
          <el-select
            class="w160"
            clearable
            v-model="pageInfo.logType"
            placeholder="日志类型"
          >
            <el-option
              v-for="(item, index) in operateTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间:">
          <rangeBothValue
            dataType="datetimerange"
            rangeClass="w300"
            value-format="yyyy-MM-dd HH:mm:ss"
            :end-value.sync="pageInfo.endTime"
            :start-value.sync="pageInfo.startTime"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </rangeBothValue>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(false)"
            >查询</el-button
          >
          <el-button type="info" @click="handleSearch(true)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-auto">
      <BaseTable
        ref="table"
        :page-info="pageInfo"
        height="100%"
        :label-list="labelList"
        :list="dataList"
        :total="total"
        :pageInfoKeys="{
          size: 'pageSize',
          number: 'pageNo',
        }"
        @page-change="getLogList"
      >
      </BaseTable>
    </div>
  </div>
</template>

<script>
import BaseTable from "@/components/Base/BaseTable";
import rangeBothValue from "@/components/Date/rangeBothValue";
const operateTypeList = [
  { value: 1, label: "登录" },
  { value: 2, label: "操作" },
  { value: 3, label: "登出" },
];
export default {
  name: "LogManage",
  components: { BaseTable, rangeBothValue },
  props: {},
  data() {
    return {
      operateTypeList,
      labelList: [
        { label: "操作账号", prop: "userid" },
        { label: "操作人", prop: "username" },
        {
          label: "日志类型",
          prop: "logType",
          formatter: (val) => {
            if (val == 1) {
              return "登录";
            } else if (val == 2) {
              return "操作";
            } else if (val == 3) {
              return "登出";
            }
          },
        },
        // {
        //   label: '操作类型',
        //   prop: 'operateType',
        //   formatter: (val) => {
        //     if (val == 1) {
        //       return '查询';
        //     } else if (val == 2) {
        //       return '添加';
        //     } else if (val == 3) {
        //       return '修改';
        //     } else if (val == 4) {
        //       return '删除';
        //     } else if (val == 5) {
        //       return '导入';
        //     } else if (val == '6') {
        //       return '导出';
        //     }
        //   }
        // },
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
    /**
     * 日志导出
     */
    handleExportLog() {
      const ids = this.$refs.table.selectedList.length
        ? this.$refs.table.selectedList.map((i) => i.id).toString()
        : this.dataList.map((i) => i.id).toString();
      this.$api.globalAPI
        .getFileUrl(`/mlf-xmbz-service/basicmysql/export?ids=${ids}`)
        .then((res) => {
          const link = document.createElement("a");
          link.style.display = "none";
          const fileName = res["message"].replace(/.*\/(.*)/, "$1");
          link.href =
            this.$store.state.app.customValue["systemServe"] + res["message"];
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$message.success("导出成功！");
          this.handleClose();
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
