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
            <img src="@/assets/images/statics/5.png" />
          </div>
          <div>
            <div class="text-1">注册人数(个)</div>
            <div class="text-2">{{ rshz.registerCount }}</div>
          </div>
        </div>
        <div>
          <div class="icon">
            <img src="@/assets/images/sjtj/3.png" />
          </div>
          <div>
            <div class="text-1">实际登录人数(个)</div>
            <div class="text-2">{{ rshz.onlineCount }}</div>
          </div>
        </div>
        <div>
          <div class="icon">
            <img src="@/assets/images/statics/4.png" />
          </div>
          <div>
            <div class="text-1">预警人数(个)</div>
            <div style="display: flex">
              <div class="text-2">{{ rshz.warnList }}</div>
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
            <div class="chart table-c">
              <div style="height: 85%; overflow: hidden">
                <el-table
                  :data="wtlxlftjXData"
                  style="width: 100%; height: 400px; overflow: auto"
                  :style="{ overflowY: 'auto' }"
                  row-key="label"
                  :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren'
                  }"
                >
                  <el-table-column label="模块名称" prop="label">
                  </el-table-column>
                  <el-table-column label="点击次数" prop="value">
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="title">模块点击率</div>
          </el-col>
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
import { snapdom } from '@zumer/snapdom';
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
        dataZoom: this.getXDataZoom(8, 10),
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
          left: 20,
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
              align: 'center',
              interval: 0, // 0表示显示所有标签，1表示隔一个显示一个
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
      option3: {
        dataZoom: this.getXDataZoom(8, 10),
        title: {
          text: '',
          subtext: '',
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
      rshz: {
        registerCount: 0,
        warnList: 0,
        onlineCount: 0
      },
      wtlxlftjXData: []
    };
  },
  mounted() {
    this.getSystemusage();
    // this.getExhibit();
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
        endTime: ''
      };
      if (this.params.range && this.params.range.length == 2) {
        params.startTime = moment(this.params.range[0]).format('YYYY-MM-DD');
        params.endTime = moment(this.params.range[1]).format('YYYY-MM-DD');
      }
      this.getSystemusage(params);
      //   this.downloadPng();
    },
    async downloadPng() {
      const element = document.querySelector('.analysis-c');
      const capture = await snapdom(element, {
        scale: 2, // 2倍清晰度
        backgroundColor: '#fff', // 背景色
        embedFonts: true, // 内嵌字体
        compress: true // 压缩优化
      });
      // 直接触发下载
      await capture.download({
        format: 'png',
        filename: 'chart-report-2024'
      });
    },
    getSystemusage(params = {}) {
      this.$api.analysis.systemusage(params).then((res) => {
        const {
          registerCount,
          warnList,
          onlineCount,
          appointmentList,
          consultationList,
          clickList
        } = res.result;
        this.rshz.registerCount = registerCount;
        this.rshz.warnList = warnList;
        this.rshz.onlineCount = onlineCount;

        // 预约统计
        const yytjXData = appointmentList.map((v) => v.label);
        this.option1.xAxis[0].data = yytjXData;
        if (yytjXData.length <= 8) {
          this.option1.dataZoom = null;
        }
        const yytjSeries = appointmentList.map((v) => v.value);
        this.option1.series[0].data = yytjSeries;
        // 问题类型来访统计
        this.wtlxlftjXData = clickList;

        // 咨询统计
        const zxtjXData = consultationList.map((v) => v.label);
        this.option3.xAxis[0].data = zxtjXData;
        if (zxtjXData.length <= 8) {
          this.option3.dataZoom = null;
        }
        this.zxtjSeries = consultationList.map((v) => v.value);
        this.option3.series[0].data = this.zxtjSeries;
      });
    },
    getExhibit() {
      const userId = this.$store.state.user.userId;
      this.$api.exhibit
        .testexamplegeneralByUserId({
          userId: userId
        })
        .then((res) => {
          if (res.result) {
            const { content } = res.result;
            const contentData = JSON.parse(content);
            const rshz = contentData['xtsyqk-rshz'];
            const yytj = contentData['xtsyqk-yytj'];
            const zxtj = contentData['xtsyqk-zxtj'];
            const wtlxlftj = contentData['xtsyqk-wtlxlftj'];
            // 人数汇总
            const obj = {};
            for (let i = 0; i < rshz.length; i++) {
              const key = rshz[i].name;
              obj[key] = rshz[i].value;
            }
            this.rshz = obj;
            // 预约统计
            const yytjXData = yytj.map((v) => v.name);
            this.option1.xAxis[0].data = yytjXData;
            const yytjSeries = yytj.map((v) => v.value);
            this.option1.series[0].data = yytjSeries;
            // 咨询统计
            const zxtjXData = zxtj.map((v) => v.name);
            this.option3.xAxis[0].data = zxtjXData;
            this.zxtjSeries = zxtj.map((v) => v.value);
            this.option3.series[0].data = this.zxtjSeries;

            console.log(wtlxlftj, '-----');
            const wtlxlftjXData = wtlxlftj.map((v) => {
              let amount = 0;
              v.children.forEach((v) => {
                amount += JSON.parse(v.value);
              });
              return {
                name: v.name,
                value: amount,
                children: v.children.map((v) => {
                  return {
                    name: v.name,
                    value: JSON.parse(v.value)
                  };
                })
              };
            });
            this.wtlxlftjXData = wtlxlftjXData;
          }
        });
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
}
</style>
