<template>
  <div style="height: auto">
    <div class="flex-row justify-end">
      <!-- <div class="flex-auto pr10">
        <el-input
            v-model="jsonText"
            resize="none"
            type="textarea"
            :autosize="{minRows:2,maxRows:4}"
            maxlength="5000"
            show-word-limit
            clearable
            :placeholder="jsonTextPlaceholder"></el-input>
      </div> -->
      <!-- <div class="flex-none"> -->
      <!-- <el-button-group v-if="questionCategory != 3 && questionCategory != 5"> -->
      <!-- <el-button icon="el-icon-refresh" type="warning" @click="handleJSONTextParse">数据转化</el-button> -->
      <template v-if="questionCategory != 3 && questionCategory != 5">
        <el-button icon="el-icon-plus" type="primary" @click="handleAddItem()"
          >新增选项</el-button
        >
        <el-button
          icon="el-icon-delete"
          type="danger"
          @click="handleRemoveItem()"
          >删除选项</el-button
        >
      </template>
      <!-- </el-button-group> -->
      <!-- </div> -->
    </div>
    <div class="pt10">
      <BaseTable
        ref="BaseTable"
        stripe
        :height="null"
        item-draggable
        :show-pagination="false"
        :list.sync="dataList"
        v-if="questionCategory != 5"
      >
        <template #content>
          <el-table-column label="选项" prop="optionCode">
            <template #default="{ $index }">{{
              getOptionCode($index)
            }}</template>
          </el-table-column>
          <el-table-column
            label="选项内容"
            prop="optionContent"
            v-if="questionCategory != 3"
          >
            <template #default="{ row }">
              <el-input
                size="small"
                maxlength="500"
                placeholder="请输入"
                v-model="row['optionContent']"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="是否正确"
            prop="label"
            v-if="questionCategory != 4"
          >
            <template #default="{ row, $index }">
              <el-switch
                v-model="row['isRight']"
                :inactive-value="0"
                :active-value="1"
                @change="changeSwitch(row, $index)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            v-if="questionCategory != 3 && questionCategory != 5"
          >
            <template #default="{ $index }">
              <el-button-group>
                <el-button
                  size="small"
                  icon="el-icon-plus"
                  type="primary"
                  @click="handleAddItem($index)"
                ></el-button>
                <el-button
                  size="small"
                  icon="el-icon-delete"
                  type="danger"
                  @click="handleRemoveItem($index)"
                ></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
      <!-- <BaseQuillEditor
        v-else
        v-model="dataList[0].optionContent"
      ></BaseQuillEditor> -->
      <el-input
        v-else
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 20 }"
        placeholder="请输入答案"
        v-model="dataList[0].optionContent"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import BaseTable from '@/components/Base/BaseTable.vue';
import BaseQuillEditor from '@/views/basicsManage/questionBankManage/components/BaseQuillEditor.vue';

import Common from '@/com/common';

import { rightWrong } from '@/com/global_data';

export default defineComponent({
  components: { BaseTable, BaseQuillEditor },
  props: {
    value: Array,
    questionCategory: {
      type: Number,
      default: 1
    }
  },
  mounted() {},
  data() {
    return {
      // dataList:[],
      rightWrong,
      title: '选项静态数据编辑',
      jsonText: '',
      jsonTextPlaceholder:
        '请输入Option选项的JSON数据，或用逗号或分号分隔开的字符串，\n然后点击‘数据转化’会将其解析并添加到列表中！'
    };
  },
  computed: {
    dataList: {
      get() {
        return this.value;
      },
      set(val) {
        val.forEach((item, index) => {
          item['sort'] = index;
          item['optionCode'] = index + 1;
        });
        this.$emit('input', val);
      }
    }
  },
  methods: {
    changeSwitch(row, index) {
      if (this.questionCategory == 1 || this.questionCategory == 3) {
        if (row.isRight == 1) {
          this.dataList.forEach((el, i) => {
            if (i != index) {
              this.$set(this.dataList[i], 'isRight', 0);
            }
          });
        }
      }
    },
    getOptionCode(index) {
      if (this.questionCategory == 3) {
        let tg = this.rightWrong.find((el) => el.value == index);

        return tg?.label || '';
      } else if (this.questionCategory == 4) {
        return `(${index + 1})`;
      } else {
        return Common.decimalToBase26(index);
      }
    },
    getDefaultItem(index) {
      return {
        audioUrl: '',
        createBy: '',
        createTime: '',
        id: Symbol(),
        imageUrl: '',
        isRight: 0,
        optionCode: index + 1,
        optionContent: '',
        questionId: '',
        sort: 0,
        updateBy: '',
        updateTime: ''
      };
    },
    updateOptionCode() {
      this.dataList = this.dataList.map((item, index) => {
        const i = { ...item };
        i['sort'] = index;
        i['optionCode'] = index + 1;
        return i;
      });
    },
    handleAddItem(rowIndex = null) {
      if (rowIndex === null) {
        let item = this.getDefaultItem(this.dataList.length);

        if (this.questionCategory == 4) {
          item.isRight = 1;
        }

        this.dataList.push(item);
      } else {
        let item = this.getDefaultItem(rowIndex + 1);

        if (this.questionCategory == 4) {
          item.isRight = 1;
        }

        this.dataList.splice(rowIndex, 0, [item]);
        this.updateOptionCode();
      }
    },
    handleRemoveItem(rowIndex = null) {
      if (rowIndex === null) {
        this.$refs.BaseTable.selectedList.forEach((item) => {
          this.dataList.remove((i) => item.id === i.id);
        });
      } else {
        this.dataList.splice(rowIndex, 1);
      }
    },
    handleJSONTextParse() {
      let list = [];
      let isJson = false;
      try {
        list = JSON.parse(this.jsonText);
        isJson = !list.some((i) => !i.hasOwnProperty('optionContent'));
      } catch (e) {
        isJson = false;
      }
      if (!isJson) {
        list = this.jsonText
          .split(/[,;，；]/)
          .filter((i) => i !== '')
          .map((i, index) => {
            const item = this.getDefaultItem(this.dataList.length + index);
            item['optionContent'] = i;
            return item;
          });
      } else {
        list = list.map((i, ii) => {
          const resultItem = this.getDefaultItem(this.dataList.length + ii);
          for (let key in resultItem) {
            if (i.hasOwnProperty(key)) {
              resultItem[key] = i[key];
            }
          }
          return resultItem;
        });
      }
      if (Array.isArray(list) && list.length > 0) {
        this.dataList.push(...list);
        this.updateOptionCode();
      } else {
        this.$popTip.info('请在左侧输入要解析的数组！');
      }
    }
  }
});
</script>

<style scoped lang="scss"></style>
