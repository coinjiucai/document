<template>
  <div class="naodian-container">
    <div class="title">脑电综合训练系统</div>
    <div class="boxs">
      <div class="left" @click="goLink(1)">
        <img src="@/assets/images/naodian/1.png" alt="" />
        <div class="text">脑认知功能评估训练系统（用户端）</div>
      </div>
      <div class="right" @click="goLink(2)">
        <img src="@/assets/images/naodian/2.png" alt="" />
        <div class="text">脑认知功能评估训练系统（管理端）</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goLink(type) {
      if (type == 1) {
        window.open(`${window.NAODIAN_USER}`, '_blank');
      } else {
        window.open(`${window.NAODIAN_MANAGE}`, '_blank');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.naodian-container {
  position: relative;
  font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/images/naodian/bg.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .title {
    font-size: 40px;
    color: rgba(255, 255, 255, 0.8);
    padding-top: 14px;
    text-align: center;
  }
  .boxs {
    display: flex;
    justify-content: center;
    margin-top: 24vh;
    > div {
      position: relative;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .left {
      width: 16vw;
      font-size: 32px;
      .text {
        margin-left: -2vw;
        margin-top: -11vh;
        transform: rotate(2deg);
      }
    }
    .right {
      margin-left: 10vw;
      width: 16vw;

      font-size: 32px;
      .text {
        margin-left: -1vw;
        margin-top: -12vh;
        transform: rotate(-3deg);
      }
    }
    .text {
      position: absolute;
      width: 20vw;
      font-size: 1.8vw;
      text-align: center;
    }
  }
}
</style>
