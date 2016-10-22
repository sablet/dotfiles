(function() {
  var InputView, Kernel, RenameView, WSKernel, child_process, path, services, uuid, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  child_process = require('child_process');

  path = require('path');

  _ = require('lodash');

  uuid = require('uuid');

  services = require('./jupyter-js-services-shim');

  Kernel = require('./kernel');

  InputView = require('./input-view');

  RenameView = require('./rename-view');

  module.exports = WSKernel = (function(_super) {
    __extends(WSKernel, _super);

    function WSKernel(kernelSpec, grammar, session) {
      this.session = session;
      WSKernel.__super__.constructor.call(this, kernelSpec, grammar);
      this.session.statusChanged.connect((function(_this) {
        return function() {
          return _this._onStatusChange();
        };
      })(this));
      this._onStatusChange();
    }

    WSKernel.prototype.interrupt = function() {
      return this.session.kernel.interrupt();
    };

    WSKernel.prototype.shutdown = function() {
      return this.session.kernel.shutdown();
    };

    WSKernel.prototype.restart = function() {
      return this.session.kernel.restart();
    };

    WSKernel.prototype._onStatusChange = function() {
      return this.statusView.setStatus(this.session.status);
    };

    WSKernel.prototype._execute = function(code, onResults, callWatches) {
      var future;
      future = this.session.kernel.execute({
        code: code
      });
      future.onIOPub = (function(_this) {
        return function(message) {
          var result;
          if (callWatches && message.header.msg_type === 'status' && message.content.execution_state === 'idle') {
            _this._callWatchCallbacks();
          }
          if (onResults != null) {
            console.log('WSKernel: _execute:', message);
            result = _this._parseIOMessage(message);
            if (result != null) {
              return onResults(result);
            }
          }
        };
      })(this);
      future.onReply = function(message) {
        var result;
        if (message.content.status === 'error') {
          return;
        }
        result = {
          data: 'ok',
          type: 'text',
          stream: 'status'
        };
        return typeof onResults === "function" ? onResults(result) : void 0;
      };
      return future.onStdin = (function(_this) {
        return function(message) {
          var inputView, prompt;
          if (message.header.msg_type !== 'input_request') {
            return;
          }
          prompt = message.content.prompt;
          inputView = new InputView(prompt, function(input) {
            return _this.session.kernel.sendInputReply({
              value: input
            });
          });
          return inputView.attach();
        };
      })(this);
    };

    WSKernel.prototype.execute = function(code, onResults) {
      return this._execute(code, onResults, true);
    };

    WSKernel.prototype.executeWatch = function(code, onResults) {
      return this._execute(code, onResults, false);
    };

    WSKernel.prototype.complete = function(code, onResults) {
      return this.session.kernel.complete({
        code: code,
        cursor_pos: code.length
      }).then(function(message) {
        return typeof onResults === "function" ? onResults(message.content) : void 0;
      });
    };

    WSKernel.prototype.inspect = function(code, cursor_pos, onResults) {
      return this.session.kernel.inspect({
        code: code,
        cursor_pos: cursor_pos,
        detail_level: 0
      }).then(function(message) {
        return typeof onResults === "function" ? onResults({
          data: message.content.data,
          found: message.content.found
        }) : void 0;
      });
    };

    WSKernel.prototype.promptRename = function() {
      var view;
      view = new RenameView('Name your current session', this.session.path, (function(_this) {
        return function(input) {
          return _this.session.rename(input);
        };
      })(this));
      return view.attach();
    };

    WSKernel.prototype.destroy = function() {
      console.log('WSKernel: destroying jupyter-js-services Session');
      this.session.dispose();
      return WSKernel.__super__.destroy.apply(this, arguments);
    };

    return WSKernel;

  })(Kernel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0VBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsNEJBQVIsQ0FMWCxDQUFBOztBQUFBLEVBT0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBUFQsQ0FBQTs7QUFBQSxFQVFBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQVJaLENBQUE7O0FBQUEsRUFTQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FUYixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNGLCtCQUFBLENBQUE7O0FBQWEsSUFBQSxrQkFBQyxVQUFELEVBQWEsT0FBYixFQUF1QixPQUF2QixHQUFBO0FBQ1QsTUFEK0IsSUFBQyxDQUFBLFVBQUEsT0FDaEMsQ0FBQTtBQUFBLE1BQUEsMENBQU0sVUFBTixFQUFrQixPQUFsQixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQXZCLENBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FB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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/ws-kernel.coffee
