<!--
  @Name 主题选择
  @Description 切换系统主题，系统基础功能，配合主题控制器和多个主题样式实现主题的切换
  @author 赖明浩
  @date 2023-2-6
-->

<template>
  <div>
    <BaseDialog
      class="component-change-message"
      title="系统消息"
      center
      :visible.sync="visibleDialog"
      @closed="close"
      width="1200px"
    >
      <div>
        <div class="flex-auto" v-loading="loading">
          <div class="list" v-if="dataList.length">
            <div
              class="item"
              v-for="(item, index) in dataList"
              :key="index"
              :class="{ read: item.status == 1 }"
              @click="read(item)"
            >
              <i
                class="el-icon-message-solid"
                style="font-size: 20px"
                :style="{
                  color: item.status == 1 ? '#AAB9CF' : '#375FE9'
                }"
              ></i>
              {{ item.msg }}
            </div>
          </div>
          <el-empty style="flex: 1" description="暂无数据" v-else></el-empty>
        </div>
        <div class="flex-center justify-end">
          <el-pagination
            :current-page="pageInfo.pageNo"
            :page-size="pageInfo.pageSize"
            :page-sizes="[10, 50, 100]"
            :total="total"
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from '@/components/Base/BaseDialog';
import systemLocalConfig from '@/utils/systemLocalConfig';

export default {
  name: 'editPassword',
  components: {
    BaseDialog
  },
  props: {},
  data() {
    return {
      visibleDialog: false,
      pageInfo: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      dataList: [],
      loading: false
    };
  },
  computed: {},
  created() {
    this.doRefresh();
  },
  methods: {
    // 显示
    show() {
      this.userTheme = systemLocalConfig.systemTheme;
      this.visibleDialog = true;
    },
    close() {
      this.visibleDialog = false;
    },
    handleChangeUserTheme() {
      systemLocalConfig.systemTheme = this.userTheme;
      document.location.reload();
    },
    doRefresh() {
      this.loading = true;
      this.$api.System.sysmsgPage({ ...this.pageInfo })
        .then((res) => {
          const result = res.result;
          if (result.records && result.records.length > 0) {
            this.dataList = [...result.records];
          } else {
            this.dataList = [];
          }
          this.total = res.result.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    sizeChange(val) {
      this.pageInfo.pageSize = val;
      this.doRefresh();
    },
    currentChange(val) {
      this.pageInfo.pageNo = val;
      this.doRefresh();
    },
    read(item) {
      this.$api.System.sysmsgRead({
        id: item.id
      }).then((res) => {
        this.doRefresh();
        this.$emit('changeRead');
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog__header {
  line-height: 0 !important;
}

.component-change-message {
  .item {
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.5);
    margin-bottom: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  .item.read {
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
