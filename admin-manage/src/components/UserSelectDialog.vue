<template>
  <div v-if="visibleDialog">
    <BaseDialog
      class="full-block component-table-dialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="800px"
      top="5vh"
      destroy-on-close
    >
      <el-row v-loading="pageLoading">
        <el-col style="width: 250px; margin-right: 10px">
          <LeftCatalogue
            ref="catalogue"
            title="组织架构"
            node-key="id"
            :tree-data.sync="treeList"
            :get-url="['System', 'psysysdepartTreeList']"
            :delete-url="['System', 'sysprivacyuserDeleteBatch']"
            :disabledOption="true"
            :default-props="{
              label: 'name',
              value: 'id',
              children: 'childrenList'
            }"
            @current-change="handleCurrentChange"
          >
          </LeftCatalogue>
        </el-col>
        <el-col style="width: calc(100% - 260px)">
          <div class="user-set-container">
            <div class="search">
              <div>
                <el-input
                  placeholder="请输入搜索内容"
                  v-model="keywords"
                  style="width: 300px"
                  clearable
                  size="small"
                  @change="toSearch"
                >
                </el-input>
              </div>
              <div style="margin-left: 10px">
                <el-button type="primary" size="small" @click="toSearch"
                  >搜索</el-button
                >
              </div>
            </div>
            <div class="user-set-content">
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="user-list" style="height: 470px">
                    <van-list
                      v-model="loading"
                      :finished="finished"
                      finished-text=""
                      @load="onLoad"
                    >
                      <template v-if="list.length > 0">
                        <div class="user-item" v-for="v in list" :key="v.id">
                          <img
                            v-if="!v.selected"
                            src="@/assets/images/select-2.png"
                            @click="changeSelected(v)"
                          />
                          <img
                            v-else
                            src="@/assets/images/select-1.png"
                            @click="changeSelected(v)"
                          />
                          <span style="margin-left: 10px">{{
                            v.realname
                          }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <el-empty
                          style="flex: 1"
                          description="暂无数据"
                          :image-size="130"
                          :image="empty"
                        >
                        </el-empty>
                      </template>
                    </van-list>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>

      <span slot="footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import LeftCatalogue from '@/components/Project/LeftCatalogue';
export default {
  name: 'UserSelectDialog',
  components: { BaseDialog, LeftCatalogue },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    searchVisible: {
      type: Boolean,
      default: () => true
    },
    param: {
      type: Object,
      default: () => {}
    },
    labelList: {
      type: Array,
      default: () => []
    },
    listApi: {
      type: [Array],
      default: () => []
    },
    showPagination: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      empty: require('@/assets/images/no-data.png'),
      pageLoading: false,
      keywords: '',
      visibleDialog: false,
      treeList: [],
      // 用户列表
      dataList: [],
      list: [],
      loading: false,
      finished: false,
      pages: 0,
      pageInfo: {
        pageNo: 1,
        pageSize: 20
      },

      selection: [],
      selecteds: []
    };
  },
  created() {},
  methods: {
    show(records) {
      this.pageLoading = true;
      this.visibleDialog = true;
      this.selecteds = records
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        )
        .map((v) => {
          return {
            ...v,
            selected: true
          };
        });
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    handleCurrentChange(data) {
      this.pageLoading = false;
      this.departId = data.id;
      if (!this.loading) {
        this.pageInfo.pageNo = 1;
        this.list = [];
        this.onLoad();
      }
    },
    onLoad() {
      this.loading = true;
      this.$api.basics
        .userList({
          ...this.pageInfo,
          realname: this.keywords,
          departId: this.departId
        })
        .then((res) => {
          const sIds = this.selecteds.map((v) => v.id);
          this.pageInfo.pageNo++;
          const result = res.result;
          if (result.records && result.records.length > 0) {
            let records = result.records.map((v) => {
              return {
                ...v,
                selected: sIds.includes(v.id)
              };
            });
            this.list = [...this.list, ...records];
          }
          if (result.current == result.pages || result.records.length == 0) {
            this.finished = true;
          } else {
            this.finished = false;
          }
          // 加载状态结束
          this.loading = false;
          // this.total = res["result"].total;
        });
    },
    confirm() {
      this.visibleDialog = false;
      this.$emit('confirm', this.selecteds);
    },
    toSearch() {
      if (!this.loading) {
        this.pageInfo.pageNo = 1;
        this.list = [];
        this.onLoad();
      }
    },
    changeSelected(v) {
      const id = v.id;
      if (v.selected) {
        // 已经选中，删除选中项
        const index = this.selecteds.findIndex((v) => v.id == id);
        this.selecteds.splice(index, 1);
      } else {
        this.selecteds = [v];
      }
      v.selected = !v.selected;

      const sIds = this.selecteds.map((v) => v.id);
      this.dataList = this.dataList.map((v) => {
        return {
          ...v,
          selected: sIds.includes(v.id)
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-set-container {
  height: 500px;
  .search {
    display: flex;
  }
  .user-set-content {
    margin-top: 10px;
  }
  .user-list {
    margin-top: 10px;
    height: 470px;
    overflow-y: auto;
  }
  .tags-box {
    width: 100%;
    height: 480px;
    padding: 10px;
    // background-color: rgba(3, 59, 106, 0.8);
    border-radius: 4px;
    box-sizing: border-box;
    span {
      margin-left: 10px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 0;
    }
    .el-tag {
      color: #fff;
      ::v-deep .el-tag__close {
        color: #fff !important;
      }
    }
  }
  .user-item {
    padding: 5px 0;
    img {
      cursor: pointer;
    }
    .iconfont {
      cursor: pointer;
    }
  }
}
/* 针对 WebKit 浏览器的滚动条样式 */
::-webkit-scrollbar {
  width: 8px !important; /* 滚动条的宽度 */
  border-radius: 50%;
  overflow: hidden;
}
</style>
