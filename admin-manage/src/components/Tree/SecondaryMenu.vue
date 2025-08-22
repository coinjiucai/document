<template>
  <div class="component-SecondaryMenu">
    <BaseTree ref="baseTree" v-bind="$attrs" v-on="$listeners">
      <template v-slot:header>
        <div v-if="menuTitle" class="SecMenuTitle">
          <span class="name">{{ menuTitle }}</span>
        </div>
      </template>
      <template v-slot:edit="{node,data}">
        <slot name="edit" :node="node" :data="data"></slot>
      </template>
    </BaseTree>
  </div>
</template>

<script>
import BaseTree from "@/components/Tree/BaseTree";

export default {
  name: "SecondaryMenu",
  components: {
    BaseTree
  },
  props: {
    menuTitle: {
      type: String,
      default: ''
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
    /**
     * 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
     * @param key 待被选节点的 key，若为 null 则取消当前高亮的节点
     *
     */
    setCurrentKey(key) {
      this.$refs.baseTree.$refs.tree.setCurrentKey(key)
    }
  },
}
</script>

<style lang="scss" scoped>
.component-SecondaryMenu {
  .SecMenuTitle {
    border-bottom: solid 1px #e6e6e6;
    height: 50px;
    line-height: 50px;
    color: #000;
    background-color: rgb(251, 251, 251);
    font-family: 'Microsoft YaHei';

    .name {
      border-left: 3px solid rgb(6, 101, 161);
      padding-left: 10px;
    }

    .catalogue {
      float: right;
      margin-right: 10px;
      font-size: 30px;
      color: rgb(1, 140, 205);
      cursor: pointer;
    }

  }

  /deep/ .TreeFilter {
    padding: 5px;
    margin: 0;
  }
}
</style>
