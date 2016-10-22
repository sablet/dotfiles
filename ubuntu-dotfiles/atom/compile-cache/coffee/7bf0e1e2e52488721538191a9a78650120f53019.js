(function() {
  var CompositeDisposable, Emitter, GitRepositoryAsync, ProjectRepositories, utils, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  utils = require('./utils');

  GitRepositoryAsync = require('./gitrepositoryasync');

  module.exports = ProjectRepositories = (function() {
    ProjectRepositories.prototype.projectSubscriptions = null;

    ProjectRepositories.prototype.repositorySubscriptions = null;

    function ProjectRepositories(ignoredRepositories) {
      this.ignoredRepositories = ignoredRepositories;
      this.emitter = new Emitter;
      this.repositoryMap = new Map;
      this.projectSubscriptions = new CompositeDisposable;
      this.repositorySubscriptions = new CompositeDisposable;
      this.projectSubscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.subscribeUpdateRepositories();
        };
      })(this)));
      this.subscribeUpdateRepositories();
    }

    ProjectRepositories.prototype.destruct = function() {
      var _ref1, _ref2, _ref3, _ref4, _ref5;
      if ((_ref1 = this.projectSubscriptions) != null) {
        _ref1.dispose();
      }
      this.projectSubscriptions = null;
      if ((_ref2 = this.repositorySubscriptions) != null) {
        _ref2.dispose();
      }
      this.repositorySubscriptions = null;
      this.ignoredRepositories = null;
      if ((_ref3 = this.repositoryMap) != null) {
        _ref3.clear();
      }
      this.repositoryMap = null;
      if ((_ref4 = this.emitter) != null) {
        _ref4.clear();
      }
      if ((_ref5 = this.emitter) != null) {
        _ref5.dispose();
      }
      return this.emitter = null;
    };

    ProjectRepositories.prototype.subscribeUpdateRepositories = function() {
      var repo, repoPromises, repositoryMap, tmpRepositorySubscriptions, _i, _len, _ref1, _ref2;
      if ((_ref1 = this.repositorySubscriptions) != null) {
        _ref1.dispose();
      }
      tmpRepositorySubscriptions = new CompositeDisposable;
      repositoryMap = new Map();
      repoPromises = [];
      _ref2 = atom.project.getRepositories();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        repo = _ref2[_i];
        if (repo != null) {
          repoPromises.push(this.doSubscribeUpdateRepository(repo, repositoryMap, tmpRepositorySubscriptions));
        }
      }
      return utils.settle(repoPromises).then((function(_this) {
        return function() {
          if (_this.repositoryMap != null) {
            _this.repositorySubscriptions = tmpRepositorySubscriptions;
            _this.repositoryMap = repositoryMap;
            return _this.emitter.emit('did-change-repos', _this.repositoryMap);
          } else {
            return tmpRepositorySubscriptions.dispose();
          }
        };
      })(this))["catch"](function(err) {
        console.error(err);
        return Promise.reject(err);
      });
    };

    ProjectRepositories.prototype.doSubscribeUpdateRepository = function(repo, repositoryMap, repositorySubscriptions) {
      var repoasync;
      if (repo.async != null) {
        repoasync = repo.async;
      } else {
        repoasync = new GitRepositoryAsync(repo);
      }
      return repoasync.getShortHead().then(function(shortHead) {
        if (!typeof shortHead === 'string') {
          return Promise.reject('Got invalid short head for repo');
        }
      }).then((function(_this) {
        return function() {
          return repoasync.getWorkingDirectory().then(function(directory) {
            var repoPath;
            if (!typeof directory === 'string') {
              return Promise.reject('Got invalid working directory path for repo');
            }
            repoPath = utils.normalizePath(directory);
            if (!_this.isRepositoryIgnored(repoPath)) {
              repositoryMap.set(repoPath, repoasync);
              return _this.subscribeToRepo(repoPath, repoasync, repositorySubscriptions);
            }
          });
        };
      })(this))["catch"](function(error) {
        console.warn('Ignoring respority due to error:', error, repo);
        return Promise.resolve();
      });
    };

    ProjectRepositories.prototype.subscribeToRepo = function(repoPath, repo, repositorySubscriptions) {
      if (repositorySubscriptions != null) {
        repositorySubscriptions.add(repo.onDidChangeStatuses((function(_this) {
          return function() {
            var _ref1, _ref2;
            if ((_ref1 = _this.repositoryMap) != null ? _ref1.has(repoPath) : void 0) {
              return (_ref2 = _this.emitter) != null ? _ref2.emit('did-change-repo-status', {
                repo: repo,
                repoPath: repoPath
              }) : void 0;
            }
          };
        })(this)));
      }
      return repositorySubscriptions != null ? repositorySubscriptions.add(repo.onDidChangeStatus((function(_this) {
        return function() {
          var _ref1, _ref2;
          if ((_ref1 = _this.repositoryMap) != null ? _ref1.has(repoPath) : void 0) {
            return (_ref2 = _this.emitter) != null ? _ref2.emit('did-change-repo-status', {
              repo: repo,
              repoPath: repoPath
            }) : void 0;
          }
        };
      })(this))) : void 0;
    };

    ProjectRepositories.prototype.getRepositories = function() {
      return this.repositoryMap;
    };

    ProjectRepositories.prototype.setIgnoredRepositories = function(ignoredRepositories) {
      this.ignoredRepositories = ignoredRepositories;
      return this.subscribeUpdateRepositories();
    };

    ProjectRepositories.prototype.isRepositoryIgnored = function(repoPath) {
      return this.ignoredRepositories.has(repoPath);
    };

    ProjectRepositories.prototype.onDidChange = function(evtType, handler) {
      return this.emitter.on('did-change-' + evtType, handler);
    };

    return ProjectRepositories;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1zdGF0dXMvbGliL3JlcG9zaXRvcmllcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQURSLENBQUE7O0FBQUEsRUFFQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsc0JBQVIsQ0FGckIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLGtDQUFBLG9CQUFBLEdBQXNCLElBQXRCLENBQUE7O0FBQUEsa0NBQ0EsdUJBQUEsR0FBeUIsSUFEekIsQ0FBQTs7QUFHYSxJQUFBLDZCQUFFLG1CQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxzQkFBQSxtQkFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxHQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsb0JBQUQsR0FBd0IsR0FBQSxDQUFBLG1CQUZ4QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsdUJBQUQsR0FBMkIsR0FBQSxDQUFBLG1CQUgzQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsb0JBQW9CLENBQUMsR0FBdEIsQ0FBMEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBYixDQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUV0RCxLQUFDLENBQUEsMkJBQUQsQ0FBQSxFQUZzRDtRQUFB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

//# sourceURL=/home/nikke/.atom/packages/tree-view-git-status/lib/repositories.coffee
