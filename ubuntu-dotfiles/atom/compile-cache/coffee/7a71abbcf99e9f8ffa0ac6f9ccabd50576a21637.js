(function() {
  var iconHTML, regexes, _;

  _ = require('lodash');

  iconHTML = "<img src='" + __dirname + "/../static/logo.svg' style='width: 100%;'>";

  regexes = {
    r: /([^\d\W]|[.])[\w.$]*$/,
    python: /([^\d\W]|[\u00A0-\uFFFF])[\w.\u00A0-\uFFFF]*$/,
    php: /[$a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/
  };

  module.exports = function(kernelManager) {
    var autocompleteProvider;
    autocompleteProvider = {
      selector: '.source',
      disableForSelector: '.comment, .string',
      inclusionPriority: 1,
      excludeLowerPriority: false,
      getSuggestions: function(_arg) {
        var bufferPosition, editor, grammar, kernel, language, line, prefix, regex, scopeDescriptor, _ref;
        editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
        grammar = editor.getGrammar();
        language = kernelManager.getLanguageFor(grammar);
        kernel = kernelManager.getRunningKernelFor(language);
        if (kernel == null) {
          return null;
        }
        line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
        regex = regexes[language];
        if (regex) {
          prefix = ((_ref = line.match(regex)) != null ? _ref[0] : void 0) || '';
        } else {
          prefix = line;
        }
        if (prefix.trimRight().length < prefix.length) {
          return null;
        }
        if (prefix.trim().length < 3) {
          return null;
        }
        console.log('autocompleteProvider: request:', line, bufferPosition, prefix);
        return new Promise(function(resolve) {
          return kernel.complete(prefix, function(_arg1) {
            var cursor_end, cursor_start, matches, replacementPrefix;
            matches = _arg1.matches, cursor_start = _arg1.cursor_start, cursor_end = _arg1.cursor_end;
            replacementPrefix = prefix.slice(cursor_start, cursor_end);
            matches = _.map(matches, function(match) {
              return {
                text: match,
                replacementPrefix: replacementPrefix,
                iconHTML: iconHTML
              };
            });
            return resolve(matches);
          });
        });
      }
    };
    return autocompleteProvider;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2F1dG9jb21wbGV0ZS1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0JBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFZLFlBQUEsR0FBWSxTQUFaLEdBQXNCLDRDQURsQyxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUVJO0FBQUEsSUFBQSxDQUFBLEVBQUcsdUJBQUg7QUFBQSxJQUdBLE1BQUEsRUFBUSwrQ0FIUjtBQUFBLElBTUEsR0FBQSxFQUFLLDRDQU5MO0dBTEosQ0FBQTs7QUFBQSxFQWNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsYUFBRCxHQUFBO0FBQ2IsUUFBQSxvQkFBQTtBQUFBLElBQUEsb0JBQUEsR0FDSTtBQUFBLE1BQUEsUUFBQSxFQUFVLFNBQVY7QUFBQSxNQUNBLGtCQUFBLEVBQW9CLG1CQURwQjtBQUFBLE1BTUEsaUJBQUEsRUFBbUIsQ0FObkI7QUFBQSxNQU9BLG9CQUFBLEVBQXNCLEtBUHRCO0FBQUEsTUFVQSxjQUFBLEVBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ1osWUFBQSw2RkFBQTtBQUFBLFFBRGMsY0FBQSxRQUFRLHNCQUFBLGdCQUFnQix1QkFBQSxpQkFBaUIsY0FBQSxNQUN2RCxDQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFWLENBQUE7QUFBQSxRQUNBLFFBQUEsR0FBVyxhQUFhLENBQUMsY0FBZCxDQUE2QixPQUE3QixDQURYLENBQUE7QUFBQSxRQUVBLE1BQUEsR0FBUyxhQUFhLENBQUMsbUJBQWQsQ0FBa0MsUUFBbEMsQ0FGVCxDQUFBO0FBR0EsUUFBQSxJQUFPLGNBQVA7QUFDSSxpQkFBTyxJQUFQLENBREo7U0FIQTtBQUFBLFFBTUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQ3pCLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBRHlCLEVBRXpCLGNBRnlCLENBQXRCLENBTlAsQ0FBQTtBQUFBLFFBV0EsS0FBQSxHQUFRLE9BQVEsQ0FBQSxRQUFBLENBWGhCLENBQUE7QUFZQSxRQUFBLElBQUcsS0FBSDtBQUNJLFVBQUEsTUFBQSw2Q0FBNEIsQ0FBQSxDQUFBLFdBQW5CLElBQXlCLEVBQWxDLENBREo7U0FBQSxNQUFBO0FBR0ksVUFBQSxNQUFBLEdBQVMsSUFBVCxDQUhKO1NBWkE7QUFrQkEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxNQUFuQixHQUE0QixNQUFNLENBQUMsTUFBdEM7QUFDSSxpQkFBTyxJQUFQLENBREo7U0FsQkE7QUFxQkEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBYSxDQUFDLE1BQWQsR0FBdUIsQ0FBMUI7QUFDSSxpQkFBTyxJQUFQLENBREo7U0FyQkE7QUFBQSxRQXdCQSxPQUFPLENBQUMsR0FBUixDQUFZLGdDQUFaLEVBQ0ksSUFESixFQUNVLGNBRFYsRUFDMEIsTUFEMUIsQ0F4QkEsQ0FBQTtBQTJCQSxlQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxHQUFBO2lCQUNmLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE1BQWhCLEVBQXdCLFNBQUMsS0FBRCxHQUFBO0FBQ3BCLGdCQUFBLG9EQUFBO0FBQUEsWUFEc0IsZ0JBQUEsU0FBUyxxQkFBQSxjQUFjLG1CQUFBLFVBQzdDLENBQUE7QUFBQSxZQUFBLGlCQUFBLEdBQW9CLE1BQU0sQ0FBQyxLQUFQLENBQWEsWUFBYixFQUEyQixVQUEzQixDQUFwQixDQUFBO0FBQUEsWUFFQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxPQUFOLEVBQWUsU0FBQyxLQUFELEdBQUE7cUJBQ3JCO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLEtBQU47QUFBQSxnQkFDQSxpQkFBQSxFQUFtQixpQkFEbkI7QUFBQSxnQkFFQSxRQUFBLEVBQVUsUUFGVjtnQkFEcUI7WUFBQSxDQUFmLENBRlYsQ0FBQTttQkFPQSxPQUFBLENBQVEsT0FBUixFQVJvQjtVQUFBLENBQXhCLEVBRGU7UUFBQSxDQUFSLENBQVgsQ0E1Qlk7TUFBQSxDQVZoQjtLQURKLENBQUE7QUFrREEsV0FBTyxvQkFBUCxDQW5EYTtFQUFBLENBZGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/autocomplete-provider.coffee
