<template>
  <!-- 富文本 -->
  <div :style="{ height: height }" class="editor-container">
    <editor
      v-model="content"
      :init="init"
      :disabled="disabled"
      :id="editorId"
    ></editor>
  </div>
</template>

<script>
import axios from 'axios';
import { generateId } from '@/utils/utils';
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
//   import "tinymce/icons/default/icons";
import 'tinymce/themes/silver';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/code';
import 'tinymce/plugins/link';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/template';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/autoresize';
export default {
  name: 'tinymce-editor',
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize'
    },
    toolbar: {
      type: [String, Array],
      default:
        'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \
      styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
      table image media charmap hr pagebreak insertdatetime | fullscreen preview'
      // 图片和视频  image media
    },
    height: {
      type: [String, Number],
      default: () => {
        return 0;
      }
    }
  },
  data() {
    return {
      token: '',
      actionUrl: '',
      editorId: `tinymicId_${generateId()}`,
      //初始化配置
      init: {
        selector: `#${this.editorId}`,
        menubar: true, // 菜单栏显隐
        icons_url: `${window.VUE_APP_IMAGE_URL}/tinymce/icons/default/icons.min.js`,
        language: 'zh_CN',
        language_url: `${window.VUE_APP_IMAGE_URL}/tinymce/langs/zh_CN.js`,
        skin_url: `${window.VUE_APP_IMAGE_URL}/tinymce/skins/ui/oxide-dark`,
        content_css: 'dark', // 内容区域深色
        min_height: 500,
        max_height: 800,
        // toolbar_mode: "floating",
        plugins: this.plugins,
        toolbar: this.toolbar,
        content_style: 'p {margin: 5px 0;}',
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        branding: false,
        // 图片上传
        images_upload_handler: (blobInfo, success, failure) => {
          const formData = new FormData();
          formData.append('file', blobInfo.blob());
          axios
            .post(
              `${window.VUE_APP_BASE_URL}/mlf-system-service/sys/common/upload`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            )
            .then((res) => {
              if (res.status == 200) {
                if (
                  res.data.message &&
                  (res.data.message.indexOf('http') >= 0 ||
                    res.data.message.indexOf('https') >= 0)
                ) {
                  const file_url = res.data.message;
                  success(file_url);
                } else {
                  const file_url = `${window.VUE_APP_IMAGE_URL}/${res.data.message}`;
                  success(file_url);
                }
                return;
              }
            })
            .catch((error) => {
              console.error('上传错误:', error);
            });
        }
      },
      content: this.value
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      tinymce.init(this.init);
      const editorContainer = document.querySelector('.editor-container');
      const resizeObserver = new ResizeObserver((entries) => {
        const newHeight = entries[0].contentRect.height;
        console.log(newHeight);
        this.setMaxHeight(newHeight);
      });

      resizeObserver.observe(editorContainer);
    });
  },
  methods: {
    getValue(value) {
      if (!value) {
        return '';
      }
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        return value;
      } else {
        return `${window.VUE_APP_IMAGE_URL}${value}`;
      }
    },
    // 更新最大高度
    setMaxHeight(height) {
      //   // 方法2: 通过API
      const editor = tinymce.get(this.editorId);
      if (editor) {
        editor.settings.max_height = height;
        if (
          editor.plugins.autoresize &&
          editor.plugins.autoresize.resizeToContent
        ) {
          editor.plugins.autoresize.resizeToContent();
        }
      }
    },
    getText() {
      const plainText = tinymce.activeEditor.getContent({ format: 'text' });
      return plainText;
    }
  },
  watch: {
    value(newValue) {
      this.content = newValue;
    },
    content(newValue) {
      this.$emit('input', newValue);
    }
  }
};
</script>
<style lang="scss">
.tox-tinymce-aux {
  z-index: 9999 !important;
}
</style>
