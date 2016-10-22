(function() {
  var InputView, Kernel, ZMQKernel, child_process, fs, jmp, path, uuid, zmq, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  child_process = require('child_process');

  path = require('path');

  _ = require('lodash');

  fs = require('fs');

  jmp = require('jmp');

  uuid = require('uuid');

  zmq = jmp.zmq;

  Kernel = require('./kernel');

  InputView = require('./input-view');

  module.exports = ZMQKernel = (function(_super) {
    __extends(ZMQKernel, _super);

    function ZMQKernel(kernelSpec, grammar, connection, connectionFile, kernelProcess) {
      var getKernelNotificationsRegExp;
      this.connection = connection;
      this.connectionFile = connectionFile;
      this.kernelProcess = kernelProcess;
      ZMQKernel.__super__.constructor.call(this, kernelSpec, grammar);
      this.executionCallbacks = {};
      this._connect();
      if (this.kernelProcess != null) {
        console.log('ZMQKernel: @kernelProcess:', this.kernelProcess);
        getKernelNotificationsRegExp = function() {
          var err, flags, pattern;
          try {
            pattern = atom.config.get('Hydrogen.kernelNotifications');
            flags = 'im';
            return new RegExp(pattern, flags);
          } catch (_error) {
            err = _error;
            return null;
          }
        };
        this.kernelProcess.stdout.on('data', (function(_this) {
          return function(data) {
            var regexp;
            data = data.toString();
            console.log('ZMQKernel: stdout:', data);
            regexp = getKernelNotificationsRegExp();
            if (regexp != null ? regexp.test(data) : void 0) {
              return atom.notifications.addInfo(_this.kernelSpec.display_name, {
                description: data,
                dismissable: true
              });
            }
          };
        })(this));
        this.kernelProcess.stderr.on('data', (function(_this) {
          return function(data) {
            var regexp;
            data = data.toString();
            console.log('ZMQKernel: stderr:', data);
            regexp = getKernelNotificationsRegExp();
            if (regexp != null ? regexp.test(data) : void 0) {
              return atom.notifications.addError(_this.kernelSpec.display_name, {
                description: data,
                dismissable: true
              });
            }
          };
        })(this));
      } else {
        console.log('ZMQKernel: connectionFile:', this.connectionFile);
        atom.notifications.addInfo('Using an existing kernel connection');
      }
    }

    ZMQKernel.prototype._connect = function() {
      var address, err, id, key, scheme;
      scheme = this.connection.signature_scheme.slice('hmac-'.length);
      key = this.connection.key;
      this.shellSocket = new jmp.Socket('dealer', scheme, key);
      this.controlSocket = new jmp.Socket('dealer', scheme, key);
      this.stdinSocket = new jmp.Socket('dealer', scheme, key);
      this.ioSocket = new jmp.Socket('sub', scheme, key);
      id = uuid.v4();
      this.shellSocket.identity = 'dealer' + id;
      this.controlSocket.identity = 'control' + id;
      this.stdinSocket.identity = 'dealer' + id;
      this.ioSocket.identity = 'sub' + id;
      address = "" + this.connection.transport + "://" + this.connection.ip + ":";
      this.shellSocket.connect(address + this.connection.shell_port);
      this.controlSocket.connect(address + this.connection.control_port);
      this.ioSocket.connect(address + this.connection.iopub_port);
      this.ioSocket.subscribe('');
      this.stdinSocket.connect(address + this.connection.stdin_port);
      this.shellSocket.on('message', this.onShellMessage.bind(this));
      this.ioSocket.on('message', this.onIOMessage.bind(this));
      this.stdinSocket.on('message', this.onStdinMessage.bind(this));
      this.shellSocket.on('connect', function() {
        return console.log('shellSocket connected');
      });
      this.controlSocket.on('connect', function() {
        return console.log('controlSocket connected');
      });
      this.ioSocket.on('connect', function() {
        return console.log('ioSocket connected');
      });
      this.stdinSocket.on('connect', function() {
        return console.log('stdinSocket connected');
      });
      try {
        this.shellSocket.monitor();
        this.controlSocket.monitor();
        this.ioSocket.monitor();
        return this.stdinSocket.monitor();
      } catch (_error) {
        err = _error;
        return console.error('Kernel:', err);
      }
    };

    ZMQKernel.prototype.interrupt = function() {
      if (this.kernelProcess != null) {
        console.log('ZMQKernel: sending SIGINT');
        return this.kernelProcess.kill('SIGINT');
      } else {
        console.log('ZMQKernel: cannot interrupt an existing kernel');
        return atom.notifications.addWarning('Cannot interrupt this kernel');
      }
    };

    ZMQKernel.prototype._kill = function() {
      if (this.kernelProcess != null) {
        console.log('ZMQKernel: sending SIGKILL');
        return this.kernelProcess.kill('SIGKILL');
      } else {
        console.log('ZMQKernel: cannot kill an existing kernel');
        return atom.notifications.addWarning('Cannot kill this kernel');
      }
    };

    ZMQKernel.prototype.shutdown = function(restart) {
      var message, requestId;
      if (restart == null) {
        restart = false;
      }
      requestId = 'shutdown_' + uuid.v4();
      message = this._createMessage('shutdown_request', requestId);
      message.content = {
        restart: restart
      };
      return this.shellSocket.send(new jmp.Message(message));
    };

    ZMQKernel.prototype._execute = function(code, requestId, onResults) {
      var message;
      message = this._createMessage('execute_request', requestId);
      message.content = {
        code: code,
        silent: false,
        store_history: true,
        user_expressions: {},
        allow_stdin: true
      };
      this.executionCallbacks[requestId] = onResults;
      return this.shellSocket.send(new jmp.Message(message));
    };

    ZMQKernel.prototype.execute = function(code, onResults) {
      var requestId;
      console.log('Kernel.execute:', code);
      requestId = 'execute_' + uuid.v4();
      return this._execute(code, requestId, onResults);
    };

    ZMQKernel.prototype.executeWatch = function(code, onResults) {
      var requestId;
      console.log('Kernel.executeWatch:', code);
      requestId = 'watch_' + uuid.v4();
      return this._execute(code, requestId, onResults);
    };

    ZMQKernel.prototype.complete = function(code, onResults) {
      var message, requestId;
      console.log('Kernel.complete:', code);
      requestId = 'complete_' + uuid.v4();
      message = this._createMessage('complete_request', requestId);
      message.content = {
        code: code,
        text: code,
        line: code,
        cursor_pos: code.length
      };
      this.executionCallbacks[requestId] = onResults;
      return this.shellSocket.send(new jmp.Message(message));
    };

    ZMQKernel.prototype.inspect = function(code, cursor_pos, onResults) {
      var message, requestId;
      console.log('Kernel.inspect:', code, cursor_pos);
      requestId = 'inspect_' + uuid.v4();
      message = this._createMessage('inspect_request', requestId);
      message.content = {
        code: code,
        cursor_pos: cursor_pos,
        detail_level: 0
      };
      this.executionCallbacks[requestId] = onResults;
      return this.shellSocket.send(new jmp.Message(message));
    };

    ZMQKernel.prototype.inputReply = function(input) {
      var message, requestId;
      requestId = 'input_reply_' + uuid.v4();
      message = this._createMessage('input_reply', requestId);
      message.content = {
        value: input
      };
      return this.stdinSocket.send(new jmp.Message(message));
    };

    ZMQKernel.prototype.onShellMessage = function(message) {
      var callback, msg_id, msg_type, status;
      console.log('shell message:', message);
      if (!this._isValidMessage(message)) {
        return;
      }
      msg_id = message.parent_header.msg_id;
      if (msg_id != null) {
        callback = this.executionCallbacks[msg_id];
      }
      if (callback == null) {
        return;
      }
      status = message.content.status;
      if (status === 'error') {
        return;
      }
      if (status === 'ok') {
        msg_type = message.header.msg_type;
        if (msg_type === 'execution_reply') {
          return callback({
            data: 'ok',
            type: 'text',
            stream: 'status'
          });
        } else if (msg_type === 'complete_reply') {
          return callback(message.content);
        } else if (msg_type === 'inspect_reply') {
          return callback({
            data: message.content.data,
            found: message.content.found
          });
        } else {
          return callback({
            data: 'ok',
            type: 'text',
            stream: 'status'
          });
        }
      }
    };

    ZMQKernel.prototype.onStdinMessage = function(message) {
      var inputView, msg_type, prompt;
      console.log('stdin message:', message);
      if (!this._isValidMessage(message)) {
        return;
      }
      msg_type = message.header.msg_type;
      if (msg_type === 'input_request') {
        prompt = message.content.prompt;
        inputView = new InputView(prompt, (function(_this) {
          return function(input) {
            return _this.inputReply(input);
          };
        })(this));
        return inputView.attach();
      }
    };

    ZMQKernel.prototype.onIOMessage = function(message) {
      var callback, msg_id, msg_type, result, status, _ref;
      console.log('IO message:', message);
      if (!this._isValidMessage(message)) {
        return;
      }
      msg_type = message.header.msg_type;
      if (msg_type === 'status') {
        status = message.content.execution_state;
        this.statusView.setStatus(status);
        msg_id = (_ref = message.parent_header) != null ? _ref.msg_id : void 0;
        if (status === 'idle' && (msg_id != null ? msg_id.startsWith('execute') : void 0)) {
          this._callWatchCallbacks();
        }
      }
      msg_id = message.parent_header.msg_id;
      if (msg_id != null) {
        callback = this.executionCallbacks[msg_id];
      }
      if (callback == null) {
        return;
      }
      result = this._parseIOMessage(message);
      if (result != null) {
        return callback(result);
      }
    };

    ZMQKernel.prototype._isValidMessage = function(message) {
      if (message == null) {
        console.log('Invalid message: null');
        return false;
      }
      if (message.content == null) {
        console.log('Invalid message: Missing content');
        return false;
      }
      if (message.content.execution_state === 'starting') {
        console.log('Dropped starting status IO message');
        return false;
      }
      if (message.parent_header == null) {
        console.log('Invalid message: Missing parent_header');
        return false;
      }
      if (message.parent_header.msg_id == null) {
        console.log('Invalid message: Missing parent_header.msg_id');
        return false;
      }
      if (message.parent_header.msg_type == null) {
        console.log('Invalid message: Missing parent_header.msg_type');
        return false;
      }
      if (message.header == null) {
        console.log('Invalid message: Missing header');
        return false;
      }
      if (message.header.msg_id == null) {
        console.log('Invalid message: Missing header.msg_id');
        return false;
      }
      if (message.header.msg_type == null) {
        console.log('Invalid message: Missing header.msg_type');
        return false;
      }
      return true;
    };

    ZMQKernel.prototype.destroy = function() {
      console.log('ZMQKernel: destroy:', this);
      this.shutdown();
      if (this.kernelProcess != null) {
        this._kill();
        fs.unlink(this.connectionFile);
      }
      this.shellSocket.close();
      this.controlSocket.close();
      this.ioSocket.close();
      this.stdinSocket.close();
      return ZMQKernel.__super__.destroy.apply(this, arguments);
    };

    ZMQKernel.prototype._getUsername = function() {
      return process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
    };

    ZMQKernel.prototype._createMessage = function(msg_type, msg_id) {
      var message;
      if (msg_id == null) {
        msg_id = uuid.v4();
      }
      message = {
        header: {
          username: this._getUsername(),
          session: '00000000-0000-0000-0000-000000000000',
          msg_type: msg_type,
          msg_id: msg_id,
          date: new Date(),
          version: '5.0'
        },
        metadata: {},
        parent_header: {},
        content: {}
      };
      return message;
    };

    return ZMQKernel;

  })(Kernel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3ptcS1rZXJuZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FMTixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQU9BLEdBQUEsR0FBTSxHQUFHLENBQUMsR0FQVixDQUFBOztBQUFBLEVBU0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBVFQsQ0FBQTs7QUFBQSxFQVVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQVZaLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0YsZ0NBQUEsQ0FBQTs7QUFBYSxJQUFBLG1CQUFDLFVBQUQsRUFBYSxPQUFiLEVBQXVCLFVBQXZCLEVBQW9DLGNBQXBDLEVBQXFELGFBQXJELEdBQUE7QUFDVCxVQUFBLDRCQUFBO0FBQUEsTUFEK0IsSUFBQyxDQUFBLGFBQUEsVUFDaEMsQ0FBQTtBQUFBLE1BRDRDLElBQUMsQ0FBQSxpQkFBQSxjQUM3QyxDQUFBO0FBQUEsTUFENkQsSUFBQyxDQUFBLGdCQUFBLGFBQzlELENBQUE7QUFBQSxNQUFBLDJDQUFNLFVBQU4sRUFBa0IsT0FBbEIsQ0FBQSxDQUFB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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/zmq-kernel.coffee
