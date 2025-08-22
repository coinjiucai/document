<template>
  <div class="component-viewVideo">
    <video
      style="width: 100%; height: 100%"
      :src="src"
      controls
      controlslist="nodownload"
      ref="videoPlayer"
      @pause="handlePause"
      @play="handlePlay"
      @ended="handleEnded"
      @seeking="handleSeeking"
      @seeked="handleSeekedDebounced"
    ></video>
  </div>
</template>

<script>
import { debounce } from 'lodash';
export default {
  name: 'viewVideo',
  components: {},
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPlaying: false,
      duration: 0,
      currentProgress: 0, // 用于存储当前播放进度
      isSeeking: false,
      handleSeekedDebounced: null
    };
  },
  created() {
    this.handleSeekedDebounced = debounce(this.handleSeeked, 500);
  },
  mounted() {
    const video = this.$refs.videoPlayer;
    video.addEventListener('loadedmetadata', () => {
      this.duration = video.duration;
    });
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    play(targetTime = 0) {
      const video = this.$refs.videoPlayer;
      video.currentTime = targetTime;
      console.log(targetTime, 'ssss');
      // video.play();
    },
    handlePlay() {
      this.isPlaying = true;
      this.$emit('handlePlay', {
        isPlaying: this.isPlaying,
        currentProgress: 0,
        duration: this.duration
      });
    },
    handlePause() {
      this.isPlaying = false;
      const video = this.$refs.videoPlayer;
      this.currentProgress = video.currentTime;

      this.$emit('handlePause', {
        isPlaying: this.isPlaying,
        currentProgress: this.currentProgress,
        duration: this.duration
      });
    },
    handleEnded() {
      this.isPlaying = false;
      this.$emit('handleEnded', {
        isPlaying: this.isPlaying,
        currentProgress: this.duration,
        duration: this.duration
      });
    },
    handleSeeking() {
      this.isSeeking = true; // 设置一个标志表示正在拖动
    },
    handleSeeked() {
      console.log('dddd');
      this.isSeeking = false; // 拖动结束
      this.handlePause();
    }
  }
};
</script>

<style lang="scss" scoped>
.component-viewVideo {
  width: 100%;
}
</style>
<style lang="scss">
.component-viewVideo_body {
}
</style>
