<template>
  <div class="usual-tree">
    <div class="head-container">
      <el-input
          v-model="searchNodeName"
          placeholder="请输入关键词"
          clearable
          prefix-icon="Search"
          class="mb20"
      />
    </div>
    <div class="head-container">
      <el-tree
          class="flow-tree"
          :data="data"
          node-key="id"
          :props="{ id: 'id', label: 'label', children: 'children' }"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="treeRef"
          :default-expand-all="false"
          :default-expanded-keys="data.map(i=>i.id)"
          @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';

const {proxy} = getCurrentInstance();
const searchNodeName = ref("");
const emit = defineEmits(['nodeClick'])
const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}
watch(searchNodeName, val => {
  proxy.$refs["treeRef"].filter(val);
})

function handleNodeClick(data) {
  emit('nodeClick', data);
}

function isTree(data) {
  for (let elem of data) {
    if (elem.children !== []) {
      return true;
    }
  }
  return false;
}

function getTreeData(data) {
  if (isTree(data)) {
    return data;
  } else {
    return buildNewTree(data);
  }
}

function buildNewTree(checkedNodes) {
  let returnList = [];
  let tempList = [];
  for (let elem of checkedNodes) {
    tempList.push(elem.id);
  }
  for (let elem of checkedNodes) {

    let elemAncestorsStr = elem.ancestors.split(',');
    let elemAncestors = [];
    elemAncestorsStr.forEach(eachStr => {
      elemAncestors.push(+eachStr);
    });
    let topFlag = 1;
    for (let node of elemAncestors) {
      if (tempList.includes(node)) {
        topFlag = 0;
      }
    }
    if (topFlag) {
      recursionFn(checkedNodes, elem);
      returnList.push(elem);
    }
  }
  return returnList;
}

function recursionFn(checkedNodes, elem) {

  let childList = getChildList(checkedNodes, elem);
  elem.children = childList;
  for (let item of childList) {
    if (hasChild(checkedNodes, item)) {
      recursionFn(checkedNodes, item);
    }
  }
};

function getChildList(checkedNodes, elem) {
  let tlist = [];
  for (let item of checkedNodes) {
    let itemAncestorsStr = item.ancestors.split(',');
    let itemAncestors = [];
    itemAncestorsStr.forEach(eachStr => {
      itemAncestors.push(+eachStr);
    });
    if (itemAncestors.includes(elem.id)) {
      let isChildFlag = 1;
      let nodeParentId = item.parentId;
      while (nodeParentId !== undefined && nodeParentId !== elem.id) {
        for (let itemNode of checkedNodes) {
          if (itemNode.id == nodeParentId) {
            isChildFlag = 0;
          }
        }
        nodeParentId = proxy.$refs["treeRef"].getNode(nodeParentId).data.parentId;
      }
      if (isChildFlag === 1) {
        tlist.push(item);
      }
    }
  }
  return tlist;
};

function hasChild(checkedNodes, item) {
  return getChildList(checkedNodes, item).length > 0;
};
</script>

<style scoped>
.flow-tree {
  overflow: auto;
}

.flow-tree:deep() .el-tree-node__children {
  overflow: visible !important
}
</style>
