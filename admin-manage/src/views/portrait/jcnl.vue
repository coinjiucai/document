<template>
  <div class="full-block jcnl" v-loading="loading">
    <img
      class="back-button"
      src="@/assets/images/back.png"
      style="width: 40px"
      @click="$router.go(-1)"
    />
    <div class="search">
      <Search
        :params="params"
        :fieldsConfig="fieldsConfig"
        @handleSearch="handleSearch"
        @reset="reset"
      ></Search>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title mb20"><span>认知能力</span></div>
      <chart
        :option="option1"
        class="flex-auto"
        v-if="option1.radar.indicator.length > 0"
      ></chart>
      <chart :option="{}" class="flex-auto" v-else></chart>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>脑健康状态</span></div>
      <BaseTable
        ref="table"
        height="100%"
        :label-list="labelListA"
        :list="listA"
        :showPagination="false"
        :showSelection="false"
      >
      </BaseTable>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>大脑调节能力</span></div>
      <BaseTable
        ref="table"
        height="100%"
        :label-list="labelListB"
        :list="listB"
        :showPagination="false"
        :showSelection="false"
      >
      </BaseTable>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title">
        <span>{{
          info && info.evaluation ? info.evaluation : '总体分析'
        }}</span>
      </div>
      <chart :option="option4" class="flex-auto"></chart>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>大脑基础节律</span></div>
      <BaseTable
        ref="table"
        height="100%"
        :label-list="labelListC"
        :list="listC"
        :showPagination="false"
        :showSelection="false"
      >
      </BaseTable>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>情绪指数</span></div>
      <el-row style="margin-top: 16px">
        <el-col :span="12">
          <div
            style="
              display: flex;
              text-align: center;
              line-height: 44px;
              background: rgba(0, 0, 0, 0.1);
              font-size: 14px;
            "
          >
            <div style="width: 50%; font-weight: bold">指标</div>
            <div style="width: 50%">{{ emotionData.emotionIndex }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div
            style="
              display: flex;
              text-align: center;
              line-height: 44px;
              background: rgba(0, 0, 0, 0.1);
              font-size: 14px;s
            "
          >
            <div style="width: 50%; font-weight: bold">数值</div>
            <div style="width: 50%">{{ emotionData.emotionValue }}</div>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top: 20px; padding: 10px; text-align: center">
        {{ emotionData.summary }}
      </div>
      <chart :option="option7" class="flex-auto"></chart>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import BaseTable from '@/components/Base/BaseTable';
import Search from '@/components/Search/Search';
import moment from 'moment';
import chartsBase from '@/components/Echarts/ChartsBase';
var valdata = [];
var myColor = [
  '#1089E7',
  '#F57474',
  '#56D0E3',
  'rgb(223,126,82)',
  'rgb(205,205,65)',
  'rgb(1,207,161)',
  'rgb(255,180,0)',
  'rgb(51,146,251)'
];
const labelRight = {
  position: 'right'
};

function transformFontSize(px) {
  let clientWidth = window.innerWidth || document.body.clientWidth;
  if (!clientWidth) {
    return 0;
  }
  let fontSize = clientWidth / 1920;
  return px * fontSize;
}
export default {
  components: {
    chart,
    Search,
    BaseTable
  },
  mixins: [chartsBase],
  data() {
    return {
      loading: false,
      userId: '',
      info: null,
      // 搜索参数
      params: {
        startTime: '', //
        endTime: '', //
        range: []
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '时间选择',
          compType: 'daterange',
          width: 160,
          placeholder: '时间选择',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          prop: 'range',
          clearable: true
        }
      ],
      option1: {
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const indicator = this.option1.radar.indicator;
            let html = ``;
            for (let i = 0; i < indicator.length; i++) {
              html += `${indicator[i].name}: ${params.value[i]}%<br/>`;
            }

            return html;
          }
        },
        radar: {
          indicator: [],
          axisLine: {
            show: false
          },
          splitArea: {
            areaStyle: {
              color: 'none'
            }
          }
        },
        series: [
          {
            type: 'radar',
            name: '认知能力',
            data: [
              {
                value: []
              }
            ],
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: 'none'
                }
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#51ffd0'
                  },
                  {
                    offset: 1,
                    color: '#51c4ff'
                  }
                ],
                global: false
              }
            }
          }
        ]
      },
      labelListA: [
        { label: '指标名称', prop: 'indicatorName' },
        { label: '测量值', prop: 'measuredValue' },
        { label: '参考范围', prop: 'referenceRange' }
      ],
      listA: [],
      labelListB: [
        { label: '指标名称', prop: 'indicatorName' },
        { label: '测量值', prop: 'measuredValue' },
        { label: '参考范围', prop: 'referenceRange' }
      ],
      listB: [],
      labelListC: [
        { label: '指标名称', prop: 'indicatorName' },
        { label: '测量值', prop: 'measuredValue' },
        { label: '参考范围', prop: 'referenceRange' }
      ],
      listC: [],
      option4: {
        grid: {
          top: '10%',
          left: '22%',
          bottom: '10%'
        },
        xAxis: {
          show: false
        },
        yAxis: [
          {
            show: true,
            data: [],
            inverse: true,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold',
              padding: [0, 0, 0, 0],
              rich: {
                lg: {
                  backgroundColor: '#339911',
                  color: '#fff',
                  borderRadius: 15,
                  align: 'center',
                  width: 15,
                  height: 15
                }
              }
            }
          },
          {
            show: false,
            inverse: true,
            data: valdata,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            data: [],
            barCategoryGap: 50,
            barWidth: 17,
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                color: function (params) {
                  var num = myColor.length;
                  return myColor[params.dataIndex % num];
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'inside',
                padding: [3, 0, 0, 30],
                formatter: '{c}%',
                fontSize: 13
              }
            }
          },
          {
            name: '框',
            type: 'bar',
            yAxisIndex: 1,
            barCategoryGap: 50,
            data: [],
            barWidth: 20,
            itemStyle: {
              normal: {
                color: 'none',
                borderColor: '#00c1de',
                borderWidth: 3,
                barBorderRadius: 15
              }
            }
          }
        ]
      },
      emotionData: {
        summary:
          '情绪指数表示情绪的状态。当数值为负时代表处于负性情绪，显示出个体缺乏情绪灵活性、可能有情绪调节障碍，常\n常伴随着焦虑、抑郁等状态。数值为正则代表处于正性情绪，情绪反应灵活，有更强的情绪调节能力，更能够应对不\n良情绪，生理和心理更健康。',
        emotionList: [
          {
            label: '25-07-11',
            value: '0.07'
          }
        ],
        emotionValue: 0.07,
        emotionIndex: '正性'
      },
      option6: {
        color: [
          '#30e834',
          '#dde830',
          '#30a6e8',
          '#304ae8',
          '#9430e8',
          '#30e8b6',
          '#e8304e',
          '#e830c3'
        ],
        tooltip: {
          show: true
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '10%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: 'none',
          splitLine: 'none',
          axisTick: 'none',
          splitArea: 'none',
          axisLabel: 'none'
        },
        yAxis: {
          type: 'value',
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          },
          axisLabel: {
            textStyle: {
              color: 'rgba(255,255,255,.6)',
              fontSize: transformFontSize(12)
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          }
        },
        series: []
      },
      option7: {
        dataZoom: this.getXDataZoom(5, 10),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 50,
          right: 30,
          top: 50,
          bottom: 30
        },
        yAxis: {
          type: 'value',
          position: 'bottom',
          axisLabel: {
            color: '#fff', // 红色文字
            // 其他样式（可选）
            fontSize: 14
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        xAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: {
            show: true,
            fontSize: 14,
            color: '#fff',
            formatter: function (value) {
              return value;
            }
          },
          axisTick: { show: false },
          splitLine: { show: false },
          data: []
        },
        series: [
          {
            name: '情绪',
            type: 'bar',
            stack: 'Total',
            label: {
              show: false,
              formatter: '{b}'
            },
            barWidth: 14,
            itemStyle: {
              color: function (params) {
                // Different colors for positive and negative values
                return params.value >= 0 ? '#5470C6' : '#EE6666';
              }
            },
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    const query = this.$route.query;
    const userId = query.userId;
    this.userId = userId;
    this.getAnalysis({
      userId
    });
  },
  methods: {
    reset() {
      this.params = {
        startTime: '', //
        endTime: '', //
        range: []
      };
      this.handleSearch();
    },
    handleSearch() {
      var params = {
        startTime: '',
        endTime: '',
        userId: this.userId
      };
      if (this.params.range && this.params.range.length == 2) {
        params.startTime = moment(this.params.range[0]).format('YYYY-MM-DD');
        params.endTime = moment(this.params.range[1]).format('YYYY-MM-DD');
      }

      this.getAnalysis(params);
    },
    toThinkingAbility(val) {
      this.$router.push({
        path: '/person/thinkingAbility'
      });
    },
    getAnalysis(params) {
      this.loading = true;
      this.$api.analysis
        .basicMind(params)
        .then((res) => {
          this.info = res.result;
          const { cognitiveAbility, brainDataList } = res.result;
          this.initRznl(cognitiveAbility);
          this.initZtfx(cognitiveAbility);
          // 脑健康状态
          const brainHealths = brainDataList.brainHealths;
          this.listA = brainHealths;
          // 大脑调节能力
          const brainRegulations = brainDataList.brainRegulations;
          this.listB = brainRegulations;
          // 大脑基础节律 brainRhythms
          const brainRhythms = brainDataList.brainRhythms;
          this.listC = brainRhythms;
          // 情绪指数

          const emotionData = res.result.emotionData;
          this.emotionData = emotionData;
          this.option7.xAxis.data = emotionData.emotionList.map((v) => v.label);
          this.option7.series[0].data = emotionData.emotionList.map((v) =>
            Number(v.value)
          );
          //             emotionData: {
          //     summary:
          //       '情绪指数表示情绪的状态。当数值为负时代表处于负性情绪，显示出个体缺乏情绪灵活性、可能有情绪调节障碍，常\n常伴随着焦虑、抑郁等状态。数值为正则代表处于正性情绪，情绪反应灵活，有更强的情绪调节能力，更能够应对不\n良情绪，生理和心理更健康。',
          //     emotionList: [
          //       {
          //         label: '25-07-11',
          //         value: '0.07'
          //       }
          //     ],
          //     emotionValue: 0.07,
          //     emotionIndex: '正性'
          //   },
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //认知能力
    initRznl(data) {
      var max = 100;
      this.option1.radar.indicator = data.map((v) => {
        return {
          name: v.label,
          max: max
        };
      });
      const values = data.map((v) => parseInt(v.value));
      console.log(values, 'sss');
      this.option1.series[0].data[0].value = data.map((v) => parseInt(v.value));
    },
    // 总体分析
    initZtfx(data) {
      this.option4.yAxis[0].data = data.map((v) => v.label);
      this.option4.series[0].data = data.map((v) => parseInt(v.value));
      this.option4.series[1].data = data.map((v) => 100);
    },
    // 控制能力
    initKznl(data) {
      const list = data.map((v) => {
        return {
          name: v.name,
          symbolSize: 14,
          data: [JSON.parse(v.value)],
          type: 'scatter',
          label: {
            show: false, // 显示标签
            color: '#fff',
            position: 'top' // 标签位置
          }
        };
      });
      this.option6.series = list;
    }
  }
};
</script>

<style lang="scss" scoped>
.jcnl {
  position: relative;
  padding: 35px 20px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  .box-item {
    width: calc((100% - 40px) / 3);
    height: calc((100% - 20px) / 2);
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(41, 130, 103, 0.1);
  }
  .back-button {
    position: absolute;
    display: block;
    object-fit: contain;
    height: 40px !important;
    top: -5px;
    left: 15px;
    cursor: pointer;
  }
  .search {
    position: absolute;
    top: 0px;
    left: 70px;
  }
}
</style>
