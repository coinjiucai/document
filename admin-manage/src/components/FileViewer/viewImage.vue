<template>
  <div class="component-viewImage full-block" style="overflow: hidden;text-align: center">
    <el-image
        :src="src"
        style="width: auto;max-height: 100%;overflow-y: hidden"
        :previewSrcList="[src]"
        alt="资源图片"
        @click.stop="">
    </el-image>
  </div>
</template>

<script>
export default {
  name: "viewImage",
  components: {},
  props: {
    src: {
      type: String,
      default: "",
    },
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
  methods: {},
}
</script>

<style lang="scss" scoped>
.component-viewImage {

}
</style>
<style lang="scss">
.component-viewImage_body {

}
</style>
