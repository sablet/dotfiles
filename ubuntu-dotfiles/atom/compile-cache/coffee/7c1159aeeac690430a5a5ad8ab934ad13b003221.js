(function() {
  var Breakpoint, BreakpointStore, CompositeDisposable, PythonDebugger;

  CompositeDisposable = require("atom").CompositeDisposable;

  Breakpoint = require("./breakpoint");

  BreakpointStore = require("./breakpoint-store");

  module.exports = PythonDebugger = {
    pythonDebuggerView: null,
    subscriptions: null,
    config: {
      pythonExecutable: {
        title: "Path to Python executable to use during debugging",
        type: "string",
        "default": "python"
      }
    },
    createDebuggerView: function(backendDebugger) {
      var PythonDebuggerView;
      if (this.pythonDebuggerView == null) {
        PythonDebuggerView = require("./python-debugger-view");
        this.pythonDebuggerView = new PythonDebuggerView(this.breakpointStore);
      }
      return this.pythonDebuggerView;
    },
    activate: function(_arg) {
      var attached;
      attached = (_arg != null ? _arg : {}).attached;
      this.subscriptions = new CompositeDisposable;
      this.breakpointStore = new BreakpointStore();
      if (attached) {
        this.createDebuggerView().toggle();
      }
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "python-debugger:toggle": (function(_this) {
          return function() {
            return _this.createDebuggerView().toggle();
          };
        })(this),
        "python-debugger:breakpoint": (function(_this) {
          return function() {
            return _this.toggleBreakpoint();
          };
        })(this)
      }));
    },
    toggleBreakpoint: function() {
      var breakpoint, editor, filename, lineNumber;
      editor = atom.workspace.getActiveTextEditor();
      filename = editor.getTitle();
      lineNumber = editor.getCursorBufferPosition().row + 1;
      breakpoint = new Breakpoint(filename, lineNumber);
      return this.breakpointStore.toggle(breakpoint);
    },
    deactivate: function() {
      this.backendDebuggerInputView.destroy();
      this.subscriptions.dispose();
      return this.pythonDebuggerView.destroy();
    },
    serialize: function() {
      var activePath, relative, themPaths;
      ({
        pythonDebuggerViewState: this.pythonDebuggerView.serialize()
      });
      activePath = typeof editor !== "undefined" && editor !== null ? editor.getPath() : void 0;
      relative = atom.project.relativizePath(activePath);
      return themPaths = relative[0] || path.dirname(activePath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvcHl0aG9uLWRlYnVnZ2VyL2xpYi9weXRob24tZGVidWdnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdFQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBQUEsR0FDZjtBQUFBLElBQUEsa0JBQUEsRUFBb0IsSUFBcEI7QUFBQSxJQUNBLGFBQUEsRUFBZSxJQURmO0FBQUEsSUFHQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxtREFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxRQUZUO09BREY7S0FKRjtBQUFBLElBU0Esa0JBQUEsRUFBb0IsU0FBQyxlQUFELEdBQUE7QUFDbEIsVUFBQSxrQkFBQTtBQUFBLE1BQUEsSUFBTywrQkFBUDtBQUNFLFFBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSLENBQXJCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxrQkFBRCxHQUEwQixJQUFBLGtCQUFBLENBQW1CLElBQUMsQ0FBQSxlQUFwQixDQUQxQixDQURGO09BQUE7YUFHQSxJQUFDLENBQUEsbUJBSmlCO0lBQUEsQ0FUcEI7QUFBQSxJQWVBLFFBQUEsRUFBVSxTQUFDLElBQUQsR0FBQTtBQUVSLFVBQUEsUUFBQTtBQUFBLE1BRlUsMkJBQUQsT0FBVyxJQUFWLFFBRVYsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxHQUF1QixJQUFBLGVBQUEsQ0FBQSxDQUR2QixDQUFBO0FBRUEsTUFBQSxJQUFrQyxRQUFsQztBQUFBLFFBQUEsSUFBQyxDQUFBLGtCQUFELENBQUEsQ0FBcUIsQ0FBQyxNQUF0QixDQUFBLENBQUEsQ0FBQTtPQUZBO2FBSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLHdCQUFBLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxrQkFBRCxDQUFBLENBQXFCLENBQUMsTUFBdEIsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7QUFBQSxRQUNBLDRCQUFBLEVBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxnQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUQ5QjtPQURpQixDQUFuQixFQU5RO0lBQUEsQ0FmVjtBQUFBLElBeUJBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTtBQUNoQixVQUFBLHdDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FEWCxDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxHQUFqQyxHQUF1QyxDQUZwRCxDQUFBO0FBQUEsTUFHQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLFFBQVgsRUFBcUIsVUFBckIsQ0FIakIsQ0FBQTthQUlBLElBQUMsQ0FBQSxlQUFlLENBQUMsTUFBakIsQ0FBd0IsVUFBeEIsRUFMZ0I7SUFBQSxDQXpCbEI7QUFBQSxJQWdDQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsd0JBQXdCLENBQUMsT0FBMUIsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBLEVBSFU7SUFBQSxDQWhDWjtBQUFBLElBcUNBLFNBQUEsRUFBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLCtCQUFBO0FBQUEsTUFBQSxDQUFBO0FBQUEsUUFBQSx1QkFBQSxFQUF5QixJQUFDLENBQUEsa0JBQWtCLENBQUMsU0FBcEIsQ0FBQSxDQUF6QjtPQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsVUFBQSxzREFBYSxNQUFNLENBQUUsT0FBUixDQUFBLFVBRmIsQ0FBQTtBQUFBLE1BR0EsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixVQUE1QixDQUhYLENBQUE7YUFJQSxTQUFBLEdBQVksUUFBUyxDQUFBLENBQUEsQ0FBVCxJQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixFQUxsQjtJQUFBLENBckNYO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/python-debugger/lib/python-debugger.coffee
