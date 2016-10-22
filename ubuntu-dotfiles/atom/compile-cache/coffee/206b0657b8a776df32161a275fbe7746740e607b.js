(function() {
  var $, CompositeDisposable, ConflictedEditor, MergeConflictsView, MergeState, ResolverView, View, handleErr, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  MergeState = require('../merge-state').MergeState;

  ConflictedEditor = require('../conflicted-editor').ConflictedEditor;

  ResolverView = require('./resolver-view').ResolverView;

  handleErr = require('./error-view').handleErr;

  MergeConflictsView = (function(_super) {
    __extends(MergeConflictsView, _super);

    function MergeConflictsView() {
      return MergeConflictsView.__super__.constructor.apply(this, arguments);
    }

    MergeConflictsView.instance = null;

    MergeConflictsView.contextApis = [];

    MergeConflictsView.content = function(state, pkg) {
      return this.div({
        "class": 'merge-conflicts tool-panel panel-bottom padded clearfix'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.text('Conflicts');
            _this.span({
              "class": 'pull-right icon icon-fold',
              click: 'minimize'
            }, 'Hide');
            return _this.span({
              "class": 'pull-right icon icon-unfold',
              click: 'restore'
            }, 'Show');
          });
          return _this.div({
            outlet: 'body'
          }, function() {
            _this.div({
              "class": 'conflict-list'
            }, function() {
              return _this.ul({
                "class": 'block list-group',
                outlet: 'pathList'
              }, function() {
                var message, p, _i, _len, _ref1, _ref2, _results;
                _ref1 = state.conflicts;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  _ref2 = _ref1[_i], p = _ref2.path, message = _ref2.message;
                  _results.push(_this.li({
                    click: 'navigate',
                    "data-path": p,
                    "class": 'list-item navigate'
                  }, function() {
                    _this.span({
                      "class": 'inline-block icon icon-diff-modified status-modified path'
                    }, p);
                    return _this.div({
                      "class": 'pull-right'
                    }, function() {
                      _this.button({
                        click: 'resolveFile',
                        "class": 'btn btn-xs btn-success inline-block-tight stage-ready',
                        style: 'display: none'
                      }, state.context.resolveText);
                      _this.span({
                        "class": 'inline-block text-subtle'
                      }, message);
                      _this.progress({
                        "class": 'inline-block',
                        max: 100,
                        value: 0
                      });
                      return _this.span({
                        "class": 'inline-block icon icon-dash staged'
                      });
                    });
                  }));
                }
                return _results;
              });
            });
            return _this.div({
              "class": 'footer block pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-sm',
                click: 'quit'
              }, 'Quit');
            });
          });
        };
      })(this));
    };

    MergeConflictsView.prototype.initialize = function(state, pkg) {
      this.state = state;
      this.pkg = pkg;
      this.subs = new CompositeDisposable;
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(event) {
          var found, li, listElement, p, progress, _i, _len, _ref1;
          p = _this.state.relativize(event.file);
          found = false;
          _ref1 = _this.pathList.children();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            listElement = _ref1[_i];
            li = $(listElement);
            if (li.data('path') === p) {
              found = true;
              progress = li.find('progress')[0];
              progress.max = event.total;
              progress.value = event.resolved;
              if (event.total === event.resolved) {
                li.find('.stage-ready').show();
              }
            }
          }
          if (!found) {
            return console.error("Unrecognized conflict path: " + p);
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidResolveFile((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, {
        'merge-conflicts:entire-file-ours': this.sideResolver('ours'),
        'merge-conflicts:entire-file-theirs': this.sideResolver('theirs')
      }));
    };

    MergeConflictsView.prototype.navigate = function(event, element) {
      var fullPath, repoPath;
      repoPath = element.find(".path").text();
      fullPath = this.state.join(repoPath);
      return atom.workspace.open(fullPath);
    };

    MergeConflictsView.prototype.minimize = function() {
      this.addClass('minimized');
      return this.body.hide('fast');
    };

    MergeConflictsView.prototype.restore = function() {
      this.removeClass('minimized');
      return this.body.show('fast');
    };

    MergeConflictsView.prototype.quit = function() {
      this.pkg.didQuitConflictResolution();
      this.finish();
      return this.state.context.quit(this.state.isRebase);
    };

    MergeConflictsView.prototype.refresh = function() {
      return this.state.reread()["catch"](handleErr).then((function(_this) {
        return function() {
          var icon, item, p, _i, _len, _ref1;
          _ref1 = _this.pathList.find('li');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            p = $(item).data('path');
            icon = $(item).find('.staged');
            icon.removeClass('icon-dash icon-check text-success');
            if (_.contains(_this.state.conflictPaths(), p)) {
              icon.addClass('icon-dash');
            } else {
              icon.addClass('icon-check text-success');
              _this.pathList.find("li[data-path='" + p + "'] .stage-ready").hide();
            }
          }
          if (!_this.state.isEmpty()) {
            return;
          }
          _this.pkg.didCompleteConflictResolution();
          _this.finish();
          return _this.state.context.complete(_this.state.isRebase);
        };
      })(this));
    };

    MergeConflictsView.prototype.finish = function() {
      this.subs.dispose();
      return this.hide('fast', (function(_this) {
        return function() {
          MergeConflictsView.instance = null;
          return _this.remove();
        };
      })(this));
    };

    MergeConflictsView.prototype.sideResolver = function(side) {
      return (function(_this) {
        return function(event) {
          var p;
          p = $(event.target).closest('li').data('path');
          return _this.state.context.checkoutSide(side, p).then(function() {
            var full;
            full = _this.state.join(p);
            _this.pkg.didResolveConflict({
              file: full,
              total: 1,
              resolved: 1
            });
            return atom.workspace.open(p);
          })["catch"](function(err) {
            return handleErr(err);
          });
        };
      })(this);
    };

    MergeConflictsView.prototype.resolveFile = function(event, element) {
      var e, filePath, repoPath, _i, _len, _ref1;
      repoPath = element.closest('li').data('path');
      filePath = this.state.join(repoPath);
      _ref1 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        if (e.getPath() === filePath) {
          e.save();
        }
      }
      return this.state.context.resolveFile(repoPath).then((function(_this) {
        return function() {
          return _this.pkg.didResolveFile({
            file: filePath
          });
        };
      })(this))["catch"](function(err) {
        return handleErr(err);
      });
    };

    MergeConflictsView.registerContextApi = function(contextApi) {
      return this.contextApis.push(contextApi);
    };

    MergeConflictsView.showForContext = function(context, pkg) {
      if (this.instance) {
        this.instance.finish();
      }
      return MergeState.read(context).then((function(_this) {
        return function(state) {
          if (state.isEmpty()) {
            return;
          }
          return _this.openForState(state, pkg);
        };
      })(this))["catch"](handleErr);
    };

    MergeConflictsView.hideForContext = function(context) {
      if (!this.instance) {
        return;
      }
      if (this.instance.state.context !== context) {
        return;
      }
      return this.instance.finish();
    };

    MergeConflictsView.detect = function(pkg) {
      if (this.instance != null) {
        return;
      }
      return Promise.all(this.contextApis.map((function(_this) {
        return function(contextApi) {
          return contextApi.getContext();
        };
      })(this))).then((function(_this) {
        return function(contexts) {
          return Promise.all(_.filter(contexts, Boolean).sort(function(context1, context2) {
            return context2.priority - context1.priority;
          }).map(function(context) {
            return MergeState.read(context);
          }));
        };
      })(this)).then((function(_this) {
        return function(states) {
          var state;
          state = states.find(function(state) {
            return !state.isEmpty();
          });
          if (state == null) {
            atom.notifications.addInfo("Nothing to Merge", {
              detail: "No conflicts here!",
              dismissable: true
            });
            return;
          }
          return _this.openForState(state, pkg);
        };
      })(this))["catch"](handleErr);
    };

    MergeConflictsView.openForState = function(state, pkg) {
      var view;
      view = new MergeConflictsView(state, pkg);
      this.instance = view;
      atom.workspace.addBottomPanel({
        item: view
      });
      return this.instance.subs.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.markConflictsIn(state, editor, pkg);
        };
      })(this)));
    };

    MergeConflictsView.markConflictsIn = function(state, editor, pkg) {
      var e, fullPath, repoPath;
      if (state.isEmpty()) {
        return;
      }
      fullPath = editor.getPath();
      repoPath = state.relativize(fullPath);
      if (repoPath == null) {
        return;
      }
      if (!_.contains(state.conflictPaths(), repoPath)) {
        return;
      }
      e = new ConflictedEditor(state, pkg, editor);
      return e.mark();
    };

    return MergeConflictsView;

  })(View);

  module.exports = {
    MergeConflictsView: MergeConflictsView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L21lcmdlLWNvbmZsaWN0cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnSEFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBSUMsYUFBYyxPQUFBLENBQVEsZ0JBQVIsRUFBZCxVQUpELENBQUE7O0FBQUEsRUFLQyxtQkFBb0IsT0FBQSxDQUFRLHNCQUFSLEVBQXBCLGdCQUxELENBQUE7O0FBQUEsRUFPQyxlQUFnQixPQUFBLENBQVEsaUJBQVIsRUFBaEIsWUFQRCxDQUFBOztBQUFBLEVBUUMsWUFBYSxPQUFBLENBQVEsY0FBUixFQUFiLFNBUkQsQ0FBQTs7QUFBQSxFQVVNO0FBRUoseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsa0JBQUMsQ0FBQSxRQUFELEdBQVcsSUFBWCxDQUFBOztBQUFBLElBQ0Esa0JBQUMsQ0FBQSxXQUFELEdBQWMsRUFEZCxDQUFBOztBQUFBLElBR0Esa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxLQUFELEVBQVEsR0FBUixHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHlEQUFQO09BQUwsRUFBdUUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyRSxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEs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

//# sourceURL=/home/nikke/.atom/packages/merge-conflicts/lib/view/merge-conflicts-view.coffee
