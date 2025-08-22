<template>
  <div>
    <BaseDialog
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="1000px"
      top="20vh"
    >
      <div class="component-previewDialog scroll-y">
        <div 
          class="block" 
          v-for="(item, index) in list" 
          :key="index"
        >
          <div class="title-wrap">{{ `${numberWord[index]}、${item.topicName}` }}</div>
          <div class="container">
            <div 
              class="cell" 
              v-for="(it, i) in item.questionBankList" 
              :key="i"
            >
              <div class="cell-title flex-row">
                <div>{{ i + 1 }}、</div>
                <div v-html="it.question"></div>
              </div>
              <div class="cell-content">
                <template v-if="item.topicCategory == 1">
                  <el-radio-group disabled>
                    <el-radio 
                      v-for="(itm, j) in getAnswer(it.answerJson)" 
                      :key="j" 
                      style="display: block" 
                      :label="itm.optionCode"
                    >{{ itm.optionContent }}</el-radio>
                  </el-radio-group>
                </template>
                <template v-if="item.topicCategory == 2">
                  <el-checkbox-group disabled v-for="(itm, j) in getAnswer(it.answerJson)" :key="j">
                    <el-checkbox :label="itm.optionCode">{{ itm.optionContent }}</el-checkbox>
                  </el-checkbox-group>
                </template>
                <template v-if="item.topicCategory == 3">
                  <el-radio-group disabled>
                    <el-radio 
                      style="display: block"
                      :label="1"
                    >对</el-radio>
                    <el-radio 
                      style="display: block"
                      :label="2"
                    >错</el-radio>
                  </el-radio-group>
                </template>
                <template v-if="item.topicCategory == 4">
                  <div v-for="(itm, j) in getAnswer(it.answerJson)" :key="j">({{ j + 1 }})</div>
                </template>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";

import { numberWord } from '@/com/global_data';
export default {
  name: 'previewDialog',
  components: {
    BaseDialog,
  },
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    getAnswer() {
      return (val) => {
        let list;

        try {
          list = JSON.parse(val);
        } catch(error) {};

        return list;
      }
    }
  },
  data() {
    return {
      numberWord,
      dialogTitle: '预览',
      visibleDialog: false,
    }
  },
  methods: {
    show() {
      this.visibleDialog = true;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
      this.reset();
    },
    reset() {},
  }
}
</script>

<style lang="scss" scoped>
.component-previewDialog {
  height: 70vh;
  .block {
    .title-wrap {
      margin-bottom: 10px;
    }
    .container {
      .cell {
        .cell-title {
          margin-bottom: 10px;
          /deep/ p {
            margin: 0;
          }
        }
        .cell-content {}
      }
      .cell + .cell {
        margin-top: 10px;
      }
    }
  }
  .block + .block {
    margin-top: 20px;
  }
}
</style>