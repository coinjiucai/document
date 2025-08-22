<template>
  <div class="component-viewPDF full-block flex-layout">
    <embed
        id="viewPDF"
        style="width:100%;height: 100%;"
        :src="src"
        type="application/pdf">
  </div>
</template>

<script>

export default {
  name: "viewPDF",
  components: {},
  data() {
    return {
      fullscreen: false,
    };
  },
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  created() {
  },
  methods: {},
  watch: {},
  computed: {},
  mounted() {
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.component-viewPDF {
}
</style>
