<template>
  <div
    class="psychological-scale theme-background-middle flex-layout full-block pa10"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick" style="height: 100%">
      <el-tab-pane label="量表数据" name="first">
        <ListPage
          ref="listPage"
          :params="params"
          :showSelection="false"
          :fieldsConfig="fieldsConfig"
          :labelList="labelList"
          :buttonList="[]"
          :listApi="['source', 'psypaperPage']"
        >
          <template slot="action_parent" slot-scope="scope">
            <el-link
              :underline="false"
              type="primary"
              @click="lbDetail(scope.row)"
            >
              详情
            </el-link>
          </template>
        </ListPage>
      </el-tab-pane>
      <el-tab-pane label="待测量表" name="three">
        <ListPage
          ref="dclistPage"
          :params="dcParams"
          :showIndex="true"
          :showSelection="false"
          :fieldsConfig="dcFieldsConfig"
          :labelList="dcLabelList"
          :buttonList="[]"
          :listApi="['source', 'getPsypapermemberPage']"
        >
          <template slot="action_parent" slot-scope="scope">
            <el-button size="mini" @click="lbDetail(scope.row)"
              >查看详情</el-button
            >
          </template>
        </ListPage>
      </el-tab-pane>

      <el-tab-pane label="已测量表" name="four">
        <ListPage
          ref="yclistPage"
          :params="ycParams"
          :showIndex="true"
          :showSelection="false"
          :fieldsConfig="ycFieldsConfig"
          :labelList="ycLabelList"
          :buttonList="[]"
          :listApi="['source', 'getPsypapermemberPage']"
        >
          <template slot="testTime_parent" slot-scope="scope">
            {{ getDurrtion(scope.row) }}
          </template>
          <template slot="action_parent" slot-scope="scope">
            <el-button size="mini" @click="baogao(scope.row)"
              >查看报告</el-button
            >
          </template>
        </ListPage>
      </el-tab-pane>
    </el-tabs>
    <psychologicalPublishDialog
      ref="psychological"
      :treeList="treeList"
      :isPublish="recordIsPublish"
      @refresh="$refs.listPage.handleSearch()"
    ></psychologicalPublishDialog>

    <TableDialog
      title="测试情况 "
      :listApi="['source', 'getPsypapermemberPage']"
      :labelList="testLabelList"
      :showIndex="false"
      width="98%"
      ref="testTableDialog"
      :param="testParam"
      :searchVisible="false"
      :showSelection="false"
      :tableStyle="{
        height: '60vh'
      }"
    >
      <template v-slot:search>
        <Search
          :params="testParam"
          :fieldsConfig="testFieldConfig"
          @handleSearch="handleTestSearch"
          @reset="resetTest"
        ></Search>
      </template>
    </TableDialog>

    <!--- 去测试量表  --->
    <BaseDialog
      class="full-block component-psychologicalDialog component-game-dialog"
      title="量表测试"
      center
      :visible.sync="testVisibleDialog"
      @closed="testHandleCloseDialog"
      width="100%"
      top="0vh"
      destroy-on-close
    >
      <iframe
        :src="paperUrl"
        frameborder="0"
        width="100%"
        :height="wHeight"
      ></iframe>
    </BaseDialog>

    <!-- 量表详情 -->
    <BaseDialog
      class="full-block"
      title="量表详情"
      center
      :visible.sync="lbVisibleDialog"
      @close="lbHandleCloseDialog"
      width="1200px"
      top="20vh"
    >
      <div class="full-block">
        <el-form :model="lbRecord" label-position="right" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="排序:">
                <el-input-number
                  v-model="lbRecord.sortOrder"
                  size="mini"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="名称:">
                {{ lbRecord.paperName }}
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="lbRecord.categoryName">
              <el-form-item label="类别:">
                {{ lbRecord.categoryName }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="简介:">
                <div v-html="lbRecord.introduction"></div>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="lbRecord.remark">
              <el-form-item label="备注:">
                <div v-html="lbRecord.remark"></div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="info" @click="lbHandleSave">保存</el-button>
        <el-button type="info" @click="lbHandleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import FormItem from '@/components/Form/Item';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import psychologicalPublishDialog from './psychologicalPublishDialog.vue';
import TableDialog from '@/components/TableDialog';
import Search from '@/components/Search/Search';
import moment from 'moment';
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    FileImportDialog,
    psychologicalPublishDialog,
    TableDialog,
    Search
  },
  data() {
    return {
      user: null,
      treeList: [],
      activeName: 'first',
      wHeight: 800,
      // 搜索参数
      params: {
        paperName: '',
        categoryId: ''
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: '名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入',
          prop: 'paperName'
        },
        {
          label: '类别',
          compType: 'select',
          width: 160,
          placeholder: '选择类别',
          prop: 'categoryId',
          options: []
        }
      ],
      // 表格字段列配置
      labelList: [
        { label: '名称', prop: 'paperName', width: 300 },
        {
          label: '类别',
          prop: 'categoryName',
          width: 160
        },
        { label: '简介', prop: 'introduction' },
        { label: '排序', prop: 'sortOrder', width: 80 },
        {
          label: '操作',
          prop: 'action',
          special: true,
          parent: 'action_parent',
          width: 160
        }
      ],
      recordIsPublish: 0,
      // 搜索参数
      params2: {
        isPublish: '',
        paperName: ''
      },
      // 搜索字段列配置
      fieldsConfig2: [
        {
          label: '状态',
          compType: 'select',
          width: 160,
          placeholder: '选择状态',
          prop: 'isPublish',
          options: [
            {
              label: '未发布',
              value: 0
            },
            {
              label: '已发布',
              value: 1
            }
          ]
        },
        {
          label: '名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入',
          prop: 'paperName'
        }
      ],
      // 表格字段列配置
      labelList2: [
        {
          label: '状态',
          prop: 'isPublish',
          parent: 'isPublis_parent',
          special: true
        },
        { label: '标题', prop: 'title' },
        { label: '量表名称', prop: 'paperName' },
        { label: '量表简介', prop: 'introduction' },
        { label: '发布时间', prop: 'createTime' },
        {
          label: '测试情况',
          prop: 'testProgress',
          parent: 'testProgress_parent',
          special: true
        }
      ],
      // 测试状态
      testParam: {
        testStatus: '',
        userName: '',
        paperId: ''
      },
      testFieldConfig: [
        {
          label: '状态',
          compType: 'select',
          width: 160,
          placeholder: '选择状态',
          prop: 'testStatus',
          options: [
            {
              value: 0,
              label: '待测'
            },
            {
              value: 1,
              label: '已测'
            }
          ]
        },
        {
          label: '姓名',
          compType: 'input',
          width: 160,
          placeholder: '请输入',
          prop: 'userName'
        }
      ],
      testLabelList: [
        {
          label: '测试状态',
          prop: 'testStatus',
          formatter: (val) => {
            if (val == 0) {
              return '待测';
            } else {
              return '已测';
            }
          }
        },

        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '账号',
          prop: 'account'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '预警',
          prop: 'earlyWarn'
        },
        {
          label: '原始分',
          prop: 'originalScore'
        },
        {
          label: '标准分',
          prop: 'standardScore'
        },
        {
          label: '测试时间',
          prop: 'startTime'
        },
        {
          label: '用时',
          prop: 'testTime'
        }
      ],
      // 待测量表
      dcParams: {
        // userId: '',
        testStatus: 0,
        paperName: ''
      },
      dcFieldsConfig: [
        {
          label: '量表名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入',
          prop: 'paperName'
        }
      ],
      dcLabelList: [
        // {
        //   label: '测试标题',
        //   prop: 'title'
        // },
        {
          label: '用户名',
          prop: 'userName'
        },
        {
          label: '量表名称',
          prop: 'paperName'
        },
        {
          label: '量表简介',
          prop: 'introduction'
        },
        {
          label: '发布时间',
          prop: 'createTime'
        },
        {
          label: '操作',
          prop: 'action',
          special: true,
          parent: 'action_parent'
        }
      ],
      // 已测量表
      ycParams: {
        // userId: '',
        testStatus: 1,
        paperName: ''
      },
      ycFieldsConfig: [
        {
          label: '量表名称',
          compType: 'input',
          width: 160,
          placeholder: '请输入',
          prop: 'paperName'
        }
      ],
      ycLabelList: [
        {
          label: '用户名',
          prop: 'userName'
        },
        {
          label: '量表名称',
          prop: 'paperName'
        },
        {
          label: '预警',
          prop: 'earlyWarn'
        },
        {
          label: '原始分',
          prop: 'originalScore'
        },
        {
          label: '标准分',
          prop: 'standardScore'
        },
        {
          label: '测试时间',
          prop: 'startTime'
        },
        {
          label: '用时',
          prop: 'testTime',
          special: true,
          parent: 'testTime_parent'
        },
        {
          label: '操作',
          prop: 'action',
          special: true,
          parent: 'action_parent'
        }
      ],
      testVisibleDialog: false,
      paperUrl: '',
      //
      lbVisibleDialog: false,
      lbRecord: {
        sortOrder: '',
        paperName: '',
        categoryName: '',
        introduction: '',
        remark: ''
      }
    };
  },
  mounted() {
    this.wHeight = document.documentElement.clientHeight - 0;
    this.getUserInfo();
  },
  methods: {
    getDurrtion(item) {
      if (item.startTime && item.endTime) {
        const start = moment(item.startTime);
        const end = moment(item.endTime);
        const diff = moment.duration(end.diff(start));
        return diff.minutes() + ':' + diff.seconds();
      } else {
        return '--';
      }
    },
    getUserInfo() {
      this.$api.System.getUserInfo().then((res) => {
        this.user = res.result.userInfo;
        console.log(this.user);
        // this.dcParams.userId = this.user.id;
        // this.ycParams.userId = this.user.id;
        // 待测
        this.$refs.dclistPage.handleSearch();
        // 已测
        this.$refs.yclistPage.handleSearch();

        this.psypapercategoryList();
        this.psypaperTreeList();
      });
    },
    handleClick(val) {
      console.log(val);
    },
    rowClick(row) {
      this.recordIsPublish = row.isPublish;
      this.$refs.psychological.show(row);
    },
    psypaperTreeList() {
      this.$api.source.psypaperTreeList().then((res) => {
        if (res.result) {
          this.treeList = res.result.map((v) => {
            return {
              ...v,
              paperName: v.name
            };
          });
        } else {
          this.treeList = [];
        }
      });
    },
    psypapercategoryList() {
      this.$api.source.psypapercategoryList().then((res) => {
        const item = this.fieldsConfig.find((v) => v.prop == 'categoryId');
        const options = res.result.map((v) => {
          return {
            label: v.name,
            value: v.id
          };
        });
        item.options = options;
      });
    },
    publish() {
      this.recordIsPublish = 0;
      this.$refs.psychological.show();
    },
    showTest(row) {
      this.testParam.paperId = row.paperId;
      this.$refs.testTableDialog.show();
    },
    handleTestSearch() {
      // testStatus: '',
      //   userName:''
      this.$refs.testTableDialog.toSearch();
    },
    resetTest() {
      this.testParam.testStatus = '';
      this.testParam.userName = '';
      this.$refs.testTableDialog.toSearch();
    },
    startTest(val) {
      this.paperUrl = val.pcTestUrl;
      this.testVisibleDialog = true;
      //   this.$router.push({
      //     path: '/training',
      //     query: {
      //       url: val.pcTestUrl
      //     }
      //   });
    },
    testHandleCloseDialog() {
      this.testVisibleDialog = false;
    },
    lbDetail(record) {
      this.lbRecord = record;
      this.lbVisibleDialog = true;
    },
    lbHandleCloseDialog() {
      this.lbVisibleDialog = false;
    },
    lbHandleSave() {
      this.$api.source.psypaperSave({ ...this.lbRecord }).then((res) => {
        this.$message.success('保存成功');
        this.lbVisibleDialog = false;
        this.$refs.listPage.handleSearch();
      });
    },
    baogao(item) {
      this.paperUrl = item.paperWebUrl;
      this.testVisibleDialog = true;
    }
  }
};
</script>
<style scoped lang="scss">
.test-desc {
  .title {
    margin: 10px 0 5px;
  }
}

.psychological-scale {
  ::v-deep .el-tabs__content {
    width: 100%;
    height: 76vh;
    .el-tab-pane {
      height: 100%;
    }
  }
}
.component-game-dialog {
  /deep/ .el-dialog {
    height: 100vh;
    margin-top: 0 !important;
  }
  /deep/.el-dialog__body {
    max-height: calc(100vh - 47px);
    height: calc(100vh - 47px) !important;
    padding: 0;
  }
  /deep/.el-dialog__footer {
    display: none;
  }
}
</style>
