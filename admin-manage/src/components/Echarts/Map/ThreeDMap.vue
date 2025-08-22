<!-- 3d 地图 http://datav.aliyun.com/portal/school/atlas/area_selector#&lat=33.521903996156105&lng=104.29849999999999&zoom=4 -->
<template>
  <div ref="map" class="component-ThreeDMap"></div>
</template>

<script>
import jsonObj from "@/components/echarts/map/json/json";
import "echarts-gl";
export default {
  name: "ThreeDMap",
  props: {
    mapName: {
      type: String,
      default: "100000",
    },
    data: {
      type: Array,
      default: () => {
        return [{ name: "福建省", value: 15 }];
      },
    },
  },
  data() {
    return {
      map: null,
      option: null,
    };
  },
  //created(){}
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  beforeDestroy() {
    // 销毁地图图表
    if (this.map) {
      this.map.dispose();
      this.map = null;
      this.option = null;
    }
  },
  filters: {},
  computed: {},
  methods: {
    // 初始化3d地图
    initMap() {
      let mapData = jsonObj[this.mapName];
      this.$echarts.registerMap(this.mapName, mapData);
      this.map = this.$echarts.init(this.$refs.map);
      this.option = {
        series: [
          {
            type: "map",
            map: this.mapName,
            selectedMode: "single", //地图高亮单选
            regionHeight: 4, //地图高度
            boxDepth: 160, //地图倾斜度
            viewControl: {
              distance: 130, //地图视角 控制初始大小
              rotateSensitivity: [2, 2],
              zoomSensitivity: 2, //缩放操作的灵敏度
              panSensitivity: 2, //平移操作的灵敏度
              rotateMouseButton: "left", //旋转操作使用的鼠标按键
              panMouseButton: "right", //平移操作使用的鼠标按键
            },
            label: {
              show: true, //是否显示市
              textStyle: {
                color: "white", //文字颜色
                fontSize: 18, //文字大小
              },
              formatter: "{b} ", // 这边需要加个空字符，才是作为占位符，不然会被当作字符串处理。
            },
            itemStyle: {
              color: "#2B5890", //地图颜色
              borderWidth: 2, //分界线wdith
              borderColor: "#5578A5", //分界线颜色
            },
            emphasis: {
              label: {
                show: true, //是否显示高亮
                textStyle: {
                  color: "#fff", //高亮文字颜色
                },
              },
              itemStyle: {
                color: "#0489d6", //地图高亮颜色
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
.component-ThreeDMap {
  width: 100%;
  height: calc(100vh - 100px);
}
</style>