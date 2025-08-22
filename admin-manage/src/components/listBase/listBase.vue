<template>
  <!-- 确保组件类名 class="component- -->
  <div class="component-listBase">

  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'listBase',
  components: {

  },
  props: {
    // prop:{type:Number,default:0,required:true,},
  },
  data() {
    return {
      listData: [],
      pageInfo: {
        pageNumber: 1,
        pageSize: 10,
        total: 1
      },
      visibleDialog: false,
      searchData: {
        page: 1,
        limit: 10,
        title: ''
      },
      date: []
    };
  },
  created() {
    this.getList();
  },
  // mounted(){},
  filters: {},
  computed: {},
  methods: {
    mulDel() {
      const selection = this.$refs.table.$refs.table.selection;
      if (selection.length == 0) {
        this.$alert('请先勾选数据后再删除', '提示');
      } else {
        this.$confirm('是否删除所选数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delDetail(selection.map((x) => {
            return x.id;
          }));
        }).catch(() => {

        });
      }
    },
    changeDate() {
      if (this.date && this.date.length) {
        this.searchData.startDate = moment(this.date[0]).format('YYYY-MM-DD');
        this.searchData.endDate = moment(this.date[1]).format('YYYY-MM-DD');
      } else {
        this.searchData.startDate = '';
        this.searchData.endDate = '';
        // this.getList();
      }
    },
    search() {
      this.searchData.page = 1;
      this.searchData.limit = 10;
      this.pageInfo = {
        pageNumber: 1,
        pageSize: 10
      };
      this.getList();
    },
    reset() {
      this.searchData = {
        page: 1,
        limit: 10,
        title: ''
      };
      this.search();
    },
    getList() {

    },
    handlePageChange(row) {
      this.pageInfo.pageNumber = row.pageNumber;
      this.pageInfo.pageSize = row.pageSize;
      this.searchData.page = row.pageNumber;
      this.searchData.limit = row.pageSize;
      this.getList();
    },
    judgeDel(row) {
      this.$confirm('确认删除所选记录!', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        showCancelButton: true,
        closeOnClickModal: false
      }).then(() => {
        this.delDetail(row);
      }).catch(() => {
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.component-listBase {

}
</style>
<style lang="scss">
.component-listBase_body { //dialog使用 customClass="xxx_body"

}
</style>
