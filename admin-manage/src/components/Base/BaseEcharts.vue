<!--
  @Name Echarts基础组件
  @Description 基于Echarts封装的公共可视化图组件
  @author 赖明浩
  @date 2023-2-6
  @version 1.0.3
-->

<template>
  <div class="component-react-chart" v-resize:throttle="onResize">
    <div class="chart-ele" :class="{hidden:noData}" ref="chartEle"></div>
    <div class="major-no-data full-block" v-if="noData">
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import Common from '@/com/common';
import Echarts from 'echarts';
import {BROWSER_THEME} from "@/utils/themeControl";
import darkBlue from '@/assets/EchartTheme/darkBlue.json'
import dark from '@/assets/EchartTheme/dark.json'
import systemLocalConfig from "@/utils/systemLocalConfig";

export default {
  name: 'BaseEcharts',
  props: {
    //原始数据
    data: {required: true,},
    //固定的初始化配置参数 传入后会被深拷贝 所以外部的config是可以复用的
    config: {type: Object, required: true,},
    //chart数据构造函数
    dataFormat: {type: Function, required: true,},
    //(chart,vm)//用来注册点击事件等
    initCb: {type: Function,},
    //主题风格,目前有light和dark,followSystem三种模式
    theme: {type: String, default: systemLocalConfig.systemTheme}
  },
  data() {
    return {
      chart: null,
      chartConfig: this.getChartConfig(),
      formatRet: {},
    };
  },
  mounted() {
    this.registerTheme()
    this.$nextTick(() => {
      this.chartInit();
      this.dataRefresh();
    })
  },
  beforeDestroy() {
    if (this.chart) Echarts.dispose(this.chart);
  },
  watch: {
    data: {
      handler() {
        this.dataRefresh();
      },
      deep: true,
    },
    config: {
      handler() {
        this.chartConfig = this.getChartConfig();
        this.dataRefresh();
      },
      deep: true,
    }
  },
  computed: {
    noData() {
      return this.formatRet.noData;
    },
  },
  methods: {
    /**
     * Echarts主题注册
     */
    registerTheme() {
      Echarts.registerTheme('darkBlue', darkBlue)
      Echarts.registerTheme('dark', dark)
    },
    /**
     * 图初始化
     */
    chartInit() {
      const theme = this.theme === 'followSystem' ? (BROWSER_THEME.matches ? 'dark' : 'light') : this.theme
      this.chart = Echarts.init(this.$refs.chartEle, theme);
      this.chart.on("click", (data) => this.$emit('click', data))
      this.initCb && this.initCb(this.chart, this);//(chart,vm)
    },
    /**
     * 内部容器大小调整
     * @param e
     */
    onResize(...e) {
      this.handleChartResize()
      this.$emit("resize", ...e)
    },
    /**
     * 调整图的大小
     */
    handleChartResize() {
      this.chart.resize()
    },
    /**
     * 刷新图的数据
     */
    dataRefresh() {
      if (!this.chart) return;
      let ret = this.dataFormat(this.chartConfig, this.data);
      this.formatRet = ret || {}
      if (ret) {
        if (ret.cancel) return;
        if (ret.clear) this.chart.clear();
      }
      this.chartRefresh();
    },
    /**
     * 刷新图
     */
    chartRefresh() {
      this.chart.setOption(this.chartConfig);
      this.$emit("refreshed", this.chartConfig)
    },
    /**
     * 获取图数据（深拷贝）
     * @returns {*[]|null}
     */
    getChartConfig() {
      return Common.CloneDeepObj(this.config);
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.component-react-chart {
  width: 100%;
  height: 100%;
  position: relative;

  .chart-ele {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
  }

  .major-no-data {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    font-size: 16px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c0c0c0;
  }

  .hidden {
    visibility: hidden;
  }
}
</style>
