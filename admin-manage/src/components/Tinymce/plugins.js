// Any plugins you want to use has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/
// powerpaste 这个暂时不加
const plugins = [
  "advlist anchor placeholder autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars ",
];
// wordcount

export default plugins;

export const addPlaceHolder = (tinymce) => {
  // console.log('tinymce', tinymce)
  tinymce.PluginManager.add("placeholder", function (editor) {
    editor.on("init", function () {
      const label = new Label();

      onBlur();

      tinymce.DOM.bind(label.el, "click", onFocus);
      editor.on("focus", onFocus);
      editor.on("blur", onBlur);
      editor.on("change", onBlur);
      editor.on("setContent", onBlur);
      editor.on("keydown", onKeydown);

      function onFocus() {
        if (!editor.settings.readonly === true) {
          label.hide();
        }
        editor.execCommand("mceFocus", false);
      }

      function onBlur() {
        if (editor.getContent() == "") {
          label.show();
        } else {
          label.hide();
        }
      }

      function onKeydown() {
        label.hide();
      }
    });

    const Label = function () {
      const placeholder_text =
        editor.getElement().getAttribute("placeholder") ||
        editor.settings.placeholder;
      const placeholder_attrs = editor.settings.placeholder_attrs || {
        style: {
          position: "absolute",
          top: "5px",
          left: 0,
          color: "#888",
          padding: "1%",
          width: "98%",
          overflow: "hidden",
          "white-space": "pre-wrap",
        },
      };
      const contentAreaContainer = editor.getContentAreaContainer();

      tinymce.DOM.setStyle(contentAreaContainer, "position", "relative");

      // Create label el
      this.el = tinymce.DOM.add(
        contentAreaContainer,
        editor.settings.placeholder_tag || "label",
        placeholder_attrs,
        placeholder_text
      );
    };

    Label.prototype.hide = function () {
      tinymce.DOM.setStyle(this.el, "display", "none");
    };

    Label.prototype.show = function () {
      tinymce.DOM.setStyle(this.el, "display", "");
    };
  });
};
