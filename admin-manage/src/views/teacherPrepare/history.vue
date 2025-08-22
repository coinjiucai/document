<template>
  <div
    class="teacher-prepare theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['delete']"
      :listApi="['teacherPrepare', 'coursewarePage']"
      :deleteApi="['teacherPrepare', 'coursewareDeleteBatch']"
      @edit="edit"
    >
      <template slot="status_parent" slot-scope="scope">
        <span style="color: #409eff" v-if="scope.row.status == 1">
          <el-link type="primary">已发布</el-link>
        </span>
        <span style="color: #fff" v-else>未发布</span>
      </template>

      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
        >
        <el-link
          :underline="false"
          type="primary"
          @click="download(scope.row)"
          style="margin-left: 10px"
          >下载</el-link
        >
      </template>
    </ListPage>
  </div>
</template>
<script>
import ListPage from "@/components/ListPage";
import FormItem from "@/components/Form/Item";
import Browser from "@/utils/browser";
export default {
  components: {
    ListPage,
    FormItem,
  },
  data() {
    return {
      // 搜索参数
      params: {
        coursewareTitle: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "名称",
          compType: "input",
          width: 160,
          placeholder: "名称",
          prop: "coursewareTitle",
        },
      ],
      // 表格字段列配置
      labelList: [
        {
          label: "名称",
          prop: "coursewareTitle",
        },
        { label: "上传人", prop: "createBy" },
        {
          label: "生成时间",
          prop: "createTime",
        },
        {
          label: "操作",
          prop: "action",
          parent: "action_parent",
          special: true,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    edit(record) {
      //
      this.$router.push({
        path: "/teacherPrepare/teacherPrepare",
        query: {
          id: record.id,
        },
      });
    },
    download(row) {
      const modelUrl = `${Browser.getApiUrl()}/mlf-counsel-service/courseware/download/${
        row.id
      }`;
      const downloadLink = document.createElement("a");
      downloadLink.href = modelUrl;
      downloadLink.setAttribute("download", row.coursewareTitle);
      downloadLink.setAttribute("target", "_blank");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
  },
};
</script>
      