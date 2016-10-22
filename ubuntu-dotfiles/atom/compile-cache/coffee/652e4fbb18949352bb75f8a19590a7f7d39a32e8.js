(function() {
  var PathsProvider, Range, fs, fuzzaldrin, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Range = require('atom').Range;

  fuzzaldrin = require('fuzzaldrin');

  path = require('path');

  fs = require('fs');

  module.exports = PathsProvider = (function() {
    function PathsProvider() {
      this.dispose = __bind(this.dispose, this);
      this.prefixForCursor = __bind(this.prefixForCursor, this);
      this.requestHandler = __bind(this.requestHandler, this);
    }

    PathsProvider.prototype.id = 'autocomplete-paths-pathsprovider';

    PathsProvider.prototype.selector = '*';

    PathsProvider.prototype.wordRegex = /[a-zA-Z0-9\.\/_-]*\/[a-zA-Z0-9\.\/_-]*/g;

    PathsProvider.prototype.cache = [];

    PathsProvider.prototype.requestHandler = function(options) {
      var basePath, editorPath, prefix, suggestions, _ref;
      if (options == null) {
        options = {};
      }
      if (!((options.editor != null) && (options.buffer != null) && (options.cursor != null))) {
        return [];
      }
      editorPath = (_ref = options.editor) != null ? _ref.getPath() : void 0;
      if (!(editorPath != null ? editorPath.length : void 0)) {
        return [];
      }
      basePath = path.dirname(editorPath);
      if (basePath == null) {
        return [];
      }
      prefix = this.prefixForCursor(options.editor, options.buffer, options.cursor, options.position);
      if (!prefix.length) {
        return [];
      }
      suggestions = this.findSuggestionsForPrefix(options.editor, basePath, prefix);
      if (!suggestions.length) {
        return [];
      }
      return suggestions;
    };

    PathsProvider.prototype.prefixForCursor = function(editor, buffer, cursor, position) {
      var end, start;
      if (!((buffer != null) && (cursor != null))) {
        return '';
      }
      start = this.getBeginningOfCurrentWordBufferPosition(editor, position, {
        wordRegex: this.wordRegex
      });
      end = cursor.getBufferPosition();
      if (!((start != null) && (end != null))) {
        return '';
      }
      return buffer.getTextInRange(new Range(start, end));
    };

    PathsProvider.prototype.getBeginningOfCurrentWordBufferPosition = function(editor, position, options) {
      var allowPrevious, beginningOfWordPosition, currentBufferPosition, scanRange, _ref;
      if (options == null) {
        options = {};
      }
      if (position == null) {
        return;
      }
      allowPrevious = (_ref = options.allowPrevious) != null ? _ref : true;
      currentBufferPosition = position;
      scanRange = [[currentBufferPosition.row, 0], currentBufferPosition];
      beginningOfWordPosition = null;
      editor.backwardsScanInBufferRange(options.wordRegex, scanRange, function(_arg) {
        var range, stop;
        range = _arg.range, stop = _arg.stop;
        if (range.end.isGreaterThanOrEqual(currentBufferPosition) || allowPrevious) {
          beginningOfWordPosition = range.start;
        }
        if (!(beginningOfWordPosition != null ? beginningOfWordPosition.isEqual(currentBufferPosition) : void 0)) {
          return stop();
        }
      });
      if (beginningOfWordPosition != null) {
        return beginningOfWordPosition;
      } else if (allowPrevious) {
        return [currentBufferPosition.row, 0];
      } else {
        return currentBufferPosition;
      }
    };

    PathsProvider.prototype.findSuggestionsForPrefix = function(editor, basePath, prefix) {
      var directory, e, files, label, prefixPath, result, resultPath, results, stat, suggestion, suggestions;
      if (basePath == null) {
        return [];
      }
      prefixPath = path.resolve(basePath, prefix);
      if (prefix.endsWith('/')) {
        directory = prefixPath;
        prefix = '';
      } else {
        if (basePath === prefixPath) {
          directory = prefixPath;
        } else {
          directory = path.dirname(prefixPath);
        }
        prefix = path.basename(prefix);
      }
      try {
        stat = fs.statSync(directory);
        if (!stat.isDirectory()) {
          return [];
        }
      } catch (_error) {
        e = _error;
        return [];
      }
      try {
        files = fs.readdirSync(directory);
      } catch (_error) {
        e = _error;
        return [];
      }
      results = fuzzaldrin.filter(files, prefix);
      suggestions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = results.length; _i < _len; _i++) {
          result = results[_i];
          resultPath = path.resolve(directory, result);
          try {
            stat = fs.statSync(resultPath);
          } catch (_error) {
            e = _error;
            continue;
          }
          if (stat.isDirectory()) {
            label = 'Dir';
            result += path.sep;
          } else if (stat.isFile()) {
            label = 'File';
          } else {
            continue;
          }
          suggestion = {
            word: result,
            prefix: prefix,
            label: label,
            data: {
              body: result
            }
          };
          if (suggestion.label !== 'File') {
            suggestion.onDidConfirm = function() {
              return atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate');
            };
          }
          _results.push(suggestion);
        }
        return _results;
      })();
      return suggestions;
    };

    PathsProvider.prototype.dispose = function() {
      this.editor = null;
      return this.basePath = null;
    };

    return PathsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9wYXRocy1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFFBQVUsT0FBQSxDQUFRLE1BQVIsRUFBVixLQUFELENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNOzs7OztLQUNKOztBQUFBLDRCQUFBLEVBQUEsR0FBSSxrQ0FBSixDQUFBOztBQUFBLDRCQUNBLFFBQUEsR0FBVSxHQURWLENBQUE7O0FBQUEsNEJBRUEsU0FBQSxHQUFXLHlDQUZYLENBQUE7O0FBQUEsNEJBR0EsS0FBQSxHQUFPLEVBSFAsQ0FBQTs7QUFBQSw0QkFLQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsVUFBQSwrQ0FBQTs7UUFEZSxVQUFVO09BQ3pCO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBaUIsd0JBQUEsSUFBb0Isd0JBQXBCLElBQXdDLHdCQUF6RCxDQUFBO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsVUFBQSx5Q0FBMkIsQ0FBRSxPQUFoQixDQUFBLFVBRGIsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLHNCQUFpQixVQUFVLENBQUUsZ0JBQTdCO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FGQTtBQUFBLE1BR0EsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixDQUhYLENBQUE7QUFJ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

//# sourceURL=/home/nikke/.atom/packages/autocomplete-paths/lib/paths-provider.coffee
