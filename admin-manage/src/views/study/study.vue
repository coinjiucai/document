<template>
  <div class="study">
    <div class="study-container">
      <div class="left-box scroll-y">
        <div v-if="info">
          <img
            v-if="info.logo"
            :src="getImageUrl(info.logo)"
            class="img mb10"
          />
          <div class="flex-row justify-between mb20">
            <span class="flex-row align-center">
              <span>难度：</span>
              <el-rate :value="info.level" :max="3" disabled></el-rate>
            </span>
          </div>
          <div class="mb20">
            {{ info.introduction }}
          </div>
          <div class="flex-column time mb20">
            <span v-if="info.startTime && info.endTime"
              >{{ info.startTime }} 至 {{ info.endTime }}</span
            >
          </div>
        </div>
        <div class="flex-none title"><span>章节导航</span></div>
        <div class="flex-auto">
          <ChapterItem
            v-for="item in treeList"
            :key="item.id"
            :item="item"
            @play="onPlay"
          />
        </div>
      </div>
      <div class="right-box flex1">
        <div class="video-container">
          <viewVideo
            v-if="type == 'mp4'"
            :src="vedioSrc"
            ref="vedio"
            @handlePause="handlePause"
          ></viewVideo>
          <viewAudio
            v-else-if="type == 'mp3'"
            :src="vedioSrc"
            ref="audio"
            @handlePause="handlePause"
          ></viewAudio>

          <template
            v-else-if="['docx', 'doc', 'xls', 'xlsx', 'pptx'].includes(type)"
          >
            <div style="width: 100%; height: 100%">
              <div id="file-view-container"></div>
            </div>
          </template>
          <template v-else-if="['pdf', 'txt'].includes(type)">
            <iframe
              :src="vedioSrc"
              width="100%"
              height="100%"
              frameborder="0"
              style="background: #fff"
            ></iframe>
          </template>
          <template v-else-if="['jpg', 'jpeg', 'png', 'gif'].includes(type)">
            <img :src="vedioSrc" style="width: 100%; object-fit: cover" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import viewVideo from '@/components/FileViewer/viewVideo';
import viewAudio from '@/components/FileViewer/viewAudio';
import ChapterItem from './components/ChapterItem';
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
  name: 'study',
  components: { viewVideo, viewAudio, ChapterItem },
  props: {
    courseId: {
      type: [String, Number],
      default: ''
    },
    courseName: {
      type: String,
      default: ''
    },
    course: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      type: 'mp4',
      pic: require('@/assets/images/course-jj.webp'),
      activeName: 'first',
      info: null,
      treeList: [],
      vedioSrc: '',
      list: [],
      currentPlayItem: null,
      editorItem: null
    };
  },
  computed: {
    progress() {
      let totalItems = 0;
      let completedItems = 0;

      this.treeList.forEach((course) => {
        // 只计算最外层课程（不递归子级）
        totalItems++;
        if (course.readStatus === 1) {
          completedItems++;
        }
      });

      if (totalItems === 0) return 0;
      const progress = (completedItems / totalItems) * 100;
      return parseFloat(progress.toFixed(2)); // 保留两位小数
    }
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getImageUrl(val) {
      if (val) {
        return `${window.VUE_APP_IMAGE_URL}${val}`;
      } else {
        return val;
      }
    },
    // 生产唯一id
    generateId() {
      return (
        'unique-document-key-' +
        Math.floor(
          Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000
        )
      );
    },
    convertToValidJSON(jsonString) {
      // 使用正则表达式匹配所有未被引号包裹的属性名
      return jsonString.replace(/(\w+)(?=:)/g, '"$1"');
    },
    initTreeData(originalData) {
      const processedData = originalData.map((item) => {
        // 处理当前层级的courseCoursewareList
        if (item.courseCoursewareList && item.courseCoursewareList.length > 0) {
          item.courseCoursewareList = item.courseCoursewareList.map(
            (courseware) => {
              if (!courseware.hasOwnProperty('readStatus')) {
                courseware.readStatus = 0;
              }
              if (!courseware.hasOwnProperty('readDuration')) {
                courseware.readDuration = 0;
              }
              return courseware;
            }
          );
        }

        // 处理子层级的childrenList
        if (item.childrenList && item.childrenList.length > 0) {
          item.childrenList = item.childrenList.map((child) => {
            if (
              child.courseCoursewareList &&
              child.courseCoursewareList.length > 0
            ) {
              child.courseCoursewareList = child.courseCoursewareList.map(
                (courseware) => {
                  if (!courseware.hasOwnProperty('readStatus')) {
                    courseware.readStatus = 0;
                  }
                  if (!courseware.hasOwnProperty('readDuration')) {
                    courseware.readDuration = 0;
                  }
                  return courseware;
                }
              );
            }
            return child;
          });
        }

        return item;
      });
      return processedData;
    },
    // 获取课程详情
    getInfo() {
      console.log(this.course, 'vvvv');
      this.info = this.course;
      const validTreeJson = this.convertToValidJSON(this.course.treeJson);
      const treeList = JSON.parse(validTreeJson);
      // 属性值readStatus 补充完整

      this.treeList = this.initTreeData(treeList);
      this.$nextTick(() => {
        if (
          this.treeList.length > 0 &&
          this.treeList[0].courseCoursewareList &&
          this.treeList[0].courseCoursewareList.length > 0
        ) {
          this.$set(this.treeList[0], 'open', true);
          const data = {
            item: this.treeList[0].courseCoursewareList[0],
            info: this.treeList[0]
          };
          this.onPlay(data);
        }
      });
      console.log(this.treeList, 'vvvvv');
      this.info.startTime = this.info.startTime
        ? moment(this.info.startTime).format('YYYY-MM-DD HH:mm')
        : '';
      this.info.endTime = this.info.endTime
        ? moment(this.info.endTime).format('YYYY-MM-DD HH:mm')
        : '';
    },
    // 获取课程章节
    getChaptrtyId() {
      this.$api.education
        .getChaptTreeList({
          id: this.info.courseId
        })
        .then((res) => {
          this.treeList = res.result;
        });
    },
    getFileTypeFromName(fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'image';
        case 'pdf':
          return 'pdf';
        case 'mp4':
        case 'avi':
        case 'mov':
          return 'video';
        case 'mp3':
        case 'wav':
        case 'ogg':
          return 'audio';
        case 'doc':
        case 'docx':
          return 'word';
        case 'xls':
        case 'xlsx':
          return 'excel';
        case 'pptx':
        case 'ppt':
          return 'ppt';
        case 'txt':
          return 'txt';
        default:
          return 'other';
      }
    },
    onPlay(data) {
      const { item, info } = data;
      const { url } = item;
      if (this.currentPlayItem && item.id != this.currentPlayItem.id) {
        const currentExtension = this.getFileExtensionFromUrl(
          this.currentPlayItem.url
        );
        if (currentExtension.toLowerCase() == 'mp4' && this.$refs.vedio) {
          this.$refs.vedio.handlePause();
        } else if (
          currentExtension.toLowerCase() == 'mp3' &&
          this.$refs.audio
        ) {
          this.$refs.audio.handlePause();
        }
      }
      const extension = this.getFileExtensionFromUrl(url);
      this.currentPlayItem = item;
      this.vedioSrc = this.getImageUrl(url);
      this.type = extension;
      this.activeName = 'first';
      this.onChangeTab();
      const fileType = this.getFileTypeFromName(url);
      this.$nextTick(() => {
        if (extension.toLowerCase() == 'mp4' && this.$refs.vedio) {
          console.log(this.$refs.vedio, 'ss');
          this.$refs.vedio.play(this.currentPlayItem.readDuration);
        } else if (extension.toLowerCase() == 'mp3' && this.$refs.audio) {
          this.$refs.audio.play(this.currentPlayItem.readDuration);
        } else if (['word', 'excel', 'ppt'].includes(fileType)) {
          this.$nextTick(() => {
            const typeMaps = {
              doc: 'word',
              docx: 'word',
              xlsx: 'cell',
              xls: 'cell',
              pptx: 'slide'
            };
            if (this.editorItem) {
              this.editorItem.destroyEditor();
              this.editorItem = null;
            }
            this.editorItem = new DocsAPI.DocEditor('file-view-container', {
              document: {
                fileType: this.type.toLowerCase(),
                key: this.generateId(), // 每次预览需更换，避免缓存
                title: item.coursewareName,
                url: this.vedioSrc,
                permissions: {
                  download: true, // 允许下载
                  print: true // 允许打印
                }
              },
              documentType: typeMaps[this.type.toLowerCase()],
              editorConfig: {
                mode: 'view', // 预览模式（不可编辑）
                lang: 'zh',
                user: {
                  name: '麦乐峰',
                  id: '1'
                },
                customization: {
                  autosave: false, // 禁用自动保存
                  comments: false, // 禁用评论
                  zoom: 100 // 默认缩放100%
                }
              },
              height: '100%',
              width: '100%',
              type: 'embedded' // 嵌入式查看器
            });
          });
        }
      });
    },
    getFileExtensionFromUrl(url) {
      // 首先，使用 lastIndexOf 方法找到最后一个斜杠的位置
      const lastSlashIndex = url.lastIndexOf('/');
      // 从最后一个斜杠之后的部分开始截取
      const filename = url.slice(lastSlashIndex + 1);
      // 然后，使用 lastIndexOf 方法找到最后一个点的位置
      const lastDotIndex = filename.lastIndexOf('.');
      if (lastDotIndex === -1) {
        // 如果没有找到点，说明没有扩展名，返回空字符串
        return '';
      }
      // 从最后一个点之后的部分开始截取，得到扩展名
      return filename.slice(lastDotIndex + 1);
    },
    onChangeTab() {
      if (!this.courseId) {
        return false;
      }
    },
    // 播放暂停
    handlePause(item) {
      this.currentPlayItem.readDuration = item.currentProgress;
      if (item.currentProgress >= item.duration) {
        this.currentPlayItem.readStatus =
          item.currentProgress >= item.duration ? 1 : 0;
      } else {
        this.currentPlayItem.readStatus = 0;
      }
    },
    deepRemoveProperty(obj, propToRemove) {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.deepRemoveProperty(item, propToRemove));
      } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([key]) => key !== propToRemove)
            .map(([key, value]) => [
              key,
              this.deepRemoveProperty(value, propToRemove)
            ])
        );
      }
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
.study {
  //   padding: 0 20px 20px;
  overflow: hidden;
  .study-container {
    display: flex;
    justify-content: center;
  }
  .left-box {
    width: 435px;
    height: 80vh;
    background-color: rgba(41, 130, 103, 0.2);
    margin-right: 30px;
    font-size: 16px;
    padding: 20px;
    .img {
      width: 100%;
      height: 225px;
    }
    .time {
      color: #6a8782;
    }
    /deep/.el-rate {
      height: 24px;
    }
    /deep/.el-rate__icon {
      font-size: 24px;
    }
    .collect-img {
      width: 20px;
      height: 18px;
    }
    .title {
      width: 370px;
      height: 30px;
      background-image: url('~@/assets/images/title-bg.png');
      background-repeat: no-repeat;
      background-position: left top;
      background-size: cover;
      padding-left: 25px;
      font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
      font-size: 22px;
      margin-bottom: 20px;
      span {
        position: relative;
        top: -5px;
      }
    }
    .chapter-item {
      margin-bottom: 10px;
      font-size: 16px;
      .chapter-title {
        line-height: 33px;
        padding-left: 10px;
        background: rgba(33, 149, 101, 0.2);
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .little-chapter-title {
        margin-bottom: 10px;
      }
      .introduction {
        color: #6a8782;
        margin-bottom: 10px;
      }
      .chapter-content {
        // padding-left: 50px;
        span {
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .right-box {
    background-color: rgba(41, 130, 103, 0.2);
    padding: 0 20px;
    overflow-y: auto;
    .video-container {
      display: flex;
      width: 100%;
      height: 80vh;
      padding: 20px 0;
    }
    .record {
      height: 160px;
      background-color: rgba(124, 242, 205, 0.2);
      border-radius: 12px;
      .note-item {
        line-height: 26px;
        font-size: 16px;
      }
      .empty {
        text-align: center;
        padding-top: 70px;
        font-size: 20px;
        color: #6a8782;
      }
    }
    .operate {
      height: 40px;
    }
  }
}
.font-18 {
  font-size: 18px;
}
</style>
