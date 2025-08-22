<template>
  <div>
    <div v-for="(condition, index) in conditions" :key="index">
      <select v-model="condition.operator">
        <option value="and">且</option>
        <option value="or">或</option>
      </select>
      <input v-model="condition.value" placeholder="输入条件值" />
      <button @click="removeCondition(index)">移除条件</button>
      <button @click="addSubCondition(index)">添加子条件</button>
      <ConditionComponent
        v-if="condition.subConditions"
        v-model="condition.subConditions"
      />
    </div>
    <button @click="addCondition">添加条件</button>
  </div>
</template>

<script>
export default {
  name: "ConditionComponent",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    conditions: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    addCondition() {
      this.conditions.push({ operator: "and", value: "", subConditions: null });
    },
    removeCondition(index) {
      this.conditions.splice(index, 1);
    },
    addSubCondition(index) {
      this.conditions[index].subConditions = [{ operator: "and", value: "" }];
    },
  },
};
</script>
