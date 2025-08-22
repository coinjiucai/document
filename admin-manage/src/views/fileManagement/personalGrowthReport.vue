<template>
  <div class="component-person-growth flex-row full-block">
    <div class="tree-container" v-loading="loading">
      <UserCatalogue
        ref="catalogue"
        title="组织架构"
        node-key="id"
        :tree-data.sync="treeList"
        :get-url="['System', 'psysysdepartTreeList']"
        :delete-url="['System', 'sysprivacyuserDeleteBatch']"
        :disabledOption="true"
        :default-props="{
          label: 'name',
          value: 'id',
          children: 'childrenList'
        }"
        :hasUser="true"
        @current-change="handleCurrentChange"
        @scroll="handleScroll"
        @filter="filter"
        @node-click="handleCurrentChange"
      >
      </UserCatalogue>
    </div>
    <div
      class="flex-auto theme-background-middle flex-layout"
      style="width: calc(100% - 330px)"
      v-loading="pageLoading"
    >
      <div class="btns" style="height: 39px">
        <div @click="changeType(1)" :class="{ active: type == 1 }">
          月成长分析
        </div>
        <div @click="changeType(2)" :class="{ active: type == 2 }">
          学期成长分析
        </div>
        <div @click="changeType(3)" :class="{ active: type == 3 }">
          学年成长分析
        </div>
        <div @click="changeType(4)" :class="{ active: type == 4 }">
          生涯成长分析
        </div>
      </div>
      <div style="height: calc(50% - 20px); display: flex" v-if="info">
        <div style="position: relative; width: 50%; height: 100%">
          <div class="radarBg"></div>
          <chart class="chart" :option="option"></chart>
        </div>
        <div class="box-c" style="width: 50%; height: 100%">
          <div class="title">综合评价</div>
          <div class="content">
            {{ info.evaluation ? info.evaluation : '暂无评价' }}
          </div>
        </div>
      </div>
      <div style="height: calc(50% - 40px); margin-top: 20px">
        <div class="box-c" style="width: 100%; height: 100%; padding: 20px 0">
          <div class="title">成长变化折线图</div>
          <div style="height: 100%">
            <chart class="chart" :option="option2"></chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserCatalogue from '@/components/Project/UserCatalogue';
import chart from '@/components/Echarts/Chart/Chart.vue';
import chartsBase from '@/components/Echarts/ChartsBase';
import Common from '@/com/common';
export default {
  name: 'DepartManage',
  components: {
    UserCatalogue,
    chart
  },
  mixins: [chartsBase],
  props: {},
  data() {
    return {
      loading: false,
      pageLoading: true,
      treeList: [],
      originTreeList: [],
      depart: null,
      pageObj: {},
      pageInfo: {
        pageNo: 1,
        pageSize: 50
      },
      list: [],
      realname: '',
      userInfo: null,
      type: 1,
      info: null,
      option: {
        radar: {
          indicator: [],
          center: ['50%', '50%'],
          radius: '60%',
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          splitLine: {
            show: false // 开启最外层边框
          },
          axisLine: {
            lineStyle: {
              type: 'dashed', // 设置为虚线
              color: '#999', // 虚线颜色
              width: 1 // 虚线宽度
            }
          },
          shape: 'polygon' // 确保是多边形
        },
        radius: '50%', // 增大雷达图半径
        graphic: [],
        series: [
          {
            type: 'radar',
            radarIndex: 0,
            data: [
              {
                value: [],
                label: {
                  show: false,
                  position: 'outside', // 改为外部显示
                  distance: 10, // 调整标签与雷达图的距离
                  padding: [5, 5], // 调整标签的内边距
                  color: '#1e9f66',
                  fontSize: 12,
                  fontWeight: 'bold',
                  formatter: '{c}' // 直接显示数值
                },
                areaStyle: {
                  normal: {
                    opacity: 0.8,
                    color: new this.$echarts.graphic.RadialGradient(
                      0.5,
                      0.5,
                      1,
                      [
                        {
                          color: '#219565',
                          offset: 0
                        },
                        {
                          color: '#219565',
                          offset: 1
                        }
                      ]
                    )
                  }
                },
                lineStyle: {
                  normal: {
                    color: 'transparent',
                    width: 0
                  },
                  emphasis: {
                    color: 'transparent',
                    width: 0
                  }
                },
                symbol: 'circle', // 改为显示数据点（可选）
                symbolSize: 1, // 数据点大小
                itemStyle: {
                  normal: {
                    color: '#219565' // 数据点颜色
                  }
                }
              }
            ],
            // Add this for the outer border of the data shape
            lineStyle: {
              width: 3,
              color: '#11BA98'
            }
          }
        ]
      },
      option2: {
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
          tooltip: {
            formatter: (params) => {
              console.log(params, 'sfdsf');
              return (
                `${params.name}<br/>` +
                `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#30cd8c;"></span>` +
                `${params.value}次`
              );
            }
          }
        },
        legend: {
          x: 'right',
          top: '25',
          textStyle: {
            color: '#c1cadf',
            fontSize: 14
          },
          icon: 'circle', // 设置为矩形图标
          itemStyle: {
            // 设置实心样式
            opacity: 1
          },
          data: [],
          itemGap: 20 // 可选：调整图例项之间的间距
        },
        grid: {
          right: 30,
          x: 40,
          y: 40
        },
        toolbox: {
          feature: {
            //saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          axisLabel: {
            interval: 0,
            color: '#c1cadf',
            fontSize: '13'
          },
          data: []
        },
        yAxis: {
          type: 'value',

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
            fontSize: '13'
          },
          splitLine: {
            show: false
          }
        },
        series: []
      }
    };
  },
  created() {
    this.getTreeList();
  },
  methods: {
    getTreeList() {
      this.$api.System.psysysdepartTreeList().then((res) => {
        this.originTreeList = res.result;
      });
    },
    changeType(type) {
      this.type = type;
      this.getAnalysisData();
    },

    handleCurrentChange(data) {
      if (!data.isUser) {
        this.depart = data;
      }
      const realname = this.$refs.catalogue.keyword;
      this.realname = realname;
      if (!data.isUser) {
        this.type = 1;
        this.treeList = Common.CloneDeep(this.originTreeList);
        this.list = [];
        this.pageInfo = { pageNo: 1, pageSize: 50 };

        this.getList();
      } else if (data.isUser) {
        this.userInfo = data;
      }
    },
    removeDuplicatesById(arr) {
      return arr.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
    },
    getList(departId, callback = null) {
      this.loading = true;
      const keyword = this.$refs.catalogue.keyword;
      this.$api.basics
        .userList({
          departId: departId ? departId : this.depart ? this.depart.id : '',
          ...this.pageInfo,
          realname: keyword
        })
        .then((res) => {
          var records = res?.result?.records || [];
          this.pageObj[this.depart.id] = res.result.pages;
          const list = records.map((v) => {
            return {
              id: v.id,
              name: v.realname,
              isUser: true,
              departId: this.depart.id
            };
          });
          const node = this.$refs.catalogue.getNodeData(this.depart.id);
          if (list?.length) {
            this.list = [...this.list, ...list];

            const childrenList = node.data.childrenList
              ? node.data.childrenList
              : [];
            node.data.childrenList = [...childrenList, ...this.list];

            node.data.childrenList = this.removeDuplicatesById(
              node.data.childrenList
            );
            this.treeList = [...this.treeList];
            this.userInfo = this.list[0];
            this.$nextTick(() => {
              this.$refs.catalogue.currentNodeKey = this.userInfo.id;
              this.$refs.catalogue.setCurrentNode(this.userInfo.id);
            });
          } else {
            node.data.childrenList = [];
            this.userInfo = null;
          }
          if (callback) {
            callback();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleScroll() {
      if (this.depart && this.depart.id) {
        const departId = this.depart.id;
        const pages = this.pageObj[departId];
        if (this.pageInfo.pageNo < pages) {
          this.pageInfo.pageNo++;
        }
        this.getList(departId);
      }
    },
    filter(val) {
      if (!this.depart) {
        this.$message.error('请先选择一个部门');
      } else {
        this.list = [];
        this.pageInfo.pageNo = 1;
        this.realname = val;
        this.treeList = Common.CloneDeep(this.originTreeList);
        this.getList(this.depart.id, () => {
          this.$refs.catalogue.initScroll();
        });
      }
    },
    getAnalysisData() {
      this.pageLoading = true;
      this.$api.analysis
        .growthPath({
          type: this.type,
          userId: this.userInfo.id
        })
        .then((res) => {
          this.info = res.result;
          const fiveFactorList = res.result.fiveFactorList;
          const pathList = res.result.pathList;
          if (fiveFactorList) {
            const fiveValuse = fiveFactorList.map((item) => {
              return Number(item.value);
            });
            const fiveMax = Math.max(...fiveValuse);

            this.option.radar.indicator = fiveFactorList.map((item) => {
              return {
                name: item.label + ' ' + item.value,
                max: fiveMax,
                color: '#fff'
              };
            });
            this.option.series[0].data[0].value = fiveValuse;
          }
          if (pathList && pathList.length > 0) {
            const labels = pathList[0].labelInfos.map((v) => v.label);
            this.option2.legend.data = labels;
            const zLabels = pathList.map((v) => v.label);
            this.option2.xAxis.data = zLabels;
            const colors = [
              '#0BE3FF',
              '#5b60f5',
              '#c33273',
              '#f5d35b',
              '#32c368'
            ];
            const infos = pathList.map((v) => {
              return v.labelInfos;
            });

            const series = labels.map((v, index) => {
              const cIndex = index % colors.length;
              let data = [];
              infos.forEach((v) => {
                const value = v[index].value ? v[index].value : 0;
                data.push({
                  ...v[index],
                  value
                });
              });
              console.log(data, '======xxx');
              return {
                type: 'line',
                smooth: true,
                name: v,
                symbolSize: 8,
                data: data,
                barWidth: '30%',
                itemStyle: {
                  normal: {
                    color: colors[cIndex]
                  }
                }
              };
            });
            this.option2.series = series;
          } else {
            this.option2.series = [];
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val && val.id) {
          this.getAnalysisData();
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.component-person-growth {
  padding: 20px;

  .tree-container {
    width: 330px;
    padding-top: 25px;
    background-image: url('~@/assets/images/person-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 10px;
  }

  .radarBg {
    position: absolute;
    top: 17%;
    left: 34.2%;
    width: 31.5%;
    height: 63%;
    background: url('~@/assets/images/radar_bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .chart {
    background: transparent;
  }

  .btns {
    display: flex;

    > div {
      width: 142px;
      height: 39px;
      font-size: 18px;
      line-height: 39px;
      text-align: center;
      margin-right: 10px;
      background-image: url('~@/assets/images/unactive-btn.png');
      background-size: 100%;
      cursor: pointer;
    }

    .active {
      background-image: url('~@/assets/images/active-btn.png');
    }
  }

  .title {
    position: absolute;
    top: 6px;
    left: 10px;
    width: 300px;
    height: 30px;
    background-image: url('~@/assets/images/title-bg.png');
    background-repeat: no-repeat;
    background-position: left top;
    background-size: cover;
    padding-left: 25px;
    font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
    font-size: 20px;
  }

  .box-c {
    position: relative;
    display: inline-block;
    background-color: rgba(41, 130, 103, 0.1);
    padding: 70px 20px 30px 20px;
    font-size: 20px;

    .content {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
