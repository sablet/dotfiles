(function() {
  var CompositeDisposable, Disposable, Emitter, History, Range, flashMarker, flashTimer, ignoreCommands, path, settings, _, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable, Emitter = _ref.Emitter, Range = _ref.Range;

  _ = require('underscore-plus');

  path = require('path');

  History = null;

  settings = require('./settings');

  flashTimer = null;

  flashMarker = null;

  ignoreCommands = ['cursor-history:next', 'cursor-history:prev', 'cursor-history:next-within-editor', 'cursor-history:prev-within-editor', 'cursor-history:clear'];

  module.exports = {
    config: settings.config,
    history: null,
    subscriptions: null,
    activate: function() {
      var saveHistoryIfNeeded, uniqueByBuffer;
      this.subscriptions = new CompositeDisposable;
      History = require('./history');
      this.history = new History;
      this.emitter = new Emitter;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cursor-history:next': (function(_this) {
          return function() {
            return _this.jump('next');
          };
        })(this),
        'cursor-history:prev': (function(_this) {
          return function() {
            return _this.jump('prev');
          };
        })(this),
        'cursor-history:next-within-editor': (function(_this) {
          return function() {
            return _this.jump('next', {
              withinEditor: true
            });
          };
        })(this),
        'cursor-history:prev-within-editor': (function(_this) {
          return function() {
            return _this.jump('prev', {
              withinEditor: true
            });
          };
        })(this),
        'cursor-history:clear': (function(_this) {
          return function() {
            return _this.history.clear();
          };
        })(this),
        'cursor-history:toggle-debug': function() {
          return settings.toggle('debug', {
            log: true
          });
        }
      }));
      uniqueByBuffer = (function(_this) {
        return function(newValue) {
          if (newValue) {
            return _this.history.uniqueByBuffer();
          }
        };
      })(this);
      this.subscriptions.add(settings.observe('keepSingleEntryPerBuffer', uniqueByBuffer));
      this.observeMouse();
      this.observeCommands();
      saveHistoryIfNeeded = (function(_this) {
        return function(_arg) {
          var newLocation, oldLocation;
          oldLocation = _arg.oldLocation, newLocation = _arg.newLocation;
          if (_this.needToRemember(oldLocation.point, newLocation.point)) {
            return _this.saveHistory(oldLocation, {
              subject: "Cursor moved"
            });
          }
        };
      })(this);
      return this.onDidChangeLocation(saveHistoryIfNeeded);
    },
    onDidChangeLocation: function(fn) {
      return this.emitter.on('did-change-location', fn);
    },
    deactivate: function() {
      var _ref1, _ref2;
      this.subscriptions.dispose();
      if ((_ref1 = this.history) != null) {
        _ref1.destroy();
      }
      return _ref2 = {}, this.history = _ref2.history, this.subscriptions = _ref2.subscriptions, _ref2;
    },
    needToRemember: function(oldPoint, newPoint) {
      if (oldPoint.row === newPoint.row) {
        return Math.abs(oldPoint.column - newPoint.column) > settings.get('columnDeltaToRemember');
      } else {
        return Math.abs(oldPoint.row - newPoint.row) > settings.get('rowDeltaToRemember');
      }
    },
    saveHistory: function(location, _arg) {
      var setToHead, subject, _ref1;
      _ref1 = _arg != null ? _arg : {}, subject = _ref1.subject, setToHead = _ref1.setToHead;
      this.history.add(location);
      if (setToHead != null ? setToHead : true) {
        this.history.removeEntries();
      }
      if (settings.get('debug')) {
        return this.logHistory("" + subject + " [" + location.type + "]");
      }
    },
    observeMouse: function() {
      var handleBubble, handleCapture, stack, workspaceElement;
      stack = [];
      handleCapture = (function(_this) {
        return function(_arg) {
          var model, target;
          target = _arg.target;
          model = typeof target.getModel === "function" ? target.getModel() : void 0;
          if (!(model != null ? typeof model.getURI === "function" ? model.getURI() : void 0 : void 0)) {
            return;
          }
          return stack.push(_this.newLocation('mousedown', model));
        };
      })(this);
      handleBubble = (function(_this) {
        return function(_arg) {
          var target, _ref1;
          target = _arg.target;
          if ((typeof target.getModel === "function" ? (_ref1 = target.getModel()) != null ? typeof _ref1.getURI === "function" ? _ref1.getURI() : void 0 : void 0 : void 0) == null) {
            return;
          }
          return setTimeout(function() {
            return _this.checkLocationChange(stack.pop());
          }, 100);
        };
      })(this);
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.addEventListener('mousedown', handleCapture, true);
      workspaceElement.addEventListener('mousedown', handleBubble, false);
      return this.subscriptions.add(new Disposable(function() {
        workspaceElement.removeEventListener('mousedown', handleCapture, true);
        return workspaceElement.removeEventListener('mousedown', handleBubble, false);
      }));
    },
    isIgnoreCommands: function(command) {
      return (__indexOf.call(ignoreCommands, command) >= 0) || (__indexOf.call(settings.get('ignoreCommands'), command) >= 0);
    },
    observeCommands: function() {
      var saveLocation, shouldSaveLocation, stack;
      shouldSaveLocation = function(type, target) {
        var _ref1;
        return (__indexOf.call(type, ':') >= 0) && ((typeof target.getModel === "function" ? (_ref1 = target.getModel()) != null ? typeof _ref1.getURI === "function" ? _ref1.getURI() : void 0 : void 0 : void 0) != null);
      };
      stack = [];
      saveLocation = _.debounce((function(_this) {
        return function(type, target) {
          if (!shouldSaveLocation(type, target)) {
            return;
          }
          return stack.push(_this.newLocation(type, target.getModel()));
        };
      })(this), 100, true);
      this.subscriptions.add(atom.commands.onWillDispatch((function(_this) {
        return function(_arg) {
          var target, type;
          type = _arg.type, target = _arg.target;
          if (_this.isIgnoreCommands(type)) {
            return;
          }
          return saveLocation(type, target);
        };
      })(this)));
      return this.subscriptions.add(atom.commands.onDidDispatch((function(_this) {
        return function(_arg) {
          var target, type;
          type = _arg.type, target = _arg.target;
          if (_this.isIgnoreCommands(type)) {
            return;
          }
          if (stack.length === 0) {
            return;
          }
          if (!shouldSaveLocation(type, target)) {
            return;
          }
          return setTimeout(function() {
            return _this.checkLocationChange(stack.pop());
          }, 100);
        };
      })(this)));
    },
    checkLocationChange: function(oldLocation) {
      var editor, editorElement, newLocation;
      if (oldLocation == null) {
        return;
      }
      if (!(editor = this.getEditor())) {
        return;
      }
      editorElement = atom.views.getView(editor);
      if (editorElement.hasFocus() && (editor.getURI() === oldLocation.URI)) {
        newLocation = this.newLocation(oldLocation.type, editor);
        return this.emitter.emit('did-change-location', {
          oldLocation: oldLocation,
          newLocation: newLocation
        });
      } else {
        return this.saveHistory(oldLocation, {
          subject: "Save on focus lost"
        });
      }
    },
    jump: function(direction, _arg) {
      var URI, editor, entry, land, location, needToLog, openEditor, point, wasAtHead, withinEditor;
      withinEditor = (_arg != null ? _arg : {}).withinEditor;
      if ((editor = this.getEditor()) == null) {
        return;
      }
      wasAtHead = this.history.isAtHead();
      entry = (function(_this) {
        return function() {
          var uri;
          switch (false) {
            case !withinEditor:
              uri = editor.getURI();
              return _this.history.get(direction, function(_arg1) {
                var URI;
                URI = _arg1.URI;
                return URI === uri;
              });
            default:
              return _this.history.get(direction, function() {
                return true;
              });
          }
        };
      })(this)();
      if (entry == null) {
        return;
      }
      point = entry.point, URI = entry.URI;
      needToLog = true;
      if ((direction === 'prev') && wasAtHead) {
        location = this.newLocation('prev', editor);
        this.saveHistory(location, {
          setToHead: false,
          subject: "Save head position"
        });
        needToLog = false;
      }
      land = (function(_this) {
        return function(editor) {
          return _this.land(editor, {
            point: point,
            direction: direction,
            needToLog: needToLog
          });
        };
      })(this);
      openEditor = function() {
        if (editor.getURI === URI) {
          return Promise.resolve(editor);
        } else {
          return atom.workspace.open(URI, {
            searchAllPanes: settings.get('searchAllPanes')
          });
        }
      };
      return openEditor().then(land);
    },
    land: function(editor, _arg) {
      var direction, needToLog, originalRow, point;
      point = _arg.point, direction = _arg.direction, needToLog = _arg.needToLog;
      originalRow = editor.getCursorBufferPosition().row;
      editor.setCursorBufferPosition(point);
      editor.scrollToCursorPosition({
        center: true
      });
      if (settings.get('flashOnLand') && (originalRow !== point.row)) {
        this.flash({
          flashType: settings.get('flashType'),
          className: "cursor-history-" + (settings.get('flashColor')),
          timeout: settings.get('flashDurationMilliSeconds')
        });
      }
      if (settings.get('debug') && needToLog) {
        return this.logHistory(direction);
      }
    },
    newLocation: function(type, editor) {
      return {
        type: type,
        editor: editor,
        point: editor.getCursorBufferPosition(),
        URI: editor.getURI()
      };
    },
    logHistory: function(msg) {
      var s;
      s = "# cursor-history: " + msg + "\n" + (this.history.inspect());
      return console.log(s, "\n\n");
    },
    getEditor: function() {
      return atom.workspace.getActiveTextEditor();
    },
    flash: function(_arg) {
      var className, clearFlash, cursor, decoration, editor, flashType, range, timeout, type;
      flashType = _arg.flashType, className = _arg.className, timeout = _arg.timeout;
      if (flashMarker != null) {
        flashMarker.destroy();
      }
      clearTimeout(flashTimer);
      editor = this.getEditor();
      cursor = editor.getLastCursor();
      switch (flashType) {
        case 'line':
          type = 'line';
          range = cursor.getCurrentLineBufferRange();
          break;
        case 'word':
          type = 'highlight';
          range = cursor.getCurrentWordBufferRange();
          break;
        case 'point':
          type = 'highlight';
          range = Range.fromPointWithDelta(cursor.getCursorBufferPosition(), 0, 1);
      }
      flashMarker = editor.markBufferRange(range);
      decoration = editor.decorateMarker(flashMarker, {
        type: type,
        "class": className
      });
      clearFlash = function() {
        flashMarker.destroy();
        return flashTimer = null;
      };
      return flashTimer = setTimeout(clearFlash, timeout);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvY3Vyc29yLWhpc3RvcnkvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDBIQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxPQUFvRCxPQUFBLENBQVEsTUFBUixDQUFwRCxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLEVBQWtDLGVBQUEsT0FBbEMsRUFBMkMsYUFBQSxLQUEzQyxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLElBSlYsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWEsSUFOYixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLElBUGQsQ0FBQTs7QUFBQSxFQVNBLGNBQUEsR0FBaUIsQ0FDZixxQkFEZSxFQUVmLHFCQUZlLEVBR2YsbUNBSGUsRUFJZixtQ0FKZSxFQUtmLHNCQUxlLENBVGpCLENBQUE7O0FBQUEsRUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxNQUFqQjtBQUFBLElBQ0EsT0FBQSxFQUFTLElBRFQ7QUFBQSxJQUVBLGFBQUEsRUFBZSxJQUZmO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxtQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FEVixDQUFBO0FBQUEsTUFF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

//# sourceURL=/home/nikke/.atom/packages/cursor-history/lib/main.coffee
