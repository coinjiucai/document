<template>
  <blockquote :class="bqType">
    <slot />
  </blockquote>
</template>

<script setup>
const props = defineProps({
  bqType: { type: String, default: "bq-normal" },
});
</script>

<style lang="scss" scoped>
.bq-normal {
  background: #f9f9f9;
  font-size: 17px;
  border-left: 4px solid rgb(66, 160, 74);
  margin: 1em 0px 1em 0px;
  padding: 5px 20px 15px 20px;
  quotes: "\201C""\201D""\2018""\2019";
  color: rgb(99, 98, 98);
  border-radius: 1.5px;
  // line-height: 20px;
  p {
    display: inline;
  }
}

.bq-warning {
  background: #eee8e8;
  font-size: 17px;
  border-left: 4px solid rgb(209, 77, 77);
  margin: 1em 10px;
  padding: 1.5em 10px;
  quotes: "\201C""\201D""\2018""\2019";
  color: rgb(98, 99, 98);

  p {
    display: inline;
  }

  ::before {
    color: rgb(182, 182, 182);
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
}
</style>