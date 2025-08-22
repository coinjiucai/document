<template>
  <div class="full-block xlzy flex-row">
    <img
      class="back-button"
      src="@/assets/images/back.png"
      style="width: 40px"
      @click="$router.go(-1)"
    />
    <div class="left">
      <div class="box-item flex-layout">
        <div class="flex-none box-title mb20"><span>职业成熟度</span></div>
        <chart :option="option1" class="flex-auto"></chart>
      </div>
      <div class="box-item flex-layout">
        <div class="flex-none box-title mb20"><span>兴趣</span></div>
        <chart :option="option2" class="flex-auto"></chart>
      </div>
      <div class="box-item flex-layout">
        <div class="flex-none box-title mb20"><span>职业信念</span></div>
        <chart :option="option3" class="flex-auto"></chart>
      </div>
      <div class="box-item flex-layout">
        <div class="flex-none box-title"><span>决策风格</span></div>
        <div class="flex-auto">
          <div class="jcfg">
            <div class="hz">
              <div class="arrow-up"></div>
            </div>
            <div class="zz"><div class="arrow-up"></div></div>
            <div class="nr">
              <div
                :style="{ 'background-color': jcfg[0].color }"
                :title="jcfg[0].name + ':' + jcfg[0].value"
              >
                {{ jcfg[0].name }}
              </div>
              <div
                :style="{ 'background-color': jcfg[1].color }"
                :title="jcfg[1].name + ':' + jcfg[1].value"
              >
                {{ jcfg[1].name }}
              </div>
              <div
                :style="{ 'background-color': jcfg[2].color }"
                :title="jcfg[2].name + ':' + jcfg[2].value"
              >
                {{ jcfg[2].name }}
              </div>
              <div
                :style="{ 'background-color': jcfg[3].color }"
                :title="jcfg[3].name + ':' + jcfg[3].value"
              >
                {{ jcfg[3].name }}
              </div>
            </div>
            <div class="wz-gd">
              <div>高</div>
              <div>低</div>
            </div>
            <div class="wz-csl">模糊承受力</div>
            <div class="wz-lxzj">
              <div>理性</div>
              <div>直觉</div>
            </div>
            <div class="wz-swfs">思维方式</div>
          </div>
        </div>
        <div style="font-size: 13px; text-align: center">
          哪个区域颜色越深代表其得分越高
        </div>
      </div>
    </div>
    <div class="right flex-layout">
      <div class="flex-none box-title mb20"><span>价值观</span></div>
      <div class="flex-auto flex-layout justify-between">
        <template v-for="(item, index) in list">
          <el-tooltip effect="dark" :content="item.value" :key="index">
            <div class="flex-row align-center item">
              <span class="flex-none name mr10">
                {{ item.name }}
              </span>
              <el-progress
                class="flex-auto mr10"
                :percentage="parseFloat(item.progress)"
                :stroke-width="10"
                :show-text="false"
                define-back-color="rgba(255,255,255,.2)"
              >
              </el-progress>
              <span class="flex-none rate">{{ item.rate }}%</span>
            </div>
          </el-tooltip>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
// occupationalPsychology
import 'echarts-gl'; // 引入 echarts-gl
let careerBeliefList = [];
export default {
  components: {
    chart
  },
  data() {
    return {
      option1: {
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
            data: [
              {
                value: [],
                name: '职业成熟度'
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
        ],
        // 配置 tooltip
        tooltip: {
          trigger: 'item',
          show: true
        }
      },
      option2: {
        // 配置 tooltip
        tooltip: {
          trigger: 'item',
          show: true
        },
        radar: {
          shape: 'circle',
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
            data: [
              {
                name: '兴趣',
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
      option3: {
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            const dataIndex = params.dataIndex;
            return `${params.name}: ${careerBeliefList[dataIndex].value}`;
          }
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            data: [],
            links: [],
            roam: true, //添加缩放和移动
            draggable: true, //这里设置为false，不然拖拽鼠标和节点有偏移
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(14,54,53,0)' // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(14,54,53,0.3)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#18a17a' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              },
              borderColor: 'rgba(52,180,141,0.7)',
              shadowColor: 'rgba(52,180,141,0.8)', // 设置阴影颜色
              shadowBlur: 20, // 设置阴影模糊程度
              shadowOffsetX: 0, // 设置阴影在 X 轴的偏移
              shadowOffsetY: 0 // 设置阴影在 Y 轴的偏移
            },
            // symbolSize: function (value, params) {
            //   //改变节点大小
            //   var SizeList = [40, 45, 50, 55, 100];
            //   return SizeList[params.dataIndex];
            // },

            label: {
              normal: {
                show: true,
                position: 'inside',
                fontSize: 14, // 设置文字大小
                color: '#2cb684', // 设置文字颜色
                rich: {
                  bg: {
                    // backgroundColor: "#fff",
                  }
                }
              }
            },
            force: {
              gravity: 0.01,
              edgeLength: 180
            }
          }
        ]
      },
      list: [],
      jcfg: [
        {
          name: '分析型',
          value: 0,
          color: 'rgba(26, 187, 151, 0.1)'
        },
        {
          name: '概念型',
          value: 0,
          color: 'rgba(26, 187, 151, 0.1)'
        },
        {
          name: '定向型',
          value: 0,
          color: 'rgba(26, 187, 151, 0.1)'
        },
        {
          name: '行为型',
          value: 0,
          color: 'rgba(26, 187, 151, 0.1)'
        }
      ]
    };
  },
  mounted() {
    const query = this.$route.query;
    if (query.userId) {
      this.getZyxlData(query.userId);
    }
  },
  methods: {
    getZyxlData(userId) {
      this.$api.analysis.occupationalPsychology({ userId }).then((res) => {
        console.log(res.result, 'sss');
        const {
          careerMaturityList,
          hobbyList,
          decisionStyleList,
          personalValues
        } = res.result;
        if (careerMaturityList) {
          this.initZycsd(careerMaturityList);
        }
        if (hobbyList) {
          this.initXq(hobbyList);
        }
        if (res.result && res.result.careerBeliefList) {
          careerBeliefList = res.result.careerBeliefList;
          this.initZyxn(res.result.careerBeliefList);
        }
        if (decisionStyleList) {
          const values = decisionStyleList.map((v) => {
            return Number(v.value);
          });
          const decisionStyleMax = Math.max(...values);
          this.jcfg = this.jcfg.map((v) => {
            const item = decisionStyleList.find(
              (item) => item.label === v.name
            );
            const value = Number(item.value);
            const colorOpacity = 0.8 * (value / decisionStyleMax) + 0.1;
            return {
              value: Number(item.value),
              name: item.label,
              color: `rgba(26,187,151,${colorOpacity})`
            };
          });
        }
        if (personalValues) {
          this.initJzg(personalValues);
        }
      });
    },
    // 职业成熟度
    initZycsd(data) {
      var max = 5;
      //   for (var i = 0; i < data.length; i++) {
      //     const value = parseInt(data[i].value);
      //     if (value > max) {
      //       max = value;
      //     }
      //   }
      const indicator = data.map((v) => {
        return {
          name: v.label,
          max: max
        };
      });
      const series = data.map((v) => Number(v.value).toFixed(2));
      this.option1.radar.indicator = indicator;
      this.option1.series[0].data[0].value = series;
    },
    // 兴趣
    initXq(data) {
      var max = 10;
      for (var i = 0; i < data.length; i++) {
        const value = Number(data[i].value);
        if (value > max) {
          max = value;
        }
      }
      const indicator = data.map((v) => {
        return {
          name: v.label,
          max: max
        };
      });
      const series = data.map((v) => parseInt(v.value));
      this.option2.radar.indicator = indicator;
      this.option2.series[0].data[0].value = series;
    },
    // 职业信念
    initZyxn(data) {
      let hasData = false;
      const list = data.map((v, idx) => {
        if (Number(v.value) > 0) {
          hasData = true;
        }
        return {
          name: v.label,
          id: idx + 1 + '',
          symbolSize: (Number(v.value) * 4).toFixed(1)
        };
      });
      if (hasData) {
        this.option3.series[0].data = list;
      }
    },
    // 价值观
    initJzg(data) {
      var amount = 0;
      var max = 0;
      for (let i = 0; i < data.length; i++) {
        const value = Number(data[i].value);
        amount += value;
        if (value > max) {
          max = value;
        }
      }
      this.list = data.map((v) => {
        return {
          name: v.label,
          rate: ((Number(v.value) / amount) * 100).toFixed(1),
          progress: ((Number(v.value) / max) * 100).toFixed(1),
          value: v.value
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.xlzy {
  position: relative;
  padding: 35px 20px 20px;
  .back-button {
    position: absolute;
    display: block;
    object-fit: contain;
    height: 40px !important;
    top: -5px;
    left: 15px;
    cursor: pointer;
  }
  .left {
    width: calc((100% - 20px) / 3 * 2);
    margin-right: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    .box-item {
      width: calc(50% - 10px);
      height: calc(50% - 10px);
      padding: 20px;
      box-sizing: border-box;
      background-color: rgba(41, 130, 103, 0.1);
    }
  }
  .right {
    width: calc((100% - 20px) / 3);
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(41, 130, 103, 0.1);
    .item {
      .name {
        width: 100px;
        font-size: 14px;
        color: #aaeeb8;
      }
      .rate {
        width: 50px;
      }
    }
  }
  .leadership {
    position: relative;
    .ls-item {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('~@/assets/images/portrait/circle3.png');
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
    .ls-item1 {
      top: 10%;
      left: 10%;
      width: 200px;
      height: 200px;
      z-index: 100;
    }
    .ls-item2 {
      top: 0%;
      left: 28%;
      width: 200px;
      height: 200px;
    }
    .ls-item3 {
      top: 10%;
      left: 70%;
      width: 100px;
      height: 100px;
      font-size: 12px;
    }
    .ls-item4 {
      bottom: 6%;
      left: 6%;
      width: 100px;
      height: 100px;
      font-size: 12px;
    }
    .ls-item5 {
      bottom: 0%;
      left: 20%;
      width: 150px;
      height: 150px;
      font-size: 16px;
      z-index: 200;
    }
    .ls-item6 {
      bottom: 2%;
      left: 50%;
      width: 150px;
      height: 150px;
      font-size: 16px;
    }
  }
  .jcfg {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .hz {
      position: absolute;
      width: 87%;
      height: 1px;
      background: #fff;
      bottom: 30px;
      left: 40px;
      .arrow-up {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 8px solid #ffffff;
        transform: rotate(90deg);
        position: absolute;
        right: -3px;
        top: -4px;
      }
    }
    .zz {
      position: absolute;
      width: 1px;
      top: 60px;
      background: #fff;
      bottom: 30px;
      left: 40px;
      .arrow-up {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 8px solid #ffffff;
        position: absolute;
        left: -6px;
        top: -4px;
      }
    }
    .wz-gd {
      position: absolute;
      top: 70px;
      left: 20px;
      height: 60%;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .wz-csl {
      position: absolute;
      left: 50px;
      width: 10px;
      font-size: 12px;
      top: 40%;
    }
    .wz-lxzj {
      position: absolute;
      left: 50px;
      bottom: 10px;
      width: 80%;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    .wz-swfs {
      position: absolute;
      left: 50px;
      bottom: 40px;
      width: 80%;
      display: flex;
      justify-content: center;
      font-size: 12px;
    }
    .nr {
      width: 60%;
      font-size: 12px;
      color: #fff;
      position: absolute;
      left: 82px;
      bottom: 71px;
      > div {
        width: 50%;
        height: 90px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
