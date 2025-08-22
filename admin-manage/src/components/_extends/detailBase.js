import Common from '@/com/common';

export default {
  name: 'DetailBase',
  components: {},
  props: {},
  data() {
    return {
      record: null,
      dialogLoading: false,
      saveButtonLoading: false,
      saveUrl: null,
      getDetailUrl: null,
      readonly: false
    };
  },
  beforeCreate() {

  },
  created() {
    // 避免查看record属性的时候找不到报错
    this.record = { ...this.getDefaultRecord() };
  },
  mounted() {

  },
  filters: {},
  watch: {},
  computed: {
    formConfig() {
      return null;
    }
  },
  methods: {
    /**
     * 默认表单内容
     * @return {null}
     */
    getDefaultRecord() {
      return null;
    },
    /**
     * 关闭弹窗
     */
    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = null;
    },
    /**
     * 设置详情信息
     * @param oldRecord
     * @return {{}|*[]}
     */
    setRecord(oldRecord) {
      // 存在详情Url,则从请求中获取详情
      if (this.getDetailUrl) {
        this.dialogLoading = true;
        this.$api.globalAPI.getDetail(this.getDetailUrl, oldRecord['id']).then((res) => {
          this.record = res['result'];
        }).finally(() => {
          this.dialogLoading = false;
        });
      } else {
        this.record = Common.CloneDeep(oldRecord);
      }
    },
    /**
     * 显示编辑
     * @param record {object | null}
     */
    showEdit(record = null) {
      this.readonly = false;
      if (record) {
        this.visibleDialog = true;
        this.setRecord(record);
      } else {
        this.record = { ...this.getDefaultRecord() };
        this.visibleDialog = true;
      }
    },
    /**
     * 只读显示
     * @param record {object | null}
     */
    show(record = null) {
      this.readonly = true;
      this.visibleDialog = true;
      if(record) {
        this.setRecord(record);
      }
    },
    /**
     * 保存前校验数据
     * @param doSave
     * @return {*}
     */
    checkData(doSave) {
      const validate = this.$refs?.['baseForm']?.['$refs']?.['form']?.['validate'] || null;
      if (validate) {
        this.$refs['baseForm']['$refs']['form']['validate']((val, object) => {
          if (val) {
            doSave();
          } else {
            const dom = document.querySelectorAll(`[form-item-key=${Object.keys(object)[0]}]`)[0];
            // 定位到第一个报错项
            dom.scrollIntoView({
              block: 'center',
              behavior: 'smooth'
            });
          }
        });
      } else {
        doSave();
      }
    },
    /**
     * 点击保存
     */
    handleSave() {
      this.checkData(() => {
        this.saveButtonLoading = true;
        this.$api.globalAPI.saveRecord(this.saveUrl, this.record).then((res) => {
          if (res['success']) {
            this.$emit('save');
            this.handleCloseDialog();
          }
        }).finally(() => {
          this.saveButtonLoading = false;
        });
      });
    }
  }
};
