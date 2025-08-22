<template>
  <div :style="`height: ${height}px`">
    <!-- 图片上传组件辅助-->
    <el-upload
      id="quill-upload"
      class="avatar-uploader"
      :action="actionUrl"
      :headers="{ 'X-Access-Token': token }"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
      style="height: 0.5px"
    >
    </el-upload>
    <quill-editor
      ref="quillEditor"
      class="quill-editor-main h100p flex-column"
      :options="editorOption"
      v-model="content"
      :value="defaultValue"
      :disabled="disabled"
      @change="handleEditorChange"
    >
    </quill-editor>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
];
export default {
  name: 'BaseQuillEditor',
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String
    },
    // 是否禁用编辑器
    disabled: {
      type: Boolean,
      default: false
    },
    // 高度 单位px 默认200px
    height: {
      type: [String, Number],
      default: () => {
        return 400;
      }
    },
    // 主题 内置Bubble、Snow两种，默认Snow
    // Bubble是一个简单的基于提示起泡样式的主题。
    // Snow是一个简洁扁平化的工具栏主题。
    theme: {
      type: String,
      default: 'snow'
    }
  },
  data() {
    return {
      quillUpdateImg: false,
      token: '',
      actionUrl: '',
      defaultValue: '<p>默认值</p>',
      toolbar: [
        // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
        ['bold', 'italic', 'underline', 'strike'],
        // 引用  代码块-----['blockquote', 'code-block']
        ['blockquote', 'code-block'],
        // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
        [{ header: 1 }, { header: 2 }],
        // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
        [{ list: 'ordered' }, { list: 'bullet' }],
        // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
        [{ script: 'sub' }, { script: 'super' }],
        // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
        [{ indent: '-1' }, { indent: '+1' }],
        // 文本方向-----[{'direction': 'rtl'}]
        [{ direction: 'rtl' }],
        // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
        [{ size: ['small', false, 'large', 'huge'] }],
        // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
        [{ color: [] }, { background: [] }],
        // 字体种类-----[{ font: [] }]
        [{ font: [] }],
        // 对齐方式-----[{ align: [] }]
        [{ align: [] }],
        // 清除文本格式-----['clean']
        ['clean']
        // 链接、图片、视频-----['link', 'image', 'video']
        // ['image']
      ],
      handlers: [],

      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候带图片
            matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]]
          },
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('#quill-upload input').click();
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      }
    };
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    options() {
      return {
        disabled: true,
        theme: this.theme,
        placeholder: '请输入',
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候带图片
            // matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
          },
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote', 'code-block'], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            // [{'direction': 'rtl'}],                         // 文本方向
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ font: [] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除文本格式
            ['link', 'image', 'video'] // 链接、图片、视频
          ] //工具菜单栏配置
        },
        initButton: function () {
          //在使用的页面中初始化按钮样式
          const sourceEditorButton =
            document.querySelectorAll('.ql-sourceEditor');
          if (sourceEditorButton.length) {
            sourceEditorButton.forEach((v) => {
              v.style.cssText =
                'width:80px; border:1px solid #ccc; border-radius:5px;';
              v.innerText = '源码编辑';
            });
          }
        },
        register(q) {
          // 参考 https://blog.csdn.net/w390058785/article/details/84337859
          //注册标签(因为在富文本编辑器中是没有div,table等标签的，需要自己去注册自己需要的标签)
          class div extends q.import('blots/block/embed') {}
          // class br extends q.import('blots/block/embed') {}
          // class table extends q.import('blots/block/embed') {}
          // class tr extends q.import('blots/block/embed') {}
          // class td extends q.import('blots/block/embed') {}
          div.blotName = div.tagName = 'div';
          // br.blotName =br.tagName='br';
          // table.blotName =table.tagName='table';
          // tr.blotName =tr.tagName='tr';
          // td.blotName =td.tagName='td';
          q.register(div);
          // q.register(br);
          // q.register(table);
          // q.register(tr);
          // q.register(td);
        }
      };
    }
  },
  created() {
    this.actionUrl = `${this.getApiUrl()}/mlf-system-service/sys/common/upload`;
    const token = getToken();
    this.token = token;
  },
  methods: {
    handleCustomMatcher(node, Delta) {
      let ops = [];
      Delta.ops.forEach((op) => {
        if (op.insert && typeof op.insert === 'string') {
          ops.push({
            insert: op.insert
          });
        } else if (
          op.insert &&
          typeof op.insert === 'object' &&
          op.insert.image
        ) {
          // Check if the image is a base64 string
          if (op.insert.image.startsWith('data:image')) {
            // Give a warning for base64 images
            // this.$message({
            //   message: '不允许粘贴Base64格式的图片,请手动上传',
            //   type: 'warning'
            // });
          } else {
            // Allow non-base64 images
            ops.push(op);
          }
        } else {
          ops.push(op);
        }
      });
      Delta.ops = ops;
      return Delta;
    },
    getApiUrl() {
      return window.VUE_APP_BASE_URL;
    },

    handleEditorChange(e) {
      this.$emit(
        'change',
        this.value,
        this.$refs.quillEditor['quill']['getText'](),
        e
      );
    },
    // 第一段话的内容
    getFirstParagraph() {
      // 获取编辑器内容
      const delta = this.$refs.quillEditor['quill'].getContents();
      const firstParagraph = delta.ops.find(
        (op) => op.insert && op.insert.trim() !== ''
      );
      if (firstParagraph) {
        console.log(firstParagraph.insert);
        return firstParagraph.insert;
      } else {
        return '';
      }
    },
    // 上传图片前
    beforeUpload(res, file) {
      this.quillUpdateImg = true;
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.quillEditor.quill;
      // 如果上传成功
      if (res.code === 200 && res.message !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        const imgUrl = `${window.VUE_APP_IMAGE_URL}${res.message}`;
        const img = "<img src='" + imgUrl + "'/>";
        quill.insertEmbed(length, 'image', imgUrl);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error('图片插入失败');
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 上传图片失败
    uploadError(res, file) {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error('图片插入失败');
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .quill-editor-main {
  background-color: transparent;
  color: #fff;
}
/deep/ .ql-editor[contenteditable='false'] {
  &,
  & * {
    cursor: not-allowed;
  }
}
/deep/ .ql-toolbar .ql-stroke,
/deep/ .ql-toolbar .ql-fill,
/deep/ .ql-toolbar .ql-picker-label {
  stroke: #fff;
  color: #fff;
  bottom: #fff;
}
/deep/ .ql-container {
  flex: 1;
  height: 0;
}
/deep/ .ql-editor.ql-blank::before {
  color: #fff;
}
</style>
