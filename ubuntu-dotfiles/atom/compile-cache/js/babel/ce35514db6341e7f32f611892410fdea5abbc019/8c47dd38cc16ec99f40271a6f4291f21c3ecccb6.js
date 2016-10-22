Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _rangeHelpers = require('./rangeHelpers');

var _rangeHelpers2 = _interopRequireDefault(_rangeHelpers);

// Local variables
'use babel';var parseRegex = /(\d+):(\d+):\s(([A-Z])\d{2,3})\s+(.*)/g;

var extractRange = function extractRange(_ref) {
  var code = _ref.code;
  var message = _ref.message;
  var lineNumber = _ref.lineNumber;
  var colNumber = _ref.colNumber;
  var textEditor = _ref.textEditor;

  var result = undefined;
  var line = lineNumber - 1;
  switch (code) {
    case 'C901':
      result = _rangeHelpers2['default'].tooComplex(textEditor, message, line);
      break;
    case 'F401':
      result = _rangeHelpers2['default'].importedUnused(textEditor, message, line);
      break;
    case 'H201':
      // H201 - no 'except:' at least use 'except Exception:'

      // For some reason this rule marks the ":" as the location by default
      result = {
        line: line,
        col: colNumber - 7,
        endCol: colNumber
      };
      break;
    case 'H501':
      result = _rangeHelpers2['default'].noLocalsString(textEditor, line);
      break;
    case 'E999':
      // E999 - SyntaxError: unexpected EOF while parsing

      // Workaround for https://gitlab.com/pycqa/flake8/issues/237
      result = {
        line: line,
        col: colNumber - 2
      };
      break;
    default:
      result = {
        line: line,
        col: colNumber - 1
      };
      break;
  }

  if (Object.hasOwnProperty.call(result, 'endCol')) {
    return [[result.line, result.col], [result.line, result.endCol]];
  }

  var range = undefined;
  try {
    range = helpers.rangeFromLineNumber(textEditor, result.line, result.col);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('linter-flake8:: Invalid point encountered in the attached message', {
      code: code,
      message: message,
      requestedPoint: result
    });
    throw Error('linter-flake8:: Invalid point encountered! See console for details.');
  }

  return range;
};

var applySubstitutions = function applySubstitutions(givenExecPath, projDir) {
  var execPath = givenExecPath;
  var projectName = _path2['default'].basename(projDir);
  execPath = execPath.replace(/\$PROJECT_NAME/i, projectName);
  execPath = execPath.replace(/\$PROJECT/i, projDir);
  var paths = execPath.split(';');
  for (var i = 0; i < paths.length; i += 1) {
    if (_fsPlus2['default'].existsSync(paths[i])) {
      return paths[i];
    }
  }
  return execPath;
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-flake8');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-flake8.disableTimeout', function (value) {
      _this.disableTimeout = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.projectConfigFile', function (value) {
      _this.projectConfigFile = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.maxLineLength', function (value) {
      _this.maxLineLength = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.ignoreErrorCodes', function (value) {
      _this.ignoreErrorCodes = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.maxComplexity', function (value) {
      _this.maxComplexity = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.selectErrors', function (value) {
      _this.selectErrors = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.hangClosing', function (value) {
      _this.hangClosing = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.executablePath', function (value) {
      _this.executablePath = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.pycodestyleErrorsToWarnings', function (value) {
      _this.pycodestyleErrorsToWarnings = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.flakeErrors', function (value) {
      _this.flakeErrors = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'Flake8',
      grammarScopes: ['source.python', 'source.python.django'],
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        var parameters = ['--format=default'];

        var projectPath = atom.project.relativizePath(filePath)[0];
        var baseDir = projectPath !== null ? projectPath : _path2['default'].dirname(filePath);
        var configFilePath = yield helpers.findCachedAsync(baseDir, _this2.projectConfigFile);

        if (_this2.projectConfigFile && baseDir !== null && configFilePath !== null) {
          parameters.push('--config', configFilePath);
        } else {
          if (_this2.maxLineLength) {
            parameters.push('--max-line-length', _this2.maxLineLength);
          }
          if (_this2.ignoreErrorCodes.length) {
            parameters.push('--ignore', _this2.ignoreErrorCodes.join(','));
          }
          if (_this2.maxComplexity) {
            parameters.push('--max-complexity', _this2.maxComplexity);
          }
          if (_this2.hangClosing) {
            parameters.push('--hang-closing');
          }
          if (_this2.selectErrors.length) {
            parameters.push('--select', _this2.selectErrors.join(','));
          }
        }

        parameters.push('-');

        var execPath = _fsPlus2['default'].normalize(applySubstitutions(_this2.executablePath, baseDir));
        var options = {
          stdin: fileText,
          cwd: _path2['default'].dirname(textEditor.getPath()),
          stream: 'both'
        };
        if (_this2.disableTimeout) {
          options.timeout = Infinity;
        }

        var result = yield helpers.exec(execPath, parameters, options);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, tell Linter not to update
          return null;
        }

        if (result.stderr && result.stderr.length && atom.inDevMode()) {
          // eslint-disable-next-line no-console
          console.log('flake8 stderr: ' + result.stderr);
        }
        var messages = [];

        var match = parseRegex.exec(result.stdout);
        while (match !== null) {
          var line = Number.parseInt(match[1], 10) || 0;
          var col = Number.parseInt(match[2], 10) || 0;
          var isErr = match[4] === 'E' && !_this2.pycodestyleErrorsToWarnings || match[4] === 'F' && _this2.flakeErrors;
          var range = extractRange({
            code: match[3],
            message: match[5],
            lineNumber: line,
            colNumber: col,
            textEditor: textEditor
          });

          messages.push({
            type: isErr ? 'Error' : 'Warning',
            text: match[3] + ' — ' + match[5],
            filePath: filePath,
            range: range
          });

          match = parseRegex.exec(result.stdout);
        }
        return messages;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2tlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1mbGFrZTgvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOztzQkFDM0IsU0FBUzs7OztvQkFDUCxNQUFNOzs7OzBCQUNFLGFBQWE7O0lBQTFCLE9BQU87OzRCQUNNLGdCQUFnQjs7Ozs7QUFQekMsV0FBVyxDQUFDLEFBVVosSUFBTSxVQUFVLEdBQUcsd0NBQXdDLENBQUM7O0FBRTVELElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLElBQW9ELEVBQUs7TUFBdkQsSUFBSSxHQUFOLElBQW9ELENBQWxELElBQUk7TUFBRSxPQUFPLEdBQWYsSUFBb0QsQ0FBNUMsT0FBTztNQUFFLFVBQVUsR0FBM0IsSUFBb0QsQ0FBbkMsVUFBVTtNQUFFLFNBQVMsR0FBdEMsSUFBb0QsQ0FBdkIsU0FBUztNQUFFLFVBQVUsR0FBbEQsSUFBb0QsQ0FBWixVQUFVOztBQUN0RSxNQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsTUFBTSxJQUFJLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFRLElBQUk7QUFDVixTQUFLLE1BQU07QUFDVCxZQUFNLEdBQUcsMEJBQWEsVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDNUQsWUFBTTtBQUFBLEFBQ1IsU0FBSyxNQUFNO0FBQ1QsWUFBTSxHQUFHLDBCQUFhLGNBQWMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hFLFlBQU07QUFBQSxBQUNSLFNBQUssTUFBTTs7OztBQUlULFlBQU0sR0FBRztBQUNQLFlBQUksRUFBSixJQUFJO0FBQ0osV0FBRyxFQUFFLFNBQVMsR0FBRyxDQUFDO0FBQ2xCLGNBQU0sRUFBRSxTQUFTO09BQ2xCLENBQUM7QUFDRixZQUFNO0FBQUEsQUFDUixTQUFLLE1BQU07QUFDVCxZQUFNLEdBQUcsMEJBQWEs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QVMsRUFBRSxHQUFHO0FBQ2Qsc0JBQVUsRUFBVixVQUFVO1dBQ1gsQ0FBQyxDQUFDOztBQUVILGtCQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osZ0JBQUksRUFBRSxLQUFLLEdBQUcsT0FBTyxHQUFHLFNBQVM7QUFDakMsZ0JBQUksRUFBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxBQUFFO0FBQ2pDLG9CQUFRLEVBQVIsUUFBUTtBQUNSLGlCQUFLLEVBQUwsS0FBSztXQUNOLENBQUMsQ0FBQzs7QUFFSCxlQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEM7QUFDRCxlQUFPLFFBQVEsQ0FBQztPQUNqQixDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvbGludGVyLWZsYWtlOC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ2F0b20tbGludGVyJztcbmltcG9ydCByYW5nZUhlbHBlcnMgZnJvbSAnLi9yYW5nZUhlbHBlcnMnO1xuXG4vLyBMb2NhbCB2YXJpYWJsZXNcbmNvbnN0IHBhcnNlUmVnZXggPSAvKFxcZCspOihcXGQrKTpcXHMoKFtBLVpdKVxcZHsyLDN9KVxccysoLiopL2c7XG5cbmNvbnN0IGV4dHJhY3RSYW5nZSA9ICh7IGNvZGUsIG1lc3NhZ2UsIGxpbmVOdW1iZXIsIGNvbE51bWJlciwgdGV4dEVkaXRvciB9KSA9PiB7XG4gIGxldCByZXN1bHQ7XG4gIGNvbnN0IGxpbmUgPSBsaW5lTnVtYmVyIC0gMTtcbiAgc3dpdGNoIChjb2RlKSB7XG4gICAgY2FzZSAnQzkwMSc6XG4gICAgICByZXN1bHQgPSByYW5nZUhlbHBlcnMudG9vQ29tcGxleCh0ZXh0RWRpdG9yLCBtZXNzYWdlLCBsaW5lKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0Y0MDEnOlxuICAgICAgcmVzdWx0ID0gcmFuZ2VIZWxwZXJzLmltcG9ydGVkVW51c2VkKHRleHRFZGl0b3IsIG1lc3NhZ2UsIGxpbmUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnSDIwMSc6XG4gICAgICAvLyBIMjAxIC0gbm8gJ2V4Y2VwdDonIGF0IGxlYXN0IHVzZSAnZXhjZXB0IEV4Y2VwdGlvbjonXG5cbiAgICAgIC8vIEZvciBzb21lIHJlYXNvbiB0aGlzIHJ1bGUgbWFya3MgdGhlIFwiOlwiIGFzIHRoZSBsb2NhdGlvbiBieSBkZWZhdWx0XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIGxpbmUsXG4gICAgICAgIGNvbDogY29sTnVtYmVyIC0gNyxcbiAgICAgICAgZW5kQ29sOiBjb2xOdW1iZXIsXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnSDUwMSc6XG4gICAgICByZXN1bHQgPSByYW5nZUhlbHBlcnMubm9Mb2NhbHNTdHJpbmcodGV4dEVkaXRvciwgbGluZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdFOTk5JzpcbiAgICAgIC8vIEU5OTkgLSBTeW50YXhFcnJvcjogdW5leHBlY3RlZCBFT0Ygd2hpbGUgcGFyc2luZ1xuXG4gICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGxhYi5jb20vcHljcWEvZmxha2U4L2lzc3Vlcy8yMzdcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbGluZSxcbiAgICAgICAgY29sOiBjb2xOdW1iZXIgLSAyLFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIGxpbmUsXG4gICAgICAgIGNvbDogY29sTnVtYmVyIC0gMSxcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQsICdlbmRDb2wnKSkge1xuICAgIHJldHVybiBbXG4gICAgICBbcmVzdWx0LmxpbmUsIHJlc3VsdC5jb2xdLFxuICAgICAgW3Jlc3VsdC5saW5lLCByZXN1bHQuZW5kQ29sXSxcbiAgICBdO1xuICB9XG5cbiAgbGV0IHJhbmdlO1xuICB0cnkge1xuICAgIHJhbmdlID0gaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKHRleHRFZGl0b3IsIHJlc3VsdC5saW5lLCByZXN1bHQuY29sKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcihcbiAgICAgICdsaW50ZXItZmxha2U4OjogSW52YWxpZCBwb2ludCBlbmNvdW50ZXJlZCBpbiB0aGUgYXR0YWNoZWQgbWVzc2FnZScsXG4gICAgICB7XG4gICAgICAgIGNvZGUsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHJlcXVlc3RlZFBvaW50OiByZXN1bHQsXG4gICAgICB9XG4gICAgKTtcbiAgICB0aHJvdyBFcnJvcignbGludGVyLWZsYWtlODo6IEludmFsaWQgcG9pbnQgZW5jb3VudGVyZWQhIFNlZSBjb25zb2xlIGZvciBkZXRhaWxzLicpO1xuICB9XG5cbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuY29uc3QgYXBwbHlTdWJzdGl0dXRpb25zID0gKGdpdmVuRXhlY1BhdGgsIHByb2pEaXIpID0+IHtcbiAgbGV0IGV4ZWNQYXRoID0gZ2l2ZW5FeGVjUGF0aDtcbiAgY29uc3QgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKHByb2pEaXIpO1xuICBleGVjUGF0aCA9IGV4ZWNQYXRoLnJlcGxhY2UoL1xcJFBST0pFQ1RfTkFNRS9pLCBwcm9qZWN0TmFtZSk7XG4gIGV4ZWNQYXRoID0gZXhlY1BhdGgucmVwbGFjZSgvXFwkUFJPSkVDVC9pLCBwcm9qRGlyKTtcbiAgY29uc3QgcGF0aHMgPSBleGVjUGF0aC5zcGxpdCgnOycpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aHNbaV0pKSB7XG4gICAgICByZXR1cm4gcGF0aHNbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiBleGVjUGF0aDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItZmxha2U4Jyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LmRpc2FibGVUaW1lb3V0JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVRpbWVvdXQgPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5wcm9qZWN0Q29uZmlnRmlsZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLnByb2plY3RDb25maWdGaWxlID0gdmFsdWU7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTgubWF4TGluZUxlbmd0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLm1heExpbmVMZW5ndGggPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5pZ25vcmVFcnJvckNvZGVzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuaWdub3JlRXJyb3JDb2RlcyA9IHZhbHVlO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4Lm1heENvbXBsZXhpdHknLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5tYXhDb21wbGV4aXR5ID0gdmFsdWU7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguc2VsZWN0RXJyb3JzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0RXJyb3JzID0gdmFsdWU7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguaGFuZ0Nsb3NpbmcnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5oYW5nQ2xvc2luZyA9IHZhbHVlO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LmV4ZWN1dGFibGVQYXRoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZXhlY3V0YWJsZVBhdGggPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MgPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5mbGFrZUVycm9ycycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmZsYWtlRXJyb3JzID0gdmFsdWU7XG4gICAgICB9KVxuICAgICk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdGbGFrZTgnLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UucHl0aG9uJywgJ3NvdXJjZS5weXRob24uZGphbmdvJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZVRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gWyctLWZvcm1hdD1kZWZhdWx0J107XG5cbiAgICAgICAgY29uc3QgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdO1xuICAgICAgICBjb25zdCBiYXNlRGlyID0gcHJvamVjdFBhdGggIT09IG51bGwgPyBwcm9qZWN0UGF0aCA6IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGNvbmZpZ0ZpbGVQYXRoID0gYXdhaXQgaGVscGVycy5maW5kQ2FjaGVkQXN5bmMoYmFzZURpciwgdGhpcy5wcm9qZWN0Q29uZmlnRmlsZSk7XG5cbiAgICAgICAgaWYgKHRoaXMucHJvamVjdENvbmZpZ0ZpbGUgJiYgYmFzZURpciAhPT0gbnVsbCAmJiBjb25maWdGaWxlUGF0aCAhPT0gbnVsbCkge1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1jb25maWcnLCBjb25maWdGaWxlUGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMubWF4TGluZUxlbmd0aCkge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLW1heC1saW5lLWxlbmd0aCcsIHRoaXMubWF4TGluZUxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmlnbm9yZUVycm9yQ29kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0taWdub3JlJywgdGhpcy5pZ25vcmVFcnJvckNvZGVzLmpvaW4oJywnKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLm1heENvbXBsZXhpdHkpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1tYXgtY29tcGxleGl0eScsIHRoaXMubWF4Q29tcGxleGl0eSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmhhbmdDbG9zaW5nKSB7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0taGFuZy1jbG9zaW5nJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdEVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1zZWxlY3QnLCB0aGlzLnNlbGVjdEVycm9ycy5qb2luKCcsJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLScpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWNQYXRoID0gZnMubm9ybWFsaXplKGFwcGx5U3Vic3RpdHV0aW9ucyh0aGlzLmV4ZWN1dGFibGVQYXRoLCBiYXNlRGlyKSk7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RkaW46IGZpbGVUZXh0LFxuICAgICAgICAgIGN3ZDogcGF0aC5kaXJuYW1lKHRleHRFZGl0b3IuZ2V0UGF0aCgpKSxcbiAgICAgICAgICBzdHJlYW06ICdib3RoJyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVRpbWVvdXQpIHtcbiAgICAgICAgICBvcHRpb25zLnRpbWVvdXQgPSBJbmZpbml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhleGVjUGF0aCwgcGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSBmaWxlVGV4dCkge1xuICAgICAgICAgIC8vIEVkaXRvciBjb250ZW50cyBoYXZlIGNoYW5nZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGVcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQuc3RkZXJyICYmIHJlc3VsdC5zdGRlcnIubGVuZ3RoICYmIGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgIGNvbnNvbGUubG9nKGBmbGFrZTggc3RkZXJyOiAke3Jlc3VsdC5zdGRlcnJ9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcblxuICAgICAgICBsZXQgbWF0Y2ggPSBwYXJzZVJlZ2V4LmV4ZWMocmVzdWx0LnN0ZG91dCk7XG4gICAgICAgIHdoaWxlIChtYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IGxpbmUgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMV0sIDEwKSB8fCAwO1xuICAgICAgICAgIGNvbnN0IGNvbCA9IE51bWJlci5wYXJzZUludChtYXRjaFsyXSwgMTApIHx8IDA7XG4gICAgICAgICAgY29uc3QgaXNFcnIgPSAobWF0Y2hbNF0gPT09ICdFJyAmJiAhdGhpcy5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MpXG4gICAgICAgICAgICB8fCAobWF0Y2hbNF0gPT09ICdGJyAmJiB0aGlzLmZsYWtlRXJyb3JzKTtcbiAgICAgICAgICBjb25zdCByYW5nZSA9IGV4dHJhY3RSYW5nZSh7XG4gICAgICAgICAgICBjb2RlOiBtYXRjaFszXSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1hdGNoWzVdLFxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZSxcbiAgICAgICAgICAgIGNvbE51bWJlcjogY29sLFxuICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogaXNFcnIgPyAnRXJyb3InIDogJ1dhcm5pbmcnLFxuICAgICAgICAgICAgdGV4dDogYCR7bWF0Y2hbM119IOKAlCAke21hdGNoWzVdfWAsXG4gICAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICAgIHJhbmdlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbWF0Y2ggPSBwYXJzZVJlZ2V4LmV4ZWMocmVzdWx0LnN0ZG91dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==
//# sourceURL=/home/nikke/.atom/packages/linter-flake8/lib/main.js
