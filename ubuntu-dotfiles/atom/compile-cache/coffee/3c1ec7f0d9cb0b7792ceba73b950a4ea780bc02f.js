(function() {
  var BlameErrorView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = BlameErrorView = (function(_super) {
    __extends(BlameErrorView, _super);

    function BlameErrorView() {
      this.onOk = __bind(this.onOk, this);
      return BlameErrorView.__super__.constructor.apply(this, arguments);
    }

    BlameErrorView.content = function(params) {
      return this.div({
        "class": 'overlay from-top'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block text-highlight'
          }, 'Git Blame Error:');
          _this.div({
            "class": 'error-message block'
          }, params.message);
          return _this.div({
            "class": 'block'
          }, function() {
            return _this.button({
              "class": 'btn',
              click: 'onOk'
            }, 'Ok');
          });
        };
      })(this));
    };

    BlameErrorView.prototype.onOk = function(event, element) {
      return this.remove();
    };

    BlameErrorView.prototype.attach = function() {
      return atom.workspace.addTopPanel({
        item: this
      });
    };

    return BlameErrorView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi92aWV3cy9ibGFtZS1lcnJvci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHFDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGtCQUFQO09BQUwsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM5QixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxzQkFBUDtXQUFMLEVBQW9DLGtCQUFwQyxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxxQkFBUDtXQUFMLEVBQW1DLE1BQU0sQ0FBQyxPQUExQyxDQURBLENBQUE7aUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7bUJBQ25CLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE9BQUEsRUFBTyxLQUFQO0FBQUEsY0FBYyxLQUFBLEVBQU8sTUFBckI7YUFBUixFQUFxQyxJQUFyQyxFQURtQjtVQUFBLENBQXJCLEVBSDhCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw2QkFPQSxJQUFBLEdBQU0sU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO2FBQ0osSUFBSSxDQUFDLE1BQUwsQ0FBQSxFQURJO0lBQUEsQ0FQTixDQUFBOztBQUFBLDZCQVVBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBMkI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO09BQTNCLEVBRE07SUFBQSxDQVZSLENBQUE7OzBCQUFBOztLQUYyQixLQUg3QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/git-blame/lib/views/blame-error-view.coffee
