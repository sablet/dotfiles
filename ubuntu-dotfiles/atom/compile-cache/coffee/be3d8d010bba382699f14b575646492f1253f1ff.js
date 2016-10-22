(function() {
  var ProjectsListView, git, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  init = function(path) {
    return git.cmd(['init'], {
      cwd: path
    }).then(function(data) {
      notifier.addSuccess(data);
      return atom.project.setPaths(atom.project.getPaths());
    });
  };

  module.exports = function() {
    var currentFile, _ref;
    currentFile = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtaW5pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDZCQUFSLENBRG5CLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO1dBQ0wsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE1BQUQsQ0FBUixFQUFrQjtBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUw7S0FBbEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTtBQUNKLE1BQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsSUFBcEIsQ0FBQSxDQUFBO2FBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXRCLEVBRkk7SUFBQSxDQUROLEVBREs7RUFBQSxDQUpQLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7QUFDZixRQUFBLGlCQUFBO0FBQUEsSUFBQSxXQUFBLCtEQUFrRCxDQUFFLE9BQXRDLENBQUEsVUFBZCxDQUFBO0FBQ0EsSUFBQSxJQUFHLENBQUEsV0FBQSxJQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF1QixDQUFDLE1BQXhCLEdBQWlDLENBQXhEO2FBQ00sSUFBQSxnQkFBQSxDQUFBLENBQWtCLENBQUMsTUFBTSxDQUFDLElBQTFCLENBQStCLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBQSxDQUFLLElBQUwsRUFBVjtNQUFBLENBQS9CLEVBRE47S0FBQSxNQUFBO2FBR0UsSUFBQSxDQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUE3QixFQUhGO0tBRmU7RUFBQSxDQVZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/git-plus/lib/models/git-init.coffee
