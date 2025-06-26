<template>
  <div class="tinymce-box">
    <Editor
        id="myedit"
        v-model="content"
        :init="init"
        tag-name="div"
        :disabled="disabled"
        @onClick="onClick"
    />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';

import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';

import 'tinymce/plugins/image';

import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import '@/components/TEditor/tinymce/ax_wordlimit/plugin.js';

export default {
  name: 'TEditor',
  components: {
    Editor,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
          'link image table media lists fullscreen quickbars wordcount code ax_wordlimit',
    },
    toolbar: {
      type: [String, Array],
      default:
          'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat | wordcount | code',
    },
    height: {
      type: Number,
      default: 500,
    },
  },
  emits: {'update:modelValue': null},
  setup(props, context) {
    const init = {
      language_url: '/tinymce/langs/zh_CN.js',
      language: 'zh_CN',

      skin_url: '/tinymce/skins/ui/oxide',
      plugins: props.plugins,
      toolbar: props.toolbar,
      toolbar_mode: 'sliding',
      menubar: 'file edit insert view format table tools',
      menu: {

        edit: {title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall'},
        insert: {title: '插入', items: 'link image  |  hr'},
        view: {title: '查看', items: 'visualaid'},
      },
      fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',
      font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',

      ax_wordlimit_num: 40,
      ax_wordlimit_callback: function (editor, txt, num) {
        console.log('当前字数：' + txt.length + '，限制字数：' + num);
      },
      height: props.height,
      placeholder: '在这里输入文字',
      branding: false,
      resize: false,
      statusbar: true,
      elementpath: false,

      content_style: 'img {max-width:100%;}',
      content_css: '/tinymce/skins/content/default/content.css',
      images_upload_handler: (blobInfo, success, failure) => {
        const img = 'data:image/jpeg;base64,' + blobInfo.base64();
        success(img);
      },
    };
    tinymce.init;

    const revert_data = content => {
      context.emit('update:modelValue', content);
    };

    function onClick(e) {
      this.$emit('onClick', e, tinymce);
    }

    function clear() {
      content.value = '';
    }

    const setEditMode = type => {
      tinymce.editors['myedit'].setMode(type);
    };
    const content = ref();
    watch(
        () => props.modelValue,
        (initInfo, prevInitInfo) => {
          content.value = props.modelValue;
        },
    );
    watch(
        () => content.value,
        (initInfo, prevInitInfo) => {
          revert_data(content);
        },
    );
    onMounted(() => {
      tinymce.init;
      content.value = props.modelValue;

    });
    return {
      content,
      init,
      revert_data,
      onClick,
      clear,
      setEditMode,
    };
  },
};
</script>
