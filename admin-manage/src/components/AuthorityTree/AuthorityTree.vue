<template>
  <div class="authority-tree">
    <div class="item" v-for="(item, index) in demoData" :key="index">
      <div class="item-checked">
        <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
      </div>
      <div class="item-children-c">
        <div
          class="item-children"
          v-for="(children, cIdx) in item.children"
          :key="cIdx"
        >
          <div class="item-child-checked">
            <el-checkbox v-model="children.checked">{{
              children.name
            }}</el-checkbox>
          </div>
          <div class="item-children-authority">
            <div v-for="(authority, aIdx) in children.authority" :key="aIdx">
              <el-checkbox v-model="authority.checked">{{
                authority.name
              }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthorityTree",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
  },
  data() {
    return {
      treeObj: [],
      demoData: [
        {
          name: "项目管理子系统",
          checked: false,
          children: [
            {
              name: "项目登记管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目成员管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目设备载体管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目文档管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
          ],
        },
        {
          name: "项目管理子系统",
          checked: false,
          children: [
            {
              name: "项目登记管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目成员管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目设备载体管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目文档管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
          ],
        },
        {
          name: "项目管理子系统",
          checked: false,
          children: [
            {
              name: "项目登记管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目成员管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目设备载体管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
            {
              name: "项目文档管理",
              checked: false,
              authority: [
                {
                  name: "全部",
                  checked: false,
                },
                {
                  name: "新增",
                  checked: false,
                },
                {
                  name: "修改",
                  checked: false,
                },
                {
                  name: "删除",
                  checked: false,
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    input(val) {
      this.$emit("change", val);
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.treeObj = [...newVal];
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.authority-tree {
  .item-checked {
    line-height: 30px;
  }
  .item-children-c {
    padding-left: 30px;
    .item-children {
      display: flex;
      line-height: 30px;
      .item-child-checked {
        width: 260px;
      }
      .item-children-authority {
        > div {
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
