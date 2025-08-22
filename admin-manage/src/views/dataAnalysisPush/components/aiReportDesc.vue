<template>
  <div class="component-aiReportDesc full-block scroll-y" id="download">
    <div class="page-title text-center">
      <div class="title mb10">{{ info.name }}</div>
      <div class="date">
        分析时段：{{ getDate(info.startTime) }}~{{ getDate(info.endTime) }}
      </div>
    </div>
    <div class="block">
      <div class="block-title"><span>01.综合建议</span></div>
      <div class="block-info">
        <span
          v-if="info.comprehensiveAdviceData"
          v-html="info.comprehensiveAdviceData"
        ></span>
        <span v-else>--</span>
      </div>
    </div>
    <div class="block czzs">
      <div class="block-title"><span>02.成长综述</span></div>
      <div class="block-info">
        <span
          v-if="info.growthSummaryData"
          v-html="info.growthSummaryData"
        ></span>
        <span v-else>--</span>
      </div>
      <div class="block-bottom flex-row">
        <div class="left flex1 h100p">
          <div class="name text-center">心理训练情况</div>
          <div class="list flex-row">
            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_znzx.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">智能咨询</div>
                <div class="num text-center">
                  {{
                    info.smartConsultationCount
                      ? info.smartConsultationCount
                      : 0
                  }}
                </div>
              </div>
            </div>
            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_xlcp.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">心理测评</div>
                <div class="num text-center">
                  {{
                    info.psychologicalAssessmentCount
                      ? info.psychologicalAssessmentCount
                      : 0
                  }}
                </div>
              </div>
            </div>

            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_xljy.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">心理教育</div>
                <div class="num text-center">
                  {{
                    info.psychologicalEducationCount
                      ? info.psychologicalEducationCount
                      : 0
                  }}
                </div>
              </div>
            </div>
            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_nlxl.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">脑力训练</div>
                <div class="num text-center">
                  {{ info.mindTrainCount ? info.mindTrainCount : 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right flex1 h100p">
          <div class="name text-center">综合情况统计</div>
          <div class="list flex-row">
            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_xtsy.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">系统使用</div>
                <div class="num text-center">{{ info.sysLoginCount }}</div>
              </div>
            </div>
            <!-- <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_ttxl.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">团体训练</div>
                <div class="num text-center">20</div>
              </div>
            </div> -->
            <!-- <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_grxl.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">个人训练</div>
                <div class="num text-center">20</div>
              </div>
            </div> -->
            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_rwqk.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">任务情况</div>
                <div class="num text-center">
                  {{ info.taskCenterCount ? info.taskCenterCount : 0 }}
                </div>
              </div>
            </div>
            <!-- <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_yjqk.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">预警情况</div>
                <div class="num text-center">
                  {{ info.warnCount ? info.warnCount : 0 }}
                </div>
              </div>
            </div> -->
            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_rzxl.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">认知训练</div>
                <div class="num text-center">
                  {{
                    info.cognitiveTrainingCount
                      ? info.cognitiveTrainingCount
                      : 0
                  }}
                </div>
              </div>
            </div>
            <div
              class="list-item flex1 h100p flex-row align-center justify-center"
            >
              <img
                class="icon"
                src="@/assets/images/dataAnalysisPush/icon_yjxl.png"
                alt=""
              />
              <div class="item-right">
                <div class="label">应激训练</div>
                <div class="num text-center">
                  {{ info.vrStressTrainCount ? info.vrStressTrainCount : 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="block aizxfx">
      <div class="block-title"><span>03.AI咨询分析</span></div>
      <div class="block-info">
        <span
          v-if="getAianalysisData(info.aiConsultationAnalysisData).summary"
          v-html="getAianalysisData(info.aiConsultationAnalysisData).summary"
        ></span>
        <span v-else>--</span>
      </div>
      <div class="block-bottom flex-row">
        <div class="left flex1 h100p">
          <ListPage
            ref="aiListPage"
            :params="{}"
            :fieldsConfig="[]"
            :labelList="labelList1"
            :buttonList="[]"
            :isInnerGet="true"
            :showSelection="false"
            :showPagination="false"
          >
            <template slot="action_parent" slot-scope="scope">
              <el-link
                :underline="false"
                type="primary"
                @click="znzxDetail(scope.row)"
                >查看对话</el-link
              >
            </template>
          </ListPage>
        </div>
        <div class="right flex1 h100p">
          <chart class="full-block" :option="option1" @click="wordClick" />
        </div>
      </div>
    </div>
    <div class="block xlcp">
      <div class="block-title"><span>04.心理测评</span></div>
      <div class="block-info">
        <span
          v-if="
            getPsychologicalAssessmentData(info.psychologicalAssessmentData)
              .summary
          "
          v-html="
            getPsychologicalAssessmentData(info.psychologicalAssessmentData)
              .summary
          "
        ></span>
        <span v-else>--</span>
      </div>
      <div class="block-bottom">
        <ListPage
          ref="xlcpListPage"
          :params="{}"
          :fieldsConfig="[]"
          :labelList="labelList2"
          :buttonList="[]"
          :isInnerGet="true"
          :showSelection="false"
          :showPagination="false"
        >
          <template slot="action_parent" slot-scope="scope">
            <el-link
              :underline="false"
              type="primary"
              @click="xlcpDetail(scope.row)"
              >查看报告</el-link
            >
          </template>
        </ListPage>
      </div>
    </div>
    <div class="block aizxfx">
      <div class="block-title"><span>05.认知训练</span></div>
      <div class="block-info">
        <span
          v-if="getcognitiveTrainingSummary(info.cognitiveTrainingData)"
          v-html="getcognitiveTrainingSummary(info.cognitiveTrainingData)"
        ></span>
        <span v-else>--</span>
      </div>
      <div class="block-bottom flex-row">
        <div class="left flex1 h100p">
          <ListPage
            ref="rzxlListPage"
            :params="{}"
            :fieldsConfig="[]"
            :labelList="labelList3"
            :buttonList="[]"
            :isInnerGet="true"
            :showSelection="false"
            :showPagination="false"
          >
            <template slot="startTime_parent" slot-scope="scope">
              <span v-if="scope.row.startTime"
                >{{ getDate(scope.row.startTime) }}至{{
                  getDate(scope.row.endTime)
                }}</span
              >
              <span v-else>--</span>
            </template>
            <template slot="action_parent" slot-scope="scope">
              <el-link
                :underline="false"
                type="primary"
                @click="openDialogue3(scope.row)"
                >查看报告</el-link
              >
            </template>
          </ListPage>
        </div>
        <div class="right flex1 h100p rzln">
          <div class="diff-select">
            <el-select
              v-model="diff"
              placeholder="请选择"
              size="mini"
              style="width: 80px"
              @change="initCognitiveTraining()"
            >
              <el-option label="简单" value="简单"> </el-option>
              <el-option label="中等" value="中等"> </el-option>
              <el-option label="困难" value="困难"> </el-option>
            </el-select>
          </div>
          <chart
            class="full-block"
            :option="option2"
            v-if="option2.radar.indicator.length > 0"
          />
          <chart class="full-block" :option="{}" v-else />
        </div>
      </div>
    </div>
    <div class="block jyxx">
      <div class="block-title"><span>06.教育学习</span></div>
      <div class="block-info">
        <span v-html="educationSummary"></span>
      </div>
      <div class="block-bottom">
        <chart class="full-block" :option="option3" />
      </div>
    </div>
    <div class="block nlxl">
      <div class="block-title"><span>07.脑力训练</span></div>
      <div class="block-info">
        <span v-html="brainSummary"></span>
      </div>
      <div class="block-bottom">
        <div class="name text-center">大脑基础节律</div>
        <div class="row flex-row">
          <div class="col flex1">
            <div class="col-title text-center">优势频率</div>
            <div class="col-cell flex-row">
              <div class="col-cell-item flex1 text-center">指标</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshipinlv.indicator }}
              </div>
              <div class="col-cell-item flex1 text-center">频率</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshipinlv.frequency }}
              </div>
            </div>
            <div class="col-cell flex-row">
              <div class="col-cell-item flex1 text-center">左脑</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshipinlv.leftValue }}
              </div>
              <div class="col-cell-item flex1 text-center">右脑</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshipinlv.rightValue }}
              </div>
            </div>
            <div class="col-cell">
              <div style="line-height: 1.4; font-size: 16px; padding: 10px 0">
                大脑基础节律是苏醒状态下闭眼时的脑电指标，其标准与年龄相关，因而可以判断出大脑的发展程度、老化程度及稳定度。理想的基础节律优势频率为10Hz，并随年龄的不同而有所不同，低于相应年龄段指标范围表明大脑状态不是很好。
              </div>
            </div>
          </div>
          <div class="col flex1">
            <div class="col-title text-center">优势幅值差</div>
            <div class="col-cell flex-row">
              <div class="col-cell-item flex1 text-center">指标</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshifuducha.indicator }}
              </div>
              <div class="col-cell-item flex1 text-center">幅值差（左-右）</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshifuducha.frequency }}
              </div>
            </div>
            <div class="col-cell flex-row">
              <div class="col-cell-item flex1 text-center">左脑</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshifuducha.leftValue }}
              </div>
              <div class="col-cell-item flex1 text-center">右脑</div>
              <div class="col-cell-item flex1 text-center">
                {{ youshifuducha.rightValue }}
              </div>
            </div>
            <div class="col-cell">
              <div style="line-height: 1.4; font-size: 16px; padding: 10px 0">
                基础节律中左右脑幅差的正常范围小于0.05。幅值差超过正常范围时，如果左脑的幅值高于右脑，行动有压抑倾向；如果右脑幅值高于左脑，有活跃倾向。
              </div>
            </div>
          </div>
        </div>
        <div class="chart-wrap">
          <chart class="full-block" :option="option4" />
        </div>
        <div class="row flex-row">
          <div class="col flex1">
            <div class="col-title text-center">大脑调节能力</div>
            <div class="table-wrap">
              <div class="table-header flex-row">
                <div class="th flex1 text-center">指标名称</div>
                <div class="th flex1 text-center">测量值</div>
                <div class="th flex1 text-center">参考范围</div>
              </div>
              <div class="table-body">
                <div
                  class="table-cell flex-row"
                  v-for="(item, idx) in naojiankangjielv"
                  :key="idx"
                >
                  <div class="td flex1 text-center">
                    {{ item.indicatorName }}
                  </div>
                  <div class="td flex1 text-center">
                    {{ item.referenceRange }}
                  </div>
                  <div class="td flex1 text-center">
                    {{ item.measuredValue }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col flex1">
            <div class="col-title text-center">脑健康状态</div>
            <div class="table-wrap">
              <div class="table-header flex-row">
                <div class="th flex1 text-center">指标名称</div>
                <div class="th flex1 text-center">测量值</div>
                <div class="th flex1 text-center">参考范围</div>
              </div>
              <div class="table-body">
                <div
                  class="table-cell flex-row"
                  v-for="(item, idx) in naojiankangzhuangtai"
                  :key="idx"
                >
                  <div class="td flex1 text-center">
                    {{ item.indicatorName }}
                  </div>
                  <div class="td flex1 text-center">
                    {{ item.referenceRange }}
                  </div>
                  <div class="td flex1 text-center">
                    {{ item.measuredValue }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="block yjxl">
      <div class="block-title"><span>08.应激训练</span></div>
      <div class="block-info">
        <span v-html="stressSummary"></span>
      </div>
      <div class="block-bottom flex-row">
        <div class="left flex1 h100p">
          <chart class="full-block" :option="option5" />
        </div>
        <div class="right flex1 h100p">
          <chart class="full-block" :option="option6" />
        </div>
      </div>
    </div>
    <ltDialog ref="ltDialog"></ltDialog>
    <!-- pdf 预览 -->
    <viewPdfDialog width="98%" ref="viewPdfDialog" title="详情"></viewPdfDialog>
  </div>
</template>

<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
import ListPage from '@/components/ListPage';
import ltDialog from '@/views/fileManagement/components/ltDialog.vue';
import viewPdfDialog from '@/views/fileManagement/components/viewPdfDialog.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export default {
  name: 'aiReportDesc',
  components: {
    chart,
    ListPage,
    ltDialog,
    viewPdfDialog
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  mixins: [chartsBase],
  data() {
    return {
      option1: {
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
            sizeRange: [12, 38],
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
                color: function () {
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
      labelList1: [
        {
          label: '咨询时间',
          prop: 'createTime'
        },
        {
          label: '预警情况',
          prop: 'introduction'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      labelList2: [
        {
          label: '量表名称',
          prop: 'paperName'
        },
        {
          label: '测评时间',
          prop: 'testTime'
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      diff: '简单',
      labelList3: [
        {
          label: '训练名称',
          prop: 'trainName'
        },
        {
          label: '训练类型',
          prop: 'classifyName'
        },
        {
          label: '训练时间',
          prop: 'startTime',
          parent: 'startTime_parent',
          special: true
        },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      option2: {
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const indicator = this.option2.radar.indicator;
            let html = ``;
            for (let i = 0; i < indicator.length; i++) {
              html += `${indicator[i].name}: ${params.value[i]}<br/>`;
            }

            return html;
          }
        },
        title: {
          text: '认知能力变化情况',
          left: 'center',
          top: 15,
          textStyle: {
            color: '#fff',
            fontSize: 18
          }
        },
        grid: {
          top: 500
        },
        legend: {
          show: true,
          orient: 'vertical',
          top: 180,
          left: 130,
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        radar: {
          indicator: [],
          radius: '60%',
          splitArea: {
            areaStyle: {
              color: 'transparent' // 分层颜色（可选数组）
            }
          }
        },
        series: [
          {
            name: '认知能力变化情况',
            type: 'radar',
            data: [
              {
                value: [],
                name: '个人',
                itemStyle: {
                  color: '#165988'
                },
                areaStyle: {
                  color: 'rgba(22,89, 136, 0.3)'
                }
              },
              {
                value: [],
                name: '团体平均',
                itemStyle: {
                  color: '#1ee7b5'
                },
                areaStyle: {
                  color: 'rgba(30, 231, 181, 0.3)'
                }
              }
            ]
          }
        ]
      },
      educationSummary: '--',
      option3: {
        dataZoom: this.getXDataZoom(10, 10),
        title: {
          text: '学习情况柱状图',
          left: 'center',
          top: 30,
          textStyle: {
            color: '#fff',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          top: 90,
          right: 30,
          bottom: 60,
          left: 60
        },
        legend: {
          show: false,
          //   data: ['待学习', '已学习'],
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
            boundaryGap: true,
            data: [],
            axisLine: {
              lineStyle: { color: 'rgba(255,255,255,.1)' }
            },
            axisLabel: {
              textStyle: { color: 'rgba(255,255,255,.7)', fontSize: '14' },
              interval: 0,
              rotate: 8,
              align: 'center'
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
              show: true,
              lineStyle: {
                type: 'dashed', // 设置为虚线
                color: 'rgba(178,194,211, 0.3)'
              }
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
          }
          // {
          //   type: "value",
          //   name: "",
          //   show: false,
          //   axisLabel: {
          //     show: true,
          //     fontSize: 14,
          //     formatter: "",
          //     color: "rgba(255,255,255,.6)",
          //   },
          //   axisTick: { show: false },
          //   axisLine: { lineStyle: { color: "rgba(255,255,255,.1)" } }, //右线色
          //   splitLine: {
          //     show: true,
          //     lineStyle: { color: "rgba(255,255,255,.1)" },
          //   },
          // },
        ],
        series: [
          {
            name: '学习情况',
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
            }
          }
        ]
      },
      brainSummary: '--',
      option4: {
        title: {
          text: '优势频率',
          left: 'center',
          top: 30,
          textStyle: {
            color: '#69908a',
            fontSize: 22
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params) {
            return `左脑: ${params[0].value}Hz <br /> 右脑: ${params[1].value}Hz`;
          }
        },
        grid: {
          top: 90,
          right: 30,
          bottom: 40,
          left: 60
        },
        legend: {
          data: ['左脑', '右脑'],
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
            boundaryGap: true,
            data: [],
            axisLine: {
              lineStyle: { color: 'rgba(255,255,255,.1)' }
            },
            axisLabel: {
              textStyle: { color: 'rgba(255,255,255,.7)', fontSize: '14' },
              interval: 0
            },
            splitLine: {
              lineStyle: {
                type: 'solid',
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
              show: true,
              lineStyle: {
                type: 'dashed', // 设置为虚线
                color: 'rgba(178,194,211, 0.3)'
              }
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
          }
          // {
          //   type: "value",
          //   name: "",
          //   show: false,
          //   axisLabel: {
          //     show: true,
          //     fontSize: 14,
          //     formatter: "",
          //     color: "rgba(255,255,255,.6)",
          //   },
          //   axisTick: { show: false },
          //   axisLine: { lineStyle: { color: "rgba(255,255,255,.1)" } }, //右线色
          //   splitLine: {
          //     show: true,
          //     lineStyle: { color: "rgba(255,255,255,.1)" },
          //   },
          // },
        ],
        series: [
          {
            name: '左脑',
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
            }
          },
          {
            name: '右脑',
            type: 'bar',
            data: [],
            barWidth: '12',
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#01cfa1'
                  },
                  {
                    offset: 1,
                    color: '#01cfa1'
                  }
                ])
              }
            }
          }
        ]
      },
      naojiankangjielv: [],
      naojiankangzhuangtai: [],
      stressSummary: '--',
      option5: {
        tooltip: {
          show: true
        },
        title: {
          text: '训练统计',
          left: 'center',
          top: 30,
          textStyle: {
            color: '#fff',
            fontSize: 18
          }
        },
        grid: {
          top: 90,
          right: 30,
          bottom: 40,
          left: 60
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.6)'
            },
            textStyle: { color: 'rgba(255,255,255,.7)', fontSize: '14' }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.6)'
            },
            textStyle: { color: 'rgba(255,255,255,.7)', fontSize: '14' }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', // 设置为虚线
              color: 'rgba(178,194,211, 0.3)'
            }
          }
        },
        series: [
          {
            data: [],
            type: 'line',
            lineStyle: { color: '#25d88e' }, // 直接设置颜色值
            itemStyle: { color: '#25d88e' } // 适用于标记点颜色
          }
        ]
      },
      vrTrainNameList: [
        { value: 200, label: '恐怖' },
        { value: 75, label: '血腥' },
        { value: 100, label: '恐高' }
      ],
      option6: {
        title: {
          text: '应激视频情况',
          left: 'center',
          top: 15,
          textStyle: {
            color: '#fff',
            fontSize: 18
          }
        },
        legend: {
          orient: 'vertical',
          top: 180,
          right: 40,
          icon: 'circle',
          textStyle: {
            color: 'rgba(188,211,223, 0.8)', // 字体颜色（十六进制/RGB等）
            fontSize: 16 // 字体大小（单位：px）
          },
          formatter: (name) => {
            const account = this.vrTrainNameList.reduce(
              (acc, cur) => acc + Number(cur.value),
              0
            );
            const item = this.vrTrainNameList.find(
              (item) => item.label == name
            );
            return `${name} ${item.value} ${(
              (Number(item.value) / account) *
              100
            ).toFixed(2)}%`;
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'inside', // 关键设置，让标签显示在内部
              formatter: '{b}: {c} ({d}%)', // 显示名称、值和百分比
              color: '#fff', // 设置标签文字颜色为白色
              fontSize: 12,
              fontWeight: 'bold'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 200, name: '恐怖', itemStyle: { color: '#e28e61' } },
              { value: 75, name: '血腥', itemStyle: { color: '#cece41' } },
              { value: 100, name: '恐高', itemStyle: { color: '#1da7c0' } }
            ]
          }
        ]
      },
      youshipinlv: {
        frequency: '--',
        indicator: '--',
        leftValue: '--',
        rightValue: '--'
      },
      youshifuducha: {
        indicator: '--',
        frequency: '--',
        leftValue: '--',
        rightValue: '--'
      }
    };
  },
  mounted() {},
  methods: {
    getDate(val) {
      if (val) {
        return moment(val).format('YYYY-MM-DD');
      }
      return '';
    },
    getAianalysisData(data) {
      if (data) {
        return JSON.parse(data);
      } else {
        return {
          summary: '',
          cloudWords: [],
          InterveneList: []
        };
      }
    },
    getPsychologicalAssessmentData(data) {
      if (data) {
        return JSON.parse(data);
      } else {
        return {
          summary: '',
          paperList: []
        };
      }
    },
    getcognitiveTrainingSummary(data) {
      if (data) {
        const diff = this.diff;
        const list = JSON.parse(data);
        const item = list.find((v) => v.diff == diff);
        if (item) {
          return item.summary;
        }
      }
      return '';
    },
    initCognitiveTraining() {
      const cognitiveTraingList = this.info.cognitiveTrainingData
        ? JSON.parse(this.info.cognitiveTrainingData)
        : [];
      const cognitiveTraingItem = cognitiveTraingList.find(
        (v) => v.diff == this.diff
      );
      if (cognitiveTraingItem) {
        const userList = cognitiveTraingItem.userList;
        const groupList = cognitiveTraingItem.groupList;
        console.log(cognitiveTraingItem, 'sfsfsd');
        const indicator = userList.map((v) => {
          return {
            name: v.label,
            max: 100
          };
        });
        this.option2.radar.indicator = indicator;
        this.option2.series[0].data[0].value = userList.map((v) =>
          Number(v.value)
        );
        this.option2.series[0].data[1].value = groupList.map((v) =>
          Number(v.value)
        );
        const gameList = cognitiveTraingItem.gameList;
        this.$refs.rzxlListPage.setList(gameList, gameList.length);
      } else {
        this.option2.radar.indicator = [];
        this.option2.series[0].data[0].value = [];
        this.option2.series[1].data[0].value = [];
        this.$refs.rzxlListPage.setList([], 0);
      }
    },
    // 教育学习
    initJyxx() {
      const educationLearningData = this.info.educationLearningData
        ? JSON.parse(this.info.educationLearningData)
        : {
            educationList: [],
            educationSummary: ''
          };
      const educationList = educationLearningData.educationList;
      const xData = educationList.map((v) => v.label);
      this.option3.xAxis[0].data = xData;
      this.option3.series[0].data = educationList.map((v) => Number(v.value));
      this.educationSummary = educationLearningData.educationSummary
        ? educationLearningData.educationSummary
        : '--';
    },
    // 脑力训练
    initNlxl() {
      const brainTrainingData = this.info.brainTrainingData
        ? JSON.parse(this.info.brainTrainingData)
        : {
            brainLabelInfo: [],
            brainSummary: ''
          };
      this.brainSummary = brainTrainingData.brainSummary
        ? brainTrainingData.brainSummary
        : '--';
    },
    initYjxl() {
      const stressTrainingData = this.info.stressTrainingData
        ? JSON.parse(this.info.stressTrainingData)
        : {
            vrTrainNameList: [],
            vrTrainTypeList: [],
            stressSummary: ''
          };
      this.stressSummary = stressTrainingData.stressSummary
        ? stressTrainingData.stressSummary
        : '--';
      const vrTrainTypeList = stressTrainingData.vrTrainTypeList;
      this.option5.xAxis.data = vrTrainTypeList.map((v) => v.label);
      this.option5.series[0].data = vrTrainTypeList.map((v) => Number(v.value));
      this.vrTrainNameList = stressTrainingData.vrTrainNameList.map((v) => {
        return {
          label: v.label,
          value: Number(v.value)
        };
      });
      const colors = [
        { color: '#e28e61' },
        { color: '#cece41' },
        { color: '#1da7c0' }
      ];
      this.option6.series[0].data = this.vrTrainNameList.map((v, index) => {
        return {
          name: v.label,
          value: Number(v.value),
          itemStyle: colors[index % colors.length]
        };
      });
    },
    // 智能咨询详情
    znzxDetail(record) {
      this.$refs.ltDialog.show(record);
    },
    xlcpDetail(record) {
      if (record.paperWebUrl) {
        this.$refs.viewPdfDialog.show(record.paperWebUrl);
      } else {
        this.$message('暂无报告');
      }
    },
    wordClick(data) {
      this.$router.push({
        path: '/feature',
        query: {
          word: data.name
        }
      });
    },
    openDialogue2(row) {},
    openDialogue3(record) {
      if (record.reportUrl) {
        this.$refs.viewPdfDialog.show(record.reportUrl);
      } else {
        this.$message('暂无报告');
      }
    },
    async downloadAsImage(type = 'png') {
      try {
        this.$message.info(
          `正在生成${type === 'png' ? '图片' : 'PDF'}，请稍候...`
        );

        await this.$nextTick();
        const element = document.getElementById('download');

        // 临时调整样式
        const originalOverflow = element.style.overflow;
        element.style.overflow = 'visible';

        const options = {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#1e3a37',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        };

        const canvas = await html2canvas(element, options);
        element.style.overflow = originalOverflow;

        if (type === 'png') {
          // 导出为PNG
          const link = document.createElement('a');
          const fileName = `${
            this.info.name || '心理成长'
          }报告_${moment().format('YYYYMMDD')}.png`;
          link.download = fileName;
          link.href = canvas.toDataURL('image/png');
          link.click();
          this.$message.success('图片导出成功');
        } else {
          // 导出为PDF
          this.generatePDF(canvas);
        }
      } catch (error) {
        console.error(`导出${type === 'png' ? '图片' : 'PDF'}失败:`, error);
        this.$message.error(
          `${type === 'png' ? '图片' : 'PDF'}导出失败: ${error.message}`
        );
      }
    },

    generatePDF(canvas) {
      // 计算PDF尺寸
      const imgWidth = 210; // A4宽度(mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 创建PDF
      const pdf = new jsPDF('p', 'mm', 'a4');

      // 添加图片到PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // 保存PDF
      const fileName = `${this.info.name || '心理成长'}报告_${moment().format(
        'YYYYMMDD'
      )}.pdf`;
      pdf.save(fileName);
      this.$message.success('PDF导出成功');
    },

    // 可以添加一个单独导出PDF的方法
    downloadAsPDF() {
      this.downloadAsImage('pdf');
    }
  },
  watch: {
    info: {
      handler(val) {
        if (val) {
          this.info = val;
          this.$nextTick(() => {
            const aiList = this.info.aiConsultationAnalysisData
              ? JSON.parse(this.info.aiConsultationAnalysisData).InterveneList
              : [];
            this.$refs.aiListPage.setList(aiList, aiList.length);
            const cloudWords = this.info.aiConsultationAnalysisData
              ? JSON.parse(this.info.aiConsultationAnalysisData).cloudWords
              : {};
            const cloudWordsKeys = Object.keys(cloudWords);

            this.option1.series[0].data = cloudWordsKeys.map((key) => {
              return {
                name: key,
                value: Number(cloudWords[key])
              };
            });

            const paperList = this.info.psychologicalAssessmentData
              ? JSON.parse(this.info.psychologicalAssessmentData).paperList
              : [];
            this.$refs.xlcpListPage.setList(paperList, paperList.length);
            // 认知训练
            this.initCognitiveTraining();
            this.initJyxx();
            this.initNlxl();
            this.initYjxl();

            // youshipinlv
            const brainTrainingData = this.info.brainTrainingData
              ? JSON.parse(this.info.brainTrainingData)
              : null;
            if (brainTrainingData && brainTrainingData.youshipinlv) {
              this.youshipinlv = brainTrainingData.youshipinlv;
            }
            if (brainTrainingData && brainTrainingData.youshifuducha) {
              this.youshifuducha = brainTrainingData.youshifuducha;
            }
            if (brainTrainingData && brainTrainingData.brainLabelInfo) {
              const leftValues = brainTrainingData.brainLabelInfo.map((v) =>
                parseFloat(v.leftValue)
              );
              this.option4.series[0].data = leftValues;
              const rightValues = brainTrainingData.brainLabelInfo.map((v) =>
                parseFloat(v.rightValue)
              );
              this.option4.series[1].data = rightValues;
              this.option4.xAxis[0].data = brainTrainingData.brainLabelInfo.map(
                (v) => v.label
              );
            }
            if (brainTrainingData && brainTrainingData.naojiankangjielv) {
              this.naojiankangjielv = brainTrainingData.naojiankangjielv;
            }
            if (brainTrainingData && brainTrainingData.naojiankangzhuangtai) {
              this.naojiankangzhuangtai =
                brainTrainingData.naojiankangzhuangtai;
            }
          });
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss">
.ai-baogao {
  color: #14bbbb;
}
</style>
<style lang="scss" scoped>
.component-aiReportDesc {
  background: rgba(41, 130, 103, 0.1);
  padding: 20px 18px;
  .page-title {
    line-height: 1;
    letter-spacing: 1px;
    margin-bottom: 20px;
    .title {
      font-size: 28px;
      color: #ffffff;
      box-shadow: 2px 3px 0px 0px rgba(22, 22, 19, 0.27);
    }
    .date {
      font-size: 18px;
      color: #69908a;
    }
  }
  .block {
    .block-title {
      height: 30px;
      background-image: url('~@/assets/images/title-bg.png');
      background-repeat: no-repeat;
      background-position: left top;
      background-size: contain;
      padding-left: 25px;
      font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
      font-size: 20px;
      span {
        position: relative;
        top: -5px;
      }
    }
    .block-info {
      font-size: 18px;
      line-height: 21px;
      color: #fff;
      text-indent: 2em;
      padding: 28px 0;
      .light-word {
        color: #14bbbb;
      }
    }
  }
  .block + .block {
    margin-top: 36px;
  }
  .block:nth-child(3) {
    margin-top: 0;
  }
  .czzs {
    .block-bottom {
      .left,
      .right {
        padding: 12px 0;
        background: rgba(33, 149, 101, 0.1);
        border-left: 2px solid #13b9bb;
        .name {
          font-size: 18px;
          line-height: 1;
          color: #ffffff;
          margin-bottom: 16px;
        }
        .list {
          .list-item {
            .icon {
              flex: 0 0 30px;
              width: 30px;
              height: 30px;
              margin-right: 12px;
            }
            .item-right {
              .label {
                font-size: 14px;
                line-height: 1;
                letter-spacing: 1px;
                color: #ffffff;
                margin-bottom: 6px;
              }
              .num {
                font-size: 14px;
                line-height: 1;
                letter-spacing: 1px;
                color: #25d88e;
              }
            }
          }
        }
      }
      .right {
        margin-left: 20px;
      }
    }
  }
  .aizxfx {
    .block-bottom {
      height: calc(373px + 42px);
      .right {
        margin-left: 20px;
        background-color: rgba(33, 149, 101, 0.1);
      }
    }
  }
  .xlcp {
    .block-bottom {
      height: calc(400px + 16px + 26px);
    }
  }
  .jyxx {
    .block-bottom {
      height: 400px;
      background-color: rgba(33, 149, 101, 0.1);
    }
  }
  .nlxl {
    .block-bottom {
      padding: 20px;
      background: rgba(33, 149, 101, 0.1);
      .name {
        font-size: 22px;
        line-height: 1;
        color: #ffffff;
        margin-bottom: 18px;
      }
      .chart-wrap {
        height: 400px;
      }
      .row {
        .col {
          .col-title {
            color: #69908a;
            font-size: 22px;
            line-height: 1;
            padding: 12px 0;
          }
          .col-cell {
            color: #fff;
            font-size: 18px;
            line-height: 50px;
            height: 50px;
            background: rgba(33, 149, 101, 0.1);
            .col-cell-item:nth-child(2n) {
              color: #25d88e;
            }
          }
          .col-cell:nth-child(3) {
            background: rgba(33, 149, 101, 0.3);
          }
          .col-cell:nth-child(4) {
            height: 80px;
            line-height: 80px;
            padding: 0 44px;
          }
          .table-wrap {
            background: rgba(33, 149, 101, 0.1);
            .table-header {
              color: #69908a;
              .th {
                height: 50px;
                line-height: 50px;
                font-size: 16px;
              }
            }
            .table-body {
              color: #fff;
              font-size: 18px;
              .table-cell {
                .td {
                  height: 50px;
                  line-height: 50px;
                }
                &:nth-child(2n + 1) {
                  background: rgba(33, 149, 101, 0.3);
                }
              }
            }
          }
        }
        .col + .col {
          margin-left: 12px;
        }
      }
    }
  }
  .yjxl {
    .block-bottom {
      height: calc(373px + 42px);
      .right {
        margin-left: 20px;
      }
      .left,
      .right {
        background-color: rgba(33, 149, 101, 0.1);
      }
    }
  }
  .rzln {
    position: relative;
    .diff-select {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 9;
    }
  }
}
</style>
