<template>
  <div class="portrait">
    <img
      class="back"
      src="@/assets/images/back.png"
      style="width: 40px"
      @click="back()"
    />
    <!-- 左边 -->
    <div class="left flex-layout justify-between">
      <div class="box-item flex-layout">
        <div class="flex-none box-title mb20"><span>基础信息</span></div>
        <div class="flex-auto flex-layout justify-between basic-info">
          <div class="basic-info-item">
            <div>姓名</div>
            <div>{{ user ? user.realname : '--' }}</div>
          </div>
          <div class="basic-info-item">
            <div>性别</div>
            <div>{{ user && user.sex == 1 ? '男' : '女' }}</div>
          </div>
          <div class="basic-info-item">
            <div>年龄</div>
            <div>{{ user ? user.age + '岁' : '--' }}</div>
          </div>
          <div class="basic-info-item">
            <div>籍贯</div>
            <div>
              {{ user && user.placeOfOrigin ? user.placeOfOrigin : '--' }}
            </div>
          </div>
          <div class="basic-info-item">
            <div>单位</div>
            <div>{{ user && user.departName ? user.departName : '--' }}</div>
          </div>
        </div>
      </div>
      <div class="box-item flex-layout">
        <div class="flex-none box-title mb20">
          <span>大数据心理行为特征</span>
        </div>
        <chart :option="option" class="flex-auto"></chart>
      </div>
    </div>
    <!-- 中间 -->
    <div class="center">
      <div class="data1">
        <span>我的天赋</span>
        <p>
          {{ personInfo && personInfo.myTalent ? personInfo.myTalent : '--' }}
        </p>
      </div>
      <div class="data2">
        <span>我的性格</span>
        <p>
          {{
            personInfo && personInfo.myPersonality
              ? personInfo.myPersonality
              : '--'
          }}
        </p>
      </div>
      <div class="data3">
        <span>我的特长</span>
        <p>{{ user && user.specialty ? user.specialty : '--' }}</p>
      </div>
      <div class="data4" style="">
        <span>职业能力倾向：mbti人格</span>
        <p>
          {{
            personInfo &&
            personInfo.personalityAnalysis &&
            personInfo.personalityAnalysis.careerAnalysis
              ? personInfo.personalityAnalysis.careerAnalysis
              : '--'
          }}
        </p>
      </div>
      <div class="data5">
        <span>课堂表现</span>
        <p>
          {{
            personInfo && personInfo.classroomPerformance
              ? personInfo.classroomPerformance
              : '--'
          }}
        </p>
      </div>
      <div class="data6">
        <span>我的爱好</span>
        <p>{{ user && user.hobby ? user.hobby : '--' }}</p>
      </div>

      <canvas id="rain" class="rain"></canvas>
      <canvas class="dashed"></canvas>
      <div class="sphere">
        <div class="sphere-bg"></div>
        <div class="tx"></div>
      </div>
      <div class="cicle3"></div>
      <div class="cicle4"></div>
      <div class="cicle5"></div>
      <div class="cicle6"></div>
      <div class="cicle7"></div>
      <div class="cicle8-box" @click="changeRoute(1)">
        <span class="gradient-text">心理<br />资源</span>
        <div class="cicle8"></div>
      </div>
      <div class="cicle9" @click="changeRoute(2)">
        <span class="gradient-text">职业<br />心理</span>
      </div>
      <div class="cicle10" @click="changeRoute(3)">
        <span class="gradient-text">基础<br />脑力</span>
      </div>
      <div class="cicle11" @click="changeRoute(4)">
        <span class="gradient-text">人格<br />特质</span>
      </div>
    </div>
    <!-- 右边 -->
    <div class="right flex-layout justify-between">
      <div class="box-item flex-layout">
        <div class="flex-none box-title"><span>综合评价</span></div>
        <div class="flex-auto evaluate flex-row justify-center align-center">
          <template v-if="personInfo && personInfo.evaluate">
            {{ personInfo.evaluate }}</template
          >
          <template v-else>
            <el-empty :image-size="1" :image="noData"></el-empty>
          </template>
        </div>
      </div>
      <div class="box-item flex-layout">
        <div class="flex-none box-title"><span>风险预警</span></div>
        <div class="flex-auto flex-layout justify-center align-center">
          <div class="lights flex-row justify-around mb20">
            <div
              class="light"
              :class="{
                'green-light': yj.name == 'green'
              }"
            ></div>
            <div
              class="light"
              :class="{
                'yellow-light': yj.name == 'yellow'
              }"
            ></div>
            <div
              class="light"
              :class="{
                'red-light': yj.name == 'red'
              }"
            ></div>
          </div>
          <div class="day" v-if="yj.name">
            <span
              ><template v-if="yj.name == 'red'">红灯</template
              ><template v-if="yj.name == 'yellow'">黄灯</template
              ><template v-if="yj.name == 'green'">绿灯</template>状态</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chart from '@/components/Echarts/Chart/Chart.vue';
const noData = require('@/assets/images/no-data.png');
export default {
  components: {
    chart
  },
  data() {
    return {
      noData,
      user: null,
      personInfo: null,
      option: {
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
            // 词的大小，最小20px，最大28px，可以在这个范围调整词的大小
            sizeRange: [20, 48],
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
                  // "#01cfa1", "#ffe04d", "#3b92d3"
                  let colorList = ['1,207,161', '255,224,77', '59,146,211'];
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
      zhpj: '',
      yj: {
        name: 'green',
        value: 3
      },
      grxg: []
    };
  },
  mounted() {
    const query = this.$route.query;

    this.dashed();
    this.rainBg();
  },
  methods: {
    back() {
      const query = this.$route.query;
      this.$router.push({
        path: '/fileManagement/fileManagement',
        query: {
          idNumber: query.idNumber,
          userName: query.userName,
          userDictId: query.userDictId
        }
      });
    },
    getUserInfo(id) {
      this.$api.System.userQueryById({ id }).then((res) => {
        this.user = res.result;
        this.getPersonalProfile(id);
      });
    },
    getPersonalProfile(id) {
      this.$api.analysis
        .personalProfile({
          userId: id
        })
        .then((res) => {
          const info = res.result;
          this.personInfo = info;
          const networkWords = info.networkWords;
          const networkkeys = Object.keys(networkWords);
          const networkData = networkkeys.map((key) => {
            return {
              name: key,
              value: networkWords[key]
            };
          });
          this.initXlxwtz(networkData);
          const warnLevel = info.warnLevel;
          this.yj.value = warnLevel;
          if (warnLevel == 1) {
            this.yj.name = 'red';
          } else if (warnLevel == 2) {
            this.yj.name = 'yellow';
          } else if (warnLevel == 3) {
            this.yj.name = 'green';
          } else {
            this.yj.name = '';
          }
        });
    },
    // 大数据心理行为特征
    initXlxwtz(data) {
      if (data && data.length > 0) {
        this.option.series[0].data = data;
      }
    },
    dashed() {
      var canvas = document.querySelector('.dashed');
      var ctx = canvas.getContext('2d');
      var w = (canvas.width = document.querySelector('.center').clientWidth);
      var h = (canvas.height =
        (document.querySelector('.center').clientHeight / 3) * 2);
      ctx.lineWidth = 3;
      ctx.setLineDash([3, 3]);
      ctx.fillStyle = '#019CEC';
      ctx.shadowOffsetX = 0;
      // 阴影的y偏移
      ctx.shadowOffsetY = 0;
      // 阴影颜色
      ctx.shadowColor = '#019CEC';
      // 阴影的模糊半径
      ctx.shadowBlur = 15;
      ctx.save(); //缓存初始状态
      // 绘制第一条曲线
      ctx.beginPath();
      var grd = ctx.createLinearGradient(w / 11, h / 3, (w / 5) * 2, h);
      grd.addColorStop(0, '#43faeb');
      grd.addColorStop(1, 'transparent');
      ctx.strokeStyle = grd;
      ctx.moveTo((w / 5) * 2, h);
      ctx.quadraticCurveTo(w / 5, (h / 6) * 5, (w / 8) * 2, h / 3);
      ctx.stroke();
      // 绘制第一条曲线上的圆光效果
      ctx.beginPath();
      ctx.moveTo((w / 8) * 2, h / 3);
      ctx.arc((w / 8) * 2, h / 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      // 绘制第二条线
      ctx.beginPath();
      var grd = ctx.createLinearGradient(
        (w / 11) * 3.3,
        h / 2,
        (w / 3) * 1.1,
        (h / 6) * 5
      );
      grd.addColorStop(0, '#43faeb');
      grd.addColorStop(1, 'transparent');
      ctx.strokeStyle = grd;
      ctx.moveTo((w / 3) * 1.1, (h / 6) * 5);
      ctx.quadraticCurveTo((w / 5) * 1.5, (h / 6) * 4.2, (w / 11) * 3.3, h / 2);
      ctx.stroke();
      // 绘制第二条曲线上的圆光效果
      ctx.beginPath();
      ctx.moveTo((w / 11) * 3.3, h / 2);
      ctx.arc((w / 11) * 3.3, h / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      // 绘制第三条线
      ctx.beginPath();
      var grd = ctx.createLinearGradient(
        (w / 3) * 1.4,
        h / 5,
        (w / 5) * 2,
        h / 2
      );
      grd.addColorStop(0, '#43faeb');
      grd.addColorStop(1, 'transparent');
      ctx.strokeStyle = grd;
      ctx.moveTo((w / 5) * 2, h / 2);
      ctx.quadraticCurveTo((w / 3) * 0.8, (h / 4) * 1.4, (w / 3) * 1.2, h / 8);
      ctx.stroke();
      // 绘制第三条曲线上的圆光效果
      ctx.beginPath();
      ctx.moveTo((w / 3) * 1.4, h / 5);
      ctx.arc((w / 3) * 1.2, h / 8, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      // 绘制第四条线
      ctx.beginPath();
      var grd = ctx.createLinearGradient(
        (w / 5) * 3.1,
        (h / 3) * 1.2,
        (w / 5) * 3.2,
        (h / 2) * 1.5
      );
      grd.addColorStop(0, '#43faeb');
      grd.addColorStop(1, 'transparent');
      ctx.strokeStyle = grd;
      ctx.moveTo((w / 5) * 3.2, (h / 2) * 1.5);
      ctx.quadraticCurveTo(
        (w / 5) * 3.35,
        (h / 2) * 1.2,
        (w / 5) * 3.1,
        (h / 3) * 1.2
      );
      ctx.stroke();
      // 绘制第四条曲线上的圆光效果
      ctx.beginPath();
      ctx.moveTo((w / 5) * 3.1, (h / 3) * 1.2);
      ctx.arc((w / 5) * 3.1, (h / 3) * 1.2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      // 绘制第五条线
      ctx.beginPath();
      var grd = ctx.createLinearGradient(
        (w / 5) * 3.3,
        h / 4,
        (w / 5) * 3.2,
        (h / 2) * 1.9
      );
      grd.addColorStop(0, '#43faeb');
      grd.addColorStop(1, 'transparent');
      ctx.strokeStyle = grd;
      ctx.moveTo((w / 5) * 3.03, (h / 2) * 1.9);
      ctx.quadraticCurveTo((w / 5) * 3.8, (h / 2) * 1.2, (w / 5) * 3.3, h / 4);
      ctx.stroke();
      // 绘制第五条曲线上的圆光效果
      ctx.beginPath();
      ctx.moveTo((w / 5) * 3.3, h / 4);
      ctx.arc((w / 5) * 3.3, h / 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      // 绘制第六条线
      ctx.beginPath();
      var grd = ctx.createLinearGradient(
        (w / 5) * 3.8,
        (h / 2) * 1.2,
        (w / 5) * 2.9,
        h
      );
      grd.addColorStop(0, '#43faeb');
      grd.addColorStop(1, 'transparent');
      ctx.strokeStyle = grd;
      ctx.moveTo((w / 5) * 2.9, h);
      ctx.quadraticCurveTo(
        (w / 5) * 3.7,
        (h / 2) * 1.6,
        (w / 5) * 3.8,
        (h / 2) * 1.2
      );
      ctx.stroke();
      // 绘制第六条曲线上的圆光效果
      ctx.beginPath();
      ctx.moveTo((w / 5) * 3.8, (h / 2) * 1.2);
      ctx.arc((w / 5) * 3.8, (h / 2) * 1.2, 5, 0, Math.PI * 2);
      ctx.fill();
    },
    rainBg() {
      var c = document.getElementById('rain');
      var ctx = c.getContext('2d'); //获取canvas上下文
      var w = (c.width = document.querySelector('.center').clientWidth);
      var h = (c.height = document.querySelector('.center').clientHeight);
      //设置canvas宽、高
      function random(min, max) {
        return Math.random() * (max - min) + min;
      }

      function RainDrop() {}
      //雨滴对象 这是绘制雨滴动画的关键
      RainDrop.prototype = {
        init: function () {
          this.x = random(0, w); //雨滴的位置x
          this.y = h; //雨滴的位置y
          this.color = 'hsl(180, 100%, 50%)'; //雨滴颜色 长方形的填充色
          this.vy = random(4, 5); //雨滴下落速度
          this.hit = 0; //下落的最大值
          this.size = 2; //长方形宽度
        },
        draw: function () {
          if (this.y > this.hit) {
            var linearGradient = ctx.createLinearGradient(
              this.x,
              this.y,
              this.x,
              this.y + this.size * 30
            );
            // 设置起始颜色
            linearGradient.addColorStop(0, '#14789c');
            // 设置终止颜色
            linearGradient.addColorStop(1, '#090723');
            // 设置填充样式
            ctx.fillStyle = linearGradient;
            ctx.fillRect(this.x, this.y, this.size, this.size * 50); //绘制长方形，通过多次叠加长方形，形成雨滴下落效果
          }
          this.update(); //更新位置
        },
        update: function () {
          if (this.y > this.hit) {
            this.y -= this.vy; //未达到底部，增加雨滴y坐标
          } else {
            this.init();
          }
        }
      };

      function resize() {
        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;
      }

      //初始化一个雨滴
      var rs = [];
      for (var i = 0; i < 10; i++) {
        setTimeout(function () {
          var r = new RainDrop();
          r.init();
          rs.push(r);
        }, i * 300);
      }

      function anim() {
        ctx.clearRect(0, 0, w, h); //填充背景色，注意不要用clearRect，否则会清空前面的雨滴，导致不能产生叠加的效果
        for (var i = 0; i < rs.length; i++) {
          rs[i].draw(); //绘制雨滴
        }
        requestAnimationFrame(anim); //控制动画帧
      }

      window.addEventListener('resize', resize);

      //启动动画
      anim();
    },
    changeRoute(val) {
      const query = this.$route.query;
      if (val == 1) {
        this.$router.push({
          path: '/person/xlzy',
          query
        });
      } else if (val == 2) {
        this.$router.push({
          path: '/persono/zyxl',
          query
        });
      } else if (val == 3) {
        this.$router.push({
          path: '/person/jcnl',
          query
        });
      } else if (val == 4) {
        this.$router.push({
          path: '/person/rgtz',
          query
        });
      }
    }
  },
  watch: {
    '$route.query': {
      handler(val) {
        if (val && val.userId) {
          this.getUserInfo(val.userId);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import './css/index.scss';
.portrait {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  .back {
    position: absolute;
    top: -5px;
    left: 15px;
    cursor: pointer;
  }
  .left {
    position: absolute;
    width: 27%;
    height: calc(100% - 50px);
    left: 20px;
    top: 30px;
    .basic-info-item {
      width: 100%;
      height: 46px;
      background-image: url('~@/assets/images/portrait/basicInfo-bg.png');
      background-repeat: no-repeat;
      background-size: 100% auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px 0 30px;
    }
  }
  .right {
    position: absolute;
    width: 27%;
    height: calc(100% - 50px);
    right: 20px;
    top: 30px;
    .evaluate {
      font-size: 18px;
      line-height: 30px;
      background-image: url('~@/assets/images/portrait/evaluate-bg.png');
      background-position: center 65%;
      background-repeat: no-repeat;
      background-size: 48%;
    }
    .lights {
      width: 100%;
      height: 140px;
      background-image: url('~@/assets/images/portrait/light-bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .light {
        width: 33.3%;
        background-image: url('~@/assets/images/portrait/light.png');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .red-light {
        background-image: url('~@/assets/images/portrait/red-light.png');
      }
      .yellow-light {
        background-image: url('~@/assets/images/portrait/yellow-light.png');
      }
      .green-light {
        background-image: url('~@/assets/images/portrait/green-light.png');
      }
    }
    .day {
      font-size: 20px;
      color: #fff;
      font-weight: bold;
    }
  }

  .box-item {
    height: calc(50% - 10px);
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(41, 130, 103, 0.1);
  }

  .center {
    width: 65%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    .rain {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }

    .data1,
    .data2,
    .data3,
    .data4,
    .data5,
    .data6 {
      position: absolute;
      padding: 6px;
      background: linear-gradient(
        to right,
        rgba(3, 55, 68, 0.5),
        rgba(3, 55, 68, 0)
      ); /* 从左到右的渐变 */
      text-align: center;
      min-width: 93px;
      span {
        //   color: #0ac1c7;
        font-size: 20px;
        font-style: italic;
        font-family: '宋体';
        background: linear-gradient(to bottom, #fff, #27bbc6); /* 渐变颜色 */
        -webkit-background-clip: text; /* 仅在 WebKit 浏览器中有效 */
        -webkit-text-fill-color: transparent; /* 使文字填充透明 */
      }

      p {
        font-family: '宋体';
        font-size: 18px;
        color: #d1d6df;
        margin: 0;
        line-height: 1.3;
      }
    }

    .data1 {
      left: 19%;
      top: 13%;
    }

    .data2 {
      left: 26%;
      top: 26%;
      font-family: SourceHanSansSC-Medium;
      font-size: 14px;
      span {
        font-size: 12px;
      }
      p {
        font-size: 13px;
        font-family: fangsong;
      }
    }

    .data3 {
      left: 36%;
      top: 0%;
      max-width: 300px;
    }

    .data4 {
      left: 48%;
      bottom: 71vh;
      min-height: 50px;
      width: 450px;

      background: linear-gradient(
        to right,
        rgba(3, 55, 68, 0.5),
        rgba(3, 55, 68, 0.2)
      );
      p {
        font-size: 13px;
        font-family: SourceHanSansSC-Medium;
      }
    }
    .data5 {
      left: 58%;
      top: 18%;
      max-width: 300px;
      span {
        font-size: 13px;
      }
      p {
        font-size: 13px;
        font-family: SourceHanSansSC-Medium;
      }
    }
    .data6 {
      left: 71%;
      top: 31%;
    }

    .dashed {
      position: absolute;
      left: 0;
      top: 0;
    }

    .sphere {
      width: 38rem;
      height: 38rem;
      position: relative;
      margin: 0% auto 0;
      padding-top: 14%;

      .sphere-bg {
        position: absolute;
        z-index: 100;
        left: 0;
        top: 10%;
        width: 100%;
        height: 100%;
        background-image: url('~@/assets/images/portrait/earth.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }
      .tx {
        position: absolute;
        z-index: 50;
        left: 0;
        top: 10%;
        width: 100%;
        height: 100%;
        background: url('~@/assets/images/portrait/tx.png') no-repeat center;
        background-size: 40% auto;
      }
    }

    .cicle3 {
      width: 35rem;
      height: 35rem;
      background: url('~@/assets/images/portrait/circle.png') no-repeat center;
      background-size: 100%;
      position: absolute;
      top: 46%;
      left: 50%;
      transform-style: preserve-3d;
      transform: translateX(-50%) rotateX(75deg);
      animation: rotate3 20s linear infinite;
    }

    .cicle4 {
      width: 15rem;
      height: 15rem;
      position: absolute;
      top: 63%;
      left: 50%;
      transform-style: preserve-3d;
      background: url('~@/assets/images/portrait/53gqright.png') no-repeat
        center;
      background-size: 100%;
      transform: translateX(-50%) rotateX(75deg);
      animation: rotate3 2s linear infinite;
    }

    .cicle5 {
      width: 15rem;
      height: 15rem;
      position: absolute;
      top: 63%;
      left: 50%;
      transform-style: preserve-3d;
      background: url('~@/assets/images/portrait/53gqleft.png') no-repeat center;
      background-size: 100%;
      transform: translateX(-50%) rotateX(75deg);
      animation: rotate4 2s linear infinite;
    }

    .cicle6 {
      width: 12rem;
      height: 12rem;
      position: absolute;
      top: 68%;
      left: 50%;
      transform-style: preserve-3d;
      background: url('~@/assets/images/portrait/535gqbottomright.png')
        no-repeat center;
      background-size: 100%;
      transform: translateX(-50%) rotateX(75deg);
      animation: rotate3 2s linear infinite;
    }

    .cicle7 {
      width: 12rem;
      height: 12rem;
      position: absolute;
      top: 68%;
      left: 50%;
      transform-style: preserve-3d;
      background: url('~@/assets/images/portrait/53gqbottomleft.png') no-repeat
        center;
      background-size: 100%;
      transform: translateX(-50%) rotateX(75deg);
      animation: rotate4 2s linear infinite;
    }
    .cicle8-box {
      width: 8rem;
      height: 8rem;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 100;
      margin-left: -4rem;
      border-radius: 50%;
      animation: rotate5 20s linear infinite;
      display: flex;
      align-items: center;
      color: #ffffff;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      .cicle8 {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: url('~@/assets/images/portrait/circle2.png') no-repeat
          center;
        background-size: 100%;
        z-index: 2;
      }
      .gradient-text {
        font-size: 30px;
        font-weight: bold;
        background: linear-gradient(to bottom, #fff, #27bbc6); /* 渐变颜色 */
        -webkit-background-clip: text; /* 仅在 WebKit 浏览器中有效 */
        -webkit-text-fill-color: transparent; /* 使文字填充透明 */
        width: 100%;
        height: 100%;
        display: block;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    .cicle9,
    .cicle10,
    .cicle11 {
      width: 8rem;
      height: 8rem;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 100;
      margin-left: -4rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      span {
        display: block;
        margin-left: 25%;
        font-size: 1.5rem;
        margin-top: 20%;
      }

      p {
        text-align: center;
        font-size: 0.7rem;
      }
      .gradient-text {
        font-size: 30px;
        font-weight: bold;
        background: linear-gradient(to bottom, #fff, #27bbc6); /* 渐变颜色 */
        -webkit-background-clip: text; /* 仅在 WebKit 浏览器中有效 */
        -webkit-text-fill-color: transparent; /* 使文字填充透明 */
        width: 100%;
        height: 100%;
        display: block;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    //   .cicle8 {
    //     background: url("~@/assets/images/portrait/circle2.png") no-repeat;
    //     background-size: 100%;
    //     animation: rotate5 20s linear infinite;
    //     color: #f29701;
    //   }

    .cicle9 {
      background: url('~@/assets/images/portrait/circle2.png') no-repeat;
      background-size: 100%;
      animation: rotate6 20s linear infinite;
      color: #0ac1c7;
    }

    .cicle10 {
      background: url('~@/assets/images/portrait/circle2.png') no-repeat;
      background-size: 100%;
      animation: rotate7 20s linear infinite;
      color: #f29701;
    }

    .cicle11 {
      background: url('~@/assets/images/portrait/circle2.png') no-repeat;
      background-size: 100%;
      color: #0ac1c7;
      animation: rotate8 20s linear infinite;
    }
  }
}
</style>
