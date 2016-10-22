(function() {
  var $, RenameView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = RenameView = (function(_super) {
    __extends(RenameView, _super);

    function RenameView() {
      this.cancel = __bind(this.cancel, this);
      this.confirm = __bind(this.confirm, this);
      return RenameView.__super__.constructor.apply(this, arguments);
    }

    RenameView.content = function(prompt) {
      this.prompt = prompt;
      return this.div((function(_this) {
        return function() {
          _this.label(_this.prompt, {
            "class": 'icon icon-arrow-right',
            outlet: 'promptText'
          });
          return _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
        };
      })(this));
    };

    RenameView.prototype.initialize = function(prompt, _default, onConfirmed) {
      this.prompt = prompt;
      this["default"] = _default;
      this.onConfirmed = onConfirmed;
      atom.commands.add(this.element, {
        'core:confirm': this.confirm,
        'core:cancel': this.cancel
      });
      this.miniEditor.on('blur', (function(_this) {
        return function(e) {
          if (!!document.hasFocus()) {
            return _this.cancel();
          }
        };
      })(this));
      return this.miniEditor.setText(this["default"]);
    };

    RenameView.prototype.storeFocusedElement = function() {
      return this.previouslyFocusedElement = $(document.activeElement);
    };

    RenameView.prototype.restoreFocus = function() {
      var _ref1;
      return (_ref1 = this.previouslyFocusedElement) != null ? _ref1.focus() : void 0;
    };

    RenameView.prototype.confirm = function() {
      var text;
      text = this.miniEditor.getText();
      if (typeof this.onConfirmed === "function") {
        this.onConfirmed(text);
      }
      return this.cancel();
    };

    RenameView.prototype.cancel = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null) {
        _ref1.destroy();
      }
      this.panel = null;
      return this.restoreFocus();
    };

    RenameView.prototype.attach = function() {
      this.storeFocusedElement();
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.miniEditor.focus();
      return this.miniEditor.getModel().scrollToCursorPosition();
    };

    return RenameView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3JlbmFtZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLHNCQUFBLGNBQUosRUFBb0IsWUFBQSxJQUFwQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNGLGlDQUFBLENBQUE7Ozs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFFLE1BQUYsR0FBQTtBQUNOLE1BRE8sSUFBQyxDQUFBLFNBQUEsTUFDUixDQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0QsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLEtBQUMsQ0FBQSxNQUFSLEVBQWdCO0FBQUEsWUFBQSxPQUFBLEVBQU8sdUJBQVA7QUFBQSxZQUFnQyxNQUFBLEVBQVEsWUFBeEM7V0FBaEIsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUEyQixJQUFBLGNBQUEsQ0FBZTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47V0FBZixDQUEzQixFQUZDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTCxFQURNO0lBQUEsQ0FBVixDQUFBOztBQUFBLHlCQUtBLFVBQUEsR0FBWSxTQUFFLE1BQUYsRUFBVSxRQUFWLEVBQXFCLFdBQXJCLEdBQUE7QUFDUixNQURTLElBQUMsQ0FBQSxTQUFBLE1BQ1YsQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxTQUFBLElBQUQsUUFDbEIsQ0FBQTtBQUFBLE1BRDRCLElBQUMsQ0FBQSxjQUFBLFdBQzdCLENBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFDSTtBQUFBLFFBQUEsY0FBQSxFQUFnQixJQUFDLENBQUEsT0FBakI7QUFBQSxRQUNBLGFBQUEsRUFBZSxJQUFDLENBQUEsTUFEaEI7T0FESixDQUFBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxVQUFVLENBQUMsRUFBWixDQUFlLE1BQWYsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ25CLFVBQUEsSUFBQSxDQUFBLENBQWlCLFFBQVksQ0FBQyxRQUFULENBQUEsQ0FBckI7bUJBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBO1dBRG1CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsQ0FKQSxDQUFBO2FBT0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLElBQUMsQ0FBQSxTQUFBLENBQXJCLEVBUlE7SUFBQSxDQUxaLENBQUE7O0FBQUEseUJBZUEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO2FBQ2pCLElBQUMsQ0FBQSx3QkFBRCxHQUE0QixDQUFBLENBQUUsUUFBUSxDQUFDLGFBQVgsRUFEWDtJQUFBLENBZnJCLENBQUE7O0FBQUEseUJBa0JBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDVixVQUFBLEtBQUE7b0VBQXlCLENBQUUsS0FBM0IsQ0FBQSxXQURVO0lBQUEsQ0FsQmQsQ0FBQTs7QUFBQSx5QkFxQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNMLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQVAsQ0FBQTs7UUFDQSxJQUFDLENBQUEsWUFBYTtPQURkO2FBRUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUhLO0lBQUEsQ0FyQlQsQ0FBQTs7QUFBQSx5QkEwQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNKLFVBQUEsS0FBQTs7YUFBTSxDQUFFLE9BQVIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBRFQsQ0FBQTthQUVBLElBQUMsQ0FBQSxZQUFELENBQUEsRUFISTtJQUFBLENBMUJSLENBQUE7O0FBQUEseUJBK0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBUDtPQUE3QixDQURULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsc0JBQXZCLENBQUEsRUFKSTtJQUFBLENBL0JSLENBQUE7O3NCQUFBOztLQURxQixLQUh6QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/rename-view.coffee
