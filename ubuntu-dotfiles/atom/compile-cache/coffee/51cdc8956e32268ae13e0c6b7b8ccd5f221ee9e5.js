(function() {
  var $, CompositeDisposable, Conflict, ConflictedEditor, Emitter, NavigationView, ResolverView, SideView, _, _ref;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  Conflict = require('./conflict').Conflict;

  SideView = require('./view/side-view').SideView;

  NavigationView = require('./view/navigation-view').NavigationView;

  ResolverView = require('./view/resolver-view').ResolverView;

  ConflictedEditor = (function() {
    function ConflictedEditor(state, pkg, editor) {
      this.state = state;
      this.pkg = pkg;
      this.editor = editor;
      this.subs = new CompositeDisposable;
      this.coveringViews = [];
      this.conflicts = [];
    }

    ConflictedEditor.prototype.mark = function() {
      var c, cv, _i, _j, _len, _len1, _ref1, _ref2;
      this.conflicts = Conflict.all(this.state, this.editor);
      this.coveringViews = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        this.coveringViews.push(new SideView(c.ours, this.editor));
        if (c.base != null) {
          this.coveringViews.push(new SideView(c.base, this.editor));
        }
        this.coveringViews.push(new NavigationView(c.navigator, this.editor));
        this.coveringViews.push(new SideView(c.theirs, this.editor));
        this.subs.add(c.onDidResolveConflict((function(_this) {
          return function() {
            var resolvedCount, unresolved, v;
            unresolved = (function() {
              var _j, _len1, _ref2, _results;
              _ref2 = this.coveringViews;
              _results = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                v = _ref2[_j];
                if (!v.conflict().isResolved()) {
                  _results.push(v);
                }
              }
              return _results;
            }).call(_this);
            resolvedCount = _this.conflicts.length - Math.floor(unresolved.length / 3);
            return _this.pkg.didResolveConflict({
              file: _this.editor.getPath(),
              total: _this.conflicts.length,
              resolved: resolvedCount,
              source: _this
            });
          };
        })(this)));
      }
      if (this.conflicts.length > 0) {
        atom.views.getView(this.editor).classList.add('conflicted');
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          cv = _ref2[_j];
          cv.decorate();
        }
        this.installEvents();
        return this.focusConflict(this.conflicts[0]);
      } else {
        this.pkg.didResolveConflict({
          file: this.editor.getPath(),
          total: 1,
          resolved: 1,
          source: this
        });
        return this.conflictsResolved();
      }
    };

    ConflictedEditor.prototype.installEvents = function() {
      this.subs.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.detectDirty();
        };
      })(this)));
      this.subs.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      this.subs.add(atom.commands.add('atom-text-editor', {
        'merge-conflicts:accept-current': (function(_this) {
          return function() {
            return _this.acceptCurrent();
          };
        })(this),
        'merge-conflicts:accept-ours': (function(_this) {
          return function() {
            return _this.acceptOurs();
          };
        })(this),
        'merge-conflicts:accept-theirs': (function(_this) {
          return function() {
            return _this.acceptTheirs();
          };
        })(this),
        'merge-conflicts:ours-then-theirs': (function(_this) {
          return function() {
            return _this.acceptOursThenTheirs();
          };
        })(this),
        'merge-conflicts:theirs-then-ours': (function(_this) {
          return function() {
            return _this.acceptTheirsThenOurs();
          };
        })(this),
        'merge-conflicts:next-unresolved': (function(_this) {
          return function() {
            return _this.nextUnresolved();
          };
        })(this),
        'merge-conflicts:previous-unresolved': (function(_this) {
          return function() {
            return _this.previousUnresolved();
          };
        })(this),
        'merge-conflicts:revert-current': (function(_this) {
          return function() {
            return _this.revertCurrent();
          };
        })(this)
      }));
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(_arg) {
          var file, resolved, total;
          total = _arg.total, resolved = _arg.resolved, file = _arg.file;
          if (file === _this.editor.getPath() && total === resolved) {
            return _this.conflictsResolved();
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidCompleteConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      return this.subs.add(this.pkg.onDidQuitConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
    };

    ConflictedEditor.prototype.cleanup = function() {
      var c, m, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      if (this.editor != null) {
        atom.views.getView(this.editor).classList.remove('conflicted');
      }
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = c.markers();
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          m = _ref2[_j];
          m.destroy();
        }
      }
      _ref3 = this.coveringViews;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        v.remove();
      }
      return this.subs.dispose();
    };

    ConflictedEditor.prototype.conflictsResolved = function() {
      return atom.workspace.addTopPanel({
        item: new ResolverView(this.editor, this.state, this.pkg)
      });
    };

    ConflictedEditor.prototype.detectDirty = function() {
      var c, potentials, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      potentials = [];
      _ref1 = this.editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          v = _ref2[_j];
          if (v.includesCursor(c)) {
            potentials.push(v);
          }
        }
      }
      _ref3 = _.uniq(potentials);
      _results = [];
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        _results.push(v.detectDirty());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptCurrent = function() {
      var duplicates, seen, side, sides, _i, _len;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      sides = this.active();
      duplicates = [];
      seen = {};
      for (_i = 0, _len = sides.length; _i < _len; _i++) {
        side = sides[_i];
        if (side.conflict in seen) {
          duplicates.push(side);
          duplicates.push(seen[side.conflict]);
        }
        seen[side.conflict] = side;
      }
      sides = _.difference(sides, duplicates);
      return this.editor.transact(function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = sides.length; _j < _len1; _j++) {
          side = sides[_j];
          _results.push(side.resolve());
        }
        return _results;
      });
    };

    ConflictedEditor.prototype.acceptOurs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(side.conflict.ours.resolve());
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptTheirs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(side.conflict.theirs.resolve());
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptOursThenTheirs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(_this.combineSides(side.conflict.ours, side.conflict.theirs));
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptTheirsThenOurs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(_this.combineSides(side.conflict.theirs, side.conflict.ours));
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.nextUnresolved = function() {
      var c, final, firstAfter, lastCursor, n, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      final = _.last(this.active());
      if (final != null) {
        n = final.conflict.navigator.nextUnresolved();
        if (n != null) {
          return this.focusConflict(n);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        lastCursor = _.last(orderedCursors);
        if (lastCursor == null) {
          return;
        }
        pos = lastCursor.getBufferPosition();
        firstAfter = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isGreaterThanOrEqual(pos) && (firstAfter == null)) {
            firstAfter = c;
          }
        }
        if (firstAfter == null) {
          return;
        }
        if (firstAfter.isResolved()) {
          target = firstAfter.navigator.nextUnresolved();
        } else {
          target = firstAfter;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.previousUnresolved = function() {
      var c, firstCursor, initial, lastBefore, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      initial = _.first(this.active());
      if (initial != null) {
        p = initial.conflict.navigator.previousUnresolved();
        if (p != null) {
          return this.focusConflict(p);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        firstCursor = _.first(orderedCursors);
        if (firstCursor == null) {
          return;
        }
        pos = firstCursor.getBufferPosition();
        lastBefore = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isLessThanOrEqual(pos)) {
            lastBefore = c;
          }
        }
        if (lastBefore == null) {
          return;
        }
        if (lastBefore.isResolved()) {
          target = lastBefore.navigator.previousUnresolved();
        } else {
          target = lastBefore;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.revertCurrent = function() {
      var side, view, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push((function() {
          var _j, _len1, _ref2, _results1;
          _ref2 = this.coveringViews;
          _results1 = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            view = _ref2[_j];
            if (view.conflict() === side.conflict) {
              if (view.isDirty()) {
                _results1.push(view.revert());
              } else {
                _results1.push(void 0);
              }
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ConflictedEditor.prototype.active = function() {
      var c, matching, p, positions, _i, _j, _len, _len1, _ref1;
      positions = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          _results.push(c.getBufferPosition());
        }
        return _results;
      }).call(this);
      matching = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        for (_j = 0, _len1 = positions.length; _j < _len1; _j++) {
          p = positions[_j];
          if (c.ours.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.ours);
          }
          if (c.theirs.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.theirs);
          }
        }
      }
      return matching;
    };

    ConflictedEditor.prototype.combineSides = function(first, second) {
      var e, insertPoint, text;
      text = this.editor.getTextInBufferRange(second.marker.getBufferRange());
      e = first.marker.getBufferRange().end;
      insertPoint = this.editor.setTextInBufferRange([e, e], text).end;
      first.marker.setHeadBufferPosition(insertPoint);
      first.followingMarker.setTailBufferPosition(insertPoint);
      return first.resolve();
    };

    ConflictedEditor.prototype.focusConflict = function(conflict) {
      var st;
      st = conflict.ours.marker.getBufferRange().start;
      this.editor.scrollToBufferPosition(st, {
        center: true
      });
      return this.editor.setCursorBufferPosition(st, {
        autoscroll: false
      });
    };

    return ConflictedEditor;

  })();

  module.exports = {
    ConflictedEditor: ConflictedEditor
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9jb25mbGljdGVkLWVkaXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEdBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxXQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUZWLENBQUE7O0FBQUEsRUFJQyxXQUFZLE9BQUEsQ0FBUSxZQUFSLEVBQVosUUFKRCxDQUFBOztBQUFBLEVBTUMsV0FBWSxPQUFBLENBQVEsa0JBQVIsRUFBWixRQU5ELENBQUE7O0FBQUEsRUFPQyxpQkFBa0IsT0FBQSxDQUFRLHdCQUFSLEVBQWxCLGNBUEQsQ0FBQTs7QUFBQSxFQVFDLGVBQWdCLE9BQUEsQ0FBUSxzQkFBUixFQUFoQixZQVJELENBQUE7O0FBQUEsRUFZTTtBQVNTLElBQUEsMEJBQUUsS0FBRixFQUFVLEdBQVYsRUFBZ0IsTUFBaEIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFFBQUEsS0FDYixDQUFBO0FBQUEsTUFEb0IsSUFBQyxDQUFBLE1BQUEsR0FDckIsQ0FBQTtBQUFBLE1BRDBCLElBQUMsQ0FBQSxTQUFBLE1BQzNCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsR0FBQSxDQUFBLG1CQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEVBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFGYixDQURXO0lBQUEsQ0FBYjs7QUFBQSwrQkFZQSxJQUFBLEdBQU0sU0FBQSxH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

//# sourceURL=/home/nikke/.atom/packages/merge-conflicts/lib/conflicted-editor.coffee
