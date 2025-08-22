<script>
import {activeServer} from '../../../config/baseConfig'

export default {
  data() {
    return {
      lockReconnect: false, // 链接是否成功
      baseUrl: activeServer.domain, //
      websocket: {},
      plan_id: '',
    }
  },
  created() {
  },
  methods: {
    /**
     * 初始化
     * @param id
     */
    init(id) {
      this.plan_id = id;
      let replace = this.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://')
      let url = replace + (replace.substring(replace.length - 4) == '/api' ? '' : '/api') + "/websocket/" + id;
      //解决线下线上api不同步问题
      this.websocket = new WebSocket(url)
      this.websocket.onopen = this.websocketOnopen
      this.websocket.onerror = this.websocketOnerror
      this.websocket.onmessage = this.websocketOnmessage
      this.websocket.onclose = this.websocketOnclose
    },
    /**
     * 链接成功
     */
    websocketOnopen() {
      console.log('链接成功')
    },
    /**
     * 链接失败
     */
    websocketOnerror() {
      console.log('链接失败')
      this.reconnect()
    },
    /**
     * 关闭
     * @param e
     */
    websocketOnclose(e) {
      this.websocket.close()
    },
    /**
     * 发送数据
     * @param data
     */
    websocketSend(data) {
      try {
        this.websocket.send(data)
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 重连
     */
    reconnect() {
      let that = this
      if (that.lockReconnect) return
      that.lockReconnect = true
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        console.info("尝试重连...")
        that.init(that.plan_id)
        that.lockReconnect = false
      }, 5000)
    },
    /**
     * 发送数据
     */
    putMessage() {
      let that = this
      clearTimeout(this.timeNum)
      this.timeNum = setTimeout(() => {
        that.websocketSend('random')
      }, 5000)
    }

  },
  beforeDestroy() {
    if (JSON.stringify(this.websocket) != '{}') {
      this.websocketOnclose()
    }
  }

}
</script>

<style>

</style>
