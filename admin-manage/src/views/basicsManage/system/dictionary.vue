<template>
  <div class="component-DictionaryManage flex-layout full-block frow mt5">
    <div class="content_left flex-layout theme-background-middle flex-none">
      <leftCatalogue
        ref="secMenu"
        class="full-block"
        :title="title"
        :tree-data="typeList"
        node-key="id"
        :disabled-option="false"
        :default-props="{ label: 'dictName', id: 'id' }"
        @current-change="handleNodeClick"
        @add="handleAddDictionary"
        @edit="handleEditDictionary"
        @delete="handleDeleteDictionary"
      ></leftCatalogue>
    </div>
    <div
      class="flex-column flex-auto flex-layout theme-background-middle ml5 pa10"
    >
      <div class="flex-none theme-buttons">
        <!-- <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showContentDetailDialog(false)"
          >添加</el-button
        > -->

        <div
          class="btn-type-1 el-icon-plus"
          @click="showContentDetailDialog(false)"
        >
          添加
        </div>
        <div
          class="btn-type-1 el-icon-edit"
          @click="showContentDetailDialog(true)"
        >
          编辑
        </div>
        <!-- <el-button type="success" @click="showContentDetailDialog(true)"
          >编辑</el-button
        > -->
        <div class="btn-type-1 el-icon-close" @click="deleteItems()">删除</div>
        <!-- <el-button type="danger" @click="deleteItems()">删除</el-button> -->
      </div>
      <!-- <el-divider></el-divider> -->
      <div class="flex-none" style="margin-top: 10px">
        <el-form inline style="text-align: right">
          <el-form-item label="字典名称：">
            <el-input
              class="w160"
              v-model="pageInfo.itemText"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleContentSearch(false)"
              >查询</el-button
            >
            <el-button type="info" @click="handleContentSearch(true)"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="flex-auto">
        <BaseTable
          ref="table"
          height="100%"
          :loading="tableLoading"
          :list="dataList"
          :label-list="labelList"
          :showIndex="false"
          :page-info="pageInfo"
          :total="total"
          @selectRowList="selectRowList"
          @page-change="getDictionaryContentPageList"
        >
          <template v-slot:status="scope">
            <el-switch
              v-model="scope.row.status"
              @change="changeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </BaseTable>
      </div>
    </div>
    <detailCategoryDialog
      ref="detailCatetory"
      :dictionary-type-list="typeList"
      @success="handleContentSearch(true)"
    ></detailCategoryDialog>
    <dictionaryContentDialog
      ref="dictionaryContent"
      :dictionary-type-list="typeList"
      :dictId="pageInfo.dictId"
      @success="getDictionaryContentPageList()"
    ></dictionaryContentDialog>
  </div>
</template>

<script>
// import { dictionaryTypeList } from '@/com/global_data';
import leftCatalogue from "@/components/Project/LeftCatalogue";
// import SecondaryMenu from "@/components/Tree/SecondaryMenu";
import BaseTable from "@/components/Base/BaseTable";
import detailCategoryDialog from "./dictionaryCategoryDetailDialog";
import dictionaryContentDialog from "./dictionaryContentDialog.vue";
export default {
  name: "DictionaryManage",
  components: {
    leftCatalogue,
    // SecondaryMenu,
    BaseTable,
    detailCategoryDialog,
    dictionaryContentDialog,
  },
  props: {},

  data() {
    return {
      typeList: [],
      title: "字典类别",
      tableLoading: false,
      dataList: [],
      labelList: [
        { label: "字典代码", prop: "itemValue" },
        { label: "字典名称", prop: "itemText" },
        { label: "字典类型", prop: "dictName" },
        { label: "排序", prop: "sortOrder" },
        { label: "修改时间", prop: "updateTime" },
        { label: "启用状态", prop: "status", special: true },
      ],
      pageInfo: {
        pageSize: 10,
        pageNumber: 1,
        dictId: "",
        itemText: "",
      },
      selectionList: [],
      total: 0,
    };
  },
  created() {},
  mounted() {
    this.getDictionaryCategory();
  },
  filters: {},
  watch: {},
  computed: {},
  methods: {
    /**
     * 点击新增单位
     * @param tree
     */
    handleAddDictionary(tree) {
      this.$refs.detailCatetory.show(null, 1);
    },
    /**
     * 点击修改
     * @param tree
     * @param current
     */
    handleEditDictionary(tree, current) {
      this.$refs.detailCatetory.show(current, 2);
    },
    handleDeleteDictionary(current) {
      this.$confirm("是否确定删除该分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.System.dictionaryCategoryDeleteBatch({
          ids: current.id,
        }).then((res) => {
          if (res.code == 200) {
            this.getDictionaryCategory();
          }
        });
      });
    },
    /**
     * 获取字段类别分类列表
     */
    getDictionaryCategory() {
      this.$api.System.getDictionaryCategory().then((res) => {
        if (res.result.length > 0) {
          this.typeList = res.result;
          if (!this.pageInfo.dictId) {
            this.pageInfo.dictId = res.result[0].id;
          }
          this.$nextTick(() => {
            this.$refs.secMenu.$refs.tree.setCurrentKey(this.pageInfo.dictId);
            this.getDictionaryContentPageList();
          });
        }
      });
    },
    /**
     * 点击字典类别节点
     * @param data
     */
    handleNodeClick(data) {
      this.pageInfo.dictId = data.id;
      this.handleContentSearch(true);
    },
    /**
     * 获取字典内容列表
     */
    getDictionaryContentPageList() {
      this.tableLoading = true;
      this.$api.System.getDictionaryContentPageList(this.pageInfo)
        .then((res) => {
          this.dataList = res["result"].records.map((v) => {
            return {
              ...v,
              status: v.status == 1 ? true : false,
            };
          });
          this.total = res["result"].total;
        })
        .finally(() => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 200);
        });
    },
    /**
     * 点击查询
     * @param isReset 是否重置
     */
    handleContentSearch(isReset) {
      // 重置表格勾选
      this.$refs.table.resetSelection();
      this.pageInfo.pageNumber = 1;
      if (isReset) {
        this.pageInfo.itemText = "";
      }
      this.getDictionaryCategory();
    },
    selectRowList(list) {
      this.selectionList = list;
    },
    /**
     * 内容详情弹窗显示
     */
    showContentDetailDialog(isEdit) {
      if (isEdit) {
        if (this.selectionList.length != 1) {
          this.$message.warning("请选择一条数据");
          return;
        }
        this.$refs.dictionaryContent.show(this.selectionList[0], 2);
      } else {
        this.$refs.dictionaryContent.show(null, 1);
      }
    },
    changeStatus(row) {
      row.status = row.status == true ? 1 : 0;
      this.$api.System.editDictionaryContent(row)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("状态修改成功！");
          }
        })
        .finally(() => {
          this.getDictionaryContentPageList();
        });
    },
    deleteItems() {
      this.$confirm("是否确认删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const ids = this.selectionList.map((v) => v.id).join(",");
        this.$api.System.deleteDictionaryContent({ ids })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
            }
          })
          .finally(() => {
            this.getDictionaryContentPageList();
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
