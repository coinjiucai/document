<template>
  <div>
    <BaseDialog
      class="component-courseDetail"
      title="课程详情"
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="1000px"
    >
      <div class="full-block flex-row">
        <div class="left">
          <img src="@/assets/images/personalCenter/information2.png" class="img mb10">
          <div class="flex-row justify-between mb20">
            <span class="flex-row align-center">
              <span>难度：</span>
              <el-rate :value="1" :max="3" disabled></el-rate>
            </span>
            <img 
              v-if="isCollect"
              src="@/assets/images/personalCenter/collect.png" 
              class="collect-img pointer" 
              @click="isCollect = false">
            <img
              v-else
              src="@/assets/images/personalCenter/nocollect.png" 
              class="collect-img pointer" 
              @click="isCollect = true"
            >
          </div>
          <div class="flex-row justify-between time mb10">
            <span>2020-12-02 15:00 至 2020-12-12 12:00</span>
            <span>学习进度：85%</span>
          </div>
          <div>
            积极心理学以研究个人积极的正向体验、正向特质为主要特色，力求幸福快乐的人生。这门课最大的特点不只在于介绍积极心理学的理论、研究取向，同时将生活中的实践结合起来，在课程中教导人们如何在学习生活中善用自己的优势，从“爱人、感恩、人际互动”中建构一个幸福快乐的生活。
          </div>
        </div>
        <div class="right flex-layout">
          <div class="flex-none title"><span>专题导航</span></div>
          <div class="flex-auto scroll-y">
            <div class="chapter-item">
              <div class="chapter-title">第一章：沟通的艺术概述</div>
              <div class="little-chapter-title">1.1 无处不在的“辩论”</div>
              <div class="introduction">章节简介：该章节介绍沟通的概念辩论的技巧</div>
              <div class="chapter-content flex-layout">
                <span>沟通的技巧.pdf</span>
                <span>沟通的技巧.mp4</span>
              </div>
            </div>
            <div class="chapter-item">
              <div class="chapter-title">第二章：自我认识</div>
            </div>
            <div class="chapter-item">
              <div class="chapter-title">第三章：沟通实战</div>
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";

export default {
  name: "courseDetail",
  components: {
    BaseDialog,
  },
  data() {
    return {
      visibleDialog: false,
      isCollect: true
    }
  },
  methods: {
    show() {
      this.visibleDialog = true
    },
    handleCloseDialog() {
      this.visibleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.component-courseDetail{
  /deep/ .el-dialog .el-dialog__body {
    height: 550px;
    overflow-y: hidden;
  }
  
  /deep/ .mp-dialog_body {
    height: 100%;
  }
  .left{
    width: calc(60% - 20px);
    margin-right: 30px;
    font-size: 16px;
    .img{
      width: 100%;
      height: 300px;
    }
    .time{
      color: #6a8782;
    }
    /deep/.el-rate{
      height: 24px;
    }
    /deep/.el-rate__icon{
      font-size: 24px;
    }
    .collect-img{
      width: 26px;
      height: 24px;
    }
  }
  .right{
    width: 40%;
    .title{
      width: 370px;
      height: 30px;
      background-image: url("~@/assets/images/title-bg.png");
      background-repeat: no-repeat;
      background-position: left top;
      background-size: cover;
      padding-left: 25px;
      font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
      font-size: 22px;
      margin-bottom: 20px;
      span{
        position: relative;
        top: -5px;
      }
    }
    .chapter-item{
      margin-bottom: 10px;
      font-size: 16px;
      .chapter-title{
        height: 33px;
        line-height: 33px;
        padding-left: 10px;
	      background: rgba(33, 149, 101, 0.2);
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .little-chapter-title{
        margin-bottom: 10px;
      }
      .introduction{
        color: #6a8782;
        margin-bottom: 10px;
      }
      .chapter-content{
        padding-left: 50px;
        span{
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
