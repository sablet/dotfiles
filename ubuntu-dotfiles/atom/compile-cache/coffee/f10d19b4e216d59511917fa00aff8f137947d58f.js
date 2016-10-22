(function() {
  var CompositeDisposable, Emitter, GitOps, MergeConflictsView, pkgApi, pkgEmitter, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  MergeConflictsView = require('./view/merge-conflicts-view').MergeConflictsView;

  GitOps = require('./git').GitOps;

  pkgEmitter = null;

  pkgApi = null;

  module.exports = {
    activate: function(state) {
      this.subs = new CompositeDisposable;
      this.emitter = new Emitter;
      MergeConflictsView.registerContextApi(GitOps);
      pkgEmitter = {
        onDidResolveConflict: (function(_this) {
          return function(callback) {
            return _this.onDidResolveConflict(callback);
          };
        })(this),
        didResolveConflict: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-resolve-conflict', event);
          };
        })(this),
        onDidResolveFile: (function(_this) {
          return function(callback) {
            return _this.onDidResolveFile(callback);
          };
        })(this),
        didResolveFile: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-resolve-file', event);
          };
        })(this),
        onDidQuitConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidQuitConflictResolution(callback);
          };
        })(this),
        didQuitConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-quit-conflict-resolution');
          };
        })(this),
        onDidCompleteConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidCompleteConflictResolution(callback);
          };
        })(this),
        didCompleteConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-complete-conflict-resolution');
          };
        })(this)
      };
      return this.subs.add(atom.commands.add('atom-workspace', 'merge-conflicts:detect', function() {
        return MergeConflictsView.detect(pkgEmitter);
      }));
    },
    deactivate: function() {
      this.subs.dispose();
      return this.emitter.dispose();
    },
    config: {
      gitPath: {
        type: 'string',
        "default": '',
        description: 'Absolute path to your git executable.'
      }
    },
    onDidResolveConflict: function(callback) {
      return this.emitter.on('did-resolve-conflict', callback);
    },
    onDidResolveFile: function(callback) {
      return this.emitter.on('did-resolve-file', callback);
    },
    onDidQuitConflictResolution: function(callback) {
      return this.emitter.on('did-quit-conflict-resolution', callback);
    },
    onDidCompleteConflictResolution: function(callback) {
      return this.emitter.on('did-complete-conflict-resolution', callback);
    },
    registerContextApi: function(contextApi) {
      return MergeConflictsView.registerContextApi(contextApi);
    },
    showForContext: function(context) {
      return MergeConflictsView.showForContext(context, pkgEmitter);
    },
    hideForContext: function(context) {
      return MergeConflictsView.hideForContext(context);
    },
    provideApi: function() {
      if (pkgApi === null) {
        pkgApi = Object.freeze({
          registerContextApi: this.registerContextApi,
          showForContext: this.showForContext,
          hideForContext: this.hideForContext,
          onDidResolveConflict: pkgEmitter.onDidResolveConflict,
          onDidResolveFile: pkgEmitter.onDidResolveConflict,
          onDidQuitConflictResolution: pkgEmitter.onDidQuitConflictResolution,
          onDidCompleteConflictResolution: pkgEmitter.onDidCompleteConflictResolution
        });
      }
      return pkgApi;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUF0QixDQUFBOztBQUFBLEVBRUMscUJBQXNCLE9BQUEsQ0FBUSw2QkFBUixFQUF0QixrQkFGRCxDQUFBOztBQUFBLEVBR0MsU0FBVSxPQUFBLENBQVEsT0FBUixFQUFWLE1BSEQsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxJQUxiLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsSUFOVCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQUEsQ0FBQSxtQkFBUixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQURYLENBQUE7QUFBQSxNQUdBLGtCQUFrQixDQUFDLGtCQUFuQixDQUFzQyxNQUF0QyxDQUhBLENBQUE7QUFBQSxNQUtBLFVBQUEsR0FDRTtBQUFBLFFBQUEsb0JBQUEsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLFFBQUQsR0FBQTttQkFBYyxLQUFDLENBQUEsb0JBQUQsQ0FBc0IsUUFBdEIsRUFBZDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO0FBQUEsUUFDQSxrQkFBQSxFQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO21CQUFXLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxD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

//# sourceURL=/home/nikke/.atom/packages/merge-conflicts/lib/main.coffee
