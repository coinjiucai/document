<!-- 该组件为列表搜索组件,具体使用参考demo-config.json配置使用 -->
<template>
  <div class="search-component" :style="styleObj" :class="className">
    <el-form inline size="mini">
      <el-form-item
        v-for="(item, index) in fieldsConfig"
        :key="index"
        :label="item.label"
        :class="itemClassName"
      >
        <!-- 输入框 -->
        <template v-if="item.compType == 'input'">
          <el-input
            size="mini"
            :style="{
              width: `${item.width}px`
            }"
            :placeholder="item.placeholder"
            clearable
            v-model="params[item.prop]"
            maxlength="30"
          ></el-input>
        </template>
        <!-- 下拉选择器 -->
        <template v-if="item.compType == 'select'">
          <DictionarySelect
            v-if="item.dictCode"
            :dictCode="item.dictCode"
            size="mini"
            v-model="params[item.prop]"
            clearable
          ></DictionarySelect>
          <template v-else-if="item.group">
            <el-select
              size="mini"
              :style="{
                width: `${item.width}px`
              }"
              clearable
              :placeholder="item.placeholder"
              v-model="params[item.prop]"
              :multiple="item.multiple"
            >
              <el-option-group
                v-for="group in item.options"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </template>
          <el-select
            v-else
            size="mini"
            :style="{
              width: `${item.width}px`
            }"
            clearable
            :placeholder="item.placeholder"
            v-model="params[item.prop]"
          >
            <el-option
              v-for="(v, index) in item.options"
              :key="index"
              :label="v.label"
              :value="v.value"
            ></el-option>
          </el-select>
        </template>
        <template v-if="item.compType == 'roleSelect'">
          <RoleSelect v-model="params[item.prop]" size="mini"></RoleSelect>
        </template>
        <!-- 时间区间选择 -->
        <template v-if="item.compType == 'rangeTime'">
          <rangeBothValue
            :dataType="item.dataType || 'daterange'"
            :style="{
              width: `${item.width}px`
            }"
            size="mini"
            :placeholder="item.placeholder"
            :start-placeholder="item.startPlaceholder"
            :end-placeholder="item.endPlaceholder"
            :value-format="item.valueFormat"
            :end-value.sync="params[item.propEnd]"
            :start-value.sync="params[item.propStart]"
            @change="handleSearch"
          >
          </rangeBothValue>
        </template>
        <!-- 日期时间 -->
        <template
          v-if="
            [
              'year',
              'month',
              'date',
              'week',
              'datetime',
              'datetimerange',
              'daterange'
            ].includes(item.compType)
          "
        >
          <el-date-picker
            :format="item.format"
            v-model="params[item.prop]"
            :type="item.compType"
            style="width: 100%"
            size="mini"
            v-bind="item"
            :placeholder="item.placeholder ? item.placeholder : ''"
            clearable
            @change="handleSearch"
          >
          </el-date-picker>
        </template>
      </el-form-item>
      <!-- 搜索按钮 -->
      <el-form-item :class="itemClassName" v-if="isReset">
        <SearchActions @handleSearch="handleSearch" @reset="reset">
          <template v-slot:special>
            <slot name="specialButtons"></slot>
          </template>
        </SearchActions>
      </el-form-item>
      <el-form-item :class="itemClassName" v-else>
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import rangeBothValue from '@/components/Date/rangeBothValue';
import SearchActions from './SearchActions';
import DictionarySelect from '@/components/DictionarySelect';
import RoleSelect from '@/components/RoleSelect';
export default {
  name: 'Search',
  components: {
    rangeBothValue,
    SearchActions,
    DictionarySelect,
    RoleSelect
  },
  props: {
    // 设置样式
    styleObj: {
      type: Object,
      default: () => {
        return {
          display: 'inline-block',
          'text-align': 'right'
        };
      }
    },
    // 设置样式类名
    className: {
      type: String,
      default: () => {
        return '';
      }
    },
    itemClassName: {
      type: String,
      default: () => {
        return 'search-item';
      }
    },
    // 大小
    size: {
      type: String,
      default: () => {
        return 'mini'; // medium / small / mini
      }
    },
    // 搜索绑定的参数
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 字段配置
    fieldsConfig: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isReset: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  filters: {},
  watch: {},
  computed: {},
  methods: {
    handleSearch() {
      this.$emit('handleSearch');
    },
    reset() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss" scoped>
.search-component {
  .search-item {
    margin-bottom: 0px;
  }
  v-deep .el-input__suffix {
    top: -4px;
  }
}
</style>
