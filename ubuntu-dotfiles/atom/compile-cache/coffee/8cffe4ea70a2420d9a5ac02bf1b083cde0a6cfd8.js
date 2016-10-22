
/* global atom */

(function() {
  var $, CompositeDisposable, JumpyView, Point, Range, View, a, c1, c2, keys, lowerCharacters, upperCharacters, _, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point, Range = _ref.Range;

  _ref1 = require('space-pen'), View = _ref1.View, $ = _ref1.$;

  _ = require('lodash');

  lowerCharacters = (function() {
    var _i, _ref2, _ref3, _results;
    _results = [];
    for (a = _i = _ref2 = 'a'.charCodeAt(), _ref3 = 'z'.charCodeAt(); _ref2 <= _ref3 ? _i <= _ref3 : _i >= _ref3; a = _ref2 <= _ref3 ? ++_i : --_i) {
      _results.push(String.fromCharCode(a));
    }
    return _results;
  })();

  upperCharacters = (function() {
    var _i, _ref2, _ref3, _results;
    _results = [];
    for (a = _i = _ref2 = 'A'.charCodeAt(), _ref3 = 'Z'.charCodeAt(); _ref2 <= _ref3 ? _i <= _ref3 : _i >= _ref3; a = _ref2 <= _ref3 ? ++_i : --_i) {
      _results.push(String.fromCharCode(a));
    }
    return _results;
  })();

  keys = [];

  for (_i = 0, _len = lowerCharacters.length; _i < _len; _i++) {
    c1 = lowerCharacters[_i];
    for (_j = 0, _len1 = lowerCharacters.length; _j < _len1; _j++) {
      c2 = lowerCharacters[_j];
      keys.push(c1 + c2);
    }
  }

  for (_k = 0, _len2 = upperCharacters.length; _k < _len2; _k++) {
    c1 = upperCharacters[_k];
    for (_l = 0, _len3 = lowerCharacters.length; _l < _len3; _l++) {
      c2 = lowerCharacters[_l];
      keys.push(c1 + c2);
    }
  }

  for (_m = 0, _len4 = lowerCharacters.length; _m < _len4; _m++) {
    c1 = lowerCharacters[_m];
    for (_n = 0, _len5 = upperCharacters.length; _n < _len5; _n++) {
      c2 = upperCharacters[_n];
      keys.push(c1 + c2);
    }
  }

  JumpyView = (function(_super) {
    __extends(JumpyView, _super);

    function JumpyView() {
      this.clearJumpModeHandler = __bind(this.clearJumpModeHandler, this);
      return JumpyView.__super__.constructor.apply(this, arguments);
    }

    JumpyView.content = function() {
      return this.div('');
    };

    JumpyView.prototype.initialize = function() {
      var c, characterSet, commands, _fn, _len6, _len7, _o, _p, _ref2, _ref3;
      this.disposables = new CompositeDisposable();
      this.decorations = [];
      this.commands = new CompositeDisposable();
      this.commands.add(atom.commands.add('atom-workspace', {
        'jumpy:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'jumpy:reset': (function(_this) {
          return function() {
            return _this.reset();
          };
        })(this),
        'jumpy:clear': (function(_this) {
          return function() {
            return _this.clearJumpMode();
          };
        })(this)
      }));
      commands = {};
      _ref2 = [lowerCharacters, upperCharacters];
      for (_o = 0, _len6 = _ref2.length; _o < _len6; _o++) {
        characterSet = _ref2[_o];
        _fn = (function(_this) {
          return function(c) {
            return commands['jumpy:' + c] = function() {
              return _this.getKey(c);
            };
          };
        })(this);
        for (_p = 0, _len7 = characterSet.length; _p < _len7; _p++) {
          c = characterSet[_p];
          _fn(c);
        }
      }
      this.commands.add(atom.commands.add('atom-workspace', commands));
      this.backedUpKeyBindings = _.clone(atom.keymaps.keyBindings);
      this.workspaceElement = atom.views.getView(atom.workspace);
      this.statusBar = document.querySelector('status-bar');
      if ((_ref3 = this.statusBar) != null) {
        _ref3.addLeftTile({
          item: $('<div id="status-bar-jumpy" class="inline-block"></div>'),
          priority: -1
        });
      }
      return this.statusBarJumpy = document.getElementById('status-bar-jumpy');
    };

    JumpyView.prototype.getKey = function(character) {
      var isMatchOfCurrentLabels, labelPosition, _ref2, _ref3, _ref4, _ref5;
      if ((_ref2 = this.statusBarJumpy) != null) {
        _ref2.classList.remove('no-match');
      }
      isMatchOfCurrentLabels = (function(_this) {
        return function(character, labelPosition) {
          var found;
          found = false;
          _this.disposables.add(atom.workspace.observeTextEditors(function(editor) {
            var decoration, editorView, element, _len6, _o, _ref3;
            editorView = atom.views.getView(editor);
            if ($(editorView).is(':not(:visible)')) {
              return;
            }
            _ref3 = _this.decorations;
            for (_o = 0, _len6 = _ref3.length; _o < _len6; _o++) {
              decoration = _ref3[_o];
              element = decoration.getProperties().item;
              if (element.textContent[labelPosition] === character) {
                found = true;
                return false;
              }
            }
          }));
          return found;
        };
      })(this);
      labelPosition = (!this.firstChar ? 0 : 1);
      if (!isMatchOfCurrentLabels(character, labelPosition)) {
        if ((_ref3 = this.statusBarJumpy) != null) {
          _ref3.classList.add('no-match');
        }
        if ((_ref4 = this.statusBarJumpyStatus) != null) {
          _ref4.innerHTML = 'No match!';
        }
        return;
      }
      if (!this.firstChar) {
        this.firstChar = character;
        if ((_ref5 = this.statusBarJumpyStatus) != null) {
          _ref5.innerHTML = this.firstChar;
        }
        this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var decoration, editorView, element, _len6, _o, _ref6, _results;
            editorView = atom.views.getView(editor);
            if ($(editorView).is(':not(:visible)')) {
              return;
            }
            _ref6 = _this.decorations;
            _results = [];
            for (_o = 0, _len6 = _ref6.length; _o < _len6; _o++) {
              decoration = _ref6[_o];
              element = decoration.getProperties().item;
              if (element.textContent.indexOf(_this.firstChar) !== 0) {
                _results.push(element.classList.add('irrelevant'));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this)));
      } else if (!this.secondChar) {
        this.secondChar = character;
      }
      if (this.secondChar) {
        this.jump();
        return this.clearJumpMode();
      }
    };

    JumpyView.prototype.clearKeys = function() {
      this.firstChar = null;
      return this.secondChar = null;
    };

    JumpyView.prototype.reset = function() {
      var decoration, _len6, _o, _ref2, _ref3, _ref4;
      this.clearKeys();
      _ref2 = this.decorations;
      for (_o = 0, _len6 = _ref2.length; _o < _len6; _o++) {
        decoration = _ref2[_o];
        decoration.getProperties().item.classList.remove('irrelevant');
      }
      if ((_ref3 = this.statusBarJumpy) != null) {
        _ref3.classList.remove('no-match');
      }
      return (_ref4 = this.statusBarJumpyStatus) != null ? _ref4.innerHTML = 'Jump Mode!' : void 0;
    };

    JumpyView.prototype.getFilteredJumpyKeys = function() {
      return atom.keymaps.keyBindings.filter(function(keymap) {
        if (typeof keymap.command === 'string') {
          return keymap.command.includes('jumpy');
        }
      });
    };

    JumpyView.prototype.turnOffSlowKeys = function() {
      return atom.keymaps.keyBindings = this.getFilteredJumpyKeys();
    };

    JumpyView.prototype.toggle = function() {
      var fontSize, highContrast, nextKeys, wordsPattern, _ref2, _ref3;
      this.clearJumpMode();
      this.cleared = false;
      wordsPattern = new RegExp(atom.config.get('jumpy.matchPattern'), 'g');
      fontSize = atom.config.get('jumpy.fontSize');
      if (isNaN(fontSize) || fontSize > 1) {
        fontSize = .75;
      }
      fontSize = (fontSize * 100) + '%';
      highContrast = atom.config.get('jumpy.highContrast');
      this.turnOffSlowKeys();
      if ((_ref2 = this.statusBarJumpy) != null) {
        _ref2.classList.remove('no-match');
      }
      if ((_ref3 = this.statusBarJumpy) != null) {
        _ref3.innerHTML = 'Jumpy: <span class="status">Jump Mode!</span>';
      }
      this.statusBarJumpyStatus = document.querySelector('#status-bar-jumpy .status');
      this.allPositions = {};
      nextKeys = _.clone(keys);
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var $editorView, column, drawLabels, editorView, firstVisibleRow, getVisibleColumnRange, lastVisibleRow, lineContents, lineNumber, maxColumn, minColumn, rows, word, _o, _ref4;
          editorView = atom.views.getView(editor);
          $editorView = $(editorView);
          if ($editorView.is(':not(:visible)')) {
            return;
          }
          editorView.classList.add('jumpy-jump-mode');
          getVisibleColumnRange = function(editorView) {
            var charWidth, maxColumn, minColumn;
            charWidth = editorView.getDefaultCharacterWidth();
            minColumn = (editorView.getScrollLeft() / charWidth) - 1;
            maxColumn = editorView.getScrollRight() / charWidth;
            return [minColumn, maxColumn];
          };
          drawLabels = function(lineNumber, column) {
            var decoration, keyLabel, labelElement, marker, position;
            if (!nextKeys.length) {
              return;
            }
            keyLabel = nextKeys.shift();
            position = {
              row: lineNumber,
              column: column
            };
            _this.allPositions[keyLabel] = {
              editor: editor.id,
              position: position
            };
            marker = editor.markScreenRange(new Range(new Point(lineNumber, column), new Point(lineNumber, column)), {
              invalidate: 'touch'
            });
            labelElement = document.createElement('div');
            labelElement.textContent = keyLabel;
            labelElement.style.fontSize = fontSize;
            labelElement.classList.add('jumpy-label');
            if (highContrast) {
              labelElement.classList.add('high-contrast');
            }
            decoration = editor.decorateMarker(marker, {
              type: 'overlay',
              item: labelElement,
              position: 'head'
            });
            return _this.decorations.push(decoration);
          };
          _ref4 = getVisibleColumnRange(editorView), minColumn = _ref4[0], maxColumn = _ref4[1];
          rows = editor.getVisibleRowRange();
          if (rows) {
            firstVisibleRow = rows[0], lastVisibleRow = rows[1];
            for (lineNumber = _o = firstVisibleRow; firstVisibleRow <= lastVisibleRow ? _o < lastVisibleRow : _o > lastVisibleRow; lineNumber = firstVisibleRow <= lastVisibleRow ? ++_o : --_o) {
              lineContents = editor.lineTextForScreenRow(lineNumber);
              if (editor.isFoldedAtScreenRow(lineNumber)) {
                drawLabels(lineNumber, 0);
              } else {
                while ((word = wordsPattern.exec(lineContents)) !== null) {
                  column = word.index;
                  if (column > minColumn && column < maxColumn) {
                    drawLabels(lineNumber, column);
                  }
                }
              }
            }
          }
          return _this.initializeClearEvents(editorView);
        };
      })(this)));
    };

    JumpyView.prototype.clearJumpModeHandler = function() {
      return this.clearJumpMode();
    };

    JumpyView.prototype.initializeClearEvents = function(editorView) {
      var e, _len6, _o, _ref2, _results;
      this.disposables.add(editorView.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.clearJumpModeHandler();
        };
      })(this)));
      this.disposables.add(editorView.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.clearJumpModeHandler();
        };
      })(this)));
      _ref2 = ['blur', 'click'];
      _results = [];
      for (_o = 0, _len6 = _ref2.length; _o < _len6; _o++) {
        e = _ref2[_o];
        _results.push(editorView.addEventListener(e, this.clearJumpModeHandler, true));
      }
      return _results;
    };

    JumpyView.prototype.clearJumpMode = function() {
      var clearAllMarkers, _ref2, _ref3;
      clearAllMarkers = (function(_this) {
        return function() {
          var decoration, _len6, _o, _ref2;
          _ref2 = _this.decorations;
          for (_o = 0, _len6 = _ref2.length; _o < _len6; _o++) {
            decoration = _ref2[_o];
            decoration.getMarker().destroy();
          }
          return _this.decorations = [];
        };
      })(this);
      if (this.cleared) {
        return;
      }
      this.cleared = true;
      this.clearKeys();
      if ((_ref2 = this.statusBarJumpy) != null) {
        _ref2.innerHTML = '';
      }
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var e, editorView, _len6, _o, _ref3, _results;
          editorView = atom.views.getView(editor);
          editorView.classList.remove('jumpy-jump-mode');
          _ref3 = ['blur', 'click'];
          _results = [];
          for (_o = 0, _len6 = _ref3.length; _o < _len6; _o++) {
            e = _ref3[_o];
            _results.push(editorView.removeEventListener(e, _this.clearJumpModeHandler, true));
          }
          return _results;
        };
      })(this)));
      atom.keymaps.keyBindings = this.backedUpKeyBindings;
      clearAllMarkers();
      if ((_ref3 = this.disposables) != null) {
        _ref3.dispose();
      }
      return this.detach();
    };

    JumpyView.prototype.jump = function() {
      var location;
      location = this.findLocation();
      if (location === null) {
        return;
      }
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(currentEditor) {
          var editorView, isSelected, isVisualMode, pane;
          editorView = atom.views.getView(currentEditor);
          if (currentEditor.id !== location.editor) {
            return;
          }
          pane = atom.workspace.paneForItem(currentEditor);
          pane.activate();
          isVisualMode = editorView.classList.contains('visual-mode');
          isSelected = currentEditor.getSelections().length === 1 && currentEditor.getSelectedText() !== '';
          if (isVisualMode || isSelected) {
            currentEditor.selectToScreenPosition(location.position);
          } else {
            currentEditor.setCursorScreenPosition(location.position);
          }
          if (atom.config.get('jumpy.useHomingBeaconEffectOnJumps')) {
            return _this.drawBeacon(currentEditor, location);
          }
        };
      })(this)));
    };

    JumpyView.prototype.drawBeacon = function(editor, location) {
      var beacon, marker, range;
      range = Range(location.position, location.position);
      marker = editor.markScreenRange(range, {
        invalidate: 'never'
      });
      beacon = document.createElement('span');
      beacon.classList.add('beacon');
      editor.decorateMarker(marker, {
        item: beacon,
        type: 'overlay'
      });
      return setTimeout(function() {
        return marker.destroy();
      }, 150);
    };

    JumpyView.prototype.findLocation = function() {
      var label;
      label = "" + this.firstChar + this.secondChar;
      if (label in this.allPositions) {
        return this.allPositions[label];
      }
      return null;
    };

    JumpyView.prototype.serialize = function() {};

    JumpyView.prototype.destroy = function() {
      var _ref2;
      if ((_ref2 = this.commands) != null) {
        _ref2.dispose();
      }
      return this.clearJumpMode();
    };

    return JumpyView;

  })(View);

  module.exports = JumpyView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvanVtcHkvbGliL2p1bXB5LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUE7QUFBQSxpQkFBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLHlMQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQ0EsT0FBc0MsT0FBQSxDQUFRLE1BQVIsQ0FBdEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixhQUFBLEtBQXRCLEVBQTZCLGFBQUEsS0FEN0IsQ0FBQTs7QUFBQSxFQUVBLFFBQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLGFBQUEsSUFBRCxFQUFPLFVBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSEosQ0FBQTs7QUFBQSxFQUtBLGVBQUE7O0FBQ0s7U0FBZ0MseUlBQWhDLEdBQUE7QUFBQSxvQkFBQSxNQUFNLENBQUMsWUFBUCxDQUFvQixDQUFwQixFQUFBLENBQUE7QUFBQTs7TUFOTCxDQUFBOztBQUFBLEVBT0EsZUFBQTs7QUFDSztTQUFnQyx5SUFBaEMsR0FBQTtBQUFBLG9CQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQXBCLEVBQUEsQ0FBQTtBQUFBOztNQVJMLENBQUE7O0FBQUEsRUFTQSxJQUFBLEdBQU8sRUFUUCxDQUFBOztBQWNBLE9BQUEsc0RBQUE7NkJBQUE7QUFDSSxTQUFBLHdEQUFBOytCQUFBO0FBQ0ksTUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUEsR0FBSyxFQUFmLENBQUEsQ0FESjtBQUFBLEtBREo7QUFBQSxHQWRBOztBQWlCQSxPQUFBLHdEQUFBOzZCQUFBO0FBQ0ksU0FBQSx3REFBQTsrQkFBQTtBQUNJLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFBLEdBQUssRUFBZixDQUFBLENBREo7QUFBQSxLQURKO0FB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

//# sourceURL=/home/nikke/.atom/packages/jumpy/lib/jumpy-view.coffee
