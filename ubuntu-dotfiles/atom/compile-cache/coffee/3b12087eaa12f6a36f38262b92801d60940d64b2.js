(function() {
  var getRootDirectoryStatus, normalizePath, path, settle;

  path = require('path');

  normalizePath = function(repoPath) {
    var normPath;
    normPath = path.normalize(repoPath);
    if (process.platform === 'darwin') {
      normPath = normPath.replace(/^\/private/, '');
    }
    return normPath.replace(/[\\\/]$/, '');
  };

  getRootDirectoryStatus = function(repo) {
    var promise;
    promise = Promise.resolve();
    if ((repo._getStatus != null) || (repo.repo._getStatus != null)) {
      if (repo._getStatus != null) {
        promise = promise.then(function() {
          return repo._getStatus(['**']);
        });
      } else {
        promise = promise.then(function() {
          return repo.repo._getStatus(['**']);
        });
      }
      return promise.then(function(statuses) {
        return Promise.all(statuses.map(function(s) {
          return s.statusBit();
        })).then(function(bits) {
          var reduceFct;
          reduceFct = function(status, bit) {
            return status | bit;
          };
          return bits.filter(function(b) {
            return b > 0;
          }).reduce(reduceFct, 0);
        });
      });
    }
    return repo.getRootDirectoryStatus();
  };

  settle = function(promises) {
    var promiseWrapper;
    promiseWrapper = function(promise) {
      return promise.then(function(result) {
        return {
          resolved: result
        };
      })["catch"](function(err) {
        console.error(err);
        return {
          rejected: err
        };
      });
    };
    return Promise.all(promises.map(promiseWrapper)).then(function(results) {
      var rejectedPromises, strippedResults;
      rejectedPromises = results.filter(function(p) {
        return p.hasOwnProperty('rejected');
      });
      strippedResults = results.map(function(r) {
        return r.resolved || r.rejected;
      });
      if (rejectedPromises.length === 0) {
        return strippedResults;
      } else {
        return Promise.reject(strippedResults);
      }
    });
  };

  module.exports = {
    normalizePath: normalizePath,
    getRootDirectoryStatus: getRootDirectoryStatus,
    settle: settle
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvdHJlZS12aWV3LWdpdC1zdGF0dXMvbGliL3V0aWxzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLFNBQUMsUUFBRCxHQUFBO0FBQ2QsUUFBQSxRQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFNBQUwsQ0FBZSxRQUFmLENBQVgsQ0FBQTtBQUNBLElBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixRQUF2QjtBQVFFLE1BQUEsUUFBQSxHQUFXLFFBQVEsQ0FBQyxPQUFULENBQWlCLFlBQWpCLEVBQStCLEVBQS9CLENBQVgsQ0FSRjtLQURBO0FBVUEsV0FBTyxRQUFRLENBQUMsT0FBVCxDQUFpQixTQUFqQixFQUE0QixFQUE1QixDQUFQLENBWGM7RUFBQSxDQUZoQixDQUFBOztBQUFBLEVBZUEsc0JBQUEsR0FBeUIsU0FBQyxJQUFELEdBQUE7QUFDdkIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFWLENBQUE7QUFDQSxJQUFBLElBQUcseUJBQUEsSUFBb0IsOEJBQXZCO0FBR0UsTUFBQSxJQUFHLHVCQUFIO0FBQ0UsUUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFBLEdBQUE7QUFDckIsaUJBQU8sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsQ0FBQyxJQUFELENBQWhCLENBQVAsQ0FEcUI7UUFBQSxDQUFiLENBQVYsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLE9BQUEsR0FBVSxPQUFPLENBQUMsSUFBUixDQUFhLFNBQUEsR0FBQTtBQUNyQixpQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVYsQ0FBcUIsQ0FBQyxJQUFELENBQXJCLENBQVAsQ0FEcUI7UUFBQSxDQUFiLENBQVYsQ0FKRjtPQUFBO0FBTUEsYUFBTyxPQUNMLENBQUMsSUFESSxDQUNDLFNBQUMsUUFBRCxHQUFBO0FBQ0osZUFBTyxPQUFPLENBQUMsR0FBUixDQUNMLFFBQVEsQ0FBQyxHQUFULENBQWEsU0FBQyxDQUFELEdBQUE7aUJBQU8sQ0FBQyxDQUFDLFNBQUYsQ0FBQSxFQUFQO1FBQUEsQ0FBYixDQURLLENBRU4sQ0FBQyxJQUZLLENBRUEsU0FBQyxJQUFELEdBQUE7QUFDTCxjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxHQUFULEdBQUE7QUFDVixtQkFBTyxNQUFBLEdBQVMsR0FBaEIsQ0FEVTtVQUFBLENBQVosQ0FBQTtBQUVBLGlCQUFPLElBQ0wsQ0FBQyxNQURJLENBQ0csU0FBQyxDQUFELEdBQUE7bUJBQU8sQ0FBQSxHQUFJLEVBQVg7VUFBQSxDQURILENBRUwsQ0FBQyxNQUZJLENBRUcsU0FGSCxFQUVjLENBRmQsQ0FBUCxDQUhLO1FBQUEsQ0FGQSxDQUFQLENBREk7TUFBQSxDQURELENBQVAsQ0FURjtLQURBO0FBcUJBLFdBQU8sSUFBSSxDQUFDLHNCQUFMLENBQUEsQ0FBUCxDQXRCdUI7RUFBQSxDQWZ6QixDQUFBOztBQUFBLEVBeUNBLE1BQUEsR0FBUyxTQUFDLFFBQUQsR0FBQTtBQUNQLFFBQUEsY0FBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixTQUFDLE9BQUQsR0FBQTtBQUNmLGFBQU8sT0FDTCxDQUFDLElBREksQ0FDQyxTQUFDLE1BQUQsR0FBQTtBQUNKLGVBQU87QUFBQSxVQUFFLFFBQUEsRUFBVSxNQUFaO1NBQVAsQ0FESTtNQUFBLENBREQsQ0FJTCxDQUFDLE9BQUQsQ0FKSyxDQUlFLFNBQUMsR0FBRCxHQUFBO0FBQ0wsUUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQsQ0FBQSxDQUFBO0FBQ0EsZUFBTztBQUFBLFVBQUUsUUFBQSxFQUFVLEdBQVo7U0FBUCxDQUZLO01BQUEsQ0FKRixDQUFQLENBRGU7SUFBQSxDQUFqQixDQUFBO0FBU0EsV0FBTyxPQUFPLENBQUMsR0FBUixDQUFZLFFBQVEsQ0FBQyxHQUFULENBQWEsY0FBYixDQUFaLENBQ0wsQ0FBQyxJQURJLENBQ0MsU0FBQyxPQUFELEdBQUE7QUFDSixVQUFBLGlDQUFBO0FBQUEsTUFBQSxnQkFBQSxHQUFtQixPQUFPLENBQUMsTUFBUixDQUFlLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLGNBQUYsQ0FBaUIsVUFBakIsRUFBUDtNQUFBLENBQWYsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsZUFBQSxHQUFrQixPQUFPLENBQUMsR0FBUixDQUFZLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLFFBQUYsSUFBYyxDQUFDLENBQUMsU0FBdkI7TUFBQSxDQUFaLENBRGxCLENBQUE7QUFFQSxNQUFBLElBQUcsZ0JBQWdCLENBQUMsTUFBakIsS0FBMkIsQ0FBOUI7QUFDRSxlQUFPLGVBQVAsQ0FERjtPQUFBLE1BQUE7QUFHRSxlQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsZUFBZixDQUFQLENBSEY7T0FISTtJQUFBLENBREQsQ0FBUCxDQVZPO0VBQUEsQ0F6Q1QsQ0FBQTs7QUFBQSxFQTREQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQ2YsYUFBQSxFQUFlLGFBREE7QUFBQSxJQUVmLHNCQUFBLEVBQXdCLHNCQUZUO0FBQUEsSUFHZixNQUFBLEVBQVEsTUFITztHQTVEakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/tree-view-git-status/lib/utils.coffee
