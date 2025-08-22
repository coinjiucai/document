<!--
  @Name 菜单管理详情页面
  @Description 菜单管理的新增和编辑的界面
  @author 赖明浩
  @date 2023-5-17
-->

<template>
  <div>
    <BaseDialog
        class="full-block component-menuDetailDialog"
        :title="title"
        center
        :loading="loading"
        :visible.sync="visibleDialog"
        @closed="handleCloseDialog"
        width="800px"
        top="10vh"
    >
      <div class="full-block scroll-y">
        <el-form ref="form" label-width="120px" :rules="rules" :model="model">
          <el-form-item label="菜单类型：">
            <el-radio-group v-model="model.menuType" @change="handleChangeMenuType" :disabled="disableSubmit">
              <el-radio :label="$cv.MENU_TYPE.TOP_MENU">一级菜单</el-radio>
              <el-radio :label="$cv.MENU_TYPE.SEC_MENU">子菜单</el-radio>
              <el-radio :label="$cv.MENU_TYPE.BUTTON">按钮/权限</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="menuLabel" prop="name">
            <el-input class="w230" placeholder="请输入名称" v-model="model.name" :readOnly="disableSubmit"/>
          </el-form-item>
          <el-form-item
              v-show="model.menuType!==this.$cv.MENU_TYPE.TOP_MENU"
              label="上级菜单：" prop="parentId">
            <el-cascader
                class="w230"
                v-model="model.parentId"
                :disabled="disableSubmit"
                :options="treeData" :show-all-levels="false" :props="{emitPath:false,checkStrictly:true}">
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="show" label="菜单路径：" prop="url">
            <el-input
                class="w230"
                v-model="model.url"
                :readOnly="disableSubmit"
                placeholder="请输入路径">
            </el-input>
          </el-form-item>
          <el-form-item v-show="model.menuType!==$cv.MENU_TYPE.BUTTON" prop="component" label="前端组件：">
            <el-input
                class="w230"
                placeholder="请输入前端组件"
                v-model="model.component"
                :readOnly="disableSubmit"/>
          </el-form-item>
          <el-form-item v-show="model.menuType===$cv.MENU_TYPE.TOP_MENU" label="默认跳转地址：">
            <el-input
                class="w230"
                placeholder="请输入路由参数 redirect"
                v-model="model.redirect"
                :readOnly="disableSubmit"/>
          </el-form-item>
          <el-form-item v-show="!show" prop="perms" label="授权标识：">
            <el-input
                class="w230"
                placeholder="请输入授权标识, 如: user:list"
                v-model="model.perms"
                :readOnly="disableSubmit"/>
          </el-form-item>
          <el-form-item v-show="!show" label="授权策略：">
            <el-radio-group v-model="model.permsType" :disabled="disableSubmit">
              <el-radio :label="$cv.PERMS_TYPE.SHOW">可见/可访问(授权后可见/可访问)</el-radio>
              <el-radio :label="$cv.PERMS_TYPE.DISABLE">可编辑(未授权时禁用)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="!show" label="状态：">
            <el-radio-group v-model="model.status" :disabled="disableSubmit">
              <el-radio :label="$cv.BUTTONS_PERMS_STATUS.ENABLE">有效</el-radio>
              <el-radio :label="$cv.BUTTONS_PERMS_STATUS.DISABLE">无效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="show" label="菜单图标：">
            <el-input class="w230" placeholder="点击选择图标" v-model="model.icon" :readOnly="disableSubmit">
              <template v-slot:append>
                <el-popover
                    placement="top-start"
                    title="选择图标"
                    width="380"
                    trigger="hover">
                  <template v-slot:reference>
                    <el-button icon="el-icon-setting" :disabled="disableSubmit"></el-button>
                  </template>
                  <div style="width: 100%;height: 200px;overflow-y: auto">
                    <el-form>
                      <template v-for="(group,gIndex) in allIcons">
                        <el-row :key="gIndex">
                          <el-col :span="24">
                            <div style="text-align: center">{{group["name"]}}</div>
                          </el-col>
                          <el-col :span="24">
                            <el-divider></el-divider>
                          </el-col>
                          <template v-for="(icon,iIndex) in group['icons']">
                            <el-col :span="6" :key="iIndex">
                              <div style="padding: 0 5px">
                                <div @click="handleSelectIcon(icon)" style="height: 50px;width: 80px;font-size: 20px"
                                     class="theme-item SymbolItem">
                                  <SymbolIcon :name="icon"></SymbolIcon>
                                </div>
                                <div>
                                  <TextTooltip position="right" :enterable="false" :value="icon"
                                               :contentStyle="{'fontSize':'14px'}"></TextTooltip>
                                </div>
                              </div>
                            </el-col>
                          </template>
                        </el-row>
                      </template>
                    </el-form>
                  </div>
                </el-popover>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input-number :precision="0" v-model="model.sortNo" :disabled="disableSubmit"></el-input-number>
          </el-form-item>
          <el-form-item v-show="show" label="是否路由菜单：">
            <el-switch active-text="是" inactive-text="否" v-model="model.route" :disabled="disableSubmit"></el-switch>
          </el-form-item>
          <el-form-item v-show="show" label="隐藏路由：">
            <el-switch active-text="是" inactive-text="否" v-model="model.hidden" :disabled="disableSubmit"></el-switch>
          </el-form-item>
          <el-form-item v-show="show" label="是否缓存路由：">
            <el-switch active-text="是" inactive-text="否" v-model="model.keepAlive"
                       :disabled="disableSubmit"></el-switch>
          </el-form-item>
          <el-form-item v-show="show" label="聚合路由：">
            <el-switch active-text="是" inactive-text="否" v-model="model.alwaysShow"
                       :disabled="disableSubmit"></el-switch>
          </el-form-item>
          <el-form-item v-show="show" label="打开方式：">
            <el-switch active-text="外部" inactive-text="内部" v-model="model.internalOrExternal"
                       :disabled="disableSubmit"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" :disabled="disableSubmit" @click="handleSave">保存</el-button>
        <el-button type="info" @click="handleCloseDialog">关闭</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>

// 注意引入的路劲可能不同
import BaseDialog from "@/components/Base/BaseDialog";
import Common from "@/com/common";
import allIcons from "@/assets/icons/iconfonts/symbol/allIcons";
import SymbolIcon from "@/components/IconFont/symbolIcon.vue";
import TextTooltip from "@/components/TextTooltip/TextTooltip.vue";

export default {
  name: "menuDetailDialog",
  components: {TextTooltip, SymbolIcon, BaseDialog},
  props: {},
  mounted() {

  },
  data() {
    return {
      visibleDialog: false,
      loading: false,
      title: null,
      disableSubmit: false,
      model: {},
      show: true,//根据菜单类型，动态显示隐藏表单元素
      menuLabel: '菜单名称：',
      treeData: [],
      allIcons,
    };
  },
  computed: {
    rules() {
      return {
        name: [{required: true, message: '请输入标题!'}],
        component: [{required: this.show, message: '请输入前端组件!'}],
        url: [{required: this.show, message: '请输入路径!'}],
        permsType: [{required: true, message: '请输入授权策略!'}],
        perms: [{required: false, message: '请输入授权标识!'}, {validator: this.validatePerms}]
      }
    }
  },
  watch: {
    visibleDialog(val) {
      if (val) {

      } else {

      }
    }
  },
  created() {
  },
  methods: {
    handleCloseDialog() {
      this.visibleDialog = false;
      this.$nextTick(() => {
        // 重置表单的校验状态
        this.$refs?.form?.clearValidate();
      })
    },
    /**
     * 新增
     */
    add() {
      //初始化默认值
      this.edit({status: '1', permsType: '1', sortNo: 1.0, route: true, menuType: this.$cv.MENU_TYPE.TOP_MENU});
    },
    /**
     * 编辑
     * @param record
     */
    edit(record) {
      this.model = Object.assign({}, record);
      //根据菜单类型，动态展示页面字段
      this.show = record.menuType !== this.$cv.MENU_TYPE.BUTTON;
      this.menuLabel = record.menuType === this.$cv.MENU_TYPE.BUTTON ? '按钮/权限' : '菜单名称';
      this.visibleDialog = true;
      const list = Common.CloneDeep(this.$parent.dataList)
      this.treeData = Common.depthFirstSearchMap(list, (item) => {
        if (item['menuType'] === this.$cv.MENU_TYPE.BUTTON) return false;
        else {
          const obj = {value: item.id, label: item.name}
          if (item.children && item.children.length) obj['children'] = item.children
          return obj
        }
      }, [])
    },
    /**
     * 菜单类型变更
     */
    handleChangeMenuType() {
      if (this.model.menuType === this.$cv.MENU_TYPE.BUTTON) {
        this.show = false;
        this.menuLabel = '按钮/权限：';
      } else {
        this.show = true;
        this.menuLabel = '菜单名称：';
      }
      this.$nextTick(() => {
        // 重置表单的校验状态
        this.$refs?.form?.clearValidate();
      })
    },
    /**
     * 校验授权标识
     * @param rule
     * @param value
     * @param callback
     */
    validatePerms(rule, value, callback) {
      if (value && value.length > 0) {
        //校验授权标识是否存在
        let params = {
          tableName: 'sys_permission',
          fieldName: 'perms',
          fieldVal: value,
          dataId: this.model.id
        };
        this.$api.globalAPI.duplicateCheck(params).then((res) => {
          if (res['success']) {
            callback()
          } else {
            callback("授权标识已存在!")
          }
        })
      } else {
        callback()
      }
    },
    /**
     * 点击确定
     */
    handleSave() {
      this.$refs.form.validate(val => {
        if (val) {
          this.$delete(this.model, 'createTime')
          this.$delete(this.model, 'updateTime')
          if ((this.model.menuType === this.$cv.MENU_TYPE.SEC_MENU || this.model.menuType === this.$cv.MENU_TYPE.BUTTON) && !this.model.parentId) {
            this.$popTip.error("请检查你填的类型以及信息是否正确！");
            return;
          }
          this.loading = true;
          let obj;
          if (!this.model.id) {
            obj = this.$api.System.addPermission(this.model);
          } else {
            obj = this.$api.System.editPermission(this.model);
          }
          obj.then((res) => {
            if (res['success']) {
              this.$message.success(res['message']);
              this.$emit('ok');
            } else {
              this.$popTip.warning(res['message']);
            }
          }).finally(() => {
            this.loading = false;
            this.$emit('save')
            this.handleCloseDialog()
          });
        } else {
          return false
        }
      })
    },
    /**
     * 选择图标
     * @param iconName
     */
    handleSelectIcon(iconName) {
      this.$set(this.model, 'icon', iconName);
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  height: 60vh;
  overflow-y: hidden;
}

/deep/ .mp-dialog_body {
  height: 100%;
}

/deep/ .el-tabs__content {
  height: calc(100% - 55px);
}

.component-menuDetailDialog {

}

.SymbolItem {
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    display: inline-block;
  }
}
</style>
