(function() {
  var CompositeDisposable, Emitter, ProjectRepositories, TreeViewGitStatus, TreeViewUI, utils, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  ProjectRepositories = require('./repositories');

  TreeViewUI = require('./treeviewui');

  utils = require('./utils');

  module.exports = TreeViewGitStatus = {
    config: {
      autoToggle: {
        type: 'boolean',
        "default": true,
        description: 'Show the Git status in the tree view when starting Atom'
      },
      showProjectModifiedStatus: {
        type: 'boolean',
        "default": true,
        description: 'Mark project folder as modified in case there are any ' + 'uncommited changes'
      },
      showBranchLabel: {
        type: 'boolean',
        "default": true
      },
      showCommitsAheadLabel: {
        type: 'boolean',
        "default": true
      },
      showCommitsBehindLabel: {
        type: 'boolean',
        "default": true
      }
    },
    subscriptions: null,
    toggledSubscriptions: null,
    treeView: null,
    subscriptionsOfCommands: null,
    active: false,
    repos: null,
    treeViewUI: null,
    ignoredRepositories: null,
    emitter: null,
    activate: function() {
      this.emitter = new Emitter;
      this.ignoredRepositories = new Map;
      this.subscriptionsOfCommands = new CompositeDisposable;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return _this.doInitPackage();
        };
      })(this)));
      return this.doInitPackage();
    },
    doInitPackage: function() {
      var autoToggle, treeView;
      treeView = this.getTreeView();
      if (!(treeView && !this.active)) {
        return;
      }
      this.treeView = treeView;
      this.active = true;
      this.subscriptionsOfCommands.add(atom.commands.add('atom-workspace', {
        'tree-view-git-status:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      autoToggle = atom.config.get('tree-view-git-status.autoToggle');
      if (autoToggle) {
        this.toggle();
      }
      return this.emitter.emit('did-activate');
    },
    deactivate: function() {
      var _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      if ((_ref1 = this.subscriptions) != null) {
        _ref1.dispose();
      }
      this.subscriptions = null;
      if ((_ref2 = this.subscriptionsOfCommands) != null) {
        _ref2.dispose();
      }
      this.subscriptionsOfCommands = null;
      if ((_ref3 = this.toggledSubscriptions) != null) {
        _ref3.dispose();
      }
      this.toggledSubscriptions = null;
      this.treeView = null;
      this.active = false;
      this.toggled = false;
      if ((_ref4 = this.ignoredRepositories) != null) {
        _ref4.clear();
      }
      this.ignoredRepositories = null;
      if ((_ref5 = this.repos) != null) {
        _ref5.destruct();
      }
      this.repos = null;
      if ((_ref6 = this.treeViewUI) != null) {
        _ref6.destruct();
      }
      this.treeViewUI = null;
      if ((_ref7 = this.emitter) != null) {
        _ref7.clear();
      }
      if ((_ref8 = this.emitter) != null) {
        _ref8.dispose();
      }
      return this.emitter = null;
    },
    toggle: function() {
      var _ref1, _ref2, _ref3;
      if (!this.active) {
        return;
      }
      if (!this.toggled) {
        this.toggled = true;
        this.repos = new ProjectRepositories(this.ignoredRepositories);
        this.treeViewUI = new TreeViewUI(this.treeView, this.repos.getRepositories());
        this.toggledSubscriptions = new CompositeDisposable;
        this.toggledSubscriptions.add(this.repos.onDidChange('repos', (function(_this) {
          return function(repos) {
            var _ref1;
            return (_ref1 = _this.treeViewUI) != null ? _ref1.setRepositories(repos) : void 0;
          };
        })(this)));
        return this.toggledSubscriptions.add(this.repos.onDidChange('repo-status', (function(_this) {
          return function(evt) {
            var _ref1, _ref2;
            if ((_ref1 = _this.repos) != null ? _ref1.getRepositories().has(evt.repoPath) : void 0) {
              return (_ref2 = _this.treeViewUI) != null ? _ref2.updateRootForRepo(evt.repo, evt.repoPath) : void 0;
            }
          };
        })(this)));
      } else {
        this.toggled = false;
        if ((_ref1 = this.toggledSubscriptions) != null) {
          _ref1.dispose();
        }
        this.toggledSubscriptions = null;
        if ((_ref2 = this.repos) != null) {
          _ref2.destruct();
        }
        this.repos = null;
        if ((_ref3 = this.treeViewUI) != null) {
          _ref3.destruct();
        }
        return this.treeViewUI = null;
      }
    },
    getTreeView: function() {
      var treeViewPkg, _ref1;
      if (this.treeView == null) {
        if (atom.packages.getActivePackage('tree-view') != null) {
          treeViewPkg = atom.packages.getActivePackage('tree-view');
        }
        if ((treeViewPkg != null ? (_ref1 = treeViewPkg.mainModule) != null ? _ref1.treeView : void 0 : void 0) != null) {
          return treeViewPkg.mainModule.treeView;
        } else {
          return null;
        }
      } else {
        return this.treeView;
      }
    },
    getRepositories: function() {
      if (this.repos != null) {
        return this.repos.getRepositories();
      } else {
        return null;
      }
    },
    ignoreRepository: function(repoPath) {
      var _ref1;
      this.ignoredRepositories.set(utils.normalizePath(repoPath), true);
      return (_ref1 = this.repos) != null ? _ref1.setIgnoredRepositories(this.ignoredRepositories) : void 0;
    },
    onDidActivate: function(handler) {
      return this.emitter.on('did-activate', handler);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1zdGF0dXMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixlQUFBLE9BQXRCLENBQUE7O0FBQUEsRUFDQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsZ0JBQVIsQ0FEdEIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUZiLENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FIUixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsaUJBQUEsR0FFZjtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUNFLHlEQUhGO09BREY7QUFBQSxNQUtBLHlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUNFLHdEQUFBLEdBQ0Esb0JBSkY7T0FORjtBQUFBLE1BV0EsZUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FaRjtBQUFBLE1BY0EscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BZkY7QUFBQSxNQWlCQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FB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

//# sourceURL=/home/nikke/.atom/packages/tree-view-git-status/lib/main.coffee
