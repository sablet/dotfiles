(function() {
  var CompositeDisposable, TreeViewUI, fs, path, utils;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  fs = require('fs-plus');

  utils = require('./utils');

  module.exports = TreeViewUI = (function() {
    var ENUM_UPDATE_STATUS, statusUpdatingRoots;

    TreeViewUI.prototype.roots = null;

    TreeViewUI.prototype.repositoryMap = null;

    TreeViewUI.prototype.treeViewRootsMap = null;

    TreeViewUI.prototype.subscriptions = null;

    ENUM_UPDATE_STATUS = {
      NOT_UPDATING: 0,
      UPDATING: 1,
      QUEUED: 2,
      QUEUED_RESET: 3
    };

    statusUpdatingRoots = ENUM_UPDATE_STATUS.NOT_UPDATING;

    function TreeViewUI(treeView, repositoryMap) {
      this.treeView = treeView;
      this.repositoryMap = repositoryMap;
      this.showProjectModifiedStatus = atom.config.get('tree-view-git-status.showProjectModifiedStatus');
      this.showBranchLabel = atom.config.get('tree-view-git-status.showBranchLabel');
      this.showCommitsAheadLabel = atom.config.get('tree-view-git-status.showCommitsAheadLabel');
      this.showCommitsBehindLabel = atom.config.get('tree-view-git-status.showCommitsBehindLabel');
      this.subscriptions = new CompositeDisposable;
      this.treeViewRootsMap = new Map;
      this.subscribeUpdateConfigurations();
      this.subscribeUpdateTreeView();
      this.updateRoots(true);
    }

    TreeViewUI.prototype.destruct = function() {
      var _ref;
      this.clearTreeViewRootMap();
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      this.subscriptions = null;
      this.treeViewRootsMap = null;
      this.repositoryMap = null;
      return this.roots = null;
    };

    TreeViewUI.prototype.subscribeUpdateTreeView = function() {
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideVcsIgnoredFiles', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideIgnoredNames', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('core.ignoredNames', (function(_this) {
        return function() {
          if (atom.config.get('tree-view.hideIgnoredNames')) {
            return _this.updateRoots(true);
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.onDidChange('tree-view.sortFoldersBeforeFiles', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
    };

    TreeViewUI.prototype.subscribeUpdateConfigurations = function() {
      this.subscriptions.add(atom.config.observe('tree-view-git-status.showProjectModifiedStatus', (function(_this) {
        return function(newValue) {
          if (_this.showProjectModifiedStatus !== newValue) {
            _this.showProjectModifiedStatus = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-git-status.showBranchLabel', (function(_this) {
        return function(newValue) {
          if (_this.showBranchLabel !== newValue) {
            _this.showBranchLabel = newValue;
          }
          return _this.updateRoots();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-git-status.showCommitsAheadLabel', (function(_this) {
        return function(newValue) {
          if (_this.showCommitsAheadLabel !== newValue) {
            _this.showCommitsAheadLabel = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('tree-view-git-status.showCommitsBehindLabel', (function(_this) {
        return function(newValue) {
          if (_this.showCommitsBehindLabel !== newValue) {
            _this.showCommitsBehindLabel = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
    };

    TreeViewUI.prototype.setRepositories = function(repositories) {
      if (repositories != null) {
        this.repositoryMap = repositories;
        return this.updateRoots(true);
      }
    };

    TreeViewUI.prototype.clearTreeViewRootMap = function() {
      var _ref, _ref1;
      if ((_ref = this.treeViewRootsMap) != null) {
        _ref.forEach(function(root, rootPath) {
          var customElements, _ref1, _ref2, _ref3, _ref4;
          if ((_ref1 = root.root) != null) {
            if ((_ref2 = _ref1.classList) != null) {
              _ref2.remove('status-modified', 'status-added');
            }
          }
          customElements = root.customElements;
          if ((customElements != null ? customElements.headerGitStatus : void 0) != null) {
            if ((_ref3 = root.root) != null) {
              if ((_ref4 = _ref3.header) != null) {
                _ref4.removeChild(customElements.headerGitStatus);
              }
            }
            return customElements.headerGitStatus = null;
          }
        });
      }
      return (_ref1 = this.treeViewRootsMap) != null ? _ref1.clear() : void 0;
    };

    TreeViewUI.prototype.updateRoots = function(reset) {
      var repoForRoot, repoSubPath, root, rootPath, rootPathHasGitFolder, updatePromises, _i, _len, _ref;
      if (this.repositoryMap == null) {
        return;
      }
      if (statusUpdatingRoots === ENUM_UPDATE_STATUS.NOT_UPDATING) {
        statusUpdatingRoots = ENUM_UPDATE_STATUS.UPDATING;
        this.roots = this.treeView.roots;
        if (reset) {
          this.clearTreeViewRootMap();
        }
        updatePromises = [];
        _ref = this.roots;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root = _ref[_i];
          rootPath = utils.normalizePath(root.directoryName.dataset.path);
          if (reset) {
            this.treeViewRootsMap.set(rootPath, {
              root: root,
              customElements: {}
            });
          }
          repoForRoot = null;
          repoSubPath = null;
          rootPathHasGitFolder = fs.existsSync(path.join(rootPath, '.git'));
          this.repositoryMap.forEach(function(repo, repoPath) {
            if ((repoForRoot == null) && ((rootPath === repoPath) || (rootPath.indexOf(repoPath) === 0 && !rootPathHasGitFolder))) {
              repoSubPath = path.relative(repoPath, rootPath);
              return repoForRoot = repo;
            }
          });
          if (repoForRoot != null) {
            if (repoForRoot == null) {
              repoForRoot = null;
            }
            updatePromises.push(this.doUpdateRootNode(root, repoForRoot, rootPath, repoSubPath));
          }
        }
        utils.settle(updatePromises)["catch"](function(err) {
          return console.error(err);
        }).then((function(_this) {
          return function() {
            var lastStatus;
            lastStatus = statusUpdatingRoots;
            statusUpdatingRoots = ENUM_UPDATE_STATUS.NOT_UPDATING;
            if (lastStatus === ENUM_UPDATE_STATUS.QUEUED) {
              return _this.updateRoots();
            } else if (lastStatus === ENUM_UPDATE_STATUS.QUEUED_RESET) {
              return _this.updateRoots(true);
            }
          };
        })(this));
      } else if (statusUpdatingRoots === ENUM_UPDATE_STATUS.UPDATING) {
        statusUpdatingRoots = ENUM_UPDATE_STATUS.QUEUED;
      }
      if (statusUpdatingRoots === ENUM_UPDATE_STATUS.QUEUED && reset) {
        return statusUpdatingRoots = ENUM_UPDATE_STATUS.QUEUED_RESET;
      }
    };

    TreeViewUI.prototype.updateRootForRepo = function(repo, repoPath) {
      return this.updateRoots();
    };

    TreeViewUI.prototype.doUpdateRootNode = function(root, repo, rootPath, repoSubPath) {
      var customElements, updatePromise;
      customElements = this.treeViewRootsMap.get(rootPath).customElements;
      updatePromise = Promise.resolve();
      if (this.showProjectModifiedStatus && (repo != null)) {
        updatePromise = updatePromise.then(function() {
          if (repoSubPath !== '') {
            return repo.getDirectoryStatus(repoSubPath);
          } else {
            return utils.getRootDirectoryStatus(repo);
          }
        });
      }
      return updatePromise.then((function(_this) {
        return function(status) {
          var convStatus, headerGitStatus, showHeaderGitStatus;
          if (_this.roots == null) {
            return;
          }
          convStatus = _this.convertDirectoryStatus(repo, status);
          root.classList.remove('status-modified', 'status-added');
          if (convStatus != null) {
            root.classList.add("status-" + convStatus);
          }
          showHeaderGitStatus = _this.showBranchLabel || _this.showCommitsAheadLabel || _this.showCommitsBehindLabel;
          if (showHeaderGitStatus && (repo != null) && (customElements.headerGitStatus == null)) {
            headerGitStatus = document.createElement('span');
            headerGitStatus.classList.add('tree-view-git-status');
            return _this.generateGitStatusText(headerGitStatus, repo).then(function() {
              customElements.headerGitStatus = headerGitStatus;
              return root.header.insertBefore(headerGitStatus, root.directoryName.nextSibling);
            });
          } else if (showHeaderGitStatus && (customElements.headerGitStatus != null)) {
            return _this.generateGitStatusText(customElements.headerGitStatus, repo);
          } else if (customElements.headerGitStatus != null) {
            root.header.removeChild(customElements.headerGitStatus);
            return customElements.headerGitStatus = null;
          }
        };
      })(this));
    };

    TreeViewUI.prototype.generateGitStatusText = function(container, repo) {
      var ahead, behind, display, head;
      display = false;
      head = null;
      ahead = behind = 0;
      return repo.refreshStatus().then(function() {
        return repo.getShortHead().then(function(shorthead) {
          return head = shorthead;
        });
      }).then(function() {
        if (repo.getCachedUpstreamAheadBehindCount != null) {
          return repo.getCachedUpstreamAheadBehindCount().then(function(count) {
            return ahead = count.ahead, behind = count.behind, count;
          });
        }
      }).then((function(_this) {
        return function() {
          var branchLabel, commitsAhead, commitsBehind;
          container.className = '';
          container.classList.add('tree-view-git-status');
          if (_this.showBranchLabel && (head != null)) {
            branchLabel = document.createElement('span');
            branchLabel.classList.add('branch-label');
            if (/^[a-z_-][a-z\d_-]*$/i.test(head)) {
              container.classList.add('git-branch-' + head);
            }
            branchLabel.textContent = head;
            display = true;
          }
          if (_this.showCommitsAheadLabel && ahead > 0) {
            commitsAhead = document.createElement('span');
            commitsAhead.classList.add('commits-ahead-label');
            commitsAhead.textContent = ahead;
            display = true;
          }
          if (_this.showCommitsBehindLabel && behind > 0) {
            commitsBehind = document.createElement('span');
            commitsBehind.classList.add('commits-behind-label');
            commitsBehind.textContent = behind;
            display = true;
          }
          if (display) {
            container.classList.remove('hide');
          } else {
            container.classList.add('hide');
          }
          container.innerHTML = '';
          if (branchLabel != null) {
            container.appendChild(branchLabel);
          }
          if (commitsAhead != null) {
            container.appendChild(commitsAhead);
          }
          if (commitsBehind != null) {
            return container.appendChild(commitsBehind);
          }
        };
      })(this));
    };

    TreeViewUI.prototype.convertDirectoryStatus = function(repo, status) {
      var newStatus;
      newStatus = null;
      if (repo.isStatusModified(status)) {
        newStatus = 'modified';
      } else if (repo.isStatusNew(status)) {
        newStatus = 'added';
      }
      return newStatus;
    };

    return TreeViewUI;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1zdGF0dXMvbGliL3RyZWV2aWV3dWkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQixRQUFBLHVDQUFBOztBQUFBLHlCQUFBLEtBQUEsR0FBTyxJQUFQLENBQUE7O0FBQUEseUJBQ0EsYUFBQSxHQUFlLElBRGYsQ0FBQTs7QUFBQSx5QkFFQSxnQkFBQSxHQUFrQixJQUZsQixDQUFBOztBQUFBLHlCQUdBLGFBQUEsR0FBZSxJQUhmLENBQUE7O0FBQUEsSUFJQSxrQkFBQSxHQUNFO0FBQUEsTUFBRSxZQUFBLEVBQWMsQ0FBaEI7QUFBQSxNQUFtQixRQUFBLEVBQVUsQ0FBN0I7QUFBQSxNQUFnQyxNQUFBLEVBQVEsQ0FBeEM7QUFBQSxNQUEyQyxZQUFBLEVBQWMsQ0FBekQ7S0FMRixDQUFBOztBQUFBLElBTUEsbUJBQUEsR0FBc0Isa0JBQWtCLENBQUMsWUFOekMsQ0FBQTs7QUFRYSxJQUFBLG9CQUFFLFFBQUYsRUFBYSxhQUFiLEdBQUE7QUFFWCxNQUZZLElBQUMsQ0FBQSxXQUFBLFFBRWIsQ0FBQTtBQUFBLE1BRnVCLElBQUMsQ0FBQSxnQkFBQSxhQUV4QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEseUJBQUQsR0FDRSxJQUFJLENB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

//# sourceURL=/home/nikke/.atom/packages/tree-view-git-status/lib/treeviewui.coffee
