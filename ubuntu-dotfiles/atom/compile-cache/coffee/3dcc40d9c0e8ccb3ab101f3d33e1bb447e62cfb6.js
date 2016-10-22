(function() {
  var $, Point, Range, SymbolsContextMenu, SymbolsTreeView, TagGenerator, TagParser, TreeView, View, jQuery, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, jQuery = _ref1.jQuery, View = _ref1.View;

  TreeView = require('./tree-view').TreeView;

  TagGenerator = require('./tag-generator');

  TagParser = require('./tag-parser');

  SymbolsContextMenu = require('./symbols-context-menu');

  module.exports = SymbolsTreeView = (function(_super) {
    __extends(SymbolsTreeView, _super);

    function SymbolsTreeView() {
      return SymbolsTreeView.__super__.constructor.apply(this, arguments);
    }

    SymbolsTreeView.content = function() {
      return this.div({
        "class": 'symbols-tree-view tool-panel focusable-panel'
      });
    };

    SymbolsTreeView.prototype.initialize = function() {
      this.treeView = new TreeView;
      this.append(this.treeView);
      this.cachedStatus = {};
      this.contextMenu = new SymbolsContextMenu;
      this.autoHideTypes = atom.config.get('symbols-tree-view.zAutoHideTypes');
      this.treeView.onSelect((function(_this) {
        return function(_arg) {
          var bottom, desiredScrollCenter, desiredScrollTop, done, editor, from, height, item, left, node, screenPosition, screenRange, step, to, top, width, _ref2;
          node = _arg.node, item = _arg.item;
          if (item.position.row >= 0 && (editor = atom.workspace.getActiveTextEditor())) {
            screenPosition = editor.screenPositionForBufferPosition(item.position);
            screenRange = new Range(screenPosition, screenPosition);
            _ref2 = editor.pixelRectForScreenRange(screenRange), top = _ref2.top, left = _ref2.left, height = _ref2.height, width = _ref2.width;
            bottom = top + height;
            desiredScrollCenter = top + height / 2;
            if (!((editor.getScrollTop() < desiredScrollCenter && desiredScrollCenter < editor.getScrollBottom()))) {
              desiredScrollTop = desiredScrollCenter - editor.getHeight() / 2;
            }
            from = {
              top: editor.getScrollTop()
            };
            to = {
              top: desiredScrollTop
            };
            step = function(now) {
              return editor.setScrollTop(now);
            };
            done = function() {
              editor.scrollToBufferPosition(item.position, {
                center: true
              });
              editor.setCursorBufferPosition(item.position);
              return editor.moveToFirstCharacterOfLine();
            };
            return jQuery(from).animate(to, {
              duration: _this.animationDuration,
              step: step,
              done: done
            });
          }
        };
      })(this));
      atom.config.observe('symbols-tree-view.scrollAnimation', (function(_this) {
        return function(enabled) {
          return _this.animationDuration = enabled ? 300 : 0;
        };
      })(this));
      this.minimalWidth = 5;
      this.originalWidth = atom.config.get('symbols-tree-view.defaultWidth');
      return atom.config.observe('symbols-tree-view.autoHide', (function(_this) {
        return function(autoHide) {
          if (!autoHide) {
            return _this.width(_this.originalWidth);
          } else {
            return _this.width(_this.minimalWidth);
          }
        };
      })(this));
    };

    SymbolsTreeView.prototype.getEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    SymbolsTreeView.prototype.getScopeName = function() {
      var _ref2, _ref3;
      return (_ref2 = atom.workspace.getActiveTextEditor()) != null ? (_ref3 = _ref2.getGrammar()) != null ? _ref3.scopeName : void 0 : void 0;
    };

    SymbolsTreeView.prototype.populate = function() {
      var editor, filePath;
      if (!(editor = this.getEditor())) {
        return this.hide();
      } else {
        filePath = editor.getPath();
        this.generateTags(filePath);
        this.show();
        this.onEditorSave = editor.onDidSave((function(_this) {
          return function(state) {
            filePath = editor.getPath();
            return _this.generateTags(filePath);
          };
        })(this));
        return this.onChangeRow = editor.onDidChangeCursorPosition((function(_this) {
          return function(_arg) {
            var newBufferPosition, oldBufferPosition;
            oldBufferPosition = _arg.oldBufferPosition, newBufferPosition = _arg.newBufferPosition;
            if (oldBufferPosition.row !== newBufferPosition.row) {
              return _this.focusCurrentCursorTag();
            }
          };
        })(this));
      }
    };

    SymbolsTreeView.prototype.focusCurrentCursorTag = function() {
      var editor, row, tag;
      if (editor = this.getEditor()) {
        row = editor.getCursorBufferPosition().row;
        tag = this.parser.getNearestTag(row);
        return this.treeView.select(tag);
      }
    };

    SymbolsTreeView.prototype.focusClickedTag = function(editor, text) {
      var t, tag;
      console.log("clicked: " + text);
      if (editor = this.getEditor()) {
        tag = ((function() {
          var _i, _len, _ref2, _results;
          _ref2 = this.parser.tags;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            t = _ref2[_i];
            if (t.name === text) {
              _results.push(t);
            }
          }
          return _results;
        }).call(this))[0];
        this.treeView.select(tag);
        return jQuery('.list-item.list-selectable-item.selected').click();
      }
    };

    SymbolsTreeView.prototype.updateContextMenu = function(types) {
      var editor, toggleSortByName, toggleTypeVisible, type, visible, _i, _j, _len, _len1, _ref2, _ref3, _ref4, _ref5;
      this.contextMenu.clear();
      editor = (_ref2 = this.getEditor()) != null ? _ref2.id : void 0;
      toggleTypeVisible = (function(_this) {
        return function(type) {
          _this.treeView.toggleTypeVisible(type);
          return _this.nowTypeStatus[type] = !_this.nowTypeStatus[type];
        };
      })(this);
      toggleSortByName = (function(_this) {
        return function() {
          var type, visible, _ref3;
          _this.nowSortStatus[0] = !_this.nowSortStatus[0];
          if (_this.nowSortStatus[0]) {
            _this.treeView.sortByName();
          } else {
            _this.treeView.sortByRow();
          }
          _ref3 = _this.nowTypeStatus;
          for (type in _ref3) {
            visible = _ref3[type];
            if (!visible) {
              _this.treeView.toggleTypeVisible(type);
            }
          }
          return _this.focusCurrentCursorTag();
        };
      })(this);
      if (this.cachedStatus[editor]) {
        _ref3 = this.cachedStatus[editor], this.nowTypeStatus = _ref3.nowTypeStatus, this.nowSortStatus = _ref3.nowSortStatus;
        _ref4 = this.nowTypeStatus;
        for (type in _ref4) {
          visible = _ref4[type];
          if (!visible) {
            this.treeView.toggleTypeVisible(type);
          }
        }
        if (this.nowSortStatus[0]) {
          this.treeView.sortByName();
        }
      } else {
        this.cachedStatus[editor] = {
          nowTypeStatus: {},
          nowSortStatus: [false]
        };
        for (_i = 0, _len = types.length; _i < _len; _i++) {
          type = types[_i];
          this.cachedStatus[editor].nowTypeStatus[type] = true;
        }
        this.sortByNameScopes = atom.config.get('symbols-tree-view.sortByNameScopes');
        if (this.sortByNameScopes.indexOf(this.getScopeName()) !== -1) {
          this.cachedStatus[editor].nowSortStatus[0] = true;
          this.treeView.sortByName();
        }
        _ref5 = this.cachedStatus[editor], this.nowTypeStatus = _ref5.nowTypeStatus, this.nowSortStatus = _ref5.nowSortStatus;
      }
      for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
        type = types[_j];
        this.contextMenu.addMenu(type, this.nowTypeStatus[type], toggleTypeVisible);
      }
      this.contextMenu.addSeparator();
      return this.contextMenu.addMenu('sort by name', this.nowSortStatus[0], toggleSortByName);
    };

    SymbolsTreeView.prototype.generateTags = function(filePath) {
      return new TagGenerator(filePath, this.getScopeName()).generate().done((function(_this) {
        return function(tags) {
          var root, type, types, _i, _len, _ref2, _results;
          _this.parser = new TagParser(tags, _this.getScopeName());
          _ref2 = _this.parser.parse(), root = _ref2.root, types = _ref2.types;
          _this.treeView.setRoot(root);
          _this.updateContextMenu(types);
          _this.focusCurrentCursorTag();
          if (_this.autoHideTypes) {
            _results = [];
            for (_i = 0, _len = types.length; _i < _len; _i++) {
              type = types[_i];
              if (_this.autoHideTypes.indexOf(type) !== -1) {
                _this.treeView.toggleTypeVisible(type);
                _results.push(_this.contextMenu.toggle(type));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      })(this));
    };

    SymbolsTreeView.prototype.serialize = function() {};

    SymbolsTreeView.prototype.destroy = function() {
      return this.element.remove();
    };

    SymbolsTreeView.prototype.attach = function() {
      if (atom.config.get('tree-view.showOnRightSide')) {
        this.panel = atom.workspace.addLeftPanel({
          item: this
        });
      } else {
        this.panel = atom.workspace.addRightPanel({
          item: this
        });
      }
      this.contextMenu.attach();
      return this.contextMenu.hide();
    };

    SymbolsTreeView.prototype.attached = function() {
      this.onChangeEditor = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          _this.removeEventForEditor();
          return _this.populate();
        };
      })(this));
      this.onChangeAutoHide = atom.config.observe('symbols-tree-view.autoHide', (function(_this) {
        return function(autoHide) {
          if (!autoHide) {
            return _this.off('mouseenter mouseleave');
          } else {
            _this.mouseenter(function(event) {
              _this.stop();
              return _this.animate({
                width: _this.originalWidth
              }, {
                duration: _this.animationDuration
              });
            });
            return _this.mouseleave(function(event) {
              _this.stop();
              if (atom.config.get('tree-view.showOnRightSide')) {
                if (event.offsetX > 0) {
                  return _this.animate({
                    width: _this.minimalWidth
                  }, {
                    duration: _this.animationDuration
                  });
                }
              } else {
                if (event.offsetX <= 0) {
                  return _this.animate({
                    width: _this.minimalWidth
                  }, {
                    duration: _this.animationDuration
                  });
                }
              }
            });
          }
        };
      })(this));
      return this.on("contextmenu", (function(_this) {
        return function(event) {
          var left;
          left = event.pageX;
          if (left + _this.contextMenu.width() > atom.getSize().width) {
            left = left - _this.contextMenu.width();
          }
          _this.contextMenu.css({
            left: left,
            top: event.pageY
          });
          _this.contextMenu.show();
          return false;
        };
      })(this));
    };

    SymbolsTreeView.prototype.removeEventForEditor = function() {
      var _ref2, _ref3;
      if ((_ref2 = this.onEditorSave) != null) {
        _ref2.dispose();
      }
      return (_ref3 = this.onChangeRow) != null ? _ref3.dispose() : void 0;
    };

    SymbolsTreeView.prototype.detached = function() {
      var _ref2, _ref3;
      if ((_ref2 = this.onChangeEditor) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.onChangeAutoHide) != null) {
        _ref3.dispose();
      }
      this.removeEventForEditor();
      return this.off("contextmenu");
    };

    SymbolsTreeView.prototype.remove = function() {
      SymbolsTreeView.__super__.remove.apply(this, arguments);
      return this.panel.destroy();
    };

    SymbolsTreeView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.remove();
      } else {
        this.populate();
        return this.attach();
      }
    };

    SymbolsTreeView.prototype.showView = function() {
      if (!this.hasParent()) {
        this.populate();
        return this.attach();
      }
    };

    SymbolsTreeView.prototype.hideView = function() {
      if (this.hasParent()) {
        return this.remove();
      }
    };

    return SymbolsTreeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvc3ltYm9scy10cmVlLXZpZXcvbGliL3N5bWJvbHMtdHJlZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSEFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLFFBQW9CLE9BQUEsQ0FBUSxzQkFBUixDQUFwQixFQUFDLFVBQUEsQ0FBRCxFQUFJLGVBQUEsTUFBSixFQUFZLGFBQUEsSUFEWixDQUFBOztBQUFBLEVBRUMsV0FBWSxPQUFBLENBQVEsYUFBUixFQUFaLFFBRkQsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FIZixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUxyQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDhDQUFQO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw4QkFHQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEdBQUEsQ0FBQSxRQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBQyxDQUFBLFFBQVQsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsWUFBRCxH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

//# sourceURL=/home/nikke/.atom/packages/symbols-tree-view/lib/symbols-tree-view.coffee
