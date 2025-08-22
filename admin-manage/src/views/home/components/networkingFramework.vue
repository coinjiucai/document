<template>
  <div
    class="component-networkingFramework full-block flex-row justify-between"
  >
    <div class="noData" v-show="list.length < 8">暂无数据</div>
    <template> </template>
    <div
      class="left flex-layout justify-between align-center"
      v-show="list.length >= 8"
    >
      <span id="l1">
        <template v-if="list[0]"
          >{{ list[0].workName }} {{ list[0].workValue }}</template
        >
      </span>
      <span id="l2"
        ><template v-if="list[1]"
          >{{ list[1].workName }} {{ list[1].workValue }}</template
        ></span
      >
      <span id="l3"
        ><template v-if="list[2]"
          >{{ list[2].workName }} {{ list[2].workValue }}</template
        ></span
      >
      <span id="l4"
        ><template v-if="list[3]"
          >{{ list[3].workName }} {{ list[3].workValue }}</template
        ></span
      >
    </div>
    <div
      class="center flex-row justify-center align-center"
      v-show="list.length >= 8"
    >
      <span id="center">心理工作情况</span>
    </div>
    <div
      class="right flex-layout justify-between align-center"
      v-show="list.length >= 8"
    >
      <span id="r1"
        ><template v-if="list[4]"
          >{{ list[4].workName }} {{ list[4].workValue }}
        </template></span
      >
      <span id="r2"
        ><template v-if="list[5]"
          >{{ list[5].workName }} {{ list[5].workValue }}</template
        ></span
      >
      <span id="r3"
        ><template v-if="list[6]"
          >{{ list[6].workName }} {{ list[6].workValue }}</template
        ></span
      >
      <span id="r4"
        ><template v-if="list[7]"
          >{{ list[7].workName }} {{ list[7].workValue }}</template
        ></span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'networkingFramework',
  data() {
    return {
      list: []
    };
  },
  mounted() {},
  destroyed() {
    this.removeLines();
  },
  methods: {
    init() {
      this.initLines();
      window.addEventListener('resize', this.initLines);
    },
    initLines() {
      this.removeLines();
      this.drawLine(
        document.getElementById('l1'),
        document.getElementById('center'),
        1
      );
      this.drawLine(
        document.getElementById('l2'),
        document.getElementById('center'),
        1
      );
      this.drawLine(
        document.getElementById('l3'),
        document.getElementById('center'),
        1
      );
      this.drawLine(
        document.getElementById('l4'),
        document.getElementById('center'),
        1
      );
      this.drawLine(
        document.getElementById('r1'),
        document.getElementById('center'),
        2
      );
      this.drawLine(
        document.getElementById('r2'),
        document.getElementById('center'),
        2
      );
      this.drawLine(
        document.getElementById('r3'),
        document.getElementById('center'),
        2
      );
      this.drawLine(
        document.getElementById('r4'),
        document.getElementById('center'),
        2
      );
    },
    drawLine(obj1, obj2, type) {
      // 起点坐标
      var x1 =
        type == 1
          ? obj1.getBoundingClientRect().right
          : obj1.getBoundingClientRect().left;
      var y1 = obj1.getBoundingClientRect().top + obj1.clientHeight / 2;

      // 终点坐标
      var x2 =
        type == 1
          ? obj2.getBoundingClientRect().left
          : obj2.getBoundingClientRect().right;
      var y2 = obj2.getBoundingClientRect().top + obj2.clientHeight / 2;

      // 计算连接线长度
      var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

      // 计算连接线旋转弧度值
      var rad = Math.atan2(y2 - y1, x2 - x1);

      // 连接线未旋转前，起点坐标计算
      var top = (y1 + y2) / 2;
      var left = (x1 + x2) / 2 - length / 2;

      // 创建连接线 dom 节点，并设置样式
      var line = document.createElement('div');
      var style =
        'position: absolute; background-color: #01cfa1; height: 1px; top:' +
        top +
        'px; left:' +
        left +
        'px; width: ' +
        length +
        'px;   transform: rotate(' +
        rad +
        'rad);';
      line.setAttribute('style', style);
      line.setAttribute('id', 'line');
      document.body.appendChild(line);
    },
    removeLines() {
      let lines = document.querySelectorAll('#line');
      lines.forEach((line) => {
        document.body.removeChild(line);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.component-networkingFramework {
  position: relative;
  padding-top: 10px;
  .left,
  .center,
  .right {
    width: calc((100% - 40px) / 3);
  }
  span {
    width: 100%;
    padding: 5px 0;
    font-size: 16px;
  }
  .left {
    span {
      background-image: url('~@/assets/images/bg-l.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      text-align: right;
      padding-right: 20px;
    }
  }
  .center {
    span {
      background-image: linear-gradient(0deg, #03e0c1 0%, #0e2425 100%);
      border-style: solid;
      border-width: 1px;
      border-image-source: linear-gradient(0deg, #06e1c6 0%, #04e4c8 100%);
      border-image-slice: 1;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
  }
  .right {
    span {
      background-image: url('~@/assets/images/bg-r.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      text-align: left;
      padding-left: 20px;
    }
  }
  .noData {
    height: 100%;
    width: 100%;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
