<template>
  <div class="add-task">
    <div class="task-container">
      <div v-for="(item, index) in tasks" :key="index">
        <div class="item" @click="changeTask(index)">
          <template v-if="status == 1">
            <input
              type="radio"
              name="color"
              value="red"
              :checked="index == currentIndex"
              style="margin-right: 10px"
            />
            <label>任务{{ index + 1 }}：</label><br />
          </template>
          <template v-else>
            <div>任务{{ index + 1 }}：</div>
          </template>
          <div style="display: flex; align-items: center; margin-right: 10px">
            <div style="margin-right: 10px">任务类型</div>
            <div
              :style="{
                'pointer-events': status == 1 ? 'none' : 'normal'
              }"
            >
              <el-select
                v-model="item.taskCateId"
                placeholder="请选择"
                size="mini"
                @change="changeTaskType(item)"
                style="width: 400px"
              >
                <el-option
                  v-for="item in taskTypeList"
                  :key="item.id"
                  :label="item.itemText"
                  :value="item.itemValue"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div style="display: flex; align-items: center; margin-right: 10px">
            <div style="margin-right: 10px">任务内容</div>
            <div
              :style="{
                'pointer-events': status == 1 ? 'none' : 'normal'
              }"
            >
              <el-input
                v-model="item.taskContent"
                size="mini"
                placeholder="请选择资源"
                clearable
                @change="changeTaskContent(item)"
                @focus="showDialog(item)"
                style="width: 400px"
              ></el-input>
            </div>
          </div>
          <div v-if="status != 1">
            <span
              class="iconfont"
              style="font-size: 20px; color: #999; cursor: pointer"
              @click="deleteItem(index)"
              >&#xe63b;</span
            >
          </div>
        </div>
        <taskResult
          style="margin-top: 10px"
          v-if="status == 1 && index == currentIndex && currentTask"
          :task="currentTask"
          :summary="currentTask.summary"
          :members="currentTask.members"
          @finished="finished"
        ></taskResult>
      </div>
    </div>
    <div style="margin-top: 10px" v-if="status != 1">
      <span
        class="iconfont"
        style="font-size: 20px; color: #2d95ec; cursor: pointer"
        @click="addTask"
        >&#xe694;</span
      >
    </div>

    <!--- 选择心理课堂 -->
    <xlktDialog
      ref="xlktDialog"
      @confirm="confirmXlkt"
      :selectLimit="checkLimit"
    ></xlktDialog>
    <!-- 心理量表 -->
    <TableDialog
      title="选择量表"
      :param="lbParam"
      :listApi="['source', 'psypaperPage']"
      :labelList="[
        { label: '量表名称', prop: 'paperName' },
        { label: '量表类别', prop: 'categoryName' }
      ]"
      :selectLimit="checkLimit"
      :showIndex="true"
      ref="lbTableDialog"
      @confirm="confirmLb"
    >
      <template #search>
        <el-form :inline="true" size="mini" style="margin-bottom: -10px">
          <el-form-item label="量表名称">
            <el-input
              placeholder="请输入内容"
              v-model="lbParam.paperName"
              size="mini"
              clearable
              @keyup.enter.native="toSearch"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="量表类别">
            <el-select
              v-model="lbParam.categoryId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in lbCategoryList"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: 10px"
              size="mini"
              @click="toSearch"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </template>
    </TableDialog>
    <!-- 心理游戏 -->
    <gameDialog
      ref="gameDialog"
      @confirm="confirmGame"
      :selectLimit="checkLimit"
    ></gameDialog>
    <!-- 问卷调查 -->
    <TableDialog
      title="选择调查问卷"
      searchProp="questionnaireName"
      :listApi="['source', 'getQuestionnairPage']"
      :labelList="[{ label: '问卷名称', prop: 'questionnaireName' }]"
      :showIndex="true"
      :selectLimit="checkLimit"
      ref="wjdcTableDialog"
      @confirm="confirmWjdc"
      :selectableCallback="selectableCallback"
    ></TableDialog>

    <el-dialog
      title="请选择任务类型"
      :visible.sync="taskCateIdDialogVisible"
      width="300px"
      center
      append-to-body
    >
      <div>
        <el-select
          v-model="selectTaskCateId"
          placeholder="请选择"
          size="small"
          style="width: 100%"
        >
          <el-option
            v-for="item in taskTypeList"
            :key="item.id"
            :label="item.itemText"
            :value="item.itemValue"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskCateIdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTaskCateId">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormItem from '@/components/Form/Item';
import TableDialog from '@/components/TableDialog';
import xlktDialog from './xlktDialog';
import taskResult from './taskResult';
import gameDialog from './gameDialog';
export default {
  props: {
    tasks: {
      type: Array,
      default: () => {
        return [];
      }
    },
    taskId: {
      type: [Number, String],
      default: () => {
        return '';
      }
    },
    status: {
      type: [Number, String],
      default: () => {
        return '';
      }
    }
  },
  components: {
    FormItem,
    TableDialog,
    xlktDialog,
    taskResult,
    gameDialog
  },
  data() {
    return {
      taskTypeList: [],
      taskList: [],
      sourceItem: null,
      // 心理量表列表弹窗
      selectValue: '',
      name: '',
      currentTask: null,
      currentIndex: 0,
      lbParam: {
        paperName: '',
        categoryId: ''
      },
      lbCategoryList: [],
      taskCateIdDialogVisible: false,
      selectTaskCateId: '',
      checkLimit: 1,
      sIds: []
    };
  },
  created() {
    this.getTaskType();
    if (this.tasks.length > 0) {
      this.currentTask = this.tasks[0];
      if (!this.currentTask.members) {
        this.$set(this.currentTask, 'members', []);
      }
    }
    this.psypapercategoryList();
  },
  mounted() {},
  methods: {
    psypapercategoryList() {
      this.$api.source.psypapercategoryList().then((res) => {
        const options = res.result.map((v) => {
          return {
            label: v.name,
            value: v.id
          };
        });
        this.lbCategoryList = options;
      });
    },
    toSearch() {
      // 量表搜索
      console.log(this.lbParam);
      this.$refs.lbTableDialog.getList();
    },
    changeTask(index) {
      this.currentIndex = index;
      this.currentTask = this.tasks[index];
      if (!this.currentTask.members) {
        this.$set(this.currentTask, 'members', []);
      }
    },
    addTask() {
      this.selectTaskCateId = '';
      this.taskCateIdDialogVisible = true;
    },
    deleteItem(index) {
      this.tasks.splice(index, 1);
    },
    // 获取任务类型
    getTaskType() {
      this.$api.System.getDictionaryContentPageList({
        pageSize: 50,
        pageNumber: 1,
        dictCode: 'taskType'
      }).then((res) => {
        this.taskTypeList = res['result'].records;
        console.log(this.taskTypeList);
      });
    },
    changeTaskType(item) {
      item.taskContentId = '';
      item.taskContent = '';
    },
    confirmTaskCateId() {
      this.checkLimit = 0;

      if (this.selectTaskCateId) {
        this.taskCateIdDialogVisible = false;
        const taskItem = this.taskTypeList.find(
          (v) => v.itemValue == this.selectTaskCateId
        );

        if (taskItem.itemText == '心理游戏') {
          const ids =
            this.tasks
              .filter((v) => v.taskCateId == 1)
              .map((v) => v.taskContentId) || [];
          this.sIds = ids;
          this.$refs.gameDialog.show(ids);
        } else if (taskItem.itemText == '调查问卷') {
          const ids =
            this.tasks
              .filter((v) => v.taskCateId == 2)
              .map((v) => v.taskContentId) || [];
          this.sIds = ids;
          this.$refs.wjdcTableDialog.show(ids);
        } else if (taskItem.itemText == '心理量表') {
          const ids =
            this.tasks
              .filter((v) => v.taskCateId == 3)
              .map((v) => v.taskContentId) || [];
          this.sIds = ids;
          this.$refs.lbTableDialog.show(ids);
        } else if (taskItem.itemText == '心理课堂') {
          // 心理课堂
          const ids =
            this.tasks
              .filter((v) => v.taskCateId == 4)
              .map((v) => v.taskContentId) || [];
          this.sIds = ids;
          this.$refs.xlktDialog.show(ids);
        }
      } else {
        this.$message.warning('请先选择任务类型');
      }
    },
    selectableCallback(row, index) {
      if (this.sIds.includes(row.id)) {
        return false;
      } else {
        return true;
      }
    },
    // 1 心理游戏 2 问卷调查 3. 心理量表  4.心理课堂
    showDialog(item) {
      this.checkLimit = 1;
      this.selectTaskCateId = '';
      this.sourceItem = item;
      const taskItem = this.taskTypeList.find(
        (v) => v.itemValue == item.taskCateId
      );
      this.sIds = [item.taskContentId];
      if (taskItem) {
        if (taskItem.itemText == '心理游戏') {
          this.$refs.gameDialog.show([item.taskContentId]);
        } else if (taskItem.itemText == '调查问卷') {
          this.$refs.wjdcTableDialog.show([item.taskContentId]);
        } else if (taskItem.itemText == '心理量表') {
          this.$refs.lbTableDialog.show([item.taskContentId]);
        } else if (taskItem.itemText == '心理课堂') {
          this.$refs.xlktDialog.show([item.taskContentId]);
        }
      } else {
        this.$message.warning('请先选择任务类型');
      }
    },
    // 选择心理课堂
    confirmXlkt(selection) {
      if (this.checkLimit == 1) {
        if (selection.length >= 1) {
          const item = selection[0];
          this.sourceItem.taskContentId = item.taskContentId;
          this.sourceItem.taskContent = item.taskContent;
        }
      } else {
        selection.forEach((element) => {
          const item = this.tasks.find(
            (v) => v.taskContentId == element.taskContentId
          );
          if (!item) {
            // 不存在的新增，
            this.tasks.push({
              mainTaskId: this.taskId, // 主任务ID
              taskCateId: this.selectTaskCateId, // 任务分类ID
              taskContentId: element.taskContentId, // 任务内容ID
              taskContent: element.taskContent, // 任务内容
              resourceType: '', // 资源类型（1 音乐，2 资讯 ，3 漫画）
              resourceName: '', // 资源名称
              resourceId: '' // 资源ID
            });
          }
        });
      }
    },
    // 选择游戏确认=游戏多选情况下
    confirmGame(selection) {
      if (this.checkLimit == 1) {
        if (selection.length >= 1) {
          const item = selection[0];
          this.sourceItem.taskContentId = item.taskContentId;
          this.sourceItem.taskContent = item.taskContent;
        }
      } else {
        selection.forEach((element) => {
          const item = this.tasks.find(
            (v) => v.taskContentId == element.taskContentId
          );
          if (!item) {
            this.tasks.push({
              mainTaskId: this.taskId, // 主任务ID
              taskCateId: this.selectTaskCateId, // 任务分类ID
              taskContentId: element.taskContentId, // 任务内容ID
              taskContent: element.taskContent, // 任务内容
              resourceType: '', // 资源类型（1 音乐，2 资讯 ，3 漫画）
              resourceName: '', // 资源名称
              resourceId: '' // 资源ID
            });
          }
        });
      }
    },
    changeTaskContent(item) {
      item.taskContent = '';
      item.taskContentId = '';
    },
    // 选择心理量表
    confirmLb(selection) {
      if (this.checkLimit == 1) {
        if (selection.length >= 1) {
          const item = selection[0];
          const hasRepeat = this.tasks.find((v) => v.taskContentId == item.id);
          if (hasRepeat) {
            this.$message.warning('请勿重复添加');
            return false;
          } else {
            this.sourceItem.taskContentId = item.id;
            this.sourceItem.taskContent = item.paperName;
          }
        }
      } else {
        selection.forEach((element) => {
          const item = this.tasks.find(
            (v) => v.taskContentId == element.taskContentId
          );
          if (!item) {
            this.tasks.push({
              mainTaskId: this.taskId, // 主任务ID
              taskCateId: this.selectTaskCateId, // 任务分类ID
              taskContentId: element.id, // 任务内容ID
              taskContent: element.paperName, // 任务内容
              resourceType: '', // 资源类型（1 音乐，2 资讯 ，3 漫画）
              resourceName: '', // 资源名称
              resourceId: '' // 资源ID
            });
          }
        });
      }
      this.$refs.lbTableDialog.handleCloseDialog();
    },
    // 选择问卷调查
    confirmWjdc(selection) {
      if (selection.length >= 1) {
        const item = selection[0];
        this.sourceItem.taskContentId = item.id;
        this.sourceItem.taskContent = item.questionnaireName;
      }
      this.$refs.wjdcTableDialog.handleCloseDialog();
    },
    finished() {
      this.$emit('finished');
      const st = setTimeout(() => {
        this.changeTask(this.currentIndex);
        clearTimeout(st);
      }, 1500);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-task {
  .task-container {
    // height: 45vh;
    overflow-y: auto;
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
  }
}
</style>
