<template>
  <el-drawer
      :visible.sync="visibleDrawer"
      title="组织架构权限配置"
      direction="rtl"
      size="600px"
      :before-close="handleClose">
    <div class="full-block flex-layout overflow-hidden">
      <div class="flex-auto better-scroll pa10">
        所拥有的权限：
        <BaseTree
            v-if="visibleDrawer"
            ref="baseTree"
            :tree-list="dataList"
            :tree-props="defaultProps"
            :expand-all="isExpand"
            :default-checked-keys="checkList"
            show-checkbox
            check-strictly
            node-key="value"
            @check-change="handleCheckChange">
        </BaseTree>
      </div>
      <el-divider></el-divider>
      <div class="flex-none pb10 text-center flex-row">
        <div class="flex-none">
          <el-dropdown class="pl10" placement="top">
            <el-button type="primary" plain>
              树操作<i class="el-icon-arrow-up el-icon--right"></i>
            </el-button>
            <el-dropdown-menu>
              <el-dropdown-item @click.native="handleCheckAll(true)">全部勾选</el-dropdown-item>
              <el-dropdown-item @click.native="handleCheckAll(false)">全部不选</el-dropdown-item>
              <el-dropdown-item @click.native="handleExpandAll(true)">展开所有</el-dropdown-item>
              <el-dropdown-item @click.native="handleExpandAll(false)">折叠所有</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="flex-auto pr10" style="text-align: right">
          <el-button type="info" @click="handleClose(false)">取消</el-button>
          <el-button type="primary" @click="handleSave">保存并关闭</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import BaseTree from "@/components/Tree/BaseTree";
import Common from "@/com/common";

export default {
  name: "permissionSettingDrawer",
  components: {
    BaseTree
  },
  props: {},
  data() {
    return {
      visibleDrawer: false,
      dataList: [],
      allIds: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      checkList: [],
      lastCheckList: [],
      isExpand: true,
      departId: null,
    }
  },
  created() {
  },
  mounted() {
    this.getAllPermissionTreeList()
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    /**
     * 获取全部的权限信息
     */
    getAllPermissionTreeList() {
      this.$api.System.getPermissionTreeList().then(res => {
        this.dataList = res['result']['treeList']
        this.allIds = res['result']['ids']
      })
    },
    /**
     * 显示权限详情抽屉面板
     * @param ids
     * @param departId
     */
    showDrawer(ids, departId) {
      this.visibleDrawer = true
      this.lastCheckList = ids ? Common.CloneDeep(ids) : []
      this.checkList = ids ? ids : [];
      this.departId = departId
    },
    /**
     * 关闭抽屉
     * @param done
     */
    handleClose(done = false) {
      this.$confirm('确认关闭？', '提示', {type: 'info',}).then(() => {
        if (done) done();
        else this.visibleDrawer = false
      }).catch(() => {
      });
    },
    /**
     * 点击保存
     */
    handleSave() {
      const params = {
        departId: this.departId,
        permissionIds: this.checkList.toString(),
        lastpermissionIds: this.lastCheckList.toString()
      }
      this.$api.System.saveDepartPermissionList(params).then(res => {
        if (res['success']) {
          this.$message.success('保存成功！')
          this.visibleDrawer = false
          //更新当前用户的权限,通过departId判断,admin正常没有departId会被绕过
          if (this.departId === this.$store.getters.departId) {
            location.reload();
          }
        } else {
          this.$popTip.error(res['message'])
        }
      })
    },
    /**
     * 点击勾选
     * @param data 传递给 data 属性的数组中该节点所对应的对象
     * @param isCheck 节点本身是否被选中
     */
    handleCheckChange(data, isCheck) {
      this.checkList = this.$refs.baseTree.$refs.tree.getCheckedKeys()
      //将当前节点的子节点设为和当前节点相同的状态
      if (data.hasOwnProperty('children') && data['children'] && data['children'].length) {
        const childList = []
        Common.depthFirstSearch([data], i => {
          childList.push(i['value']);
        })
        if (isCheck) {
          childList.map(child => {
            if (!this.checkList.includes(child)) this.checkList.push(child);
          })
        } else {
          childList.map(child => {
            if (this.checkList.includes(child)) Common.remove(this.checkList, i => i === child);
          })
        }
        this.$refs.baseTree.$refs.tree.setCheckedKeys(this.checkList)
      }
      console.debug(this.checkList.length);
    },
    /**
     * 点击全选
     */
    handleCheckAll(check = true) {
      this.$refs.baseTree.$refs.tree.setCheckedKeys(check ? this.allIds : [])
      this.checkList = this.$refs.baseTree.$refs.tree.getCheckedKeys()
    },
    /**
     * 点击折叠和展开
     * @param expand
     */
    handleExpandAll(expand = false) {
      this.isExpand = expand
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-drawer, /deep/ .el-drawer__body {
  overflow: hidden;
}
</style>
