(function() {
  var requirejs, ws, xhr;

  ws = require('ws');

  xhr = require('xmlhttprequest');

  requirejs = require('requirejs');

  global.requirejs = requirejs;

  global.XMLHttpRequest = xhr.XMLHttpRequest;

  global.WebSocket = ws;

  module.exports = require('jupyter-js-services');

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2p1cHl0ZXItanMtc2VydmljZXMtc2hpbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFTQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxnQkFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsU0FIbkIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxjQUFQLEdBQXdCLEdBQUcsQ0FBQyxjQUo1QixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsRUFMbkIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsQ0FBUSxxQkFBUixDQVBqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/jupyter-js-services-shim.coffee
