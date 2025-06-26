class WebSocketManager {
  constructor() {
    this.ws = null;
    this.isClose = false;
    this.isReady = false;
    this.noClose = false;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.currentChannel = null;
    this.currentId = null;
  }

  init({
    wsUrl = 'ws://127.0.0.1:8810',
    channel = 'im',
    id,
    onMessage,
    onError,
    onOpen,
    noClose = false
  }) {
    if (!('WebSocket' in window)) {
      console.error('WebSocket is not supported in this browser');
      return;
    }

    if (
      this.ws &&
      [WebSocket.OPEN, WebSocket.CONNECTING].includes(this.ws.readyState)
    ) {
      console.log('WebSocket connection already exists');
      return;
    }
    try {
      this.noClose = noClose;
      this.currentChannel = channel;
      this.currentId = id;
      this.wsUrl = `${wsUrl}/${channel}/${id}`;
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = onOpen || this.handleOpen.bind(this);
      this.ws.onmessage = onMessage || this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = onError || this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket initialization failed:', error);
    }
  }

  handleOpen() {
    console.log(`WebSocket connected - ${this.wsUrl}`);
    this.isReady = true;
    this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
  }

  handleMessage(evt) {
    try {
      const data = JSON.parse(evt.data);
      if (this.ws) {
        this.ws.message = data;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  handleError() {
    console.error('WebSocket error occurred');
    this.isReady = false;
    this.scheduleReconnect();
  }

  handleClose() {
    console.log('WebSocket connection closed');
    this.isReady = false;

    if (!this.isClose && !this.noClose) {
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    console.log('aaaaaavvvvaaaaaaaa');
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    const delay =
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`Reconnecting in ${delay}ms...`);
    this.reconnectTimer = setTimeout(() => {
      if (!this.isClose) {
        console.log(
          `Attempting to reconnect (attempt ${this.reconnectAttempts})`
        );
        this.init({
          channel: this.currentChannel,
          id: this.currentId,
          noClose: this.noClose
        });
      }
    }, delay);
  }

  send(data) {
    if (this.isReady && this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        this.ws.send(payload);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not ready or not connected');
    }
  }

  close() {
    if (!this.noClose) {
      this.forceClose();
    }
  }

  forceClose() {
    this.isClose = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isReady = false;
  }
}

// Export a singleton instance
const websocket = new WebSocketManager();
export default websocket;
