<template>
  <div class="chat-list" ref="zxContainer" :style="{ height: height }">
    <div class="chat-item flex-center justify-start align-start">
      <img v-if="dynamicImage" :src="dynamicImage" />
      <div class="ml10 mr10 flex-column flex-start">
        <div class="time">{{ curruntDate }}</div>
        <div class="content bg1">
          {{ startMessage }}
        </div>
      </div>
    </div>
    <div v-for="(item, index) in history" :key="index">
      <!-- 右边：用户提问 -->
      <template v-if="item[0]">
        <div class="chat-item flex-center align-start">
          <div class="ml10 mr10 flex1 flex-column flex-center align-end">
            <div
              class="time text-right"
              v-if="historyDatetime[index] && historyDatetime[index][0]"
            >
              {{ historyDatetime[index][0] }}
            </div>
            <div class="content pd0">
              {{ item[0] }}
            </div>
          </div>
          <img :src="getUserImage()" />
        </div>
      </template>

      <!-- 左边：Ai回答 -->
      <template v-if="loading && index == currentIndex">
        <div class="chat-item flex-center justify-start align-start">
          <img v-if="dynamicImage" :src="dynamicImage" />
          <div class="ml10 mr10 flex-column flex-start">
            <div
              class="time"
              v-if="historyDatetime[index] && historyDatetime[index][1]"
            >
              {{ historyDatetime[index] && historyDatetime[index][1] }}
            </div>

            <div
              class="content bg1"
              v-else
              v-loading="true"
              style="
                display: flex;
                align-items: center;
                width: 50px;
                height: 50px;
              "
            ></div>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 中断的情况下，不显示这个内容 -->
        <template v-if="item[1]">
          <template
            v-if="sourcePushList[index] && sourcePushList[index].length > 0"
          >
            <!-- 有资源的情况 -->
            <div
              class="chat-item flex-center justify-start align-start"
              v-if="sourcePushTextList[index] && sourcePushTextList[index].text"
            >
              <img v-if="dynamicImage" :src="dynamicImage" />
              <div class="ml10 mr10 flex-column flex-start">
                <div
                  class="time"
                  v-if="historyDatetime[index] && historyDatetime[index][1]"
                >
                  {{ historyDatetime[index] && historyDatetime[index][1] }}
                </div>
                <div class="content bg1">
                  {{ sourcePushTextList[index].text }}
                </div>
              </div>
            </div>
            <div class="chat-item flex-center justify-start align-start">
              <img v-if="dynamicImage" :src="dynamicImage" />
              <div class="ml10 mr10 flex-column flex-start">
                <div class="content bg1">
                  <div class="source-container">
                    <template v-for="(sitem, sIndex) in sourcePushList[index]">
                      <div
                        :key="sIndex"
                        class="source-push-list"
                        v-if="
                          ['psymusics', 'psycomics', 'psynews'].includes(
                            sitem['type']
                          )
                        "
                      >
                        <div class="psymusics" v-if="sitem.type == 'psymusics'">
                          <div class="name">{{ sitem.name }}</div>
                          <div class="author" v-if="sitem.singer">
                            {{ sitem.singer }}
                          </div>
                          <div class="play-c">
                            <img
                              v-if="!sitem['play']"
                              @click="play(sitem)"
                              src="@/assets/images/play.png"
                            />
                            <img
                              v-else
                              @click="pause(sitem)"
                              src="@/assets/images/pause.png"
                            />
                          </div>
                        </div>
                        <div
                          class="psycomics"
                          v-else-if="sitem['type'] == 'psycomics'"
                          style="cursor: pointer"
                          @click="psycomicsDetail(sitem)"
                        >
                          <div
                            class="icon"
                            :style="{
                              width: '50px',
                              height: '50px',
                              'background-image': `url(${getImageUrl(
                                sitem.logo
                              )})`,
                              'background-size': 'cover',
                              'background-position': 'center'
                            }"
                          ></div>

                          <div class="name">{{ sitem.name }}</div>
                        </div>
                        <div
                          class="psynews"
                          v-else-if="sitem['type'] == 'psynews'"
                          style="cursor: pointer"
                          @click="psynewsDetail(sitem)"
                        >
                          <div class="name">{{ sitem.name }}</div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="chat-item flex-center justify-start align-start">
              <img v-if="dynamicImage" :src="dynamicImage" />
              <div class="ml10 mr10 flex-column flex-start">
                <div
                  class="time"
                  v-if="historyDatetime[index] && historyDatetime[index][1]"
                >
                  {{ historyDatetime[index] && historyDatetime[index][1] }}
                </div>
                <div class="content bg1" attr-open="1">
                  <div class="text-box" v-html="formaterStr(item[1])"></div>
                  <div
                    style="margin-top: 0.5rem"
                    v-if="
                      index == history.length - 1 &&
                      historyTypes &&
                      historyTypes[index] &&
                      historyTypes[index] == 2 &&
                      !hideHelp
                    "
                  >
                    <el-radio-group
                      v-model="aiHelpDa"
                      @input="aiHelpchange($event, item[1])"
                    >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </div>
                  <div
                    class="think-title"
                    @click="changeOpenThink($event)"
                    v-if="hasThink(item[1])"
                  >
                    <template
                      v-if="
                        historyBufferConst[index] &&
                        historyBufferConst[index] > 0
                      "
                      >已深度思考(用时{{ historyBufferConst[index] }}秒)
                      <i class="el-icon-arrow-up"> </i>
                      <i class="el-icon-arrow-down"> </i>
                    </template>
                    <template v-else>
                      思考中...
                      <i class="el-icon-arrow-up"> </i>
                      <i class="el-icon-arrow-down"> </i>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </template>
    </div>
    <ComicDetail ref="comicDetailDialog" />
    <NewsDetail ref="newsDetail"></NewsDetail>
    <audio
      class="my-audio"
      id="myAudio"
      :src="musicUrl"
      preload="auto"
      style="pointer-events: none; opacity: 0"
    ></audio>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import ComicDetail from '@/views/collect/components/comicDetail';
import NewsDetail from '@/views/collect/components/newsDetail';
export default {
  name: 'chartList',
  components: { BaseDialog, ComicDetail, NewsDetail },
  props: {
    height: {
      type: String,
      default: () => {
        return 'calc(100% - 180px)';
      }
    },
    userInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    currentIndex: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    curruntDate: {
      type: String,
      default: () => {
        return '';
      }
    },
    startMessage: {
      type: String,
      default: () => {
        return '';
      }
    },
    // 头像
    dynamicImage: {
      type: String,
      required: true,
      default: () => {
        return '';
      }
    },
    // 历史记录
    history: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    },
    // 历史记录时间
    historyDatetime: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 思考过程的时间
    historyBufferConst: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 资源推荐列表
    sourcePushList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 资源推荐文字
    sourcePushTextList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 1.用户正常提问聊天 2.ai提问聊天
    historyTypes: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 隐藏帮助选择按钮
    hideHelp: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      musicUrl: '',
      zxShow: false,
      zxContent: '',
      mhShow: false,
      mhImageList: [],
      aiHelpDa: 0
    };
  },
  watch: {},

  mounted() {},
  methods: {
    hasThink(content) {
      return content.indexOf('<think>') >= 0;
    },
    formaterStr(content) {
      //   替换换行符;
      let unescapedText = content.replace(/\\n/g, '\n');
      const formattedText = unescapedText.replace(/\n/g, '<br>');
      let escaped = formattedText.replace(/---/g, '<hr/>');
      // 处理换行和Markdown格式
      return (
        escaped
          // 处理Markdown标题 (###)
          .replace(/### (.+?)[:：？]/g, '<strong>$1:</strong>')
          // 处理加粗 (**text**)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // 处理无序列表项 (-)
          .replace(/^\s*-\s*(.*?)\s*<br\/>/gm, '<li>$1</li>')
          // 将连续列表项包裹在ul中
          .replace(/(<li>.*<\/li>)+/g, function (match) {
            return '<ul>' + match + '</ul>';
          })
      );
    },
    iconSelect() {},
    scrollBottom() {
      const container = this.$refs.zxContainer;
      container.scrollTop = container.scrollHeight;
    },
    scrollTop() {
      const container = this.$refs.zxContainer;
      container.scrollTop = 0;
    },
    // 用户头像
    getUserImage() {
      const avatar = this.userInfo.avatar;
      if (avatar) {
        if (
          (avatar && avatar.indexOf('http') >= 0) ||
          avatar.indexOf('https') >= 0
        ) {
          return avatar;
        } else if (avatar) {
          return `${window.VUE_APP_IMAGE_URL}${avatar}`;
        }
      } else {
        return require('@/assets/images/icon-default.png');
      }
    },
    getImageUrl(val) {
      var url = '';
      if (val) {
        var imageArray = JSON.parse(val);
        url = imageArray.length > 0 ? imageArray[0].fileUrl : '';
      }
      return `${window.VUE_APP_IMAGE_URL}${url}`;
    },
    aiHelpchange(val, text) {
      this.aiHelpDa = 0;
      this.$emit('aiHelpchange', val, text);
    },
    getValue(value) {
      if (!value) {
        return '';
      }
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    // 播放音乐
    play(item) {
      this.musicUrl = this.getValue(item.fileUrl);
      for (let i = 0; i < this.sourcePushList.length; i++) {
        const source = this.sourcePushList[i];
        source.forEach((v) => {
          v['play'] = false;
        });
      }
      item.play = true;

      this.$nextTick(() => {
        var audio = document.getElementById('myAudio');
        audio.play();
      });
      this.readStatus(item);
    },
    // 暂停播放
    pause(item) {
      item.play = false;
      var audio = document.getElementById('myAudio');
      if (audio) {
        audio.pause();
      }
    },
    psynewsDetail(item) {
      if (item.content) {
        this.$refs.newsDetail.show({
          introduction: item.content
        });
        this.readStatus(item);
      } else {
        this.$message('没有详情内容');
      }
    },
    psycomicsDetail(item) {
      this.$refs.comicDetailDialog.show(item);
      this.readStatus(item);
    },
    readStatus(item) {
      this.$api.user
        .psyearlywarnmanagementinterveneStatus({
          id: item.id
        })
        .then((res) => {
          console.log('已读');
        });
    },
    changeOpenThink(event) {
      const parentElement = event.currentTarget.parentNode;
      const attrOpenValue = parentElement.getAttribute('attr-open');
      if (attrOpenValue == '1') {
        parentElement.setAttribute('attr-open', '0');
      } else {
        parentElement.setAttribute('attr-open', '1');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.chat-item {
  margin-top: 10px;
  > div:nth-child(2) {
    width: calc(100% - 62px);
  }
  img {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    object-fit: cover;
  }
  .time {
    letter-spacing: 1px;
    color: #69908a;
  }
  .content {
    position: relative;
    margin-top: 10px;
    padding: 10px 20px;
    line-height: 26px;
    border-radius: 0px 12px 12px 12px;
    max-width: 1200px;
    .text-box {
      min-height: 30px;
    }
    &.pd0 {
      padding: 0;
    }
    &.bg1 {
      background-color: #0b1e1b;
    }
    .el-icon-arrow-up {
      display: none;
    }
    .el-icon-arrow-down {
      display: inline-block;
    }
  }
}
.chat-list {
  overflow-y: auto;
}

.icon-item {
  width: 33.33%;
  display: inline-block;
  text-align: center;
  font-size: 14px;
  margin-top: 16px;
  > div:nth-child(2) {
    margin-top: 6px;
    color: #fff;
  }
  > div:nth-child(3) {
    background: #375fe9;
    display: inline-block;
    color: #fff;
    width: 80px;
    padding: 6px 4px;
    border-radius: 4px;
    margin-top: 6px;
  }
}

.current-icon {
  background: #fff !important;
  color: #333 !important;
  border: 0.02rem solid #666 !important;
}
.source-container {
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
}
.source-push-list {
  position: relative;
  padding: 10px 16px;
  background-color: rgba(255, 255, 255, 1);
  &::after {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    content: '';
    bottom: 0;
    left: 0;
  }
  .name {
    font-size: 16px;
    color: #333;
  }
  .author {
    font-size: 14px;
    color: #999;
  }
  .play-c {
    position: absolute;
    right: 16px;
    top: 20px;
    img {
      display: inline-block;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }
  .psycomics {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 10px;
      border-radius: 4px;
      overflow: hidden;
    }
    .name {
      flex: 1;
    }
  }
}
.source-push-list:last-child {
  &::after {
    display: none;
  }
}
.think-title {
  position: absolute;
  padding: 10px 0;
  left: 0px;
  top: 0px;
  left: 20px;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}
</style>
<style lang="scss">
think {
  position: relative;
  padding-left: 10px;
  display: block;
  color: #999;
  font-size: 14px;
  &::before {
    position: absolute;
    left: 1px;
    top: 34px;
    bottom: 5px;
    width: 2px;
    content: '';
    background: #606266;
  }
}
.content[attr-open='0'] {
  think {
    display: block;
    height: 32px;
    overflow: hidden;
    margin-bottom: -50px;
  }
  .el-icon-arrow-up {
    display: inline-block !important;
  }
  .el-icon-arrow-down {
    display: none !important;
  }
}
</style>
