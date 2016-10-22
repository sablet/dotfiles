(function() {
  var Settings,
    __slice = [].slice;

  Settings = (function() {
    Settings.prototype.cache = {};

    function Settings(scope, config) {
      this.scope = scope;
      this.config = config;
    }

    Settings.prototype.notifyAndDelete = function() {
      var content, param, params, paramsToDelete, _i, _len;
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      paramsToDelete = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          if (this.has(param)) {
            _results.push(param);
          }
        }
        return _results;
      }).call(this);
      if (paramsToDelete.length === 0) {
        return;
      }
      content = ["" + this.scope + ": Config options deprecated.  ", "Automatically removed from your `connfig.cson`  "];
      for (_i = 0, _len = paramsToDelete.length; _i < _len; _i++) {
        param = paramsToDelete[_i];
        this["delete"](param);
        content.push("- `" + param + "`");
      }
      return atom.notifications.addWarning(content.join("\n"), {
        dismissable: true
      });
    };

    Settings.prototype.notifyAndRename = function(oldName, newName) {
      var content;
      if (!this.has(oldName)) {
        return;
      }
      this.set(newName, this.get(oldName));
      this["delete"](oldName);
      content = ["" + this.scope + ": Config options renamed.  ", "Automatically renamed in your `connfig.cson`  ", " - `" + oldName + "` to " + newName];
      return atom.notifications.addWarning(content.join("\n"), {
        dismissable: true
      });
    };

    Settings.prototype.has = function(param) {
      return param in atom.config.get(this.scope);
    };

    Settings.prototype["delete"] = function(param) {
      return this.set(param, void 0);
    };

    Settings.prototype.setCachableParams = function(params) {
      return this.cachableParams = params;
    };

    Settings.prototype.get = function(param) {
      return atom.config.get("" + this.scope + "." + param);
    };

    Settings.prototype.set = function(param, value) {
      return atom.config.set("" + this.scope + "." + param, value);
    };

    Settings.prototype.toggle = function(param) {
      return this.set(param, !this.get(param));
    };

    Settings.prototype.observe = function(param, fn) {
      return atom.config.observe("" + this.scope + "." + param, fn);
    };

    return Settings;

  })();

  module.exports = new Settings('cursor-history', {
    max: {
      order: 11,
      type: 'integer',
      "default": 100,
      minimum: 1,
      description: "number of history to remember"
    },
    rowDeltaToRemember: {
      order: 12,
      type: 'integer',
      "default": 4,
      minimum: 0,
      description: "Save history when row delta was greater than this value"
    },
    columnDeltaToRemember: {
      order: 13,
      type: 'integer',
      "default": 9999,
      minimum: 0,
      description: "Save history when cursor moved in same row and column delta was greater than this value"
    },
    excludeClosedBuffer: {
      order: 14,
      type: 'boolean',
      "default": false,
      description: "Don't open closed Buffer on history excursion"
    },
    keepSingleEntryPerBuffer: {
      order: 15,
      type: 'boolean',
      "default": false,
      description: 'Keep latest entry only per buffer'
    },
    searchAllPanes: {
      order: 31,
      type: 'boolean',
      "default": true,
      description: "Land to another pane or stick to same pane"
    },
    flashOnLand: {
      order: 32,
      type: 'boolean',
      "default": false,
      description: "flash cursor line on land"
    },
    flashDurationMilliSeconds: {
      order: 33,
      type: 'integer',
      "default": 150,
      description: "Duration for flash"
    },
    flashColor: {
      order: 34,
      type: 'string',
      "default": 'info',
      "enum": ['info', 'success', 'warning', 'error', 'highlight', 'selected'],
      description: 'flash color style, correspoinding to @background-color-{flashColor}: see `styleguide:show`'
    },
    flashType: {
      order: 35,
      type: 'string',
      "default": 'line',
      "enum": ['line', 'word', 'point'],
      description: 'Range to be flashed'
    },
    ignoreCommands: {
      order: 36,
      type: 'array',
      items: {
        type: 'string'
      },
      "default": ['command-palette:toggle'],
      description: 'list of commands to exclude from history tracking.'
    },
    debug: {
      order: 99,
      type: 'boolean',
      "default": false,
      description: "Output history on console.log"
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvY3Vyc29yLWhpc3RvcnkvbGliL3NldHRpbmdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBTTtBQUNKLHVCQUFBLEtBQUEsR0FBTyxFQUFQLENBQUE7O0FBRWEsSUFBQSxrQkFBRSxLQUFGLEVBQVUsTUFBVixHQUFBO0FBQW1CLE1BQWxCLElBQUMsQ0FBQSxRQUFBLEtBQWlCLENBQUE7QUFBQSxNQUFWLElBQUMsQ0FBQSxTQUFBLE1BQVMsQ0FBbkI7SUFBQSxDQUZiOztBQUFBLHVCQUlBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxnREFBQTtBQUFBLE1BRGdCLGdFQUNoQixDQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFrQjthQUFBLDZDQUFBOzZCQUFBO2NBQStCLElBQUMsQ0FBQSxHQUFELENBQUssS0FBTDtBQUEvQiwwQkFBQSxNQUFBO1dBQUE7QUFBQTs7bUJBQWxCLENBQUE7QUFDQSxNQUFBLElBQVUsY0FBYyxDQUFDLE1BQWYsS0FBeUIsQ0FBbkM7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BR0EsT0FBQSxHQUFVLENBQ1IsRUFBQSxHQUFHLElBQUMsQ0FBQSxLQUFKLEdBQVUsZ0NBREYsRUFFUixrREFGUSxDQUhWLENBQUE7QUFPQSxXQUFBLHFEQUFBO21DQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBQSxDQUFELENBQVEsS0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQU8sQ0FBQyxJQUFSLENBQWMsS0FBQSxHQUFLLEtBQUwsR0FBVyxHQUF6QixDQURBLENBREY7QUFBQSxPQVBBO2FBVUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QixPQUFPLENBQUMsSUFBUixDQUFhLElBQWIs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

//# sourceURL=/home/nikke/.atom/packages/cursor-history/lib/settings.coffee
