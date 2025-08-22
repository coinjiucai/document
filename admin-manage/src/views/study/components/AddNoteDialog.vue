<template>
  <div>
    <BaseDialog
      class="component-reservationDialog"
      :title="title"
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="600px"
    >
      <div class="full-block">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="" prop="content">
            <el-input
              type="textarea"
              v-model="form.content"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave" v-loading="loading"
          >保存</el-button
        >
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import { mapGetters } from "vuex";
export default {
  name: "AddNoteDialog",
  components: {
    BaseDialog,
  },
  props: {
    courseId: {
      type: String,
      default: () => {
        return "";
      },
    },
    courseName: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    title() {
      return this.type === 1 ? "添加便签" : "添加专题笔记";
    },
  },
  data() {
    return {
      visibleDialog: false,
      form: {
        content: "",
      },
      type: 1,
      rules: {
        content: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      loading: false,
    };
  },
  methods: {
    show(type, record) {
      this.type = type;
      if (record) {
        this.form = { ...record };
      }
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.resetForm("form");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSave() {
      if (this.loading) {
        return false;
      }
      const params = {
        ...this.form,
        courseId: this.courseId,
        courseName: this.courseName,
        userId: this.userInfo.id,
      };
      this.loading = true;
      this.$refs.form.validate((val) => {
        if (val) {
          const myApi =
            this.type === 1
              ? this.$api.education.psynotesSave
              : this.$api.education.psyspecialnotesSave;
          myApi(params)
            .then((res) => {
              this.visibleDialog = false;
              this.$emit("refreshData", this.form.content);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.component-reservationDialog {
}
</style>
