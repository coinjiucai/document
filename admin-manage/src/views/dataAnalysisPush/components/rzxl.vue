<template>
  <div class="analysis-container" v-loading="loading">
    <div class="one">
      姓名：{{ userInfo ? userInfo.realname : '--' }} <span>|</span> 性别：{{
        userInfo ? userInfo.sex_dictText : '--'
      }}
      <span>|</span> 年龄：{{ userInfo ? userInfo.age : '--' }}岁
    </div>
    <div class="two">
      <div
        style="height: calc(60% - 10px); margin-bottom: 13px; overflow: hidden"
      >
        <div
          class="box"
          style="
            width: calc(66% - 6.5px);
            height: 100%;
            margin-right: 13px;
            float: left;
          "
        >
          <div class="card">
            <div class="header">认知数据模型</div>
            <div style="width: 100%; height: calc(100% - 30px); display: flex">
              <div
                style="
                  position: relative;
                  width: calc(100% - 280px);
                  display: inline-block;
                  height: 100%;
                "
              >
                <template v-if="options.series[0].data.length == 0">
                  <el-empty :image-size="120" :image="noData"></el-empty>
                </template>
                <chart class="chart" :option="options" v-else></chart>

                <div class="type-select">
                  <el-select
                    v-model="diffType"
                    placeholder="请选择"
                    size="mini"
                    @change="init()"
                  >
                    <el-option
                      v-for="item in diffTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div
                style="
                  width: 280px;
                  display: inline-flex;
                  height: 100%;
                  background-color: rgba(41, 130, 103, 0.2);
                  text-align: center;
                  justify-content: center;
                  align-items: center;
                  line-height: 2;
                  font-weight: normal;
                "
              >
                <div v-if="info">
                  <template v-for="v in info.labelList">
                    <div :key="v.label">
                      {{ v.label }}：

                      <span style="color: #10a0ac" v-if="v.value > 80"
                        >优秀</span
                      >
                      <span style="color: #ebad18" v-else-if="v.value >= 60"
                        >良好</span
                      >
                      <span style="color: #de3f3f" v-else-if="v.value > 0"
                        >一般</span
                      ><span v-else style="color: #999">--</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="box"
          style="width: calc(34% - 6.5px); height: 100%; float: left"
        >
          <div class="card">
            <div class="header">练习情况</div>
            <div style="width: 100%; height: calc(100% - 30px)">
              <template v-if="!info || info.trainList.length == 0">
                <el-empty :image-size="120" :image="noData"></el-empty>
              </template>
              <BaseTable
                v-else
                ref="BaseTable"
                stripe
                :height="null"
                :show-pagination="false"
                :showSelection="false"
                :list.sync="info.trainList"
              >
                <template #content>
                  <el-table-column label="指标" prop="label"> </el-table-column>
                  <el-table-column label="简单" prop="value">
                    <template #default="{ row }">
                      {{ row.diffType1 }} 次</template
                    >
                  </el-table-column>
                  <el-table-column label="中等" prop="value">
                    <template #default="{ row }">
                      {{ row.diffType2 }} 次</template
                    >
                  </el-table-column>
                  <el-table-column label="困难" prop="value">
                    <template #default="{ row }">
                      {{ row.diffType3 }}次
                    </template>
                  </el-table-column>
                </template>
              </BaseTable>
            </div>
          </div>
        </div>
      </div>
      <div style="height: calc(40% - 5px)">
        <div class="card">
          <div class="header">结果分析</div>
          <div style="width: 100%; height: calc(100% - 30px)">
            <template v-if="!info">
              <el-empty :image-size="120" :image="noData"></el-empty>
            </template>
            <template v-else>
              <div
                style="
                  font-weight: 200;
                  font-size: 20px;
                  text-align: center;
                  padding: 2rem 0 1rem;
                "
              >
                {{ getTemplate() }}
              </div>
            </template>
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
      noData,
      loading: false,
      info: null,
      labelList: [],
      diffType: 1,
      diffTypes: [
        {
          value: 1,
          label: '简单'
        },
        {
          value: 2,
          label: '中等'
        },
        {
          value: 3,
          label: '困难'
        }
      ],
      renderData: [
        {
          value: [],
          symbol: 'none',
          lineStyle: {
            normal: {
              color: '#ecc03e',
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                [
                  {
                    offset: 0,
                    color: 'rgba(203, 158, 24, 0.8)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(190, 96, 20, 0.8)'
                  }
                ],
                false
              )
            }
          }
        }
      ],
      indicator: [],
      //  心理测评
      options: {
        tooltip: {
          show: true,
          trigger: 'item'
        },
        radar: {
          center: ['50%', '50%'], //偏移位置
          radius: '80%',
          startAngle: 40, // 起始角度
          splitNumber: 4,
          shape: 'circle',
          splitArea: {
            areaStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            show: false,
            fontSize: 20,
            color: '#000',
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          indicator: []
        },
        series: [
          {
            type: 'radar',
            name: '认知数据模型',
            itemStyle: {
              color: '#1cc840' // Fixed color for the data points
            },
            lineStyle: {
              color: '#1cc840', // Fixed color for the line
              width: 2 // Optional: set line width
            },
            data: []
          }
        ]
      },
      pfbz: [],
      rzsjmx: [],
      result: ''
    };
  },
  mounted() {},
  methods: {
    init() {
      this.gametrainsituation(this.userInfo.id);
    },
    getTemplate() {
      const diffMap = {
        1: '简单',
        2: '中等',
        3: '困难'
      };
      let diffArr1 = [];

      let diffArr2 = [];
      let diffArr3 = [];
      let diffArr4 = [];
      this.info.labelList.forEach((item) => {
        if (item.value > 80) {
          diffArr3.push(item.label);
        } else if (item.value >= 60) {
          diffArr2.push(item.label);
        } else if (item.value > 0) {
          diffArr1.push(item.label);
        } else {
          diffArr4.push(item.label);
        }
      });
      let template =
        diffArr1.length > 0
          ? `${diffArr1.join('、')}能力一般！可适当增加${diffArr1.join(
              '、'
            )}的训练。`
          : '';

      let template2 = diffArr2.length > 0 ? `${diffArr2.join('、')}为良好` : '';
      if (template2) {
        template += template2;
      }
      const template3 =
        diffArr3.length > 0 ? `${diffArr3.join('、')}优秀。` : '';
      if (template && diffArr3.length > 0) {
        if (template2) {
          template += '，';
        }
        template += `${template3}`;
      }
      if (diffArr4.length > 0) {
        template += `${diffArr4.join('、')}能力--。`;
      }

      return `在${diffMap[this.diffType]}模式下，该学员${template}`;
    },
    gametrainsituation(id) {
      this.loading = true;
      this.$api.analysis
        .gametrainsituation({
          userId: id,
          ...this.param,
          diffType: this.diffType
        })
        .then((res) => {
          this.info = res.result;
          this.initOp();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    initOp() {
      this.options.series[0].data = [];
      const { trainList } = this.info;
      const type = 'diffType' + this.diffType;
      const values = trainList.map((v) => v[type]);
      const max = Math.max(...values);
      const lenged = trainList.map((v) => {
        return {
          name: v.label,
          max: max !== 0 ? max : 1
        };
      });
      this.options.radar.indicator = lenged;
      this.options.series[0].data.push({
        value: values
      });
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val && val.id) {
          this.diffType = 1;
          this.gametrainsituation(val.id);
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
        border-bottom: 1px solid rgba(41, 130, 103, 0.5);
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
.type-select {
  position: absolute;
  z-index: 9;
  top: 10px;
  right: 10px;
  width: 80px;
}
</style>
