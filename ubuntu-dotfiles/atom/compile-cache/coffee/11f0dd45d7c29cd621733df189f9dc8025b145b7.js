(function() {
  var Selector, log, provider, selectorsMatchScopeChain;

  provider = require('./provider');

  log = require('./log');

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  Selector = require('selector-kit').Selector;

  module.exports = {
    priority: 1,
    providerName: 'autocomplete-python',
    disableForSelector: "" + provider.disableForSelector + ", .source.python .numeric, .source.python .integer, .source.python .decimal, .source.python .punctuation, .source.python .keyword, .source.python .storage, .source.python .variable.parameter, .source.python .entity.name",
    _getScopes: function(editor, range) {
      return editor.scopeDescriptorForBufferPosition(range).scopes;
    },
    getSuggestionForWord: function(editor, text, range) {
      var bufferPosition, callback, disableForSelector, scopeChain, scopeDescriptor;
      if (text === '.' || text === ':') {
        return;
      }
      if (editor.getGrammar().scopeName === 'source.python') {
        bufferPosition = range.start;
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
        scopeChain = scopeDescriptor.getScopeChain();
        disableForSelector = Selector.create(this.disableForSelector);
        if (selectorsMatchScopeChain(disableForSelector, scopeChain)) {
          return;
        }
        if (atom.config.get('autocomplete-python.outputDebug')) {
          log.debug(range.start, this._getScopes(editor, range.start));
          log.debug(range.end, this._getScopes(editor, range.end));
        }
        callback = function() {
          return provider.goToDefinition(editor, bufferPosition);
        };
        return {
          range: range,
          callback: callback
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvaHlwZXJjbGljay1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaURBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVDLDJCQUE0QixPQUFBLENBQVEsaUJBQVIsRUFBNUIsd0JBRkQsQ0FBQTs7QUFBQSxFQUdDLFdBQVksT0FBQSxDQUFRLGNBQVIsRUFBWixRQUhELENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsQ0FBVjtBQUFBLElBRUEsWUFBQSxFQUFjLHFCQUZkO0FBQUEsSUFJQSxrQkFBQSxFQUFvQixFQUFBLEdBQUcsUUFBUSxDQUFDLGtCQUFaLEdBQStCLDZOQUpuRDtBQUFBLElBTUEsVUFBQSxFQUFZLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTtBQUNWLGFBQU8sTUFBTSxDQUFDLGdDQUFQLENBQXdDLEtBQXhDLENBQThDLENBQUMsTUFBdEQsQ0FEVTtJQUFBLENBTlo7QUFBQSxJQVNBLG9CQUFBLEVBQXNCLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxLQUFmLEdBQUE7QUFDcEIsVUFBQSx5RUFBQTtBQUFBLE1BQUEsSUFBRyxJQUFBLEtBQVMsR0FBVCxJQUFBLElBQUEsS0FBYyxHQUFqQjtBQUNFLGNBQUEsQ0FERjtPQUFBO0FBRUEsTUFBQSxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFwQixLQUFpQyxlQUFwQztBQUNFLFFBQUEsY0FBQSxHQUFpQixLQUFLLENBQUMsS0FBdkIsQ0FBQTtBQUFBLFFBQ0EsZUFBQSxHQUFrQixNQUFNLENBQUMsZ0NBQVAsQ0FDaEIsY0FEZ0IsQ0FEbEIsQ0FBQTtBQUFBLFFBR0EsVUFBQSxHQUFhLGVBQWUsQ0FBQyxhQUFoQixDQUFBLENBSGIsQ0FBQTtBQUFBLFFBSUEsa0JBQUEsR0FBcUIsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLGtCQUFqQixDQUpyQixDQUFBO0FBS0EsUUFBQSxJQUFHLHdCQUFBLENBQXlCLGtCQUF6QixFQUE2QyxVQUE3QyxDQUFIO0FBQ0UsZ0JBQUEsQ0FERjtTQUxBO0FBUUEsUUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FBSDtBQUNFLFVBQUEsR0FBRyxDQUFDLEtBQUosQ0FBVSxLQUFLLENBQUMsS0FBaEIsRUFBdUIsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLEVBQW9CLEtBQUssQ0FBQyxLQUExQixDQUF2QixDQUFBLENBQUE7QUFBQSxVQUNBLEdBQUcsQ0FBQyxLQUFKLENBQVUsS0FBSyxDQUFDLEdBQWhCLEVBQXFCLElBQUMsQ0FBQSxVQUFELENBQVksTUFBWixFQUFvQixLQUFLLENBQUMsR0FBMUIsQ0FBckIsQ0FEQSxDQURGO1NBUkE7QUFBQSxRQVdBLFFBQUEsR0FBVyxTQUFBLEdBQUE7aUJBQ1QsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsY0FBaEMsRUFEUztRQUFBLENBWFgsQ0FBQTtBQWFBLGVBQU87QUFBQSxVQUFDLE9BQUEsS0FBRDtBQUFBLFVBQVEsVUFBQSxRQUFSO1NBQVAsQ0FkRjtPQUhvQjtJQUFBLENBVHRCO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/autocomplete-python/lib/hyperclick-provider.coffee
