<template>
  <div class="exhibit theme-background-middle flex-layout full-block pa10">
    <ListPage
      ref="listPage"
      :params="params"
      :fieldsConfig="fieldsConfig"
      :labelList="labelList"
      :buttonList="['add', 'delete']"
      :listApi="['exhibit', 'testexamplegeneralPage']"
      :deleteApi="['exhibit', 'testexamplegeneralBatchDelete']"
      @edit="edit"
      :editApi="['exhibit', 'testexamplegeneralSave']"
      @add="add"
      :addApi="['exhibit', 'testexamplegeneralSave']"
    >
      <template slot="action_parent" slot-scope="scope">
        <el-link :underline="false" type="primary" @click="edit(scope.row)">
          编辑
        </el-link>
      </template>
    </ListPage>
    <!-- 弹窗 -->
    <BaseDialog
      class="full-block"
      :title="dialogTitle"
      center
      :visible.sync="visibleDialog"
      @close="handleCloseDialog"
      width="98%"
      top="20vh"
    >
      <div class="full-block">
        <el-form size="mini" :form="form" :rules="rules" inline>
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="form.userName"
              placeholder="请选择用户"
              :disabled="type == 'edit'"
              @focus="showSelect"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="(tab, tabIndex) in list_type"
            :label="tab.name"
            :name="tab.value"
            :key="tabIndex"
          >
            <el-tag
              v-for="(tag, tagIndex) in tab.components"
              :key="tagIndex"
              style="cursor: pointer"
              :type="tag.value === childActive ? '' : 'info'"
              @click="changeTag(tag)"
              >{{ tag.name }}</el-tag
            >
            <div
              v-for="component in tab.components"
              :key="component.name"
              style="margin: 20px 0"
            >
              <template
                v-if="
                  childActive == component.value &&
                  config &&
                  config[childActive]
                "
              >
                <div v-if="config[childActive].level == 1">
                  <el-table
                    :data="config[childActive].fields"
                    style="width: 100%"
                  >
                    <el-table-column prop="name" label="名称">
                      <template slot-scope="scope">
                        <el-input
                          clearable
                          v-model="scope.row.name"
                          placeholder="请输入"
                          size="mini"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="value" label="值">
                      <template slot-scope="scope">
                        <el-input
                          clearable
                          v-model="scope.row.value"
                          placeholder="请输入"
                          size="mini"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="value" label="单位">
                      <template slot-scope="scope">
                        <el-input
                          clearable
                          v-model="scope.row.unit"
                          placeholder="请输入"
                          size="mini"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                      <template slot-scope="scope">
                        <el-button
                          icon="el-icon-delete"
                          circle
                          style="background-color: #0f3027"
                          @click="
                            deleteField(scope.row, config[childActive].fields)
                          "
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-button @click="addField()" style="margin-top: 16px">
                    添加值
                  </el-button>
                </div>
                <div v-if="config[childActive].level == 2">
                  <div
                    v-for="(item, index) in config[childActive].fields"
                    :key="index"
                    style="background: #1ead5a94; margin-bottom: 16px"
                  >
                    <div style="padding-top: 10px; padding-left: 10px">
                      {{ item.name }}
                    </div>
                    <el-table
                      v-if="item.children"
                      :data="item.children"
                      style="width: 100%"
                    >
                      <el-table-column prop="name" label="名称">
                        <template slot-scope="scope">
                          <el-input
                            clearable
                            v-model="scope.row.name"
                            placeholder="请输入"
                            size="mini"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="value" label="值">
                        <template slot-scope="scope">
                          <el-input
                            clearable
                            v-model="scope.row.value"
                            placeholder="请输入"
                            size="mini"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="120px">
                        <template slot-scope="scope">
                          <el-button
                            icon="el-icon-delete"
                            circle
                            style="background-color: #0f3027"
                            @click="deleteField(scope.row, item.children)"
                          ></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div v-else>
                      <el-input
                        clearable
                        v-model="item.value"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                    </div>
                  </div>
                  <el-button @click="addField()" style="margin-top: 16px">
                    添加值
                  </el-button>
                </div>
                <div v-if="config[childActive].level == 3">
                  <div
                    v-for="(item, index) in config[childActive].fields"
                    :key="index"
                    style="background: #1ead5a94; margin-bottom: 16px"
                  >
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        padding-top: 10px;
                        padding-left: 10px;
                      "
                    >
                      <div style="width: 80px">模块名称</div>
                      <el-input
                        clearable
                        v-model="item.name"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                    </div>
                    <el-table
                      v-if="item.children"
                      :data="item.children"
                      style="width: 100%"
                    >
                      <el-table-column prop="name" label="名称">
                        <template slot-scope="scope">
                          <el-input
                            clearable
                            v-model="scope.row.name"
                            placeholder="请输入"
                            size="mini"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="value" label="值">
                        <template slot-scope="scope">
                          <el-input
                            clearable
                            v-model="scope.row.value"
                            placeholder="请输入"
                            size="mini"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="120px">
                        <template slot-scope="scope">
                          <el-button
                            icon="el-icon-delete"
                            circle
                            style="background-color: #0f3027"
                            @click="deleteField(scope.row, item.children)"
                          ></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <div>
                    <el-button @click="addField()" style="margin-top: 16px">
                      添加模块
                    </el-button>
                    <el-button
                      @click="addChildField()"
                      style="margin-top: 16px"
                    >
                      添加子模块
                    </el-button>
                  </div>
                </div>
              </template>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">取消</el-button>
      </span>
    </BaseDialog>
    <UserSelectDialog
      title="人员选择"
      ref="userSetDialog"
      @confirm="confirmSelectUser"
    ></UserSelectDialog>
  </div>
</template>
<script>
import ListPage from "@/components/ListPage";
import BaseDialog from "@/components/Base/BaseDialog";
import FormItem from "@/components/Form/Item";
import UserSelectDialog from "@/components/UserSelectDialog.vue";
import { deepClone } from "@/utils/utils";
import { list_type } from "./config/common.json";
import originConfig from "./config/config.json";
export default {
  components: {
    ListPage,
    BaseDialog,
    FormItem,
    UserSelectDialog,
  },
  data() {
    return {
      list_type,
      config: null,
      // 搜索参数
      params: {
        userName: "",
      },
      // 搜索字段列配置
      fieldsConfig: [
        {
          label: "用户名",
          compType: "input",
          width: 160,
          placeholder: "请输入用户名",
          prop: "userName",
        },
      ],
      // 表格字段列配置
      labelList: [
        { label: "用户名", prop: "userName" },
        {
          label: "操作",
          prop: "action",
          parent: "action_parent",
          special: true,
        },
      ],
      activeName: "1",
      visibleDialog: false,
      childActive: "xlgzqk",
      dialogTitle: "查看配置",
      type: "edit",
      item: null,
      form: {
        userName: "",
        userId: "",
      },
      rules: {},
    };
  },
  mounted() {
    this.config = deepClone(originConfig);

    // const data =
    //   '{"xlgzqk":[{"name":"心理咨询","value":"1355"},{"name":"心理教育","value":"2356"},{"name":"心理测评","value":"1680"},{"name":"认知训练","value":"678"},{"name":"脑波训练","value":"594"}],"jykctop10":[{"name":"全周期心理健康导论","value":"1805"},{"name":"大学生心理适应与发展","value":"1103"},{"name":"心理咨询技术与危机干预","value":"985"},{"name":"积极心理学与幸福教育","value":"675"},{"name":"教师心理健康与教学赋能","value":"854"},{"name":"亲子沟通与家庭治疗","value":"420"}],"wlxwjj":[{"name":"自责","value":"400"},{"name":"孤独","value":"1000"},{"name":"专注","value":"800"},{"name":"抑郁","value":"100"},{"name":"家庭环境","value":"200"},{"name":"学业焦虑","value":"100"},{"name":"恐怖","value":"100"}],"xlzysj":[{"name":"心理量表","value":"280"},{"name":"心理漫画","value":"108"},{"name":"心理游戏","value":"72"},{"name":"心理咨询","value":"322"},{"name":"心理课程","value":"128"}],"cjxlqk":[{"name":"初级","children":[{"name":"恐高场景","value":"50"},{"name":"血腥场景","value":"40"},{"name":"幽闭场景","value":"55"},{"name":"强迫行为场景","value":"48"},{"name":"适应障碍场景","value":"46"},{"name":"实战演习场景","value":"57"}]},{"name":"中级","children":[{"name":"恐高场景","value":"35"},{"name":"血腥场景","value":"33"},{"name":"幽闭场景","value":"40"},{"name":"强迫行为场景","value":"37"},{"name":"适应障碍场景","value":"33"},{"name":"实战演习场景","value":"47"}]},{"name":"高级","children":[{"name":"恐高场景","value":"20"},{"name":"血腥场景","value":"22"},{"name":"幽闭场景","value":"32"},{"name":"强迫行为场景","value":"28"},{"name":"适应障碍场景","value":"25"},{"name":"实战演习场景","value":"39"}]},{"name":"总人数","value":"60"}],"xljksj":[{"name":"无","children":[{"name":"抑郁","value":"320"},{"name":"焦虑","value":"302"},{"name":"幽闭场景","value":"301"},{"name":"失眠","value":"334"},{"name":"心悸","value":"390"},{"name":"障碍","value":"330"}]},{"name":"轻度","children":[{"name":"抑郁","value":"120"},{"name":"焦虑","value":"132"},{"name":"幽闭场景","value":"101"},{"name":"失眠","value":"134"},{"name":"心悸","value":"90"},{"name":"障碍","value":"230"}]},{"name":"中度","children":[{"name":"抑郁","value":"220"},{"name":"焦虑","value":"182"},{"name":"幽闭场景","value":"191"},{"name":"失眠","value":"234"},{"name":"心悸","value":"290"},{"name":"障碍","value":"330"}]},{"name":"重度","children":[{"name":"抑郁","value":"220"},{"name":"焦虑","value":"182"},{"name":"幽闭场景","value":"191"},{"name":"失眠","value":"234"},{"name":"心悸","value":"290"},{"name":"障碍","value":"330"}]}],"wjyjqk":[{"name":"level_1","value":"5"},{"name":"level_2","value":"16"},{"name":"level_3","value":"17"},{"name":"total","value":"225"},{"name":"level_1_rate","value":"3"},{"name":"level_2_rate","value":"6"},{"name":"level_3_rate","value":"5"}],"xlfwwlkj":[{"name":"心理咨询服务","value":"305"},{"name":"心理评估服务","value":"278"},{"name":"心理健康讲座","value":"1683"},{"name":"灾后心理救援","value":"1"},{"name":"心理健康知识普及","value":"1702"},{"name":"心理服务宣传推广","value":"2200"},{"name":"团体心理辅导","value":"2100"},{"name":"医疗转介","value":"10"}],"zxwttop10":[{"name":"预约","children":[{"name":"情绪问题","value":"320"},{"name":"人际关系","value":"302"},{"name":"职业发展","value":"301"},{"name":"心理疾病","value":"334"},{"name":"个性","value":"390"},{"name":"其他","value":"330"}]},{"name":"咨询","children":[{"name":"情绪问题","value":"294"},{"name":"人际关系","value":"183"},{"name":"职业发展","value":"200"},{"name":"心理疾病","value":"95"},{"name":"个性","value":"243"},{"name":"其他","value":"678"}]}],"rwhx-xlxwtz":[{"name":"失联","value":"400"},{"name":"孤独","value":"800"},{"name":"个体需求","value":"100"},{"name":"个性化发展","value":"200"},{"name":"个人自信","value":"100"},{"name":"科学研究","value":"100"},{"name":"职业发展","value":"400"},{"name":"工作压力","value":"1000"},{"name":"轻音乐","value":"800"},{"name":"压力测量量表","value":"100"},{"name":"家庭环境","value":"200"},{"name":"抑郁","value":"100"}],"rwhx-zhpj":[{"name":"综合评价","value":"工作压力下，经常焦虑难安，面对堆积任务，心跳加速、呼吸急促。生活里，人际关系也让他苦恼，总担心自己言行不当遭人嫌弃，因而越发孤僻，回避社交场合。夜晚还频繁失眠，脑海反复播放白天的糟心事，陷入自我否定，情绪低落，对未来感到迷茫无措 。"}],"rwhx-fxyj":[{"name":"yellow","value":"1"},{"name":"day","value":"10"}],"rwhx-grxg":[{"name":"我的性格","value":"热情开朗"},{"name":"我的天赋","value":"听知觉，认知型"},{"name":"我的特长","value":"乒乓球"},{"name":"我适合的职业","value":"公务员"},{"name":"我喜欢的专业","value":"普通心理学"},{"name":"课堂表现","value":"优秀"}],"gznl":[],"jyl":[],"gcl":[],"zyl":[],"kznl":[],"zyxl-nl":[],"zyxl-xq":[],"zyxl-jzg":[],"zyxl-ldl":[],"emotion":[],"interpersonal":[],"pressure":[],"sleep":[],"smyy":[],"xlrx":[],"rgtzxg":[],"rgtzxgms":[],"rgtzqz":[],"rgtzqzms":[],"rgtzydfs":[],"rgtzydfsms":[],"xtsyqk-rshz":[{"name":"register","value":"3602"},{"name":"login","value":"3532"},{"name":"warning","value":"320"}],"xtsyqk-yytj":[{"name":"2-26","value":"5"},{"name":"2-27","value":"10"},{"name":"2-28","value":"9"},{"name":"3-01","value":"8"},{"name":"3-02","value":"15"},{"name":"3-03","value":"18"},{"name":"3-04","value":"12"},{"name":"3-05","value":"10"},{"name":"3-06","value":"16"}],"xtsyqk-zxtj":[{"name":"2-26","value":"109"},{"name":"2-27","value":"132"},{"name":"2-28","value":"145"},{"name":"3-01","value":"170"},{"name":"3-02","value":"156"},{"name":"3-03","value":"134"},{"name":"3-04","value":"180"},{"name":"3-05","value":"196"},{"name":"3-06","value":"223"}],"xtsyqk-wtlxlftj":[{"name":"心理测评","children":[{"name":"健康问卷调查SF-36","value":"432"},{"name":"一般性焦虑问卷","value":"456"},{"name":"阿森斯睡眠量表(AIS)","value":"767"},{"name":"惊恐障碍严重度量表","value":"12"},{"name":"心理健康自评量表","value":"34"}]},{"name":"智能心理教育","children":[{"name":"通用心理学","value":"300"}]},{"name":"基础认知提升","children":[{"name":"自卑心理研究","value":"289"}]},{"name":"心理咨询","children":[]},{"name":"任务中心","children":[]},{"name":"个人中心","children":[]}],"ztqktj-xlzyshu":[],"ztqktj-xlyjsj":[],"ztqktj-rznlshuj":[],"ztqktj-chjyjsj":[],"ztqktj-xljksj":[],"sjfx-xljkqk":[{"name":"心理健康","value":"5"},{"name":"压力与应对","value":"15"},{"name":"价值观","value":"46"},{"name":"生命意义","value":"51"},{"name":"心理动力","value":"14"},{"name":"个性特征","value":"44"},{"name":"意志品质","value":"26"},{"name":"情绪情感","value":"28"},{"name":"职业状态","value":"17"},{"name":"人际关系","value":"10"},{"name":"社会支持","value":"55"},{"name":"生活事件","value":"48"}],"sjfx-zj":[{"name":"参与考试总数","value":"1903"},{"name":"课程总数","value":"200"},{"name":"试卷总数","value":"50"},{"name":"试题总数","value":"680"}],"sjfx-dqksqk":[],"sjfx-dqxxqk":[],"sjfx-rzsjmx":[],"sjfx-pfbz":[],"sjfx-rzxl-result":[],"sjfx-rzxl-xlsjmx":[],"sjfx-znxlzx-result":[]}';

    // this.saveUserByTest(data);
  },
  methods: {
    add() {
      this.dialogTitle = "新增配置";
      this.type = "add";
      this.form.userId = "";
      this.form.userName = "";
      this.config = deepClone(originConfig);
      this.visibleDialog = true;
    },
    edit(record) {
      this.type = "edit";
      this.dialogTitle = "新增配置";
      this.form.userId = record.userId;
      this.form.userName = record.userName;
      this.$api.exhibit
        .gettesTexamplegeneralById({
          id: record.id,
        })
        .then((res) => {
          const result = res.result;
          this.item = result;
          // console.log(result.content);
          const content = JSON.parse(result.content);
          const config = deepClone(originConfig);
          const keys = Object.keys(config);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (content[key]) {
              config[key].fields = content[key];
            }
          }
          this.config = config;
          this.visibleDialog = true;
        });
    },
    handleClick(event) {
      const index = JSON.parse(event.index);
      this.childActive =
        this.list_type[index].components.length > 0
          ? this.list_type[index].components[0].value
          : "";
    },
    changeTag(tag) {
      this.childActive = tag.value;
    },
    handleCloseDialog() {
      this.visibleDialog = false;
    },
    saveUserByTest(content) {
      let params = {
        userId: "e9ca23d68d884d4ebb19d07889727dae",
        userName: "admin",
        content,
      };
      this.$api.exhibit.testexamplegeneralSave(params).then((res) => {
        this.visibleDialog = false;
        this.$message.success("保存成功");
        this.$refs.listPage.handleSearch();
      });
    },
    handleSave() {
      const keys = Object.keys(this.config);
      const content = {};
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (this.config[key] && this.config[key].fields) {
          content[key] = this.config[key].fields;
        } else {
          content[key] = [];
        }
      }
      if (!this.form.userName) {
        this.$message("请选择用户");
        return false;
      }
      let params = {
        id: this.item ? this.item.id : "",
        userId: this.form.userId,
        userName: this.form.userName,
        content: JSON.stringify(content),
      };
      if (!params.id) {
        delete params.id;
      }

      this.$api.exhibit.testexamplegeneralSave(params).then((res) => {
        this.visibleDialog = false;
        this.$message.success("保存成功");
        this.$refs.listPage.handleSearch();
      });
    },
    showSelect() {
      const records = [];
      this.$refs.userSetDialog.show(records);
    },
    confirmSelectUser(selection) {
      if (selection.length > 0) {
        const item = selection[0];
        this.form.userId = item.id;
        this.form.userName = item.realname;
      }
    },
    addField() {
      const config = this.config[this.childActive];
      // 一级数组
      if (config.level == 1) {
        config.fields.push({
          name: "",
          value: "",
        });
      } else if (config.level == 2) {
        config.fields = config.fields.map((v) => {
          var children = v.children;
          if (children) {
            children.push({
              name: "",
              value: "",
            });
            v.children = children;
          }

          return v;
        });
      } else if (config.level == 3) {
        config.fields.push({
          name: "",
          children: [],
        });
      }
    },
    addChildField() {
      const config = this.config[this.childActive];
      config.fields = config.fields.map((v) => {
        var children = v.children;
        if (children) {
          children.push({
            name: "",
            value: "",
          });
          v.children = children;
        }

        return v;
      });
      console.log(config, "wwww");
    },
    deleteField(row, list) {
      console.log(row, list);
      const name = row.name;
      const index = list.findIndex((v) => v.name == name);
      list.splice(index, 1);
    },
  },
};
</script>
<style >
.el-tabs__item.is-active {
  border-bottom-color: transparent !important;
}
</style>
