<template>
  <div class="ai-report theme-background-middle flex-layout full-block pa10">
    <div class="flex-none btns" style="height: 39px">
      <div
        v-for="item in btnList"
        :key="item.value"
        @click="current = item.value"
        :class="item.value == current ? 'active' : ''"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="flex-auto">
      <personReport v-if="current == 1"></personReport>
      <orgReport v-else></orgReport>
    </div>
  </div>
</template>
<script>
import personReport from "./personReport.vue";
import orgReport from "./orgReport.vue";
export default {
  // ai智能报告
  components: {
    personReport,
    orgReport,
  },
  data() {
    return {
      current: 1, // 1 个人分析 2 团体分析
      btnList: [
        {
          value: 1,
          label: "个人分析",
        },
        {
          value: 2,
          label: "团体分析",
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.btns {
  display: flex;

  > div {
    width: 142px;
    height: 39px;
    font-size: 18px;
    line-height: 39px;
    text-align: center;
    margin-right: 10px;
    background-image: url("~@/assets/images/unactive-btn.png");
    background-size: 100%;
    cursor: pointer;
  }

  .active {
    background-image: url("~@/assets/images/active-btn.png");
  }
}
</style>
    