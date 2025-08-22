<template>
  <div class="component-viewAudio">
    <audio
      style="width: 100%"
      :src="src"
      controls
      controlslist="nodownload"
      ref="audioPlayer"
      @pause="handlePause"
      @play="handlePlay"
      @ended="handleEnded"
      @seeking="handleSeeking"
      @seeked="handleSeekedDebounced"
    ></audio>
  </div>
</template>
  
<script>
import { debounce } from "lodash";
export default {
  name: "viewAudio",
  components: {},
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isPlaying: false,
      duration: 0,
      currentProgress: 0, // 用于存储当前播放进度
      isSeeking: false,
      handleSeekedDebounced: null,
    };
  },
  created() {
    this.handleSeekedDebounced = debounce(this.handleSeeked, 500);
  },
  mounted() {
    const audio = this.$refs.audioPlayer;
    audio.addEventListener("loadedmetadata", () => {
      this.duration = audio.duration;
    });
  },
  filters: {},
  watch: {},
  computed: {},

  methods: {
    play(targetTime = 0) {
      const audio = this.$refs.audioPlayer;
      audio.currentTime = targetTime;
      audio.play();
    },
    handlePlay() {
      this.isPlaying = true;
      this.$emit("handlePlay", {
        isPlaying: this.isPlaying,
        currentProgress: 0,
        duration: this.duration,
      });
    },
    handlePause() {
      this.isPlaying = false;
      const audio = this.$refs.audioPlayer;
      this.currentProgress = audio.currentTime;
      this.$emit("handlePause", {
        isPlaying: this.isPlaying,
        currentProgress: this.currentProgress,
        duration: this.duration,
      });
    },
    handleEnded() {
      this.isPlaying = false;
      this.$emit("handleEnded", {
        isPlaying: this.isPlaying,
        currentProgress: this.duration,
        duration: this.duration,
      });
    },
    handleSeeking() {
      this.isSeeking = true; // 设置一个标志表示正在拖动
    },
    handleSeeked() {
      this.isSeeking = false; // 拖动结束
      this.handlePause();
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.component-viewAudio {
  width: 100%;
  // Add any specific audio player styling here
}
</style>
  <style lang="scss">
.component-viewAudio_body {
  // Global styles if needed
}
</style>