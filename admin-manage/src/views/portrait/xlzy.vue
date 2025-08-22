<template>
  <div class="full-block xlzy">
    <img
      class="back-button"
      src="@/assets/images/back.png"
      style="width: 40px"
      @click="$router.go(-1)"
    />
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>情绪</span></div>
      <chart :option="option1" class="flex-auto"></chart>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>人际信任度</span></div>
      <div class="flex-auto">
        <div class="inner-content flex-row justify-around">
          <span>分值：分高者人际信任度低，得分越低，人际信任度越高。</span>
          <!-- <span>支持：从强到弱</span> -->
        </div>
        <div style="width: 100%; height: calc(100% - 60px)">
          <chart :option="option2" class="flex-auto"></chart>
        </div>
      </div>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>压力</span></div>

      <chart :option="option3" class="flex-auto"></chart>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>睡眠</span></div>
      <div style="height: 60%">
        <chart :option="option4" class="flex-auto"></chart>
      </div>
      <div
        style="height: 30%; overflow-y: auto; font-size: 12px; line-height: 1.4"
        v-html="sleepReportReplace(sleepReport)"
      ></div>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>意志力</span></div>
      <chart :option="option5" class="flex-auto"></chart>
    </div>
    <div class="box-item flex-layout">
      <div class="flex-none box-title"><span>人格特点</span></div>
      <div style="height: 30vh; margin-top: 20px">
        <!--  -->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          height="100%"
          :span-method="objectSpanMethod"
        >
          <el-table-column prop="ys" label="因素" width="70"> </el-table-column>
          <el-table-column prop="bzf" label="标准分" width="70">
          </el-table-column>
          <el-table-column prop="df" label="低分者特性" width="100">
          </el-table-column>
          <el-table-column prop="chart">
            <template #header>
              <div
                style="
                  display: flex;
                  align-items: center;
                  text-align: right;
                  padding-left: 5px;
                "
              >
                <div style="width: 9%">0</div>
                <div v-for="i in 10" :key="i" style="width: 9%">{{ i }}</div>
              </div>
            </template>
            <template #default="{ row }">
              <div style="width: 100%; height: 1076px">
                <chart :option="option6" class="flex-auto"></chart>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="gf" label="高分者特征" width="100">
          </el-table-column>
        </el-table>
      </div>
      <!-- </chart> -->
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import BaseTable from '@/components/Base/BaseTable';
import moment from 'moment';
import 'echarts-gl'; // 引入 echarts-gl
import chartsBase from '@/components/Echarts/ChartsBase';
let pressureList = [];
let sleepList = [];
export default {
  components: {
    chart,
    BaseTable
  },
  mixins: [chartsBase],
  data() {
    return {
      option1: {
        tooltip: {
          formatter: '{a}<br/>当前：{c}'
        },
        series: [
          //内圈
          {
            type: 'gauge',
            center: ['50%', '60%'], // 默认全局居中
            radius: '30%',
            min: 0,
            max: 10,
            startAngle: 270,
            endAngle: -89.99999,
            splitNumber: 10,
            axisLine: {
              // 仪表盘轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, '#ff4500']],
                width: 0,
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 刻度标签
              show: false
            },
            axisTick: {
              // 刻度
              length: 10, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'rgba(176,204,53,.5)'
              }
            },
            splitLine: {
              // 分隔线
              show: false
            },
            pointer: {
              width: 0,
              shadowColor: '#fff', //默认透明
              shadowBlur: 5
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 0
              }
            ]
          },
          //中圈
          {
            type: 'gauge',
            center: ['50%', '60%'], // 默认全局居中
            radius: '55%',
            min: -60,
            max: 60,
            splitNumber: 10,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, '#6E6560']],
                width: 8,
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 刻度
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: '',
                color: 'rgba(30,144,255,0)',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 2, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto'
                /*shadowColor : '#fff', //默认透明
                                 shadowBlur: 10*/
              }
            },
            splitLine: {
              // 分隔线
              length: 0, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 0,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              width: 0,
              shadowColor: '#fff', //默认透明
              shadowBlur: 5
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 0
              }
            ]
          },
          {
            type: 'gauge',
            center: ['50%', '60%'], // 默认全局居中
            radius: '90%',
            min: -60,
            max: 60,
            name: '情绪正负性',
            axisLine: {
              // 坐标轴线
              lineStyle: {
                color: [[1, '#C7C5C3']], // 属性lineStyle控制线条样式
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: '#B0CC35'
              }
            },
            axisTick: {
              length: 3
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder',
                fontSize: 10,
                fontFamily: 'numfont'
              }
            },
            splitLine: {
              // 分隔线
              length: 5, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 1
              }
            },
            pointer: {
              width: 3,
              length: '90%'
            },
            detail: {
              show: true,
              formatter: '\n\n\n情绪正负性\n{value}',
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder',
                fontSize: 16,
                lineHeight: 24,
                fontFamily: 'numfont'
              }
            },
            data: [
              {
                value: 0
              }
            ]
          }
        ]
      },
      option2: {
        dataZoom: this.getXDataZoom(7, 10),
        tooltip: { trigger: 'axis' },
        grid: { top: '5%', left: '8%', right: '5%', bottom: '8%' },
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
              show: true,
              lineStyle: {
                type: 'dashed',
                color: ['#25CEF3']
              }
            }
          }
        ],
        series: [
          {
            name: '人际信任度',
            type: 'bar',
            barWidth: 15,
            barGap: 2,
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: '#98fffb'
                    },
                    {
                      offset: 1,
                      color: '#ffffbc'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              }
            },
            data: ['2.64', '15.53', '30.09', '21.19', '73.74', '45.76', '24.43']
          }
        ]
      },
      twoChart: [],
      option3: {
        dataZoom: this.getXDataZoom(7, 10),

        grid: {
          left: 15,
          top: 20,
          right: 15,
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          show: true,
          formatter: (params) => {
            const index = params.dataIndex;
            const item = pressureList[index];
            return '压力' + pressureList[index].pressure + ' ' + params.value;
          }
        },
        xAxis: {
          data: [],
          //坐标轴
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1	)',
              width: 1,
              type: 'solid'
            }
          },
          //坐标值标注
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          //坐标轴
          axisLine: {
            show: true
          },
          //坐标值标注
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          //分格线
          splitLine: {
            show: false,
            lineStyle: {
              color: '#4784e8'
            }
          }
        },
        series: [
          {
            name: '',
            tooltip: {
              show: true
            },
            type: 'bar',
            barWidth: 24.5,
            itemStyle: {
              normal: {
                color: (params) => {
                  const dataIndex = params.dataIndex;
                  const value = pressureList[dataIndex].pressure;
                  console.log(params, 'sss');
                  // 根据不同的值返回不同的颜色
                  if (value == '较小') {
                    return new this.$echarts.graphic.LinearGradient(
                      0,
                      1,
                      0,
                      0,
                      [
                        {
                          offset: 0,
                          color: '#51ffd0' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#51c4ff' // 100% 处的颜色
                        }
                      ],
                      false
                    );
                  } else if (value == '适中') {
                    return '#dc9f46';
                  } else {
                    return '#f43737';
                  }
                }
              }
            },
            data: [],
            barGap: 0
          }
        ]
      },
      option4: {
        dataZoom: [
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            left: '95%', // 放在右侧
            start: 0,
            end: 100,
            width: 12,
            handleSize: 8,
            maxValueSpan: 6,
            showDetail: false, // 关闭详细文字信息
            textStyle: {
              color: 'transparent' // 将文字颜色设为透明
            },
            handleStyle: {
              color: 'transparent' // 如果需要也可以隐藏滑块文字
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            return (
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#73a0fa;"></span>` +
              `${params[0].name} <br/>得分${params[0].value}`
            );
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '5%',
          bottom: '5%',
          containLabel: true
        },

        xAxis: {
          axisLabel: {
            //调整x轴的lable
            textStyle: {
              color: '#fff',
              fontSize: 12
            },
            formatter: '{value}' // 这里添加%单位
          },
          axisTick: { show: false },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',

          data: [],
          axisTick: { show: false },
          axisLabel: {
            //调整x轴的lable
            textStyle: {
              color: '#fff',
              fontSize: 12
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            color: '#73a0fa',
            barWidth: 14,
            label: {
              normal: {
                show: true,
                position: 'insideLeft',
                formatter: function (params) {
                  const dataIndex = params.dataIndex;
                  return sleepList[dataIndex].value;
                }
              }
            },
            data: []
          }
        ]
      },
      sleepReport: '',
      sleepPjf: 0,
      optionData: [],

      option5: {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '75%'],
            radius: '100%',
            min: 0,
            max: 100,
            splitNumber: 4,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.4, '#FF6E76'],
                  [0.6, '#FDDD60'],
                  [0.8, '#58D9F9'],
                  [1, '#7CFFB2']
                ]
              }
            },
            pointer: {
              width: 5,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              length: 15,
              lineStyle: {
                color: 'auto',
                width: 2
              }
            },
            splitLine: {
              length: 0,
              lineStyle: {
                color: 'auto',
                width: 0
              }
            },
            axisLabel: {
              color: '#FFFFFF',
              fontSize: 16,
              distance: -30,
              rotate: 'tangential',
              show: true
            },
            pointer: {
              width: 3,
              length: '90%'
            },
            detail: {
              show: true,
              offsetCenter: [0, 30],
              formatter: function (value) {
                // 格式化数值和状态文本
                let status;
                if (value >= 0 && value <= 40) {
                  status = '意志比较薄弱，需加强锻炼。';
                } else if (value >= 41 && value <= 60) {
                  status = '意志品质一般，需持续培养。';
                } else if (value >= 61 && value <= 80) {
                  status = '意志较坚强，能应对多数挑战。';
                } else if (value >= 81) {
                  status = '意志坚强，具备较强抗挫折能力';
                }
                return `{value|${value}}\n{status|${status}}`;
              },
              rich: {
                value: {
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  fontFamily: 'numfont',
                  padding: [0, 0, 10, 0] // 调整数值和状态文本的间距
                },
                status: {
                  fontSize: 16,
                  color: '#FFFFFF',
                  lineHeight: 24,
                  fontFamily: 'numfont'
                }
              }
            },
            data: [
              {
                value: 0
              }
            ]
          }
        ]
      },
      option6: {
        grid: {
          top: 0,
          bottom: 0
        },
        yAxis: {
          show: false,
          type: 'category', // 原来的 x 轴数据现在是分类轴
          data: [],
          inverse: true, // 让分类从上到下显示（Mon 在最上，Sun 在最下）
          position: 'left' // 可选，默认在左
        },
        xAxis: {
          show: false,
          type: 'value', // 原来的 y 轴现在是数值轴
          min: 0,
          max: 10,
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)' // 分割线颜色（半透明白色）
            }
          },
          axisLabel: {
            color: '#fff' // 标签文字颜色
          },
          position: 'top' // x 轴显示在顶部
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#f43737', // 折线颜色为粉红色
              width: 2 // 可调整线条粗细
            },
            itemStyle: {
              color: '#FF69B4' //
            }
          }
        ]
      },
      tableData: [
        {
          ys: 'A.乐群性',
          bzf: '5',
          df: '缄默孤独',
          gf: '乐群外向'
        },
        {
          ys: 'B.聪慧性',
          bzf: '5',
          df: '迟钝，学识浅薄',
          gf: '聪慧，富有才识'
        },
        {
          ys: 'C.稳定性',
          bzf: '4',
          df: '情绪激动',
          gf: '情绪稳定'
        },
        {
          ys: 'E.恃强性',
          bzf: '7',
          df: '谦逊顺从',
          gf: '好强固执'
        },
        {
          ys: 'F.兴奋性',
          bzf: '4',
          df: '严肃审慎',
          gf: '轻松兴奋'
        },
        {
          ys: 'G.有恒性',
          bzf: '5',
          df: '权宜敷衍',
          gf: '有恒负责'
        },
        {
          ys: 'H.敢为性',
          bzf: '5',
          df: '畏惧退怯',
          gf: '冒险敢为'
        },
        {
          ys: 'I.敏感性',
          bzf: '5',
          df: '理智，着重实际',
          gf: '敏感，感情用事'
        },
        {
          ys: 'L.怀疑性',
          bzf: '7',
          df: '信赖随和',
          gf: '怀疑刚愎'
        },
        {
          ys: 'M.幻想性',
          bzf: '5',
          df: '现实，合乎成规',
          gf: '幻想，狂放不羁'
        },
        {
          ys: 'N.世故性',
          bzf: '8',
          df: '坦白直率，天真',
          gf: '精明能干，世故'
        },
        {
          ys: 'O.忧虑性',
          bzf: '6',
          df: '安详沉着，有自信心',
          gf: '忧虑抑郁，烦恼多端'
        },
        {
          ys: 'Q1.实验',
          bzf: '5',
          df: '保守，服从传统',
          gf: '自由，批评激进'
        },
        {
          ys: 'Q2.独立性',
          bzf: '5',
          df: '依赖，随群附众',
          gf: '自主，当机立断'
        },
        {
          ys: 'Q3.自律性',
          bzf: '3',
          df: '矛盾冲突，不明大体',
          gf: '知己知彼，纪律谨严'
        },
        {
          ys: 'Q4.紧张性',
          bzf: '6',
          df: '心平气和',
          gf: '紧张困扰'
        }
      ]
    };
  },
  mounted() {
    const query = this.$route.query;
    const userId = query.userId;
    this.getPsychologicalResources(userId);
    // this.getExhibit(userId);
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        if (rowIndex === 0) {
          return {
            rowspan: 16, // Merge 15 rows
            colspan: 1 // Keep 1 column span
          };
        } else if (rowIndex < 16) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      };
    },
    getPsychologicalResources(userId) {
      this.$api.analysis.psychologicalResources({ userId }).then((res) => {
        const result = res.result;
        this.option1.series[2].data[0].value = result.emotionValue
          ? result.emotionValue.toFixed(2)
          : 0;
        const interpersonalTrustList = result.interpersonalTrustList;
        this.option2.xAxis[0].data = interpersonalTrustList.map(
          (item) => item.label
        );
        if (interpersonalTrustList.length < 8) {
          this.option2.dataZoom = this.getXDataZoom(10);
        }
        this.option2.series[0].data = interpersonalTrustList.map(
          (item) => item.value
        );
        const pressure = result.pressureList ? result.pressureList : [];
        pressureList = pressure;
        this.initPressure(pressure);
        const sleepData = result.sleepData;
        this.initSleep(sleepData);
        const willpower = result.willpower;
        this.option5.series[0].data[0].value = willpower;
        // personalityTraitList
        const colors = [
          { color: '#13b67d' },
          { color: '#13b67d' },
          { color: '#c45a1e' },
          { color: '#c45a1e' },
          { color: '#f6be54' },
          { color: '#f6be54' },
          { color: '#3573c2' },
          { color: '#3573c2' },
          { color: '#f2850d' },
          {
            color: '#f339d9'
          },
          {
            color: '#dc9f46'
          },
          {
            color: '#5c9f59'
          },
          {
            color: '#69b2cf'
          },
          {
            color: '#8e9b88'
          }
        ];
        const personalityTraitList = res.result.personalityTraitList;
        this.option6.series[0].data = personalityTraitList.map((v, i) =>
          Number(v.value)
        );
        this.tableData = this.tableData.map((v, index) => {
          return {
            ...v,
            bzf: personalityTraitList[index].value
          };
        });
        // this.option6.series[0].data = personalityTraitList.map((v, i) => {
        //   return {
        //     value: Number(v.value),
        //     name: v.label,
        //     itemStyle:
        //       i + 1 > colors.length ? {} : { ...colors[i], fontSize: 10 }
        //   };
        // });
      });
    },
    // 初始化情绪
    initEmotion(data) {
      let values = [];
      for (let i = 0; i < data.length; i++) {
        const val = data[i].value ? JSON.parse(data[i].value) : [];
        values.push({
          name: data[i].name,
          symbolSize: 14,
          data: [val],
          type: 'scatter',
          label: {
            show: true,
            color: '#fff',
            formatter: (params) => {
              return params.seriesName;
            },
            position: 'top'
          }
        });
      }
      this.option1.series = values;
    },
    // 初始化压力
    initPressure(data) {
      this.option3.xAxis.data = data.map((v) => v.label);
      this.option3.series[0].data = data.map((v) => Number(v.value));
    },
    // 睡眠
    initSleep(sleepData) {
      const colors = [
        'rgba(37,155,165,0.8)',
        '#0C3065',
        '#8ECFF2',
        '#8ECFF2',
        '#EF7D32',
        '#43faeb',
        '#14789c',
        '#0900723'
      ];
      sleepList = sleepData.sleepList;
      const sleepLabels = sleepList.map((i) => i.label);
      const sleepValues = sleepList.map((i) => Number(i.value));
      this.option4.yAxis.data = sleepLabels;
      this.option4.series[0].data = sleepValues;
      if (sleepValues.length < 8) {
        this.option4.dataZoom = [];
      }
      this.sleepReport = sleepData.sleepReport;
    },
    sleepReportReplace(str) {
      return str.replace(/\n/g, '<br/>');
    },
    // 生命意义
    initLife(data) {
      console.log(data, '生命意义');
      const nodes = data.map((v) => {
        return {
          name: v.name,
          id: v.value,
          symbolSize: 60,
          symbol: 'circle'
        };
      });
      const links = data
        .filter((v) => v.unit)
        .map((v) => {
          return {
            source: v.value,
            target: v.unit,
            lineStyle: {
              color: 'rgba(17,121,85,.4)', // 设置连线颜色为红色
              width: 3, // 可选：设置连线宽度
              type: 'solid' // 可选：设置连线类型
            }
          };
        });
      this.option5.series[0].data = nodes;
      this.option5.series[0].links = links;
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
          length: 30,
          length2: 20
        },

        startAngle: -20, //
        clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['30%', '50%'],
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
      let boxHeight = this.getHeight3D(series, 8); //通过传参设定3d饼/环的高度，26代表26px
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
              color: '#fff'
            }
          },
          formatter: '{b|{b} \n}{c|{c}}{b|}'
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
            alpha: 45, //角度
            distance: 200, //调整视角到主体的距离，类似调整zoom
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
    }
  }
};
</script>

<style lang="scss" scoped>
.xlzy {
  position: relative;
  padding: 35px 20px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  .back-button {
    position: absolute;
    display: block;
    object-fit: contain;
    height: 40px !important;
    top: -5px;
    left: 15px;
    cursor: pointer;
  }
  .box-item {
    width: calc((100% - 40px) / 3);
    height: calc((100% - 20px) / 2);
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(41, 130, 103, 0.1);
  }

  .inner-content {
    margin-top: 16px;
    padding: 6px;
    line-height: 1.2;
    font-size: 16px;
    background: linear-gradient(
      to right,
      rgba(1, 236, 202, 0.15),
      rgba(1, 236, 202, 0)
    );
    text-align: center;
    border-left: 2px solid #13b9bb;
    margin-bottom: 10px;
  }

  .container-pp {
    position: relative;
    font-size: 16px;
    left: 1%;
    margin-top: 20px;
    .one {
      text-align: center;
      position: absolute;
      color: #fff;
      width: 74px;
      height: 47px;
      line-height: 46px;
      background: #13b67d;
      border-radius: 50%;
      z-index: 4;
      left: 48px;
      top: 64px;
    }
    .two {
      position: absolute;
      color: #fff;
      width: 180px;
      height: 88px;
      background: #117955;
      border-radius: 50%;
      text-align: right;
      z-index: 3;
      left: 34px;
      top: 44px;
      line-height: 90px;
      padding-right: 18px;
    }
    .three {
      position: absolute;
      color: #fff;
      width: 291px;
      height: 120px;
      background: rgba(15, 87, 62, 0.8);
      border-radius: 50%;
      text-align: right;
      z-index: 2;
      top: 28px;
      left: 20px;
      line-height: 120px;
      padding-right: 20px;
    }
    .four {
      position: absolute;
      color: #fff;
      width: 98%;
      height: 174px;
      background: rgba(17, 121, 85, 0.4);
      border-radius: 50%;
      text-align: right;
      line-height: 169px;
      padding-right: 20px;
      z-index: 1;
    }
  }
}
</style>
