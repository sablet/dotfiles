(function() {
  var GitRepositoryAsync;

  module.exports = GitRepositoryAsync = (function() {
    GitRepositoryAsync.prototype.repo = null;

    function GitRepositoryAsync(repo) {
      this.repo = repo;
    }

    GitRepositoryAsync.prototype.destruct = function() {
      return this.repo = null;
    };

    GitRepositoryAsync.prototype.getShortHead = function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getShortHead();
        };
      })(this));
    };

    GitRepositoryAsync.prototype.getWorkingDirectory = function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getWorkingDirectory();
        };
      })(this));
    };

    GitRepositoryAsync.prototype.onDidChangeStatuses = function(callback) {
      return this.repo.onDidChangeStatuses(callback);
    };

    GitRepositoryAsync.prototype.onDidChangeStatus = function(callback) {
      return this.repo.onDidChangeStatus(callback);
    };

    GitRepositoryAsync.prototype.getDirectoryStatus = function(path) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getDirectoryStatus(path);
        };
      })(this));
    };

    GitRepositoryAsync.prototype.getRootDirectoryStatus = function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          var directoryStatus, path, status, _ref;
          directoryStatus = 0;
          _ref = _this.repo.statuses;
          for (path in _ref) {
            status = _ref[path];
            directoryStatus |= status;
          }
          return directoryStatus;
        };
      })(this));
    };

    GitRepositoryAsync.prototype.refreshStatus = function() {
      return Promise.resolve();
    };

    GitRepositoryAsync.prototype.getCachedUpstreamAheadBehindCount = function(path) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getCachedUpstreamAheadBehindCount(path);
        };
      })(this));
    };

    GitRepositoryAsync.prototype.isStatusModified = function(status) {
      return this.repo.isStatusModified(status);
    };

    GitRepositoryAsync.prototype.isStatusNew = function(status) {
      return this.repo.isStatusNew(status);
    };

    return GitRepositoryAsync;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1zdGF0dXMvbGliL2dpdHJlcG9zaXRvcnlhc3luYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQixpQ0FBQSxJQUFBLEdBQU0sSUFBTixDQUFBOztBQUVhLElBQUEsNEJBQUUsSUFBRixHQUFBO0FBQVMsTUFBUixJQUFDLENBQUEsT0FBQSxJQUFPLENBQVQ7SUFBQSxDQUZiOztBQUFBLGlDQUlBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLEtBREE7SUFBQSxDQUpWLENBQUE7O0FBQUEsaUNBT0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUNMLENBQUMsSUFESSxDQUNDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxZQUFOLENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREQsQ0FBUCxDQURZO0lBQUEsQ0FQZCxDQUFBOztBQUFBLGlDQVdBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixhQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FDTCxDQUFDLElBREksQ0FDQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FERCxDQUFQLENBRG1CO0lBQUEsQ0FYckIsQ0FBQTs7QUFBQSxpQ0FlQSxtQkFBQSxHQUFxQixTQUFDLFFBQUQsR0FBQTtBQUNuQixhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBMEIsUUFBMUIsQ0FBUCxDQURtQjtJQUFBLENBZnJCLENBQUE7O0FBQUEsaUNBa0JBLGlCQUFBLEdBQW1CLFNBQUMsUUFBRCxHQUFBO0FBQ2pCLGFBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxpQkFBTixDQUF3QixRQUF4QixDQUFQLENBRGlCO0lBQUEsQ0FsQm5CLENBQUE7O0FBQUEsaUNBcUJBLGtCQUFBLEdBQW9CLFNBQUMsSUFBRCxHQUFBO0FBQ2xCLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUNMLENBQUMsSUFESSxDQUNDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxrQkFBTixDQUF5QixJQUF6QixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FERCxDQUFQLENBRGtCO0lBQUEsQ0FyQnBCLENBQUE7O0FBQUEsaUNBeUJBLHNCQUFBLEdBQXdCLFNBQUEsR0FBQTtBQUN0QixhQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBaUIsQ0FBQyxJQUFsQixDQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzVCLGNBQUEsbUNBQUE7QUFBQSxVQUFBLGVBQUEsR0FBa0IsQ0FBbEIsQ0FBQTtBQUNBO0FBQUEsZUFBQSxZQUFBO2dDQUFBO0FBQ0UsWUFBQSxlQUFBLElBQW1CLE1BQW5CLENBREY7QUFBQSxXQURBO0FBR0EsaUJBQU8sZUFBUCxDQUo0QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLENBQVAsQ0FEc0I7SUFBQSxDQXpCeEIsQ0FBQTs7QUFBQSxpQ0FnQ0EsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQLENBRGE7SUFBQSxDQWhDZixDQUFBOztBQUFBLGlDQW1DQSxpQ0FBQSxHQUFtQyxTQUFDLElBQUQsR0FBQTtBQUNqQyxhQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FDTCxDQUFDLElBREksQ0FDQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFJLENBQUMsaUNBQU4sQ0FBd0MsSUFBeEMsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREQsQ0FBUCxDQURpQztJQUFBLENBbkNuQyxDQUFBOztBQUFBLGlDQXVDQSxnQkFBQSxHQUFrQixTQUFDLE1BQUQsR0FBQTtBQUNoQixhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBdUIsTUFBdkIsQ0FBUCxDQURnQjtJQUFBLENBdkNsQixDQUFBOztBQUFBLGlDQTBDQSxXQUFBLEdBQWEsU0FBQyxNQUFELEdBQUE7QUFDWCxhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixNQUFsQixDQUFQLENBRFc7SUFBQSxDQTFDYixDQUFBOzs4QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/tree-view-git-status/lib/gitrepositoryasync.coffee
