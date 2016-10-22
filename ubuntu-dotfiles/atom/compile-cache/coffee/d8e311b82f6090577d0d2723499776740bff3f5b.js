(function() {
  var CompositeDisposable, Entry, fs, path, settings;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs');

  settings = require('./settings');

  path = null;

  Entry = (function() {
    function Entry(editor, point, URI) {
      this.point = point;
      this.URI = URI;
      this.destroyed = false;
      if (!editor.isAlive()) {
        return;
      }
      this.editor = editor;
      this.subscriptions = new CompositeDisposable;
      this.marker = this.editor.markBufferPosition(this.point);
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function(_arg) {
          var newHeadBufferPosition;
          newHeadBufferPosition = _arg.newHeadBufferPosition;
          return _this.point = newHeadBufferPosition;
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.unSubscribe();
        };
      })(this)));
    }

    Entry.prototype.unSubscribe = function() {
      var _ref;
      this.subscriptions.dispose();
      return _ref = {}, this.editor = _ref.editor, this.subscriptions = _ref.subscriptions, _ref;
    };

    Entry.prototype.destroy = function() {
      var _ref, _ref1;
      if (this.editor != null) {
        this.unSubscribe();
      }
      this.destroyed = true;
      if ((_ref = this.marker) != null) {
        _ref.destroy();
      }
      return _ref1 = {}, this.point = _ref1.point, this.URI = _ref1.URI, this.marker = _ref1.marker, _ref1;
    };

    Entry.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    Entry.prototype.setURI = function(URI) {
      this.URI = URI;
    };

    Entry.prototype.isValid = function() {
      var _ref;
      if (this.isDestroyed()) {
        return false;
      }
      if (settings.get('excludeClosedBuffer')) {
        return ((_ref = this.editor) != null ? _ref.isAlive() : void 0) && fs.existsSync(this.URI);
      } else {
        return fs.existsSync(this.URI);
      }
    };

    Entry.prototype.isAtSameRow = function(_arg) {
      var URI, point;
      URI = _arg.URI, point = _arg.point;
      if ((point != null) && (this.point != null)) {
        return (URI === this.URI) && (point.row === this.point.row);
      } else {
        return false;
      }
    };

    Entry.prototype.inspect = function() {
      var s;
      if (path == null) {
        path = require('path');
      }
      s = "" + this.point + ", " + (path.basename(this.URI));
      if (!this.isValid()) {
        s += ' [invalid]';
      }
      return s;
    };

    return Entry;

  })();

  module.exports = Entry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvY3Vyc29yLWhpc3RvcnkvbGliL2VudHJ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sSUFIUCxDQUFBOztBQUFBLEVBUU07QUFDUyxJQUFBLGVBQUMsTUFBRCxFQUFVLEtBQVYsRUFBa0IsR0FBbEIsR0FBQTtBQUNYLE1BRG9CLElBQUMsQ0FBQSxRQUFBLEtBQ3JCLENBQUE7QUFBQSxNQUQ0QixJQUFDLENBQUEsTUFBQSxHQUM3QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQWIsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLE1BQW9CLENBQUMsT0FBUCxDQUFBLENBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUhWLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFKakIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQTJCLElBQUMsQ0FBQSxLQUE1QixDQUxWLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ3JDLGNB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

//# sourceURL=/home/nikke/.atom/packages/cursor-history/lib/entry.coffee
