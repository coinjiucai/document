<template>
  <div class="full-dialog">
    <!-- 编辑弹窗 -->
    <BaseDialog
      custom-class="consult-ant-dialog "
      :title="dialogTitle"
      center
      class="full-dialog"
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1200px"
      top="3vh"
      v-loading="loading"
      destroy-on-close
    >
      <div class="full-block" style="height: 78vh">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="80px"
          size="mini"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="任务状态" prop="status">
                <FormItem
                  v-model="record.status"
                  compType="select"
                  :disabled="true"
                  :options="[
                    {
                      label: '未下发',
                      value: 0
                    },
                    {
                      label: '已下发',
                      value: 1
                    }
                  ]"
                  placeholder="任务状态"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务代码" prop="taskCode">
                <FormItem
                  v-model="record.taskCode"
                  compType="input"
                  placeholder="请输入"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务名称" prop="name">
                <FormItem
                  v-model="record.name"
                  compType="input"
                  placeholder="请输入"
                ></FormItem>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务时间" prop="startTime">
                <rangeBothValue
                  dataType="datetimerange"
                  :style="{ width: `100%` }"
                  size="mini"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  :end-value.sync="record.endTime"
                  :start-value.sync="record.startTime"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </rangeBothValue>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="任务时长" prop="taskTime">
                <FormItem
                  v-model="record.taskTime"
                  compType="select"
                  :options="timeIntervals"
                  placeholder="请选择任务时长"
                  clearable
                ></FormItem>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="任务对象" prop="groupId">
                <FormItem
                  v-model="record.groupId"
                  compType="select"
                  :options="groupList"
                  placeholder="请选择任务对象"
                  @change="changeGroup"
                  :disabled="record.status == 1"
                  clearable
                ></FormItem>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-button type="primary" @click="addTab()">新增专题</el-button>
        </el-row>
        <el-row style="margin-top: 16px">
          <el-tabs
            v-model="tableValue"
            type="card"
            @tab-remove="removeTab"
            @tab-click="handleTabClick"
          >
            <el-tab-pane
              v-for="(item, index) in record.topics"
              :key="index"
              :label="item.name"
              :name="'topic_' + index"
              :closable="item.status != 1"
            >
              <div>
                <addTask
                  ref="addTask"
                  :tasks="item.tasks"
                  :taskId="record.id"
                  :status="item.status"
                  @finished="finished"
                ></addTask>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleIssuedSave">下发</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
    <el-dialog
      title="专题名称"
      :visible.sync="ztTitleDialogVisible"
      width="30%"
      center
    >
      <div>
        <el-input v-model="ztName" placeholder="专题名称" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ztTitleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import rangeBothValue from '@/components/Date/rangeBothValue';
import addTask from './addTask';
export default {
  components: {
    BaseDialog,
    FormItem,
    rangeBothValue,
    addTask
  },
  data() {
    return {
      loading: false,
      timeIntervals: [],
      groupList: [],
      visibleDialog: false,
      dialogTitle: '任务信息',
      record: {
        status: 0, // 任务状态
        taskCode: '', // 任务代码
        name: '专题1', // 任务名称
        startTime: '', // 任务开始时间
        endTime: '', // 任务结束时间
        taskTime: '', // 任务时长
        groupId: '', // 任务对象
        groupName: '', // 任务组名
        topics: [] // 专题
      },
      rules: {
        taskCode: [
          { required: true, message: '请输入任务代码', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        startTime: [
          { required: true, message: '请选择任务时间', trigger: 'change' }
        ],
        taskTime: [
          { required: true, message: '请输入任务时长', trigger: 'blur' }
        ],
        grouId: [
          { required: true, message: '请选择任务对象', trigger: 'change' }
        ]
      },
      tableValue: 'topic_0',
      // 专题标题修改
      ztTitleDialogVisible: false,
      ztItem: null,
      ztName: ''
    };
  },
  mounted() {
    // this.generateTaskTime();
    this.getGroupList();
  },
  methods: {
    //
    generateTaskTime() {
      const timeIntervals = [];
      for (let i = 1; i <= 30; i++) {
        const minutes = i * 30;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        // const account =
        timeIntervals.push({
          value: minutes,
          label: `${hours ? hours + '小时' : ''}${
            remainingMinutes ? remainingMinutes + '分钟' : ''
          }`
        });
      }
      this.timeIntervals = timeIntervals;
    },
    getGroupList() {
      this.$api.analysis.sysgroupList().then((res) => {
        this.groupList = res.result.map((v) => {
          return {
            label: v.name,
            value: v.id
          };
        });
      });
    },
    // 显示弹窗
    show(record) {
      if (record) {
        this.record = record;
        if (!this.record.status) {
          this.record.status = 0;
        }
        this.record.topics = record.topics.map((v) => {
          var tasks = v.tasks;
          tasks = tasks.map((v) => {
            return {
              ...v,
              taskCateId: '' + v.taskCateId,
              resourceType: '' + v.resourceType
            };
          });
          return {
            ...v,
            tasks: tasks
          };
        });
      } else {
        this.record = {
          status: 0, // 任务状态
          taskCode: '', // 任务代码
          name: '', // 任务名称
          startTime: '', // 任务开始时间
          endTime: '', // 任务结束时间
          taskTime: '', // 任务时长
          groupId: '', // 任务对象
          groupName: '', // 任务组名
          topics: [] // 专题
        };
      }

      this.visibleDialog = true;
    },
    changeGroup(val) {
      const item = this.groupList.find((v) => v.value == val);
      this.record.groupName = item.label;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        status: 0, // 任务状态
        taskCode: '', // 任务代码
        name: '', // 任务名称
        startTime: '',
        endTime: '',
        taskTime: '', // 任务时长
        groupId: '', // 任务对象
        groupName: '' // 任务组名
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    hasDuplicateTaskContentIds(array) {
      const taskContentIds = array.map((item) => item.taskContentId);
      const uniqueIds = new Set(taskContentIds);

      // 如果有重复，Set 的大小会小于原数组的长度
      return uniqueIds.size < taskContentIds.length;
    },
    // 保存
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          var params = {
            ...this.record
          };
          let listRepeat = false;
          params.topics = params.topics.map((v) => {
            var tasks = v.tasks ? v.tasks : [];
            const isRepeat = this.hasDuplicateTaskContentIds(tasks);
            if (isRepeat) {
              listRepeat = true;
            }
            tasks = tasks.filter((v) => v.taskCateId && v.taskContentId);
            var item = { ...v, topicTasks: tasks };
            delete item.tasks;
            return item;
          });
          if (listRepeat) {
            this.$message.error('请勿重复添加任务内容!');
            return false;
          }
          delete params['tasks'];
          this.loading = true;
          try {
            this.$api.analysis
              .saveTask(params)
              .then((res) => {
                this.loading = false;
                this.$message.success('保存成功!');
                this.visibleDialog = false;
                this.$emit('refresh');
              })
              .finally(() => {
                this.loading = false;
              });
          } catch (error) {
            this.loading = false;
            throw error;
          }
        }
      });
    },
    // 保存下发
    handleIssuedSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          var params = {
            ...this.record,
            status: 1
          };
          params.topics = params.topics.map((v) => {
            var item = { ...v, topicTasks: v.tasks ? v.tasks : [] };
            delete item.tasks;
            return item;
          });
          this.loading = true;
          try {
            this.$api.analysis
              .issuedTaskPC(params)
              .then((res) => {
                this.loading = false;
                this.$message.success('下发成功!');
                this.visibleDialog = false;
                this.$emit('refresh');
              })
              .finally(() => {
                this.loading = false;
              });
          } catch (error) {
            this.loading = false;
          }
        }
      });
    },
    // 新增专题
    addTab() {
      const range = this.record.topics.length + 1;
      const name = '专题' + range;
      this.record.topics.push({
        name: name, // 专题名称
        taskId: this.record.id,
        status: 0, // 状态 0 未下发 1 已下发
        remark: '', // 备注
        tasks: [] // 专题任务列表
      });
      const index = this.record.topics.length - 1;
      this.ztItem = this.record.topics[index];
      this.ztName = this.ztItem.name;
      this.ztTitleDialogVisible = true;
    },
    // 删除专题
    removeTab(targetName) {
      if (this.record.topics.length <= 1) {
        this.$message.warning('请至少保留一个专题');
        return false;
      }
      let tabs = this.record.topics;
      console.log(targetName, tabs, '===s');
      this.record.topics = tabs.filter(
        (tab, index) => 'topic_' + index != targetName
      );
    },
    handleTabClick(tab) {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastClickTime < 300) {
        // 双击事件处理
        console.log(`双击了标签:`, tab.label);
        const label = tab.label;
        const ztItem = this.record.topics.find((v) => v.name == label);
        this.ztItem = ztItem;
        this.ztName = label;
        this.ztTitleDialogVisible = true;
      }
      this.lastClickTime = currentTime;
    },
    confirmName() {
      if (this.ztName) {
        this.ztTitleDialogVisible = false;
        this.ztItem.name = this.ztName;
      } else {
        this.$message.warning('请输入专题名称');
      }
    },
    finished() {
      this.$emit('finished', this.record);
    }
  }
};
</script>

<style></style>
