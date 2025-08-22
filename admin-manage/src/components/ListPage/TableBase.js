export default {
  data() {
    return {
      // api接口
      listApi: [],
      deleteApi: [],
      editApi: [],
      addApi: [],
      itemDraggable: false,
      labelList: [],
      dataList: [],
      pageInfo: {
        pageSize: 10,
        pageNo: 1,
      },
      total: 0,
      selection: [],
      dialogTitle: "标题",
      visibleDialog: false,
      record: {},
      rules: {
        // username: [
        //   { required: true, message: "请选择所属单位！", trigger: "change" },
        // ],
      },
    };
  },
  created() {
    this.pageInfo = {
      pageSize: this.pageInfo.pageSize,
      pageNo: this.pageInfo.pageNo,
      ...this.params,
    };
    this.getList();
  },
  methods: {
    // 查询
    handleSearch() {
      this.pageInfo = {
        pageSize: this.pageInfo.pageSize,
        pageNo: this.pageInfo.pageNo,
        ...this.params,
      };
      this.getList();
    },
    getList() {
      this.pageInfo = {
        pageSize: this.pageInfo.pageSize,
        pageNo: this.pageInfo.pageNo,
        ...this.params,
      };
      this.$api[this.listApi[0]][this.listApi[1]](this.pageInfo).then((res) => {
        this.dataList = res["result"].records;
        this.total = res["result"].total;
      });
    },
    // 选中的行
    selectRowList(selection) {
      this.selection = selection;
    },
    // 保存编辑或新增的内容
    saveRow(row) {
      // 编辑
      if (row.id) {
        this.$api[this.editApi[0]]
          [this.editApi[1]]({ ...row })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("保存成功!");
            }
          })
          .finally(() => {
            this.getList();
          });
      } else {
        this.$api[this.addApi[0]]
          [this.addApi[1]]({ ...row })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success("新增成功!");
            }
          })
          .finally(() => {
            this.getList();
          });
      }
    },
    // 批量删除
    batchDelete() {
      const ids = this.selection.map((v) => v.id);
      if (ids.length == 0) {
        this.$message.warning("请选择请选择删除内容!");
      } else {
        this.$confirm("是否确认删除该数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$api[this.deleteApi[0]]
            [this.deleteApi[1]]({ ids: ids.join(",") })
            .then((res) => {
              if (res.code == 200) {
                this.$message.success("删除成功");
              }
            })
            .finally(() => {
              this.getList();
            });
        });
      }
    },
    // 编辑内容
    edit() {
      const ids = this.selection.map((v) => v.id);
      if (ids.length == 0 || ids.length > 1) {
        this.$message.warning("请选择一条数据!");
      } else {
        this.record = { ...this.selection[0] };
        this.visibleDialog = true;
      }
    },
    dragEnd(cloneList) {},
    add() {},
  },
};
