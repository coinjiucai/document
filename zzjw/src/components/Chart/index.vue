<template>
  <div ref="eChaDom" :style="{ width: width, height: height }" />
</template>

<script setup>
import {
  watch,
  onMounted,
  onBeforeUnmount,
  ref,
  shallowRef,
  useAttrs,
} from "vue";
import * as echarts from "echarts";
import debounce from "lodash/debounce";

// const emit = defineEmits(["tosearch"]);
// const attrs = useAttrs();
const props = defineProps({
  width: {
    type: [String, Number],
    default: "100%",
  },
  height: {
    type: [String, Number],
    default: "100%",
  },
  option: {
    type: Object,
    default: () => ({}),
  },
});

const eChaDom = shallowRef(null);
const chart = shallowRef(null);

const init = () => {
  chart.value = echarts.init(eChaDom.value);
  chart.value.setOption(props.option);
  window.addEventListener("resize", debounce(resizeFn, 360));
  // chart.value.on("click", (params) => {
  //   emit("tosearch", params.data.name);
  // });
};

const resizeFn = () => {
  chart.value.resize();
};

onMounted(() => {
  init();
});

watch(
  () => props.option,
  (newOptions) => {
    chart.value.setOption(newOptions);
  },
  { deep: true }
);

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeFn);
});
</script>