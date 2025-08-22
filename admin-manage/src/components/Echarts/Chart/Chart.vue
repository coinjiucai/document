<!-- 折线图 -->
<template>
  <div class="component-react-chart" v-resize:throttle="onResize">
    <div
      v-show="!noData"
      ref="chart"
      class="component-Chart"
      :style="{ width: width, height: height }"
    ></div>
    <div ref="noData" v-if="noData" class="noData">暂无数据</div>
  </div>
</template>

<script>
import pubsub from "pubsub-js";
export default {
  name: "Chart",
  props: {
    // 图表样式
    height: {
      type: [String, Number],
      default: "100%",
    },
    width: {
      type: [String, Number],
      default: "100%",
    },
    // 图表配置参数
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
      noData: true,
      prevOption: null, // 上一次配置
      pubId: null,
    };
  },
  beforeDestroy() {
    // 销毁图表
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (this.pubId) {
      pubsub.unsubscribe(this.pubId);
    }
  },
  //created(){}
  mounted() {
    // 监听是进入预览模式
    this.pubId = pubsub.subscribe("pdfview", (msgName, data) => {
      if (data) {
        // 预览模式（去掉滚动条）
        this.option.dataZoomPrev = this.option.dataZoom
          ? JSON.parse(JSON.stringify(this.option.dataZoom))
          : null;
        this.option.dataZoom = null;
        if (this.option.yAxis && this.option.yAxis.axisLabel) {
          this.option.yAxis.axisLabel.interval = 0;
          this.option.yAxis.axisLabel.overflow = "break";
        }
        if (this.option.xAxis && this.option.xAxis.axisLabel) {
          this.option.xAxis.axisLabel.interval = 0;
          this.option.xAxis.axisLabel.rotate = 30;
          this.option.xAxis.axisLabel.overflow = "break";
        }
      } else {
        // 正常模式（显示滚动条）
        if (this.option.dataZoomPrev) {
          this.option.dataZoom = this.option.dataZoomPrev
            ? JSON.parse(JSON.stringify(this.option.dataZoomPrev))
            : null;
          this.option.dataZoomPrev = null;
        }
        if (this.option.yAxis && this.option.yAxis.axisLabel) {
          this.option.yAxis.axisLabel.interval = "auto";
          this.option.yAxis.axisLabel.overflow = "truncate";
        }
        if (this.option.xAxis && this.option.xAxis.axisLabel) {
          this.option.xAxis.axisLabel.interval = "auto";
          this.option.xAxis.axisLabel.rotate = 0;
          this.option.xAxis.axisLabel.overflow = "truncate";
        }
      }
    });
  },
  filters: {},
  computed: {},
  methods: {
    onResize(...e) {
      //内部触发的事件
      this.chartResize();
      this.$emit("resize", ...e);
    },
    chartResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    chartClick(data) {
      this.$emit("click", data);
    },
    legendselectchanged(data) {
      this.chart.setOption({
        legend: { selected: { [data.name]: true } },
      });
      this.$emit("legendClick", data);
    },
    // 渲染图表
    draw() {
      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.setOption(this.option, true);
      this.chart.on("click", this.chartClick);
      this.chart.on("legendselectchanged", this.legendselectchanged);
    },
  },
  watch: {
    option: {
      handler(nVal) {
        if (nVal) {
          if (Object.keys(nVal).length > 0) {
            this.noData = true;
            nVal.series.some((series) => {
              if (series.data.length > 0) {
                this.noData = false;
              }
            });
            if (this.noData) {
              if (this.chart) {
                this.chart.dispose();
                this.chart = null;
              }
            } else {
              this.$nextTick(() => {
                this.draw();
              });
            }
          } else {
            this.noData = true;
            if (this.chart) {
              this.chart.dispose();
              this.chart = null;
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.component-react-chart {
  width: 100%;
  height: 100%;
  .component-Chart {
    width: 100%;
    height: 100%;
  }
  .hidden {
    visibility: hidden;
  }
}

.noData {
  height: 100%;
  width: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
