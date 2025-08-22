<template>
  <div class="statistics-monitor">
    <div class="box">
      <Card class="card-box">
        <div class="chart-1">
          <div class="tabs-box">
            <TabsRadioGroup
              v-model="optionType"
              :list="optionTab"
              size="mini"
            />
          </div>
          <chart :option="option"></chart>
        </div>
        <div class="chart-2">
          <chart :option="option2"></chart>
        </div>
      </Card>
    </div>
    <div class="box">
      <Card class="person-card">
        <el-row :gutter="0">
          <el-col :span="4">序号</el-col>
          <el-col :span="10">人员</el-col>
          <el-col :span="6">次数</el-col>
          <el-col :span="2">状态</el-col>
        </el-row>
        <div>
          <el-row :gutter="0" class="row-box">
            <el-col :span="4">
              <div class="xh">1</div>
            </el-col>
            <el-col :span="10"> <div class="ry">张三</div> </el-col>
            <el-col :span="6"> <div class="count">100</div> </el-col>
            <el-col :span="2"><div class="statue">频繁</div> </el-col>
          </el-row>
          <el-row :gutter="0" class="row-box">
            <el-col :span="4">
              <div class="xh">1</div>
            </el-col>
            <el-col :span="10"> <div class="ry">张三</div> </el-col>
            <el-col :span="6"> <div class="count">100</div> </el-col>
            <el-col :span="2"><div class="statue">频繁</div> </el-col>
          </el-row>
          <el-row :gutter="0" class="row-box">
            <el-col :span="4">
              <div class="xh">1</div>
            </el-col>
            <el-col :span="10"> <div class="ry">张三</div> </el-col>
            <el-col :span="6"> <div class="count">100</div> </el-col>
            <el-col :span="2"><div class="statue">频繁</div> </el-col>
          </el-row>
          <el-row :gutter="0" class="row-box">
            <el-col :span="4">
              <div class="xh">1</div>
            </el-col>
            <el-col :span="10"> <div class="ry">张三</div> </el-col>
            <el-col :span="6"> <div class="count">100</div> </el-col>
            <el-col :span="2"><div class="statue">频繁</div> </el-col>
          </el-row>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import TabsRadioGroup from "@/components/RadioGroup/RadioGroup";
import Card from "@/components/Card/Card";

// echarts
import chart from "@/components/Echarts/Chart/Chart.vue";
import chartsBase from "@/components/Echarts/ChartsBase";
export default {
  components: {
    Card,
    chart,
    TabsRadioGroup,
  },
  mixins: [chartsBase],
  data() {
    return {
      count: 10,
      optionType: "all",
      optionTab: [
        {
          value: "all",
          name: "全部",
        },
        {
          value: "month",
          name: "近一月",
        },
        {
          value: "week",
          name: "近一周",
        },
      ],
      // 档案管理柱状图
      option: {
        dataZoom: this.getXDataZoom(10),
        xAxis: {
          type: "category",
          name: "部门",
          data: ["项目类", "文档类", "军事类", "知识类", "其他类"],
          axisLabel: {
            interval: 0,
            rotate: 45,
            formatter: this.axisLabelFormatter,
          },
        },
        yAxis: {
          type: "value",
          name: "数量",
          minInterval: 1,
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            data: [800, 270, 320, 450, 400, 850],
            type: "bar",
            barWidth: 30,
            itemStyle: {
              normal: {
                color: "rgba(102, 153, 255, 1)",
              },
            },
          },
        ],
        tooltip: {
          trigger: "item",
          formatter: "{c}",
        },
      },
      option2: {
        legend: {
          right: "150px",
          bottom: "15%",
          orient: "vertical",
          icon: "circle",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>数量占比 {d}%",
        },
        title: {
          text: "使用量",
          top: "43%",
          left: "36.5%",
          textStyle: {
            color: "#666",
            fontSize: 14,
          },
        },
        graphic: {
          type: "text",
          top: "52%",
          left: "37.5%",
          style: {
            text: "12000",
            color: "#666",
            fontSize: 14,
          },
        },
        series: [
          {
            type: "pie",
            radius: ["30%", "50%"],
            center: ["40%", "50%"],
            data: [
              {
                value: 4544,
                name: "科研类",
              },
              { value: 1000, name: "部门1" },
              { value: 2000, name: "部门2" },
              { value: 3000, name: "部门3" },
              { value: 1800, name: "部门4" },
              { value: 5400, name: "其他" },
            ],
            label: {
              normal: {
                show: true,
              },
            },
          },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.statistics-monitor {
  padding: 20px;
  overflow: hidden;
  > div {
    float: left;
    width: calc(50% - 15px);
  }
  .card-box {
    position: relative;
    height: 88vh;
    .tabs-box {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
  > div:nth-child(1) {
    margin-right: 30px;
  }
  .chart-1 {
    height: 400px;
  }
  .chart-2 {
    height: calc(100% - 400px);
  }
  .person-card {
    padding: 60px 40px;
    // text-align: center;
    font-size: 14px;
    color: #606266;
    height: 88vh;
    .el-col:nth-child(1) {
      text-align: center;
    }
    .el-col:nth-child(4) {
      text-align: center;
    }
    .row-box {
      padding: 16px 0;

      .xh {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f2;
        min-width: 30px;
        height: 22px;
        font-size: 14px;
        border-radius: 50px/40px;
      }
      .statue {
        display: inline-flex;
        padding: 4px 6px;
        border-radius: 4px;
        color: #fff;
        background-color: darkgreen;
      }
    }
    .row-box:nth-child(1) {
      .xh {
        background-color: red;
        color: #fff;
      }
      .statue {
        background-color: red;
        color: #fff;
      }
    }
    .row-box:nth-child(2) {
      .xh {
        background-color: dodgerblue;
        color: #fff;
      }
    }
    .row-box:nth-child(3) {
      .xh {
        background-color: chartreuse;
        color: #fff;
      }
    }
  }
}
</style>
