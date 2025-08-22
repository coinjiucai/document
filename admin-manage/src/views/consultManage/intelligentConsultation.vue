<template>
  <div class="intelligent-consultation">
    <div class="zx-container" v-loading="loading">
      <div style="background: rgba(18, 38, 73, 1); padding: 10px">
        <el-page-header @back="goBack" content="咨询服务"> </el-page-header>
      </div>
      <div class="chat-messages" id="chatMessages" ref="scrollContainer">
        <!-- 消息将显示在这里 -->
        <div class="message left">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
          <div class="message-content">你好！</div>
        </div>
        <template>
          <div v-for="(item, index) in history" :key="index">
            <div class="message right">
              <div class="message-content">{{ item[0] }}</div>
              <el-avatar :src="userIcon"></el-avatar>
            </div>
            <div class="message left">
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              ></el-avatar>
              <div class="message-content">{{ item[1] }}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="chat-input">
        <input
          type="text"
          id="messageInput"
          v-model="message"
          placeholder="输入消息..."
          @keyup.enter="send"
        />
        <button id="sendButton" @click="send">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
const userIcon = require("@/assets/images/demo.jpg");
export default {
  data() {
    return {
      loading: false,
      userIcon,
      message: "",
      history: [], // 历史记录
      messageList: [], // 用户提的问题
      responseList: [], // 回答的历史
    };
  },
  methods: {
    goBack() {},
    send() {
      if (this.loading) {
        this.$message.warning("努力回答中!");
      } else {
        this.messageList.push(this.message);

        this.loading = true;
        this.$api.intelligent
          .chat({
            query: this.message,
            history: this.history,
          })
          .then((res) => {
            this.message = "";
            this.loading = false;
            this.history = res.history;
            this.responseList.push(res.response);
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          });
      }
    },
    scrollToBottom() {
      const container = this.$refs.scrollContainer;
      container.scrollTop = container.scrollHeight; // 设置滚动条位置
    },
  },
};
</script>

<style lang="scss" scoped>
.intelligent-consultation {
  width: 100%;
  height: 100%;
  .zx-container {
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    height: 100%;
    background: rgba(18, 38, 73, 0.3);
  }
  .chat-messages {
    overflow-y: auto;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    flex: 1;
  }

  .message {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  .message.left {
    justify-content: flex-start;
  }

  .message.right {
    justify-content: flex-end;
  }

  .user-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 10px;
  }

  .message-content {
    max-width: 70%;
    padding: 10px;
    border-radius: 5px;
  }

  .message.left .message-content {
    // background-color: #e1f5fe;
  }

  .message.right .message-content {
    // background-color: #c8e6c9;
  }

  .chat-input {
    display: flex;
    padding: 10px;
  }

  .chat-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .chat-input button {
    padding: 10px;
    margin-left: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .chat-input button:hover {
    background-color: #0056b3;
  }
}
</style>