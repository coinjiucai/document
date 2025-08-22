<template>
  <div>
    <BaseDialog
      class="full-block component-psychologicalDialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1000px"
      top="10vh"
      destroy-on-close
    >
      <div class="full-block">
        <el-form ref="form" label-width="120px" :model="record" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="状态:">
                <FormItem
                  v-model="record.isPublish"
                  compType="select"
                  :disabled="record.isPublish == 1"
                  :options="[
                    {
                      value: 0,
                      label: '未发布'
                    },
                    {
                      value: 1,
                      label: '已发布'
                    }
                  ]"
                  placeholder="请选择状态"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="标题:">
                <el-input
                  v-model="record.title"
                  maxlength="50"
                  placeholder="请输入"
                  :disabled="record.isPublish == 1"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="发布量表:">
                <el-cascader
                  ref="cascader"
                  :options="treeList"
                  :show-all-levels="false"
                  v-model="record.paperPublishIds"
                  :disabled="record.isPublish == 1"
                  :props="{
                    label: 'paperName',
                    value: 'paperId',
                    multiple: true,
                    children: 'childrenList',
                    emitPath: false
                  }"
                  style="width: 100%"
                  clearable
                  @change="handleEmitPathChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="发布对象">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-model="record.publishUserNames"
                  :disabled="record.isPublish == 1"
                  @focus="publishUserSelect"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          v-if="record.isPublish == 0"
          @click="handlePublish"
          >发布</el-button
        >
        <el-button
          type="primary"
          @click="handleSave"
          v-if="record.isPublish == 0"
          >保存</el-button
        >
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
    <!-- 人员设置 -->
    <UserSetDialog
      title="发布对象设置"
      ref="userSetDialog"
      @confirm="confirmSelectUser"
    ></UserSetDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import TableDialog from '@/components/TableDialog';
import UserSetDialog from '@/components/UserSetDialog.vue';
export default {
  name: 'psychologicalPublishDialog',
  components: { BaseDialog, FormItem, TableDialog, UserSetDialog },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    type: {
      type: String,
      default: () => 'add'
    },
    treeList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      visibleDialog: false,
      record: {
        isPublish: 0,
        title: '',
        // paperPublishNames: "", //
        paperPublishIds: [], // 量表paperIds用
        publishUserIds: [],
        publishUserNames: ''
      },
      rules: {
        title: [{ required: true, message: '请输入发布标题', trigger: 'blur' }],
        paperPublishIds: [
          { required: true, message: '请选择要发布的量表', trigger: 'change' }
        ],
        publishUserIds: [
          { required: true, message: '请选择要发布的对象', trigger: 'change' }
        ]
      }
    };
  },
  created() {},
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        isPublish: 0,
        title: '',
        // paperPublishNames: [], //
        paperPublishIds: '', // 量表paperIds用
        publishUserIds: [],
        publishUserNames: ''
      };
    },
    show(record) {
      this.visibleDialog = true;
      if (record) {
        const paperPublishIds = record.paperPublishIds.split(',');
        const publishUserIds = record.publishUserIds.split(',');
        this.record = {
          ...record,
          paperPublishIds,
          publishUserIds,
          publishUserNames: record.publishUserNames
        };
      } else {
        delete this.record?.id;
      }
    },
    handleSave() {
      const record = {
        ...this.record,
        paperPublishIds: this.record.paperPublishIds.join(','),
        publishUserIds: this.record.publishUserIds.join(',')
      };
      this.$api.source.psypaperpublishSave(record).then(() => {
        this.$message.success('保存成功！');
        this.handleCloseDialog();
        this.$emit('refresh');
      });
    },
    handlePublish() {
      const record = {
        ...this.record,
        isPublish: 1,
        paperPublishIds: this.record.paperPublishIds.join(','),
        publishUserIds: this.record.publishUserIds.join(',')
      };
      this.$api.source.psypaperpublishSave(record).then(() => {
        this.$message.success('保存成功！');
        this.handleCloseDialog();
        this.$emit('refresh');
      });
    },
    // 选择发布对象
    publishUserSelect() {
      this.$refs.userSetDialog.show([]);
    },
    // 确认选择发布对象
    confirmSelectUser(users) {
      this.record.publishUserIds = users.map((v) => v.id);
      this.record.publishUserNames = users.map((v) => v.realname).join(',');
    },
    findNodeByValue(options, value) {
      for (const option of options) {
        if (option.paperId === value) {
          return option;
        }
        if (option.childrenList) {
          const found = this.findNodeByValue(option.childrenList, value);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    handleEmitPathChange(values) {
      const selectedLabels = [];
      values.forEach((value) => {
        const node = this.findNodeByValue(this.treeList, value);
        if (node) {
          selectedLabels.push(node.paperName);
        }
      });
      // this.record.paperPublishNames = selectedLabels.join(",");
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  max-height: 500px;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-policyDetailDialog {
}
</style>
