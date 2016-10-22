(function() {
  var $$, SelectListView, UsagesView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  path = require('path');

  module.exports = UsagesView = (function(_super) {
    __extends(UsagesView, _super);

    function UsagesView() {
      return UsagesView.__super__.constructor.apply(this, arguments);
    }

    UsagesView.prototype.initialize = function(matches) {
      UsagesView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for usages');
      return this.focusFilterEditor();
    };

    UsagesView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    UsagesView.prototype.viewForItem = function(_arg) {
      var column, fileName, line, moduleName, name, relativePath, _, _ref1;
      name = _arg.name, moduleName = _arg.moduleName, fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      _ref1 = atom.project.relativizePath(fileName), _ = _ref1[0], relativePath = _ref1[1];
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div("" + name, {
              "class": 'primary-line'
            });
            return _this.div("" + relativePath + ", line " + line, {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    UsagesView.prototype.getFilterKey = function() {
      return 'fileName';
    };

    UsagesView.prototype.scrollToItemView = function() {
      var column, editor, fileName, line, moduleName, name, _ref1;
      UsagesView.__super__.scrollToItemView.apply(this, arguments);
      _ref1 = this.getSelectedItem(), name = _ref1.name, moduleName = _ref1.moduleName, fileName = _ref1.fileName, line = _ref1.line, column = _ref1.column;
      editor = atom.workspace.getActiveTextEditor();
      if (editor.getBuffer().file.path === fileName) {
        editor.setSelectedBufferRange([[line - 1, column], [line - 1, column + name.length]]);
        return editor.scrollToBufferPosition([line - 1, column], {
          center: true
        });
      }
    };

    UsagesView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No usages found';
      } else {
        return UsagesView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    UsagesView.prototype.confirmed = function(_arg) {
      var column, fileName, line, moduleName, name, promise;
      name = _arg.name, moduleName = _arg.moduleName, fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      this.cancelPosition = null;
      this.cancel();
      promise = atom.workspace.open(fileName);
      return promise.then(function(editor) {
        editor.setCursorBufferPosition([line - 1, column]);
        editor.setSelectedBufferRange([[line - 1, column], [line - 1, column + name.length]]);
        return editor.scrollToCursorPosition();
      });
    };

    UsagesView.prototype.cancelled = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return UsagesView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvdXNhZ2VzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDVixNQUFBLDRDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELENBQVUsY0FBVixDQUZBLENBQUE7O1FBR0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQUhWO0FBQUEsTUFJQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxVQUFELENBQVksb0JBQVosQ0FMQSxDQUFBO2FBTUEsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFQVTtJQUFBLENBQVosQ0FBQTs7QUFBQSx5QkFTQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLEVBRk87SUFBQSxDQVRULENBQUE7O0FB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

//# sourceURL=/home/nikke/.atom/packages/autocomplete-python/lib/usages-view.coffee
