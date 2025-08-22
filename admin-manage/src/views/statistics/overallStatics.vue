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
      <div class="box-2">
        <el-row style="height: 100%" :gutter="20">
          <el-col class="chart-card" style="height: 100%" :span="8"
            ><div
              class="chart cityGreenLand-charts"
              id="cityGreenLand-charts"
            ></div>
            <div class="title">心理资源数</div>
          </el-col>
          <el-col class="chart-card" style="height: 100%" :span="8">
            <div class="chart" style="box-sizing: border-box">
              <div style="width: 100%; height: 65%">
                <chart :option="option2"></chart>
              </div>
              <div class="yjlevel" style="height: 35%">
                <div class="item">
                  <div class="text">一级预警</div>
                  <div class="content">
                    <div class="bar-box">
                      <div
                        class="bar bar1"
                        :style="{ width: `${warnList.one.precent}%` }"
                      >
                        <div class="dot"></div>
                      </div>
                    </div>
                  </div>
                  <div class="precent">{{ warnList.one.precent }}%</div>
                </div>
                <div class="item">
                  <div class="text">二级预警</div>
                  <div class="content">
                    <div class="bar-box">
                      <div
                        class="bar bar2"
                        :style="{ width: `${warnList.two.precent}%` }"
                      >
                        <div class="dot"></div>
                      </div>
                    </div>
                  </div>
                  <div class="precent">{{ warnList.two.precent }}%</div>
                </div>
                <div class="item">
                  <div class="text">三级预警</div>
                  <div class="content">
                    <div class="bar-box">
                      <div
                        class="bar bar3"
                        :style="{ width: `${warnList.three.precent}%` }"
                      >
                        <div class="dot"></div>
                      </div>
                    </div>
                  </div>
                  <div class="precent">{{ warnList.three.precent }}%</div>
                </div>
              </div>
            </div>
            <div class="title">心理预警数据</div>
          </el-col>

          <el-col class="chart-card" style="height: 100%" :span="8"
            ><chart
              class="chart"
              :option="option3"
              style="padding-top: 30px"
            ></chart>
            <div class="title">认知能力数据</div></el-col
          >
        </el-row>
      </div>
      <div class="box-2">
        <el-row style="height: 100%" :gutter="20">
          <el-col class="chart-card" style="height: 100%" :span="8"
            ><chart
              class="chart"
              :option="option4"
              style="padding-top: 30px"
            ></chart>
            <div class="title">场景应激数据</div></el-col
          >
          <el-col
            class="chart-card chart-card-2"
            style="height: 100%"
            :span="16"
            ><chart class="chart" :option="option6"></chart>
            <div class="title">心理健康数据</div></el-col
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
var img =
  'data:image/png;base64,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';
export default {
  components: {
    Search,
    chart
  },
  mixins: [chartsBase],
  data() {
    return {
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
      optionData: [],
      warnList: {
        one: {
          value: 0,
          precent: 0
        },
        two: {
          value: 0,
          precent: 0
        },
        three: {
          value: 0,
          precent: 0
        }
      },
      option2: {
        color: [
          '#00ffff',
          '#ffe000',
          '#ffa800',
          '#ff5b00',
          '#ff3000',
          '#00cfff',
          '#006ced'
        ],
        graphic: {
          elements: [
            {
              type: 'image',
              z: 3,
              style: {
                image: img,
                width: 65,
                height: 65
              },
              left: 'center',
              top: '53%',
              position: [65, 65]
            }
          ]
        },
        tooltip: {
          show: false
        },
        series: [
          {
            name: '',
            type: 'pie',
            clockWise: false,
            radius: [45, 49],
            center: ['50%', '68%'], //
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'outside',
                  color: '#fff',
                  formatter: function (params) {
                    if (params.name !== '') {
                      return (
                        params.name +
                        ' ' +
                        params.value +
                        '人' +
                        '\n' +
                        '\n' +
                        '' +
                        params.percent +
                        '%'
                      );
                    } else {
                      return '';
                    }
                  }
                },
                labelLine: {
                  length: 10,
                  length2: 25,
                  show: true,
                  color: '#00ffff'
                }
              }
            },
            data: []
          }
        ]
      },
      yjsj: {
        一级预警: '0%',
        二级预警: '0%',
        三级预警: '0%'
      },
      option3: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          top: '28',
          right: 10,
          data: [],
          itemWidth: 16,
          itemHeight: 4,
          icon: 'rect',
          textStyle: {
            itemGap: 12, // 图例每项之间的间隔
            color: '#fff', // 设置文本颜色
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 14
          },
          // 使用 rich text 来实现圆角效果
          rich: {
            a: {
              backgroundColor: '#0035f9', // 背景颜色
              borderRadius: 5, // 圆角大小
              padding: [4, 8], // 内边距
              color: '#fff' // 字体颜色
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          axisLabel: {
            show: false,
            //调整x轴的lable
            textStyle: {
              color: '#fff',
              fontSize: 13
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false // 去除 x 轴线
          },
          axisTick: {
            show: false // 去除 x 轴刻度
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisTick: { show: true },
          axisLabel: {
            //调整x轴的lable
            textStyle: {
              color: '#fff',
              fontSize: 13
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false // 去除 y 轴线
          },
          axisTick: {
            show: false // 去除 y 轴刻度
          }
        },
        series: [
          {
            name: '初级',
            type: 'bar',
            stack: '总量',
            barWidth: 13,
            itemStyle: {
              // 使用线性渐变
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#00A866' }, // 渐变起始颜色
                  { offset: 1, color: '#04E5CA' } // 渐变结束颜色
                ]
              },
              borderRadius: [0, 10, 10, 0] // 圆角设置
            },
            data: []
          },
          {
            name: '中级',
            type: 'bar',
            stack: '总量',
            barWidth: 13,
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            itemStyle: {
              // 使用线性渐变
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#E9C22D' }, // 渐变起始颜色
                  { offset: 1, color: '#FFEE89' } // 渐变结束颜色
                ]
              },
              borderRadius: [0, 10, 10, 0] // 圆角设置
            },
            data: []
          },
          {
            name: '高级',
            type: 'bar',
            stack: '总量',
            color: '#efe39b',
            barWidth: 13,
            itemStyle: {
              // 使用线性渐变
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#1054AF' }, // 渐变起始颜色
                  { offset: 1, color: '#79C0E7' } // 渐变结束颜色
                ]
              },
              borderRadius: [0, 10, 10, 0] // 圆角设置
            },
            data: []
          }
        ]
      },
      option4: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          top: '28',
          right: 10,
          data: [],
          itemWidth: 16,
          itemHeight: 4,
          icon: 'rect',
          textStyle: {
            itemGap: 12, // 图例每项之间的间隔
            color: '#fff', // 设置文本颜色
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 14
          },
          // 使用 rich text 来实现圆角效果
          rich: {
            a: {
              backgroundColor: '#0035f9', // 背景颜色
              borderRadius: 5, // 圆角大小
              padding: [4, 8], // 内边距
              color: '#fff' // 字体颜色
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          axisLabel: {
            show: false,
            //调整x轴的lable
            textStyle: {
              color: '#fff',
              fontSize: 13
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false // 去除 x 轴线
          },
          axisTick: {
            show: false // 去除 x 轴刻度
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisTick: { show: true },
          axisLabel: {
            //调整x轴的lable
            textStyle: {
              color: '#fff',
              fontSize: 13
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false // 去除 y 轴线
          },
          axisTick: {
            show: false // 去除 y 轴刻度
          }
        },
        series: [
          {
            name: '初级',
            type: 'bar',
            stack: '总量',
            barWidth: 13,
            itemStyle: {
              // 使用线性渐变
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#00A866' }, // 渐变起始颜色
                  { offset: 1, color: '#04E5CA' } // 渐变结束颜色
                ]
              },
              borderRadius: [0, 10, 10, 0] // 圆角设置
            },
            data: []
          },
          {
            name: '中级',
            type: 'bar',
            stack: '总量',
            barWidth: 13,
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            itemStyle: {
              // 使用线性渐变
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#E9C22D' }, // 渐变起始颜色
                  { offset: 1, color: '#FFEE89' } // 渐变结束颜色
                ]
              },
              borderRadius: [0, 10, 10, 0] // 圆角设置
            },
            data: []
          },
          {
            name: '高级',
            type: 'bar',
            stack: '总量',
            color: '#efe39b',
            barWidth: 13,
            itemStyle: {
              // 使用线性渐变
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#1054AF' }, // 渐变起始颜色
                  { offset: 1, color: '#79C0E7' } // 渐变结束颜色
                ]
              },
              borderRadius: [0, 10, 10, 0] // 圆角设置
            },
            data: []
          }
        ]
      },
      option6: {
        dataZoom: this.getXDataZoom(12, 10),
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            return (
              `${params[0].name}<br/>` +
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#3b92d3"></span>` +
              `${params[0].value}次`
            );
          }
        },
        grid: {
          top: 90,
          right: 30,
          bottom: 40,
          left: 60
        },
        legend: {
          show: false,
          data: [],
          right: 20,
          top: 50,
          width: '100%',
          textStyle: {
            color: '#fff'
          },
          itemStyle: {
            borderColor: '#000', // 边框颜色
            borderWidth: 1, // 边框宽度
            borderType: 'solid' // 边框类型
          },
          itemWidth: 20, // 设置图例项的宽度
          itemHeight: 10 // 设置图例项的高度
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLine: {
              lineStyle: { color: 'rgba(255,255,255,.1)' }
            },
            axisLabel: {
              interval: 0,
              textStyle: { color: 'rgba(255,255,255,.7)', fontSize: '12' }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed', // 设置为虚线
                color: '#000' // 设置颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisTick: { show: false },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              fontSize: 14,
              color: 'rgba(255,255,255,.6)'
            },
            axisLine: {
              min: 0,
              max: 10,
              lineStyle: { color: 'rgba(255,255,255,.1)' }
            } //左线色
          },
          {
            type: 'value',
            name: '',
            show: false,
            axisLabel: {
              show: true,
              fontSize: 14,
              formatter: '',
              color: 'rgba(255,255,255,.6)'
            },
            axisTick: { show: false },
            axisLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } }, //右线色
            splitLine: {
              show: true,
              lineStyle: { color: 'rgba(255,255,255,.1)' }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: '12',
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#3b92d3'
                  },
                  {
                    offset: 1,
                    color: '#3b92d3'
                  }
                ])
              }
            },
            barGap: '0.2'
          }
        ]
      }
    };
  },
  mounted() {
    this.getChartData();
  },
  methods: {
    reset() {
      this.params = {
        queryStartTime: '', //
        queryEndTime: '', //
        range: []
      };
      this.handleSearch();
    },
    handleSearch() {
      var params = {
        startTime: '',
        endTime: ''
      };
      if (this.params.range && this.params.range.length == 2) {
        params.startTime = moment(this.params.range[0]).format('YYYY-MM-DD');
        params.endTime = moment(this.params.range[1]).format('YYYY-MM-DD');
      }
    },
    init() {
      //构建3d饼状图
      let myChart = new this.$echarts.init(
        document.getElementById('cityGreenLand-charts')
      );
      // 传入数据生成 option
      this.option = this.getPie3D(this.optionData, 0.8);
      myChart.setOption(this.option);
      //是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
      this.option.series.push({
        name: 'pie2d',
        type: 'pie',
        labelLine: {
          length: 10,
          length2: 10
        },

        startAngle: -28, //
        clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['20%', '50%'],
        center: ['50%', '50%'],
        data: this.optionData,
        itemStyle: {
          opacity: 0
        }
      });
      myChart.setOption(this.option);
      this.bindListen(myChart);
    },
    getPie3D(pieData, internalDiameterRatio) {
      //internalDiameterRatio:透明的空心占比
      let that = this;
      let series = [];
      let sumValue = 0;
      let startValue = 0;
      let endValue = 0;
      let legendData = [];
      let legendBfb = [];
      let k = 1 - internalDiameterRatio;
      pieData.sort((a, b) => {
        return b.value - a.value;
      });
      // 为每一个饼图数据，生成一个 series-surface 配置
      for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;
        let seriesItem = {
          name:
            typeof pieData[i].name === 'undefined'
              ? `series${i}`
              : pieData[i].name,
          type: 'surface',
          parametric: true,
          wireframe: {
            show: false
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k: k
          },
          center: ['50%', '50%']
        };

        if (typeof pieData[i].itemStyle != 'undefined') {
          let itemStyle = {};
          typeof pieData[i].itemStyle.color != 'undefined'
            ? (itemStyle.color = pieData[i].itemStyle.color)
            : null;
          typeof pieData[i].itemStyle.opacity != 'undefined'
            ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
            : null;
          seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
      }

      // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      legendData = [];
      legendBfb = [];
      for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value;
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = this.getParametricEquation(
          series[i].pieData.startRatio,
          series[i].pieData.endRatio,
          false,
          false,
          k,
          series[i].pieData.value
        );
        startValue = endValue;
        let bfb = that.fomatFloat(series[i].pieData.value / sumValue, 4);
        legendData.push({
          name: series[i].name,
          value: bfb
        });
        legendBfb.push({
          name: series[i].name,
          value: bfb
        });
      }
      let boxHeight = this.getHeight3D(series, 26); //通过传参设定3d饼/环的高度，26代表26px
      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      let option = {
        labelLine: {
          show: true,
          lineStyle: {
            color: '#7BC0CB'
          }
        },
        label: {
          show: true,
          position: 'outside',
          rich: {
            b: {
              color: '#aaccee',
              fontSize: 12,
              lineHeight: 20
            },
            c: {
              fontSize: 12,
              color: '#aaccee'
            }
          },
          formatter: '{b|{b} }{c|{c}}{b|}'
        },
        tooltip: {
          formatter: (params) => {
            if (
              params.seriesName !== 'mouseoutSeries' &&
              params.seriesName !== 'pie2d'
            ) {
              let bfb = (
                (option.series[params.seriesIndex].pieData.endRatio -
                  option.series[params.seriesIndex].pieData.startRatio) *
                100
              ).toFixed(2);
              return (
                `${params.seriesName}<br/>` +
                `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                `${bfb}%`
              );
            }
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          show: false,
          boxHeight: boxHeight, //圆环的高度
          viewControl: {
            //3d效果可以放大、旋转等，请自己去查看官方配置
            alpha: 40, //角度
            distance: 240, //调整视角到主体的距离，类似调整zoom
            rotateSensitivity: 0, //设置为0无法旋转
            zoomSensitivity: 0, //设置为0无法缩放
            panSensitivity: 0, //设置为0无法平移
            autoRotate: false //自动旋转
          }
        },
        series: series
      };
      return option;
    },
    //获取3d丙图的最高扇区的高度
    getHeight3D(series, height) {
      series.sort((a, b) => {
        return b.pieData.value - a.pieData.value;
      });
      return (height * 25) / series[0].pieData.value;
    },
    // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
    getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
      // 计算
      let midRatio = (startRatio + endRatio) / 2;
      let startRadian = startRatio * Math.PI * 2;
      let endRadian = endRatio * Math.PI * 2;
      let midRadian = midRatio * Math.PI * 2;
      // 如果只有一个扇形，则不实现选中效果。
      if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
      }
      // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
      k = typeof k !== 'undefined' ? k : 1 / 3;
      // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
      let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
      let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
      // 计算高亮效果的放大比例（未高亮，则比例为 1）
      let hoverRate = isHovered ? 1.05 : 1;
      // 返回曲面参数方程
      return {
        u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32
        },
        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20
        },
        x: function (u, v) {
          if (u < startRadian) {
            return (
              offsetX +
              Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          if (u > endRadian) {
            return (
              offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        y: function (u, v) {
          if (u < startRadian) {
            return (
              offsetY +
              Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          if (u > endRadian) {
            return (
              offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },
        z: function (u, v) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u);
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u) * h * 0.1;
          }
          return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
        }
      };
    },
    fomatFloat(num, n) {
      var f = parseFloat(num);
      if (isNaN(f)) {
        return false;
      }
      f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
      var s = f.toString();
      var rs = s.indexOf('.');
      //判定如果是整数，增加小数点再补0
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + n) {
        s += '0';
      }
      return s;
    },

    bindListen(myChart) {
      // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
      let that = this;
      let selectedIndex = '';
      let hoveredIndex = '';
      // 监听点击事件，实现选中效果（单选）
      myChart.on('click', function (params) {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
        let isSelected =
          !that.option.series[params.seriesIndex].pieStatus.selected;
        let isHovered =
          that.option.series[params.seriesIndex].pieStatus.hovered;
        let k = that.option.series[params.seriesIndex].pieStatus.k;
        let startRatio =
          that.option.series[params.seriesIndex].pieData.startRatio;
        let endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
        // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
        if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
          that.option.series[selectedIndex].parametricEquation =
            that.getParametricEquation(
              that.option.series[selectedIndex].pieData.startRatio,
              that.option.series[selectedIndex].pieData.endRatio,
              false,
              false,
              k,
              that.option.series[selectedIndex].pieData.value
            );
          that.option.series[selectedIndex].pieStatus.selected = false;
        }
        // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
        that.option.series[params.seriesIndex].parametricEquation =
          that.getParametricEquation(
            startRatio,
            endRatio,
            isSelected,
            isHovered,
            k,
            that.option.series[params.seriesIndex].pieData.value
          );
        that.option.series[params.seriesIndex].pieStatus.selected = isSelected;
        // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
        isSelected ? (selectedIndex = params.seriesIndex) : null;
        // 使用更新后的 option，渲染图表
        myChart.setOption(that.option);
      });
      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on('mouseover', function (params) {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          return;
          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
          if (hoveredIndex !== '') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = that.option.series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            startRatio = that.option.series[hoveredIndex].pieData.startRatio;
            endRatio = that.option.series[hoveredIndex].pieData.endRatio;
            k = that.option.series[hoveredIndex].pieStatus.k;
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            that.option.series[hoveredIndex].parametricEquation =
              that.getParametricEquation(
                startRatio,
                endRatio,
                isSelected,
                isHovered,
                k,
                that.option.series[hoveredIndex].pieData.value
              );
            that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = '';
          }
          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
          if (
            params.seriesName !== 'mouseoutSeries' &&
            params.seriesName !== 'pie2d'
          ) {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected =
              that.option.series[params.seriesIndex].pieStatus.selected;
            isHovered = true;
            startRatio =
              that.option.series[params.seriesIndex].pieData.startRatio;
            endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
            k = that.option.series[params.seriesIndex].pieStatus.k;
            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            that.option.series[params.seriesIndex].parametricEquation =
              that.getParametricEquation(
                startRatio,
                endRatio,
                isSelected,
                isHovered,
                k,
                that.option.series[params.seriesIndex].pieData.value + 5
              );
            that.option.series[params.seriesIndex].pieStatus.hovered =
              isHovered;
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex;
          }
          // 使用更新后的 option，渲染图表
          myChart.setOption(that.option);
        }
      });
      // 修正取消高亮失败的 bug
      myChart.on('globalout', function () {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        if (hoveredIndex !== '') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = that.option.series[hoveredIndex].pieStatus.selected;
          isHovered = false;
          k = that.option.series[hoveredIndex].pieStatus.k;
          startRatio = that.option.series[hoveredIndex].pieData.startRatio;
          endRatio = that.option.series[hoveredIndex].pieData.endRatio;
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          that.option.series[hoveredIndex].parametricEquation =
            that.getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              that.option.series[hoveredIndex].pieData.value
            );
          that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = '';
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(that.option);
      });
    },
    getChartData() {
      this.$api.analysis.overallsituation().then((res) => {
        const { resource, trainList, vrTrainList, warnList, riskList } =
          res.result;
        this.initXlzyshu(resource);
        this.initXlyjsj(res.result);
        this.initWarn(warnList);
        this.initRznlshuj(trainList);
        this.initCjyjsj(vrTrainList);
        this.initXljksj(riskList);
      });
    },
    // 心理资源数
    initXlzyshu(data) {
      const colors = [
        'rgba(37,155,165,0.8)',
        '#0C3065',
        '#8ECFF2',
        '#8ECFF2',
        '#EF7D32'
      ];
      const optionData = data.map((v, index) => {
        return {
          name: v.label,
          value: parseInt(v.value),
          itemStyle: {
            color: colors[index % colors.length]
          }
        };
      });
      this.optionData = optionData;
      this.init();
    },
    // 心理预警数据
    initXlyjsj(result) {
      var trafficWay = [
        {
          name: '正常',
          value: result.normalCount ? result.normalCount : 0
        },
        {
          name: '预警',
          value: result.warnCount ? result.warnCount : 0
        }
      ];

      var data = [];
      var color = [
        '#00ffff',
        '#ffe000',
        '#ffa800',
        '#ff5b00',
        '#ff3000',
        '#00cfff',
        '#006ced'
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
      if (result.warnNormalCount > 0 || result.warnCount > 0) {
        this.option2.series[0].data = data;
      }
    },
    initWarn(warnList) {
      const amount = warnList
        .map((v) => v.value)
        .reduce((a, b) => {
          return parseInt(a) + parseInt(b);
        });
      const one = warnList.find((v) => v.label == 1);
      this.warnList.one = {
        value: one.value,
        precent: ((one.value / amount) * 100).toFixed(1)
      };
      const two = warnList.find((v) => v.label == 2);
      this.warnList.two = {
        value: two.value,
        precent: ((two.value / amount) * 100).toFixed(1)
      };
      const three = warnList.find((v) => v.label == 3);
      this.warnList.three = {
        value: three.value,
        precent: ((three.value / amount) * 100).toFixed(1)
      };
    },
    // 认知能力数据
    initRznlshuj(data) {
      //   const types = data.map((v) => v.name);
      const types = Object.keys(data);
      console.log(types, 'vvv');
      this.option3.legend.data = ['初级', '中级', '高级'];
      //   const childrenNames = data[0].children.map((v) => v.name);
      this.option3.yAxis.data = types;
      //   const cjData = data[0].children.map((v) => v.value);
      //   const zjData = data[1].children.map((v) => v.value);
      //   const gjData = data[2].children.map((v) => v.value);
      var data1 = [];
      var data2 = [];
      var data3 = [];
      for (let i = 0; i < types.length; i++) {
        const itemList = data[types[i]];
        const item1 = itemList.find((v) => v.level == 1);
        if (item1) {
          data1.push(item1.value);
        } else {
          data1.push(0);
        }
        const item2 = itemList.find((v) => v.level == 2);
        if (item2) {
          data2.push(item2.value);
        } else {
          data2.push(0);
        }
        const item3 = itemList.find((v) => v.level == 3);
        if (item3) {
          data3.push(item3.value);
        } else {
          data3.push(0);
        }
      }
      this.option3.series[0].data = data1;
      this.option3.series[1].data = data2;
      this.option3.series[2].data = data3;
    },
    // 场景应激数据
    initCjyjsj(data) {
      const types = Object.keys(data);
      console.log(types, 'vvv');
      this.option4.legend.data = ['初级', '中级', '高级'];
      this.option4.yAxis.data = types;
      var data1 = [];
      var data2 = [];
      var data3 = [];
      for (let i = 0; i < types.length; i++) {
        const itemList = data[types[i]];
        const item1 = itemList.find((v) => v.level == 1);
        if (item1) {
          data1.push(item1.value);
        } else {
          data1.push(0);
        }
        const item2 = itemList.find((v) => v.level == 2);
        if (item2) {
          data2.push(item2.value);
        } else {
          data2.push(0);
        }
        const item3 = itemList.find((v) => v.level == 3);
        if (item3) {
          data3.push(item3.value);
        } else {
          data3.push(0);
        }
      }
      this.option4.series[0].data = data1;
      this.option4.series[1].data = data2;
      this.option4.series[2].data = data3;
    },
    // 心理健康数据
    initXljksj(data) {
      this.option6.xAxis[0].data = data.map((v) => v.label);
      this.option6.series[0].data = data.map((v) => Number(v.value));
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
    margin-bottom: 16px;
    .box-1 {
      width: 100%;
      height: 181px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      background-image: url('~@/assets/images/sjtj/7.png');
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
      margin-top: 10px;
      margin-bottom: 10px;
      height: 43%;
      box-sizing: border-box;
    }
  }
  .chart-card-2 {
    .chart {
      background-color: rgba(41, 130, 103, 0.1);
    }
  }
  .chart-card {
    position: relative;
    .chart {
      width: 100%;
      height: 100%;
      background-color: rgba(41, 130, 103, 0.1);
    }
    .table-c {
      box-sizing: border-box;
      padding-top: 80px;
      padding-left: 20px;
      padding-right: 20px;
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
    .table-children {
      .children-item {
        display: flex;
        padding: 5px 0 5px 30px;
        > div {
          width: 50%;
          text-align: center;
        }
      }
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
  .yjlevel {
    margin: 10px 10px 0;
    .item {
      display: flex;
      align-items: center;
      width: 92%;
      margin-bottom: 10px;
      .text {
        color: #aaccee;
        font-size: 18px;
      }
      .content {
        display: flex;
        align-items: center;
        height: 16px;
        border-radius: 2px;
        border: solid 1px rgba(223, 254, 255, 0.15);
        flex: 1;
        margin: 0 10px;
        .bar-box {
          margin: 0 10px;
          height: 4px;
          background-color: rgba(94, 167, 255, 0.3);
          border-radius: 2px;

          flex: 1;
          .bar1 {
            background-image: linear-gradient(
              90deg,
              rgba(248, 107, 106, 0.25) 0%,
              rgba(248, 107, 106, 0.85) 80%,
              #ffc1c1 100%
            );
          }
          .bar2 {
            background-image: linear-gradient(
              90deg,
              rgba(255, 180, 0, 0.25) 0%,
              rgba(255, 180, 0, 0.85) 80%,
              #ffefc9 100%
            );
          }
          .bar3 {
            background-image: linear-gradient(
              90deg,
              rgba(52, 148, 255, 0.25) 0%,
              rgba(52, 148, 255, 0.85) 80%,
              #bddcff 100%
            );
          }
          .bar {
            position: relative;
            width: 50%;
            height: 4px;

            border-radius: 2px;
            z-index: 99;
            &::after {
              position: absolute;
              width: 6px;
              height: 8px;
              content: '';
              background: #fff;
              right: 0px;
              top: -2px;
              z-index: 0;
              border-radius: 2px 4px 4px 2px;
            }
          }
        }
      }
      .precent {
        width: 20px;
        font-size: 18px;
        color: #fff;
      }
    }
  }

  // <div class="yjlevel" style="height: 35%">
  //               <div class="item">
  //                 <div class="text">一级预警</div>
  //                 <div class="content">
  //                   <div class="bar-box">
  //                     <div class="bar"></div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
}
</style>
