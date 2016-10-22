(function() {
  var BufferedProcess, JediProvider, command, jedipy_filename, resetJedi;

  BufferedProcess = require('atom').BufferedProcess;

  command = atom.config.get('python-jedi.Pathtopython');

  jedipy_filename = '/python3_jedi.py';

  resetJedi = function(newValue) {
    var error;
    try {
      atom.packages.disablePackage('python-jedi');
    } catch (_error) {
      error = _error;
      console.log(error);
    }
    atom.packages.enablePackage('python-jedi');
    return command = atom.config.get('python-jedi.Pathtopython');
  };

  module.exports = JediProvider = (function() {
    var opts;

    JediProvider.prototype.id = 'python-jedi';

    JediProvider.prototype.selector = '.source.python';

    JediProvider.prototype.providerblacklist = null;

    opts = {
      stdio: ['pipe', null, null]
    };

    function JediProvider() {
      this.providerblacklist = {
        'autocomplete-plus-fuzzyprovider': '.source.python',
        'autocomplete-plus-symbolprovider': '.source.python'
      };
    }

    JediProvider.prototype.goto_def = function(source, row, column, path) {
      var args, callback, data, exit, goto_def_process, payload, stderr, stdout;
      payload = {
        source: source,
        line: row,
        column: column,
        path: path,
        type: "goto"
      };
      data = JSON.stringify(payload);
      args = [__dirname + jedipy_filename];
      stdout = function(data) {
        var goto_info_objects, key, value, _results;
        goto_info_objects = JSON.parse(data);
        _results = [];
        for (key in goto_info_objects) {
          value = goto_info_objects[key];
          if (value['module_path'] !== null && value['line'] !== null) {
            _results.push(atom.workspace.open(value['module_path'], {
              'initialLine': value['line'] - 1,
              'searchAllPanes': true
            }));
          } else if (value['is_built_in'] && (value['type'] = "module" || "class" || "function")) {
            _results.push(atom.notifications.addInfo("Built In " + value['type'], {
              dismissable: true,
              'detail': "Description: " + value['description'] + ".\nThis is a builtin " + value['type'] + ". Doesn't have module path"
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      stderr = function(error) {
        return console.log(error);
      };
      exit = function(code) {
        return goto_def_process.kill();
      };
      callback = function(errorObject) {
        return console.log(errorObject.error);
      };
      goto_def_process = new BufferedProcess({
        command: command,
        args: args,
        opts: opts,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      goto_def_process.process.stdin.write(data);
      goto_def_process.process.stdin.end();
      return goto_def_process.onWillThrowError(callback);
    };

    JediProvider.prototype.requestHandler = function(options) {
      return new Promise(function(resolve) {
        var args, bufferPosition, callback, column, completion_process, data, exit, hash, line, path, payload, prefix, prefixRegex, prefixRegex_others, prefixcheck, row, stderr, stdout, suggestions, text;
        suggestions = [];
        if (atom.packages.isPackageDisabled('python-jedi')) {
          resolve(suggestions);
        }
        bufferPosition = options.cursor.getBufferPosition();
        text = options.editor.getText();
        row = options.cursor.getBufferPosition().row;
        column = options.cursor.getBufferPosition().column;
        path = options.editor.getPath();
        if (column === 0) {
          resolve(suggestions);
        }
        payload = {
          source: text,
          line: row,
          column: column,
          path: path,
          type: 'autocomplete'
        };
        prefixRegex_others = /[\s()\[\]{}=\-@!$%\^&\?'"\/|\\`~;:<>,*+]/g;
        prefixRegex = /\b((\w+))$/g;
        if (options.prefix.match(prefixRegex)) {
          prefix = options.prefix.match(prefixRegex)[0];
        }
        line = options.editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
        hash = line.search(/(\#)/g);
        prefixcheck = !prefixRegex_others.test(options.cursor.getCurrentWordPrefix());
        if (hash < 0 && prefixcheck) {
          data = JSON.stringify(payload);
          args = [__dirname + jedipy_filename];
          stdout = function(data) {
            var key, label, list_of_objects, name, type, value;
            list_of_objects = JSON.parse(data);
            if (list_of_objects.length !== 0) {
              for (key in list_of_objects) {
                value = list_of_objects[key];
                label = value.description;
                type = value.type;
                name = value.name;
                if (label.length > 80) {
                  label = label.substr(0, 80);
                }
                suggestions.push({
                  text: name,
                  replacementPrefix: prefix,
                  label: label,
                  type: type
                });
              }
              return resolve(suggestions);
            } else {
              return resolve(suggestions);
            }
          };
          stderr = function(error) {
            return console.log(error);
          };
          exit = function(code) {
            return completion_process.kill();
          };
          callback = function(errorObject) {
            return console.log(errorObject.error);
          };
          completion_process = new BufferedProcess({
            command: command,
            args: args,
            opts: opts,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
          completion_process.process.stdin.write(data);
          completion_process.process.stdin.end();
          return completion_process.onWillThrowError(callback);
        } else {
          return resolve(suggestions);
        }
      });
    };

    JediProvider.prototype.error = function(data) {
      return console.log(data);
    };

    return JediProvider;

  })();

  atom.config.observe('python-jedi.Pathtopython', function(newValue) {
    atom.config.set('python-jedi.Pathtopython', newValue);
    return resetJedi(newValue);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvcHl0aG9uLWplZGkvbGliL2plZGktcHl0aG9uMy1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0VBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FEVixDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixrQkFGbEIsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBVyxTQUFDLFFBQUQsR0FBQTtBQUNULFFBQUEsS0FBQTtBQUFBO0FBQ0UsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWQsQ0FBNkIsYUFBN0IsQ0FBQSxDQURGO0tBQUEsY0FBQTtBQUdFLE1BREksY0FDSixDQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosQ0FBQSxDQUhGO0tBQUE7QUFBQSxJQUtBLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBZCxDQUE0QixhQUE1QixDQUxBLENBQUE7V0FNQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQVBEO0VBQUEsQ0FKWCxDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLFFBQUEsSUFBQTs7QUFBQSwyQkFBQSxFQUFBLEdBQUksYUFBSixDQUFBOztBQUFBLDJCQUNBLFFBQUEsR0FBVSxnQkFEVixDQUFBOztBQUFBLDJCQUVBLGlCQUFBLEdBQW1CLElBRm5CLENBQUE7O0FBQUEsSUFHQSxJQUFBLEdBQU87QUFBQSxNQUFDLEtBQUEsRUFBTyxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsSUFBZixDQUFSO0tB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

//# sourceURL=/home/nikke/.atom/packages/python-jedi/lib/jedi-python3-provider.coffee
