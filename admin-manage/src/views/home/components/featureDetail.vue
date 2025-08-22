<template>
  <div class="featureDetail full-block flex-layout">
    <img
      class="back-button"
      src="@/assets/images/back.png"
      style="width: 40px"
      @click="$router.go(-1)"
    />
    <div class="flex1 flex-layout mb10">
      <div class="flex-none title mb10"><span>特征详情</span></div>
      <div class="flex-auto flex-layout quality">
        <div class="flex-none quality-title"><span>优秀品质</span></div>
        <div class="flex-auto quality-list">
          <div
            v-for="(item, index) in qualityList"
            :key="index"
            class="quality-item box-bg"
          >
            <div class="name">{{ item.name }}</div>
            <div class="content">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex1 flex-layout mt10">
      <div class="flex-none title mb10"><span>学习技能突出人员</span></div>
      <div class="flex-auto">
        <el-table :data="list" height="100%">
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="身份证号" prop="idcard"></el-table-column>
          <el-table-column label="人员类别" prop="type"></el-table-column>
          <el-table-column label="个人画像">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color: #4f9b78"
                @click="toPersonalPortrait"
                >个人画像</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'featureDetail',
  components: {},
  data() {
    return {
      word: '',
      qualityList: [
        {
          name: '专业技能‌',
          content:
            '描述自己掌握的专业技能和知识。例如，熟练使用制图软件和图像处理软件，掌握一般的办公软件，具备自动化设计和设备设置、维护、改良的能力。'
        },
        {
          name: '学习能力‌',
          content:
            '强调自己的学习能力和对新知识的吸收速度。例如，能够通过自学考试获得金融专业专科学历和助师资格，积极参加各种学习活动，不断提升自己的理论素质和业务技能。'
        },
        {
          name: '问题解决能力‌',
          content:
            '展示自己在面对复杂问题时能够迅速找到解决方案的能力。例如，在面对复杂问题时，能够迅速找到解决方案，并勇于尝试新的方法。'
        },
        {
          name: '创新能力‌',
          content:
            '描述自己在工作中勇于尝试新方法和新技术的能力。例如，具备良好的创新能力，能够在工作中不断尝试新的方法和技术，提高工作效率‌。'
        },
        {
          name: '沟通能力‌',
          content:
            '强调自己的沟通能力和团队协作能力。例如，具有良好的沟通和协调能力，能够与其他同事进行良好的沟通和协调。'
        },
        {
          name: '适应能力‌',
          content:
            '展示自己能够快速适应新环境和新任务的能力。例如，具有良好的职业训练和集体荣誉意识，能够快速适应环境，不断总结经验‌。'
        },
        {
          name: '组织能力‌',
          content:
            '描述自己在组织和管理方面的能力。例如，具有强烈的组织能力和责任感，能够高效地完成工作任务‌‌。'
        }
      ],
      list: [
        { name: '张三', idcard: '1984984132187878', type: '普通学员' },
        { name: '李四', idcard: '1984984132187878', type: '干部' },
        { name: '王五', idcard: '1984984132187878', type: '工勤' },
        { name: '赵六', idcard: '1984984132187878', type: '普通学员' },
        { name: '小梅', idcard: '1984984132187878', type: '干部' },
        { name: '李伟', idcard: '1984984132187878', type: '工勤' }
      ]
    };
  },
  mounted() {
    this.word = this.$route.query.word;
  },
  methods: {
    toPersonalPortrait() {
      this.$router.push({
        path: '/personalPortrait',
        query: {}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.featureDetail {
  position: relative;
  padding: 35px 20px 20px;
  box-sizing: border-box;
  .back-button {
    position: absolute;
    display: block;
    object-fit: contain;
    height: 40px !important;
    top: -5px;
    left: 15px;
    cursor: pointer;
  }
  .title {
    width: 370px;
    height: 30px;
    background-image: url('~@/assets/images/title-bg.png');
    background-repeat: no-repeat;
    background-position: left top;
    background-size: cover;
    padding-left: 25px;
    font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
    font-size: 22px;
    span {
      position: relative;
      top: -5px;
    }
  }
  .quality {
    background-color: rgba(41, 130, 103, 0.2);
    padding: 10px 20px;
    box-sizing: border-box;
    .quality-title {
      width: 109px;
      height: 13px;
      font-size: 14px;
      background-image: url('~@/assets/images/title-bg.png');
      background-repeat: no-repeat;
      background-position: left top;
      background-size: cover;
      padding-left: 15px;
      margin-bottom: 20px;
      span {
        position: relative;
        top: -4px;
      }
    }
    .quality-list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .quality-item {
        width: calc(33.3% - 20px);
        margin-right: 20px;
        margin-bottom: 20px;
        padding-left: 10px;
        padding-bottom: 10px;
        .name {
          position: relative;
          top: -7px;
          font-family: SourceHanSansSC-Medium;
          font-size: 18px;
          font-weight: normal;
          font-style: italic;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #d1d6df;
        }
        .content {
          font-size: 14px;
        }
      }
    }
    .box-bg {
      position: relative;
      border-left: 2px solid #13b9bb;
      &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
          90deg,
          #01ecca 0%,
          rgba(19, 192, 207, 0.69) 22%,
          rgba(35, 149, 211, 0.4) 44%,
          rgba(36, 147, 211, 0.4) 45%,
          rgba(57, 183, 170, 0) 100%
        );
        opacity: 0.22;
      }
    }
  }
}
</style>
