### Search 搜索组件

```
{
  "params": {
    "userid": "",
    "username": "",
    "logType": "",
    "startTime": "",
    "endTime": ""
  },
  "fieldsConfig": [
    {
      "label": "输入框:",
      "compType": "input",
      "width": 160,
      "prop": "userid"
    },
    {
      "label": "下拉选择框:",
      "compType": "select",
      "width": 160,
      "prop": "logType",
      "options": [
        { "value": 1, "label": "登录" },
        { "value": 2, "label": "数据库管理" },
        { "value": 3, "label": "数据服务" },
        { "value": 4, "label": "系统管理" }
      ]
    },
    {
          label: "角色",
          compType: "roleSelect",
          width: 160,
          prop: "logType",
        },
    {
      label: "入库时间",
      compType: "datetime",
      format: "yyyy-MM-dd hh:mm:ss",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
      width: 160,
      placeholder: "产品名称",
      prop: "userid",
    },
    {
      "label": "时间区间选择器:",
      "compType": "rangeTime",
      "width": 300,
      "valueFormat": "yyyy-MM-dd HH:mm:ss",
      "propStart": "startTime",
      "propEnd": "endTime"
    }
  ]
}

```

### Echarts 组件

```
import chart from "@/components/Echarts/Chart/Chart.vue";
import chartsBase from "@/components/Echarts/ChartsBase";
import { echartsFormatterPrecent } from "@/utils/utils.js";
export default {
  name: 'xxx',
  components: { chart},
  props: {},
  mixins: [chartsBase],
  data() {
    return {
      // 柱状图
      option: {
        dataZoom: this.getXDataZoom(),
        xAxis: {
          type: 'category',
          name: '部门',
          data: [],
          axisLabel: {
            interval: 0,
            formatter: this.axisLabelFormatter,
          },
        },
        yAxis: {
          type: 'value',
          name: '数量/次',
          minInterval: 1,
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            data: [],
            type: 'bar',
            barWidth: 20,
          },
        ],
        tooltip: {
          trigger: 'item',
          formatter: '开展课程次数 {c}',
        },
      },
      // 饼图-没有连接线
      option2: {
        legend: {
          right: '20px',
          bottom: '20%',
          orient: 'vertical',
          icon: 'circle',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            data: [
              { name: '超时完成', value: 0 },
              { name: '规定完成', value: 0 },
            ],
            label: {
              normal: {
                show: true,
                position: 'inner',
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  // formatter: '{d}%',
                  formatter: (val) => {
                    const precent = echartsFormatterPrecent(this.option2, val);
                    return precent;
                  },
                },
                labelLine: {
                  show: true,
                },
              },
            },
          },
        ],
      },
      // 饼图-带连接线
      option3: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>使用占比：{d}%',
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: [],
            label: {
              normal: {
                formatter: '{b}\n{c}次',
              },
            },
          },
          {
            type: 'pie',
            radius: '60%',
            data: [],
            label: {
              normal: {
                show: true,
                position: 'inner',
                formatter: '{d}%',
              },
            },
          },
        ],
      },
      // 饼图带空心
      option4: {
        legend: {
          right: 'right',
          bottom: '15%',
          icon: 'circle',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>数量占比 {d}%',
        },
        title: {
          text: '',
          top: '40%',
          left: 'center',
          textStyle: {
            fontSize: 26,
          },
        },
        graphic: {
          type: 'text',
          top: '52%',
          left: 'center',
          style: {
            text: '使用量',
            color: '#666',
            fontSize: 14,
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            data: [
              { value: 0, name: '非消耗品' },
              { value: 0, name: '消耗品' },
            ],
            label: {
              normal: {
                show: false,
              },
            },
          },
        ],
      },
      // 折线
      option5: {
        legend: {
          data: ['消耗品', '非消耗品'],
        },
        dataZoom: this.getXDataZoom(),
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLabel: {
            interval: 0,
            formatter: this.axisLabelFormatter,
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            name: '消耗品',
            type: 'line',
            stack: 'Total',
            data: [],
          },
          {
            name: '非消耗品',
            type: 'line',
            stack: 'Total',
            data: [],
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      }
    };
  }
};
```
