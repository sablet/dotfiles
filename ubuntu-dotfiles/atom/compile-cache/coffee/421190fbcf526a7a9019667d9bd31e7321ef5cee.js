(function() {
  var filesFromData, git;

  git = require('../git');

  filesFromData = function(statusData) {
    var files, line, lineMatch, _i, _len;
    files = [];
    for (_i = 0, _len = statusData.length; _i < _len; _i++) {
      line = statusData[_i];
      lineMatch = line.match(/^([ MARCU?!]{2})\s{1}(.*)/);
      if (lineMatch) {
        files.push(lineMatch[2]);
      }
    }
    return files;
  };

  module.exports = function(repo) {
    return git.status(repo).then(function(statusData) {
      var file, _i, _len, _ref, _results;
      _ref = filesFromData(statusData);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(atom.workspace.open(file));
      }
      return _results;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtb3Blbi1jaGFuZ2VkLWZpbGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLFNBQUMsVUFBRCxHQUFBO0FBQ2QsUUFBQSxnQ0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUNBLFNBQUEsaURBQUE7NEJBQUE7QUFDRSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLDJCQUFYLENBQVosQ0FBQTtBQUNBLE1BQUEsSUFBMkIsU0FBM0I7QUFBQSxRQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsU0FBVSxDQUFBLENBQUEsQ0FBckIsQ0FBQSxDQUFBO09BRkY7QUFBQSxLQURBO1dBSUEsTUFMYztFQUFBLENBRmhCLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsR0FBQTtXQUNmLEdBQUcsQ0FBQyxNQUFKLENBQVcsSUFBWCxDQUFnQixDQUFDLElBQWpCLENBQXNCLFNBQUMsVUFBRCxHQUFBO0FBQ3BCLFVBQUEsOEJBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7d0JBQUE7QUFDRSxzQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsRUFBQSxDQURGO0FBQUE7c0JBRG9CO0lBQUEsQ0FBdEIsRUFEZTtFQUFBLENBVGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/nikke/.atom/packages/git-plus/lib/models/git-open-changed-files.coffee
