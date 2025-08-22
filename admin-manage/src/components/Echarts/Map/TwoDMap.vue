<!-- 2d 地图 -->
<template>
  <div ref="map" class="component-TwoDMap"></div>
</template>

<script>
import jsonObj from "@/components/echarts/map/json/json";
export default {
  name: "TwoDMap",
  props: {
    mapName: {
      type: String,
      default: "100000",
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      map: null,
      option: null,
    };
  },
  beforeDestroy() {
    // 销毁地图图表
    if (this.map) {
      this.map.dispose();
      this.map = null;
      this.option = null;
    }
  },
  //created(){}
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  filters: {},
  computed: {},
  methods: {
    // 初始化2d地图
    initMap() {
      let mapData = jsonObj[this.mapName];
      this.$echarts.registerMap(this.mapName, mapData);
      this.map = this.$echarts.init(this.$refs.map);
      this.option = {
        tooltip: {
          trigger: "item",
        },
        geo: {
          map: this.mapName,
          roam: true,
          zoom: 1.2,
          aspectScale: 1,
          itemStyle: {
            areaColor: "#2B5890", //地图颜色
            borderWidth: 2, //分界线wdith
            borderColor: "#5578A5", //分界线颜色
          },
          emphasis: {
            label: {
              show: false, //是否显示高亮
              textStyle: {
                color: "#fff", //高亮文字颜色
              },
            },
            itemStyle: {
              color: "#0489d6", //地图高亮颜色
            },
          },
        },
        visualMap: {
          type: "piecewise",
          // 是否展示左下角，即是是false，也仅是不显示，不影响数据的映射
          show: true,
          min: 1,
          max: 3,
          splitNumber: 1,
          // 位置
          left: "10%",
          bottom: "10%",
            pieces: [
            {
              value: 1,
              label: "进行中",
              color: "#1491fb",
            },
            {
              value: 2,
              label: "已完成",
              color: "#00cb04",
            },
            {
              value: 3,
              label: "未开始",
              color: "#fb1414",
            },
          ],
        },
        series: [
          {
            name: "Top 5",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: [{ name: "青岛市", value: [120.33, 36.07, 3] }],
            symbolSize: 16,
            encode: {
              value: 2,
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
            },
            label: {
              formatter: "{b}",
              position: "right",
              show: true,
            },
            itemStyle: {
              normal: {
                color: "rgba(255,0,0,.7)",
                shadowBlur: 2,
                shadowColor: "D8BC37",
              },
            },
            emphasis: {
              scale: true,
            },
            zlevel: 1,
            tooltip: {
              formatter(params) {
                return `地区：${params.name}</br>数值：${params.value[2]}`;
              },
            },
          },
        ],
      };
      this.map.setOption(this.option, true);
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.component-TwoDMap {
  width: 100%;
  height: 99%;
  z-index: 20;
}
</style>