(function() {
  var Entry, History, settings, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  Entry = require('./entry');

  settings = require('./settings');

  History = (function() {
    function History() {
      this.init();
    }

    History.prototype.init = function() {
      this.index = 0;
      return this.entries = [];
    };

    History.prototype.clear = function() {
      var e, _i, _len, _ref;
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e.destroy();
      }
      return this.init();
    };

    History.prototype.destroy = function() {
      var e, _i, _len, _ref, _ref1;
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e.destroy();
      }
      return _ref1 = {}, this.index = _ref1.index, this.entries = _ref1.entries, _ref1;
    };

    History.prototype.findIndex = function(direction, fn) {
      var entry, index, indexes, start, _i, _len, _ref;
      _ref = (function() {
        var _i, _j, _ref, _results, _results1;
        switch (direction) {
          case 'next':
            return [
              start = this.index + 1, (function() {
                _results = [];
                for (var _i = start, _ref = this.entries.length - 1; start <= _ref ? _i <= _ref : _i >= _ref; start <= _ref ? _i++ : _i--){ _results.push(_i); }
                return _results;
              }).apply(this)
            ];
          case 'prev':
            return [
              start = this.index - 1, (function() {
                _results1 = [];
                for (var _j = start; start <= 0 ? _j <= 0 : _j >= 0; start <= 0 ? _j++ : _j--){ _results1.push(_j); }
                return _results1;
              }).apply(this)
            ];
        }
      }).call(this), start = _ref[0], indexes = _ref[1];
      if (!((0 <= start && start <= (this.entries.length - 1)))) {
        return null;
      }
      for (_i = 0, _len = indexes.length; _i < _len; _i++) {
        index = indexes[_i];
        if ((entry = this.entries[index]).isValid()) {
          if (fn(entry)) {
            return index;
          }
        }
      }
      return null;
    };

    History.prototype.get = function(direction, fn) {
      var index;
      if ((index = this.findIndex(direction, fn)) != null) {
        return this.entries[this.index = index];
      }
    };

    History.prototype.isAtHead = function() {
      return this.index === this.entries.length;
    };

    History.prototype.setToHead = function() {
      return this.index = this.entries.length;
    };

    History.prototype.add = function(_arg) {
      var URI, e, editor, newEntry, point, _i, _j, _len, _len1, _ref, _ref1;
      editor = _arg.editor, point = _arg.point, URI = _arg.URI;
      newEntry = new Entry(editor, point, URI);
      if (settings.get('keepSingleEntryPerBuffer')) {
        _ref = this.entries;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          if (e.URI === URI) {
            e.destroy();
          }
        }
      } else {
        _ref1 = this.entries;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          e = _ref1[_j];
          if (e.isAtSameRow(newEntry)) {
            e.destroy();
          }
        }
      }
      return this.entries.push(newEntry);
    };

    History.prototype.uniqueByBuffer = function() {
      var URI, buffers, entry, _i, _len, _ref;
      if (!this.entries.length) {
        return;
      }
      buffers = [];
      _ref = this.entries.slice().reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        URI = entry.URI;
        if (__indexOf.call(buffers, URI) >= 0) {
          entry.destroy();
        } else {
          buffers.push(URI);
        }
      }
      return this.removeEntries();
    };

    History.prototype.removeEntries = function() {
      var e, removeCount, removed, _i, _j, _len, _len1, _ref;
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (!e.isValid()) {
          e.destroy();
        }
      }
      this.entries = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.entries;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          e = _ref1[_j];
          if (e.isValid()) {
            _results.push(e);
          }
        }
        return _results;
      }).call(this);
      removeCount = this.entries.length - settings.get('max');
      if (removeCount > 0) {
        removed = this.entries.splice(0, removeCount);
        for (_j = 0, _len1 = removed.length; _j < _len1; _j++) {
          e = removed[_j];
          e.destroy();
        }
      }
      return this.setToHead();
    };

    History.prototype.inspect = function(msg) {
      var ary, e, i, s;
      ary = (function() {
        var _i, _len, _ref, _results;
        _ref = this.entries;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          e = _ref[i];
          s = i === this.index ? "> " : "  ";
          _results.push("" + s + i + ": " + (e.inspect()));
        }
        return _results;
      }).call(this);
      if (this.index === this.entries.length) {
        ary.push("> " + this.index + ":");
      }
      return ary.join("\n");
    };

    return History;

  })();

  module.exports = History;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvY3Vyc29yLWhpc3RvcnkvbGliL2hpc3RvcnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQURSLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSU07QUFDUyxJQUFBLGlCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSxzQkFHQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQVQsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FGUDtJQUFBLENBSE4sQ0FBQTs7QUFBQSxzQkFPQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxpQkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUFBLFFBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBQSxDQUFBLENBQUE7QUFBQSxPQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUZLO0lBQUEsQ0FQUCxDQUFBOztBQUFBLHNCQVdBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLHdCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQUEsUUFBQSxDQUFDLENBQUMsT0FBRixDQUFBLENBQUEsQ0FBQTtBQUFBLE9BQUE7YUFDQSxRQUFxQixFQUFyQixFQUFDLElBQUMsQ0FBQSxjQUFBLEtBQUYsRUFBUyxJQUFDLENBQUEsZ0JBQUEsT0FBVixFQUFBLE1BRk87SUFBQSxDQVhULENBQUE7O0FBQUEsc0JBZUEsU0FBQSxHQUFXLFNBQUMsU0FBRCxFQUFZLEVBQVosR0FBQTtBQUNULFVBQUEsNENBQUE7QUFBQSxNQUFBOztBQUFtQixnQkFBTyxTQUFQO0FBQUEsZUFDWixNQURZO21CQUNBO2NBQUMsS0FBQSxHQUFPLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBakIsRUFBcUI7Ozs7NEJBQXJCO2NBREE7QUFBQSxlQUVaLE1BRlk7bUJBRUE7Y0FBQyxLQUFBLEdBQU8sSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFqQixFQUFxQjs7Ozs0QkFBckI7Y0FGQTtBQUFBO21CQUFuQixFQUFDLGVBQUQsRUFBUSxpQkFBUixDQUFBO0FBS0EsTUFBQSxJQUFBLENBQUEsQ0FBb0IsQ0FBQSxDQUFBLElBQUssS0FBTCxJQUFLLEtBQUwsSUFBYyxDQUFDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxHQUFrQixDQUFuQixDQUFkLENBQUQsQ0FBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUxBO0FBT0EsV0FBQSw4Q0FBQTs0QkFBQTtZQUEwQixDQUFDLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBbEIsQ0FBeUIsQ0FBQyxPQUExQixDQUFBO0FBQ3hCLFVBQUEsSUFBZ0IsRUFBQSxDQUFHLEtBQUgsQ0FBaEI7QUFBQSxtQkFBTyxLQUFQLENBQUE7O1NBREY7QUFBQSxPQVBBO2FBU0EsS0FWUztJQUFBLENBZlgsQ0FBQTs7QUFBQSxzQkEyQkEsR0FBQSxHQUFLLFNBQUMsU0FBRCxFQUFZLEVBQVosR0FBQTtBQUNILFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBRywrQ0FBSDtlQUNFLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLEtBQUQsR0FBTyxLQUFQLEVBRFg7T0FERztJQUFBLENBM0JMLENBQUE7O0FBQUEsc0JBK0JBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsS0FBRCxLQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FEWDtJQUFBLENBL0JWLENBQUE7O0FBQUEsc0JBa0NBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FEVDtJQUFBLENBbENYLENBQUE7O0FBQUEsc0JBeUZBLEdBQUEsR0FBSyxTQUFDLElBQUQsR0FBQTtBQUNILFVBQUEsaUVBQUE7QUFBQSxNQURLLGNBQUEsUUFBUSxhQUFBLE9BQU8sV0FBQSxHQUNwQixDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQWUsSUFBQSxLQUFBLENBQU0sTUFBTixFQUFjLEtBQWQsRUFBcUIsR0FBckIsQ0FBZixDQUFBO0FBRUEsTUFBQSxJQUFHLFFBQVEsQ0FBQyxHQUFULENBQWEsMEJBQWIsQ0FBSDtBQUNFO0FBQUEsYUFBQSwyQ0FBQTt1QkFBQTtjQUFtQyxDQUFDLENBQUMsR0FBRixLQUFTO0FBQTVDLFlBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBQSxDQUFBO1dBQUE7QUFBQSxTQURGO09BQUEsTUFBQTtBQUdFO0FBQUEsYUFBQSw4Q0FBQTt3QkFBQTtjQUFtQyxDQUFDLENBQUMsV0FBRixDQUFjLFFBQWQ7QUFBbkMsWUFBQSxDQUFDLENBQUMsT0FBRixDQUFBLENBQUE7V0FBQTtBQUFBLFNBSEY7T0FGQTthQU9BLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFFBQWQsRUFSRztJQUFBLENBekZMLENBQUE7O0FBQUEsc0JBbUdBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxtQ0FBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxPQUFPLENBQUMsTUFBdkI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLEVBRFYsQ0FBQTtBQUVBO0FBQUEsV0FBQSwyQ0FBQTt5QkFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxHQUFaLENBQUE7QUFDQSxRQUFBLElBQUcsZUFBTyxPQUFQLEVBQUEsR0FBQSxNQUFIO0FBQ0UsVUFBQSxLQUFLLENBQUMsT0FBTixDQUFBLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYixDQUFBLENBSEY7U0FGRjtBQUFBLE9BRkE7YUFRQSxJQUFDLENBQUEsYUFBRCxDQUFBLEVBVGM7SUFBQSxDQW5HaEIsQ0FBQTs7QUFBQSxzQkE4R0EsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUViLFVBQUEsa0RBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7WUFBbUMsQ0FBQSxDQUFLLENBQUMsT0FBRixDQUFBO0FBQXZDLFVBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBQSxDQUFBO1NBQUE7QUFBQSxPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRDs7QUFBWTtBQUFBO2FBQUEsOENBQUE7d0JBQUE7Y0FBeUIsQ0FBQyxDQUFDLE9BQUYsQ0FBQTtBQUF6QiwwQkFBQSxFQUFBO1dBQUE7QUFBQTs7bUJBRFosQ0FBQTtBQUFBLE1BSUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxHQUFrQixRQUFRLENBQUMsR0FBVCxDQUFhLEtBQWIsQ0FKaEMsQ0FBQTtBQUtBLE1BQUEsSUFBRyxXQUFBLEdBQWMsQ0FBakI7QUFDRSxRQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsV0FBbkIsQ0FBVixDQUFBO0FBQ0EsYUFBQSxnREFBQTswQkFBQTtBQUFBLFVBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBQSxDQUFBLENBQUE7QUFBQSxTQUZGO09BTEE7YUFRQSxJQUFDLENBQUEsU0FBRCxDQUFBLEVBVmE7SUFBQSxDQTlHZixDQUFBOztBQUFBLHNCQTBIQSxPQUFBLEdBQVMsU0FBQyxHQUFELEdBQUE7QUFDUCxVQUFBLFlBQUE7QUFBQSxNQUFBLEdBQUE7O0FBQ0U7QUFBQTthQUFBLG1EQUFBO3NCQUFBO0FBQ0UsVUFBQSxDQUFBLEdBQVEsQ0FBQSxLQUFLLElBQUMsQ0FBQSxLQUFWLEdBQXNCLElBQXRCLEdBQWdDLElBQXBDLENBQUE7QUFBQSx3QkFDQSxFQUFBLEdBQUcsQ0FBSCxHQUFPLENBQVAsR0FBUyxJQUFULEdBQVksQ0FBQyxDQUFDLENBQUMsT0FBRixDQUFBLENBQUQsRUFEWixDQURGO0FBQUE7O21CQURGLENBQUE7QUFJQSxNQUFBLElBQTRCLElBQUMsQ0FBQSxLQUFELEtBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUEvQztBQUFBLFFBQUEsR0FBRyxDQUFDLElBQUosQ0FBVSxJQUFBLEdBQUksSUFBQyxDQUFBLEtBQUwsR0FBVyxHQUFyQixDQUFBLENBQUE7T0FKQTthQUtBLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBVCxFQU5PO0lBQUEsQ0ExSFQsQ0FBQTs7bUJBQUE7O01BTEYsQ0FBQTs7QUFBQSxFQXVJQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQXZJakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/cursor-history/lib/history.coffee
