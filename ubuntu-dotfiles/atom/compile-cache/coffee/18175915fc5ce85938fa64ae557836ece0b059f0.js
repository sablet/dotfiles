(function() {
  var SelectListView, SignalListView, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  _ = require('lodash');

  module.exports = SignalListView = (function(_super) {
    __extends(SignalListView, _super);

    function SignalListView() {
      return SignalListView.__super__.constructor.apply(this, arguments);
    }

    SignalListView.prototype.initialize = function(getKernelSpecs) {
      this.getKernelSpecs = getKernelSpecs;
      SignalListView.__super__.initialize.apply(this, arguments);
      this.onConfirmed = null;
      return this.list.addClass('mark-active');
    };

    SignalListView.prototype.getFilterKey = function() {
      return 'name';
    };

    SignalListView.prototype.destroy = function() {
      return this.cancel();
    };

    SignalListView.prototype.viewForItem = function(item) {
      var element;
      element = document.createElement('li');
      element.textContent = item.name;
      return element;
    };

    SignalListView.prototype.cancelled = function() {
      var _ref;
      if ((_ref = this.panel) != null) {
        _ref.destroy();
      }
      this.panel = null;
      return this.editor = null;
    };

    SignalListView.prototype.confirmed = function(item) {
      console.log('Selected command:', item);
      if (typeof this.onConfirmed === "function") {
        this.onConfirmed(item);
      }
      return this.cancel();
    };

    SignalListView.prototype.attach = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.focusFilterEditor();
      return this.getKernelSpecs((function(_this) {
        return function(kernelSpec) {
          _this.languageOptions = _.map(kernelSpec, function(kernelSpec) {
            return {
              name: kernelSpec.display_name,
              kernelSpec: kernelSpec
            };
          });
          return _this.setItems(_this.languageOptions);
        };
      })(this));
    };

    SignalListView.prototype.getEmptyMessage = function() {
      return 'No running kernels found.';
    };

    SignalListView.prototype.toggle = function() {
      if (this.panel != null) {
        return this.cancel();
      } else if (this.editor = atom.workspace.getActiveTextEditor()) {
        return this.attach();
      }
    };

    return SignalListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC1waWNrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSLEVBQWxCLGNBQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0YscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDZCQUFBLFVBQUEsR0FBWSxTQUFFLGNBQUYsR0FBQTtBQUNSLE1BRFMsSUFBQyxDQUFBLGlCQUFBLGNBQ1YsQ0FBQTtBQUFBLE1BQUEsZ0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFGZixDQUFBO2FBR0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQWUsYUFBZixFQUpRO0lBQUEsQ0FBWixDQUFBOztBQUFBLDZCQU9BLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDVixPQURVO0lBQUEsQ0FQZCxDQUFBOztBQUFBLDZCQVVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREs7SUFBQSxDQVZULENBQUE7O0FBQUEsNkJBYUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBVixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsV0FBUixHQUFzQixJQUFJLENBQUMsSUFEM0IsQ0FBQTthQUVBLFFBSFM7SUFBQSxDQWJiLENBQUE7O0FBQUEsNkJBa0JBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDUCxVQUFBLElBQUE7O1lBQU0sQ0FBRSxPQUFSLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQURULENBQUE7YUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBSEg7SUFBQSxDQWxCWCxDQUFBOztBQUFBLDZCQXVCQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDUCxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksbUJBQVosRUFBaUMsSUFBakMsQ0FBQSxDQUFBOztRQUNBLElBQUMsQ0FBQSxZQUFhO09BRGQ7YUFFQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSE87SUFBQSxDQXZCWCxDQUFBOztBQUFBLDZCQTRCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQURWO0FBQUEsTUFFQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUZBLENBQUE7YUFJQSxJQUFDLENBQUEsY0FBRCxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7QUFDWixVQUFBLEtBQUMsQ0FBQSxlQUFELEdBQW1CLENBQUMsQ0FBQyxHQUFGLENBQU0sVUFBTixFQUFrQixTQUFDLFVBQUQsR0FBQTtBQUNqQyxtQkFBTztBQUFBLGNBQ0gsSUFBQSxFQUFNLFVBQVUsQ0FBQyxZQURkO0FBQUEsY0FFSCxVQUFBLEVBQVksVUFGVDthQUFQLENBRGlDO1VBQUEsQ0FBbEIsQ0FBbkIsQ0FBQTtpQkFNQSxLQUFDLENBQUEsUUFBRCxDQUFVLEtBQUMsQ0FBQSxlQUFYLEVBUFk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQixFQUxJO0lBQUEsQ0E1QlIsQ0FBQTs7QUFBQSw2QkEwQ0EsZUFBQSxHQUFpQixTQUFBLEdBQUE7YUFDYiw0QkFEYTtJQUFBLENBMUNqQixDQUFBOztBQUFBLDZCQTZDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFHLGtCQUFIO2VBQ0ksSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURKO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQWI7ZUFDRCxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREM7T0FIRDtJQUFBLENBN0NSLENBQUE7OzBCQUFBOztLQUR5QixlQUw3QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/kernel-picker.coffee
