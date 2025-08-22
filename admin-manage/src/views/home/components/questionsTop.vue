<template>
  <div class="questionsTop flex-row">
    <template>
      <div class="flex-layout justify-around">
        <div class="item">
          <div class="name">预约</div>
          <div class="num">{{ yy }}人次</div>
          <div class="up">近一个月{{ yyPercent }}</div>
        </div>
        <div class="item">
          <div class="name">咨询</div>
          <div class="num">{{ zx }}人次</div>
          <div class="up">近一个月{{ zxPercent }}</div>
        </div>
      </div>
      <chart :option="option" class="flex-auto" />
    </template>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
export default {
  name: 'questionsTop',
  components: {
    chart
  },
  mixins: [chartsBase],
  data() {
    return {
      yy: 0,
      zx: 0,
      yyPercent: '',
      zxPercent: '',
      option: {
        dataZoom: this.getXDataZoom(4, 10),
        color: [
          'rgb(1,207,161)',
          'rgb(255,180,0)',
          'rgb(51,146,251)',
          'rgb(248,107,106)'
        ],
        grid: {
          left: 80,
          right: 20,
          bottom: 50,
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            return (
              `${params[0].name}<br/>` +
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#01cfa1;"></span>` +
              `${params[0].value}人次`
            );
          }
        },
        legend: {
          textStyle: {
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff'
            },
            formatter: '{value}人次'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#999'
            }
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 8,
            align: 'center', // 居中对齐
            textStyle: {
              color: '#fff'
            },
            margin: 10 // 调整标签与轴线的距离
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 12,
            data: []
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.questionsTop {
  .item {
    width: 125px;
    position: relative;
    padding-left: 8px;
    padding-bottom: 5px;
    border-left: 2px solid #13b9bb;
    &::before {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(
        90deg,
        #01ecca 0%,
        rgba(19, 192, 207, 0.69) 22%,
        rgba(35, 149, 211, 0.4) 44%,
        rgba(36, 147, 211, 0.4) 45%,
        rgba(57, 183, 170, 0) 100%
      );
      opacity: 0.22;
    }
    .name {
      position: relative;
      top: -7px;
      font-family: SourceHanSansSC-Medium;
      font-size: 18px;
      font-weight: normal;
      font-style: italic;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #d1d6df;
    }
    .num {
      font-size: 14px;
      font-family: AdobeHeitiStd-Regular;
      margin-bottom: 5px;
      color: #e28e61;
      opacity: 0.89;
      span:nth-child(1) {
        margin-right: 5px;
      }
    }
    .up {
      font-size: 14px;
      font-family: AdobeHeitiStd-Regular;
      color: #bcd3df;
      opacity: 0.89;
    }
  }
}
</style>
