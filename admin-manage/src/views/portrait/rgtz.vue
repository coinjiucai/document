<template>
  <div class="full-block rgtz flex-row justify-between">
    <img
      class="back-button"
      src="@/assets/images/back.png"
      style="width: 40px"
      @click="$router.go(-1)"
    />
    <div class="box-item flex-layout">
      <div
        class="flex-none box-title flex-row justify-between align-center pr10"
      >
        <span>性格</span>
        <img
          src="@/assets/images/portrait/flip.png"
          width="20px"
          height="20px"
          class="pointer"
          @click="flip(1)"
        />
      </div>
      <div class="flex-auto flip-container">
        <div class="flipper" :class="{ flipped: isFlip1 }">
          <!-- <chart :option="option" class="front" v-if="!isFlip1"></chart> -->
          <div class="xg-items" v-if="!isFlip1">
            <template
              v-if="
                personality &&
                personality.personalityTraits &&
                personality.personalityTraits.length > 0
              "
            >
              <div
                v-for="(xgItem, xgIndex) in personality.personalityTraits"
                :key="xgIndex"
              >
                <template v-if="xgIndex % 2 == 0">
                  <div class="left">
                    <div class="title">{{ xgItem.itemName }}</div>
                    <div
                      class="precent"
                      :title="xgItem.itemName + ':' + xgItem.avgScore"
                    >
                      <div
                        class="precent-bar"
                        :style="{
                          width: `${(xgItem.avgScore / 20) * 100}%`
                        }"
                      ></div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="right">
                    <div
                      class="precent"
                      :title="xgItem.itemName + ':' + xgItem.avgScore"
                    >
                      <div
                        class="precent-bar"
                        :style="{
                          width: `${(xgItem.avgScore / 20) * 100}%`
                        }"
                      ></div>
                    </div>
                    <div class="title">{{ xgItem.itemName }}</div>
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <div
                class="inner-content"
                style="width: 100%; margin-top: -140px"
              >
                <el-empty :image-size="80" :image="noData"></el-empty>
              </div>
            </template>
          </div>
          <div class="back" v-else>
            <div>
              <div class="inner-title">
                <span>性格优点</span>
              </div>
              <div class="inner-content">
                <template v-if="personality.personalityStrengths">{{
                  personality.personalityStrengths
                }}</template>
                <template v-else>
                  <el-empty :image-size="80" :image="noData"></el-empty>
                </template>
              </div>
            </div>
            <div>
              <div class="inner-title">
                <span>职业分析</span>
              </div>
              <div class="inner-content">
                <template v-if="personality.careerAnalysis">{{
                  personality.careerAnalysis
                }}</template>
                <template v-else>
                  <el-empty :image-size="80" :image="noData"></el-empty>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-item flex-layout">
      <div
        class="flex-none box-title flex-row justify-between align-center pr10"
      >
        <span>气质</span>
        <img
          src="@/assets/images/portrait/flip.png"
          width="20px"
          height="20px"
          class="pointer"
          @click="flip(2)"
        />
      </div>
      <div class="flex-auto flip-container">
        <div class="flipper" :class="{ flipped: isFlip2 }">
          <template v-if="detectPersona">
            <div
              class="front flex-row justify-center align-center"
              v-if="!isFlip2"
            >
              <div class="temperament">
                <div class="icon flex-row justify-center align-center">
                  <div
                    style="
                      width: 150px;
                      height: 150px;
                      overflow: hidden;
                      border-radius: 50%;
                    "
                  >
                    <img
                      src="@/assets/images/jr-icon-2.jpg"
                      style="height: 100%"
                    />
                  </div>
                </div>
                <div class="qzlx flex-layout">
                  <span>气质类型</span>

                  <span v-if="detectPersona.detectPersonaType">{{
                    detectPersona.detectPersonaType
                  }}</span>
                  <span v-if="detectPersona.tips"
                    >({{ detectPersona.tips }})</span
                  >
                </div>
              </div>
            </div>
            <div class="back" v-else>
              <template v-if="detectPersona.traitDetail">
                <div
                  class="inner-content"
                  v-if="detectPersona.traitDetail.typicalPerformance"
                >
                  {{ detectPersona.traitDetail.typicalPerformance }}
                </div>
                <div
                  class="inner-content"
                  v-if="detectPersona.traitDetail.representativeFigures"
                >
                  {{ detectPersona.traitDetail.representativeFigures }}
                </div>
                <div
                  class="inner-content"
                  v-if="detectPersona.traitDetail.suitableColors"
                >
                  {{ detectPersona.traitDetail.suitableColors }}
                </div>
              </template>
              <template v-else>
                <div class="inner-content">
                  <el-empty :image-size="80" :image="noData"></el-empty>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="box-item flex-layout">
      <div
        class="flex-none box-title flex-row justify-between align-center pr10"
      >
        <span>应对方式</span>
        <img
          src="@/assets/images/portrait/flip.png"
          width="20px"
          height="20px"
          class="pointer"
          @click="flip(3)"
        />
      </div>
      <div class="flex-auto flip-container">
        <div class="flipper" :class="{ flipped: isFlip3 }">
          <template v-if="!isFlip3">
            <template v-if="option2.radar.indicator.length > 0"
              ><chart :option="option2" class="front"></chart
            ></template>
            <template v-else
              ><chart :option="{}" class="front"></chart
            ></template>
          </template>
          <div class="back" v-else>
            <div class="inner-content">
              <template v-if="copingStyle.copingStyleDescription">
                {{ copingStyle.copingStyleDescription }}
              </template>
              <template v-else>
                <el-empty :image-size="80" :image="noData"></el-empty>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
const noData = require('@/assets/images/no-data.png');
export default {
  components: {
    chart
  },
  data() {
    return {
      noData,
      isFlip1: false,
      isFlip2: false,
      isFlip3: false,
      personality: null,
      detectPersona: null,
      copingStyle: null,
      option2: {
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const list = this.copingStyle.copingStyleList;
            let template = '';
            for (let i = 0; i < list.length; i++) {
              template += `<div class="item">${list[i].itemName}: ${list[i].avgScore}分</div>\n`;
            }
            return template;
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
            data: [
              {
                value: []
              }
            ],
            label: {
              normal: {
                show: false,
                color: '#00d68c'
              }
            },
            symbol: 'circle',
            symbolSize: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: 'none'
                }
              }
            },
            areaStyle: {
              normal: {
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
          }
        ]
      }
    };
  },
  mounted() {
    const query = this.$route.query;
    const userId = query.userId;
    this.getPersonalityTraits(userId);
  },
  methods: {
    flip(index) {
      if (index == 1) {
        this.isFlip1 = !this.isFlip1;
      } else if (index == 2) {
        this.isFlip2 = !this.isFlip2;
      } else if (index == 3) {
        this.isFlip3 = !this.isFlip3;
      }
    },
    getPersonalityTraits(userId) {
      this.$api.analysis.personalityTraits({ userId }).then((res) => {
        this.personality = res.result.personality;
        this.detectPersona = res.result.detectPersona;
        this.copingStyle = res.result.copingStyle;
        this.initYdfs(this.copingStyle.copingStyleList);
      });
    },
    initYdfs(data) {
      const values = data.map((v) => Number(v.avgScore));
      const max = Math.max(...values);
      this.option2.radar.indicator = data.map((v) => {
        return {
          name: v.itemName,
          max: max > 0 ? max : 1
        };
      });
      this.option2.series[0].data[0].value = data.map((v) =>
        Number(v.avgScore)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.rgtz {
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
  .box-item {
    width: calc((100% - 40px) / 3);
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(41, 130, 103, 0.1);
  }

  .temperament {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 336px;
    height: 492px;
    background-image: url('~@/assets/images/portrait/rwtz-kk.png');
    background-size: 100%;
    margin: 0 auto;
    .icon {
      width: 185px;
      height: 185px;
      background-color: rgb(7, 57, 55);
      border-radius: 50%;
    }
    .qzlx {
      font-size: 16px;
      margin: 16px 0px;
      text-align: center;
      line-height: 1.2;
      margin-top: 30px;
      span {
        margin-bottom: 10px;
      }
      span:nth-child(1) {
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
  .xg-items {
    margin-top: 150px;
    > div {
      width: 50%;
      margin-bottom: 10px;
      font-size: 14px;

      .left {
        width: 100%;
        display: flex;
        height: 32px;
        align-items: center;
        float: left;
        .precent {
          display: flex;
          justify-content: flex-end;
        }
      }
      .right {
        width: 100%;
        float: right;
        display: flex;
        height: 32px;
        align-items: center;
        text-align: right;
      }
      .title {
        width: 50px;
      }
      .precent {
        width: calc(100% - 70px);
        border: 1px solid #51ffd0;
        padding: 2px;
        height: 100%;
        flex: 1;
        .precent-bar {
          height: 100%;
          background: #51ffd0;
        }
      }
    }
    > div:nth-child(2n) {
      float: left;
    }
  }
}
.inner-title {
  margin-top: 16px;
  background-image: url('~@/assets/images/title-2.png');
  background-repeat: no-repeat;
  padding-left: 22px;
  background-position: 0px -3px;
  span {
    background: linear-gradient(to bottom, #fff, #27bbc6); /* 渐变颜色*/
    -webkit-background-clip: text; /* 仅在 WebKit 浏览器中有效 */
    -webkit-text-fill-color: transparent; /* 使文字填充透明 */
  }
}
.inner-content {
  margin-top: 16px;
  padding: 6px;
  line-height: 24px;
  font-size: 18px;
  background: linear-gradient(
    to right,
    rgba(1, 236, 202, 0.15),
    rgba(1, 236, 202, 0)
  );
  border-left: 2px solid #1dccbb;
}

.flip-container {
  perspective: 1000;
  width: 100%;
  height: 100%;
}

.flipper {
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}

.front,
.back {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding-bottom: 10px;
}
.back {
  transform: scaleX(-1);
}

.flipped {
  transform: rotateY(180deg);
}
</style>
