(function() {
  var $, CompositeDisposable, WatchSidebar, WatchView, WatchesPicker, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('atom-space-pen-views').$;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('lodash');

  WatchView = require('./watch-view');

  WatchesPicker = require('./watches-picker');

  module.exports = WatchSidebar = (function() {
    function WatchSidebar(kernel) {
      var addButton, commands, languageDisplay, removeButton, resizeHandle, toggleButton, toolbar, tooltips;
      this.kernel = kernel;
      this.resizeSidebar = __bind(this.resizeSidebar, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.element = document.createElement('div');
      this.element.classList.add('hydrogen', 'watch-sidebar');
      toolbar = document.createElement('div');
      toolbar.classList.add('toolbar', 'block');
      languageDisplay = document.createElement('div');
      languageDisplay.classList.add('language', 'icon', 'icon-eye');
      languageDisplay.innerText = this.kernel.kernelSpec.display_name;
      commands = document.createElement('div');
      commands.classList.add('btn-group');
      removeButton = document.createElement('button');
      removeButton.classList.add('btn', 'icon', 'icon-trashcan');
      removeButton.onclick = (function(_this) {
        return function() {
          return _this.removeWatch();
        };
      })(this);
      toggleButton = document.createElement('button');
      toggleButton.classList.add('btn', 'icon', 'icon-remove-close');
      toggleButton.onclick = function() {
        var editor, editorView;
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return atom.commands.dispatch(editorView, 'hydrogen:toggle-watches');
      };
      tooltips = new CompositeDisposable();
      tooltips.add(atom.tooltips.add(toggleButton, {
        title: 'Toggle Watch Sidebar'
      }));
      tooltips.add(atom.tooltips.add(removeButton, {
        title: 'Remove Watch'
      }));
      this.watchesContainer = document.createElement('div');
      _.forEach(this.watchViews, (function(_this) {
        return function(watch) {
          return _this.watchesContainer.appendChild(watch.element);
        };
      })(this));
      addButton = document.createElement('button');
      addButton.classList.add('add-watch', 'btn', 'btn-primary', 'icon', 'icon-plus', 'inline-block');
      addButton.innerText = 'Add watch';
      addButton.onclick = (function(_this) {
        return function() {
          return _this.addWatch();
        };
      })(this);
      resizeHandle = document.createElement('div');
      resizeHandle.classList.add('watch-resize-handle');
      $(resizeHandle).on('mousedown', this.resizeStarted);
      toolbar.appendChild(languageDisplay);
      toolbar.appendChild(commands);
      commands.appendChild(removeButton);
      commands.appendChild(toggleButton);
      this.element.appendChild(toolbar);
      this.element.appendChild(this.watchesContainer);
      this.element.appendChild(addButton);
      this.element.appendChild(resizeHandle);
      this.kernel.addWatchCallback((function(_this) {
        return function() {
          return _this.run();
        };
      })(this));
      this.watchViews = [];
      this.addWatch();
      this.hide();
      atom.workspace.addRightPanel({
        item: this.element
      });
    }

    WatchSidebar.prototype.createWatch = function() {
      var watch;
      watch = _.last(this.watchViews);
      if (!watch || watch.getCode().replace(/\s/g, '' !== '')) {
        watch = new WatchView(this.kernel);
        this.watchViews.push(watch);
        this.watchesContainer.appendChild(watch.element);
      }
      return watch;
    };

    WatchSidebar.prototype.addWatch = function() {
      return this.createWatch().inputElement.element.focus();
    };

    WatchSidebar.prototype.addWatchFromEditor = function() {
      var watchText;
      watchText = atom.workspace.getActiveTextEditor().getSelectedText();
      if (!watchText) {
        this.addWatch();
      } else {
        this.createWatch().setCode(watchText).run();
      }
      return this.show();
    };

    WatchSidebar.prototype.removeWatch = function() {
      var k, v, watches;
      watches = (function() {
        var _i, _len, _ref, _results;
        _ref = this.watchViews;
        _results = [];
        for (k = _i = 0, _len = _ref.length; _i < _len; k = ++_i) {
          v = _ref[k];
          _results.push({
            name: v.getCode(),
            value: k
          });
        }
        return _results;
      }).call(this);
      WatchesPicker.onConfirmed = (function(_this) {
        return function(item) {
          _this.watchViews[item.value].destroy();
          return _this.watchViews.splice(item.value, 1);
        };
      })(this);
      WatchesPicker.setItems(watches);
      return WatchesPicker.toggle();
    };

    WatchSidebar.prototype.run = function() {
      if (this.visible) {
        return _.forEach(this.watchViews, function(watchView) {
          return watchView.run();
        });
      }
    };

    WatchSidebar.prototype.resizeStarted = function() {
      $(document).on('mousemove', this.resizeSidebar);
      return $(document).on('mouseup', this.resizeStopped);
    };

    WatchSidebar.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizeSidebar);
      return $(document).off('mouseup', this.resizeStopped);
    };

    WatchSidebar.prototype.resizeSidebar = function(_arg) {
      var pageX, which, width;
      pageX = _arg.pageX, which = _arg.which;
      if (which !== 1) {
        return this.resizeStopped();
      }
      width = $(document.body).width() - pageX;
      return this.element.style.width = "" + (width - 10) + "px";
    };

    WatchSidebar.prototype.show = function() {
      this.element.classList.remove('hidden');
      return this.visible = true;
    };

    WatchSidebar.prototype.hide = function() {
      this.element.classList.add('hidden');
      return this.visible = false;
    };

    return WatchSidebar;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dhdGNoLXNpZGViYXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUpaLENBQUE7O0FBQUEsRUFLQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUxoQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNXLElBQUEsc0JBQUUsTUFBRixHQUFBO0FBQ1QsVUFBQSxpR0FBQTtBQUFBLE1BRFUsSUFBQyxDQUFBLFNBQUEsTUFDWCxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsVUFBdkIsRUFBbUMsZUFBbkMsQ0FEQSxDQUFBO0FBQUEsTUFHQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FIVixDQUFBO0FBQUEsTUFJQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxCLENBQXNCLFNBQXRCLEVBQWlDLE9BQWpDLENBSkEsQ0FBQTtBQUFBLE1BTUEsZUFBQSxHQUFrQixRQUFRLENBQUMs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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/watch-sidebar.coffee
