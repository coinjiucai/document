<template>
  <div>
    <template v-if="itemConfig['type']==='input'">
      <readonly-content
          v-if="readonly||itemConfig['readonly']"
          :class="itemClass"
          :item-config="itemConfig"
          :value="record[itemConfig['valueKey']]">
      </readonly-content>
      <el-input
          v-else
          :class="itemClass"
          :placeholder="setPlaceholder(itemConfig['placeholder'])"
          v-model="record[itemConfig['valueKey']]"
          v-bind="itemConfig['componentProp']"></el-input>
    </template>
    <template v-else-if="itemConfig['type']==='input-number'">
      <readonly-content
          v-if="readonly||itemConfig['readonly']"
          :class="itemClass"
          :value="numberValueFixed">
      </readonly-content>
      <base-input-number
          v-else
          :min="0"
          :class="itemClass"
          v-bind="itemConfig['componentProp']"
          v-model="record[itemConfig['valueKey']]"
          :placeholder="itemConfig['placeholder']"
          @change="doChange(itemConfig,...arguments)">
      </base-input-number>
    </template>
    <template v-else-if="itemConfig['type']==='date-picker'">
      <readonly-content
          v-if="readonly||itemConfig['readonly']"
          :class="itemClass"
          :item-config="itemConfig"
          :value="record[itemConfig['valueKey']]">
      </readonly-content>
      <el-date-picker
          v-else
          v-bind="itemConfig['componentProp']"
          v-model="record[itemConfig['valueKey']]"
          :class="itemClass"
          :placeholder="itemConfig['placeholder']"
          @change="doChange(itemConfig,...arguments)">
      </el-date-picker>
    </template>
    <template v-else-if="itemConfig['type']==='date-range-picker'">
      <readonly-content
          v-if="readonly||itemConfig['readonly']"
          :class="itemClass"
          :item-config="itemConfig"
          :value="dateRangeLabelValue">
      </readonly-content>
      <base-date-time-range
          v-else
          v-bind="itemConfig['componentProp']"
          :start-value.sync="record[itemConfig['startValueKey']]"
          :end-value.sync="record[itemConfig['endValueKey']]"
          :class="itemConfig['style']['class']">
      </base-date-time-range>
    </template>
    <template v-else-if="itemConfig['type']==='cascader'">
      <readonly-content
          v-if="readonly||itemConfig['readonly']"
          :class="itemClass"
          :item-config="itemConfig"
          :value="labelValue">
      </readonly-content>
      <el-cascader
          v-else
          v-bind="itemConfig['componentProp']"
          v-model="record[itemConfig['valueKey']]"
          :class="itemClass"
          @change="doChange(itemConfig,...arguments)">
      </el-cascader>
    </template>
    <template v-else-if="itemConfig['type']==='select'">
      <readonly-content
          v-if="readonly||itemConfig['readonly']"
          :class="itemClass"
          :item-config="itemConfig"
          :value="labelValue">
      </readonly-content>
      <template v-else>
        <!--SelectToString组件用于选择器多选返回结果为字符串数组的场景-->
        <!--存在multiple和（自定义的）toString属性时，返回的值是数组转字符串的数据-->
        <SelectToString
            v-if="itemConfig['componentProp']['multiple']&&itemConfig['componentProp']['toString']"
            v-bind="itemConfig['componentProp']"
            v-model="record[itemConfig['valueKey']]"
            :class="itemClass"
            @change="doChange(itemConfig,...arguments)">
          <el-option
              v-if="itemConfig['componentProp']['options']"
              v-for="(item,index) in itemConfig['componentProp']['options']"
              :style="itemConfig['style']['optionStyle']"
              :key="index"
              v-bind="item">
          </el-option>
        </SelectToString>
        <el-select
            v-else
            v-bind="itemConfig['componentProp']"
            v-model="record[itemConfig['valueKey']]"
            :class="itemClass"
            @change="doChange(itemConfig,...arguments)">
          <el-option
              v-if="itemConfig['componentProp']['options']"
              v-for="(item,index) in itemConfig['componentProp']['options']"
              :style="itemConfig['style']['optionStyle']"
              :key="index"
              v-bind="item">
          </el-option>
        </el-select>
      </template>
    </template>
    <template v-else-if="itemConfig['type']==='switch'">
      <el-switch
          v-bind="itemConfig['componentProp']"
          v-model="record[itemConfig['valueKey']]"
          :class="itemClass"
          :disabled="readonly||itemConfig['readonly']"
          @change="doChange(itemConfig,...arguments)">
      </el-switch>
    </template>
    <template v-else-if="itemConfig['type']==='radio-group'">
      <el-radio-group
          v-model="record[itemConfig['valueKey']]"
          v-bind="itemConfig['componentProp']"
          :class="itemClass"
          @change="doChange(itemConfig,...arguments)">>
        <template v-if="itemConfig['componentProp']['radios']">
          <BaseRadioItem
              v-for="(item,index) in itemConfig['componentProp']['radios']"
              :key="index"
              v-bind="item">
          </BaseRadioItem>
        </template>
      </el-radio-group>
    </template>
    <template v-else-if="itemConfig['type']==='uploadImage'">
      <ImageUpload
          v-model="record[itemConfig['valueKey']]"
          v-bind="itemConfig['componentProp']">
      </ImageUpload>
    </template>
    <template v-else-if="itemConfig['type']==='upload'">
      <FileUpload v-bind="$props"></FileUpload>
    </template>
    <template v-else-if="itemConfig['type']==='custom'">
      <CustomFormItem v-bind="$props"></CustomFormItem>
    </template>
  </div>
</template>

<script>
import FormItemMixin from "./FormItemMixin";
import BaseInputNumber from "@/components/BaseInputNumber/BaseInputNumber";
import BaseDateTimeRange from "@/components/BaseDateTimeRange/BaseDateTimeRange.vue";
import BaseRadioItem from "@/components/BaseRadioItem/BaseRadioItem.vue";
import readonlyContent from "@/components/BaseForm/components/readonlyContent.vue";
import CustomFormItem from "./CustomFormItem.vue";
import FileUpload from "@/components/FileUpload/FileUpload.vue";
import SelectToString from "@/components/ArrayToString/SelectToString.vue";
import ImageUpload from "@/components/FileUpload/ImageUpload.vue";

export default {
  name: "FormBaseComponents",
  mixins: [FormItemMixin],
  components: {
    ImageUpload,
    SelectToString,
    FileUpload,
    readonlyContent,
    BaseRadioItem,
    BaseDateTimeRange,
    BaseInputNumber,
    CustomFormItem
  },
  props: {},
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  filters: {},
  watch: {},
  computed: {
    /**
     * 数值显示处理
     * @return {string|*|string}
     */
    numberValueFixed() {
      if (typeof this.record[this.itemConfig['valueKey']] === 'number') {
        const precision = this.itemConfig?.['componentProp']?.['precision'] || 0
        return this.record[this.itemConfig['valueKey']].toFixed(precision)
      } else {
        return this.record[this.itemConfig['valueKey']]
      }
    },
    dateRangeLabelValue() {
      if (this.itemConfig.hasOwnProperty('startValueKey') && this.itemConfig.hasOwnProperty('endValueKey')) {
        const rangeSeparator = this.itemConfig['componentProp']?.['rangeSeparator'] || '-'
        return `${this.record?.[this.itemConfig['startValueKey']] || ''}${rangeSeparator}${this.record?.[this.itemConfig['endValueKey']] || ''}`
      } else {
        return ''
      }
    },
    itemClass() {
      return this.itemConfig?.['style']?.['class'] || ''
    },
    labelValue() {
      return this.itemConfig?.['labelValue'] || this.record[this.itemConfig['labelKey']]
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.component-FormBaseComponents {

}
</style>
