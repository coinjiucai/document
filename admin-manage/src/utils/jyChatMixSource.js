import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      type: 1,
      startMessage: '你好，我是你的心灵陪伴小伙，请问有什么可以帮你的吗？',
      curruntDate: '',
      zxId: '',
      zjInfo: null,
      message: '', // 输入框内容
      messageList: [], // 聊天记录列表
      currentIndex: 0, // 当前聊天记录索引
      historyDatetime: [], // 历史记录时间
      historyBufferConst: [], // 深度思考对象
      history: [], // 历史记录
      responseHistory: [], // 响应历史记录
      modeType: '1', // 聊天模式类型，1：心理教育模式，2：心理咨询模式
      historyTypes: [], // 1.用户正常提问聊天 2.ai提问聊天
      timer: null,
      lastInputTime: null,
      timeout: 30000,
      userAskFirst: false, // 用户第一次反问
      userAskSecond: false, // ai第二次反问
      aiHelp: 0,
      hideHelp: false, // 隐藏帮助按钮
      courseLevel: '非进阶',
      yyList: [],
      filterHistory: [],
      scorllLength: 0,
      // 二维码
      qrCodeShow: false
    };
  },
  computed: {
    ...mapGetters(['theme']),
    dynamicImage() {
      if (this.zjInfo) {
        const imageUrl = this.zjInfo.imageUrl;
        if (imageUrl) {
          const getImageUrl = this.getImageUrl(imageUrl);
          return getImageUrl;
        } else {
          return require(`@/assets/images/ai-logo/${this.iconIndex}.png`); // 动态加载图片
        }
      } else {
        return require(`@/assets/images/ai-logo/${this.iconIndex}.png`); // 动态加载图片
      }
    }
  },
  mounted() {
    // 也可以在组件销毁时清除定时器
    window.addEventListener('beforeunload', () => {
      if (this.timer) clearTimeout(this.timer);
    });
  },
  methods: {
    foucusInput() {
      console.log('foucus');
      clearTimeout(this.timer);
    },
    blurInput() {
      console.log('blur');
      if (!this.loading && this.timer) {
        this.resetTimer();
      }
    },
    handleInput(val) {
      clearTimeout(this.timer);
    },
    // 用户输入以后，重置定时器
    resetTimer() {
      // 清除之前的定时器
      clearTimeout(this.timer);

      // 更新最后输入时间
      this.lastInputTime = new Date();

      // 设置新的定时器
      this.timer = setTimeout(() => {
        this.handleInactivity();
      }, this.timeout);
    },
    clickSave() {
      this.$api.user.clickeventsSave({
        parentModelName: '心理咨询',
        userId: this.userInfo.id,
        childrenModelName: ''
      });
    },
    // 提取公共的消息处理逻辑为单独函数
    handleMessageResponse(res) {
      const data = res.data;
      const text = data.text;
      if (!text) return;

      this.message = '';
      this.messageList.push(this.message);
      this.currentIndex = this.historyDatetime.length;
      this.historyDatetime.push([moment().format('YYYY-MM-DD HH:mm:ss')]);
      // 思考过程对象
      this.historyBufferConst.push(0);
      this.historyTypes.push(2);
      this.history.push([this.message, text]);
      // 没有资源推送
      this.sourcePushList.push([]);
      this.sourcePushTextList.push({
        text: '',
        push: 1
      });
      this.srollBottom();
      return true;
    },
    handleInactivity() {
      clearTimeout(this.timer);
      var type = 2;

      if (this.userAskFirst && !this.userAskSecond) {
        // 不是第一次
        type = 3;
        this.userAskSecond = true;
      } else {
        this.userAskFirst = true;
        const sourcePushTextList = this.sourcePushTextList.filter(
          (v) => v.text
        );
        if (sourcePushTextList && sourcePushTextList.length > 0) {
          type = this.sourcePushTextList[this.currentIndex] ? 1 : 2;
        }
      }
      if (!this.message.trim()) {
        this.replyAsk(type).then((res) => {
          this.handleMessageResponse(res);
        });
      } else {
        clearTimeout(this.timer);
      }
    },
    // 处理帮助选项变化的逻辑
    aiHelpchange(val, text) {
      this.hideHelp = true;
      this.aiHelp = 0;
      const sendResponse = () => {
        clearTimeout(this.timer);
        this.appMessage(val == 1 ? '是' : '否');
      };

      const showContinueDialog = () => {
        this.$dialog
          .confirm({
            message: '是否继续聊天？'
          })
          .then(() => {})
          .catch(() => {
            this.$router.go(-1);
          });
      };
      console.log(this.userAskFirst, this.userAskSecond, val);
      if (this.userAskSecond) {
        this.userAskFirst = false;
        this.userAskSecond = false;
        if (val == '1') {
          clearTimeout(this.timer);
          if (text == '还有一个进阶课程推荐是否需要?') {
            this.message = '需要';
            this.courseLevel = '进阶';
            this.fetchData();
          } else {
            sendResponse();
            showContinueDialog();
          }
        } else {
          sendResponse();
          clearTimeout(this.timer);
          if (text == '还有一个进阶课程推荐是否需要?') {
            showContinueDialog();
          } else {
            // 没有解决问题的情况
            const sourcePushTextList = this.sourcePushTextList.filter(
              (v) => v.text
            );
            if (sourcePushTextList?.length > 0) {
              const item = sourcePushTextList[sourcePushTextList.length - 1];
              item.push = 2;

              this.handleMessageResponse({
                data: { text: '还有一个进阶课程推荐是否需要?' }
              });
              this.hideHelp = false;
            } else {
              this.$refs.qrcode.show();
              // this.qrCodeShow = true;
            }
          }
        }
      } else if (this.userAskFirst) {
        sendResponse();
        if (val == '2') {
          this.replyAsk(3).then((res) => {
            this.userAskSecond = true;
            this.handleMessageResponse(res);
          });
        }
      }
    },
    appMessage(text) {
      this.messageList.push(text);
      this.currentIndex = this.historyDatetime.length;
      this.historyDatetime.push([moment().format('YYYY-MM-DD HH:mm:ss')]);
      this.historyBufferConst.push(0);
      this.historyTypes.push(1);
      this.history.push([text, '']);
      this.sourcePushList.push([]);
      this.sourcePushTextList.push({
        text: '',
        push: 1
      });
      this.srollBottom();
    },
    generateId() {
      return (
        'unid_' +
        Math.floor(
          Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000
        )
      );
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
    getImageUrl(val) {
      var url = '';
      if (val) {
        var imageArray = JSON.parse(val);
        url = imageArray.length > 0 ? imageArray[0].fileUrl : '';
      }
      return `${window.VUE_APP_IMAGE_URL}${url}`;
    },
    getStr(item) {
      // 将段落按句号分割成句子数组
      const sentences = item.say
        .split('。')
        .filter((sentence) => sentence.trim() !== '');
      // 生成一个随机索引
      const randomIndex = Math.floor(Math.random() * sentences.length);
      // 随机选取一个句子
      const randomSentence = sentences[randomIndex];
      return randomSentence;
    },
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
        return this.dynamicImage;
      }
    },

    getZjInfo(id = '') {
      if (id) {
        this.modeType = '2';
        // 指定某个咨询师咨询 其他情况，没有指定咨询师咨询。
        this.$api.education
          .getPsyexpertById({
            id: id
          })
          .then((res) => {
            this.zjInfo = res.result;

            const str = this.getStr(this.zjInfo);
            this.startMessage = `你好呀，我是${
              this.zjInfo.school ? this.zjInfo.school : ''
            }${this.zjInfo.name}。${str}。有关心理学的问题你都可以跟我探讨。`;
          });
      } else {
        this.zjInfo = null;
        this.modeType = '1';
        const userId = this.userInfo.id;
        const iconIndex = localStorage.getItem(`${userId}_iconIndex`);
        if (iconIndex) {
          this.iconIndex = iconIndex;
        }
        this.startMessage =
          '你好，我是你的心灵陪伴小伙，请问有什么可以帮你的吗？';
      }
    },
    /**
     * 构建基础请求参数
     */
    buildBaseParams() {
      return {
        id: this.zxId,
        userid: this.userInfo.id,
        role: this.zjInfo?.secondPerson || '',
        school: this.zjInfo?.school || ''
      };
    },
    /**
     * 更新聊天状态（消息列表、历史记录等）
     */
    updateChatState() {
      this.message = this.message.replace(/\n$/, '');
      this.messageList.push(this.message);
      this.currentIndex = this.historyDatetime.length;
      this.historyDatetime.push([moment().format('YYYY-MM-DD HH:mm:ss')]);
      this.historyBufferConst.push(0);
      this.historyTypes.push(1);
      this.history.push([this.message, '']);
      this.srollBottom();
    },
    /**
     * 构建聊天请求参数
     */
    buildChatParams() {
      const baseParams = {
        query: this.message,
        history: this.history.slice(0, this.history.length - 1),
        ...this.buildBaseParams()
      };

      // 心理教育模式添加额外参数
      if (this.modeType === '2') {
        return {
          ...baseParams,
          think: false
        };
      }

      return baseParams;
    },
    /**
     * 中断聊天
     */
    async stopChat() {
      try {
        const baseUrl = window.VUE_APP_CHART;
        const requestUrl = `${baseUrl}/v1/sensitive/intent`;
        const lastMessage = this.messageList[this.messageList.length - 1];
        const messageList = [lastMessage];
        const params = {
          msg: messageList,
          ...this.buildBaseParams()
        };
        const response = await axios.post(requestUrl, params);
        return response.data;
      } catch (error) {
        console.error('中断接口请求失败:', error);
        throw error;
      }
    },
    /**
     * 获取聊天API的URL
     */
    getChatApiUrl() {
      const baseUrl = window.VUE_APP_CHART;
      return this.modeType === '1'
        ? `${baseUrl}/v1/chat/heart`
        : `${baseUrl}/v1/chat/edu`;
    },
    /**
     * 获取预警API
     */
    async getWarningApi() {
      try {
        const baseUrl = window.VUE_APP_CHART;
        var requestUrl = `${baseUrl}/v1/chat/warnpush`;
        if (this.aiType && this.aiType == 1) {
          // 心理咨询
          requestUrl = `${baseUrl}/v1/chat/warnrisk`;
        }
        const lastMessage = this.messageList[this.messageList.length - 1];
        const messageList = [lastMessage];
        const params = {
          ...this.buildBaseParams(),
          msg: messageList
        };

        const response = await axios.post(requestUrl, params);
        return response.data;
      } catch (error) {
        console.error('预警请求失败:', error);
        throw error;
      }
    },
    /**
     * 获取聊天API
     */
    async getChatApi() {
      try {
        // 构建请求参数
        var params = this.buildChatParams();

        // 获取请求URL
        const requestUrl = this.getChatApiUrl();
        this.message = ''; // 清空输入框
        const response = await axios.post(requestUrl, params);
        return response.data;
      } catch (error) {
        console.error('聊天请求失败:', error);
        throw error;
      }
    },
    /**
     * 咨询反问
     */
    async replyAsk(type) {
      try {
        const baseUrl = window.VUE_APP_CHART;
        const params = {
          ...this.buildBaseParams(),
          type: type
        };
        this.hideHelp = false;
        var requestUrl = `${baseUrl}/v1/reply/ask`;
        const response = await axios.post(requestUrl, params);
        return response.data;
      } catch (error) {
        console.error('咨询反问失败', error);
        throw error;
      }
    },
    getYyList() {
      this.$api.consulting
        .psycounselorPage({
          pageNo: 1,
          pageSize: 20
        })
        .then((res) => {
          this.yyList =
            res.result.records.map((v) => {
              return {
                ...v,
                imageUrl: v.webchatImg
              };
            }) || [];
        });
    }
  },
  beforeDestroy() {
    // 清除定时器防止内存泄漏
    clearTimeout(this.timer);
  }
};
