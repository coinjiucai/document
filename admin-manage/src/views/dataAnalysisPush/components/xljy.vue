<template>
  <div class="analysis-container" v-loading="loading">
    <div class="one">
      姓名：{{ userInfo ? userInfo.realname : '--' }} <span>|</span> 性别：{{
        userInfo ? userInfo.sex_dictText : '--'
      }}
      <span>|</span> 年龄：{{ userInfo ? userInfo.age : '--' }}
    </div>
    <div class="two" v-loading="loading">
      <div
        style="display: flex; height: calc(38% - 6.5px); margin-bottom: 13px"
      >
        <div
          class="box ca card"
          style="
            width: calc(33% - 6.5px);
            height: 100%;
            margin-right: 13px;
            float: left;
          "
        >
          <div class="yqlist">
            <ul class="clearfix" style="transform: scale(0.9); margin-top: 0px">
              <li>
                <div class="yq" id="yq">{{ info['practiceTotal'] }}</div>
                <span>参与练习总数</span>
              </li>
              <li>
                <div class="yq">{{ info['courseTotal'] }}</div>
                <span>课程总数</span>
              </li>
              <li style="margin-top: 10px">
                <div class="yq">{{ info['practiceNum'] }}</div>
                <span>练习总数</span>
              </li>
              <li style="margin-top: 10px">
                <div class="yq">{{ info['questionTotal'] }}</div>
                <span>试题总数</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="box" style="flex: 1; height: 100%">
          <div class="card">
            <div class="header">当前学习情况</div>
            <div style="width: 100%; height: calc(100% - 30px)">
              <div style="width: 150px; float: left; height: 100%">
                <div
                  style="
                    text-align: center;
                    font-size: 14px;
                    margin-top: 10px;
                    line-height: 1.7;
                  "
                >
                  正在进行的课程:<br />
                  <span style="color: #30cd8c">{{
                    info.courseGoingNum ? info.courseGoingNum : 0
                  }}</span
                  >场
                </div>
                <div
                  style="
                    text-align: center;
                    font-size: 14px;
                    margin-top: 10px;
                    line-height: 1.7;
                  "
                >
                  正在学习的人数:<br />
                  <span style="color: #30cd8c">{{
                    info.practiceGoingNum ? info.practiceGoingNum : 0
                  }}</span
                  >人
                </div>
              </div>
              <div
                style="
                  width: calc(100% - 150px);
                  display: inline-block;
                  height: 100%;
                "
              >
                <chart class="chart" :option="options1"></chart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style="height: calc(30% - 6.5px); overflow: hidden; margin-bottom: 13px"
      >
        <div class="card">
          <div class="header">
            已完成的练习
            <div style="float: right">
              <span
                >正在进行的练习：<span
                  style="color: #30cd8c; font-size: 18px"
                  >{{ info.practiceGoingNum ? info.practiceGoingNum : 0 }}</span
                ></span
              >
            </div>
          </div>
          <div style="width: 100%; height: calc(100% - 30px)">
            <template
              v-if="
                info && info.completedList && info.completedList.length == 0
              "
            >
              <el-empty :image-size="80" :image="noData"></el-empty>
            </template>

            <div
              class="biaoge biaoge_list"
              style="width: 100%; height: 17vh; overflow: hidden"
              v-else-if="info.completedList && info.completedList.length > 0"
            >
              <div class="biaoge_listIn">
                <ul class="ul_title">
                  <li>考试名称</li>
                  <li>时间</li>
                  <li>已练人数</li>
                </ul>
                <div class="ul_list">
                  <div
                    class="ul_listIn"
                    style="overflow-y: auto"
                    :class="{ animate: info.completedList.length > 5 }"
                  >
                    <ul
                      class="ul_con"
                      v-for="(v, index) in info.completedList"
                      :key="index"
                    >
                      <li>{{ v.questionnaireName }}</li>
                      <li>
                        {{ formatter(v.startTime) }}-{{ formatter(v.endTime) }}
                      </li>
                      <li>{{ v.completedCount }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- <chart class="chart" :option="options"></chart> -->
          </div>
        </div>
      </div>
      <div style="height: calc(30.5% - 6.5px); overflow: hidden">
        <div class="card">
          <div class="header">
            正在进行的课程（<span style="color: #30cd8c"
              >{{ info.courseGoingNum ? info.courseGoingNum : 0 }}个</span
            >）
            <div style="float: right">
              <span
                >总学习时长：

                <span v-html="formatSeconds(learnDrurtion)"></span>
              </span>
            </div>
          </div>
          <div style="width: 100%; height: calc(100% - 30px)">
            <template
              v-if="
                info && info.courseGoingList && info.courseGoingList.length == 0
              "
            >
              <el-empty :image-size="80" :image="noData"></el-empty>
            </template>
            <div
              class="biaoge biaoge_list"
              style="width: 100%; height: 17vh; overflow: hidden"
              v-else-if="
                info.courseGoingList && info.courseGoingList.length > 0
              "
            >
              <div class="biaoge_listIn">
                <ul class="ul_title">
                  <li>考试名称</li>
                  <li>时间</li>
                  <li>学习时长</li>
                </ul>
                <div class="ul_list">
                  <div
                    class="ul_listIn"
                    style="overflow-y: auto"
                    :class="{ animate: info.courseGoingList.length > 5 }"
                  >
                    <ul
                      class="ul_con"
                      v-for="(v, index) in info.courseGoingList"
                      :key="index"
                    >
                      <li>{{ v.courseName }}</li>
                      <li>{{ formatter(v.readStartTime) }}</li>
                      <li v-html="formatSeconds(v.readDuration)"></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
const noData = require('@/assets/images/no-data.png');
import moment from 'moment';
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
      info: {
        practiceTotal: 0,
        courseTotal: 0,
        practiceNum: 0,
        questionTotal: 0
      },
      // 当前考试情况
      options1: {
        dataZoom: this.getXDataZoom(8, 10),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#dddc6b'
            }
          }
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          left: 20,
          right: 20,
          top: 10,
          pageIconColor: '#999', // 翻页按钮颜色
          data: [],
          textStyle: {
            color: 'rgba(255,255,255,.5)',
            fontSize: '12'
          }
        },
        grid: {
          left: '5',
          top: '40',
          right: 70,
          bottom: '10',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
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
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 12
              }
            },

            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ],
        series: []
      }
    };
  },
  methods: {
    init() {
      this.getStatics(this.userInfo.id);
    },
    formatter(val) {
      return moment(val).format('yyyy-MM-DD HH:mm');
    },

    getStatics(id) {
      this.loading = true;
      this.$api.analysis
        .coursestatistics({
          userId: id,
          ...this.param
        })
        .then((res) => {
          const result = res.result;
          this.info = result;
          // courseLabelList
          const courseLabelList = result.courseLabelList;
          const keys = Object.keys(courseLabelList);
          this.options1.legend.data = keys;

          let seriesData = [];
          if (keys.length > 0) {
            const xDatas = courseLabelList[keys[0]].map((v) => v.time);
            if (xDatas.length <= 8) {
              this.options1.dataZoom = null;
            }
            this.options1.xAxis[0].data = xDatas;
            const colors = [
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(137, 189, 27, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(137, 189, 27, 0)'
                  }
                ],
                b: '#1cc840'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(219, 50, 51, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(219, 50, 51, 0)'
                  }
                ],
                b: '#eb5690'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(137, 189, 27, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(137, 189, 27, 0)'
                  }
                ],
                b: '#43bbfb'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(1, 152, 213, 0.4)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(1, 152, 213, 0.1)'
                  }
                ],
                b: 'rgba(1, 152, 213)'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(255, 193, 7, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(255, 193, 7, 0)'
                  }
                ],
                b: '#ffc107'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(156, 39, 176, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(156, 39, 176, 0)'
                  }
                ],
                b: '#9c27b0'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(244, 67, 54, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(244, 67, 54, 0)'
                  }
                ],
                b: '#f44336'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(76, 175, 80, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(76, 175, 80, 0)'
                  }
                ],
                b: '#4caf50'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(63, 81, 181, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(63, 81, 181, 0)'
                  }
                ],
                b: '#3f51b5'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(255, 152, 0, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(255, 152, 0, 0)'
                  }
                ],
                b: '#ff9800'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(0, 150, 136, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(0, 150, 136, 0)'
                  }
                ],
                b: '#009688'
              },
              {
                a: [
                  {
                    offset: 0,
                    color: 'rgba(121, 85, 72, 0.3)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(121, 85, 72, 0)'
                  }
                ],
                b: '#795548'
              }
            ];
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              const value = courseLabelList[key];
              const sData = value.map((v) => v.count);
              const index = i % colors.length;
              seriesData.push({
                name: key,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                  normal: {
                    color: colors[index].b,
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
                      colors[index].a,
                      false
                    ),
                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                  }
                },
                itemStyle: {
                  normal: {
                    color: colors[index].b
                  }
                },
                data: sData
              });
            }
          } else {
            this.options1.xAxis[0].data = [];
          }

          this.options1.series = seriesData;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatSeconds(seconds) {
      const duration = moment.duration(seconds, 'seconds');

      if (seconds < 60) {
        return `<span style="color: #30cd8c">${seconds}</span>秒`; // 小于60秒，返回 Xs
      } else if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0
          ? `<span style="color: #30cd8c">${mins.toFixed(
              0
            )}</span>分钟<span style="color: #30cd8c">${secs.toFixed(
              0
            )}</span>秒`
          : `<span style="color: #30cd8c">${mins}</span>分钟`; // 大于60秒但小于1小时，返回 X分钟Ys
      } else {
        const hours = Math.floor(seconds / 3600);
        const remainingSecs = seconds % 3600;
        const mins = Math.floor(remainingSecs / 60);
        const secs = remainingSecs % 60;

        let result = `<span style="color: #30cd8c">${hours}</span>小时`;
        if (mins > 0)
          result += `<span style="color: #30cd8c">${mins.toFixed(
            0
          )}</span>分钟`;
        if (secs > 0)
          result += `<span style="color: #30cd8c">${secs.toFixed(0)}</span>秒`;
        return result; // 大于1小时，返回 X小时Y分钟Zs
      }
    }
  },
  computed: {
    learnDrurtion() {
      if (this.info && this.info.courseGoingList) {
        let count = 0;
        this.info.courseGoingList.forEach((element) => {
          count += element.readDuration;
        });
        return count;
      } else {
        return 0;
      }
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val && val.id) {
          this.getStatics(val.id);
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
    margin: 0px 0 10px;
    font-size: 16px;
    span {
      font-size: 14px;
      margin: 0 10px;
    }
    .cs {
      margin: 0;
      font-size: 16px;
      color: #30cd8c;
    }
  }
  .two {
    flex: 1;
    .box {
      display: inline-block;
      // border: 1px solid #79b1e9;
      // background-color: rgba(129, 151, 189, 0.2);
      background-color: rgba(41, 130, 103, 0.1);
      box-shadow: 5px 8px 5px 0px rgba(6, 27, 48, 0.51);
    }
    .card {
      width: 100%;
      height: 100%;
      background-color: rgba(41, 130, 103, 0.1);
      box-shadow: 5px 8px 5px 0px rgba(6, 27, 48, 0.51);
      .header {
        width: 100%;
        height: 30px;
        line-height: 28px;
        font-size: 14px;
        padding: 0 16px;
        border-bottom: 1px solid rgba(41, 130, 103, 0.5);
        //
      }
    }
  }

  .ca {
    // padding: 20px 0 20px 35px;
    > div {
      width: 50%;
      float: left;
      flex: 1;
      display: flex;
      align-items: center;

      // justify-content: center;
      .icon {
        background-size: auto 100%;
        width: 60px;
        height: 70px;
        // background-image: url("~@/assets/images/sjtj/nav.png");
        background-repeat: no-repeat;
        img {
          width: 50px;
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
}
.yqlist {
  width: 100% !important;
}
.yqlist li {
  float: left;
  width: 50%;
  padding-bottom: 10px;
  text-align: center;
  list-style-type: none;
}
.yq {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: electronicFont;
  color: #fff32b;
}
.yqlist li span {
  opacity: 0.6;
  font-size: 14px;
  margin-top: 5px;
}

.yq:before {
  position: absolute;
  width: 100%;
  height: 100%;
  content: '';
  background: url('~@/assets/images/img1.png') center center;
  border-radius: 100px;
  background-size: 100% 100%;
  opacity: 0.3;
  left: 0;
  top: 0;
  animation: myfirst2 15s infinite linear;
}

.yq:after {
  position: absolute;
  width: 86%;
  background: url('~@/assets/images/img2.png') center center;
  border-radius: 100px;
  background-size: 100% 100%;
  opacity: 0.3;
  height: 86%;
  content: '';
  left: 7%;
  top: 7%;
  animation: myfirst 15s infinite linear;
}

@keyframes myfirst {
  to {
    transform: rotate(-360deg);
  }
}
@keyframes myfirst2 {
  to {
    transform: rotate(360deg);
  }
}

/*右下角表格*/
.biaoge {
  overflow: hidden;
}
.biaoge_list {
  overflow: hidden;
  position: relative;
}
.biaoge_list .biaoge_listIn .ul_list {
  overflow: hidden;
  position: relative;
}
.biaoge_list .biaoge_listIn .animate {
  -webkit-animation: 10s gundong linear infinite normal;
  animation: 10s gundong linear infinite normal;
  position: relative;
}
.biaoge_list .biaoge_listIn .animate:hover {
  animation-play-state: paused;
}
@keyframes gundong {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, -50%, 0);
    transform: translate3d(0, -50%, 0);
  }
}

.biaoge_list ul {
  display: flex;
  display: -webkit-flex;
  width: 100%;
  margin: 0;
}
.biaoge_list .ul_title {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.1)
  );
  background: -ms-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.1)
  );
  background: -webkit-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.1)
  );
  background: -moz-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.1)
  );
}
.biaoge_list .ul_con {
  border-bottom: 1px solid rgba(14, 253, 255, 0.1);
}
.biaoge_list ul li {
  width: 33%;
  text-align: center;
  color: #fff;
  font-size: 14px;
  // height: 0.2rem;
  // line-height: 0.2rem;
  list-style-type: none;
  padding: 6px 0;
}
.biaoge_list ul li:frist-child {
  text-align: left;
}
.biaoge_list ul li:last-child {
  color: #30cd8c;
  cursor: pointer;
}
</style>
