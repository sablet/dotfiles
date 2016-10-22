(function() {
  var $$, BufferedProcess, GitHistoryView, SelectListView, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require("path");

  fs = require("fs");

  _ref = require("atom-space-pen-views"), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  BufferedProcess = require("atom").BufferedProcess;

  GitHistoryView = (function(_super) {
    __extends(GitHistoryView, _super);

    function GitHistoryView() {
      return GitHistoryView.__super__.constructor.apply(this, arguments);
    }

    GitHistoryView.prototype.initialize = function(file) {
      this.file = file;
      GitHistoryView.__super__.initialize.call(this);
      if (file) {
        return this.show();
      }
    };

    GitHistoryView.prototype.show = function() {
      this.setLoading("Loading history for " + (path.basename(this.file)));
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      this._loadLogData();
      return this.focusFilterEditor();
    };

    GitHistoryView.prototype.cancel = function() {
      var _ref1;
      GitHistoryView.__super__.cancel.call(this);
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    GitHistoryView.prototype._loadLogData = function() {
      var exit, logItems, stdout;
      logItems = [];
      stdout = function(output) {
        var author, authorEscaped, commit, commitAltered, commits, freeTextMatches, item, message, messageEscaped, _i, _j, _len, _len1, _ref1, _results;
        output = output.replace('\n', '');
        commits = output.match(/{"author": ".*?","relativeDate": ".*?","fullDate": ".*?","message": ".*?","hash": "[a-f0-9]*?"},/g);
        output = '';
        if (commits != null) {
          for (_i = 0, _len = commits.length; _i < _len; _i++) {
            commit = commits[_i];
            freeTextMatches = commit.match(/{"author": "(.*?)","relativeDate": ".*?","fullDate": ".*?","message": "(.*)","hash": "[a-f0-9]*?"},/);
            author = freeTextMatches[1];
            authorEscaped = author.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
            commitAltered = commit.replace(author, authorEscaped);
            message = freeTextMatches[2];
            messageEscaped = message.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
            output += commitAltered.replace(message, messageEscaped);
          }
        }
        if ((output != null ? output.substring(output.length - 1) : void 0) === ",") {
          output = output.substring(0, output.length - 1);
        }
        _ref1 = JSON.parse("[" + output + "]");
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          _results.push(logItems.push(item));
        }
        return _results;
      };
      exit = (function(_this) {
        return function(code) {
          if (code === 0 && logItems.length !== 0) {
            return _this.setItems(logItems);
          } else {
            return _this.setError("No history found for " + (path.basename(_this.file)));
          }
        };
      })(this);
      return this._fetchFileHistory(stdout, exit);
    };

    GitHistoryView.prototype._fetchFileHistory = function(stdout, exit) {
      var format;
      format = "{\"author\": \"%an\",\"relativeDate\": \"%cr\",\"fullDate\": \"%ad\",\"message\": \"%s\",\"hash\": \"%h\"},";
      return new BufferedProcess({
        command: "git",
        args: ["-C", path.dirname(this.file), "log", "--max-count=" + (this._getMaxNumberOfCommits()), "--pretty=format:" + format, "--topo-order", "--date=local", "--follow", this.file],
        stdout: stdout,
        exit: exit
      });
    };

    GitHistoryView.prototype._getMaxNumberOfCommits = function() {
      return atom.config.get("git-history.maxCommits");
    };

    GitHistoryView.prototype._isDiffEnabled = function() {
      return atom.config.get("git-history.showDiff");
    };

    GitHistoryView.prototype.getFilterKey = function() {
      return "message";
    };

    GitHistoryView.prototype.viewForItem = function(logItem) {
      var fileName;
      fileName = path.basename(this.file);
      return $$(function() {
        return this.li({
          "class": "two-lines"
        }, (function(_this) {
          return function() {
            _this.div({
              "class": "pull-right"
            }, function() {
              return _this.span({
                "class": "secondary-line"
              }, "" + logItem.hash);
            });
            _this.span({
              "class": "primary-line"
            }, logItem.message);
            _this.div({
              "class": "secondary-line"
            }, "" + logItem.author + " authored " + logItem.relativeDate);
            return _this.div({
              "class": "secondary-line"
            }, "" + logItem.fullDate);
          };
        })(this));
      });
    };

    GitHistoryView.prototype.confirmed = function(logItem) {
      var exit, fileContents, stdout;
      fileContents = "";
      stdout = (function(_this) {
        return function(output) {
          return fileContents += output;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          var outputDir, outputFilePath;
          if (code === 0) {
            outputDir = "" + (atom.getConfigDirPath()) + "/.git-history";
            if (!fs.existsSync(outputDir)) {
              fs.mkdir(outputDir);
            }
            outputFilePath = "" + outputDir + "/" + logItem.hash + "-" + (path.basename(_this.file));
            if (_this._isDiffEnabled()) {
              outputFilePath += ".diff";
            }
            return fs.writeFile(outputFilePath, fileContents, function(error) {
              var options;
              if (!error) {
                options = {
                  split: "right",
                  activatePane: true
                };
                return atom.workspace.open(outputFilePath, options);
              }
            });
          } else {
            return _this.setError("Could not retrieve history for " + (path.basename(_this.file)));
          }
        };
      })(this);
      return this._loadRevision(logItem.hash, stdout, exit);
    };

    GitHistoryView.prototype._loadRevision = function(hash, stdout, exit) {
      var diffArgs, r, repo, showArgs, showDiff, _i, _len, _ref1;
      _ref1 = atom.project.getRepositories();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        r = _ref1[_i];
        if (this.file.replace(/\\/g, '/').indexOf(r != null ? r.repo.workingDirectory : void 0) !== -1) {
          repo = r;
        }
      }
      showDiff = this._isDiffEnabled();
      diffArgs = ["-C", repo.repo.workingDirectory, "diff", "-U9999999", "" + hash + ":" + (atom.project.relativize(this.file).replace(/\\/g, '/')), "" + (atom.project.relativize(this.file).replace(/\\/g, '/'))];
      showArgs = ["-C", path.dirname(this.file), "show", "" + hash + ":" + (atom.project.relativize(this.file).replace(/\\/g, '/'))];
      return new BufferedProcess({
        command: "git",
        args: showDiff ? diffArgs : showArgs,
        stdout: stdout,
        exit: exit
      });
    };

    return GitHistoryView;

  })(SelectListView);

  module.exports = GitHistoryView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LWhpc3RvcnkvbGliL2dpdC1oaXN0b3J5LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBRkwsQ0FBQTs7QUFBQSxFQUdDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUhELENBQUE7O0FBQUEsRUFLTTtBQUVGLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw2QkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEdBQUE7QUFDUixNQURTLElBQUMsQ0FBQSxPQUFBLElBQ1YsQ0FBQTtBQUFBLE1BQUEsNkNBQUEsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFXLElBQVg7ZUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7T0FGUTtJQUFBLENBQVosQ0FBQTs7QUFBQSw2QkFJQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0YsTUFBQSxJQUFDLENBQUEsVUFBRCxDQUFhLHNCQUFBLEdBQXFCLENBQUMsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFDLENBQUEsSUFBZixDQUFELENBQWxDLENBQUEsQ0FBQTs7UUFDQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BRFY7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBRkEsQ0FBQTtB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

//# sourceURL=/home/nikke/.atom/packages/git-history/lib/git-history-view.coffee
