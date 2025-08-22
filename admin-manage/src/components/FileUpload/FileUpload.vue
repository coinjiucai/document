<!--
  @Name 文件上传组件
  @Description 基于el-upload封装的文件上传组件，
  配合BaseForm通过传入配置实现不同需求。
  @author 赖明浩
  @date 2023-7-23
  @version 1.0.0
-->

<template>
  <div v-if="readonly || itemConfig['readonly']">
    <template v-if="record[itemConfig['valueKey']].length > 0">
      <div
        class="file-item item-hover flex-row"
        v-for="(item, index) in record[itemConfig['valueKey']]"
        :key="index"
        @click.stop="handlePreview(item)"
      >
        <div class="flex-none pr10">
          <i class="el-icon-document"></i>
        </div>
        <div class="flex-auto">
          <TextTooltip :value="item.name"></TextTooltip>
        </div>
      </div>
    </template>
    <div v-else class="theme-color-placeholder">暂无文件</div>
  </div>
  <el-upload
    v-else
    ref="upload"
    :disabled="isOnBusy"
    v-bind="itemConfig['componentProp']"
    :file-list="record[itemConfig['valueKey']]"
    :before-upload="beforeUpload"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-remove="beforeRemove"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
  >
    <el-button size="small" type="primary" :loading="isOnBusy"
      >点击上传</el-button
    >
    <div slot="tip" class="el-upload__tip" v-if="message.length">
      <span><i class="el-icon-star-on"></i>上传规范：</span>
      <ul>
        <li v-for="(item, index) in message" :key="index">{{ item }}</li>
      </ul>
    </div>
  </el-upload>
</template>

<script>
import FormItemMixin from '@/components/BaseForm/components/FormItemMixin';
import TextTooltip from '@/components/TextTooltip/TextTooltip.vue';

export default {
  name: 'FileUpload',
  components: { TextTooltip },
  mixins: [FormItemMixin],
  computed: {
    /**
     * 当个文件大小限制（单位MB）
     * @return {number}
     */
    sizeLimit() {
      return this.itemConfig?.['componentProp']?.['sizeLimit'] || 1024 * 2;
    },
    /**
     * 格式限制
     * @return {string}
     */
    typeLimit() {
      return (
        `(${this.itemConfig?.['componentProp']?.['accept'].replaceAll(
          ',',
          '|'
        )})$` || '(.doc|.docx|.pdf|.txt|.mp4)$'
      );
    },
    /**
     * 上传规范
     * @return {string[]}
     */
    message() {
      return this.itemConfig?.['componentProp']?.['message'] || [];
    },
    /**
     * 是否忙碌
     * @return {boolean}
     */
    isOnBusy() {
      return Boolean(this.itemConfig['isOnBusy']);
    }
  },
  methods: {
    /**
     * 文件上传前的校验
     * @param file
     * @returns {boolean}
     */
    beforeUpload(file) {
      if (this.typeLimit && !new RegExp(this.typeLimit).test(file.name)) {
        this.$popTip.warning('文件格式不正确，详情参见上传规范！');
        return false;
      }
      if (this.sizeLimit && file.size > 1024000 * this.sizeLimit) {
        this.$popTip.warning(`文件大小不能超过${this.sizeLimit}MB！`);
        return false;
      }
      // 上传前开启忙碌状态
      if (
        this.itemConfig['componentEvent'] &&
        this.itemConfig['componentEvent']['onBusy']
      ) {
        this.itemConfig['componentEvent']['onBusy'](true);
      }
    },
    /**
     * 多选个数超出提示
     */
    handleExceed(files, fileList) {
      this.$popTip.warning(
        `仅允许上传 ${
          this.itemConfig['componentProp']['limit']
        }个文件，待上传 ${files.length} 个，已上传${
          fileList.length
        }个，已超出(${files.length + fileList.length}/${
          this.itemConfig['componentProp']['limit']
        })！`
      );
    },
    /**
     * 上传成功处理
     * @param response
     * @param file
     * @param fileList
     */
    handleSuccess(response, file, fileList) {
      if (
        this.itemConfig['componentEvent'] &&
        this.itemConfig['componentEvent']['onSuccess']
      ) {
        this.itemConfig['componentEvent']['onSuccess'](
          this.record,
          response,
          file,
          fileList
        );
      }
      this.checkBusy(fileList);
    },
    /**
     * 上传失败处理
     * @param err
     * @param file
     * @param fileList
     */
    handleError(err, file, fileList) {
      this.checkBusy(fileList);
    },
    /**
     * 检查忙碌状态
     * @param fileList
     */
    checkBusy(fileList) {
      // 只要所有file的status不处于uploading中即判定为非忙碌
      if (!fileList.find((i) => i.status === 'uploading')) {
        // itemConfig > componentEvent > onBusy方法必须存在
        // 通过onBusy方法调整
        if (
          this.itemConfig['componentEvent'] &&
          this.itemConfig['componentEvent']['onBusy']
        ) {
          this.itemConfig['componentEvent']['onBusy'](false);
        }
      }
    },
    /**
     * 删除之前
     * @param file
     * @param fileList
     * @returns {Promise<MessageBoxData>}
     */
    beforeRemove(file, fileList) {
      if (
        this.itemConfig['componentEvent'] &&
        this.itemConfig['componentEvent']['beforeRemove']
      ) {
        this.itemConfig['componentEvent']['beforeRemove'](
          this.record,
          file,
          fileList
        );
      }
    },
    /**
     * 文件删除
     * @param file
     * @param fileList
     */
    handleRemove(file, fileList) {
      if (
        this.itemConfig['componentEvent'] &&
        this.itemConfig['componentEvent']['onRemove']
      ) {
        this.itemConfig['componentEvent']['onRemove'](
          this.record,
          file,
          fileList
        );
      }
    },
    /**
     * 点击文件列表文件的处理
     */
    handlePreview(file) {
      if (
        this.itemConfig['componentEvent'] &&
        this.itemConfig['componentEvent']['onPreview']
      ) {
        this.itemConfig['componentEvent']['onPreview'](this.record, file);
      }
    }
  }
};
</script>

<style scoped>
.file-item {
  padding-left: 10px;
  cursor: pointer;
}
</style>
