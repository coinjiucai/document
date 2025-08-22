export default {
  name: 'ListBase',
  components: {},
  props: {},
  data() {
    return {
      // 列表加载动画
      listLoading: false,
      // 删除按钮处理动画
      deleteBtnLoading: false,
      // 获取列表的接口
      getListUrl: null,
      // 批量删除接口
      batchDeleteUrl: null,
      // 查询信息与分页信息
      pageInfo: {},
      // 列表数据
      dataList: []
    };
  },
  beforeCreate() { },
  created() {
    // 在页面渲染之前给pageInfo赋初始值
    this.pageInfo = { ...this.getDefaultPageInfo() };
  },
  mounted() { },
  filters: {},
  watch: {},
  computed: {
    /**
     * 批量删除的参数
     * @description 默认是获取表格勾选项的ids作为参数，如不符合再overwrite
     * @return {{ids: string}}
     */
    batchDeleteParams() {
      const ids =
        this.$refs?.['BaseTable']?.['selectedList'].map(
          (i) => i?.['id'] || null
        ) || [];
      return {
        ids: ids.toString()
      };
    },
    /**
     * 导出的参数
     * @description 默认是获取表格勾选项的ids作为参数，如不符合再overwrite
     * @return {{ids: string}}
     */
    exportParams() {
      const ids =
        this.$refs?.['BaseTable']?.['selectedList'].map(
          (i) => i?.['id'] || null
        ) || [];
      return {
        ids: ids.toString()
      };
    }
  },
  methods: {
    /**
     * 默认查询信息，需要overwrite
     * @return {{}}
     */
    getDefaultPageInfo() {
      return {};
    },
    /**
     * 列表查询
     */
    handleSearch() {
      // 重置当前所处分页
      if (this.pageInfo.hasOwnProperty('pageNo')) {
        this.pageInfo['pageNo'] = 1;
      }
      // 触发查询时重置勾选
      this.getList(true);
    },
    /**
     * 重置查询
     */
    handleResetSearch() {
      this.pageInfo = { ...this.getDefaultPageInfo() };
      this.handleSearch();
    },
    /**
     * 对请求列表的参数做出调整
     * 在继承文件中overwrite它
     * @return {*}
     */
    handleSetGetListParams() {
      return this.pageInfo;
    },
    /**
     * 获取列表请求
     * @param resetSelection {Boolean}
     * @description 注意：以下方法是获取列表后常用的处理操作方式，
     * 如果不符合需求可以在继承文件中overwrite。
     */
    getList(resetSelection = false) {
      this.listLoading = true;
      // getListUrl为空时不触发请求
      if (!this.getListUrl) {
        return;
      }
      const params = this.handleSetGetListParams();
      this.$api.globalAPI.
        getList(this.getListUrl, params).
        then((res) => {
          // 这里解构是为了方便对获取数据后的操作进行overwrite，提高灵活性。
          this.handleGettingList(res);
        }).
        finally(() => {
          if (resetSelection === true) {
            this.$refs['BaseTable']['resetSelection']();
          }
          setTimeout(() => {
            // 避免响应过快导致屏闪效果，延迟关闭loading，优化用户体验
            this.listLoading = false;
          }, 200);
        });
    },
    /**
     * 对获取到的数据进行处理
     * @description 对获取数据进行操作的预设，如果和需求不服再overwrite
     * @param res {Object}
     */
    handleGettingList(res) {
      this.dataList = res['result']['records'];
      // 如果需要显示总条数，pageInfo中必须存在total属性
      if (this.pageInfo.hasOwnProperty('total')) {
        this.pageInfo['total'] = res['result']['total'];
      }
    },
    /**
     * 批量删除
     */
    handleDeleteItems() {
      if (this.batchDeleteParams.ids) {
        this.$confirm('确认删除所选内容？', '提示', { type: 'warning' }).
          then(() => {
            this.deleteBtnLoading = true;
            this.$api.globalAPI.
              batchDelete(this.batchDeleteUrl, this.batchDeleteParams).
              then(() => {
                // this.$message.success('删除成功！');
                this.$message({
                  type: 'success',
                  message: '删除成功！',
                  duration: 2000
                })
                this.handleSearch();
              }).
              finally(() => {
                // 不论操作是否成功都要重置勾选
                this.$refs['BaseTable']['resetSelection']();
                this.deleteBtnLoading = false;
              });
          }).
          catch(() => {
            this.$message.info('已取消操作！');
            this.$message({
              type: 'info',
              message: '已取消操作！',
              duration: 2000
            })
          });
      } else {
        this.$popTip.info('请选择要删除的内容！');
      }
    },
    /**
     * 新增
     */
    handleAddItem() {
      // eslint-disable-next-line no-unused-expressions
      this.$refs.detail?.['showEdit']();
    },
    /**
     * 编辑
     * @param row
     */
    handleEditItem(row) {
      // eslint-disable-next-line no-unused-expressions
      this.$refs.detail?.['showEdit'](row);
    },
    /**
     * 仅查看
     * @param row
     */
    handleShowItem(row) {
      // eslint-disable-next-line no-unused-expressions
      this.$refs.detail?.['show'](row);
    },
    /**
     * 导入
     */
    handleImportItems() {
      // eslint-disable-next-line no-unused-expressions
      this.$refs?.['import']?.['show']();
    },
    /**
     * 导出
     */
    handleExportItems() {
      // eslint-disable-next-line no-unused-expressions
      this.$refs?.['export']?.['show'](this.exportParams);
    },
    /**
     * 清除表格勾选
     */
    resetSelection() {
      // eslint-disable-next-line no-unused-expressions
      this.$refs?.['BaseTable']['resetSelection']();
    }
  }
};
