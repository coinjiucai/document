<template>
  <div class="chapter-item">
    <div class="chapter-title" @click="changeOpen(item)">
      {{ item.title }}
    </div>
    <div class="content" v-if="item.open">
      <div class="introduction" v-if="item.introduction">
        章节简介：{{ item.introduction }}
      </div>

      <div
        class="chapter-content flex-layout"
        v-if="item.courseCoursewareList && item.courseCoursewareList.length > 0"
      >
        <span
          v-for="playItem in item.courseCoursewareList"
          :key="playItem.id"
          @click="play(playItem, item)"
          >{{ playItem.coursewareName }}</span
        >
      </div>
    </div>
    <div
      class="kc-children"
      v-if="item.childrenList && item.childrenList.length > 0"
    >
      <ChapterItem
        :isChild="true"
        v-for="v in item.childrenList"
        :key="v.id"
        :item="v"
        @play="childPlay"
      ></ChapterItem>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChapterItem",
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          title: "",
        };
      },
    },
    isChild: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      info: {},
    };
  },
  methods: {
    getChaptrtyId(item) {
      if (item.open) {
        this.$set(item, "open", false);
      } else {
        this.$set(item, "open", true);
      }
    },
    changeOpen(item) {
      if (item.open) {
        this.$set(item, "open", false);
      } else {
        this.$set(item, "open", true);
      }
    },
    formatString(input) {
      const maxLength = 20;
      const lastDotIndex = input.lastIndexOf(".");
      let suffix = lastDotIndex !== -1 ? input.substring(lastDotIndex) : "";
      let baseString =
        lastDotIndex !== -1 ? input.substring(0, lastDotIndex) : input;
      let output =
        baseString.length > maxLength
          ? baseString.substring(0, maxLength) + "..."
          : baseString;
      return output + suffix;
    },
    play(item, info) {
      console.log(item, info, "====");
      this.$emit("play", {
        item,
        info,
      });
    },
    childPlay(data) {
      this.$emit("play", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter-item {
  margin-bottom: 10px;
  font-size: 16px;
  .chapter-title {
    // height: 33px;
    line-height: 33px;
    padding-left: 10px;
    background: rgba(33, 149, 101, 0.2);
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .little-chapter-title {
    margin-bottom: 10px;
  }
  .introduction {
    color: #6a8782;
    margin-bottom: 10px;
  }
  .chapter-content {
    padding-left: 0px;
    span {
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
}
</style>
