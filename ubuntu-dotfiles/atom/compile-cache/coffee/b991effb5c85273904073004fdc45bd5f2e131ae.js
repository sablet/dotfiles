(function() {
  var GitHistory, GitHistoryView;

  GitHistoryView = require("./git-history-view");

  GitHistory = (function() {
    function GitHistory() {}

    GitHistory.prototype.config = {
      showDiff: {
        type: "boolean",
        "default": true
      },
      maxCommits: {
        type: "integer",
        "default": 100
      }
    };

    GitHistory.prototype.activate = function() {
      return atom.commands.add("atom-text-editor", {
        "git-history:show-file-history": this._loadGitHistoryView
      });
    };

    GitHistory.prototype._loadGitHistoryView = function() {
      var _ref;
      return new GitHistoryView((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    };

    return GitHistory;

  })();

  module.exports = new GitHistory();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LWhpc3RvcnkvbGliL2dpdC1oaXN0b3J5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQWpCLENBQUE7O0FBQUEsRUFFTTs0QkFFRjs7QUFBQSx5QkFBQSxNQUFBLEdBQ0k7QUFBQSxNQUFBLFFBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREo7QUFBQSxNQUdBLFVBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxHQURUO09BSko7S0FESixDQUFBOztBQUFBLHlCQVFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0k7QUFBQSxRQUFBLCtCQUFBLEVBQWlDLElBQUMsQ0FBQSxtQkFBbEM7T0FESixFQURNO0lBQUEsQ0FSVixDQUFBOztBQUFBLHlCQVlBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNqQixVQUFBLElBQUE7YUFBSSxJQUFBLGNBQUEsNkRBQW1ELENBQUUsT0FBdEMsQ0FBQSxVQUFmLEVBRGE7SUFBQSxDQVpyQixDQUFBOztzQkFBQTs7TUFKSixDQUFBOztBQUFBLEVBbUJBLE1BQU0sQ0FBQyxPQUFQLEdBQXFCLElBQUEsVUFBQSxDQUFBLENBbkJyQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/git-history/lib/git-history.coffee
