(function() {
  var __slice = [].slice;

  module.exports = {
    prefix: 'autocomplete-python:',
    debug: function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (atom.config.get('autocomplete-python.outputDebug')) {
        return console.debug.apply(console, [this.prefix].concat(__slice.call(msg)));
      }
    },
    warning: function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.warn.apply(console, [this.prefix].concat(__slice.call(msg)));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXB5dGhvbi9saWIvbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxzQkFBUjtBQUFBLElBQ0EsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNMLFVBQUEsR0FBQTtBQUFBLE1BRE0sNkRBQ04sQ0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBQUg7QUFDRSxlQUFPLE9BQU8sQ0FBQyxLQUFSLGdCQUFjLENBQUEsSUFBQyxDQUFBLE1BQVEsU0FBQSxhQUFBLEdBQUEsQ0FBQSxDQUF2QixDQUFQLENBREY7T0FESztJQUFBLENBRFA7QUFBQSxJQUtBLE9BQUEsRUFBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLEdBQUE7QUFBQSxNQURRLDZEQUNSLENBQUE7QUFBQSxhQUFPLE9BQU8sQ0FBQyxJQUFSLGdCQUFhLENBQUEsSUFBQyxDQUFBLE1BQVEsU0FBQSxhQUFBLEdBQUEsQ0FBQSxDQUF0QixDQUFQLENBRE87SUFBQSxDQUxUO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/autocomplete-python/lib/log.coffee
