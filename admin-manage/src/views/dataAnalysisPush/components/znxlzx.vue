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
        style="
          display: inline-block;
          height: calc(100%);
          width: calc(50% - 10px);
          margin-bottom: 13px;
        "
      >
        <div
          class="box"
          style="
            width: calc(100%);
            height: 100%;

            margin-right: 13px;
            float: left;
          "
        >
          <div class="card">
            <div class="header">心理数据模型</div>
            <div style="width: 100%; height: calc(100% - 30px); display: flex">
              <div
                style="width: calc(100%); display: inline-block; height: 100%"
              >
                <chart
                  class="chart"
                  v-if="options.radar[0].indicator.length > 0"
                  :option="options"
                ></chart>
                <template v-else>
                  <el-empty :image-size="80" :image="noData"></el-empty>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style="
          float: right;
          display: inline-block;
          height: calc(100%);
          width: calc(50% - 10px);
        "
      >
        <div class="card">
          <div class="header">个人网络心理行为</div>
          <div style="width: 100%; height: calc(100% - 30px)">
            <template v-if="netWorksDatas.length == 0">
              <el-empty :image-size="80" :image="noData"></el-empty>
            </template>
            <chart
              v-else
              :option="option2"
              class="flex-auto"
              @click="wordClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
import BaseTable from '@/components/Base/BaseTable.vue';
const noData = require('@/assets/images/no-data.png');
export default {
  components: { chart, BaseTable },
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
      loading: false,
      noData,
      options: {
        color: ['#3383fc'],
        tooltip: {},
        radar: [
          {
            indicator: [],
            center: ['50%', '45%'],
            radius: '50%',
            startAngle: 90,
            name: {
              formatter: '{value}',
              textStyle: {
                fontSize: 12, //外圈标签字体大小
                color: '#FFF' //外圈标签字体颜色
              }
            },
            splitArea: {
              // 坐标轴在 grid 区域中的分隔区域，默认不显示。
              show: true,
              areaStyle: {
                // 分隔区域的样式设置。
                color: [] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
              }
            },
            axisLine: {
              //指向外圈文本的分隔线样式
              lineStyle: {
                color: 'rgba(255,255,255,0.2)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.2)', // 分隔线颜色
                width: 1 // 分隔线线宽
              }
            }
          }
        ],
        series: [
          {
            name: '心理数据模型',
            type: 'radar',
            data: [
              {
                value: [],
                symbolSize: 0,
                areaStyle: {
                  normal: {
                    // 单项区域填充样式
                    color: {
                      type: 'linear',
                      x: 0, //右
                      y: 0, //下
                      x2: 1, //左
                      y2: 1, //上
                      colorStops: [
                        {
                          offset: 0,
                          color: '#3cd2f3'
                        },
                        {
                          offset: 1,
                          color: '#306eff'
                        }
                      ],
                      globalCoord: false
                    },
                    opacity: 1 // 区域透明度
                  }
                }
              }
            ]
          }
        ]
      },
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
            // 词的大小，最小12px，最大28px，可以在这个范围调整词的大小
            sizeRange: [20, 65],
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
      modelDatas: [],
      netWorksDatas: []
    };
  },
  methods: {
    init() {
      this.getmentalDataModel();
    },
    getmentalDataModel() {
      this.loading = true;
      this.$api.analysis
        .mentalDataModel({
          userId: this.userInfo.id,
          ...this.param
        })
        .then((res) => {
          const { mentalDataModel, networkWords } = res.result;
          const MKeys = Object.keys(mentalDataModel);
          let values = [];
          MKeys.forEach((key) => {
            values.push(Number(mentalDataModel[key].value));
          });
          const max = Math.max(...values);
          let modelDatas = [];
          MKeys.forEach((key) => {
            modelDatas.push({
              name: mentalDataModel[key].label,
              max: max
            });
          });
          this.options.radar[0].indicator = modelDatas;
          this.modelDatas = modelDatas;
          this.options.series[0].data[0].value = values;
          const keys = Object.keys(networkWords);
          let netWorksDatas = [];
          keys.forEach((key) => {
            netWorksDatas.push({
              name: key,
              value: networkWords[key]
            });
          });
          this.netWorksDatas = netWorksDatas;
          this.option2.series[0].data = netWorksDatas;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    wordClick(data) {}
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val && val.id) {
          this.getmentalDataModel(val.id);
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
      color: #3aa7e2;
    }
  }
  .two {
    flex: 1;
    .box {
      display: inline-block;
      // border: 1px solid #79b1e9;

      box-shadow: 5px 8px 5px 0px rgba(6, 27, 48, 0.51);
    }
    .card {
      width: 100%;
      height: 100%;
      // border: 1px solid #79b1e9;
      // background-color: rgba(129, 151, 189, 0.1);
      background-color: rgba(41, 130, 103, 0.1);
      box-shadow: 5px 8px 5px 0px rgba(6, 27, 48, 0.51);
      .header {
        width: 100%;
        height: 30px;
        line-height: 28px;
        font-size: 14px;
        padding: 0 16px;
        border-bottom: 1px solid rgba(41, 130, 103, 0.3);
        // background-color: rgba(41, 130, 103, 0.1);
        //
      }
    }
  }

  .ca {
    padding: 20px 0 20px 35px;
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
</style>
