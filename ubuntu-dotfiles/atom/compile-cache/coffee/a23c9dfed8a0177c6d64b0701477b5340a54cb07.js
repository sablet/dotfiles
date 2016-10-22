(function() {
  var AutocompleteProvider, CodeManager, CompositeDisposable, Config, Emitter, Hydrogen, HydrogenProvider, Inspector, KernelManager, KernelPicker, ResultView, SignalListView, WSKernelPicker, _, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ = require('lodash');

  ResultView = require('./result-view');

  SignalListView = require('./signal-list-view');

  KernelPicker = require('./kernel-picker');

  WSKernelPicker = require('./ws-kernel-picker');

  CodeManager = require('./code-manager');

  Config = require('./config');

  KernelManager = require('./kernel-manager');

  Inspector = require('./inspector');

  AutocompleteProvider = require('./autocomplete-provider');

  HydrogenProvider = require('./plugin-api/hydrogen-provider');

  module.exports = Hydrogen = {
    config: Config.schema,
    subscriptions: null,
    kernelManager: null,
    inspector: null,
    editor: null,
    kernel: null,
    markerBubbleMap: null,
    statusBarElement: null,
    statusBarTile: null,
    watchSidebar: null,
    watchSidebarIsVisible: false,
    activate: function(state) {
      this.emitter = new Emitter();
      this.kernelManager = new KernelManager();
      this.codeManager = new CodeManager();
      this.inspector = new Inspector(this.kernelManager, this.codeManager);
      this.markerBubbleMap = {};
      this.statusBarElement = document.createElement('div');
      this.statusBarElement.classList.add('hydrogen');
      this.statusBarElement.classList.add('status-container');
      this.statusBarElement.onclick = this.showKernelCommands.bind(this);
      this.onEditorChanged(atom.workspace.getActiveTextEditor());
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'hydrogen:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this),
        'hydrogen:run-all': (function(_this) {
          return function() {
            return _this.runAll();
          };
        })(this),
        'hydrogen:run-all-above': (function(_this) {
          return function() {
            return _this.runAllAbove();
          };
        })(this),
        'hydrogen:run-and-move-down': (function(_this) {
          return function() {
            return _this.run(true);
          };
        })(this),
        'hydrogen:run-cell': (function(_this) {
          return function() {
            return _this.runCell();
          };
        })(this),
        'hydrogen:run-cell-and-move-down': (function(_this) {
          return function() {
            return _this.runCell(true);
          };
        })(this),
        'hydrogen:toggle-watches': (function(_this) {
          return function() {
            return _this.toggleWatchSidebar();
          };
        })(this),
        'hydrogen:select-kernel': (function(_this) {
          return function() {
            return _this.showKernelPicker();
          };
        })(this),
        'hydrogen:connect-to-remote-kernel': (function(_this) {
          return function() {
            return _this.showWSKernelPicker();
          };
        })(this),
        'hydrogen:add-watch': (function(_this) {
          return function() {
            var _ref1;
            if (!_this.watchSidebarIsVisible) {
              _this.toggleWatchSidebar();
            }
            return (_ref1 = _this.watchSidebar) != null ? _ref1.addWatchFromEditor() : void 0;
          };
        })(this),
        'hydrogen:remove-watch': (function(_this) {
          return function() {
            var _ref1;
            if (!_this.watchSidebarIsVisible) {
              _this.toggleWatchSidebar();
            }
            return (_ref1 = _this.watchSidebar) != null ? _ref1.removeWatch() : void 0;
          };
        })(this),
        'hydrogen:update-kernels': (function(_this) {
          return function() {
            return _this.kernelManager.updateKernelSpecs();
          };
        })(this),
        'hydrogen:toggle-inspector': (function(_this) {
          return function() {
            return _this.inspector.toggle();
          };
        })(this),
        'hydrogen:interrupt-kernel': (function(_this) {
          return function() {
            return _this.handleKernelCommand({
              command: 'interrupt-kernel'
            });
          };
        })(this),
        'hydrogen:restart-kernel': (function(_this) {
          return function() {
            return _this.handleKernelCommand({
              command: 'restart-kernel'
            });
          };
        })(this),
        'hydrogen:shutdown-kernel': (function(_this) {
          return function() {
            return _this.handleKernelCommand({
              command: 'shutdown-kernel'
            });
          };
        })(this),
        'hydrogen:copy-path-to-connection-file': (function(_this) {
          return function() {
            return _this.copyPathToConnectionFile();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'hydrogen:clear-results': (function(_this) {
          return function() {
            return _this.clearResultBubbles();
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function(item) {
          if (item && item === atom.workspace.getActiveTextEditor()) {
            return _this.onEditorChanged(item);
          }
        };
      })(this)));
      return this.hydrogenProvider = null;
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.kernelManager.destroy();
      return this.statusBarTile.destroy();
    },
    provideHydrogen: function() {
      if (this.hydrogenProvider == null) {
        this.hydrogenProvider = new HydrogenProvider(this);
      }
      return this.hydrogenProvider;
    },
    consumeStatusBar: function(statusBar) {
      return this.statusBarTile = statusBar.addLeftTile({
        item: this.statusBarElement,
        priority: 100
      });
    },
    provide: function() {
      if (atom.config.get('Hydrogen.autocomplete') === true) {
        return AutocompleteProvider(this.kernelManager);
      }
    },
    onEditorChanged: function(editor) {
      var grammar, kernel, language;
      this.editor = editor;
      if (this.editor) {
        grammar = this.editor.getGrammar();
        language = this.kernelManager.getLanguageFor(grammar);
        kernel = this.kernelManager.getRunningKernelFor(language);
        this.codeManager.editor = this.editor;
      }
      if (this.kernel !== kernel) {
        return this.onKernelChanged(kernel);
      }
    },
    onKernelChanged: function(kernel) {
      this.kernel = kernel;
      this.setStatusBar();
      this.setWatchSidebar(this.kernel);
      return this.emitter.emit('did-change-kernel', this.kernel);
    },
    setStatusBar: function() {
      if (this.statusBarElement == null) {
        console.error('setStatusBar: there is no status bar');
        return;
      }
      this.clearStatusBar();
      if (this.kernel != null) {
        return this.statusBarElement.appendChild(this.kernel.statusView.element);
      }
    },
    clearStatusBar: function() {
      var _results;
      if (this.statusBarElement == null) {
        console.error('clearStatusBar: there is no status bar');
        return;
      }
      _results = [];
      while (this.statusBarElement.hasChildNodes()) {
        _results.push(this.statusBarElement.removeChild(this.statusBarElement.lastChild));
      }
      return _results;
    },
    setWatchSidebar: function(kernel) {
      var sidebar, _ref1, _ref2;
      console.log('setWatchSidebar:', kernel);
      sidebar = kernel != null ? kernel.watchSidebar : void 0;
      if (this.watchSidebar === sidebar) {
        return;
      }
      if ((_ref1 = this.watchSidebar) != null ? _ref1.visible : void 0) {
        this.watchSidebar.hide();
      }
      this.watchSidebar = sidebar;
      if (this.watchSidebarIsVisible) {
        return (_ref2 = this.watchSidebar) != null ? _ref2.show() : void 0;
      }
    },
    toggleWatchSidebar: function() {
      var _ref1, _ref2;
      if (this.watchSidebarIsVisible) {
        console.log('toggleWatchSidebar: hiding sidebar');
        this.watchSidebarIsVisible = false;
        return (_ref1 = this.watchSidebar) != null ? _ref1.hide() : void 0;
      } else {
        console.log('toggleWatchSidebar: showing sidebar');
        this.watchSidebarIsVisible = true;
        return (_ref2 = this.watchSidebar) != null ? _ref2.show() : void 0;
      }
    },
    showKernelCommands: function() {
      if (this.signalListView == null) {
        this.signalListView = new SignalListView(this.kernelManager);
        this.signalListView.onConfirmed = (function(_this) {
          return function(kernelCommand) {
            return _this.handleKernelCommand(kernelCommand);
          };
        })(this);
      }
      return this.signalListView.toggle();
    },
    handleKernelCommand: function(_arg) {
      var command, grammar, kernel, kernelSpec, language, message;
      kernel = _arg.kernel, command = _arg.command, grammar = _arg.grammar, language = _arg.language, kernelSpec = _arg.kernelSpec;
      console.log('handleKernelCommand:', arguments);
      if (!grammar) {
        grammar = this.editor.getGrammar();
      }
      if (!language) {
        language = this.kernelManager.getLanguageFor(grammar);
      }
      if (!kernel) {
        kernel = this.kernelManager.getRunningKernelFor(language);
      }
      if (!kernel) {
        message = "No running kernel for language `" + language + "` found";
        atom.notifications.addError(message);
        return;
      }
      if (command === 'interrupt-kernel') {
        return kernel.interrupt();
      } else if (command === 'restart-kernel') {
        this.clearResultBubbles();
        return this.kernelManager.restartRunningKernelFor(grammar, (function(_this) {
          return function(kernel) {
            return _this.onKernelChanged(kernel);
          };
        })(this));
      } else if (command === 'shutdown-kernel') {
        this.clearResultBubbles();
        kernel.shutdown();
        this.kernelManager.destroyRunningKernelFor(grammar);
        return this.onKernelChanged();
      } else if (command === 'switch-kernel') {
        this.clearResultBubbles();
        this.kernelManager.destroyRunningKernelFor(grammar);
        return this.kernelManager.startKernel(kernelSpec, grammar, (function(_this) {
          return function(kernel) {
            return _this.onKernelChanged(kernel);
          };
        })(this));
      } else if (command === 'rename-kernel') {
        return typeof kernel.promptRename === "function" ? kernel.promptRename() : void 0;
      } else if (command === 'disconnect-kernel') {
        this.clearResultBubbles();
        this.kernelManager.destroyRunningKernelFor(grammar);
        return this.onKernelChanged();
      }
    },
    createResultBubble: function(code, row) {
      if (this.kernel) {
        this._createResultBubble(this.kernel, code, row);
        return;
      }
      return this.kernelManager.startKernelFor(this.editor.getGrammar(), (function(_this) {
        return function(kernel) {
          _this.onKernelChanged(kernel);
          return _this._createResultBubble(kernel, code, row);
        };
      })(this));
    },
    _createResultBubble: function(kernel, code, row) {
      var view;
      if (this.watchSidebar.element.contains(document.activeElement)) {
        this.watchSidebar.run();
        return;
      }
      this.clearBubblesOnRow(row);
      view = this.insertResultBubble(row);
      return kernel.execute(code, function(result) {
        view.spin(false);
        return view.addResult(result);
      });
    },
    insertResultBubble: function(row) {
      var buffer, element, lineHeight, lineLength, marker, view;
      buffer = this.editor.getBuffer();
      lineLength = buffer.lineLengthForRow(row);
      marker = this.editor.markBufferPosition({
        row: row,
        column: lineLength
      }, {
        invalidate: 'touch'
      });
      view = new ResultView(marker);
      view.spin(true);
      element = view.element;
      lineHeight = this.editor.getLineHeightInPixels();
      view.spinner.setAttribute('style', "width: " + (lineHeight + 2) + "px; height: " + (lineHeight - 4) + "px;");
      view.statusContainer.setAttribute('style', "height: " + lineHeight + "px");
      element.setAttribute('style', "margin-left: " + (lineLength + 1) + "ch; margin-top: -" + lineHeight + "px");
      this.editor.decorateMarker(marker, {
        type: 'block',
        item: element,
        position: 'after'
      });
      this.markerBubbleMap[marker.id] = view;
      marker.onDidChange((function(_this) {
        return function(event) {
          console.log('marker.onDidChange:', marker);
          if (!event.isValid) {
            view.destroy();
            marker.destroy();
            return delete _this.markerBubbleMap[marker.id];
          } else {
            if (!element.classList.contains('multiline')) {
              lineLength = marker.getStartBufferPosition()['column'];
              return element.setAttribute('style', "margin-left: " + (lineLength + 1) + "ch; margin-top: -" + lineHeight + "px");
            }
          }
        };
      })(this));
      return view;
    },
    clearResultBubbles: function() {
      _.forEach(this.markerBubbleMap, function(bubble) {
        return bubble.destroy();
      });
      return this.markerBubbleMap = {};
    },
    clearBubblesOnRow: function(row) {
      console.log('clearBubblesOnRow:', row);
      return _.forEach(this.markerBubbleMap, (function(_this) {
        return function(bubble) {
          var marker, range;
          marker = bubble.marker;
          range = marker.getBufferRange();
          if ((range.start.row <= row && row <= range.end.row)) {
            console.log('clearBubblesOnRow:', row, bubble);
            bubble.destroy();
            return delete _this.markerBubbleMap[marker.id];
          }
        };
      })(this));
    },
    run: function(moveDown) {
      var code, codeBlock, row;
      if (moveDown == null) {
        moveDown = false;
      }
      codeBlock = this.codeManager.findCodeBlock();
      if (codeBlock == null) {
        return;
      }
      code = codeBlock[0], row = codeBlock[1];
      if ((code != null) && (row != null)) {
        if (moveDown === true) {
          this.codeManager.moveDown(row);
        }
        return this.createResultBubble(code, row);
      }
    },
    runAll: function() {
      if (this.kernel) {
        this._runAll(this.kernel);
        return;
      }
      return this.kernelManager.startKernelFor(this.editor.getGrammar(), (function(_this) {
        return function(kernel) {
          _this.onKernelChanged(kernel);
          return _this._runAll(kernel);
        };
      })(this));
    },
    _runAll: function(kernel) {
      var breakpoints, code, end, endRow, i, start, _i, _ref1, _results;
      breakpoints = this.codeManager.getBreakpoints();
      _results = [];
      for (i = _i = 1, _ref1 = breakpoints.length; 1 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
        start = breakpoints[i - 1];
        end = breakpoints[i];
        code = this.codeManager.getTextInRange(start, end);
        endRow = this.codeManager.escapeBlankRows(start.row, end.row);
        _results.push(this._createResultBubble(kernel, code, endRow));
      }
      return _results;
    },
    runAllAbove: function() {
      var code, cursor, row;
      cursor = this.editor.getLastCursor();
      row = this.codeManager.escapeBlankRows(0, cursor.getBufferRow());
      code = this.codeManager.getRows(0, row);
      if ((code != null) && (row != null)) {
        return this.createResultBubble(code, row);
      }
    },
    runCell: function(moveDown) {
      var code, end, endRow, start, _ref1;
      if (moveDown == null) {
        moveDown = false;
      }
      _ref1 = this.codeManager.getCurrentCell(), start = _ref1[0], end = _ref1[1];
      code = this.codeManager.getTextInRange(start, end);
      endRow = this.codeManager.escapeBlankRows(start.row, end.row);
      if (code != null) {
        if (moveDown === true) {
          this.codeManager.moveDown(endRow);
        }
        return this.createResultBubble(code, endRow);
      }
    },
    showKernelPicker: function() {
      if (this.kernelPicker == null) {
        this.kernelPicker = new KernelPicker((function(_this) {
          return function(callback) {
            var grammar, language;
            grammar = _this.editor.getGrammar();
            language = _this.kernelManager.getLanguageFor(grammar);
            return _this.kernelManager.getAllKernelSpecsFor(language, function(kernelSpecs) {
              return callback(kernelSpecs);
            });
          };
        })(this));
        this.kernelPicker.onConfirmed = (function(_this) {
          return function(_arg) {
            var kernelSpec;
            kernelSpec = _arg.kernelSpec;
            return _this.handleKernelCommand({
              command: 'switch-kernel',
              kernelSpec: kernelSpec
            });
          };
        })(this);
      }
      return this.kernelPicker.toggle();
    },
    showWSKernelPicker: function() {
      var grammar, language;
      if (this.wsKernelPicker == null) {
        this.wsKernelPicker = new WSKernelPicker((function(_this) {
          return function(kernel) {
            var grammar;
            _this.clearResultBubbles();
            grammar = kernel.grammar;
            _this.kernelManager.destroyRunningKernelFor(grammar);
            _this.kernelManager.setRunningKernelFor(grammar, kernel);
            return _this.onKernelChanged(kernel);
          };
        })(this));
      }
      grammar = this.editor.getGrammar();
      language = this.kernelManager.getLanguageFor(grammar);
      return this.wsKernelPicker.toggle(grammar, (function(_this) {
        return function(kernelSpec) {
          return _this.kernelManager.kernelSpecProvidesLanguage(kernelSpec, language);
        };
      })(this));
    },
    copyPathToConnectionFile: function() {
      var connectionFile, description, grammar, language, message;
      grammar = this.editor.getGrammar();
      language = this.kernelManager.getLanguageFor(grammar);
      if (this.kernel == null) {
        message = "No running kernel for language `" + language + "` found";
        atom.notifications.addError(message);
        return;
      }
      connectionFile = this.kernel.connectionFile;
      if (connectionFile == null) {
        atom.notifications.addError("No connection file for " + this.kernel.kernelSpec.display_name + " kernel found");
        return;
      }
      atom.clipboard.write(connectionFile);
      message = 'Path to connection file copied to clipboard.';
      description = "Use `jupyter console --existing " + connectionFile + "` to connect to the running kernel.";
      return atom.notifications.addSuccess(message, {
        description: description
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGdNQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixlQUFBLE9BQXRCLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FGSixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBTGpCLENBQUE7O0FBQUEsRUFNQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBTmYsQ0FBQTs7QUFBQSxFQU9BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBUGpCLENBQUE7O0FBQUEsRUFRQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBUmQsQ0FBQTs7QUFBQSxFQVVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQVZULENBQUE7O0FBQUEsRUFXQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQVhoQixDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBWlosQ0FBQTs7QUFBQSxFQWFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSx5QkFBUixDQWJ2QixDQUFBOztBQUFBLEVBZUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLGdDQUFSLENBZm5CLENBQUE7O0FBQUEsRUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBQSxHQUNiO0FBQUEsSUFBQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE1BQWY7QUFBQSxJQUNBLGFBQUEsRUFBZSxJQURmO0FBQUEsSUFHQSxhQUFB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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/main.coffee
