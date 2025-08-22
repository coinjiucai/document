<!--
  @Name 文件预览组件
  @Description 实现视频、文档、图片文件预览功能
  @author 赖明浩
  @date 2023-7-25
  @version 1.0.0
-->

<template>
  <div class="component-FileViewer full-block flex-layout overflow-hidden">
    <div id="viewBlock" class="flex-auto" v-if="currentFile">
      <viewPDF
          v-if="currentFile['fileType']==='file'"
          :src="currentFile['url']">
      </viewPDF>
      <viewVideo
          v-if="currentFile['fileType']==='video'"
          :src="currentFile['url']">
      </viewVideo>
      <viewImage v-if="currentFile['fileType']==='image'" :alt="currentFile['name']"
                 :src="currentFile['url']"></viewImage>
    </div>
    <div v-else class="flex-auto" style="margin: 0 auto">
      <el-empty style="width: 300px;height: 100%;text-align: center;color: #8c939d" description="暂无资源"></el-empty>
    </div>
    <slot name="option">
      <div class="flex-none flex-row">
        <div class="flex-auto">
          <h4>{{ currentFile['name'] }}</h4>
        </div>
        <div v-if="currentFile" class="Option flex-none">
          <el-button
              v-if="currentFile['fileType']==='file'"
              @click="screen"
              size="small"
              type="info"
              plain
              class="el-icon-full-screen">
            全屏
          </el-button>
          <el-button
              type="info"
              size="small"
              plain
              icon="el-icon-caret-left"
              :disabled="currentFile['currentLevelIndex']===0"
              @click="prevFile">
            上一个
          </el-button>
          <el-button
              type="info"
              size="small"
              plain
              icon="el-icon-caret-right"
              :disabled="currentFile['currentLevelIndex']===fileList.length-1"
              @click="nextFile">
            下一个
          </el-button>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import viewPDF from "./viewPDF";
import viewVideo from "./viewVideo";
import viewImage from "./viewImage";
import Common from "@/com/common";

export default {
  name: "FileViewer",
  components: {viewPDF, viewVideo, viewImage},
  props: {
    fileList: {
      type: Array | null,
      required: true
    },
    currentFile: {
      type: Object | null,
      required: true,
      example: {
        fileType: 'video',
        name: 'xxx.mp4',
        url: 'https://www.example.com/f/xxx.mp4',
        currentLevelIndex: 0
      }
    }
  },
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    prevFile() {
      const prevIndex = this.currentFile['currentLevelIndex'] - 1
      const prevFile = Common.CloneDeep(this.fileList[prevIndex])
      this.$emit('update:currentFile', prevFile)
    },
    nextFile() {
      const prevIndex = this.currentFile['currentLevelIndex'] + 1
      const prevFile = Common.CloneDeep(this.fileList[prevIndex])
      this.$emit('update:currentFile', prevFile)
    },
    screen() {
      let iframe = document.getElementById("viewPDF");
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document['webkitCancelFullScreen']) {
          document['webkitCancelFullScreen']();
        } else if (document['mozCancelFullScreen']) {
          document['mozCancelFullScreen']();
        } else if (document['msExitFullscreen']) {
          document['msExitFullscreen']();
        }
      } else {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe['webkitRequestFullScreen']) {
          iframe['webkitRequestFullScreen']();
        } else if (iframe['mozRequestFullScreen']) {
          iframe['mozRequestFullScreen']();
        } else if (iframe['msRequestFullscreen']) {
          iframe['msRequestFullscreen']();
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.component-FileViewer {
  #viewBlock {
    padding: 5px;
    box-sizing: border-box;
  }

  .Option {
    text-align: right;
    padding-top: 5px;
  }
}
</style>
<style lang="scss">
.component-FileViewer_body { //dialog使用 customClass="xxx_body"

}
</style>
