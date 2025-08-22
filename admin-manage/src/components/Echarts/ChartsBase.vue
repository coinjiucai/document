<script>
export default {
  name: 'chartsBase',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    getXDataZoom(maxValueSpan = 2, height = 0) {
      if (window.pdfViewTime) {
        return null;
      }
      return [
        {
          start: 0, // 默认为0
          end: 100, // 默认为100
          type: 'slider',
          maxValueSpan: maxValueSpan, // 显示数据的条数(默认显示10个，注意：从 0 开始计算)
          show: true, //是否显示滚动条(this.XData换成自己的数据)
          xAxisIndex: [0],
          handleSize: 0, // 滑动条的 左右2个滑动条的大小
          height: height,
          bottom: 10,
          borderColor: 'transparent',
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          filterMode: 'filter',
          moveHandleStyle: {
            color: 'rgba(0,0,0,0.2)',
            shadowColor: 'rgba(0,0,0,0)',
            borderCap: 'round'
          }
        }
      ];
    },
    getYDataZoom(maxValueSpan = 10) {
      return [
        {
          start: 0, // 默认为0
          end: 100, // 默认为100
          type: 'slider',
          maxValueSpan: maxValueSpan, // 显示数据的条数(默认显示10个，注意：从 0 开始计算)
          show: true, //是否显示滚动条(this.XData换成自己的数据)
          yAxisIndex: [0],
          handleSize: 0, // 滑动条的 左右2个滑动条的大小
          height: 0,
          left: 10,
          borderColor: 'transparent',
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          filterMode: 'filter',
          moveHandleStyle: {
            color: 'rgba(0,0,0,0.2)',
            shadowColor: 'rgba(0,0,0,0)',
            borderCap: 'round'
          }
        },
        {
          type: 'slider',
          yAxisIndex: [0],
          width: 0,
          borderColor: 'transparent',
          showDataShadow: false,
          showDetail: false,
          moveHandleStyle: {
            color: 'rgba(0,0,0,0.2)',
            shadowColor: 'rgba(0,0,0,0)',
            borderCap: 'round'
          }
        }
      ];
    },
    axisLabelFormatter(value) {
      var ret = ''; //拼接加\n返回的类目项
      var maxLength = 10; //每项显示文字个数
      var valLength = value.length; //X轴类目项的文字个数
      var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
      if (rowN > 1) {
        //如果类目项的文字大于5,
        for (var i = 0; i < rowN; i++) {
          var temp = ''; //每次截取的字符串
          var start = i * maxLength; //开始截取的位置
          var end = start + maxLength; //结束截取的位置
          //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
          temp = value.substring(start, end) + '\n';
          ret += temp; //凭借最终的字符串
        }
        return ret;
      } else {
        return value;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
