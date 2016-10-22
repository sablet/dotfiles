(function() {
  var $$, DefinitionsView, SelectListView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  path = require('path');

  module.exports = DefinitionsView = (function(_super) {
    __extends(DefinitionsView, _super);

    function DefinitionsView() {
      return DefinitionsView.__super__.constructor.apply(this, arguments);
    }

    DefinitionsView.prototype.initialize = function(matches) {
      DefinitionsView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for definitions');
      return this.focusFilterEditor();
    };

    DefinitionsView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    DefinitionsView.prototype.viewForItem = function(_arg) {
      var column, fileName, line, relativePath, text, type, _, _ref1;
      text = _arg.text, fileName = _arg.fileName, line = _arg.line, column = _arg.column, type = _arg.type;
      _ref1 = atom.project.relativizePath(fileName), _ = _ref1[0], relativePath = _ref1[1];
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div("" + type + " " + text, {
              "class": 'primary-line'
            });
            return _this.div("" + relativePath + ", line " + (line + 1), {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    DefinitionsView.prototype.getFilterKey = function() {
      return 'fileName';
    };

    DefinitionsView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No definition found';
      } else {
        return DefinitionsView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    DefinitionsView.prototype.confirmed = function(_arg) {
      var column, fileName, line, promise;
      fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      this.cancelPosition = null;
      this.cancel();
      promise = atom.workspace.open(fileName);
      return promise.then(function(editor) {
        editor.setCursorBufferPosition([line, column]);
        return editor.scrollToCursorPosition();
      });
    };

    DefinitionsView.prototype.cancelled = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return DefinitionsView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDhCQUFBLFVBQUEsR0FBWSxTQUFDLE9BQUQsR0FBQTtBQUNWLE1BQUEsaURBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFWLENBRkEsQ0FBQTs7UUFHQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BSFY7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSx5QkFBWixDQUxBLENBQUE7YUFNQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQVBVO0lBQUEsQ0FBWixDQUFBOztBQUFBLDhCQVNBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUEsRUFGTztJQUFBLENBVFQsQ0FBQTs7QUFBQSw4QkFhQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLDBEQUFBO0FBQUEsTUFEYSxZQUFBLE1BQU0sZ0JBQUEsVUFBVSxZQUFBLE1BQU0sY0FBQSxRQUFRLFlBQUEsSUFDM0MsQ0FBQTtBQUFBLE1BQUEsUUFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXBCLEVBQUMsWUFBRCxFQUFJLHVCQUFKLENBQUE7QUFDQSxhQUFPLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDUixJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsVUFBQSxPQUFBLEVBQU8sV0FBUDtTQUFKLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ3RCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxFQUFBLEdBQUcsSUFBSCxHQUFRLEdBQVIsR0FBVyxJQUFoQixFQUF3QjtBQUFBLGNBQUEsT0FBQSxFQUFPLGNBQVA7YUFBeEIsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssRUFBQSxHQUFHLFlBQUgsR0FBZ0IsU0FBaEIsR0FBd0IsQ0FBQyxJQUFBLEdBQU8sQ0FBUixDQUE3QixFQUEwQztBQUFBLGNBQUEsT0FBQSxFQUFPLGdCQUFQO2FBQTFDLEVBRnNCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsRUFEUTtNQUFBLENBQUgsQ0FBUCxDQUZXO0lBQUEsQ0FiYixDQUFBOztBQUFBLDhCQW9CQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsV0FBSDtJQUFBLENBcEJkLENBQUE7O0FBQUEsOEJBc0JBLGVBQUEsR0FBaUIsU0FBQyxTQUFELEdBQUE7QUFDZixNQUFBLElBQUcsU0FBQSxLQUFhLENBQWhCO2VBQ0Usc0JBREY7T0FBQSxNQUFBO2VBR0Usc0RBQUEsU0FBQSxFQUhGO09BRGU7SUFBQSxDQXRCakIsQ0FBQTs7QUFBQSw4QkE0QkEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsVUFBQSwrQkFBQTtBQUFBLE1BRFcsZ0JBQUEsVUFBVSxZQUFBLE1BQU0sY0FBQSxNQUMzQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFsQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQixDQUZWLENBQUE7YUFHQSxPQUFPLENBQUMsSUFBUixDQUFhLFNBQUMsTUFBRCxHQUFBO0FBQ1gsUUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxJQUFELEVBQU8sTUFBUCxDQUEvQixDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBQSxFQUZXO01BQUEsQ0FBYixFQUpTO0lBQUEsQ0E1QlgsQ0FBQTs7QUFBQSw4QkFvQ0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsS0FBQTtpREFBTSxDQUFFLElBQVIsQ0FBQSxXQURTO0lBQUEsQ0FwQ1gsQ0FBQTs7MkJBQUE7O0tBRDRCLGVBSjlCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/nikke/.atom/packages/autocomplete-python/lib/definitions-view.coffee
