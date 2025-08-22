<template>
  <div class="team-analysis flex-layout flex-row full-block pa10">
    <div class="tree-container">
      <div class="left-header">
        <span class="name">小组管理</span>
        <span class="add" @click="showGroup()">+</span>
      </div>
      <div class="left-ctc">
        <el-input
          placeholder="请输入关键词"
          v-model="keyword"
          size="mini"
          @keyup.enter.native="queryKeyword()"
          @clear="queryKeyword()"
          clearable
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="getList()"
          ></i>
        </el-input>
        <div class="user-list" v-loading="loading">
          <template v-if="list.length > 0">
            <el-checkbox-group v-model="checkList" @change="handleSearch">
              <template v-for="v in list">
                <div :key="v.id">
                  <el-checkbox :label="v.id">
                    {{ v.name }}
                  </el-checkbox>
                </div>
              </template>
            </el-checkbox-group>
          </template>
          <div v-else>
            <el-empty :image-size="80" :image="noData"></el-empty>
          </div>
        </div>
        <div class="pagination-c">
          <div class="pre" @click="pre()">
            <span class="iconfont" style="font-size: 14px">&#xe60e;</span>
          </div>
          <div class="center-page">{{ current }}/{{ pages }}</div>
          <div class="next" @click="next()">
            <span class="iconfont" style="font-size: 14px">&#xe610;</span>
          </div>
          <el-input
            size="mini"
            v-model="pageInfo.pageNo"
            style="width: 55px; margin-left: 16px"
            @input="handleInput"
            :max="pages"
          />
          <div class="jumper" @click="jumper">跳转</div>
        </div>
      </div>
    </div>
    <div style="width: calc(100% - 300px)">
      <div class="search">
        <Search
          :params="params"
          :fieldsConfig="fieldsConfig"
          :isReset="false"
          @handleSearch="handleSearch"
        ></Search>
      </div>
      <div class="team-analysis-container" v-loading="pageLoading">
        <template v-if="info">
          <div class="box-1">
            <div class="title">总体情况统计</div>
            <div>
              <div class="icon">
                <img src="@/assets/images/statics/5.png" />
              </div>
              <div>
                <div class="text-1">小组人数(个)</div>
                <div class="text-2">{{ info.groupUserCount }}</div>
              </div>
            </div>
            <div>
              <div class="icon">
                <img src="@/assets/images/sjtj/3.png" />
              </div>
              <div>
                <div class="text-1">正常人数(个)</div>
                <div class="text-2">{{ info.normalCount }}</div>
              </div>
            </div>
            <div>
              <div class="icon">
                <img src="@/assets/images/statics/4.png" />
              </div>
              <div>
                <div class="text-1">预警人数(个)</div>
                <div style="display: flex">
                  <div class="text-2">{{ info.warnCount }}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="icon">
                <img src="@/assets/images/statics/4.png" />
              </div>
              <div>
                <div class="text-1">预警率</div>
                <div style="display: flex">
                  <div class="text-2">{{ info.warnRat }}</div>
                </div>
              </div>
            </div>
          </div>
          <el-row :gutter="0" style="margin-top: 16px">
            <el-col
              class="chart-card"
              style="width: 49.5%; height: 300px; margin-right: 1%"
            >
              <div class="title">群体适应水平</div>
              <el-row :gutter="10" style="width: 100%; margin-top: 60px">
                <el-col :span="8" style="position: relative">
                  <chart
                    class="chart"
                    :option="option1_1"
                    style="width: 100%; height: 200px"
                  ></chart>
                  <div class="text-c">
                    <div>适应能力较强</div>
                    <div>{{ gaoPrecent }}</div>
                  </div>
                </el-col>
                <el-col :span="8" style="position: relative">
                  <chart
                    class="chart"
                    :option="option1_2"
                    style="width: 100%; height: 200px"
                  ></chart>
                  <div class="text-c">
                    <div>适应能力一般</div>
                    <div>{{ zhongPrecent }}</div>
                  </div>
                </el-col>
                <el-col :span="8" style="position: relative">
                  <chart
                    class="chart"
                    :option="option1_3"
                    style="width: 100%; height: 200px"
                  ></chart>
                  <div class="text-c">
                    <div>适应能力差劲</div>
                    <div>{{ diPrecent }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="chart-card" style="width: 49.5%; height: 300px">
              <div class="title">群体压力水平</div>
              <chart
                class="chart"
                :option="option2"
                style="width: 100%; height: 300px"
              ></chart>
            </el-col>
          </el-row>
          <el-row :gutter="0" style="margin-top: 16px">
            <el-col
              class="chart-card"
              style="width: 49.5%; height: 300px; margin-right: 1%"
            >
              <div class="title">群体情绪波动水平</div>
              <chart
                class="chart"
                :option="option3"
                style="width: 100%; height: 270px; margin-top: 0px"
              ></chart>
            </el-col>
            <el-col class="chart-card" style="width: 49.5%; height: 300px">
              <div class="title">群体性格</div>
              <chart
                class="chart"
                :option="option4"
                style="width: 100%; height: 270px; margin-top: 30px"
              ></chart>
            </el-col>
          </el-row>
          <el-row :gutter="0" style="margin-top: 16px">
            <el-col
              class="chart-card"
              style="width: 49.5%; height: 300px; margin-right: 1%"
            >
              <div class="title">群体社会支持</div>
              <chart
                class="chart"
                :option="option5"
                style="width: 100%; height: 300px"
              ></chart>
            </el-col>
            <el-col class="chart-card" style="width: 49.5%; height: 300px">
              <div class="title">群体心理问题</div>
              <chart
                class="chart"
                :option="option6"
                style="width: 100%; height: 300px"
              ></chart>
            </el-col>
          </el-row>
          <el-row :gutter="0" style="margin-top: 16px">
            <el-col class="chart-card" style="width: 100%; height: 300px">
              <div class="title">心理健康水平</div>
              <chart
                class="chart"
                :option="option7"
                style="width: 100%; height: 300px"
              ></chart>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <div
            style="
              margin-top: 10px;
              height: calc(100vh - 180px);
              background-color: rgba(41, 130, 103, 0.1);
            "
          >
            <el-empty :image="noData" :image-size="100"></el-empty>
          </div>
        </template>
      </div>
    </div>
    <GroupSetDialog
      title="添加小组"
      ref="groupSetDialog"
      @confirm="groupSave"
    ></GroupSetDialog>
  </div>
</template>

<script>
import Search from '@/components/Search/Search';
import BaseTable from '@/components/Base/BaseTable';
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
import LeftCatalogue from '@/components/Project/LeftCatalogue';
import GroupSetDialog from '@/components/GroupSetDialog.vue';
import 'echarts-liquidfill';
const noData = require('@/assets/images/no-data.png');
let moodList = [];
export default {
  components: {
    Search,
    BaseTable,
    chart,
    LeftCatalogue,
    GroupSetDialog
  },

  mixins: [chartsBase],
  data() {
    return {
      noData,
      loading: false,
      pageLoading: false,
      keyword: '',
      pageInfo: {
        pageSize: 20,
        pageNo: 1
      },
      checkList: [],
      list: [],
      total: 0,
      pages: 1,
      current: 1,
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
          valueFormat: 'yyyy-MM-dd',
          clearable: true
        }
      ],
      info: null,
      gaoPrecent: '',
      zhongPrecent: '',
      diPrecent: '',
      option1_1: {
        series: [
          {
            type: 'liquidFill',
            data: [],
            radius: '80%',
            color: ['#8ce2e2'],
            outline: {
              show: true, // 显示外层轮廓线
              borderDistance: 0, // 轮廓线与水球的距离
              itemStyle: {
                borderColor: '#32a5df', // 外层轮廓线颜色
                borderWidth: 4 // 外层轮廓线宽度
              }
            },
            label: {
              show: false
            },
            backgroundStyle: {
              color: 'rgba(255,255,255,1)' //背景
            }
          }
        ]
      },
      option1_2: {
        series: [
          {
            type: 'liquidFill',
            data: [0],
            radius: '80%',
            color: ['#b5ccfc'],
            outline: {
              show: true, // 显示外层轮廓线
              borderDistance: 0, // 轮廓线与水球的距离
              itemStyle: {
                borderColor: '#5b8ff9', // 外层轮廓线颜色
                borderWidth: 4 // 外层轮廓线宽度
              }
            },
            label: {
              show: false
            },
            backgroundStyle: {
              color: 'rgba(255,255,255,1)' //背景
            }
          }
        ]
      },
      option1_3: {
        series: [
          {
            type: 'liquidFill',
            data: [0],
            radius: '80%',
            color: ['#ead7be'],
            outline: {
              show: true, // 显示外层轮廓线
              borderDistance: 0, // 轮廓线与水球的距离
              itemStyle: {
                borderColor: '#5b8ff9', // 外层轮廓线颜色
                borderWidth: 4 // 外层轮廓线宽度
              }
            },
            label: {
              show: false
            },
            backgroundStyle: {
              color: 'rgba(255,255,255,1)' //背景
            }
          }
        ]
      },
      // 群体压力水平
      option2: {
        dataZoom: this.getXDataZoom(6, 5),
        color: ['#16f892'],
        title: {
          left: 'center',
          text: '',
          textStyle: {
            color: '#FFFFFF',
            fontSize: '14'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            console.log(params, 'sfdsf');
            return (
              `${params[0].name}<br/>` +
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#16f892;"></span>` +
              `压力人数占比 ${params[0].value}%`
            );
          }
        },
        grid: {
          left: '6%',
          right: '6%',
          top: '25%',
          bottom: '8%',
          containLabel: true
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          x: 'right',
          y: 'center'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLabel: {
              interval: 0,
              color: '#c1cadf',
              fontSize: '13'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            nameTextStyle: {
              color: '#c1cadf',
              align: 'right',
              lineHeight: 10
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLabel: {
              interval: 0,
              color: '#c1cadf',
              fontSize: '13',
              formatter: '{value}%'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'line',
            smooth: true,
            symbolSize: 4,
            data: [],

            itemStyle: {
              normal: {
                color: '#16f892'
              }
            }
          }
        ]
      },
      // 群体情绪波动水平
      option3: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            console.log(params, 'sfdsf');
            return (
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#73a0fa;"></span>` +
              `${params[0].name} ${params[0].value}%`
            );
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },

        xAxis: {
          max: 100, // 设置最大值为100%
          axisLabel: {
            //调整x轴的lable
            textStyle: {
              color: '#fff',
              fontSize: 12
            },
            formatter: '{value}%' // 这里添加%单位
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
                  return moodList[dataIndex].value;
                }
              }
            },
            data: []
          }
        ]
      },
      // 群体性格
      option4: {
        color: [
          '#3aa0ff',
          '#4ecb73',
          '#fad337',
          '#8d7fec',
          '#5085f2',
          '#e75fc3',
          '#f87be2',
          '#f2719a',
          '#fca4bb',
          '#f59a8f',
          '#fdb301',
          '#57e7ec',
          '#cf9ef1'
        ],
        legend: {
          orient: 'vartical',
          x: 'left',
          top: 'center',
          left: '53%',
          bottom: '0%',
          data: [],
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)'
          },
          /*itemGap: 16,*/
          formatter: (name) => {
            var oa = this.option4.series[0].data;
            for (var i = 0; i < this.option4.series[0].data.length; i++) {
              if (name == oa[i].name) {
                return ' ' + name + '  |  ' + oa[i].value + '个';
              }
            }

            return name;
          }
        },
        series: [
          {
            type: 'pie',
            clockwise: false, //饼图的扇区是否是顺时针排布
            minAngle: 2, //最小的扇区角度（0 ~ 360）
            radius: ['40%', '60%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              //图形样式
              normal: {
                borderColor: '#ffffff',
                borderWidth: 1
              }
            },
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{text|{b}}\n{c} ({d}%)',
                rich: {
                  text: {
                    color: '#fff',
                    fontSize: 14,
                    align: 'center',
                    verticalAlign: 'middle',
                    padding: 8
                  },
                  value: {
                    color: '#8693F3',
                    fontSize: 24,
                    align: 'center',
                    verticalAlign: 'middle'
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: 16
                }
              }
            },
            data: []
          }
        ]
      },
      // 群体社会支持
      option5: {
        tooltip: {
          trigger: 'axis'
        },
        radar: {
          indicator: [],
          splitNumber: 4,
          nameGap: 0,
          center: ['50%', '60%'],
          axisLine: {
            //指向外圈文本的分隔线样式
            lineStyle: {
              color: '#2c353d'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#2c353d'],
              width: 1
            }
          },
          splitArea: {
            areaStyle: {
              color: ['transparent']
            }
          },
          name: {
            color: 'rgba(255,255,255,.8)'
          }
        },
        series: [
          {
            name: '集体社会支持',
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#096e32',
                borderColor: '#46ff91'
              }
            },
            areaStyle: {
              color: ['#096e32'],
              opacity: 0.4
            },
            data: [
              {
                value: [60, 33, 10, 50, 100]
              }
            ]
          }
        ]
      },
      // 群体心理问题
      option6: {
        color: [
          '#6395fa',
          '#62daab',
          '#657798',
          '#f7c122',
          '#0dc2c2',
          '#01aebf',
          '#18b794'
        ],
        tooltip: {
          formatter: (params) => {
            return `人数 ${params.value} <br/> 占比 ${params.percent}%`;
          }
        },
        grid: {
          containLabel: true
        },
        legend: {
          show: false,
          orient: 'vertical',
          right: '2%',
          bottom: '5%',
          textStyle: {
            color: '#d7d7d7'
          }
        },
        series: [
          {
            type: 'funnel',
            right: '5%',
            top: 50,
            bottom: 20,
            width: '80%',
            minSize: '1%',
            maxSize: '90%',
            sort: 'descending',
            gap: 2,
            data: [],
            label: {
              normal: {
                formatter: function (params) {
                  return params.name + '  ' + params.value;
                },
                position: 'inside',
                textBorderColor: 'transparent',
                fontSize: 13,
                lineHeight: 17,
                align: 'center', // 水平居中
                verticalAlign: 'middle', // 垂直居中
                distance: 0
              }
            },
            labelLine: {
              normal: {
                length: 80 // 调整标签线的长度，可根据需求修改
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 0,
                shadowBlur: 30,
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
              }
            }
          }
        ]
      },
      // 心理健康水平
      option7: {
        dataZoom: this.getXDataZoom(12, 5),
        tooltip: { trigger: 'axis' },
        grid: { left: 50, top: 60, right: 50, bottom: 40 },
        legend: {
          show: false,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 10,
          data: [],
          left: '10px',
          top: '0px',
          textStyle: { fontSize: 12, color: '#fff' }
        },
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
                color: '#30cd8c'
              }
            },
            data: []
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleInput(value) {
      // 只允许整数
      let val = value.replace(/[^\d]/g, '');

      // 限制最大值
      if (val > this.pages) {
        val = this.pages;
      }
      this.pageInfo.pageNo = val;
    },
    queryKeyword() {
      this.pageInfo.pageNo = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$api.basics
        .sysgroupPage({
          ...this.pageInfo,
          name: this.keyword
        })
        .then((res) => {
          this.loading = false;
          const result = res.result;
          this.current = result.current;
          this.pages = result.pages;
          this.list = res['result'].records;
          this.total = res['result'].total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    jumper() {
      this.getList();
    },
    pre() {
      if (this.pageInfo.pageNo <= 1) {
        this.$message('已经是第一页了');
      } else {
        this.pageInfo.pageNo--;
        this.getList();
      }
    },
    next() {
      if (this.pageInfo.pageNo < this.pages) {
        this.pageInfo.pageNo++;
        this.getList();
      } else {
        this.$message('已经最后一页了');
      }
    },
    handleSearch() {
      this.pageInfo.pageNo = 1;
      this.getAnalysic();
    },
    getAnalysic() {
      let startTime = '';
      let endTime = '';
      if (this.params.range && this.params.range.length > 0) {
        startTime = this.params.range[0];
        endTime = this.params.range[1];
      }
      let groupIds = '';
      if (this.checkList.length > 0) {
        groupIds = this.checkList.join(',');
      }
      if (!groupIds) {
        this.$message.error('请选择小组');
        return false;
      }
      this.pageLoading = true;
      this.$api.analysis
        .groupsituation({
          groupIds,
          startTime,
          endTime
        })
        .then((res) => {
          this.info = res.result;
          const warnRat =
            ((this.info.warnCount / this.info.groupUserCount) * 100).toFixed(
              2
            ) + '%';
          this.info.warnRat = warnRat;
          // 群体压力水平
          const pressureList = res.result.pressureList;
          if (pressureList && pressureList.length <= 6) {
            this.option2.dataZoom = this.getXDataZoom(pressureList, 0);
          }
          this.option2.xAxis[0].data = pressureList.map((item) => {
            return item.label;
          });
          const groupUserCount = res.result.groupUserCount;
          if (groupUserCount > 0) {
            this.option2.series[0].data = pressureList.map((item) => {
              return parseFloat(item.value).toFixed(1);
            });
          }

          // groupAdaptationLevel
          const groupAdaptationLevel = res.result.groupAdaptationLevel;
          const gaoLevel = groupAdaptationLevel.find(
            (v) => v.label == '高'
          ).value;
          const zhongLevel = groupAdaptationLevel.find(
            (v) => v.label == '中'
          ).value;
          const diLevel = groupAdaptationLevel.find(
            (v) => v.label == '低'
          ).value;

          let gaoPrecent = (Number(gaoLevel) / groupUserCount).toFixed(2);
          this.option1_1.series[0].data = [gaoPrecent];
          this.gaoPrecent = (gaoPrecent * 100).toFixed(1) + '%';
          let zhongPrecent = (Number(zhongLevel) / groupUserCount).toFixed(2);
          this.option1_2.series[0].data = [zhongPrecent];
          this.zhongPrecent = (zhongPrecent * 100).toFixed(1) + '%';
          let diPrecent = (Number(diLevel) / groupUserCount).toFixed(2);
          this.option1_3.series[0].data = [diPrecent];
          this.diPrecent = (diPrecent * 100).toFixed(1) + '%';

          // 情绪波动水平
          moodList = res.result.moodList;
          const moodLabels = moodList.map((i) => i.label);
          const moodValues = moodList.map((i) => Number(i.value));
          const moodAmount = moodValues.reduce((a, b) => a + b, 0);
          this.option3.yAxis.data = moodLabels;
          this.option3.series[0].data = moodValues.map((v) => {
            return ((v / moodAmount) * 100).toFixed(2);
          });

          // 群体性格 mbtiStatistics
          const mbtiStatistics = res.result.mbtiStatistics;
          const mbtiStatisticsKeys = Object.keys(mbtiStatistics);
          this.option4.legend.data = mbtiStatisticsKeys;
          let mbtiStatisticsList = [];
          mbtiStatisticsKeys.forEach((key) => {
            mbtiStatisticsList.push({
              name: key,
              value: mbtiStatistics[key]
            });
          });
          this.option4.series[0].data = mbtiStatisticsList;

          const groupPsyQuestion = res.result.groupPsyQuestion;
          this.option6.series[0].data = groupPsyQuestion
            .map((v) => {
              return {
                name: v.itemName,
                value: v.userCount
              };
            })
            .sort(function (a, b) {
              return a.value - b.value;
            });
          const riskList = res.result.riskList;
          this.option7.xAxis[0].data = riskList.map((v) => v.label);
          this.option7.series[0].data = riskList.map((v) => v.value);

          const socialSupportList = res.result.socialSupportList;
          let max = Math.max(...socialSupportList.map((v) => Number(v.value)));
          if (!max) {
            max = 100;
          }
          this.option5.radar.indicator = socialSupportList.map((v) => {
            return {
              name: v.label,
              max: max,
              num: Number(v.value)
            };
          });
          this.option5.series[0].data[0].value = socialSupportList.map((v) => {
            return Number(v.value);
          });
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },
    showGroup() {
      this.$refs.groupSetDialog.show([]);
    },
    groupSave() {
      this.pageInfo.pageNo = 1;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.team-analysis {
  .tree-container {
    width: 300px;
    padding: 25px 10px 20px;
    background-image: url('~@/assets/images/person-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 10px;

    display: flex;
    flex-direction: column;
    .left-header {
      line-height: 30px;
      padding: 0 10px;
      background-color: rgba(75, 101, 137, 0.2);

      .name {
        border-left: 3px solid #219565;
        padding-left: 10px;
      }

      .add {
        float: right;
        margin-right: 10px;
        font-size: 30px;
        color: #219565;
        cursor: pointer;
      }
    }
    .left-ctc {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 10px 10px 0;
      .user-list {
        height: calc(100dvh - 280px);
        overflow-y: auto;
        > div {
          border-bottom: 1px solid rgba(129, 151, 189, 0.23);
          line-height: 32px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .pagination-c {
        margin-bottom: 10px;
        .pre,
        .next {
          display: inline-flex;
          // background: rgba(172, 215, 255, 0.2);
          align-items: center;
          //   padding: 7.5px;
          border-radius: 4px;
          cursor: pointer;
        }
        .center-page {
          display: inline-flex;
          // background: rgba(172, 215, 255, 0.2);
          align-items: center;
          //   padding: 0 16px;
          border-radius: 4px;
          font-size: 14px;
          margin: 0 16px;
        }
        .jumper {
          display: inline-flex;
          margin-left: 6px;
          // background: rgba(172, 215, 255, 0.2);
          align-items: center;
          padding: 7.5px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
  .team-analysis-container {
    height: calc(100% - 30px);
    overflow-y: auto;
    overflow-x: hidden;
    .box-1 {
      position: relative;
      width: 100%;
      height: 150px;
      display: flex;
      align-items: center;
      background-color: rgba(41, 130, 103, 0.1);
      margin-top: 10px;
      > div {
        flex: 1;
        display: flex;
        // align-items: center;
        justify-content: center;
        margin-top: 30px;
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
          padding-top: 10px;
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
    .title {
      position: absolute;
      top: 10px;
      margin-top: 0 !important;
      left: 0px;
      width: 200px;
      height: 30px;
      line-height: 30px;
      background-image: url('~@/assets/images/title-bg.png');
      background-repeat: no-repeat;
      background-position: left top;
      background-size: cover;
      padding-left: 25px;
      font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
      font-size: 20px;
    }

    .chart-card {
      position: relative;
      background-color: rgba(41, 130, 103, 0.1);
    }
    .text-c {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 70px;
      text-align: center;
      > div:nth-child(1) {
        font-size: 14px;
        color: #666;
      }
      > div:nth-child(2) {
        margin-top: 10px;
        color: #333;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
}
</style>
