(function() {
  var $, CompositeDisposable, GitAdd, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitDifftool, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitPaletteView, GitPull, GitPush, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, GitUnstageFiles, OutputViewManager, baseGrammar, currentFile, diffGrammar, git;

  CompositeDisposable = require('atom').CompositeDisposable;

  $ = require('atom-space-pen-views').$;

  git = require('./git');

  OutputViewManager = require('./output-view-manager');

  GitPaletteView = require('./views/git-palette-view');

  GitAdd = require('./models/git-add');

  GitBranch = require('./models/git-branch');

  GitDeleteLocalBranch = require('./models/git-delete-local-branch.coffee');

  GitDeleteRemoteBranch = require('./models/git-delete-remote-branch.coffee');

  GitCheckoutAllFiles = require('./models/git-checkout-all-files');

  GitCheckoutCurrentFile = require('./models/git-checkout-current-file');

  GitCherryPick = require('./models/git-cherry-pick');

  GitCommit = require('./models/git-commit');

  GitCommitAmend = require('./models/git-commit-amend');

  GitDiff = require('./models/git-diff');

  GitDifftool = require('./models/git-difftool');

  GitDiffAll = require('./models/git-diff-all');

  GitFetch = require('./models/git-fetch');

  GitFetchPrune = require('./models/git-fetch-prune.coffee');

  GitInit = require('./models/git-init');

  GitLog = require('./models/git-log');

  GitPull = require('./models/git-pull');

  GitPush = require('./models/git-push');

  GitRemove = require('./models/git-remove');

  GitShow = require('./models/git-show');

  GitStageFiles = require('./models/git-stage-files');

  GitStageHunk = require('./models/git-stage-hunk');

  GitStashApply = require('./models/git-stash-apply');

  GitStashDrop = require('./models/git-stash-drop');

  GitStashPop = require('./models/git-stash-pop');

  GitStashSave = require('./models/git-stash-save');

  GitStashSaveMessage = require('./models/git-stash-save-message');

  GitStatus = require('./models/git-status');

  GitTags = require('./models/git-tags');

  GitUnstageFiles = require('./models/git-unstage-files');

  GitRun = require('./models/git-run');

  GitMerge = require('./models/git-merge');

  GitRebase = require('./models/git-rebase');

  GitOpenChangedFiles = require('./models/git-open-changed-files');

  diffGrammar = require('./grammars/diff.js');

  baseGrammar = __dirname + '/grammars/diff.json';

  currentFile = function(repo) {
    var _ref;
    return repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
  };

  module.exports = {
    config: {
      includeStagedDiff: {
        title: 'Include staged diffs?',
        type: 'boolean',
        "default": true
      },
      openInPane: {
        type: 'boolean',
        "default": true,
        description: 'Allow commands to open new panes'
      },
      splitPane: {
        title: 'Split pane direction',
        type: 'string',
        "default": 'Down',
        description: 'Where should new panes go? (Defaults to Right)',
        "enum": ['Up', 'Right', 'Down', 'Left']
      },
      wordDiff: {
        type: 'boolean',
        "default": true,
        description: 'Should word diffs be highlighted in diffs?'
      },
      syntaxHighlighting: {
        title: 'Enable syntax highlighting in diffs?',
        type: 'boolean',
        "default": true
      },
      numberOfCommitsToShow: {
        type: 'integer',
        "default": 25,
        minimum: 1
      },
      gitPath: {
        type: 'string',
        "default": 'git',
        description: 'Where is your git?'
      },
      messageTimeout: {
        type: 'integer',
        "default": 5,
        description: 'How long should success/error messages be shown?'
      },
      pullBeforePush: {
        description: 'Pull from remote before pushing',
        type: 'string',
        "default": 'no',
        "enum": ['no', 'pull', 'pull --rebase']
      },
      experimental: {
        description: 'Enable beta features and behavior',
        type: 'boolean',
        "default": false
      },
      verboseCommits: {
        description: '(Experimental) Show diffs in commit pane?',
        type: 'boolean',
        "default": false
      }
    },
    subscriptions: null,
    activate: function(state) {
      var enableSyntaxHighlighting, repos;
      enableSyntaxHighlighting = atom.config.get('git-plus').syntaxHighlighting;
      if (enableSyntaxHighlighting) {
        atom.grammars.addGrammar(diffGrammar);
      } else {
        atom.grammars.loadGrammarSync(baseGrammar);
      }
      this.subscriptions = new CompositeDisposable;
      repos = atom.project.getRepositories().filter(function(r) {
        return r != null;
      });
      if (repos.length === 0) {
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:init', function() {
          return GitInit();
        }));
      }
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:menu', function() {
        return new GitPaletteView();
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add', function() {
        return git.getRepo().then(function(repo) {
          return GitAdd(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all', function() {
        return git.getRepo().then(function(repo) {
          return GitAdd(repo, {
            addAll: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit', function() {
        return git.getRepo().then(function(repo) {
          return GitCommit(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-all', function() {
        return git.getRepo().then(function(repo) {
          return GitCommit(repo, {
            stageChanges: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-amend', function() {
        return git.getRepo().then(function(repo) {
          return new GitCommitAmend(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-and-commit', function() {
        return git.getRepo().then(function(repo) {
          return git.add(repo, {
            file: currentFile(repo)
          }).then(function() {
            return GitCommit(repo);
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-and-commit-and-push', function() {
        return git.getRepo().then(function(repo) {
          return git.add(repo, {
            file: currentFile(repo)
          }).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-and-commit', function() {
        return git.getRepo().then(function(repo) {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-commit-and-push', function() {
        return git.getRepo().then(function(repo) {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.gitBranches(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-remote', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.gitRemoteBranches(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitCheckoutCurrentFile(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-all-files', function() {
        return git.getRepo().then(function(repo) {
          return GitCheckoutAllFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:new-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.newBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-local-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitDeleteLocalBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-remote-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitDeleteRemoteBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:cherry-pick', function() {
        return git.getRepo().then(function(repo) {
          return GitCherryPick(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff', function() {
        return git.getRepo().then(function(repo) {
          return GitDiff(repo, {
            file: currentFile(repo)
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:difftool', function() {
        return git.getRepo().then(function(repo) {
          return GitDifftool(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff-all', function() {
        return git.getRepo().then(function(repo) {
          return GitDiffAll(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch', function() {
        return git.getRepo().then(function(repo) {
          return GitFetch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch-prune', function() {
        return git.getRepo().then(function(repo) {
          return GitFetchPrune(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:pull', function() {
        return git.getRepo().then(function(repo) {
          return GitPull(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:pull-using-rebase', function() {
        return git.getRepo().then(function(repo) {
          return GitPull(repo, {
            rebase: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:push', function() {
        return git.getRepo().then(function(repo) {
          return GitPush(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove', function() {
        return git.getRepo().then(function(repo) {
          return GitRemove(repo, {
            showSelector: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitRemove(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:reset', function() {
        return git.getRepo().then(function(repo) {
          return git.reset(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:show', function() {
        return git.getRepo().then(function(repo) {
          return GitShow(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log', function() {
        return git.getRepo().then(function(repo) {
          return GitLog(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-files', function() {
        return git.getRepo().then(function(repo) {
          return GitStageFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:unstage-files', function() {
        return git.getRepo().then(function(repo) {
          return GitUnstageFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-hunk', function() {
        return git.getRepo().then(function(repo) {
          return GitStageHunk(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-save', function() {
        return git.getRepo().then(function(repo) {
          return GitStashSave(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-save-message', function() {
        return git.getRepo().then(function(repo) {
          return GitStashSaveMessage(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-pop', function() {
        return git.getRepo().then(function(repo) {
          return GitStashPop(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-apply', function() {
        return git.getRepo().then(function(repo) {
          return GitStashApply(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-delete', function() {
        return git.getRepo().then(function(repo) {
          return GitStashDrop(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:status', function() {
        return git.getRepo().then(function(repo) {
          return GitStatus(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:tags', function() {
        return git.getRepo().then(function(repo) {
          return GitTags(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:run', function() {
        return git.getRepo().then(function(repo) {
          return new GitRun(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge', function() {
        return git.getRepo().then(function(repo) {
          return GitMerge(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge-remote', function() {
        return git.getRepo().then(function(repo) {
          return GitMerge(repo, {
            remote: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:rebase', function() {
        return git.getRepo().then(function(repo) {
          return GitRebase(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:git-open-changed-files', function() {
        return git.getRepo().then(function(repo) {
          return GitOpenChangedFiles(repo);
        });
      }));
      return this.subscriptions.add(atom.config.observe('git-plus.syntaxHighlighting', function(value) {
        atom.grammars.removeGrammarForScopeName('diff');
        if (value) {
          return atom.grammars.addGrammar(diffGrammar);
        } else {
          return atom.grammars.loadGrammarSync(baseGrammar);
        }
      }));
    },
    deactivate: function() {
      var _ref;
      this.subscriptions.dispose();
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      return delete this.statusBarTile;
    },
    consumeStatusBar: function(statusBar) {
      this.setupBranchesMenuToggle(statusBar);
      return this.setupOutputViewToggle(statusBar);
    },
    setupOutputViewToggle: function(statusBar) {
      var div, icon, link;
      div = document.createElement('div');
      div.classList.add('inline-block');
      icon = document.createElement('span');
      icon.classList.add('icon', 'icon-pin');
      link = document.createElement('a');
      link.appendChild(icon);
      link.onclick = function(e) {
        return OutputViewManager.getView().toggle();
      };
      atom.tooltips.add(div, {
        title: "Toggle Git-Plus Output Console"
      });
      div.appendChild(link);
      return this.statusBarTile = statusBar.addRightTile({
        item: div,
        priority: 0
      });
    },
    setupBranchesMenuToggle: function(statusBar) {
      return statusBar.getRightTiles().some((function(_this) {
        return function(_arg) {
          var item, _ref;
          item = _arg.item;
          if (item != null ? (_ref = item.classList) != null ? typeof _ref.contains === "function" ? _ref.contains('git-view') : void 0 : void 0 : void 0) {
            $(item).find('.git-branch').on('click', function(e) {
              return atom.commands.dispatch(document.querySelector('atom-workspace'), 'git-plus:checkout');
            });
            return true;
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC1wbHVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwraUJBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUixDQUh6QixDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUF5QixPQUFBLENBQVEsMEJBQVIsQ0FKekIsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBeUIsT0FBQSxDQUFRLGtCQUFSLENBTHpCLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUixDQU56QixDQUFBOztBQUFBLEVBT0Esb0JBQUEsR0FBeUIsT0FBQSxDQUFRLHlDQUFSLENBUHpCLENBQUE7O0FBQUEsRUFRQSxxQkFBQSxHQUF5QixPQUFBLENBQVEsMENBQVIsQ0FSekIsQ0FBQTs7QUFBQSxFQVNBLG1CQUFBLEdBQXlCLE9BQUEsQ0FBUSxpQ0FBUixDQVR6QixDQUFBOztBQUFBLEVBVUEsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLG9DQUFSLENBVnpCLENBQUE7O0FBQUEsRUFXQSxhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUixDQVh6QixDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVIsQ0FaekIsQ0FBQTs7QUFBQSxFQWFBLGNBQUEsR0FBeUIsT0FBQSxDQUFRLDJCQUFSLENBYnpCLENBQUE7O0FBQUEsRUFjQSxPQUFBLEdBQXlCLE9BQUEs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

//# sourceURL=/home/nikke/.atom/packages/git-plus/lib/git-plus.coffee
