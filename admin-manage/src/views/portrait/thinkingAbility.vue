<template>
  <div class="component-thinkingAbility full-block">
    <div class="top mb20">
      <div class="mb20">张明坤</div>
      <div class="flex-row">
        <span>判断与决策思维：</span>
        <el-progress :text-inside="true" :stroke-width="20" :percentage="70" style="width: 300px;"></el-progress>
      </div>
    </div>
    <div class="mb20">
      <div class="box-title title"><span>认知训练</span></div>
      <div class="item">
        <span>2024-12-20 14:02</span>
        <span>训练36分钟</span>
        <span>得分86分</span>
      </div>
      <div class="item">
        <span>2024-12-18 10:25</span>
        <span>训练20分钟</span>
        <span>得分75分</span>
      </div>
      <div class="item">
        <span>2024-12-15 08:39</span>
        <span>训练12分钟</span>
        <span>得分81分</span>
      </div>
    </div>
    <div>
      <div class="box-title title"><span>智能咨询</span></div>
      <div class="item">
        <span>2024-12-16 12:06</span>
        <span>咨询15分钟</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "thinkingAbility",
  components: {
  },
  data () {
    return {
    };
  },
  methods:{},
}
</script>

<style lang="scss" scoped>
.component-thinkingAbility{
  padding: 20px;
  .top{
    padding: 30px 50px;
    background: rgba(33, 149, 101, 0.2);
  }
  .title{
    width: 200px;
    margin-bottom: 20px;
  }
  .item{
    height: 50px;
    line-height: 50px;
    padding: 0 100px 0 50px;
    box-sizing: border-box;
    span:nth-child(2){
      margin-left: 200px;
      color: #b4b4b4;
    }
    span:nth-child(3){
      margin-left: 200px;
      color: #b4b4b4;
    }
  }
  .item:nth-child(odd){
    background: rgba(33, 149, 101, 0.1);
  }
  .item:nth-child(even){
    background: rgba(33, 149, 101, 0.2);
  }
}
</style>