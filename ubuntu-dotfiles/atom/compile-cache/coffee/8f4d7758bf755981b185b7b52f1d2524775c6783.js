(function() {
  var OutputViewManager, Path, fs, git, notifier;

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  fs = require('fs-plus');

  module.exports = function(repo, _arg) {
    var file, isFolder, packageObj, sublimeTabs, treeView, _ref;
    file = (_arg != null ? _arg : {}).file;
    if (atom.packages.isPackageLoaded('tree-view')) {
      treeView = atom.packages.getLoadedPackage('tree-view');
      treeView = require(treeView.mainModulePath);
      packageObj = treeView.serialize();
    } else if (atom.packages.isPackageLoaded('sublime-tabs')) {
      sublimeTabs = atom.packages.getLoadedPackage('sublime-tabs');
      sublimeTabs = require(sublimeTabs.mainModulePath);
      packageObj = sublimeTabs.serialize();
    } else {
      console.warn("Git-plus: no tree-view or sublime-tabs package loaded");
    }
    isFolder = false;
    if (!file) {
      if (packageObj != null ? packageObj.selectedPath : void 0) {
        isFolder = fs.isDirectorySync(packageObj.selectedPath);
        if (file == null) {
          file = repo.relativize(packageObj.selectedPath);
        }
      }
    } else {
      isFolder = fs.isDirectorySync(file);
    }
    if (file == null) {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    }
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    return git.getConfig('diff.tool', repo.getWorkingDirectory()).then(function(tool) {
      if (!tool) {
        return notifier.addInfo("You don't have a difftool configured.");
      } else {
        return git.cmd(['diff-index', 'HEAD', '-z'], {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
          diffIndex = data.split('\0');
          includeStagedDiff = atom.config.get('git-plus.includeStagedDiff');
          if (isFolder) {
            args = ['difftool', '-d', '--no-prompt'];
            if (includeStagedDiff) {
              args.push('HEAD');
            }
            args.push(file);
            git.cmd(args, {
              cwd: repo.getWorkingDirectory()
            })["catch"](function(msg) {
              return OutputViewManager.create().addLine(msg).finish();
            });
            return;
          }
          diffsForCurrentFile = diffIndex.map(function(line, i) {
            var path, staged;
            if (i % 2 === 0) {
              staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
              path = diffIndex[i + 1];
              if (path === file && (!staged || includeStagedDiff)) {
                return true;
              }
            } else {
              return void 0;
            }
          });
          if (diffsForCurrentFile.filter(function(diff) {
            return diff != null;
          })[0] != null) {
            args = ['difftool', '--no-prompt'];
            if (includeStagedDiff) {
              args.push('HEAD');
            }
            args.push(file);
            return git.cmd(args, {
              cwd: repo.getWorkingDirectory()
            })["catch"](function(msg) {
              return OutputViewManager.create().addLine(msg).finish();
            });
          } else {
            return notifier.addInfo('Nothing to show.');
          }
        });
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZGlmZnRvb2wuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBSHBCLENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FKTCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBRWYsUUFBQSx1REFBQTtBQUFBLElBRnVCLHVCQUFELE9BQU8sSUFBTixJQUV2QixDQUFBO0FBQUEsSUFBQSxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixXQUE5QixDQUFIO0FBQ0UsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixXQUEvQixDQUFYLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsUUFBUSxDQUFDLGNBQWpCLENBRFgsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxTQUFULENBQUEsQ0FGYixDQURGO0tBQUEsTUFJSyxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixjQUE5QixDQUFIO0FBQ0gsTUFBQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixjQUEvQixDQUFkLENBQUE7QUFB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

//# sourceURL=/home/nikke/.atom/packages/git-plus/lib/models/git-difftool.coffee
