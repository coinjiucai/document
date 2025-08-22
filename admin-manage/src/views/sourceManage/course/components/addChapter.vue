<template>
  <div class="component-addChapter">
    <BaseDialog
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="500px"
      top="20vh"
    >
      <div>
        <el-form :model="record" :rules="rules" ref="form" label-width="100px">
          <el-form-item
            label="父级章节"
            prop="parentId"
            v-if="addChapterType == 'sub'"
          >
            <treeSelect
              class="w258"
              node-key="id"
              placeholder="不选默认顶级节点"
              :tree-props="{ label: 'title', children: 'childrenList' }"
              :tree-list="treeList"
              v-model="record.parentId"
            >
            </treeSelect>
          </el-form-item>
          <el-form-item label="章节名称" prop="title">
            <el-input
              class="w100p"
              clearable
              maxlength="40"
              placeholder="章节名称"
              v-model="record.title"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleSave" v-loading="loading"
          >确定</el-button
        >
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import treeSelect from "@/components/Tree/TreeSelect";

export default {
  name: "addChapter",
  components: {
    BaseDialog,
    treeSelect,
  },
  props: {
    courseId: {
      type: String,
      default: "",
    },
    treeList: {
      type: Array,
      default: () => [],
    },
    addChapterType: {
      type: String,
      default: "top",
    },
  },
  data() {
    return {
      dialogTitle: "新增章节",
      visibleDialog: false,
      record: {
        parentId: "",
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入章节名称", trigger: "blur" }],
      },
      loading: false,
    };
  },
  methods: {
    show(parentId) {
      this.record.parentId = parentId;
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.reset();
    },
    reset() {
      this.record = {
        parentId: "",
        title: "",
      };

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
    },
    handleSave() {
      if (!this.loading) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let param = {
              courseId: this.courseId,
              ...this.record,
            };
            this.loading = true;
            this.$api.source.addZj(param).then((res) => {
              this.$message.success("保存成功");
              this.$emit("save");
              this.loading = false;
              this.handleCloseDialog();
            });
          }
        });
      } else {
        this.$message("点击保存按钮请勿重复点击");
      }
    },
  },
};
</script>

<style lange="scss" scoped>
</style>