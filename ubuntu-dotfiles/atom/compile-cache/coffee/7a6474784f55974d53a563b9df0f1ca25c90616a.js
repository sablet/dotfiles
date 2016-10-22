(function() {
  var BreakpointStore, CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = BreakpointStore = (function() {
    function BreakpointStore(gutter) {
      this.breakpoints = [];
    }

    BreakpointStore.prototype.toggle = function(breakpoint) {
      var addDecoration, breakpointSearched, d, ds, editor, marker, _i, _len, _results;
      breakpointSearched = this.containsBreakpoint(breakpoint);
      addDecoration = true;
      if (breakpointSearched) {
        this.breakpoints.splice(breakpointSearched, 1);
        addDecoration = false;
      } else {
        this.breakpoints.push(breakpoint);
      }
      editor = atom.workspace.getActiveTextEditor();
      if (addDecoration) {
        marker = editor.markBufferPosition([breakpoint.lineNumber - 1, 0]);
        d = editor.decorateMarker(marker, {
          type: "line-number",
          "class": "line-number-red"
        });
        d.setProperties({
          type: "line-number",
          "class": "line-number-red"
        });
        return breakpoint.decoration = d;
      } else {
        editor = atom.workspace.getActiveTextEditor();
        ds = editor.getLineNumberDecorations({
          type: "line-number",
          "class": "line-number-red"
        });
        _results = [];
        for (_i = 0, _len = ds.length; _i < _len; _i++) {
          d = ds[_i];
          marker = d.getMarker();
          if (marker.getBufferRange().start.row === breakpoint.lineNumber - 1) {
            _results.push(marker.destroy());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    BreakpointStore.prototype.containsBreakpoint = function(bp) {
      var breakpoint, _i, _len, _ref;
      _ref = this.breakpoints;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        breakpoint = _ref[_i];
        if (breakpoint.filename === bp.filename && breakpoint.lineNumber === bp.lineNumber) {
          return breakpoint;
        }
      }
      return null;
    };

    BreakpointStore.prototype.currentBreakpoints = function() {
      var breakpoint, _i, _len, _ref, _results;
      _ref = this.breakpoints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        breakpoint = _ref[_i];
        _results.push(console.log(breakpoint));
      }
      return _results;
    };

    BreakpointStore.prototype.clear = function() {
      var breakpoint, _i, _len, _ref, _results;
      _ref = this.breakpoints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        breakpoint = _ref[_i];
        _results.push(this.toggle(breakpoint));
      }
      return _results;
    };

    return BreakpointStore;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvcHl0aG9uLWRlYnVnZ2VyL2xpYi9icmVha3BvaW50LXN0b3JlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQ0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEseUJBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBQWYsQ0FEVztJQUFBLENBQWI7O0FBQUEsOEJBR0EsTUFBQSxHQUFRLFNBQUMsVUFBRCxHQUFBO0FBQ04sVUFBQSw0RUFBQTtBQUFBLE1BQUEsa0JBQUEsR0FBcUIsSUFBQyxDQUFBLGtCQUFELENBQW9CLFVBQXBCLENBQXJCLENBQUE7QUFBQSxNQUVBLGFBQUEsR0FBZ0IsSUFGaEIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxrQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLGtCQUFwQixFQUF3QyxDQUF4QyxDQUFBLENBQUE7QUFBQSxRQUNBLGFBQUEsR0FBZ0IsS0FEaEIsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixVQUFsQixDQUFBLENBSkY7T0FIQTtBQUFBLE1BU0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQVRULENBQUE7QUFXQSxNQUFBLElBQUcsYUFBSDtBQUNFLFFBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQixDQUFDLFVBQVUsQ0FBQyxVQUFYLEdBQXNCLENBQXZCLEVBQTBCLENBQTFCLENBQTFCLENBQVQsQ0FBQTtBQUFBLFFBQ0EsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE1BQXRCLEVBQThCO0FBQUEsVUFBQSxJQUFBLEVBQU0sYUFBTjtBQUFBLFVBQXFCLE9BQUEsRUFBTyxpQkFBNUI7U0FBOUIsQ0FESixDQUFBO0FBQUEsUUFFQSxDQUFDLENBQUMsYUFBRixDQUFnQjtBQUFBLFVBQUEsSUFBQSxFQUFNLGFBQU47QUFBQSxVQUFxQixPQUFBLEVBQU8saUJBQTVCO1NBQWhCLENBRkEsQ0FBQTtlQUdBLFVBQVUsQ0FBQyxVQUFYLEdBQXdCLEVBSjFCO09BQUEsTUFBQTtBQU1FLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxRQUNBLEVBQUEsR0FBSyxNQUFNLENBQUMsd0JBQVAsQ0FBZ0M7QUFBQSxVQUFBLElBQUEsRUFBTSxhQUFOO0FBQUEsVUFBcUIsT0FBQSxFQUFPLGlCQUE1QjtTQUFoQyxDQURMLENBQUE7QUFFQTthQUFBLHlDQUFBO3FCQUFBO0FBQ0UsVUFBQSxNQUFBLEdBQVMsQ0FBQyxDQUFDLFNBQUYsQ0FBQSxDQUFULENBQUE7QUFDQSxVQUFBLElBQW9CLE1BQU0sQ0FBQyxjQUFQLENBQUEsQ0FBdUIsQ0FBQyxLQUFLLENBQUMsR0FBOUIsS0FBcUMsVUFBVSxDQUFDLFVBQVgsR0FBc0IsQ0FBL0U7MEJBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxHQUFBO1dBQUEsTUFBQTtrQ0FBQTtXQUZGO0FBQUE7d0JBUkY7T0FaTTtJQUFBLENBSFIsQ0FBQTs7QUFBQSw4QkEyQkEsa0JBQUEsR0FBb0IsU0FBQyxFQUFELEdBQUE7QUFDbEIsVUFBQSwwQkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTs4QkFBQTtBQUNFLFFBQUEsSUFBRyxVQUFVLENBQUMsUUFBWCxLQUF1QixFQUFFLENBQUMsUUFBMUIsSUFBc0MsVUFBVSxDQUFDLFVBQVgsS0FBeUIsRUFBRSxDQUFDLFVBQXJFO0FBQ0UsaUJBQU8sVUFBUCxDQURGO1NBREY7QUFBQSxPQUFBO0FBR0EsYUFBTyxJQUFQLENBSmtCO0lBQUEsQ0EzQnBCLENBQUE7O0FBQUEsOEJBaUNBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTtBQUNsQixVQUFBLG9DQUFBO0FBQUE7QUFBQTtXQUFBLDJDQUFBOzhCQUFBO0FBQUEsc0JBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxVQUFaLEVBQUEsQ0FBQTtBQUFBO3NCQURrQjtJQUFBLENBakNwQixDQUFBOztBQUFBLDhCQW9DQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxvQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTs4QkFBQTtBQUFBLHNCQUFBLElBQUMsQ0FBQSxNQUFELENBQVEsVUFBUixFQUFBLENBQUE7QUFBQTtzQkFESztJQUFBLENBcENQLENBQUE7OzJCQUFBOztNQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/nikke/.atom/packages/python-debugger/lib/breakpoint-store.coffee
