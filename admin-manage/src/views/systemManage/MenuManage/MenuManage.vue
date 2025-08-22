<!--
  @Name 菜单管理
  @Description 配合JEECG后端实现菜单管理功能，在这里指定每个模块的层级、路由和顺序
  @author 赖明浩
  @date 2023-5-17
  @version 1.0.3
-->

<template>
  <div class="component-MenuManage full-block pa10 flex-layout">
    <div class="flex-none">
      <!-- <el-button type="primary" @click="handleAddMenu">新增</el-button>
      <el-button type="danger" @click="handleBatchDelete">删除</el-button> -->
      <div class="btn-type-1 el-icon-plus" @click="handleAddMenu()">新增</div>
      <div class="btn-type-1 el-icon-close" @click="handleBatchDelete">
        删除
      </div>
    </div>
    <div class="flex-auto pt10">
      <BaseTable
        ref="table"
        row-key="id"
        height="100%"
        :label-list="labelList"
        :list="dataList"
        :tree-props="{ children: 'children' }"
        :show-pagination="false"
      >
        <template v-slot:operation>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="handleEdit(row)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-dropdown :hide-on-click="false">
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template v-slot:dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.native="handleDetail(row)"
                      >详情</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="row['menuType'] !== $cv.MENU_TYPE.BUTTON"
                      @click.native="handleAddSub(row)"
                    >
                      添加下级
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native="handleDelete(row)"
                      style="color: rgb(255, 89, 98)"
                      >删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </div>
    <menuDetailDialog ref="detail" @save="getMenuList"></menuDetailDialog>
  </div>
</template>

<script>
import BaseTable from "@/components/Base/BaseTable";
import menuDetailDialog from "@/views/systemManage/MenuManage/menuDetailDialog";
import { menuTypeList } from "@/com/global_data";

export default {
  name: "MenuManage",
  components: {
    BaseTable,
    menuDetailDialog,
  },
  props: {},
  data() {
    return {
      labelList: [
        { label: "菜单名称", prop: "name", align: "left" },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter: (val) => menuTypeList?.find((i) => i.value === val)?.label,
        },
        { label: "icon", prop: "icon" },
        { label: "组件", prop: "component" },
        { label: "路径", prop: "url" },
        { label: "排序", prop: "sortNo" },
      ],
      dataList: [],
    };
  },
  created() {},
  mounted() {
    this.getMenuList();
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    getMenuList() {
      this.$api.System.getPermissionList().then((res) => {
        this.dataList = res["result"];
      });
    },
    /**
     * 点击新增
     */
    handleAddMenu() {
      this.$refs.detail.add();
      this.$refs.detail.title = "新增";
      this.$refs.detail.disableSubmit = false;
    },
    /**
     * 批量删除
     */
    handleBatchDelete() {
      const list = this.$refs.table.selectedList;
      if (!list.length) {
        this.$popTip.info("请选择一条记录！");
      } else {
        this.$confirm("确认删除选中数据？", "提示", { type: "warning" })
          .then(() => {
            const ids = this.$refs.table.selectedList.map((i) => i.id).join();
            this.$api.System.deletePermission({ ids }).then((res) => {
              if (res["success"]) {
                this.getMenuList();
              } else {
                this.$popTip.warning(res["message"]);
              }
            });
          })
          .catch(() => {
            this.$message.info("已取消操作！");
          });
      }
    },
    /**
     * 单个删除
     * @param row
     */
    handleDelete(row) {
      this.$confirm("确认删除此数据？", "提示", { type: "warning" })
        .then(() => {
          this.$api.System.deletePermission({ ids: row.id }).then((res) => {
            if (res["success"]) {
              this.getMenuList();
            } else {
              this.$popTip.warning(res["message"]);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消操作！");
        });
    },
    /**
     * 点击编辑
     * @param row
     */
    handleEdit(row) {
      this.$refs.detail.edit(row);
      this.$refs.detail.title = "编辑";
      this.$refs.detail.disableSubmit = false;
    },
    /**
     * 点击查看详情
     * @param row
     */
    handleDetail(row) {
      this.$refs.detail.edit(row);
      this.$refs.detail.title = "详情";
      this.$refs.detail.disableSubmit = true;
    },
    /**
     * 添加下级
     * @param record
     */
    handleAddSub(record) {
      this.$refs.detail.title = "添加子菜单";
      this.$refs.detail.disableSubmit = false;
      this.$refs.detail.edit({
        status: "1",
        permsType: "1",
        route: true,
        parentId: record.id,
        menuType: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.component-MenuManage {
}
</style>
