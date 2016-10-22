(function() {
  var Config, KernelManager, KernelPicker, WSKernel, ZMQKernel, child_process, fs, launchSpec, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('lodash');

  child_process = require('child_process');

  launchSpec = require('spawnteract').launchSpec;

  fs = require('fs');

  path = require('path');

  Config = require('./config');

  WSKernel = require('./ws-kernel');

  ZMQKernel = require('./zmq-kernel');

  KernelPicker = require('./kernel-picker');

  module.exports = KernelManager = (function() {
    function KernelManager() {
      this.getKernelSpecsFromJupyter = __bind(this.getKernelSpecsFromJupyter, this);
      this.getAllKernelSpecs = __bind(this.getAllKernelSpecs, this);
      this._runningKernels = {};
      this._kernelSpecs = this.getKernelSpecsFromSettings();
    }

    KernelManager.prototype.destroy = function() {
      _.forEach(this._runningKernels, function(kernel) {
        return kernel.destroy();
      });
      return this._runningKernels = {};
    };

    KernelManager.prototype.setRunningKernelFor = function(grammar, kernel) {
      var language;
      language = this.getLanguageFor(grammar);
      kernel.kernelSpec.language = language;
      return this._runningKernels[language] = kernel;
    };

    KernelManager.prototype.destroyRunningKernelFor = function(grammar) {
      var kernel, language;
      language = this.getLanguageFor(grammar);
      kernel = this._runningKernels[language];
      delete this._runningKernels[language];
      return kernel != null ? kernel.destroy() : void 0;
    };

    KernelManager.prototype.restartRunningKernelFor = function(grammar, onRestarted) {
      var kernel, kernelSpec, language;
      language = this.getLanguageFor(grammar);
      kernel = this._runningKernels[language];
      if (kernel instanceof WSKernel) {
        kernel.restart().then(function() {
          return typeof onRestarted === "function" ? onRestarted(kernel) : void 0;
        });
        return;
      }
      if (kernel instanceof ZMQKernel && kernel.kernelProcess) {
        kernelSpec = kernel.kernelSpec;
        this.destroyRunningKernelFor(grammar);
        this.startKernel(kernelSpec, grammar, function(kernel) {
          return typeof onRestarted === "function" ? onRestarted(kernel) : void 0;
        });
        return;
      }
      console.log('KernelManager: restartRunningKernelFor: ignored', kernel);
      atom.notifications.addWarning('Cannot restart this kernel');
      return typeof onRestarted === "function" ? onRestarted(kernel) : void 0;
    };

    KernelManager.prototype.startKernelFor = function(grammar, onStarted) {
      var connection, connectionFile, connectionString, e, language, rootDirectory, _ref;
      try {
        rootDirectory = ((_ref = atom.project.rootDirectories[0]) != null ? _ref.path : void 0) || path.dirname(atom.workspace.getActiveTextEditor().getPath());
        connectionFile = path.join(rootDirectory, 'hydrogen', 'connection.json');
        connectionString = fs.readFileSync(connectionFile, 'utf8');
        connection = JSON.parse(connectionString);
        this.startExistingKernel(grammar, connection, connectionFile, onStarted);
        return;
      } catch (_error) {
        e = _error;
        if (e.code !== 'ENOENT') {
          console.error('KernelManager: Cannot start existing kernel:\n', e);
        }
      }
      language = this.getLanguageFor(grammar);
      return this.getKernelSpecFor(language, (function(_this) {
        return function(kernelSpec) {
          var description, message;
          if (kernelSpec == null) {
            message = "No kernel for language `" + language + "` found";
            description = 'Check that the language for this file is set in Atom and that you have a Jupyter kernel installed for it.';
            atom.notifications.addError(message, {
              description: description
            });
            return;
          }
          return _this.startKernel(kernelSpec, grammar, onStarted);
        };
      })(this));
    };

    KernelManager.prototype.startExistingKernel = function(grammar, connection, connectionFile, onStarted) {
      var kernel, kernelSpec, language;
      language = this.getLanguageFor(grammar);
      console.log('KernelManager: startExistingKernel: Assuming', language);
      kernelSpec = {
        display_name: 'Existing Kernel',
        language: language,
        argv: [],
        env: {}
      };
      kernel = new ZMQKernel(kernelSpec, grammar, connection, connectionFile);
      this.setRunningKernelFor(grammar, kernel);
      this._executeStartupCode(kernel);
      return typeof onStarted === "function" ? onStarted(kernel) : void 0;
    };

    KernelManager.prototype.startKernel = function(kernelSpec, grammar, onStarted) {
      var language, projectPath, spawnOptions;
      language = this.getLanguageFor(grammar);
      console.log('KernelManager: startKernelFor:', language);
      projectPath = path.dirname(atom.workspace.getActiveTextEditor().getPath());
      spawnOptions = {
        cwd: projectPath
      };
      return launchSpec(kernelSpec, spawnOptions).then((function(_this) {
        return function(_arg) {
          var config, connectionFile, kernel, spawn;
          config = _arg.config, connectionFile = _arg.connectionFile, spawn = _arg.spawn;
          kernel = new ZMQKernel(kernelSpec, grammar, config, connectionFile, spawn);
          _this.setRunningKernelFor(grammar, kernel);
          _this._executeStartupCode(kernel);
          return typeof onStarted === "function" ? onStarted(kernel) : void 0;
        };
      })(this));
    };

    KernelManager.prototype._executeStartupCode = function(kernel) {
      var displayName, startupCode;
      displayName = kernel.kernelSpec.display_name;
      startupCode = Config.getJson('startupCode')[displayName];
      if (startupCode != null) {
        console.log('KernelManager: Executing startup code:', startupCode);
        startupCode = startupCode + ' \n';
        return kernel.execute(startupCode);
      }
    };

    KernelManager.prototype.getAllRunningKernels = function() {
      return _.clone(this._runningKernels);
    };

    KernelManager.prototype.getRunningKernelFor = function(language) {
      return this._runningKernels[language];
    };

    KernelManager.prototype.getLanguageFor = function(grammar) {
      return grammar != null ? grammar.name.toLowerCase() : void 0;
    };

    KernelManager.prototype.getAllKernelSpecs = function(callback) {
      if (_.isEmpty(this._kernelSpecs)) {
        return this.updateKernelSpecs((function(_this) {
          return function() {
            return callback(_.map(_this._kernelSpecs, 'spec'));
          };
        })(this));
      } else {
        return callback(_.map(this._kernelSpecs, 'spec'));
      }
    };

    KernelManager.prototype.getAllKernelSpecsFor = function(language, callback) {
      if (language != null) {
        return this.getAllKernelSpecs((function(_this) {
          return function(kernelSpecs) {
            var specs;
            specs = kernelSpecs.filter(function(spec) {
              return _this.kernelSpecProvidesLanguage(spec, language);
            });
            return callback(specs);
          };
        })(this));
      } else {
        return callback([]);
      }
    };

    KernelManager.prototype.getKernelSpecFor = function(language, callback) {
      if (language == null) {
        return null;
      }
      return this.getAllKernelSpecsFor(language, (function(_this) {
        return function(kernelSpecs) {
          if (kernelSpecs.length <= 1) {
            return callback(kernelSpecs[0]);
          } else {
            if (_this.kernelPicker == null) {
              _this.kernelPicker = new KernelPicker(function(onUpdated) {
                return onUpdated(kernelSpecs);
              });
              _this.kernelPicker.onConfirmed = function(_arg) {
                var kernelSpec;
                kernelSpec = _arg.kernelSpec;
                return callback(kernelSpec);
              };
            }
            return _this.kernelPicker.toggle();
          }
        };
      })(this));
    };

    KernelManager.prototype.kernelSpecProvidesLanguage = function(kernelSpec, language) {
      var kernelLanguage, mappedLanguage;
      kernelLanguage = kernelSpec.language;
      mappedLanguage = Config.getJson('languageMappings')[kernelLanguage];
      if (mappedLanguage) {
        return mappedLanguage === language;
      }
      return kernelLanguage.toLowerCase() === language;
    };

    KernelManager.prototype.getKernelSpecsFromSettings = function() {
      var settings;
      settings = Config.getJson('kernelspec');
      if (!settings.kernelspecs) {
        return {};
      }
      return _.pickBy(settings.kernelspecs, function(_arg) {
        var spec;
        spec = _arg.spec;
        return (spec != null ? spec.language : void 0) && spec.display_name && spec.argv;
      });
    };

    KernelManager.prototype.mergeKernelSpecs = function(kernelSpecs) {
      return _.assign(this._kernelSpecs, kernelSpecs);
    };

    KernelManager.prototype.updateKernelSpecs = function(callback) {
      this._kernelSpecs = this.getKernelSpecsFromSettings;
      return this.getKernelSpecsFromJupyter((function(_this) {
        return function(err, kernelSpecsFromJupyter) {
          var message, options;
          if (!err) {
            _this.mergeKernelSpecs(kernelSpecsFromJupyter);
          }
          if (_.isEmpty(_this._kernelSpecs)) {
            message = 'No kernel specs found';
            options = {
              description: 'Use kernelSpec option in Hydrogen or update IPython/Jupyter to a version that supports: `jupyter kernelspec list --json` or `ipython kernelspec list --json`',
              dismissable: true
            };
            atom.notifications.addError(message, options);
          } else {
            err = null;
            message = 'Hydrogen Kernels updated:';
            options = {
              detail: (_.map(_this._kernelSpecs, 'spec.display_name')).join('\n')
            };
            atom.notifications.addInfo(message, options);
          }
          return typeof callback === "function" ? callback(err, _this._kernelSpecs) : void 0;
        };
      })(this));
    };

    KernelManager.prototype.getKernelSpecsFromJupyter = function(callback) {
      var ipython, jupyter;
      jupyter = 'jupyter kernelspec list --json --log-level=CRITICAL';
      ipython = 'ipython kernelspec list --json --log-level=CRITICAL';
      return this.getKernelSpecsFrom(jupyter, (function(_this) {
        return function(jupyterError, kernelSpecs) {
          if (!jupyterError) {
            if (typeof callback === "function") {
              callback(jupyterError, kernelSpecs);
            }
            return;
          }
          return _this.getKernelSpecsFrom(ipython, function(ipythonError, kernelSpecs) {
            if (!ipythonError) {
              return typeof callback === "function" ? callback(ipythonError, kernelSpecs) : void 0;
            } else {
              return typeof callback === "function" ? callback(jupyterError, kernelSpecs) : void 0;
            }
          });
        };
      })(this));
    };

    KernelManager.prototype.getKernelSpecsFrom = function(command, callback) {
      var options;
      options = {
        killSignal: 'SIGINT'
      };
      return child_process.exec(command, options, function(err, stdout, stderr) {
        var error, kernelSpecs;
        if (!err) {
          try {
            kernelSpecs = JSON.parse(stdout).kernelspecs;
          } catch (_error) {
            error = _error;
            err = error;
            console.log('Could not parse kernelspecs:', err);
          }
        }
        return typeof callback === "function" ? callback(err, kernelSpecs) : void 0;
      });
    };

    return KernelManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnR0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FEaEIsQ0FBQTs7QUFBQSxFQUVDLGFBQWMsT0FBQSxDQUFRLGFBQVIsRUFBZCxVQUZELENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQU5ULENBQUE7O0FBQUEsRUFPQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FQWCxDQUFBOztBQUFBLEVBUUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBUlosQ0FBQTs7QUFBQSxFQVNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FUZixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNXLElBQUEsdUJBQUEsR0FBQTtBQUNULG1GQUFBLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsZUFBRCxHQUFtQixFQUFuQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFDLENBQUEsMEJBQUQsQ0FBQSxDQURoQixDQURTO0lBQUEsQ0FBYjs7QUFBQSw0QkFLQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ0wsTUFBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQUMsQ0FBQSxlQUFYLEVBQTRC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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/kernel-manager.coffee
