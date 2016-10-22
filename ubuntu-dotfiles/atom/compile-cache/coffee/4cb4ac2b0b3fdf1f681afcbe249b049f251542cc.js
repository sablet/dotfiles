(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, dir, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, trimFile, verboseCommitsEnabled;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  verboseCommitsEnabled = function() {
    return atom.config.get('git-plus.experimental') && atom.config.get('git-plus.verboseCommits');
  };

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(cwd) {
    return git.getConfig('commit.template', cwd).then(function(filePath) {
      if (filePath) {
        return fs.readFileSync(Path.get(filePath.trim())).toString().trim();
      } else {
        return '';
      }
    });
  };

  prepFile = function(status, filePath, diff) {
    var cwd;
    if (diff == null) {
      diff = '';
    }
    cwd = Path.dirname(filePath);
    return git.getConfig('core.commentchar', cwd).then(function(commentchar) {
      commentchar = commentchar ? commentchar.trim() : '#';
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + commentchar + " ");
      return getTemplate(cwd).then(function(template) {
        var content;
        content = "" + template + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status;
        if (diff !== '') {
          content += "\n" + commentchar + "\n" + commentchar + " ------------------------ >8 ------------------------\n" + commentchar + " Do not touch the line above.\n" + commentchar + " Everything below will be removed.\n" + diff;
        }
        return fs.writeFileSync(filePath, content);
      });
    });
  };

  destroyCommitEditor = function() {
    var _ref;
    return (_ref = atom.workspace) != null ? _ref.getPanes().some(function(pane) {
      return pane.getItems().some(function(paneItem) {
        var _ref1;
        if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref1 = paneItem.getURI()) != null ? _ref1.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
          if (pane.getItems().length === 1) {
            pane.destroy();
          } else {
            paneItem.destroy();
          }
          return true;
        }
      });
    }) : void 0;
  };

  trimFile = function(filePath) {
    var cwd;
    cwd = Path.dirname(filePath);
    return git.getConfig('core.commentchar', cwd).then(function(commentchar) {
      var content, startOfComments;
      commentchar = commentchar === '' ? '#' : void 0;
      content = fs.readFileSync(Path.get(filePath)).toString();
      startOfComments = content.indexOf(content.split('\n').find(function(line) {
        return line.startsWith(commentchar);
      }));
      content = content.substring(0, startOfComments);
      return fs.writeFileSync(filePath, content);
    });
  };

  commit = function(directory, filePath) {
    var promise;
    promise = null;
    if (verboseCommitsEnabled()) {
      promise = trimFile(filePath).then(function() {
        return git.cmd(['commit', "--file=" + filePath], {
          cwd: directory
        });
      });
    } else {
      promise = git.cmd(['commit', "--cleanup=strip", "--file=" + filePath], {
        cwd: directory
      });
    }
    return promise.then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    })["catch"](function(data) {
      return notifier.addError(data);
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.unlink(filePath);
  };

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
  };

  module.exports = function(repo, _arg) {
    var andPush, currentPane, filePath, init, stageChanges, startCommit, _ref;
    _ref = _arg != null ? _arg : {}, stageChanges = _ref.stageChanges, andPush = _ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        var args;
        if (verboseCommitsEnabled()) {
          args = ['diff', '--color=never', '--staged'];
          if (atom.config.get('git-plus.wordDiff')) {
            args.push('--word-diff');
          }
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          }).then(function(diff) {
            return prepFile(status, filePath, diff);
          });
        } else {
          return prepFile(status, filePath);
        }
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.add(textEditor.onDidSave(function() {
          return commit(dir(repo), filePath).then(function() {
            if (andPush) {
              return GitPush(repo);
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane, filePath);
        }));
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };
    if (stageChanges) {
      return git.add(repo, {
        update: stageChanges
      }).then(function() {
        return init();
      }).then(function() {
        return startCommit();
      });
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        if (typeof message.includes === "function" ? message.includes('CRLF') : void 0) {
          return startCommit();
        } else {
          return notifier.addInfo(message);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3TUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FKTixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQU5WLENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FQVixDQUFBOztBQUFBLEVBU0EsV0FBQSxHQUFjLEdBQUEsQ0FBQSxtQkFUZCxDQUFBOztBQUFBLEVBV0EscUJBQUEsR0FBd0IsU0FBQSxHQUFBO1dBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFBLElBQTZDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsRUFBaEQ7RUFBQSxDQVh4QixDQUFBOztBQUFBLEVBYUEsR0FBQSxHQUFNLFNBQUMsSUFBRCxHQUFBO1dBQ0osQ0FBQyxHQUFHLENBQUMsWUFBSixDQUFBLENBQUEsSUFBc0IsSUFBdkIsQ0FBNEIsQ0FBQyxtQkFBN0IsQ0FBQSxFQURJO0VBQUEsQ0FiTixDQUFBOztBQUFBLEVBZ0JBLGNBQUEsR0FBaUIsU0FBQyxJQUFELEdBQUE7V0FDZixHQUFHLENBQUMsV0FBSixDQUFnQixJ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

//# sourceURL=/home/nikke/.atom/packages/git-plus/lib/models/git-commit.coffee
