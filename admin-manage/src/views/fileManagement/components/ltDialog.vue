<template>
  <div>
    <BaseDialog
      class="full-block component-table-dialog full-dialog"
      title="对话详情"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      :width="width"
      top="5vh"
    >
      <div class="full-block" style="height: 82vh">
        <!-- <div class="flex-center">
          <div class="chat-box flex1">
            <div class="chat-list" ref="chatList">
              <div class="chat-item flex-center justify-start align-start">
                <img v-if="defaultIcon" :src="defaultIcon" />
                <div class="ml10 mr10 flex-column flex-start">
                  <div class="time">{{ curruntDate }}</div>
                  <div class="content bg1">
                    {{ startMessage }}
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in responseHistory" :key="index">
                <div class="chat-item flex-center align-start" v-if="item[0]">
                  <div
                    class="ml10 mr10 flex1 flex-column flex-center align-end"
                  >
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
                  <img :src="userIcon" />
                </div>
                <div
                  class="chat-item flex-center justify-start align-start"
                  v-if="item[1]"
                >
                  <img v-if="defaultIcon" :src="defaultIcon" />
                  <div class="ml10 mr10 flex-column flex-start">
                    <div
                      class="time"
                      v-if="historyDatetime[index] && historyDatetime[index][1]"
                    >
                      {{ historyDatetime[index] && historyDatetime[index][1] }}
                    </div>
                    <div class="content bg1" v-html="item[1]"></div>
                    <div
                      class="source-container"
                      v-if="
                        sourcePushList[index] &&
                        sourcePushList[index].length > 0
                      "
                    >
                      <template
                        v-for="(sitem, sIndex) in sourcePushList[index]"
                      >
                        <div
                          :key="sIndex"
                          class="source-push-list"
                          v-if="
                            ['psymusics', 'psycomics', 'psynews'].includes(
                              sitem['type']
                            )
                          "
                        >
                          <div
                            class="psymusics"
                            v-if="sitem.type == 'psymusics'"
                          >
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
            </div>
          </div>
        </div> -->
        <ChatList
          ref="chatList"
          :userInfo="userInfo"
          :aiHelp="aiHelp"
          :currentIndex="currentIndex"
          :curruntDate="curruntDate"
          :startMessage="startMessage"
          :dynamicImage="dynamicImage"
          :history="history"
          :historyDatetime="historyDatetime"
          :sourcePushList="sourcePushList"
          :sourcePushTextList="sourcePushTextList"
          :historyTypes="historyTypes"
          :hideHelp="hideHelp"
          :historyBufferConst="historyBufferConst"
          :partialResponse="partialResponse"
          @aiHelpchange="aiHelpchange"
        ></ChatList>
      </div>
    </BaseDialog>
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
import FormItem from '@/components/Form/Item';
import ComicDetail from '@/views/collect/components/comicDetail';
import NewsDetail from '@/views/collect/components/newsDetail';
import { mapGetters } from 'vuex';
import ChatList from '@/views/components/chartList';
import chatMix from '@/utils/jyChatMixSource';
import moment from 'moment';
export default {
  name: 'ltDialog',
  mixins: [chatMix],
  components: { BaseDialog, FormItem, ChatList, NewsDetail, ComicDetail },
  props: {
    width: {
      type: String,
      default: () => {
        return '1200px';
      }
    }
  },
  data() {
    return {
      userInfo: {
        avatar: ''
      },
      partialResponse: '',
      iconIndex: 1,
      // 资源推荐列表
      sourcePushList: [],
      sourcePushTextList: [],
      musicUrl: '',
      defaultIcon: require('@/assets/images/jr-icon.png'),

      userIcon: '',
      visibleDialog: false,
      responseHistory: [],
      curruntDate: '',
      historyDatetime: [],
      messageList: [],
      startMessage: '',
      sourcePushList: []
    };
  },
  computed: {},
  mounted() {
    this.curruntDate = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    getInfo(id, content) {
      this.$api.System.userQueryById({
        id: id
      }).then((res) => {
        this.userInfo = res.result;
        if (content.zjId) {
          this.getZjInfo(content.zjId);
        } else {
          this.getZjInfo();
        }
      });
      //
    },
    show(record) {
      const content = JSON.parse(record.content);
      if (content.responseHistory) {
        this.responseHistory = content.responseHistory;
        this.history = content.responseHistory;
      } else {
        this.history = [];
      }
      if (content.historyDatetime) {
        this.historyDatetime = content.historyDatetime;
      }
      if (content.sourcePushList) {
        this.sourcePushList = content.sourcePushList;
      }
      if (content.sourcePushTextList) {
        this.sourcePushTextList = content.sourcePushTextList;
      }
      if (content.curruntDate) {
        this.curruntDate = content.curruntDate;
      }
      if (content.startMessage) {
        this.startMessage = content.startMessage;
      }
      if (content.messageList) {
        this.messageList = content.messageList;
      }
      if (content.historyBufferConst) {
        this.historyBufferConst = content.historyBufferConst;
      }

      this.getInfo(record.userId, content);
      this.visibleDialog = true;
      this.$nextTick(() => {
        this.$refs.chatList.scrollTop();
      });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-bottom: 10px;
}
/deep/.table-dialog-list {
  height: 363px;
}
/deep/.el-table__body-wrapper,
/deep/.el-table__header-wrapper {
  width: 100% !important;
}
.base-table-wrap {
  overflow-x: auto;
}
.chat-box {
  padding: 20px;
  //   height: calc(100vh - 240px);
  // background-color: #102e36;
  position: relative;
  .chat-item {
    margin-top: 10px;
    img {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      object-fit: cover;
    }
    .time {
      letter-spacing: 1px;
      color: #fff;
    }
    .content {
      margin-top: 10px;
      padding: 10px 20px;
      line-height: 26px;
      border-radius: 0px 12px 12px 12px;
      max-width: 1200px;
      &.pd0 {
        padding: 0;
      }
      &.bg1 {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  .chat-list {
    height: 100%;
    overflow-y: auto;
  }
  .scene-list {
    padding: 10px 20px;
    border-bottom: 1px solid #3ea797;
  }
  .scene-item {
    height: 30px;
    border-radius: 15px;
    line-height: 30px;
    padding: 0 20px;
    &.active {
      background-color: #1aa45f;
    }
  }
  .input-contianer {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    height: 160px;
    background-color: rgba(124, 242, 205, 0.2);
    border-radius: 12px;
    /deep/ .el-input__inner,
    /deep/.el-textarea__inner {
      flex: 1;
      border-width: 0;
      background-color: transparent;
      resize: none;
    }
    .btn {
      width: 140px;
      height: 40px;
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
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
</style>
