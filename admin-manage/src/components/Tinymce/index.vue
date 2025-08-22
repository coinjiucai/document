<template>
  <div
    ref="tinymceContainer"
    :class="{ fullscreen: fullscreen, hidden: hidden, disabled: disabled }"
    :style="{ width: containerWidth }"
    class="tinymce-container"
  >
    <textarea
      :id="tinymceId"
      class="tinymce-textarea"
      :placeholder="placeholder"
    />
    <!-- <div v-show="needImage" class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div> -->
    <el-image-viewer
      v-if="imgViewerVisible && imageList.length"
      :initial-index="dblclickImageIndex"
      :preview-src-list="imageList"
      :on-close="closeViewer"
      :url-list="imageList"
    />
    <!-- <div class="wordCount">{{ wordLength }}字</div> -->
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
// import editorImage from './components/EditorImage'
import plugins, { addPlaceHolder } from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";
import { mapMutations } from "vuex";

// import powerpaster from "./plugins/powerpaste/plugin.min.js";

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// 七牛cdn
// const tinymceCDN = 'https://cdn.staticfile.org/tinymce/4.9.5/tinymce.min.js'
const tinymceCDN = "https://cdn.staticfile.org/tinymce/4.9.5/tinymce.min.js";

import api from "@/api";
import { debounce, isUndefined } from "lodash";
const reg = /(\/|http)[^>]+\.(jpg|jpeg|png|gif)/g;
export default {
  name: "Tinymce",
  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer"),
  },
  props: {
    // id: {
    //   type: String,
    //   default: function () {
    //     return (
    //       'vue-tinymce-' +
    //       +new Date() +
    //       ((Math.random() * 1000).toFixed(0) + '')
    //     )
    //   }
    // },
    value: {
      type: String,
      default: "",
    },
    renewFlag: {
      type: Number,
      default: 0,
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    maxHeight: {
      type: [Number, String],
      required: false,
      default: 600,
    },
    fixHeight: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
    needImage: {
      type: Boolean,
      default: true,
    },
    selfPlugins: {
      type: Array,
      default: null,
    },
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    formHeadId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId:
        "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""),
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja",
      },
      dblclickImage: "", // 被双击的图片
      imgViewerVisible: false,
      wordLength: 0,
      id:
        "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""),
      erpCls: "",
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },

    imageList() {
      return this.value.match(reg);
    },
    dblclickImageIndex() {
      // 被双击的图片在数组中的索引
      let index = this.imageList?.indexOf(
        decodeURIComponent(this.dblclickImage)
      );
      if (index === -1 || isUndefined(index)) {
        index = this.imageList?.indexOf(this.dblclickImage);
      }
      return index;
    },
  },
  watch: {
    // value(val) {
    //   if (!this.hasChange && this.hasInit) {
    //     this.$nextTick(() =>
    //       window.tinymce.get(this.tinymceId).setContent(val || '')
    //     )
    //   }
    // },
    // 修改前的代码在上面，由于要实现图片分页预览功能，需要在获取到value时提取中所有图片src，必须深度监测
    value: {
      handler(val) {
        if (!this.hasChange && this.hasInit) {
          this.debounceUpdateContent();
        }
      },
      deep: true,
      immediate: true,
    },
    // 绑定的变量直接换成其他值  尽管改watch中value的句柄也可以实现  但那是作者原来的代码  我不敢随便动
    renewFlag() {
      if (this.hasInit) {
        this.debounceUpdateContent();
      }
    },
  },
  created() {
    this.dload = debounce(() => this.reload(), 200);
    this.reloadcb = () => this.dload();
    this.$eventBus.$on("reload-tinymce", this.reloadcb);
    this.setErpCls();
    this.debounceUpdateContent = debounce(() => this.updateContent(), 200);
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
    this.$eventBus.$off("reload-tinymce", this.reloadcb);
  },
  inject: {
    getAppId: { value: "getAppId", default: () => undefined },
  },
  methods: {
    ...mapMutations("cacheApi", ["SET_UPLOAD_IMG"]),
    reload() {
      try {
        this.destroyTinymce();
        this.init();
      } catch (e) {
        console.log("fail");
      }
    },

    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message);
          return;
        }

        addPlaceHolder(window.tinymce);
        this.$nextTick(() => {
          this.initTinymce();
        });
      });
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: "zh_CN",
        language_url: require("./zh_CN.js"),
        height: this.height,
        body_class: `panel-body ${this.erpCls}`,
        object_resizing: true,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,

        mobile: {
          theme: "mobile",
          plugins: ["autosave", "lists", "autolink"],
          toolbar: [
            "bold",
            "italic",
            "underline",
            "image",
            "fontsizeselect",
            "numlist",
            "bullist",
          ],
        },
        // plugins: [
        //   "powerpaste", // plugins中，用powerpaste替换原来的paste
        // ],
        // powerpaste_word_import: 'clean',
        // start 添加扩展插件
        // external_plugins: {
        //   powerpaste: "/powerpaste/plugin.min.js",
        // },
        plugins: this.selfPlugins ? this.selfPlugins : plugins,
        // powerpaste_word_import: "propmt", // 参数可以是 propmt, merge, clear
        // powerpaste_html_import: "propmt", // propmt, merge, clear
        // powerpaste_allow_local_images: true, // 允许带图片
        paste_data_images: true,
        // end
        end_container_on_empty_block: true,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        readonly: this.disabled || this.readonly,
        hidden: this.hidden,
        fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 36pt",
        font_formats:
          "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        // style_formats: [
        //   {
        //     title: 'Line Height',
        //     items: [
        //       { title: '1', block: 'p', styles: { 'line-height': '1.0' } },
        //       { title: '1.5', block: 'p', styles: { 'line-height': '1.5' } },
        //       { title: '1.75', block: 'p', styles: { 'line-height': '1.75' } },
        //       { title: '2', block: 'p', styles: { 'line-height': '2' } },
        //       { title: '3', block: 'p', styles: { 'line-height': '3' } },
        //       { title: '4', block: 'p', styles: { 'line-height': '4' } },
        //       { title: '5', block: 'p', styles: { 'line-height': '5' } }
        //     ]
        //   }
        // ],
        content_style: `.mce-content-body img { max-width: calc(100% - 16px);margin: 0 8px;height:auto; }body {font-size: 12pt;} .mce-content-body p {line-height:1.5;margin-top: 5px;margin-bottom:5px;} .mce-content-body.is-erpActive p { font-size: 12px;}`,
        style_formats_merge: false, // 此选项可以设置TinyMCE,是将style_formats设置中的样式附加到默认样式格式还是完全替换它们
        style_formats_autohide: true, //（隐藏当前不可用的样式列表）
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            const textContent = editor.getContent({ format: "text" });
            const content = editor.getContent();
            this.$emit("input", content);
            this.$emit("inputText", textContent);
            this.$emit("change", content);
            this.wordLength = textContent.trim().length;
          });
          editor.on("focus", () => {
            this.setScrollStyle("#fff");
            this.$emit("onFocus");
          });
          editor.on("blur", () => {
            this.setScrollStyle();
            this.$emit("onBlur");
          });
          // 图片双击事件
          editor.on("dblclick", () => {
            const src = editor.selection.getNode().src || "";
            // 防止点击非img标签时报错
            if (!src) return;
            this.dblclickImage = src;
            this.imgViewerVisible = true;
          });
          this.setScrollStyle();
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", (e) => {
            _this.fullscreen = e.state;
          });
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        images_upload_handler: async (blobInfo, success, failure, progress) => {
          const blob = blobInfo.blob();
          const filename = blob.name;
          if (filename && filename.length > 100) {
            failure("文件名字数不能超过100");
            return;
          }
          const fd = new FormData();
          fd.append("file", blob);
          try {
            const {
              data: { result = {}, success: successStatus, message },
            } = await api.globalAPI.fileUpload(
              "/mlf-csjm-service/file/upload",
              fd
            );
            if (successStatus) {
              console.log("result", result);
              success(result[0].fileUrl);
            } else {
              failure(message || "出现未知问题，刷新页面，或者联系程序员");
            }
            const inputContainer =
              document.querySelectorAll(".mce-browsebutton");
            for (const element of inputContainer) {
              const child = element.children;
              for (const element of child) {
                const tagName = element.tagName;
                const type = element.type;
                if (tagName === "INPUT" && type === "file") {
                  element.value = "";
                }
              }
            }
          } catch (error) {
            failure(error.message || "出现未知问题，刷新页面，或者联系程序员");
            // _this.$commonFunc.alertError(error)
          }
          _this?.emitInputRelative?.();
        },
      });
    },
    setScrollStyle(color = "transparent") {
      const container = this.$refs.tinymceContainer;
      const domIfr = container.querySelector("iframe");
      if (!domIfr) return;
      const documentIfr = domIfr.contentDocument;
      const headDom = documentIfr.querySelector("head");
      let scrollStyle = `
        <style css-id="scroll">
          body {
            background-color: ${color};
            color: #16191D;
          }
          ::-webkit-scrollbar{
            width: 7px;
            height: 7px;
          }

          ::-webkit-scrollbar-thumb{
            border-radius: 1em;
            background-color: #D8D8D8;
          }

          ::-webkit-scrollbar-track{
            border-radius: 1em;
            background-color: #fff;
          }
        </style>
      `;
      let div = documentIfr.createElement("div");
      let _scrollNode = documentIfr.querySelector("[css-id='scroll']") || null;
      if (_scrollNode) {
        headDom.removeChild(_scrollNode);
      }
      div.innerHTML = scrollStyle;
      let newScrollNode = div.querySelector("[css-id='scroll']");
      headDom.appendChild(newScrollNode);
      if (!this.fixHeight) {
        this.setContentHeight(domIfr);
      }
    },
    setContentHeight(iframe) {
      if (iframe) {
        const win =
          iframe?.contentWindow || iframe.contentDocument?.parentWindow;
        const body = win?.document?.body;
        if (body) {
          let height;
          // 删除内容的情况
          if (parseInt(body.offsetHeight) < this.maxHeight * 0.75) {
            height = body.offsetHeight;
          } else {
            height =
              win.document.documentElement.scrollHeight || body.scrollHeight;
          }
          height = Math.min(height, this.maxHeight);
          iframe.style.height = `${height}px`;

          // 二次加载，解决大内存图片的大部分场景高度初始化问题
          if (this.iframeTImer) {
            clearTimeout(this.iframeTImer);
          }
          this.iframeTImer = setTimeout(() => {
            this.setContentHeight(iframe);
          }, 500);
        }
      }
    },
    destroyTinymce() {
      let tinymce = null;
      if (window.tinymce) {
        tinymce = window.tinymce.get(this.tinymceId);
      }
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    updateContent() {
      this.setContent(this.value);
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },

    emitInputRelative() {
      const editor = window.tinymce.get(this.tinymceId);
      const textContent = editor?.getContent({ format: "text" });
      const content = editor?.getContent();
      this.$emit("input", content);
      this.$emit("inputText", textContent);
      this.$emit("change", content);
    },

    imageSuccessCBK(arr) {
      arr.forEach((v) =>
        window.tinymce
          .get(this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`)
      );
    },
    closeViewer() {
      this.imgViewerVisible = false;
    },
    setErpCls() {
      const bodyEl = document.querySelector("body");
      if (bodyEl) {
        this.erpCls = bodyEl.classList.contains("is-erpActive")
          ? "is-erpActive"
          : "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/scrollBar.scss";
.hidden {
  display: none;
}
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
    // .mce-container.mce-edit-area {
    //   height: 300px;
    //   overflow-y: auto;
    //   &:extend(.scrollBar all);
    // }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
::v-deep .mce-btn-group > div {
  display: flex !important;
  flex-wrap: wrap !important;
}
::v-deep .mce-statusbar .mce-container-body {
  display: none;
}
::v-deep .mce-tinymce {
  width: unset !important;
  border-color: #dadbdd;
  box-shadow: unset;
  border-radius: 2px;
  .mce-edit-area {
    iframe {
      min-height: 90px !important;
      // height: auto !important;
      background-color: #f5f6f8;
    }
    &:hover {
      iframe,
      label {
        background-color: #ebebec;
      }
    }
  }
}
.wordCount {
  padding: 5px 10px;
  border: 1px solid #dadbdd;
  border-top: unset;
  text-align: right;
}
::v-deep .mce-panel {
  border: 0 solid #dadbdd;
  border-bottom: 0px;
  // border-bottom-width: 0 !important;
}
.tinymce-container {
  .mce-edit-area {
    label {
      top: 0 !important;
      padding: 0 !important;
    }
  }
}
</style>
