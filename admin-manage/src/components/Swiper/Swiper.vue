<template>
  <div class="component-swiper">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="(item, index) in mdv" :key="index">
        <img class="picture" :src="item.photo" alt="" />
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: "ComponentSwiper",
  props: {
    // // 样式
    // styleObj: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    // },
    // // 类名
    // className: {
    //   type: String,
    //   default: () => {
    //     return "";
    //   },
    // },
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
        slidesPerView: "auto",
        pagination: {
          el: ".swiper-pagination",
          clickable: true, //允许分页点击跳转
        },
        // 设置点击箭头
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      mdv: [
        {
          photo:
            "http://192.168.1.181/svn/kfzl/%E5%AE%A2%E6%9C%8D%E9%83%A8/%E9%95%BF%E6%B2%99%E5%8A%A0%E5%AF%86%E7%B3%BB%E7%BB%9F/images/用户工作台/u1437.png",
        },
        {
          photo:
            "http://192.168.1.181/svn/kfzl/%E5%AE%A2%E6%9C%8D%E9%83%A8/%E9%95%BF%E6%B2%99%E5%8A%A0%E5%AF%86%E7%B3%BB%E7%BB%9F/images/用户工作台/u1437.png",
        },
        {
          photo:
            "http://192.168.1.181/svn/kfzl/%E5%AE%A2%E6%9C%8D%E9%83%A8/%E9%95%BF%E6%B2%99%E5%8A%A0%E5%AF%86%E7%B3%BB%E7%BB%9F/images/用户工作台/u1437.png",
        },
        {
          photo:
            "http://192.168.1.181/svn/kfzl/%E5%AE%A2%E6%9C%8D%E9%83%A8/%E9%95%BF%E6%B2%99%E5%8A%A0%E5%AF%86%E7%B3%BB%E7%BB%9F/images/用户工作台/u1437.png",
        },
        {
          photo:
            "http://192.168.1.181/svn/kfzl/%E5%AE%A2%E6%9C%8D%E9%83%A8/%E9%95%BF%E6%B2%99%E5%8A%A0%E5%AF%86%E7%B3%BB%E7%BB%9F/images/用户工作台/u1437.png",
        },
        {
          photo:
            "http://192.168.1.181/svn/kfzl/%E5%AE%A2%E6%9C%8D%E9%83%A8/%E9%95%BF%E6%B2%99%E5%8A%A0%E5%AF%86%E7%B3%BB%E7%BB%9F/images/用户工作台/u1437.png",
        },
      ], // 存放图片数据的数组
    };
  },
};
</script>

<style lang="scss" scoped>
.component-swiper {
  width: 100%;
  overflow: hidden;
  .picture {
    width: 100%;
  }
}
</style>
