<template>
  <div v-if="visibleDialog">
    <BaseDialog
      class="full-block component-table-dialog"
      :title="title"
      center
      :visible.sync="visibleDialog"
      @closed="handleCloseDialog"
      width="90%"
      top="20vh"
      destroy-on-close
    >
      <div class="user-set-container" v-loading="pageLoading">
        <el-row :gutter="0">
          <el-col style="width: 250px">
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
          <el-col style="width: calc(100% - 250px)">
            <div class="user-set-content">
              <el-row :gutter="0">
                <el-col style="width: 300px">
                  <div style="display: flex">
                    <el-input
                      placeholder="请输入用户名称"
                      v-model="keywords"
                      clearable
                      @clear="search"
                      @keyup.enter.native="search"
                      size="mini"
                    >
                    </el-input>
                    <el-button
                      size="mini"
                      type="primary"
                      @click="search"
                      style="margin-left: 10px"
                      >搜索</el-button
                    >
                  </div>
                  <div class="user-list">
                    <van-list
                      v-model="loading"
                      :finished="finished"
                      finished-text=""
                      @load="onLoad"
                    >
                      <template v-if="list.length > 0">
                        <div
                          class="user-item nowrap"
                          v-for="v in list"
                          :key="v.id"
                        >
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
                        </div></template
                      >
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
                  <div
                    style="text-align: right; line-height: 1.8; font-size: 14px"
                  >
                    当前第{{ current }}页/总共{{ pages }}页
                  </div>
                </el-col>
                <el-col style="width: calc(100% - 300px)">
                  <div class="tags-box">
                    <el-tag
                      v-for="tag in selecteds"
                      :key="tag.realname"
                      closable
                      type=""
                      @close="changeSelected(tag)"
                    >
                      {{ tag.realname }}
                    </el-tag>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import LeftCatalogue from '@/components/Project/LeftCatalogue';
import BaseDialog from '@/components/Base/BaseDialog';
export default {
  name: 'UserSetDialog',
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
      keywords: '',
      visibleDialog: false,
      treeList: [],
      // 用户列表
      list: [],
      loading: false,
      finished: false,
      pages: 1,
      pageInfo: {
        pageNo: 1,
        pageSize: 20
      },
      current: 1,
      selection: [],
      selecteds: [],
      departId: ''
    };
  },
  created() {},
  methods: {
    /**
     * 单位变更
     */
    handleCurrentChange(data) {
      this.pageLoading = false;
      this.departId = data.id;
      if (!this.loading) {
        this.pageInfo.pageNo = 1;
        this.list = [];
        this.onLoad();
      }
    },
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
    onLoad() {
      this.loading = true;
      this.$api.basics
        .userList({
          ...this.pageInfo,
          departId: this.departId,
          realname: this.keywords
        })
        .then((res) => {
          const sIds = this.selecteds.map((v) => v.id);
          this.pageInfo.pageNo++;
          const result = res.result;
          this.pages = result.pages;
          this.current = result.current;
          if (result.records && result.records.length > 0) {
            let records = result.records.map((v) => {
              return {
                ...v,
                selected: sIds.includes(v.id)
              };
            });
            const combined = [...this.list, ...records];
            this.list = combined.reduce((acc, current) => {
              if (!acc.find((item) => item.id === current.id)) {
                acc.push(current);
              }
              return acc;
            }, []);
          }
          if (result.current == result.pages || result.records.length == 0) {
            this.finished = true;
          } else {
            this.finished = false;
          }
          // 加载状态结束
          this.loading = false;
        });
    },
    confirm() {
      this.visibleDialog = false;
      this.$emit('confirm', this.selecteds);
    },
    changeSelected(v) {
      const id = v.id;
      if (v.selected) {
        // 已经选中，删除选中项
        const index = this.selecteds.findIndex((v) => v.id == id);
        this.selecteds.splice(index, 1);
      } else {
        this.selecteds.push(v);
      }
      v.selected = !v.selected;
    },
    search() {
      this.list = [];
      this.pageInfo.pageNo = 1;
      this.onLoad();
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
    height: 450px;
    padding: 0 10px;
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
