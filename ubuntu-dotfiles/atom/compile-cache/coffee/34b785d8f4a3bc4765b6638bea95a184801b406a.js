(function() {
  var Emitter, HydrogenKernel, Kernel, StatusView, WatchSidebar, child_process, jmp, path, uuid, zmq, _;

  Emitter = require('atom').Emitter;

  child_process = require('child_process');

  path = require('path');

  _ = require('lodash');

  jmp = require('jmp');

  uuid = require('uuid');

  zmq = jmp.zmq;

  StatusView = require('./status-view');

  WatchSidebar = require('./watch-sidebar');

  HydrogenKernel = require('./plugin-api/hydrogen-kernel');

  module.exports = Kernel = (function() {
    function Kernel(kernelSpec, grammar) {
      this.kernelSpec = kernelSpec;
      this.grammar = grammar;
      this.watchCallbacks = [];
      this.watchSidebar = new WatchSidebar(this);
      this.statusView = new StatusView(this.kernelSpec.display_name);
      this.emitter = new Emitter();
      this.pluginWrapper = null;
    }

    Kernel.prototype.getPluginWrapper = function() {
      if (this.pluginWrapper == null) {
        this.pluginWrapper = new HydrogenKernel(this);
      }
      return this.pluginWrapper;
    };

    Kernel.prototype.addWatchCallback = function(watchCallback) {
      return this.watchCallbacks.push(watchCallback);
    };

    Kernel.prototype._callWatchCallbacks = function() {
      return this.watchCallbacks.forEach(function(watchCallback) {
        return watchCallback();
      });
    };

    Kernel.prototype.interrupt = function() {
      throw new Error('Kernel: interrupt method not implemented');
    };

    Kernel.prototype.shutdown = function() {
      throw new Error('Kernel: shutdown method not implemented');
    };

    Kernel.prototype.execute = function(code, onResults) {
      throw new Error('Kernel: execute method not implemented');
    };

    Kernel.prototype.executeWatch = function(code, onResults) {
      throw new Error('Kernel: executeWatch method not implemented');
    };

    Kernel.prototype.complete = function(code, onResults) {
      throw new Error('Kernel: complete method not implemented');
    };

    Kernel.prototype.inspect = function(code, cursor_pos, onResults) {
      throw new Error('Kernel: inspect method not implemented');
    };

    Kernel.prototype._parseIOMessage = function(message) {
      var result;
      result = this._parseDisplayIOMessage(message);
      if (result == null) {
        result = this._parseResultIOMessage(message);
      }
      if (result == null) {
        result = this._parseErrorIOMessage(message);
      }
      if (result == null) {
        result = this._parseStreamIOMessage(message);
      }
      return result;
    };

    Kernel.prototype._parseDisplayIOMessage = function(message) {
      var result;
      if (message.header.msg_type === 'display_data') {
        result = this._parseDataMime(message.content.data);
      }
      return result;
    };

    Kernel.prototype._parseResultIOMessage = function(message) {
      var msg_type, result;
      msg_type = message.header.msg_type;
      if (msg_type === 'execute_result' || msg_type === 'pyout') {
        result = this._parseDataMime(message.content.data);
      }
      return result;
    };

    Kernel.prototype._parseDataMime = function(data) {
      var mime, result;
      if (data == null) {
        return null;
      }
      mime = this._getMimeType(data);
      if (mime == null) {
        return null;
      }
      if (mime === 'text/plain') {
        result = {
          data: {
            'text/plain': data[mime]
          },
          type: 'text',
          stream: 'pyout'
        };
        result.data['text/plain'] = result.data['text/plain'].trim();
      } else {
        result = {
          data: {},
          type: mime,
          stream: 'pyout'
        };
        result.data[mime] = data[mime];
      }
      return result;
    };

    Kernel.prototype._getMimeType = function(data) {
      var imageMimes, mime;
      imageMimes = Object.getOwnPropertyNames(data).filter(function(mime) {
        return mime.startsWith('image/');
      });
      if (data.hasOwnProperty('text/html')) {
        mime = 'text/html';
      } else if (data.hasOwnProperty('image/svg+xml')) {
        mime = 'image/svg+xml';
      } else if (!(imageMimes.length === 0)) {
        mime = imageMimes[0];
      } else if (data.hasOwnProperty('text/markdown')) {
        mime = 'text/markdown';
      } else if (data.hasOwnProperty('application/pdf')) {
        mime = 'application/pdf';
      } else if (data.hasOwnProperty('text/latex')) {
        mime = 'text/latex';
      } else if (data.hasOwnProperty('text/plain')) {
        mime = 'text/plain';
      }
      return mime;
    };

    Kernel.prototype._parseErrorIOMessage = function(message) {
      var msg_type, result;
      msg_type = message.header.msg_type;
      if (msg_type === 'error' || msg_type === 'pyerr') {
        result = this._parseErrorMessage(message);
      }
      return result;
    };

    Kernel.prototype._parseErrorMessage = function(message) {
      var ename, err, errorString, evalue, result, _ref, _ref1;
      try {
        errorString = message.content.traceback.join('\n');
      } catch (_error) {
        err = _error;
        ename = (_ref = message.content.ename) != null ? _ref : '';
        evalue = (_ref1 = message.content.evalue) != null ? _ref1 : '';
        errorString = ename + ': ' + evalue;
      }
      result = {
        data: {
          'text/plain': errorString
        },
        type: 'text',
        stream: 'error'
      };
      return result;
    };

    Kernel.prototype._parseStreamIOMessage = function(message) {
      var result, _ref, _ref1, _ref2;
      if (message.header.msg_type === 'stream') {
        result = {
          data: {
            'text/plain': (_ref = message.content.text) != null ? _ref : message.content.data
          },
          type: 'text',
          stream: message.content.name
        };
      } else if (message.idents === 'stdout' || message.idents === 'stream.stdout' || message.content.name === 'stdout') {
        result = {
          data: {
            'text/plain': (_ref1 = message.content.text) != null ? _ref1 : message.content.data
          },
          type: 'text',
          stream: 'stdout'
        };
      } else if (message.idents === 'stderr' || message.idents === 'stream.stderr' || message.content.name === 'stderr') {
        result = {
          data: {
            'text/plain': (_ref2 = message.content.text) != null ? _ref2 : message.content.data
          },
          type: 'text',
          stream: 'stderr'
        };
      }
      if ((result != null ? result.data['text/plain'] : void 0) != null) {
        result.data['text/plain'] = result.data['text/plain'].trim();
      }
      return result;
    };

    Kernel.prototype.destroy = function() {
      console.log('Kernel: Destroying base kernel');
      if (this.pluginWrapper) {
        this.pluginWrapper.destroyed = true;
      }
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    return Kernel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUdBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FOTixDQUFBOztBQUFBLEVBT0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBUFAsQ0FBQTs7QUFBQSxFQVFBLEdBQUEsR0FBTSxHQUFHLENBQUMsR0FSVixDQUFBOztBQUFBLEVBVUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBVmIsQ0FBQTs7QUFBQSxFQVdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FYZixDQUFBOztBQUFBLEVBWUEsY0FBQSxHQUFpQixPQUFBLENBQVEsOEJBQVIsQ0FaakIsQ0FBQTs7QUFBQSxFQWNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDVyxJQUFBLGdCQUFFLFVBQUYsRUFBZSxPQUFmLEdBQUE7QUFDVCxNQURVLElBQUMsQ0FBQSxhQUFBLFVBQ1gsQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxVQUFBLE9BQ3hCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEVBQWxCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFhLElBQWIsQ0FGcEIsQ0FBQTtBQUFBLE1BR0EsSUFB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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/kernel.coffee
