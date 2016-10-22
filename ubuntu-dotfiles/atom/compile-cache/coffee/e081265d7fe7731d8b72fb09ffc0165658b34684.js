(function() {
  var SelectListView, SignalListView, WSKernel, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  _ = require('lodash');

  WSKernel = require('./ws-kernel');

  module.exports = SignalListView = (function(_super) {
    __extends(SignalListView, _super);

    function SignalListView() {
      return SignalListView.__super__.constructor.apply(this, arguments);
    }

    SignalListView.prototype.initialize = function(kernelManager) {
      this.kernelManager = kernelManager;
      SignalListView.__super__.initialize.apply(this, arguments);
      this.basicCommands = [
        {
          name: 'Interrupt',
          value: 'interrupt-kernel'
        }, {
          name: 'Restart',
          value: 'restart-kernel'
        }, {
          name: 'Shut Down',
          value: 'shutdown-kernel'
        }
      ];
      this.wsKernelCommands = [
        {
          name: 'Rename session for',
          value: 'rename-kernel'
        }, {
          name: 'Disconnect from',
          value: 'disconnect-kernel'
        }
      ];
      this.onConfirmed = null;
      this.list.addClass('mark-active');
      return this.setItems([]);
    };

    SignalListView.prototype.toggle = function() {
      if (this.panel != null) {
        return this.cancel();
      } else if (this.editor = atom.workspace.getActiveTextEditor()) {
        return this.attach();
      }
    };

    SignalListView.prototype.attach = function() {
      var basicCommands, grammar, kernel, language, wsKernelCommands;
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.focusFilterEditor();
      grammar = this.editor.getGrammar();
      language = this.kernelManager.getLanguageFor(grammar);
      kernel = this.kernelManager.getRunningKernelFor(language);
      if (kernel == null) {
        return this.setItems([]);
      }
      basicCommands = this.basicCommands.map((function(_this) {
        return function(command) {
          return {
            name: _this._getCommandName(command.name, kernel.kernelSpec),
            command: command.value,
            grammar: grammar,
            language: language,
            kernel: kernel
          };
        };
      })(this));
      if (kernel instanceof WSKernel) {
        wsKernelCommands = this.wsKernelCommands.map((function(_this) {
          return function(command) {
            return {
              name: _this._getCommandName(command.name, kernel.kernelSpec),
              command: command.value,
              grammar: grammar,
              language: language,
              kernel: kernel
            };
          };
        })(this));
        return this.setItems(_.union(basicCommands, wsKernelCommands));
      } else {
        return this.kernelManager.getAllKernelSpecsFor(language, (function(_this) {
          return function(kernelSpecs) {
            var switchCommands;
            _.pull(kernelSpecs, kernel.kernelSpec);
            switchCommands = kernelSpecs.map(function(kernelSpec) {
              return {
                name: _this._getCommandName('Switch to', kernelSpec),
                command: 'switch-kernel',
                grammar: grammar,
                language: language,
                kernelSpec: kernelSpec
              };
            });
            return _this.setItems(_.union(basicCommands, switchCommands));
          };
        })(this));
      }
    };

    SignalListView.prototype._getCommandName = function(name, kernelSpec) {
      return name + ' ' + kernelSpec.display_name + ' kernel';
    };

    SignalListView.prototype.confirmed = function(item) {
      console.log('Selected command:', item);
      if (typeof this.onConfirmed === "function") {
        this.onConfirmed(item);
      }
      return this.cancel();
    };

    SignalListView.prototype.getEmptyMessage = function() {
      return 'No running kernels for this file type.';
    };

    SignalListView.prototype.getFilterKey = function() {
      return 'name';
    };

    SignalListView.prototype.destroy = function() {
      return this.cancel();
    };

    SignalListView.prototype.viewForItem = function(item) {
      var element;
      element = document.createElement('li');
      element.textContent = item.name;
      return element;
    };

    SignalListView.prototype.cancelled = function() {
      var _ref;
      if ((_ref = this.panel) != null) {
        _ref.destroy();
      }
      this.panel = null;
      return this.editor = null;
    };

    return SignalListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3NpZ25hbC1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSLEVBQWxCLGNBQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FIWCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNGLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw2QkFBQSxVQUFBLEdBQVksU0FBRSxhQUFGLEdBQUE7QUFDUixNQURTLElBQUMsQ0FBQSxnQkFBQSxhQUNWLENBQUE7QUFBQSxNQUFBLGdEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtRQUNiO0FBQUEsVUFBQSxJQUFBLEVBQU0sV0FBTjtBQUFBLFVBQ0EsS0FBQSxFQUFPLGtCQURQO1NBRGEsRUFJYjtBQUFBLFVBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxVQUNBLEtBQUEsRUFBTyxnQkFEUDtTQUphLEVBT2I7QUFBQSxVQUFBLElBQUEsRUFBTSxXQUFOO0FBQUEsVUFDQSxLQUFBLEVBQU8saUJBRFA7U0FQYTtPQUZqQixDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7UUFDaEI7QUFBQSxVQUFBLElBQUEsRUFBTSxvQkFBTjtBQUFBLFVBQ0EsS0FBQSxFQUFPLGVBRFA7U0FEZ0IsRUFJaEI7QUFBQSxVQUFBLElBQUEsRUFBTSxpQkFBTjtBQUFBLFVBQ0EsS0FBQSxFQUFPLG1CQURQO1NBSmdCO09BYnBCLENBQUE7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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/signal-list-view.coffee
