<template>
  <div class="editor_root">
    <codemirror
      v-model="code"
      :options="cmOption"
      ref="myCmGenerate"
      @ready="$emit('onReady')"
      @focus="$emit('onFocus')"
      @input="(instance, obj) => $emit('onInput', { instance })"
    />
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
// require active-line.js
import 'codemirror/addon/selection/active-line.js';
// styleSelectedText
// import 'codemirror/addon/selection/mark-selection.js';
// hint
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint.js';
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/match-highlighter.js';
// keyMap
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/keymap/sublime.js';
// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
// 编辑的主题文件
import 'codemirror/theme/monokai.css';
// import 'codemirror/theme/base16-light.css';

import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/coffeescript/coffeescript.js';
import 'codemirror/mode/diff/diff.js';
import 'codemirror/mode/django/django.js';
import 'codemirror/mode/dockerfile/dockerfile.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/http/http.js';
import 'codemirror/mode/lua/lua.js';
import 'codemirror/mode/nginx/nginx.js';
import 'codemirror/mode/perl/perl.js';
import 'codemirror/mode/php/php.js';
import 'codemirror/mode/pig/pig.js';
import 'codemirror/mode/powershell/powershell.js';
import 'codemirror/mode/pug/pug.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/rpm/rpm.js';
import 'codemirror/mode/ruby/ruby.js';
import 'codemirror/mode/rust/rust.js';
import 'codemirror/mode/sass/sass.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/swift/swift.js';
import 'codemirror/mode/vue/vue.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/yaml/yaml.js';

export default {
  name: 'codemirror-editor',
  props: {
    defaultValue: {
      type: String,
      default: '',
    },
  },
  components: {
    codemirror,
  },
  watch: {
    defaultValue(v, o) {
      if (v) {
        this.code = v;
      }
    },
  },
  data() {
    return {
      code: '',
      cmOption: {
        tabSize: 4, // tab
        styleActiveLine: true, // 高亮选中行
        lineNumbers: true, // 显示行号
        // styleSelectedText: true,
        line: true,
        foldGutter: true, // 块槽
        lineWrapping: true,
        // lineWrapping: false,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        highlightSelectionMatches: {
          showToken: /\w/,
          annotateScrollbar: false,
        }, // 可以启用该选项来突出显示当前选中的内容的所有实例
        mode: {
          // 模式, 可查看 codemirror/mode 中的所有模式
          name: 'markdown',
          json: true,
        },
        // hint.js options
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: false,
        },
        // 快捷键 可提供三种模式 sublime、emacs、vim
        keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: 'monokai', // 主题
        extraKeys: { Ctrl: 'autocomplete' }, // 可以用于为编辑器指定额外的键绑定，以及keyMap定义的键绑定
      },
    };
  },
  mounted() {
    // this.code = this.defaultValue;
  },
};
</script>
<style lang="scss" scoped>
.editor_root {
  height: 100%;
  overflow: hidden;
  .vue-codemirror {
    height: 100%;
  }
  ::v-deep {
    .CodeMirror {
      height: 100%;
      font-size: 16px;
      line-height: 1.4em;
    }
    .CodeMirror-focused .cm-matchhighlight {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
      background-position: bottom;
      background-repeat: repeat-x;
    }
    .cm-matchhighlight {
      background-color: lightgreen;
    }
    .CodeMirror-selection-highlight-scrollbar {
      background-color: green;
    }
    .CodeMirror-code {
      span,
      pre {
        // white-space: pre-wrap;
      }
    }
  }
}
</style>
