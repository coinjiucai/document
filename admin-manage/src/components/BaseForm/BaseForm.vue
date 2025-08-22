<!--
  @Name 基础表单
  @Description 数据配置生成表单
  @author 赖明浩
  @date 2023-6-25
  @version 0.1.10
-->

<template>
  <el-form
      v-if="formConfig"
      ref="form"
      :rules="formRules"
      :model="record"
      v-bind="formGlobalConfig">
    <template v-for="(item,index) in formConfig['items']">
      <transition name="form-block-fade" :key="index">
        <template v-if="item['type']==='h3'&&!item['invisible']">
          <div>
            <h3 :key="index">{{ item['content'] }}</h3>
            <el-divider></el-divider>
          </div>
        </template>
        <template v-else-if="item['type']==='row'&&!item['invisible']">
          <el-row :key="index">
            <template v-for="(col,colIndex) in item['cols']">
              <transition name="form-item-fade" :key="colIndex">
                <el-col :span="col['span']" :key="colIndex" v-if="!col['invisible']">
                  <!--设置form-item-key方便后面方便获取元素，用于报错的时候定位到报错的地方-->
                  <el-form-item
                      :form-item-key="col['labelProp']['prop']"
                      v-bind="col['labelProp']">
                    <FormBaseComponents :item-config="col" :readonly="readonly" :record="record"/>
                  </el-form-item>
                </el-col>
              </transition>
            </template>
          </el-row>
        </template>
      </transition>
    </template>
  </el-form>
</template>

<script>
import formBase from '@/components/_extends/formBase';
import FormBaseComponents from './components/FormBaseComponents';

export default {
  name: 'BaseForm',
  mixins: [formBase],
  components: {
    FormBaseComponents
  },
  props: {
    formConfig: Object,
    record: Object,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formRules: {}
    };
  },
  // 向所有子孙组件传递表单组件对象，方便调用
  provide() {
    return {
      getFormComp: () => {
        return this.$refs.form;
      }
    };
  },
  created() {
  },
  mounted() {
    // 当节点都渲染好了再设置form rules，并且一开始会触发校验，得把一开始的校验去掉
    this.formRules = this.formConfig?.['global']?.['rules'] || {};
    this.$nextTick(() => {
      this.$refs.form.clearValidate();
    });
  },
  filters: {},
  watch: {
    // 监听rules变化，如果发生变化则需要重置表单校验规则
    'formConfig.global.rules': {
      handler() {
        this.formRules = this.formConfig?.['global']?.['rules'] || {};
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      deep: true
    }
  },
  computed: {
    formGlobalConfig() {
      return this.formConfig?.['global']?.['componentProp'] || {};
    }
  },
  methods: {
    /**
     * 设置placeholder
     * @param text
     * @returns {string|*}
     */
    setPlaceholder(text) {
      return this.readonly ? '' : text;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-block-fade-enter-active, .form-block-fade-leave-active {
  transition: all 0.5s;
}

.form-block-fade-enter-active,
.form-block-fade-leave {
  opacity: 1;
  transform: scaleY(1);
}

.form-block-fade-enter,
.form-block-fade-leave-active {
  opacity: 0;
  transform: scaleY(0);
}

.form-item-fade-enter-active, .form-item-fade-leave-active {
  transition: all 0.5s;
}

.form-item-fade-enter-active,
.form-item-fade-leave {
  opacity: 1;
  transform: scaleX(1);
}

.form-item-fade-enter,
.form-item-fade-leave-active {
  opacity: 0;
  transform: scaleX(0);
}

.component-BaseForm {

}
</style>
