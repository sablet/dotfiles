(function() {
  var CompositeDisposable, Emitter, ListView, TermView, Terminals, capitalize, config, getColors, keypather, path;

  path = require('path');

  TermView = require('./lib/term-view');

  ListView = require('./lib/build/list-view');

  Terminals = require('./lib/terminal-model');

  Emitter = require('event-kit').Emitter;

  keypather = require('keypather')();

  CompositeDisposable = require('event-kit').CompositeDisposable;

  capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  getColors = function() {
    var background, brightBlack, brightBlue, brightCyan, brightGreen, brightPurple, brightRed, brightWhite, brightYellow, foreground, normalBlack, normalBlue, normalCyan, normalGreen, normalPurple, normalRed, normalWhite, normalYellow, _ref;
    _ref = (atom.config.getAll('term3.colors'))[0].value, normalBlack = _ref.normalBlack, normalRed = _ref.normalRed, normalGreen = _ref.normalGreen, normalYellow = _ref.normalYellow, normalBlue = _ref.normalBlue, normalPurple = _ref.normalPurple, normalCyan = _ref.normalCyan, normalWhite = _ref.normalWhite, brightBlack = _ref.brightBlack, brightRed = _ref.brightRed, brightGreen = _ref.brightGreen, brightYellow = _ref.brightYellow, brightBlue = _ref.brightBlue, brightPurple = _ref.brightPurple, brightCyan = _ref.brightCyan, brightWhite = _ref.brightWhite, background = _ref.background, foreground = _ref.foreground;
    return [normalBlack, normalRed, normalGreen, normalYellow, normalBlue, normalPurple, normalCyan, normalWhite, brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightPurple, brightCyan, brightWhite, background, foreground].map(function(color) {
      return color.toHexString();
    });
  };

  config = {
    autoRunCommand: {
      type: 'string',
      "default": ''
    },
    titleTemplate: {
      type: 'string',
      "default": "Terminal ({{ bashName }})"
    },
    fontFamily: {
      type: 'string',
      "default": ''
    },
    fontSize: {
      type: 'string',
      "default": ''
    },
    colors: {
      type: 'object',
      properties: {
        normalBlack: {
          type: 'color',
          "default": '#2e3436'
        },
        normalRed: {
          type: 'color',
          "default": '#cc0000'
        },
        normalGreen: {
          type: 'color',
          "default": '#4e9a06'
        },
        normalYellow: {
          type: 'color',
          "default": '#c4a000'
        },
        normalBlue: {
          type: 'color',
          "default": '#3465a4'
        },
        normalPurple: {
          type: 'color',
          "default": '#75507b'
        },
        normalCyan: {
          type: 'color',
          "default": '#06989a'
        },
        normalWhite: {
          type: 'color',
          "default": '#d3d7cf'
        },
        brightBlack: {
          type: 'color',
          "default": '#555753'
        },
        brightRed: {
          type: 'color',
          "default": '#ef2929'
        },
        brightGreen: {
          type: 'color',
          "default": '#8ae234'
        },
        brightYellow: {
          type: 'color',
          "default": '#fce94f'
        },
        brightBlue: {
          type: 'color',
          "default": '#729fcf'
        },
        brightPurple: {
          type: 'color',
          "default": '#ad7fa8'
        },
        brightCyan: {
          type: 'color',
          "default": '#34e2e2'
        },
        brightWhite: {
          type: 'color',
          "default": '#eeeeec'
        },
        background: {
          type: 'color',
          "default": '#000000'
        },
        foreground: {
          type: 'color',
          "default": '#f0f0f0'
        }
      }
    },
    scrollback: {
      type: 'integer',
      "default": 1000
    },
    cursorBlink: {
      type: 'boolean',
      "default": true
    },
    shellOverride: {
      type: 'string',
      "default": ''
    },
    shellArguments: {
      type: 'string',
      "default": (function(_arg) {
        var HOME, SHELL;
        SHELL = _arg.SHELL, HOME = _arg.HOME;
        switch (path.basename(SHELL && SHELL.toLowerCase())) {
          case 'bash':
            return "--init-file " + (path.join(HOME, '.bash_profile'));
          case 'zsh':
            return "-l";
          default:
            return '';
        }
      })(process.env)
    },
    openPanesInSameSplit: {
      type: 'boolean',
      "default": false
    }
  };

  module.exports = {
    termViews: [],
    focusedTerminal: false,
    emitter: new Emitter(),
    config: config,
    disposables: null,
    activate: function(state) {
      this.state = state;
      this.disposables = new CompositeDisposable();
      if (!process.env.LANG) {
        console.warn("Term3: LANG environment variable is not set. Fancy characters (å, ñ, ó, etc`) may be corrupted. The only work-around is to quit Atom and run `atom` from your shell.");
      }
      ['up', 'right', 'down', 'left'].forEach((function(_this) {
        return function(direction) {
          return _this.disposables.add(atom.commands.add("atom-workspace", "term3:open-split-" + direction, _this.splitTerm.bind(_this, direction)));
        };
      })(this));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:open", this.newTerm.bind(this)));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:pipe-path", this.pipeTerm.bind(this, 'path')));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:pipe-selection", this.pipeTerm.bind(this, 'selection')));
      return atom.packages.activatePackage('tree-view').then((function(_this) {
        return function(treeViewPkg) {
          var node;
          node = new ListView();
          return treeViewPkg.mainModule.treeView.find(".tree-view-scroller").prepend(node);
        };
      })(this));
    },
    service_0_1_3: function() {
      return {
        getTerminals: this.getTerminals.bind(this),
        onTerm: this.onTerm.bind(this),
        newTerm: this.newTerm.bind(this)
      };
    },
    getTerminals: function() {
      return Terminals.map(function(t) {
        return t.term;
      });
    },
    onTerm: function(callback) {
      return this.emitter.on('term', callback);
    },
    attachSubscriptions: function(termView, item, pane) {
      var focusNextTick, subscriptions;
      subscriptions = new CompositeDisposable;
      focusNextTick = function(activeItem) {
        return process.nextTick(function() {
          var atomPane;
          termView.focus();
          atomPane = activeItem.parentsUntil("atom-pane").parent()[0];
          if (termView.term) {
            return termView.term.constructor._textarea = atomPane;
          }
        });
      };
      subscriptions.add(pane.onDidActivate(function() {
        var activeItem;
        activeItem = pane.getActiveItem();
        if (activeItem !== item) {
          return;
        }
        this.focusedTerminal = termView;
        termView.focus();
        return focusNextTick(activeItem);
      }));
      subscriptions.add(pane.onDidChangeActiveItem(function(activeItem) {
        if (activeItem !== termView) {
          if (termView.term) {
            termView.term.constructor._textarea = null;
          }
          return;
        }
        return focusNextTick(activeItem);
      }));
      subscriptions.add(termView.onExit(function() {
        return Terminals.remove(termView.id);
      }));
      subscriptions.add(pane.onWillRemoveItem((function(_this) {
        return function(itemRemoved, index) {
          if (itemRemoved.item === item) {
            item.destroy();
            Terminals.remove(termView.id);
            _this.disposables.remove(subscriptions);
            return subscriptions.dispose();
          }
        };
      })(this)));
      return subscriptions;
    },
    newTerm: function(forkPTY, rows, cols, title) {
      var item, pane, termView;
      if (forkPTY == null) {
        forkPTY = true;
      }
      if (rows == null) {
        rows = 30;
      }
      if (cols == null) {
        cols = 80;
      }
      if (title == null) {
        title = 'tty';
      }
      termView = this.createTermView(forkPTY, rows, cols, title);
      pane = atom.workspace.getActivePane();
      item = pane.addItem(termView);
      this.disposables.add(this.attachSubscriptions(termView, item, pane));
      pane.activateItem(item);
      return termView;
    },
    createTermView: function(forkPTY, rows, cols, title) {
      var editorPath, id, model, opts, termView, _base;
      if (forkPTY == null) {
        forkPTY = true;
      }
      if (rows == null) {
        rows = 30;
      }
      if (cols == null) {
        cols = 80;
      }
      if (title == null) {
        title = 'tty';
      }
      opts = {
        runCommand: atom.config.get('term3.autoRunCommand'),
        shellOverride: atom.config.get('term3.shellOverride'),
        shellArguments: atom.config.get('term3.shellArguments'),
        titleTemplate: atom.config.get('term3.titleTemplate'),
        cursorBlink: atom.config.get('term3.cursorBlink'),
        fontFamily: atom.config.get('term3.fontFamily'),
        fontSize: atom.config.get('term3.fontSize'),
        colors: getColors(),
        forkPTY: forkPTY,
        rows: rows,
        cols: cols
      };
      if (opts.shellOverride) {
        opts.shell = opts.shellOverride;
      } else {
        opts.shell = process.env.SHELL || 'bash';
      }
      editorPath = keypather.get(atom, 'workspace.getEditorViews[0].getEditor().getPath()');
      opts.cwd = opts.cwd || atom.project.getPaths()[0] || editorPath || process.env.HOME;
      termView = new TermView(opts);
      model = Terminals.add({
        local: !!forkPTY,
        term: termView,
        title: title
      });
      id = model.id;
      termView.id = id;
      termView.on('remove', this.handleRemoveTerm.bind(this));
      termView.on('click', (function(_this) {
        return function() {
          termView.term.element.focus();
          termView.term.focus();
          return _this.focusedTerminal = termView;
        };
      })(this));
      termView.onDidChangeTitle(function() {
        if (forkPTY) {
          return model.title = termView.getTitle();
        } else {
          return model.title = title + '-' + termView.getTitle();
        }
      });
      if (typeof (_base = this.termViews).push === "function") {
        _base.push(termView);
      }
      process.nextTick((function(_this) {
        return function() {
          return _this.emitter.emit('term', termView);
        };
      })(this));
      return termView;
    },
    splitTerm: function(direction) {
      var activePane, item, openPanesInSameSplit, pane, splitter, termView;
      openPanesInSameSplit = atom.config.get('term3.openPanesInSameSplit');
      termView = this.createTermView();
      direction = capitalize(direction);
      splitter = (function(_this) {
        return function() {
          var pane;
          pane = activePane["split" + direction]({
            items: [termView]
          });
          activePane.termSplits[direction] = pane;
          _this.focusedTerminal = [pane, pane.items[0]];
          return _this.disposables.add(_this.attachSubscriptions(termView, pane.items[0], pane));
        };
      })(this);
      activePane = atom.workspace.getActivePane();
      activePane.termSplits || (activePane.termSplits = {});
      if (openPanesInSameSplit) {
        if (activePane.termSplits[direction] && activePane.termSplits[direction].items.length > 0) {
          pane = activePane.termSplits[direction];
          item = pane.addItem(termView);
          pane.activateItem(item);
          this.focusedTerminal = [pane, item];
          return this.disposables.add(this.attachSubscriptions(termView, item, pane));
        } else {
          return splitter();
        }
      } else {
        return splitter();
      }
    },
    pipeTerm: function(action) {
      var editor, item, pane, stream, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      stream = (function() {
        switch (action) {
          case 'path':
            return editor.getBuffer().file.path;
          case 'selection':
            return editor.getSelectedText();
        }
      })();
      if (stream && this.focusedTerminal) {
        if (Array.isArray(this.focusedTerminal)) {
          _ref = this.focusedTerminal, pane = _ref[0], item = _ref[1];
          pane.activateItem(item);
        } else {
          item = this.focusedTerminal;
        }
        item.pty.write(stream.trim());
        return item.term.focus();
      }
    },
    handleRemoveTerm: function(termView) {
      return this.termViews.splice(this.termViews.indexOf(termView), 1);
    },
    deactivate: function() {
      this.termViews.forEach(function(view) {
        return view.exit();
      });
      this.termViews = [];
      return this.disposables.dispose;
    },
    serialize: function() {
      var termViewsState;
      termViewsState = this.termViews.map(function(view) {
        return view.serialize();
      });
      return {
        termViews: termViewsState
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvdGVybTMvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJHQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSx1QkFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlDLFVBQVksT0FBQSxDQUFRLFdBQVIsRUFBWixPQUpELENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLENBQUgsQ0FBQSxDQUxiLENBQUE7O0FBQUEsRUFNQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBTkQsQ0FBQTs7QUFBQSxFQVFBLFVBQUEsR0FBYSxTQUFDLEdBQUQsR0FBQTtXQUFRLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixHQUFJLFNBQUksQ0FBQyxXQUFULENBQUEsRUFBL0I7RUFBQSxDQVJiLENBQUE7O0FBQUEsRUFVQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsUUFBQSx3T0FBQTtBQUFBLElBQUEsT0FNSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBWixDQUFtQixjQUFuQixDQUFELENBQW9DLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FOM0MsRUFDRSxtQkFBQSxXQURGLEVBQ2UsaUJBQUEsU0FEZixFQUMwQixtQkFBQSxXQUQxQixFQUN1QyxvQkFBQSxZQUR2QyxFQUVFLGtCQUFBLFVBRkYsRUFFYyxvQkFBQSxZQUZkLEVBRTRCLGtCQUFB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

//# sourceURL=/home/nikke/.atom/packages/term3/index.coffee
