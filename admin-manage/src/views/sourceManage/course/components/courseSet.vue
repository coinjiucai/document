<template>
  <div class="component-courseSet full-block">
    <div class="title">课程有效时间：</div>
    <div class="block flex-row align-center">
      <el-radio class="mr0" :label="1" v-model="form.courseType" @change="changeRadio">{{ `` }}</el-radio>
      <div>永久</div>
    </div>
    <div class="block flex-row align-center">
      <el-radio class="mr0" :label="2" v-model="form.courseType" @change="changeRadio">{{ `` }}</el-radio>
      <div class="mr10">固定时间</div>
      <el-date-picker
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="dateRange"
        @change="changeDateRange"
      >
      </el-date-picker>
    </div>
    <div class="block flex-row align-center">
      <el-checkbox
        class="mr10"
        :true-label="1" 
        :false-label="0"
        v-model="form.isOrder"
      ></el-checkbox>限制课件观看顺序（限制后，学员必须按照课程章节列表顺序观看课件）
    </div>
    <div class="block flex-row align-center">
      <el-checkbox 
        class="mr10"
        :true-label="1" 
        :false-label="0"
        v-model="form.isFast"
      ></el-checkbox>视频允许快进
    </div>
    <div class="block flex-row align-center">
      <el-checkbox 
        class="mr10"
        :true-label="1" 
        :false-label="0"
        v-model="form.isJump"
      ></el-checkbox>允许跳页
    </div>
    <el-button 
      class="btn" 
      type="primary"
      :loading="loading"
      @click="save"
    >保存</el-button>
  </div>
</template>

<script>
export default {
  name: 'courseSet',
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dateRange: [],
      form: {},
      loading: false,
    }
  },
  mounted() {
    this.form = JSON.parse(JSON.stringify(this.record));

    if (this.form.courseType == 2 && this.form.startTime && this.form.endTime) {
      this.dateRange = [this.form.startTime, this.form.endTime];
    }
  },
  methods: {
    changeRadio() {
      if (this.form.courseType == 1) {
        this.dateRange = [];
        this.form.startTime = '';
        this.form.endTime = '';
      }
    },
    changeDateRange() {
      if (this.dateRange && this.dateRange.length) {
        this.form.startTime = this.dateRange[0];
        this.form.endTime = this.dateRange[1];
      } else {
        this.form.startTime = '';
        this.form.endTime = '';
      }
    },
    save() {
      if (this.form.courseType == 2 && (!this.form.startTime || !this.form.endTime)) {
        this.$message.warning('请选择时间');
        return;
      }

      this.loading = true;
      this.$api.source.addXlkc(this.form).then(res => {
        this.$message.success('保存成功');
        this.$emit('refresh');
        this.$emit('setRecord', JSON.parse(JSON.stringify(this.form)));
      }).finally(() => {
        this.loading = false;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.component-courseSet {
  position: relative;
  .mr0 {
    margin-right: 0;
  }
  .mr10 {
    margin-right: 10px;
  }
  .block {
    margin-top: 15px;
  }
  .btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>