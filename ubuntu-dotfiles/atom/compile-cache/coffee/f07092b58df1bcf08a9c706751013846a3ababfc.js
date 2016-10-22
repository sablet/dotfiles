(function() {
  var CompositeDisposable, JediProvider;

  CompositeDisposable = require('atom').CompositeDisposable;

  JediProvider = require('./jedi-python3-provider');

  module.exports = {
    subscriptions: null,
    config: {
      Pathtopython: {
        description: 'Python virtual environment path (eg:/home/user/py3pyenv/bin/python3 or home/user/py2virtualenv/bin/python)',
        type: 'string',
        "default": 'python3'
      }
    },
    provider: null,
    activate: function() {
      var isPathtopython;
      isPathtopython = atom.config.get('python-jedi.enablePathtopython');
      this.provider = new JediProvider();
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'jedi-python3-autocomplete:goto_definitions': (function(_this) {
          return function() {
            return _this.goto_definitions();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    getProvider: function() {
      return {
        providers: [this.provider]
      };
    },
    goto_definitions: function() {
      var column, editor, path, row, source, title;
      if (editor = atom.workspace.getActiveTextEditor()) {
        title = editor.getTitle().slice(-2);
        if (title === 'py') {
          source = editor.getText();
          row = editor.getCursorBufferPosition().row + 1;
          column = editor.getCursorBufferPosition().column + 1;
          path = editor.getPath();
          return this.provider.goto_def(source, row, column, path);
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvcHl0aG9uLWplZGkvbGliL2plZGktcHl0aG9uMy1hdXRvY29tcGxldGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHlCQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLGFBQUEsRUFBZSxJQUFmO0FBQUEsSUFFQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFZLDRHQUFaO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLFNBRlQ7T0FERjtLQUhGO0FBQUEsSUFRQSxRQUFBLEVBQVUsSUFSVjtBQUFBLElBVUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsWUFBQSxDQUFBLENBRGhCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFGakIsQ0FBQTthQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSw0Q0FBQSxFQUE4QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUM7T0FEaUIsQ0FBbkIsRUFKUTtJQUFBLENBVlY7QUFBQSxJQWlCQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEUztJQUFBLENBakJaO0FBQUEsSUFvQkEsV0FBQSxFQUFhLFNBQUEsR0FBQTtBQUNYLGFBQU87QUFBQSxRQUFDLFNBQUEsRUFBVyxDQUFDLElBQUMsQ0FBQSxRQUFGLENBQVo7T0FBUCxDQURXO0lBQUEsQ0FwQmI7QUFBQSxJQXVCQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7QUFDZixVQUFBLHdDQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtBQUNFLFFBQUEsS0FBQSxHQUFTLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBaUIsQ0FBQyxLQUFsQixDQUF3QixDQUFBLENBQXhCLENBQVQsQ0FBQTtBQUNBLFFBQUEsSUFBRyxLQUFBLEtBQVMsSUFBWjtBQUNFLFVBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxHQUFqQyxHQUF1QyxDQUQ3QyxDQUFBO0FBQUEsVUFFQSxNQUFBLEdBQVMsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxNQUFqQyxHQUEwQyxDQUZuRCxDQUFBO0FBQUEsVUFHQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUhQLENBQUE7aUJBSUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQW1CLE1BQW5CLEVBQTJCLEdBQTNCLEVBQWdDLE1BQWhDLEVBQXdDLElBQXhDLEVBTEY7U0FGRjtPQURlO0lBQUEsQ0F2QmxCO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/python-jedi/lib/jedi-python3-autocomplete.coffee
