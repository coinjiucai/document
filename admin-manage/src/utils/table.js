// 表格处理公共mixins,
export default {
  data() {
    return {
      // 行默认的数据
      rowInit: null,
      listData: [],
      selection: []
    };
  },
  methods: {
    // 表格选中列表
    selectRowList(val) {
      this.selection = val;
    },
    // 添加列
    add(list) {
      if (this.rowInit) {
        list.push(this.rowInit);
      }
    },

    deleteOne(list, index) {
      list.splice(index, 1);
    },
    editOne(list, row) {
      this.setEditStatus(list, false);
      this.$set(row, 'edit', true);
    },
    batchDelete(list) {},
    batchExport() {},
    // 设置表格编辑状态
    setEditStatus(list, status) {
      list.forEach((v) => {
        v.edit = status;
      });
    },
    // 前端生成随机8位id
    generateUniqueId() {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let uniqueId = '';
      const charactersLength = characters.length;
      for (let i = 0; i < 8; i++) {
        uniqueId = uniqueId + characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return uniqueId;
    },
    // 批量删除
    delAllList() {
      this.listData = this.listData.filter((item) => {
        return !this.selection.some((row) => {
          return item.rowKey === row.rowKey;
        });
      });
    }
  }
};
