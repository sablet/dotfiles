(function() {
  var $, InputView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      this.close = __bind(this.close, this);
      this.confirm = __bind(this.confirm, this);
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function(prompt) {
      this.prompt = prompt;
      if (this.prompt === '') {
        this.prompt = 'Kernel requires input';
      }
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

    InputView.prototype.initialize = function(prompt, onConfirmed) {
      this.prompt = prompt;
      this.onConfirmed = onConfirmed;
      return atom.commands.add(this.element, {
        'core:confirm': this.confirm
      });
    };

    InputView.prototype.storeFocusedElement = function() {
      return this.previouslyFocusedElement = $(document.activeElement);
    };

    InputView.prototype.restoreFocus = function() {
      var _ref1;
      return (_ref1 = this.previouslyFocusedElement) != null ? _ref1.focus() : void 0;
    };

    InputView.prototype.confirm = function() {
      var text;
      text = this.miniEditor.getText();
      if (typeof this.onConfirmed === "function") {
        this.onConfirmed(text);
      }
      return this.close();
    };

    InputView.prototype.close = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null) {
        _ref1.destroy();
      }
      this.panel = null;
      return this.restoreFocus();
    };

    InputView.prototype.attach = function() {
      this.storeFocusedElement();
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.miniEditor.focus();
      return this.miniEditor.getModel().scrollToCursorPosition();
    };

    return InputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2lucHV0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksc0JBQUEsY0FBSixFQUFvQixZQUFBLElBQXBCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0YsZ0NBQUEsQ0FBQTs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUUsTUFBRixHQUFBO0FBQ04sTUFETyxJQUFDLENBQUEsU0FBQSxNQUNSLENBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLE1BQUQsS0FBVyxFQUFkO0FBQ0ksUUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLHVCQUFWLENBREo7T0FBQTthQUVBLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNELFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxLQUFDLENBQUEsTUFBUixFQUFnQjtBQUFBLFlBQUEsT0FBQSxFQUFPLHVCQUFQO0FBQUEsWUFBZ0MsTUFBQSxFQUFRLFlBQXhDO1dBQWhCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQWU7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWYsQ0FBM0IsRUFGQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUwsRUFITTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx3QkFPQSxVQUFBLEdBQVksU0FBRSxNQUFGLEVBQVcsV0FBWCxHQUFBO0FBQ1IsTUFEUyxJQUFDLENBQUEsU0FBQSxNQUNWLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsY0FBQSxXQUNuQixDQUFBO2FBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNJO0FBQUEsUUFBQSxjQUFBLEVBQWdCLElBQUMsQ0FBQSxPQUFqQjtPQURKLEVBRFE7SUFBQSxDQVBaLENBQUE7O0FBQUEsd0JBWUEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO2FBQ2pCLElBQUMsQ0FBQSx3QkFBRCxHQUE0QixDQUFBLENBQUUsUUFBUSxDQUFDLGFBQVgsRUFEWDtJQUFBLENBWnJCLENBQUE7O0FBQUEsd0JBZUEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNWLFVBQUEsS0FBQTtvRUFBeUIsQ0FBRSxLQUEzQixDQUFBLFdBRFU7SUFBQSxDQWZkLENBQUE7O0FBQUEsd0JBa0JBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDTCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFQLENBQUE7O1FBQ0EsSUFBQyxDQUFBLFlBQWE7T0FEZDthQUVBLElBQUMsQ0FBQSxLQUFELENBQUEsRUFISztJQUFBLENBbEJULENBQUE7O0FBQUEsd0JBdUJBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDSCxVQUFBLEtBQUE7O2FBQU0sQ0FBRSxPQUFSLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQURULENBQUE7YUFFQSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBSEc7SUFBQSxDQXZCUCxDQUFBOztBQUFBLHdCQTRCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQVA7T0FBN0IsQ0FEVCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLHNCQUF2QixDQUFBLEVBSkk7SUFBQSxDQTVCUixDQUFBOztxQkFBQTs7S0FEb0IsS0FIeEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/input-view.coffee
