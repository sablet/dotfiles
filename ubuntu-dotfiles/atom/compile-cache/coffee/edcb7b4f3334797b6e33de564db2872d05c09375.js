(function() {
  var fs, log, os, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  os = require('os');

  path = require('path');

  log = require('./log');

  module.exports = {
    pythonExecutableRe: function() {
      if (/^win/.test(process.platform)) {
        return /^python(\d+(.\d+)?)?\.exe$/;
      } else {
        return /^python(\d+(.\d+)?)?$/;
      }
    },
    possibleGlobalPythonPaths: function() {
      if (/^win/.test(process.platform)) {
        return ['C:\\Python2.7', 'C:\\Python3.4', 'C:\\Python3.5', 'C:\\Program Files (x86)\\Python 2.7', 'C:\\Program Files (x86)\\Python 3.4', 'C:\\Program Files (x86)\\Python 3.5', 'C:\\Program Files (x64)\\Python 2.7', 'C:\\Program Files (x64)\\Python 3.4', 'C:\\Program Files (x64)\\Python 3.5', 'C:\\Program Files\\Python 2.7', 'C:\\Program Files\\Python 3.4', 'C:\\Program Files\\Python 3.5', "" + (os.homedir()) + "\\AppData\\Local\\Programs\\Python\\Python35-32"];
      } else {
        return ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin'];
      }
    },
    readDir: function(dirPath) {
      try {
        return fs.readdirSync(dirPath);
      } catch (_error) {
        return [];
      }
    },
    isBinary: function(filePath) {
      try {
        fs.accessSync(filePath, fs.X_OK);
        return true;
      } catch (_error) {
        return false;
      }
    },
    lookupInterpreters: function(dirPath) {
      var f, fileName, files, interpreters, matches, potentialInterpreter, _i, _len;
      interpreters = new Set();
      files = this.readDir(dirPath);
      matches = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          f = files[_i];
          if (this.pythonExecutableRe().test(f)) {
            _results.push(f);
          }
        }
        return _results;
      }).call(this);
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        fileName = matches[_i];
        potentialInterpreter = path.join(dirPath, fileName);
        if (this.isBinary(potentialInterpreter)) {
          interpreters.add(potentialInterpreter);
        }
      }
      return interpreters;
    },
    applySubstitutions: function(paths) {
      var modPaths, p, project, projectName, _i, _j, _len, _len1, _ref, _ref1;
      modPaths = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        _ref = atom.project.getPaths();
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          project = _ref[_j];
          _ref1 = project.split(path.sep), projectName = _ref1[_ref1.length - 1];
          p = p.replace(/\$PROJECT_NAME/i, projectName);
          p = p.replace(/\$PROJECT/i, project);
          if (__indexOf.call(modPaths, p) < 0) {
            modPaths.push(p);
          }
        }
      }
      return modPaths;
    },
    getInterpreter: function() {
      var envPath, f, interpreters, p, project, userDefinedPythonPaths, _i, _j, _len, _len1, _ref, _ref1;
      userDefinedPythonPaths = this.applySubstitutions(atom.config.get('autocomplete-python.pythonPaths').split(';'));
      interpreters = new Set((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = userDefinedPythonPaths.length; _i < _len; _i++) {
          p = userDefinedPythonPaths[_i];
          if (this.isBinary(p)) {
            _results.push(p);
          }
        }
        return _results;
      }).call(this));
      if (interpreters.size > 0) {
        log.debug('User defined interpreters found', interpreters);
        return interpreters.keys().next().value;
      }
      log.debug('No user defined interpreter found, trying automatic lookup');
      interpreters = new Set();
      _ref = atom.project.getPaths();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        project = _ref[_i];
        _ref1 = this.readDir(project);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          f = _ref1[_j];
          this.lookupInterpreters(path.join(project, f, 'bin')).forEach(function(i) {
            return interpreters.add(i);
          });
        }
      }
      log.debug('Project level interpreters found', interpreters);
      envPath = (process.env.PATH || '').split(path.delimiter);
      envPath = new Set(envPath.concat(this.possibleGlobalPythonPaths()));
      envPath.forEach((function(_this) {
        return function(potentialPath) {
          return _this.lookupInterpreters(potentialPath).forEach(function(i) {
            return interpreters.add(i);
          });
        };
      })(this));
      log.debug('Total automatically found interpreters', interpreters);
      if (interpreters.size > 0) {
        return interpreters.keys().next().value;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvaW50ZXJwcmV0ZXJzLWxvb2t1cC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUhOLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxrQkFBQSxFQUFvQixTQUFBLEdBQUE7QUFDbEIsTUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBTyxDQUFDLFFBQXBCLENBQUg7QUFDRSxlQUFPLDRCQUFQLENBREY7T0FBQSxNQUFBO0FBR0UsZUFBTyx1QkFBUCxDQUhGO09BRGtCO0lBQUEsQ0FBcEI7QUFBQSxJQU1BLHlCQUFBLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixNQUFBLElBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFPLENBQUMsUUFBcEIsQ0FBSDtBQUNFLGVBQU8sQ0FDTCxlQURLLEVBRUwsZUFGSyxFQUdMLGVBSEssRUFJTCxxQ0FKSyxFQUtMLHFDQUxLLEVBTUwscUNBTkssRUFPTCxxQ0FQSyxFQVFMLHFDQVJLLEVBU0wscUNBVEssRUFVTCwrQkFWSyxFQVdMLCtCQVhLLEVBWUwsK0JBWkssRUFhTCxFQUFBLEdBQUUsQ0FBQyxFQUFFLENBQUMsT0FBSCxDQUFBLENBQUQsQ0FBRixHQUFnQixpREFiWCxDQUFQLENBREY7T0FBQSxNQUFB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

//# sourceURL=/home/nikke/.atom/packages/autocomplete-python/lib/interpreters-lookup.coffee
