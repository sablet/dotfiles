(function() {
  var MarkdownPreviewView, fs, isMarkdownPreviewView, mathjaxHelper, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  fs = require('fs-plus');

  MarkdownPreviewView = null;

  renderer = null;

  mathjaxHelper = null;

  isMarkdownPreviewView = function(object) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return object instanceof MarkdownPreviewView;
  };

  module.exports = {
    config: {
      breakOnSingleNewline: {
        type: 'boolean',
        "default": false,
        order: 0
      },
      liveUpdate: {
        type: 'boolean',
        "default": true,
        order: 10
      },
      openPreviewInSplitPane: {
        type: 'boolean',
        "default": true,
        order: 20
      },
      grammars: {
        type: 'array',
        "default": ['source.gfm', 'source.litcoffee', 'text.html.basic', 'text.md', 'text.plain', 'text.plain.null-grammar'],
        order: 30
      },
      enableLatexRenderingByDefault: {
        title: 'Enable Math Rendering By Default',
        type: 'boolean',
        "default": false,
        order: 40
      },
      useLazyHeaders: {
        title: 'Use Lazy Headers',
        description: 'Require no space after headings #',
        type: 'boolean',
        "default": true,
        order: 45
      },
      useGitHubStyle: {
        title: 'Use GitHub.com style',
        type: 'boolean',
        "default": false,
        order: 50
      },
      enablePandoc: {
        type: 'boolean',
        "default": false,
        title: 'Enable Pandoc Parser',
        order: 100
      },
      pandocPath: {
        type: 'string',
        "default": 'pandoc',
        title: 'Pandoc Options: Path',
        description: 'Please specify the correct path to your pandoc executable',
        dependencies: ['enablePandoc'],
        order: 110
      },
      pandocArguments: {
        type: 'array',
        "default": [],
        title: 'Pandoc Options: Commandline Arguments',
        description: 'Comma separated pandoc arguments e.g. `--smart, --filter=/bin/exe`. Please use long argument names.',
        dependencies: ['enablePandoc'],
        order: 120
      },
      pandocMarkdownFlavor: {
        type: 'string',
        "default": 'markdown-raw_tex+tex_math_single_backslash',
        title: 'Pandoc Options: Markdown Flavor',
        description: 'Enter the pandoc markdown flavor you want',
        dependencies: ['enablePandoc'],
        order: 130
      },
      pandocBibliography: {
        type: 'boolean',
        "default": false,
        title: 'Pandoc Options: Citations',
        description: 'Enable this for bibliography parsing',
        dependencies: ['enablePandoc'],
        order: 140
      },
      pandocRemoveReferences: {
        type: 'boolean',
        "default": true,
        title: 'Pandoc Options: Remove References',
        description: 'Removes references at the end of the HTML preview',
        dependencies: ['pandocBibliography'],
        order: 150
      },
      pandocBIBFile: {
        type: 'string',
        "default": 'bibliography.bib',
        title: 'Pandoc Options: Bibliography (bibfile)',
        description: 'Name of bibfile to search for recursivly',
        dependencies: ['pandocBibliography'],
        order: 160
      },
      pandocBIBFileFallback: {
        type: 'string',
        "default": '',
        title: 'Pandoc Options: Fallback Bibliography (bibfile)',
        description: 'Full path to fallback bibfile',
        dependencies: ['pandocBibliography'],
        order: 165
      },
      pandocCSLFile: {
        type: 'string',
        "default": 'custom.csl',
        title: 'Pandoc Options: Bibliography Style (cslfile)',
        description: 'Name of cslfile to search for recursivly',
        dependencies: ['pandocBibliography'],
        order: 170
      },
      pandocCSLFileFallback: {
        type: 'string',
        "default": '',
        title: 'Pandoc Options: Fallback Bibliography Style (cslfile)',
        description: 'Full path to fallback cslfile',
        dependencies: ['pandocBibliography'],
        order: 175
      }
    },
    activate: function() {
      var previewFile;
      if (parseFloat(atom.getVersion()) < 1.7) {
        atom.deserializers.add({
          name: 'MarkdownPreviewView',
          deserialize: module.exports.createMarkdownPreviewView.bind(module.exports)
        });
      }
      atom.commands.add('atom-workspace', {
        'markdown-preview-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'markdown-preview-plus:copy-html': (function(_this) {
          return function() {
            return _this.copyHtml();
          };
        })(this),
        'markdown-preview-plus:toggle-break-on-single-newline': function() {
          var keyPath;
          keyPath = 'markdown-preview-plus.breakOnSingleNewline';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        }
      });
      previewFile = this.previewFile.bind(this);
      atom.commands.add('.tree-view .file .name[data-name$=\\.markdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.md]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkd]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.ron]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.txt]', 'markdown-preview-plus:preview-file', previewFile);
      return atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var error, host, pathname, protocol, _ref;
          try {
            _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
          } catch (_error) {
            error = _error;
            return;
          }
          if (protocol !== 'markdown-preview-plus:') {
            return;
          }
          try {
            if (pathname) {
              pathname = decodeURI(pathname);
            }
          } catch (_error) {
            error = _error;
            return;
          }
          if (host === 'editor') {
            return _this.createMarkdownPreviewView({
              editorId: pathname.substring(1)
            });
          } else {
            return _this.createMarkdownPreviewView({
              filePath: pathname
            });
          }
        };
      })(this));
    },
    createMarkdownPreviewView: function(state) {
      if (state.editorId || fs.isFileSync(state.filePath)) {
        if (MarkdownPreviewView == null) {
          MarkdownPreviewView = require('./markdown-preview-view');
        }
        return new MarkdownPreviewView(state);
      }
    },
    toggle: function() {
      var editor, grammars, _ref, _ref1;
      if (isMarkdownPreviewView(atom.workspace.getActivePaneItem())) {
        atom.workspace.destroyActivePaneItem();
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (_ref = atom.config.get('markdown-preview-plus.grammars')) != null ? _ref : [];
      if (_ref1 = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref1) < 0) {
        return;
      }
      if (!this.removePreviewForEditor(editor)) {
        return this.addPreviewForEditor(editor);
      }
    },
    uriForEditor: function(editor) {
      return "markdown-preview-plus://editor/" + editor.id;
    },
    removePreviewForEditor: function(editor) {
      var preview, previewPane, uri;
      uri = this.uriForEditor(editor);
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane != null) {
        preview = previewPane.itemForURI(uri);
        if (preview !== previewPane.getActiveItem()) {
          previewPane.activateItem(preview);
          return false;
        }
        previewPane.destroyItem(preview);
        return true;
      } else {
        return false;
      }
    },
    addPreviewForEditor: function(editor) {
      var options, previousActivePane, uri;
      uri = this.uriForEditor(editor);
      previousActivePane = atom.workspace.getActivePane();
      options = {
        searchAllPanes: true
      };
      if (atom.config.get('markdown-preview-plus.openPreviewInSplitPane')) {
        options.split = 'right';
      }
      return atom.workspace.open(uri, options).then(function(markdownPreviewView) {
        if (isMarkdownPreviewView(markdownPreviewView)) {
          return previousActivePane.activate();
        }
      });
    },
    previewFile: function(_arg) {
      var editor, filePath, target, _i, _len, _ref;
      target = _arg.target;
      filePath = target.dataset.path;
      if (!filePath) {
        return;
      }
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (!(editor.getPath() === filePath)) {
          continue;
        }
        this.addPreviewForEditor(editor);
        return;
      }
      return atom.workspace.open("markdown-preview-plus://" + (encodeURI(filePath)), {
        searchAllPanes: true
      });
    },
    copyHtml: function(callback, scaleMath) {
      var editor, renderLaTeX, text;
      if (callback == null) {
        callback = atom.clipboard.write.bind(atom.clipboard);
      }
      if (scaleMath == null) {
        scaleMath = 100;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      if (renderer == null) {
        renderer = require('./renderer');
      }
      text = editor.getSelectedText() || editor.getText();
      renderLaTeX = atom.config.get('markdown-preview-plus.enableLatexRenderingByDefault');
      return renderer.toHTML(text, editor.getPath(), editor.getGrammar(), renderLaTeX, true, function(error, html) {
        if (error) {
          return console.warn('Copying Markdown as HTML failed', error);
        } else if (renderLaTeX) {
          if (mathjaxHelper == null) {
            mathjaxHelper = require('./mathjax-helper');
          }
          return mathjaxHelper.processHTMLString(html, function(proHTML) {
            proHTML = proHTML.replace(/MathJax\_SVG.*?font\-size\: 100%/g, function(match) {
              return match.replace(/font\-size\: 100%/, "font-size: " + scaleMath + "%");
            });
            return callback(proHTML);
          });
        } else {
          return callback(html);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tcHJldmlldy1wbHVzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFHQSxtQkFBQSxHQUFzQixJQUh0QixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLElBSlgsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsSUFMaEIsQ0FBQTs7QUFBQSxFQU9BLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxHQUFBOztNQUN0QixzQkFBdUIsT0FBQSxDQUFRLHlCQUFSO0tBQXZCO1dBQ0EsTUFBQSxZQUFrQixvQkFGSTtFQUFBLENBUHhCLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLENBRlA7T0FERjtBQUFBLE1BSUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxFQUZQO09BTEY7QUFBQSxNQVFBLHNCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLEVBRlA7T0FURjtBQUFBLE1BWUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0s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

//# sourceURL=/home/nikke/.atom/packages/markdown-preview-plus/lib/main.coffee
