(function() {
  var $$, OverrideView, SelectListView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  path = require('path');

  module.exports = OverrideView = (function(_super) {
    __extends(OverrideView, _super);

    function OverrideView() {
      return OverrideView.__super__.constructor.apply(this, arguments);
    }

    OverrideView.prototype.initialize = function(matches) {
      OverrideView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for methods');
      this.focusFilterEditor();
      this.indent = 0;
      return this.bufferPosition = null;
    };

    OverrideView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    OverrideView.prototype.viewForItem = function(_arg) {
      var column, fileName, line, moduleName, name, params, parent, relativePath, _, _ref1;
      parent = _arg.parent, name = _arg.name, params = _arg.params, moduleName = _arg.moduleName, fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      if (!line) {
        return $$(function() {
          return this.li({
            "class": 'two-lines'
          }, (function(_this) {
            return function() {
              _this.div("" + parent + "." + name, {
                "class": 'primary-line'
              });
              return _this.div('builtin', {
                "class": 'secondary-line'
              });
            };
          })(this));
        });
      } else {
        _ref1 = atom.project.relativizePath(fileName), _ = _ref1[0], relativePath = _ref1[1];
        return $$(function() {
          return this.li({
            "class": 'two-lines'
          }, (function(_this) {
            return function() {
              _this.div("" + parent + "." + name, {
                "class": 'primary-line'
              });
              return _this.div("" + relativePath + ", line " + line, {
                "class": 'secondary-line'
              });
            };
          })(this));
        });
      }
    };

    OverrideView.prototype.getFilterKey = function() {
      return 'name';
    };

    OverrideView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No methods found';
      } else {
        return OverrideView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    OverrideView.prototype.confirmed = function(_arg) {
      var column, editor, instance, line, line1, line2, name, params, parent, superCall, tabLength, tabText, userIndent;
      parent = _arg.parent, instance = _arg.instance, name = _arg.name, params = _arg.params, line = _arg.line, column = _arg.column;
      this.cancelPosition = null;
      this.cancel();
      editor = atom.workspace.getActiveTextEditor();
      tabLength = editor.getTabLength();
      line1 = "def " + name + "(" + (['self'].concat(params).join(', ')) + "):";
      superCall = "super(" + instance + ", self)." + name + "(" + (params.join(', ')) + ")";
      if (name === '__init__') {
        line2 = "" + superCall;
      } else {
        line2 = "return " + superCall;
      }
      if (this.indent < 1) {
        tabText = editor.getTabText();
        editor.insertText("" + tabText + line1);
        editor.insertNewlineBelow();
        return editor.setTextInBufferRange([[this.bufferPosition.row + 1, 0], [this.bufferPosition.row + 1, tabLength * 2]], "" + tabText + tabText + line2);
      } else {
        userIndent = editor.getTextInRange([[this.bufferPosition.row, 0], [this.bufferPosition.row, this.bufferPosition.column]]);
        editor.insertText("" + line1);
        editor.insertNewlineBelow();
        return editor.setTextInBufferRange([[this.bufferPosition.row + 1, 0], [this.bufferPosition.row + 1, tabLength * 2]], "" + userIndent + userIndent + line2);
      }
    };

    OverrideView.prototype.cancelled = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return OverrideView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvb3ZlcnJpZGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDJCQUFBLFVBQUEsR0FBWSxTQUFDLE9BQUQsR0FBQTtBQUNWLE1BQUEsOENBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFWLENBRkEsQ0FBQTs7UUFHQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BSFY7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxxQkFBWixDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBTkEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQVBWLENBQUE7YUFRQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQVRSO0lBQUEsQ0FBWixDQUFBOztBQUFBLDJCQVdBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMs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

//# sourceURL=/home/nikke/.atom/packages/autocomplete-python/lib/override-view.coffee
