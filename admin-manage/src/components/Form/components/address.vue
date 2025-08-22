<template>
  <div id="app">
    <el-cascader
      v-if="$attrs?.level && $attrs.level == 'province'"
      v-bind="$attrs"
      :options="province"
      v-model="selectedOptions"
      @change="changeValue"
    >
    </el-cascader>
    <el-cascader
      v-else-if="$attrs?.level && $attrs.level == 'city'"
      v-bind="$attrs"
      :options="provinceAndCityData"
      v-model="selectedOptions"
      @change="changeValue"
    >
    </el-cascader>
    <el-cascader
      v-else
      v-bind="$attrs"
      :options="regionData"
      v-model="selectedOptions"
      @change="changeValue"
    >
    </el-cascader>
  </div>
</template>

<script>
import { provinceAndCityData, regionData } from "element-china-area-data";
import { isArray } from "@/utils/utils";
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: [String, Array],
  },
  data() {
    return {
      province: provinceAndCityData.map((v) => {
        return {
          label: v.label,
          value: v.value,
        };
      }),
      provinceAndCityData,
      regionData,
      selectedOptions: [],
    };
  },
  methods: {
    changeValue(val) {
      this.$emit("change", val);
    },
  },
  watch: {
    value: {
      handler(newVal) {
        if (isArray(newVal)) {
          this.selectedOptions = newVal;
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
