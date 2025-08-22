<template>
  <div class="full-block flex-layout justify-between home" v-loading="loading">
    <div class="row">
      <div class="row-item">
        <div class="title"><span>平台数据统计</span></div>
        <chart :option="option1" class="flex-auto" />

        <div class="position-item fItem">
          <div class="title"><span>平台数据统计</span></div>
          <chart :option="option1" class="flex-auto" />
          <i class="el-icon-close close-icon"></i>
        </div>
      </div>
      <div class="row-item">
        <div class="title"><span>危机预警情况</span></div>
        <warningSituation ref="warningSituation" class="flex-auto" />
      </div>
      <div class="row-item">
        <div class="title"><span>心理健康数据</span></div>
        <chart :option="option4" class="flex-auto" />
      </div>
    </div>
    <div class="row">
      <div class="row-item">
        <div class="title"><span>咨询问题TOP</span></div>
        <questionsTop ref="questionsTop" class="flex-auto" />

        <div class="position-item fItem">
          <div class="title"><span>咨询问题TOP</span></div>
          <questionsTop ref="questionsTopP" class="flex-auto" />
          <i class="el-icon-close close-icon"></i>
        </div>
      </div>

      <div class="row-item">
        <div class="title"><span>网络行为词云</span></div>
        <chart :option="option2" class="flex-auto" />

        <div class="position-item fItem">
          <div class="title"><span>网络行为词云</span></div>
          <chart :option="option2" class="flex-auto" />
          <i class="el-icon-close close-icon"></i>
        </div>
      </div>
      <div class="row-item">
        <div class="title"><span>心理工作情况</span></div>
        <networkingFramework ref="networkingFramework" class="flex-auto" />
      </div>
    </div>
    <div class="row">
      <div class="row-item" style="position: relative">
        <div class="title"><span>心理资源数据</span></div>
        <psychologicalResource ref="psychologicalResource" class="flex-auto" />
      </div>
      <div class="row-item">
        <div class="title"><span>应激训练情况</span></div>
        <chart :option="option3" class="flex-auto" />
      </div>
      <div class="row-item">
        <div class="title"><span>教育课程TOP</span></div>
        <div
          v-if="courseList.length > 0"
          class="flex-auto courseTop flex-layout justify-between"
        >
          <div class="item" v-for="(item, index) in courseList" :key="index">
            <div class="rank" :class="'rank' + (index + 1)">
              {{ index + 1 }}.
            </div>
            <div class="text nowrap" style="width: 210px" :title="item.label">
              {{ item.label }}
            </div>
            <div class="content">
              <div class="bar-box">
                <div
                  class="bar"
                  :class="'bar' + (index + 1)"
                  :style="{ width: item.rate + '%' }"
                >
                  <div class="dot"></div>
                </div>
              </div>
            </div>
            <div class="precent">{{ item.value }}</div>
          </div>
        </div>
        <chart v-else :option="{}" class="flex-auto" />
      </div>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import psychologicalResource from './components/psychologicalResource';
import warningSituation from './components/warningSituation';
import networkingFramework from './components/networkingFramework';
import questionsTop from './components/questionsTop';
import chartsBase from '@/components/Echarts/ChartsBase';
export default {
  components: {
    chart,
    psychologicalResource,
    warningSituation,
    networkingFramework,
    questionsTop
  },
  mixins: [chartsBase],
  data() {
    return {
      loading: false,
      option1: {
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: '工作量',
          left: '25%',
          top: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '20%',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 14,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          formatter: (name) => {
            let row = this.option1.series[0].data.find((i) => i.name == name);
            return `${row.name}   ${row.value}次`;
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '65%'],
            center: ['30%', '50%'],
            label: {
              show: false
            },
            hoverAnimation: false,
            emphasis: {
              disabled: true
            },
            data: []
          },
          {
            type: 'pie',
            radius: ['65%', '80%'],
            center: ['30%', '50%'],
            label: {
              show: false
            },
            hoverAnimation: false,
            emphasis: {
              disabled: true
            },
            data: []
          }
        ]
      },
      courseList: [],
      xlzysj: [],
      option2: {
        series: [
          {
            type: 'wordCloud',
            // shape这个属性虽然可配置，但是在词的数量不太多的时候，效果不明显，它会趋向于画一个椭圆
            // shape: "circle",
            //用函数设置矩形
            shape: function shapeSquare(theta) {
              return Math.min(
                1 / Math.abs(Math.cos(theta)),
                1 / Math.abs(Math.sin(theta))
              );
            },
            // 这个是可以自定义背景图片的，词云会按照图片的形状排布，所以有形状限制的时候，最好用背景图来实现，而且，这个背景图一定要放base64的，不然词云画不出来
            // maskImage: maskImage,
            // 下面就是位置的配置
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            right: null,
            bottom: null,
            sizeRange: [12, 60],
            // 每个词旋转的角度范围和旋转的步进
            rotationRange: [-90, 90],
            rotationStep: 45,
            // 词间距，数值越小，间距越小，这里间距太小的话，会出现大词把小词套住的情况，比如一个大的口字，中间会有比较大的空隙，这时候他会把一些很小的字放在口字里面，这样的话，鼠标就无法选中里面的那个小字，这里可以用函数根据词云的数量动态返回间距
            gridSize: 20,
            // 允许词太大的时候，超出画布的范围
            drawOutOfBound: true,
            // 布局的时候是否有动画
            layoutAnimation: true,
            // 这是全局的文字样式，相对应的还可以对每个词设置字体样式
            textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              // 颜色可以用一个函数来返回字符串，这里是随机色
              normal: {
                color: function (params) {
                  let random = Math.random(); // 生成0或1或2
                  random = Math.floor(random * 3);
                  let colorList = ['1,207,161', '255,180,0', '51,146,251'];
                  let random2 = Math.random(); //生成0.1~1的模糊度
                  random2 = random2 * 0.9 + 0.1;
                  random2 = Math.round(random2 * 10) / 10;
                  return `rgba(${colorList[random]},${random2})`;
                }
              }
            },
            emphasis: {
              focus: 'self'
            },
            data: []
          }
        ]
      },
      yjDats: [],
      option3: {
        color: ['rgb(1,207,161)', 'rgb(255,180,0)', 'rgb(51,146,251)'],
        grid: {
          left: 100,
          right: 30,
          bottom: 0,
          top: 30
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            return `${params[0].axisValueLabel}<br/>${params[0].seriesName}:${params[0].value}<br/>${params[1].seriesName}:${params[1].value}<br/>${params[2].seriesName}:${params[2].value}`;
          }
        },
        legend: {
          top: 10,
          right: 0,
          itemWidth: 12,
          itemHeight: 3,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          inverse: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '初级',
            type: 'bar',
            barWidth: 12,
            stack: 'total',
            data: [],
            itemStyle: {
              normal: {
                barBorderRadius: [0, 30, 30, 0]
              }
            }
          },
          {
            name: '中级',
            type: 'bar',
            stack: 'total',
            data: [],
            itemStyle: {
              normal: {
                barBorderRadius: [0, 30, 30, 0]
              }
            }
          },
          {
            name: '高级',
            type: 'bar',
            stack: 'total',
            data: [],
            itemStyle: {
              normal: {
                barBorderRadius: [0, 30, 30, 0]
              }
            },
            label: {
              show: true,
              position: 'right',
              formatter: (params) => {
                const dataIndex = params.dataIndex;
                let amount = 0;
                let currentAmount = 0;
                this.yjDats.forEach((v) => {
                  currentAmount += v[dataIndex];
                  for (let i = 0; i < v.length; i++) {
                    amount += v[i];
                  }
                });
                console.log(params.dataIndex, 'vvv');
                const percentage =
                  JSON.parse(currentAmount) / JSON.parse(amount);
                return (percentage * 100).toFixed(1) + '%';
              },
              color: '#fff'
            }
          }
        ]
      },
      option4: {
        dataZoom: this.getXDataZoom(5, 10),
        color: ['rgb(51,146,251)', 'rgb(248,107,106)'],
        grid: {
          left: 80,
          right: 20,
          bottom: 40,
          top: 40
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            return (
              `${params[0].name}<br/>` +
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:rgb(51,146,251);"></span>` +
              `${params[0].value}人次`
            );
          }
        },
        legend: {
          top: 10,
          right: 10,
          itemWidth: 12,
          itemHeight: 3,
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff',
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
          axisLabel: {
            color: '#fff',
            interval: 0
            // rotate: -10
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 12,
            stack: 'total',
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    this.getStatics();
    const targetElements = document.querySelectorAll('.row-item');

    targetElements.forEach((element) => {
      element.addEventListener('click', () => {
        const item = element.querySelector('.fItem');
        item.style.zIndex = 99;
      });
    });
    const closeElements = document.querySelectorAll('.close-icon');
    closeElements.forEach((element) => {
      element.addEventListener('click', () => {
        event.stopPropagation();
        const parent = element.closest('.fItem');
        parent.style.zIndex = '-99';
      });
    });
  },
  methods: {
    getStatics() {
      this.loading = true;
      this.$api.analysis
        .bigdatahome()
        .then((res) => {
          const {
            platFormList,
            courseTopList,
            earlyWarn,
            networkWords,
            reservationList,
            resource,
            riskList,
            vrTrainList
          } = res.result;
          this.initXlgzqk(platFormList);
          this.initJykctop10(courseTopList);
          const keys = Object.keys(networkWords);
          const wlxwjj = [];
          for (let i = 0; i < keys.length; i++) {
            wlxwjj.push({
              name: keys[i],
              value: networkWords[keys[i]]
            });
          }
          this.initWlxwjj(wlxwjj);
          this.initXlzysj(resource);
          this.initCjxlqk(vrTrainList);
          this.initZxwttop10(reservationList);
          this.initXljksj(riskList);
          this.initWjyjqk(earlyWarn);
          this.initXlfwwlkj();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 平台数据统计
    initXlgzqk(data) {
      data = data.map((v) => {
        return {
          name: v.label,
          value: v.value
        };
      });
      var color1 = [
        'rgb(1,207,161)',
        'rgb(255,180,0)',
        'rgb(248,107,106)',
        'rgb(51,146,251)',
        'rgb(30,231,231)'
      ];
      var color2 = [
        'rgba(1,207,161,0.3)',
        'rgba(255,180,0,0.3)',
        'rgba(248,107,106,0.3)',
        'rgba(51,146,251,0.3)',
        'rgba(30,231,231,0.3)'
      ];
      this.option1.series[0].data =
        data?.length > 0
          ? data.map((v, index) => {
              return {
                ...v,
                itemStyle: {
                  color: color1[index]
                }
              };
            })
          : [];
      this.option1.series[1].data =
        data?.length > 0
          ? data.map((v, index) => {
              return {
                ...v,
                itemStyle: {
                  color: color2[index]
                }
              };
            })
          : [];
    },
    // 教育课程TOP10
    initJykctop10(data) {
      let maxValue = 0;
      for (let i = 0; i < data.length; i++) {
        maxValue = Math.max(maxValue, parseInt(data[i].value));
      }
      const courseList = data.map((v) => {
        const percentage = (parseInt(v.value) / maxValue) * 100;
        return {
          ...v,
          rate: percentage
        };
      });
      this.courseList = courseList;
    },
    // 网络行为聚焦
    initWlxwjj(data) {
      this.option2.series[0].data = data;
    },
    // 心理资源数据
    initXlzysj(data) {
      const colors = [
        'rgba(37,155,165,0.8)',
        '#01cfa1',
        '#8ECFF2',
        '#F6BA4E',
        '#EF7D32'
      ];
      const optionData = data.map((v, index) => {
        return {
          name: v.label,
          value: parseInt(v.value),
          unit: v.unit ? v.unit : '',
          itemStyle: {
            color: colors[index % colors.length]
          }
        };
      });
      this.xlzysj = optionData;
      this.$refs.psychologicalResource.optionData = optionData;
      this.$refs.psychologicalResource.init();
    },
    // 应激训练
    initCjxlqk(data) {
      console.log(data, '=======场景训练情况======');
      const keys = Object.keys(data);
      if (keys.length > 0) {
        let cjData = [];
        let zjData = [];
        let gjData = [];
        for (let i = 0; i < keys.length; i++) {
          const item = data[keys[i]];
          const cjItem = item.find((v) => v.level == 1);
          const zjItem = item.find((v) => v.level == 2);
          const gjItem = item.find((v) => v.level == 3);
          if (cjItem) {
            cjData.push(cjItem.value);
          } else {
            cjData.push(0);
          }
          if (zjItem) {
            zjData.push(zjItem.value);
          } else {
            zjData.push(0);
          }
          if (gjItem) {
            gjData.push(gjItem.value);
          } else {
            gjData.push(0);
          }
        }
        this.option3.yAxis.data = keys;
        this.option3.series[0].data = cjData;
        this.option3.series[1].data = zjData;
        this.option3.series[2].data = gjData;
        this.yjDats = [cjData, zjData, gjData];
      }
    },
    // 心理健康数据
    initXljksj(data) {
      this.option4.xAxis.data = data.map((v) => v.label);
      this.option4.series[0].data = data.map((v) => JSON.parse(v.value));
    },
    // 危机预警情况
    initWjyjqk(data) {
      //   if (data.length > 0) {
      let list = [];
      // const level_1 = data.find((v) => v.name == 'level_1');
      // const level_2 = data.find((v) => v.name == 'level_2');
      // const level_3 = data.find((v) => v.name == 'level_3');
      // const level_1_rate = data.find((v) => v.name == 'level_1_rate');
      // const level_2_rate = data.find((v) => v.name == 'level_2_rate');
      // const level_3_rate = data.find((v) => v.name == 'level_3_rate');
      // const total = data.find((v) => v.name == 'total');

      // const levelAmount =
      //   JSON.parse(level_1.value) +
      //   JSON.parse(level_2.value) +
      //   JSON.parse(level_3.value);
      // list.push({
      //   name: '一级预警',
      //   rs: level_1.value,
      //   rate: ((JSON.parse(level_1.value) / levelAmount) * 100).toFixed(1),
      //   upRate: level_1_rate.value
      // });
      // list.push({
      //   name: '二级预警',
      //   rs: level_2.value,
      //   rate: ((JSON.parse(level_2.value) / levelAmount) * 100).toFixed(1),
      //   upRate: level_2_rate.value
      // });
      // list.push({
      //   name: '三级预警',
      //   rs: level_3.value,
      //   rate: ((JSON.parse(level_3.value) / levelAmount) * 100).toFixed(1),
      //   upRate: level_3_rate.value
      // });
      // const opList = list.map((v) => {
      //   return {
      //     value: v.rs,
      //     name: v.name
      //   };
      // });
      const warningSituation = this.$refs.warningSituation;
      var yjMap = {
        1: '一级预警',
        2: '二级预警',
        3: '三级预警'
      };
      let amount = data.currentWarnList
        .map((v) => Number(v.value))
        .reduce((a, b) => a + b);
      console.log(amount, 'vvv');

      data.currentWarnList.forEach((item) => {
        const lastMonthItem = data.lastMonthWarnList.find(
          (v) => v.label == item.label
        );
        console.log(lastMonthItem, 'lastMonthItem', item, item.value);
        let rateText = '';
        if (Number(item.value) >= Number(lastMonthItem.value)) {
          rateText = `上升${(
            ((item.value - lastMonthItem.value) / lastMonthItem.value) *
            100
          ).toFixed(1)}%`;
        } else {
          rateText = `下降${(
            ((lastMonthItem.value - item.value) / lastMonthItem.value) *
            100
          ).toFixed(1)}%`;
        }
        list.push({
          name: yjMap[item.label],
          rs: item.value,
          rate: ((JSON.parse(item.value) / amount) * 100).toFixed(1),
          upRate: rateText
        });
      });
      warningSituation.list = list;
      warningSituation.option.series[0].data = data.currentWarnList.map((v) => {
        return {
          value: v.value,
          name: yjMap[v.label]
        };
      });
      warningSituation.currentAmount = data.warnCurrentCount;
      warningSituation.total = data.warnTotalCount;
      //   }
    },
    // 心理服务网络框架
    initXlfwwlkj() {
      //
      this.$api.basics.psyworkconditionList().then((res) => {
        this.$refs.networkingFramework.list = res.result;
        this.$nextTick(() => {
          this.$refs.networkingFramework.init();
        });
      });
    },
    // 咨询问题TOP
    initZxwttop10(data) {
      const questionsTop = this.$refs.questionsTop;
      const questionsTopP = this.$refs.questionsTopP;
      questionsTop.yy = data.currentMonthReservationCount;
      questionsTop.zx = data.currentMonthCounselCount;
      questionsTopP.yy = data.currentMonthReservationCount;
      questionsTopP.zx = data.currentMonthCounselCount;
      if (data.currentMonthReservationCount >= data.lastMonthReservationCount) {
        const reversePrecent =
          (data.currentMonthReservationCount - data.lastMonthReservationCount) /
          data.lastMonthReservationCount;
        questionsTop.yyPercent = `上升${(reversePrecent * 100).toFixed(0)}%`;
        questionsTopP.yyPercent = `上升${(reversePrecent * 100).toFixed(0)}%`;
        console.log(reversePrecent, 'mmm');
      } else {
        const reversePrecent =
          (data.lastMonthReservationCount - data.currentMonthReservationCount) /
          data.lastMonthReservationCount;
        questionsTop.yyPercent = `下降${(reversePrecent * 100).toFixed(0)}%`;
        questionsTopP.yyPercent = `下降${(reversePrecent * 100).toFixed(0)}%`;
      }

      if (data.currentMonthCounselCount >= data.lastMonthCounselCount) {
        const coursePrecent =
          (data.currentMonthCounselCount - data.lastMonthCounselCount) /
          data.lastMonthCounselCount;
        questionsTop.zxPercent = `上升${(coursePrecent * 100).toFixed(0)}%`;
        questionsTopP.zxPercent = `上升${(coursePrecent * 100).toFixed(0)}%`;
      } else {
        const coursePrecent =
          (data.lastMonthCounselCount - data.currentMonthCounselCount) /
          data.lastMonthCounselCount;
        questionsTop.zxPercent = `下降${(coursePrecent * 100).toFixed(0)}%`;
        questionsTopP.zxPercent = `下降${(coursePrecent * 100).toFixed(0)}%`;
      }
      const questionTopList = data.questionTopList;
      questionsTop.option.xAxis.data = questionTopList.map(
        (item) => item.label
      );
      questionsTopP.option.xAxis.data = questionTopList.map(
        (item) => item.label
      );
      questionsTop.option.series[0].data = questionTopList.map(
        (item) => item.value
      );
      questionsTopP.option.series[0].data = questionTopList.map(
        (item) => item.value
      );
    },

    wordClick(data) {
      this.$router.push({
        path: '/feature',
        query: {
          word: data.name
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 0px 20px 20px;

  box-sizing: border-box;
  .row {
    height: calc((100% - 40px) / 3);
    display: flex;
    justify-content: space-between;
    .row-item {
      width: calc((100% - 40px) / 3);
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px;
      box-sizing: border-box;
      background-color: rgba(41, 130, 103, 0.1);

      .courseTop {
        padding: 20px 10px 0px 10px;
        box-sizing: border-box;
        font-size: 16px;
        .item {
          display: flex;
          align-items: center;
          .rank {
            margin-right: 5px;
          }
          .text {
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 1px;
            color: #dffeff;
          }
          .rank1 {
            color: #ffb400;
          }
          .rank2 {
            color: #f86b6a;
          }
          .rank3 {
            color: #3494ff;
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
              border-radius: 2px;
              border: 1px solid rgba(223, 254, 255, 0.15);
              flex: 1;

              .bar {
                position: relative;
                height: 4px;
                border-radius: 2px;
                z-index: 99;
                background-image: linear-gradient(
                  90deg,
                  rgba(1, 207, 161, 0.25) 0%,
                  rgba(1, 207, 161, 0.85) 80%,
                  #ffefc9 100%
                );
                &::after {
                  position: absolute;
                  width: 4px;
                  height: 6px;
                  content: '';
                  background: #fff;
                  right: 0px;
                  top: -1px;
                  z-index: 0;
                  border-radius: 2px 4px 4px 2px;
                }
              }
              .bar1 {
                background-image: linear-gradient(
                  90deg,
                  rgba(255, 180, 0, 0.25) 0%,
                  rgba(255, 180, 0, 0.85) 80%,
                  #ffffff 100%
                );
              }
              .bar2 {
                background-image: linear-gradient(
                  90deg,
                  rgba(248, 107, 106, 0.25) 0%,
                  rgba(248, 107, 106, 0.85) 80%,
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
            }
          }
          .precent {
            width: 40px;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #ffffff;
          }
        }
      }
    }
  }
  .title {
    height: 30px;
    background-image: url('~@/assets/images/title-bg.png');
    background-repeat: no-repeat;
    background-position: left top;
    background-size: cover;
    padding-left: 25px;
    font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
    font-size: 20px;
    span {
      position: relative;
      top: -5px;
    }
  }
  .noData {
    position: relative;
    height: 100%;
    width: 100%;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .position-item {
    position: fixed;
    display: flex;
    flex-direction: column;
    width: 1000px;
    aspect-ratio: 611/262;
    left: 50%;
    margin-left: -500px;
    top: 50%;
    margin-top: -200px;
    padding: 16px;
    background-image: url('~@/assets/images/main-bg.png');
    background-position: center;
    background-size: cover;
    border-radius: 5px;
    box-shadow: rgba(41, 130, 103, 0.8) 0px 0px 10px 2px;
    z-index: -1;
    i {
      position: absolute;
      right: 10px;
      top: 14px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #999;
      background: rgba(41, 130, 103, 0.5);
      border-radius: 50%;
      z-index: 2;
    }
  }
}
</style>
