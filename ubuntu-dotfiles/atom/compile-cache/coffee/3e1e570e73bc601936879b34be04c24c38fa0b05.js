(function() {
  var MergeState;

  MergeState = (function() {
    function MergeState(conflicts, context, isRebase) {
      this.conflicts = conflicts;
      this.context = context;
      this.isRebase = isRebase;
    }

    MergeState.prototype.conflictPaths = function() {
      var c, _i, _len, _ref, _results;
      _ref = this.conflicts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.path);
      }
      return _results;
    };

    MergeState.prototype.reread = function() {
      return this.context.readConflicts().then((function(_this) {
        return function(conflicts) {
          _this.conflicts = conflicts;
        };
      })(this));
    };

    MergeState.prototype.isEmpty = function() {
      return this.conflicts.length === 0;
    };

    MergeState.prototype.relativize = function(filePath) {
      return this.context.workingDirectory.relativize(filePath);
    };

    MergeState.prototype.join = function(relativePath) {
      return this.context.joinPath(relativePath);
    };

    MergeState.read = function(context) {
      var isr;
      isr = context.isRebasing();
      return context.readConflicts().then(function(cs) {
        return new MergeState(cs, context, isr);
      });
    };

    return MergeState;

  })();

  module.exports = {
    MergeState: MergeState
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9tZXJnZS1zdGF0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFNO0FBRVMsSUFBQSxvQkFBRSxTQUFGLEVBQWMsT0FBZCxFQUF3QixRQUF4QixHQUFBO0FBQW1DLE1BQWxDLElBQUMsQ0FBQSxZQUFBLFNBQWlDLENBQUE7QUFBQSxNQUF0QixJQUFDLENBQUEsVUFBQSxPQUFxQixDQUFBO0FBQUEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQW5DO0lBQUEsQ0FBYjs7QUFBQSx5QkFFQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQUcsVUFBQSwyQkFBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTtxQkFBQTtBQUFBLHNCQUFBLENBQUMsQ0FBQyxLQUFGLENBQUE7QUFBQTtzQkFBSDtJQUFBLENBRmYsQ0FBQTs7QUFBQSx5QkFJQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBRSxTQUFGLEdBQUE7QUFBYyxVQUFiLEtBQUMsQ0FBQSxZQUFBLFNBQVksQ0FBZDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLEVBRE07SUFBQSxDQUpSLENBQUE7O0FBQUEseUJBT0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxLQUFxQixFQUF4QjtJQUFBLENBUFQsQ0FBQTs7QUFBQSx5QkFTQSxVQUFBLEdBQVksU0FBQyxRQUFELEdBQUE7YUFBYyxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQTFCLENBQXFDLFFBQXJDLEVBQWQ7SUFBQSxDQVRaLENBQUE7O0FBQUEseUJBV0EsSUFBQSxHQUFNLFNBQUMsWUFBRCxHQUFBO2FBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUFrQixZQUFsQixFQUFsQjtJQUFBLENBWE4sQ0FBQTs7QUFBQSxJQWFBLFVBQUMsQ0FBQSxJQUFELEdBQU8sU0FBQyxPQUFELEdBQUE7QUFDTCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsVUFBUixDQUFBLENBQU4sQ0FBQTthQUNBLE9BQU8sQ0FBQyxhQUFSLENBQUEsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUFDLEVBQUQsR0FBQTtlQUN2QixJQUFBLFVBQUEsQ0FBVyxFQUFYLEVBQWUsT0FBZixFQUF3QixHQUF4QixFQUR1QjtNQUFBLENBQTdCLEVBRks7SUFBQSxDQWJQLENBQUE7O3NCQUFBOztNQUZGLENBQUE7O0FBQUEsRUFvQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsVUFBQSxFQUFZLFVBQVo7R0FyQkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/merge-conflicts/lib/merge-state.coffee
