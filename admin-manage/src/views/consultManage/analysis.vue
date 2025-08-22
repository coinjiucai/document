<template>
  <div class="consult-analysis">
    <div class="search">
      <Search
        :params="params"
        :fieldsConfig="fieldsConfig"
        @handleSearch="handleSearch"
        @reset="reset"
      ></Search>
    </div>
    <div class="analysis-c">
      <div class="box-1">
        <div>
          <div class="icon">
            <img src="@/assets/images/sjtj/2.png" />
          </div>
          <div>
            <div class="text-1">咨询总数(个)</div>
            <div class="text-2">{{ info.totalCount }}</div>
          </div>
        </div>
        <div>
          <div class="icon">
            <img src="@/assets/images/sjtj/3.png" />
          </div>
          <div>
            <div class="text-1">咨询人次(平均)</div>
            <div class="text-2">
              {{ info.avgCount }}<span>次</span>/1<span>人</span>
            </div>
          </div>
        </div>
        <div>
          <div class="icon">
            <img src="@/assets/images/sjtj/4.png" />
          </div>
          <div>
            <div class="text-1">结案人数(个)</div>
            <div style="display: flex">
              <div class="text-2">{{ info.closedCount }}</div>
              <div class="text-2" style="margin-left: 20px">
                {{ info.closedPre }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="icon">
            <img src="@/assets/images/sjtj/5.png" />
          </div>
          <div>
            <div class="text-1">就医服药(个)</div>
            <div style="display: flex">
              <div class="text-2">{{ info.medicationCount }}</div>
              <div class="text-2" style="margin-left: 20px">
                {{ info.medicationPre }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-2">
        <el-row style="height: 100%" :gutter="20">
          <el-col class="chart-card" style="height: 100%" :span="8"
            ><chart class="chart" :option="option1"></chart>
            <div class="title">预约统计</div>
          </el-col>
          <el-col class="chart-card" style="height: 100%" :span="8">
            <chart class="chart" :option="option2"></chart>
            <div class="title">问题类型来访统计</div></el-col
          >
          <el-col class="chart-card" style="height: 100%" :span="8"
            ><chart class="chart" :option="option3"></chart>
            <div class="title">咨询统计</div></el-col
          >
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search/Search';
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
import 'echarts-gl'; // 引入 echarts-gl
import moment from 'moment';
const getUniqueContrastingColor = () => {
  const usedColors = new Set();
  return () => {
    let color;
    do {
      color = getRandomContrastingColor();
      if (usedColors.size >= 12) usedColors.clear(); // 重置如果用完所有颜色
    } while (usedColors.has(color));
    usedColors.add(color);
    return color;
  };
};
const colorPalette = [
  'rgba(37,155,165,0.8)',
  '#0C3065',
  '#8ECFF2',
  '#F6BA4E',
  '#EF7D32'
];
export default {
  components: {
    Search,
    chart
  },
  mixins: [chartsBase],
  data() {
    return {
      info: {
        totalCount: 0,
        avgCount: 0,
        closedCount: 0,
        closedPre: '0%',
        medicationCount: 0,
        medicationPre: '0%'
      },
      // 搜索参数
      params: {
        queryStartTime: '', //
        queryEndTime: '', //
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
        dataZoom: this.getXDataZoom(10, 10),
        title: {
          text: '',
          subtext: '',
          //   left: "right",
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        legend: {
          data: ['预约人数统计'],
          right: 20,
          top: 70,
          itemWidth: 20, // 设置图例项的宽度
          itemHeight: 8, // 设置图例项的高度
          textStyle: {
            color: '#1F7EEA', // 设置文字颜色为红色
            fontSize: 12 // 可选：设置文字大小
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#dddc6b'
            }
          }
        },
        grid: {
          left: 10,
          top: 90,
          right: 30,
          bottom: 20,
          containLabel: true
        },

        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: 'white',
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.2)'
              }
            },

            data: []
          },
          {
            axisPointer: { show: false },
            axisLine: { show: false },
            position: 'bottom',
            offset: 20
          }
        ],

        yAxis: [
          {
            type: 'value',
            axisTick: { show: false },
            splitNumber: 4,
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },

            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)',
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '预约人数统计',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                color: '#04cdf4',
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0, 75, 187, 0.9)'
                    },
                    {
                      offset: 0.6,
                      color: 'rgba(0, 75, 187,0.7)'
                    },
                    {
                      offset: 0.9,
                      color: 'rgba(0,75,187,0.05)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              }
            },
            itemStyle: {
              normal: {
                color: '#1f7eea',
                borderColor: 'rgba(31, 174, 234, .1)',
                borderWidth: 5
              }
            },
            data: []
          }
        ]
      },
      option2: {
        color: [],
        tooltip: {
          show: true
        },
        series: [
          {
            name: '',
            type: 'pie',
            clockWise: false,
            radius: [110, 90],
            center: ['50%', '55%'], //
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,

                  color: '#aaccee',
                  formatter: function (params) {
                    if (params.name !== '') {
                      return (
                        params.name +
                        ' ' +
                        params.value +
                        '人' +
                        ' ' +
                        params.percent +
                        '%'
                      );
                    } else {
                      return '';
                    }
                  }
                },
                labelLine: {
                  length: 50,
                  length2: 35,
                  show: true,
                  color: '#00ffff',
                  smooth: true // 启用平滑曲线
                }
              }
            },
            data: []
          }
        ]
      },
      option3: {
        dataZoom: this.getXDataZoom(10, 10),
        title: {
          text: '',
          subtext: '',
          //   left: "right",
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        legend: {
          data: ['咨询人数统计'],
          right: 20,
          top: 70,
          itemWidth: 20, // 设置图例项的宽度
          itemHeight: 8, // 设置图例项的高度
          textStyle: {
            color: 'rgba(228,144,77,0.9)', // 设置文字颜色为红色
            fontSize: 12 // 可选：设置文字大小
          },
          itemStyle: {
            color: 'rgba(228,144,77,0.9)' // 设置图例项的颜色为绿色
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 10,
          top: 90,
          right: 30,
          bottom: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: 'white',
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.2)'
              }
            },

            data: []
          },
          {
            axisPointer: { show: false },
            axisLine: { show: false },
            position: 'bottom',
            offset: 20
          }
        ],

        yAxis: [
          {
            type: 'value',
            axisTick: { show: false },
            splitNumber: 4,
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },

            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)',
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '咨询人数统计',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                color: '#D99D09',
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(228,144,77,0.9)'
                    },
                    {
                      offset: 0.6,
                      color: 'rgba(228,144,77,0.7)'
                    },
                    {
                      offset: 0.9,
                      color: 'rgba(0,75,187,0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(228,144,77,0.9)',
                borderColor: 'rgba(228,144,77,0.9)',
                borderWidth: 5
              }
            },
            data: []
          }
        ]
      },
      optionData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    reset() {
      this.params = {
        queryStartTime: '', //
        queryEndTime: '', //
        range: []
      };
      this.getData();
    },
    handleSearch() {
      this.getData();
    },
    getData() {
      const range = this.params.range;
      const param = {
        startTime: '',
        endTime: ''
      };
      if (range && range.length > 0) {
        param.startTime = moment(range[0]).format('YYYY-MM-DD');
        param.endTime = moment(range[1]).format('YYYY-MM-DD');
      }
      this.$api.analysis.zyglStatistics(param).then((res) => {
        this.info = res.result;
        this.initYytj(res.result.appointmentList);
        this.initZxtj(res.result.consultationList);
        this.initWtlx(res.result.questionList);
      });
    },
    // 预约统计
    initYytj(list) {
      this.option1.xAxis[0].data = list.map((v) =>
        moment(v.label).format('MM-DD')
      );
      this.option1.series[0].data = list.map((v) => v.value);
    },
    // 咨询统计
    initZxtj(list) {
      this.option3.xAxis[0].data = list.map((v) =>
        moment(v.label).format('MM-DD')
      );
      this.option3.series[0].data = list.map((v) => v.value);
    },
    // 问题类型来访统计
    initWtlx(list) {
      const colors = [
        '#259BA5',
        '#0C3065',
        '#8ECFF2',
        '#F6BA4E',
        '#EF7D32', // 原有颜色
        '#2E8B57',
        '#4682B4',
        '#9370DB',
        '#FF6347',
        '#FFD700', // 新增颜色
        '#4B0082',
        '#32CD32',
        '#00CED1',
        '#FF69B4',
        '#8A2BE2',
        '#A52A2A',
        '#DEB887',
        '#5F9EA0',
        '#7FFF00',
        '#D2691E',
        '#6495ED',
        '#DC143C',
        '#00FFFF',
        '#00008B',
        '#008B8B',
        '#B8860B',
        '#006400',
        '#8B008B',
        '#556B2F',
        '#FF8C00',
        '#9932CC',
        '#8B0000',
        '#E9967A',
        '#8FBC8F',
        '#483D8B',
        '#2F4F4F',
        '#00FA9A',
        '#9400D3',
        '#FF00FF',
        '#1E90FF',
        '#B22222',
        '#228B22',
        '#FF1493',
        '#20B2AA',
        '#FF7F50'
      ];

      var trafficWay = list.map((v) => {
        return {
          name: v.label,
          value: v.value
        };
      });

      var data = [];
      var color = [
        '#259BA5',
        '#0C3065',
        '#8ECFF2',
        '#F6BA4E',
        '#EF7D32', // 原有颜色
        '#2E8B57',
        '#4682B4',
        '#9370DB',
        '#FF6347',
        '#FFD700', // 新增颜色
        '#4B0082',
        '#32CD32',
        '#00CED1',
        '#FF69B4',
        '#8A2BE2',
        '#A52A2A',
        '#DEB887',
        '#5F9EA0',
        '#7FFF00',
        '#D2691E',
        '#6495ED',
        '#DC143C',
        '#00FFFF',
        '#00008B',
        '#008B8B',
        '#B8860B',
        '#006400',
        '#8B008B',
        '#556B2F',
        '#FF8C00',
        '#9932CC',
        '#8B0000',
        '#E9967A',
        '#8FBC8F',
        '#483D8B',
        '#2F4F4F',
        '#00FA9A',
        '#9400D3',
        '#FF00FF',
        '#1E90FF',
        '#B22222',
        '#228B22',
        '#FF1493',
        '#20B2AA',
        '#FF7F50'
      ];
      for (var i = 0; i < trafficWay.length; i++) {
        data.push({
          value: trafficWay[i].value,
          name: trafficWay[i].name,
          itemStyle: {
            normal: {
              borderWidth: 5,
              shadowBlur: 20,
              borderColor: color[i],
              shadowColor: color[i]
            }
          }
        });
      }

      this.option2.color = color;
      this.option2.series[0].data = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.consult-analysis {
  display: flex;
  flex-direction: column;
  padding: 0px 30px;
  height: 100%;
  .search {
    padding: 10px 0 16px;
  }
  .analysis-c {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    .box-1 {
      width: 100%;
      height: 181px;
      display: flex;
      align-items: center;
      background-color: rgba(41, 130, 103, 0.1);
      > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          background-size: auto 100%;
          width: 80px;
          height: 70px;
          background-image: url('~@/assets/images/sjtj/nav.png');
          background-repeat: no-repeat;
          img {
            width: 59px;
            margin-top: 10px;
            margin-left: 0px;
          }
        }
        .text-1 {
          font-size: 18px;
          color: #aaccee;
        }
        .text-2 {
          font-weight: bold;
          font-size: 32px;
          text-shadow: 0px 0px 13px #48a2ed;
          font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
          span {
            font-size: 16px;
          }
        }
      }
    }
    .box-2 {
      flex: 1;
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
  .chart-card {
    position: relative;
    > div {
    }
    .chart {
      width: 100%;
      height: 100%;
      background-color: rgba(41, 130, 103, 0.1);
    }
    .title {
      position: absolute;
      top: 15px;
      left: 30px;
      width: 200px;
      height: 30px;
      background-image: url('~@/assets/images/title-bg.png');
      background-repeat: no-repeat;
      background-position: left top;
      background-size: cover;
      padding-left: 25px;
      font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
      font-size: 20px;
    }
  }

  .water-eval-container {
    width: 100%;
    height: 100%;
  }
  .cityGreenLand-charts {
    height: 100%;
    width: 100%;
  }
}
</style>
