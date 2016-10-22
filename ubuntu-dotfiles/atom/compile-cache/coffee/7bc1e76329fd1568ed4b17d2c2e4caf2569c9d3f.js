(function() {
  var Config, _;

  _ = require('lodash');

  module.exports = Config = {
    getJson: function(key, _default) {
      var error, message, value;
      if (_default == null) {
        _default = {};
      }
      if (!(value = atom.config.get("Hydrogen." + key))) {
        return _default;
      }
      try {
        return JSON.parse(value);
      } catch (_error) {
        error = _error;
        message = "Your Hydrogen config is broken: " + key;
        atom.notifications.addError(message, {
          description: error
        });
      }
      return _default;
    },
    schema: {
      autocomplete: {
        title: 'Enable Autocomplete',
        type: 'boolean',
        "default": true
      },
      kernelNotifications: {
        title: 'Enable Kernel Notifications',
        description: 'By default, kernel notifications are only displayed in the developer console. This setting defines a RegExp to filter what kernel notifications will also be shown as Atom notification bubbles. Example: `error|warning`',
        type: 'string',
        "default": '(?!)'
      },
      gateways: {
        title: 'List of kernel gateways to use',
        description: 'Hydrogen can connect to remote notebook servers and kernel gateways. Each gateway needs at minimum a name and a value for options.baseUrl. The options are passed directly to the `jupyter-js-services` npm package, which includes documentation for additional fields. Example value: ``` [{ "name": "Remote notebook", "options": { "baseUrl": "http://mysite.com:8888" } }] ```',
        type: 'string',
        "default": '[]'
      },
      kernelspec: {
        title: 'Kernel Specs',
        description: 'This field is populated on every launch or by invoking the command `hydrogen:update-kernels`. It contains the JSON string resulting from running `jupyter kernelspec list --json` or `ipython kernelspec list --json`. You can also edit this field and specify custom kernel specs , like this: ``` { "kernelspecs": { "ijavascript": { "spec": { "display_name": "IJavascript", "env": {}, "argv": [ "node", "/home/user/node_modules/ijavascript/lib/kernel.js", "--protocol=5.0", "{connection_file}" ], "language": "javascript" }, "resources_dir": "/home/user/node_modules/ijavascript/images" } } } ```',
        type: 'string',
        "default": '{}'
      },
      languageMappings: {
        title: 'Language Mappings',
        description: 'Some kernels may use a non-standard language name (e.g. jupyter-scala sets the language name to `scala211`). That leaves Hydrogen unable to figure out what kernel for your code. This field should be a valid JSON mapping from a kernel language name to Atom\'s lower-cased grammar name, e.g. ``` { "scala211": "scala", "Elixir": "elixir" } ```',
        type: 'string',
        "default": '{}'
      },
      startupCode: {
        title: 'Startup Code',
        description: 'This code will be executed on kernel startup. Format: `{"kernel": "your code \\nmore code"}`. Example: `{"Python 2": "%matplotlib inline"}`',
        type: 'string',
        "default": '{}'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFBLEdBQ2I7QUFBQSxJQUFBLE9BQUEsRUFBUyxTQUFDLEdBQUQsRUFBTSxRQUFOLEdBQUE7QUFDTCxVQUFBLHFCQUFBOztRQURXLFdBQVc7T0FDdEI7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUF1QixLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLFdBQUEsR0FBVyxHQUE1QixDQUFSLENBQXZCO0FBQUEsZUFBTyxRQUFQLENBQUE7T0FBQTtBQUNBO0FBQ0ksZUFBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsQ0FBUCxDQURKO09BQUEsY0FBQTtBQUdJLFFBREUsY0FDRixDQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVcsa0NBQUEsR0FBa0MsR0FBN0MsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixPQUE1QixFQUFxQztBQUFBLFVBQUEsV0FBQSxFQUFhLEtBQWI7U0FBckMsQ0FEQSxDQUhKO09BREE7QUFNQSxhQUFPLFFBQVAsQ0FQSztJQUFBLENBQVQ7QUFBQSxJQVNBLE1BQUEsRUFDSTtBQUFBLE1BQUEsWUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8scUJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQURKO0FBQUEsTUFJQSxtQkFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sNkJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyTkFEYjtBQUFBLFFBS0EsSUFBQSxFQUFNLFFBTE47QUFBQSxRQU1BLFNBQUEsRUFBUyxNQU5UO09BTEo7QUFBQSxNQVlBLFFBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLGdDQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEscVhBRGI7QUFBQSxRQWdCQSxJQUFBLEVBQU0sUUFoQk47QUFBQSxRQWlCQSxTQUFBLEVBQVMsSUFqQlQ7T0FiSjtBQUFBLE1BK0JBLFVBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxrbEJBRGI7QUFBQSxRQTBCQSxJQUFBLEVBQU0sUUExQk47QUFBQSxRQTJCQSxTQUFBLEVBQVMsSUEzQlQ7T0FoQ0o7QUFBQSxNQTREQSxnQkFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx1VkFEYjtBQUFBLFFBWUEsSUFBQSxFQUFNLFFBWk47QUFBQSxRQWFBLFNBQUEsRUFBUyxJQWJUO09BN0RKO0FBQUEsTUEyRUEsV0FBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sY0FBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDZJQURiO0FBQUEsUUFJQSxJQUFBLEVBQU0sUUFKTjtBQUFBLFFBS0EsU0FBQSxFQUFTLElBTFQ7T0E1RUo7S0FWSjtHQUhKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/config.coffee
