<template>
  <div class="analysis-container" v-loading="loading">
    <div class="one">
      姓名：{{ userInfo ? userInfo.realname : '--' }} <span>|</span> 性别：{{
        userInfo ? userInfo.sex_dictText : '--'
      }}
      <span>|</span> 年龄：{{ userInfo ? userInfo.age : '--' }}
      <span>|</span> 结果：<template v-if="disposeStatus == 2">未知</template>
      <template v-else-if="disposeStatus == 1">正常</template>
      <template v-else>不正常</template>
    </div>
    <div class="two" v-loading="loading">
      <div class="card" v-loading="loading">
        <div class="header">心理健康情况</div>
        <div style="width: 100%; height: 330px">
          <chart
            v-if="riskList.length > 0"
            class="chart"
            :option="options"
          ></chart>
          <template v-else>
            <el-empty :image-size="80" :image="noData"></el-empty>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
const noData = require('@/assets/images/no-data.png');
// 根据值计算颜色
function getColor(value, max) {
  const ratio = value / max;
  const r = 0x00;
  const g = Math.round(0x50 + (0xff - 0x50) * ratio); // Starting from darker green (0x50)
  const b = Math.round(0x40 + (0xff - 0x40) * ratio); // Starting from darker blue (0x40)
  const a = 0.3 + (1 - 0.3) * ratio; // Opacity from 0.1 to 1

  return `rgba(48,205,140, ${a})`;
}
let max = 0;
export default {
  components: { chart },
  mixins: [chartsBase],
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return null;
      }
    },
    param: {
      type: Object,
      default: () => {
        return {
          startTime: '',
          endTime: ''
        };
      }
    }
  },
  data() {
    return {
      noData,
      loading: false,
      //  心理测评
      riskList: [],
      options: {
        dataZoom: this.getXDataZoom(10, 10),
        tooltip: {
          formatter: (params) => {
            console.log(params, 'sfdsf');
            return (
              `${params.name}<br/>` +
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#30cd8c;"></span>` +
              `${params.value}次`
            );
          }
        },
        grid: { left: '5%', top: '5%', right: '3%', bottom: '15%' },
        xAxis: [
          {
            type: 'category',
            axisLine: { lineStyle: { color: '#57617B' } },
            axisLabel: { interval: 0, textStyle: { color: '#fff' } },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: { lineStyle: { color: '#57617B' } },
            axisLabel: {
              margin: 10,
              textStyle: { fontSize: 12 },
              textStyle: { color: '#fff' },
              formatter: '{value}'
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed',
                color: ['rgba(255, 255, 255, 0.5)']
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: 12,
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: function (params) {
                  return getColor(params.data, max);
                }
              }
            },
            data: []
          }
        ]
      },
      disposeStatus: 2
    };
  },
  methods: {
    init() {
      this.getHealthConditions(this.userInfo.id);
    },
    getHealthConditions(id) {
      this.loading = false;
      this.$api.analysis
        .healthConditions({
          userId: id,
          ...this.param
        })
        .then((res) => {
          const { riskList, disposeStatus } = res.result;
          this.disposeStatus = disposeStatus;
          this.riskList = riskList;
          if (riskList && riskList.length > 0) {
            const names = riskList.map((v) => v.label);
            this.options.xAxis[0].data = names;
            const values = riskList.map((v) => v.value);
            max = Math.max(...values);

            this.options.series[0].data = values;

            if (riskList.length >= 15) {
              this.options.dataZoom = this.getXDataZoom(15, 10);
            } else {
              this.options.dataZoom = this.getXDataZoom(15, 0);
            }
          } else {
            this.options.xAxis[0].data = [];
            this.options.series[0].data = [];
          }
        })
        .finally(() => {
          console.log('finally');
          this.loading = false;
        });
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val && val.id) {
          this.getHealthConditions(val.id);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.analysis-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  .one {
    margin-bottom: 10px;
    font-size: 16px;
    span {
      font-size: 14px;
      margin: 0 10px;
    }
  }
  .two {
    flex: 1;
    .card {
      width: 100%;
      height: 360px;
      // border: 1px solid #79b1e9;
      background-color: rgba(41, 130, 103, 0.1);
      // box-shadow: 5px 8px 5px 0px rgba(6, 27, 48, 0.51);
      .header {
        width: 100%;
        height: 30px;
        line-height: 28px;
        font-size: 14px;
        padding: 0 16px;
        // border-bottom: 1px solid #79b1e9;
        //
      }
    }
  }
}
</style>
