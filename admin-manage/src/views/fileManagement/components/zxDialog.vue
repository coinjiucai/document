<template>
  <BaseDialog
    class="full-block component-table-dialog"
    title="咨询预约详情"
    center
    :visible.sync="visibleDialog"
    @closed="handleCloseDialog"
    :width="width"
    top="5vh"
  >
    <div class="full-block">
      <el-form
        ref="form"
        :model="record"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input
                v-model="record.userName"
                placeholder="姓名"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input
                v-model="record.userName"
                placeholder="联系方式"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <FormItem
                v-model="record.sex"
                placeholder="姓名"
                compType="select"
                dictCode="sex"
                disabled
              ></FormItem>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input
                v-model="record.age"
                placeholder="年龄"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="咨询问题">
              <el-input
                v-model="record.consultQuestion"
                placeholder="咨询问题"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="咨询时间">
              <el-input
                v-model="record.consultTime"
                placeholder="咨询时间"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="咨询导师">
              <el-input
                v-model="record.counselorName"
                placeholder="咨询导师"
                disabled
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="咨询地点">
              <el-input
                v-model="record.consultAddress"
                placeholder="咨询地点"
                disabled
              ></el-input> </el-form-item
          ></el-col>
        </el-row>

        <el-form-item label="导师信息">
          <el-image
            v-if="record.counselor"
            style="width: 200px; height: 200px"
            :src="getImageUrl(record.counselor.webchatImg)"
            fit="cover"
          ></el-image>
          <div v-else>--</div>
        </el-form-item>
      </el-form>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
export default {
  name: 'TableDialog',
  components: { BaseDialog, FormItem },
  props: {
    width: {
      type: String,
      default: () => {
        return '800px';
      }
    }
  },
  data() {
    return {
      visibleDialog: false,
      record: {
        userName: '',
        phone: '',
        sex: '',
        age: '',
        consultQuestion: '',
        consultTime: '',
        counselorName: '',
        consultAddress: '',
        counselor: {}
      },
      rules: {}
    };
  },
  created() {},
  methods: {
    getImageUrl(value) {
      if (!value) {
        return '';
      }
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    show(record) {
      this.record = record;
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-bottom: 10px;
}
/deep/.table-dialog-list {
  height: 363px;
}
/deep/.el-table__body-wrapper,
/deep/.el-table__header-wrapper {
  width: 100% !important;
}
.base-table-wrap {
  overflow-x: auto;
}
</style>
