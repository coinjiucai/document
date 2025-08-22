<template>
  <!-- 确保组件类名 class="component- -->
  <div class="component-dictionary-detail">
    <BaseDialog
      v-if="visibleDialog"
      class="component-choose-depart"
      title="搜索单位"
      left
      :visible.sync="visibleDialog"
      width="500px"
    >
      <div class="myclass">
        <div class="top">
          <TreeBase
            ref="tree"
            :is_tooltip="true"
            :multi="multi"
            :enableDepartUsers="user"
            nodeKey="value"
            class="tree"
            :checked_arr="checked_arr"
            @chosen="chosen"
            :multi_value_type="null"
          >
          </TreeBase>
        </div>
        <div v-if="multi" class="submit">
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click="visibleDialog = false">取消</el-button>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/Base/BaseDialog";
import TreeBase from "@/components/Form/components/TreeBase";
export default {
  name: "choosePeople",
  components: {
    TreeBase,
    BaseDialog,
  },
  props: {
    multi: { type: Boolean, default: true },
    user: { type: Boolean, default: true }, // 是否选人
    checked_arr: { type: Array, default: [] },
  },
  data() {
    return {
      visibleDialog: false,
      departId: "",
    };
  },
  created() {},
  filters: {},
  computed: {},
  methods: {
    chosen(row) {
      if (this.multi) {
        return;
      }
      if (this.user) {
        if (row.hasOwnProperty("idCard")) {
          // 为人则派发该数据
          this.$emit("confirm", row);
          this.visibleDialog = false;
        }
      } else {
        this.$emit("confirm", row);
        this.visibleDialog = false;
      }
    },
    show(departId) {
      this.visibleDialog = true;
      this.departId = departId;
    },
    save() {
      const users = {
        ids: [],
        names: [],
      };
      const departs = {
        ids: [],
        names: [],
      };
      const nodes = this.$refs.tree.refTree.getCheckedNodes();
      nodes.forEach((item) => {
        if (item.hasOwnProperty("idCard")) {
          users.ids.push(item.id ? item.id : item.value);
          users.names.push(item.realname);
        } else if (item.hasOwnProperty("id") || item.hasOwnProperty("value")) {
          departs.ids.push(item.id ? item.id : item.value);
          departs.names.push(item.title);
        } else {
          departs.ids.push(item);
        }
      });

      users.ids = users.ids.toString();
      users.names = users.names.toString();
      departs.ids = departs.ids.toString();
      departs.names = departs.names.toString();
      this.$emit("multiConfirm", users, departs);
      this.visibleDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.submit {
  position: absolute;
  margin-left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
}
.myclass {
  height: 400px;
}
.top {
  height: 97%;
  overflow: scroll;
}
</style>
<style lang="scss"></style>
