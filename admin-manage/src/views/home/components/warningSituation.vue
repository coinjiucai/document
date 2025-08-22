<template>
  <div class="warningSituation flex-row">
    <template v-if="list.length > 0">
      <chart :option="option" class="chart" @click="changeItem" />
      <div class="flex-auto flex-layout justify-around">
        <div class="top box-bg flex-row justify-between">
          <span>
            <span>当前预警人数</span>
            <span class="num1">{{ currentAmount }}</span>
            <span>人</span>
          </span>
          <span>
            <span>累计预警人数</span>
            <span class="num2">{{ total }}</span>
            <span>人</span>
          </span>
        </div>
        <div class="bottom flex-row justify-between">
          <div
            class="item box-bg"
            v-for="(item, index) in list"
            :key="index"
            @click="changeItem(item)"
          >
            <div class="name">{{ item.name }}</div>
            <div class="num" :class="'num' + index">
              <span>{{ item.rs }}人</span>
              <span>{{ item.rate }}%</span>
            </div>
            <div class="up">近一个月{{ item.upRate }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <chart :option="{}" />
    </template>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
export default {
  name: 'warningSituation',
  components: {
    chart
  },
  data() {
    return {
      currentAmount: 0,
      total: 0,
      option: {
        color: ['rgb(223,126,82)', 'rgb(205,205,65)', 'rgb(28,167,192)'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: 0,
          left: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#fff'
          },
          formatter: (name) => {
            let row = this.option.series[0].data.find((i) => i.name == name);
            return row.name + ' ' + row.value + '人';
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['50%', '30%'],
            label: {
              show: false
            },
            data: []
          }
        ]
      },
      list: []
    };
  },
  mounted() {},
  methods: {
    changeItem(item) {
      if (item.name == '一级预警') {
        this.$router.push({
          path: '/psychologicalWarning/psychologicalWarning',
          query: {
            warnLevel: 1
          }
        });
      } else if (item.name == '二级预警') {
        this.$router.push({
          path: '/psychologicalWarning/psychologicalWarning',
          query: {
            warnLevel: 2
          }
        });
      } else if (item.name == '三级预警') {
        this.$router.push({
          path: '/psychologicalWarning/psychologicalWarning',
          query: {
            warnLevel: 3
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.warningSituation {
  .chart {
    width: 200px;
  }
  .top {
    padding: 5px 30px 5px 10px;
    font-size: 16px;
    .num1 {
      font-size: 30px;
      color: #ffe04d;
    }
    .num2 {
      font-size: 30px;
      color: #01cfa1;
    }
  }
  .bottom {
    .item {
      padding-left: 8px;
      padding-bottom: 5px;
      cursor: pointer;
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
        opacity: 0.89;
        margin-bottom: 5px;
        span:nth-child(1) {
          margin-right: 5px;
        }
      }
      .num0 {
        color: #e28e61;
      }
      .num1 {
        color: #cece41;
      }
      .num2 {
        color: #1da7c0;
      }
      .up {
        font-size: 14px;
        font-family: AdobeHeitiStd-Regular;
        color: #bcd3df;
        opacity: 0.89;
      }
    }
  }

  .box-bg {
    position: relative;
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
  }
}
</style>
