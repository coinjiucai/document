<template>
  <div
    class="product-destroy theme-background-middle flex-layout full-block pa10"
  >
    <ListPage
      ref="listPage"
      :params="{
        ...params,
        labelId:
          this.params.labelId.length > 0 ? this.params.labelId.join(',') : ''
      }"
      :fieldsConfig="[]"
      :labelList="labelList"
      :listApi="['basics', 'syslabelPage']"
      :deleteApi="['basics', 'syslabelDeleteBatch']"
      @edit="edit"
      :editApi="['basics', 'syslabelSave']"
      @add="add"
      :addApi="['basics', 'syslabelSave']"
    >
      <template slot="search">
        <el-form inline size="mini">
          <el-form-item label="标签"
            ><el-cascader
              :options="dataList"
              :show-all-levels="false"
              v-model="params.labelId"
              collapse-tags
              :props="{
                label: 'name',
                value: 'id',
                multiple: true,
                children: 'childrenList'
              }"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="素材名称">
            <el-input
              v-model="params.materialName"
              placeholder="素材名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="素材类型">
            <el-select
              size="mini"
              clearable
              placeholder="素材类型"
              v-model="params.materialType"
            >
              <el-option
                v-for="(item, idx) in sourceList"
                :key="idx"
                :label="item.label"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学派">
            <el-select v-model="params.school" placeholder="请选择" clearable>
              <el-option
                v-for="item in xpList"
                :key="item.id"
                :label="item.school"
                :value="item.school"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难易程度">
            <el-select v-model="params.level" placeholder="请选择" clearable>
              <el-option label="简单" value="简单"> </el-option>
              <el-option label="中等" value="中等"> </el-option>
              <el-option label="困难" value="困难"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSearch">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="labelNames_parent" slot-scope="scope">
        <span class="common-tags-box">
          <el-tag>{{ scope.row.labelName }}</el-tag>
        </span>
      </template>
      <template slot="materialType_parent" slot-scope="scope">
        {{ getMaterialType(scope.row.materialType) }}
      </template>
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)"
          >编辑</el-link
        >
      </template>
    </ListPage>

    <BaseDialog
      class="full-block"
      :title="type == 'add' ? '新增' : '编辑'"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="500px"
      top="20vh"
      destroy-on-close
    >
      <div class="full-block">
        <el-form
          ref="form"
          :model="record"
          :rules="rules"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="素材类型" prop="materialType">
            <el-select
              v-model="record.materialType"
              placeholder="素材类型"
              clearable
              style="width: 100%"
              @change="chagneSources"
            >
              <el-option
                v-for="(item, idx) in sourceList"
                :key="idx"
                :label="item.label"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="素材名称" prop="materialName">
            <el-input
              v-model="record.materialName"
              placeholder="素材名称"
              readonly
              @focus="showScDialog()"
            ></el-input>
            <!-- <el-select
              v-model="record.materialId"
              placeholder="素材名称"
              clearable
              style="width: 100%"
              @change="chagneSourcesName"
              :disabled="record.materialType ? false : true"
              filterable
            >
              <el-option
                v-for="(item, idx) in sourceNameList"
                :key="idx"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="标签选择" prop="labelId">
            <el-cascader
              :options="dataList"
              :show-all-levels="false"
              v-model="record.labelId"
              :props="{ label: 'name', value: 'id', children: 'childrenList' }"
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="学派" prop="school">
            <el-select
              v-model="record.school"
              filterable
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in xpList"
                :key="item.id"
                :label="item.school"
                :value="item.school"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难易程度" prop="level">
            <el-select
              v-model="record.level"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option label="简单" value="简单"> </el-option>
              <el-option label="中等" value="中等"> </el-option>
              <el-option label="困难" value="困难"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>

    <!-- 心理音乐 -->
    <TableDialog
      title="选择素材"
      :param="musicParam"
      :listApi="['source', 'psymusicsPage']"
      :labelList="[
        { label: '音乐名称', prop: 'name' },
        {
          label: '音乐类别',
          prop: 'type'
        },
        {
          label: '歌手',
          prop: 'singer'
        }
      ]"
      :selectLimit="1"
      :showIndex="false"
      ref="musicTableDialog"
      @confirm="confirmSc"
    >
      <template #search>
        <el-form :inline="true" size="mini" style="margin-bottom: -10px">
          <el-form-item label="音乐名称">
            <el-input
              v-model="musicParam.name"
              placeholder="音乐名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="音乐类别">
            <FormItem
              compType="select"
              dictCode="music_type"
              placeholder="音乐类别"
              v-model="musicParam.dictId"
              clearable
            ></FormItem>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: 10px"
              size="mini"
              @click="toSearch"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </template>
      <template slot="labelNames_parent" slot-scope="scope">
        <span class="common-tags-box">
          <el-tag>{{ scope.row.labelName }}</el-tag>
        </span>
      </template>
      <template slot="materialType_parent" slot-scope="scope">
        {{ getMaterialType(scope.row.materialType) }}
      </template>
    </TableDialog>

    <!-- 心理漫画 -->
    <TableDialog
      title="选择素材"
      :param="comisParam"
      :listApi="['source', 'psycomicsPage']"
      :labelList="[
        { label: '漫画名称', prop: 'name' },
        {
          label: '漫画类别',
          prop: 'type'
        }
      ]"
      :selectLimit="1"
      :showIndex="false"
      ref="comisTableDialog"
      @confirm="confirmSc"
    >
      <template #search>
        <el-form :inline="true" size="mini" style="margin-bottom: -10px">
          <el-form-item label="漫画名称">
            <el-input
              v-model="comisParam.name"
              placeholder="音乐名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="漫画类别">
            <FormItem
              compType="select"
              dictCode="comisType"
              placeholder="漫画类别"
              v-model="comisParam.dictId"
              clearable
            ></FormItem>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: 10px"
              size="mini"
              @click="toSearch"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </template>
    </TableDialog>
    <!-- 心理资讯 -->
    <TableDialog
      title="选择素材"
      :param="newsParam"
      :listApi="['source', 'psynewsPage']"
      :labelList="[
        { label: '资讯名称', prop: 'name' },
        {
          label: '资讯类别',
          prop: 'type'
        }
      ]"
      :selectLimit="1"
      :showIndex="false"
      ref="newsTableDialog"
      @confirm="confirmSc"
    >
      <template #search>
        <el-form :inline="true" size="mini" style="margin-bottom: -10px">
          <el-form-item label="资讯名称">
            <el-input
              v-model="newsParam.name"
              placeholder="资讯名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="资讯类别">
            <FormItem
              compType="select"
              dictCode="consultType"
              placeholder="资讯类别"
              v-model="newsParam.dictId"
              clearable
            ></FormItem>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: 10px"
              size="mini"
              @click="toSearch"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </template>
    </TableDialog>
    <!--- 选择心理课堂 -->
    <xlktDialog
      ref="coursesTableDialog"
      @confirm="confirmSc"
      :selectLimit="1"
    ></xlktDialog>
  </div>
</template>
<script>
import ListPage from '@/components/ListPage';
import BaseDialog from '@/components/Base/BaseDialog';
import Browser from '@/utils/browser';
import FileImportDialog from '@/components/FileImport/FileImportDialog';
import FormItem from '@/components/Form/Item';
import Search from '@/components/Search/Search';
import TableDialog from '@/components/TableDialog';
import xlktDialog from '@/views/dataAnalysisPush/components/xlktDialog';
export default {
  components: {
    ListPage,
    BaseDialog,
    FileImportDialog,
    FormItem,
    Search,
    TableDialog,
    xlktDialog
  },
  data() {
    return {
      // 搜索参数
      params: {
        labelId: [],
        materialName: '',
        materialType: '',
        school: '',
        level: ''
      },

      // 表格字段列配置
      labelList: [
        { label: '素材名称', prop: 'materialName' },
        {
          label: '标签内容',
          prop: 'labelNames',
          parent: 'labelNames_parent',
          special: true
        },
        { label: '学派', prop: 'school' },
        {
          label: '素材类型',
          prop: 'materialType',
          special: true,
          parent: 'materialType_parent'
        },
        { label: '难易程度', prop: 'level' },
        {
          label: '操作',
          prop: 'action',
          parent: 'action_parent',
          special: true
        }
      ],
      xpList: [],
      visibleDialog: false,
      dialogTitle: '新增标签',
      type: 'add',
      dataList: [],
      sourceList: [],
      sourceOriginList: [], // 素材资源数组
      sourceNameList: [], // 素材名称下拉列表
      record: {
        materialType: '', // 素材类型
        materialId: '', // 素材id
        materialName: '', // 素材名称
        labelId: [], // 标签选择
        labelName: '',
        school: '',
        level: ''
      },
      rules: {
        materialType: [
          { required: true, message: '请选择素材类型', trigger: 'change' }
        ],
        materialName: [
          { required: true, message: '请选择素材名称', trigger: 'change' }
        ],
        labelId: [{ required: true, message: '请选择标签', trigger: 'change' }]
        // school: [{ required: true, message: '请选择学派', trigger: 'change' }]
      },
      importTips: [
        '请严格参照模板规范进行导入;',
        '一次只能导入一个不超过20MB大小的excel文件;',
        '支持的excel格式有.xls与.xlsx'
      ],
      modelUrl: '',
      actionUrl: '',
      scParam: {
        materialType: '',
        materialName: '',
        school: '',
        level: ''
      },
      //
      musicParam: {
        name: '',
        dictId: '',
        status: 1
      },
      comisParam: {
        name: '',
        dictId: '',
        status: 1
      },
      newsParam: {
        name: '',
        dictId: '',
        status: 1
      }
    };
  },
  mounted() {
    this.modelUrl = `${Browser.getApiUrl()}/mlf-csjm-service/product/excelTemplate`;
    this.actionUrl = `${Browser.getApiUrl()}/mlf-csjm-service/product/import\n`;
    this.getSourceList();
    this.getDataList();
    this.getXpList();
  },
  methods: {
    getMaterialType(type) {
      if (this.sourceList && this.sourceList.length > 0) {
        const item = this.sourceList.find((v) => v.type == type);
        if (item) {
          return item.label;
        } else {
          return '';
        }
      } else {
        return '';
      }
    },
    //
    handleSearch() {
      const params = {
        ...this.params,
        labelId:
          this.params.labelId.length > 0 ? this.params.labelId.join(',') : ''
      };
      const keys = Object.keys(params);
      for (let i = 0; i < keys.length; i++) {
        if (!params[keys[i]]) {
          delete params[keys[i]];
        }
      }
      const pageInfo = this.$refs.listPage.pageInfo;
      const searchInfo = {
        pageSize: pageInfo.pageSize,
        pageNo: 1,
        ...params
      };
      this.$refs.listPage.getList(searchInfo);
    },
    reset() {
      this.params = {
        labelId: [],
        materialName: '',
        materialType: '',
        school: '',
        level: ''
      };
      this.$refs.listPage.pageInfo.pageNo = 1;
      this.handleSearch();
    },
    // 获取素材类型
    getSourceList() {
      this.$api.basics.sourceList().then((res) => {
        const result = res.result.filter(
          (v) => !['心理量表', '心理游戏'].includes(v.label)
        );
        this.sourceOriginList = result;
        this.sourceList = result.map((v) => {
          const list = v.list;
          return {
            label: v.label,
            type: list.length > 0 ? list[0].type : '--'
          };
        });
      });
    },
    // 标签管理：标签数据
    getDataList() {
      this.$api.basics.sysmateriallabelTreeList().then((res) => {
        this.dataList = res.result.map((v) => {
          var childrenList = v.childrenList.map((item) => {
            return {
              id: item.id,
              name: item.name
            };
          });
          if (childrenList.length > 0) {
            return {
              id: v.id,
              name: v.name,
              childrenList
            };
          } else {
            return {
              id: v.id,
              name: v.name
            };
          }
        });
      });
    },
    chagneSources(val) {
      this.record.materialId = '';
      this.record.materialName = '';
      this.sourceNameList = [];

      this.sourceOriginList.forEach((v) => {
        const list = v.list;
        list.forEach((item) => {
          if (item.type == val) {
            this.sourceNameList.push(item);
          }
        });
      });
    },
    chagneSourcesName(val) {
      const item = this.sourceNameList.find((v) => v.id == val);
      this.record.materialName = item.name;
    },
    chagneLabels() {
      let list = [];
      this.dataList.forEach((v) => {
        list = [...list, ...v.list];
      });
      const items = list.filter((v) => this.record.labelIds.includes(v.id));
      this.record.labelList = items;
      this.record.labelNames = items.map((v) => v.itemText).join(',');
    },
    // 获取专家学派列表
    getXpList() {
      this.$api.basics
        .psyexpertPage({
          pageNo: 1,
          pageSize: 100
        })
        .then((res) => {
          const records = res?.result?.records || [];
          this.xpList = records.map((v) => {
            return {
              id: v.id,
              school: v.school
            };
          });
        });
    },
    add() {
      this.type = 'add';
      this.record = {
        materialType: '', // 素材类型
        materialId: '',
        materialName: '', // 素材名称
        labelId: [], // 标签选择
        labelName: '',
        school: '',
        level: ''
      };
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = 'edit';
      this.$api.basics.getSyslabelById({ id: record.id }).then((res) => {
        const record = res.result;
        let labelId = [];
        if (record.labelId) {
          const item = this.getNameById(record.labelId);
          if (item && item.parentId) {
            labelId = [item.parentId, record.labelId];
          } else {
            labelId = [record.labelId];
          }
        }
        this.record = { ...record, labelId };
        const materialType = this.record.materialType;
        // if (materialType) {
        //   this.sourceNameList = [];
        //   this.sourceOriginList.forEach((v) => {
        //     const list = v.list;
        //     list.forEach((item) => {
        //       if (item.type == materialType) {
        //         this.sourceNameList.push(item);
        //       }
        //     });
        //   });
        // }
        this.visibleDialog = true;
      });
    },

    handleCloseDialog() {
      this.visibleDialog = false;
      this.record = {
        materialType: '', // 素材类型
        materialId: '',
        materialName: '', // 素材名称
        labelId: [], // 标签选择
        labelName: ''
      };
      this.$nextTick(() => {
        // 重置表单的校验状态
        if (this.$refs?.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleSave() {
      this.$refs.form.validate((val) => {
        if (val) {
          const id =
            this.record.labelId && this.record.labelId.length > 0
              ? this.record.labelId[this.record.labelId.length - 1]
              : '';

          const name = id ? this.getNameById(id).item.name : '';
          this.$refs.listPage.saveRow({
            ...this.record,
            labelId: id,
            labelName: name
          });
          this.visibleDialog = false;
        }
      });
    },
    getNameById(id) {
      for (const item of this.dataList) {
        if (item.id === id) {
          return {
            item,
            parentId: ''
          };
        }
        if (item.childrenList) {
          for (const child of item.childrenList) {
            if (child.id === id) {
              return {
                item: child,
                parentId: item.id
              };
            }
          }
        }
      }
      return null; // 如果没有找到，返回 null
    },
    handleShowFileImport() {
      this.$refs.fileImport.visibleDialog = true;
    },
    // 导入
    getImportList(response, file) {
      console.log(response, file);
    },
    toSearch() {
      if (this.record.materialType == 'psymusics') {
        // 心理音乐
        this.$refs.musicTableDialog.toSearch();
      } else if (this.record.materialType == 'psycomics') {
        // 心理漫画
        this.$refs.comisTableDialog.toSearch();
      } else if (this.record.materialType == 'psynews') {
        // 心理资讯
        this.$refs.newsTableDialog.toSearch();
      } else if (this.record.materialType == 'psycourses') {
        this.$refs.coursesTableDialog.toSearch();
      }
    },
    showScDialog() {
      this.scParam.materialType = this.record.materialType;
      if (this.record.materialType == 'psymusics') {
        // 心理音乐
        this.$refs.musicTableDialog.show();
      } else if (this.record.materialType == 'psycomics') {
        // 心理漫画
        this.$refs.comisTableDialog.show();
      } else if (this.record.materialType == 'psynews') {
        // 心理资讯
        this.$refs.newsTableDialog.show();
      } else if (this.record.materialType == 'psycourses') {
        this.$refs.coursesTableDialog.show();
      }
    },
    confirmSc(val) {
      if (this.record.materialType == 'psymusics') {
        // 心理音乐
        if (val && val.length > 0) {
          this.record.materialId = val[0].id;
          this.record.materialName = val[0].name;
        }
        this.$refs.musicTableDialog.handleCloseDialog();
      } else if (this.record.materialType == 'psycomics') {
        // 心理漫画
        if (val && val.length > 0) {
          this.record.materialId = val[0].id;
          this.record.materialName = val[0].name;
        }
        this.$refs.comisTableDialog.handleCloseDialog();
      } else if (this.record.materialType == 'psynews') {
        // 心理资讯
        if (val && val.length > 0) {
          this.record.materialId = val[0].id;
          this.record.materialName = val[0].name;
        }
        this.$refs.newsTableDialog.handleCloseDialog();
      } else if (this.record.materialType == 'psycourses') {
        if (val && val.length > 0) {
          this.record.materialId = val[0].taskContentId;
          this.record.materialName = val[0].taskContent;
        }
        this.$refs.coursesTableDialog.handleCloseDialog();
      }
    }
  }
};
</script>
