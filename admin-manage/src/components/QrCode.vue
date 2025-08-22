<template>
  <div class="qrcode" ref="qrCodeUrl"></div>
</template>

<script>
import QrCode from "qrcodejs2";
export default {
  props: {
    text: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      qrcode: null,
    };
  },
  methods: {
    createQrcode(text) {
      if (this.qrcode) {
        this.makeCode(text);
      } else {
        this.qrcode = new QrCode(this.$refs.qrCodeUrl, {
          text: text, // 需要转换为二维码的内容
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QrCode.CorrectLevel.H,
        });
      }
    },
    makeCode(text) {
      this.qrcode.makeCode(text);
    },
  },
  watch: {
    text: {
      handler(nVal) {
        if (nVal && nVal.length > 2) {
          this.$nextTick(() => {
            this.createQrcode(nVal);
          });
        } else {
          if (this.qrcode) this.qrcode.clear();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
