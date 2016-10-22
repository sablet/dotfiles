(function() {
  var Inspector, MessagePanelView, PlainMessageView, transform, transformime, _ref;

  _ref = require('atom-message-panel'), MessagePanelView = _ref.MessagePanelView, PlainMessageView = _ref.PlainMessageView;

  transformime = require('transformime');

  module.exports = Inspector = (function() {
    function Inspector(kernelManager, codeManager) {
      this.kernelManager = kernelManager;
      this.codeManager = codeManager;
      this._lastInspectionResult = '';
    }

    Inspector.prototype.toggle = function() {
      var code, cursor_pos, editor, grammar, kernel, language, _ref1, _ref2;
      editor = atom.workspace.getActiveTextEditor();
      grammar = editor.getGrammar();
      language = this.kernelManager.getLanguageFor(grammar);
      kernel = this.kernelManager.getRunningKernelFor(language);
      if (kernel == null) {
        atom.notifications.addInfo('No kernel running!');
        if ((_ref1 = this.view) != null) {
          _ref1.close();
        }
        return;
      }
      if (this.view == null) {
        this.view = new MessagePanelView({
          title: 'Hydrogen Inspector',
          closeMethod: 'destroy'
        });
      }
      _ref2 = this.codeManager.getCodeToInspect(), code = _ref2[0], cursor_pos = _ref2[1];
      if (cursor_pos === 0) {
        return;
      }
      return kernel.inspect(code, cursor_pos, (function(_this) {
        return function(result) {
          return _this.showInspectionResult(result);
        };
      })(this));
    };

    Inspector.prototype.showInspectionResult = function(result) {
      var onError, onInspectResult, _ref1;
      console.log('Inspector: Result:', result);
      if (!result.found) {
        atom.notifications.addInfo('No introspection available!');
        if ((_ref1 = this.view) != null) {
          _ref1.close();
        }
        return;
      }
      onInspectResult = (function(_this) {
        return function(_arg) {
          var container, el, firstline, lines, message, mimetype, _ref2, _ref3, _ref4;
          mimetype = _arg.mimetype, el = _arg.el;
          if (mimetype === 'text/plain') {
            lines = el.innerHTML.split('\n');
            firstline = lines[0];
            lines.splice(0, 1);
            message = lines.join('\n');
            if (_this._lastInspectionResult === message && (_this.view.panel != null)) {
              if ((_ref2 = _this.view) != null) {
                _ref2.close();
              }
              return;
            }
            _this.view.clear();
            _this.view.attach();
            _this.view.add(new PlainMessageView({
              message: firstline,
              className: 'inspect-message',
              raw: true
            }));
            _this.view.add(new PlainMessageView({
              message: message,
              className: 'inspect-message',
              raw: true
            }));
            _this._lastInspectionResult = message;
            return;
          } else if (mimetype === 'text/html') {
            container = document.createElement('div');
            container.appendChild(el);
            message = container.innerHTML;
            if (_this._lastInspectionResult === message && (_this.view.panel != null)) {
              if ((_ref3 = _this.view) != null) {
                _ref3.close();
              }
              return;
            }
            _this.view.clear();
            _this.view.attach();
            _this.view.add(new PlainMessageView({
              message: message,
              className: 'inspect-message',
              raw: true
            }));
            _this._lastInspectionResult = message;
            return;
          }
          console.error('Inspector: Rendering error:', mimetype, el);
          atom.notifications.addInfo('Cannot render introspection result!');
          if ((_ref4 = _this.view) != null) {
            _ref4.close();
          }
        };
      })(this);
      onError = (function(_this) {
        return function(error) {
          var _ref2;
          console.error('Inspector: Rendering error:', error);
          atom.notifications.addInfo('Cannot render introspection result!');
          return (_ref2 = _this.view) != null ? _ref2.close() : void 0;
        };
      })(this);
      return transform(result.data).then(onInspectResult, onError);
    };

    return Inspector;

  })();

  transform = transformime.createTransform();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2luc3BlY3Rvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEVBQUE7O0FBQUEsRUFBQSxPQUF1QyxPQUFBLENBQVEsb0JBQVIsQ0FBdkMsRUFBQyx3QkFBQSxnQkFBRCxFQUFtQix3QkFBQSxnQkFBbkIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsY0FBUixDQURmLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1csSUFBQSxtQkFBRSxhQUFGLEVBQWtCLFdBQWxCLEdBQUE7QUFDVCxNQURVLElBQUMsQ0FBQSxnQkFBQSxhQUNYLENBQUE7QUFBQSxNQUQwQixJQUFDLENBQUEsY0FBQSxXQUMzQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsRUFBekIsQ0FEUztJQUFBLENBQWI7O0FBQUEsd0JBR0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNKLFVBQUEsaUVBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQURWLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxJQUFDLENBQUEsYUFBYSxDQUFDLGNBQWYsQ0FBOEIsT0FBOUIsQ0FGWCxDQUFBO0FBQUEsTUFHQSxNQUFBLEdBQVMsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFtQyxRQUFuQyxDQUhULENBQUE7QUFJQSxNQUFBLElBQU8sY0FBUDtBQUNJLFFBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixvQkFBM0IsQ0FBQSxDQUFBOztlQUNLLENBQUUsS0FBUCxDQUFBO1NBREE7QUFFQSxjQUFBLENBSEo7T0FKQTs7UUFTQSxJQUFDLENBQUEsT0FBWSxJQUFBLGdCQUFBLENBQ1Q7QUFBQSxVQUFBLEtBQUEsRUFBTyxvQkFBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLFNBRGI7U0FEUztPQVRiO0FBQUEsTUFhQSxRQUFxQixJQUFDLENBQUEsV0FBVyxDQUFDLGdCQUFiLENBQUEsQ0FBckIsRUFBQyxlQUFELEVBQU8scUJBYlAsQ0FBQTtBQWNBLE1BQUEsSUFBRyxVQUFBLEtBQWMsQ0FBakI7QUFDSSxjQUFBLENBREo7T0FkQTthQWlCQSxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsRUFBcUIsVUFBckIsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUU3QixLQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEIsRUFGNkI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQWxCSTtJQUFBLENBSFIsQ0FBQTs7QUFBQSx3QkEwQkEsb0JBQUEsR0FBc0IsU0FBQyxNQUFELEdBQUE7QUFDbEIsVUFBQSwrQkFBQTtBQUFBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxNQUFsQyxDQUFBLENBQUE7QUFFQSxNQUFBLElBQUEsQ0FBQSxNQUFhLENBQUMsS0FBZDtBQUNJLFFBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiw2QkFBM0IsQ0FBQSxDQUFBOztlQUNLLENBQUUsS0FBUCxDQUFBO1NBREE7QUFFQSxjQUFBLENBSEo7T0FGQTtBQUFBLE1BT0EsZUFBQSxHQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDZCxjQUFBLHVFQUFBO0FBQUEsVUFEZ0IsZ0JBQUEsVUFBVSxVQUFBLEVBQzFCLENBQUE7QUFBQSxVQUFBLElBQUcsUUFBQSxLQUFZLFlBQWY7QUFDSSxZQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQWIsQ0FBbUIsSUFBbkIsQ0FBUixDQUFBO0FBQUEsWUFDQSxTQUFBLEdBQVksS0FBTSxDQUFBLENBQUEsQ0FEbEIsQ0FBQTtBQUFBLFlBRUEsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiLEVBQWdCLENBQWhCLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxHQUFVLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWCxDQUhWLENBQUE7QUFLQSxZQUFBLElBQUcsS0FBQyxDQUFBLHFCQUFELEtBQTBCLE9BQTFCLElBQXNDLDBCQUF6Qzs7cUJBQ1MsQ0FBRSxLQUFQLENBQUE7ZUFBQTtBQUNBLG9CQUFBLENBRko7YUFMQTtBQUFBLFlBU0EsS0FBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUEsQ0FUQSxDQUFBO0FBQUEsWUFVQSxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxDQVZBLENBQUE7QUFBQSxZQVdBLEtBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFjLElBQUEsZ0JBQUEsQ0FDVjtBQUFBLGNBQUEsT0FBQSxFQUFTLFNBQVQ7QUFBQSxjQUNBLFNBQUEsRUFBVyxpQkFEWDtBQUFBLGNBRUEsR0FBQSxFQUFLLElBRkw7YUFEVSxDQUFkLENBWEEsQ0FBQTtBQUFBLFlBZUEsS0FBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQWMsSUFBQSxnQkFBQSxDQUNWO0FBQUEsY0FBQSxPQUFBLEVBQVMsT0FBVDtBQUFBLGNBQ0EsU0FBQSxFQUFXLGlCQURYO0FBQUEsY0FFQSxHQUFBLEVBQUssSUFGTDthQURVLENBQWQsQ0FmQSxDQUFBO0FBQUEsWUFvQkEsS0FBQyxDQUFBLHFCQUFELEdBQXlCLE9BcEJ6QixDQUFBO0FBcUJBLGtCQUFBLENBdEJKO1dBQUEsTUF3QkssSUFBRyxRQUFBLEtBQVksV0FBZjtBQUNELFlBQUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVosQ0FBQTtBQUFBLFlBQ0EsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsRUFBdEIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLEdBQVUsU0FBUyxDQUFDLFNBRnBCLENBQUE7QUFHQSxZQUFBLElBQUcsS0FBQyxDQUFBLHFCQUFELEtBQTBCLE9BQTFCLElBQXNDLDBCQUF6Qzs7cUJBQ1MsQ0FBRSxLQUFQLENBQUE7ZUFBQTtBQUNBLG9CQUFBLENBRko7YUFIQTtBQUFBLFlBT0EsS0FBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUEsQ0FQQSxDQUFBO0FBQUEsWUFRQSxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxDQVJBLENBQUE7QUFBQSxZQVNBLEtBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFjLElBQUEsZ0JBQUEsQ0FDVjtBQUFBLGNBQUEsT0FBQSxFQUFTLE9BQVQ7QUFBQSxjQUNBLFNBQUEsRUFBVyxpQkFEWDtBQUFBLGNBRUEsR0FBQSxFQUFLLElBRkw7YUFEVSxDQUFkLENBVEEsQ0FBQTtBQUFBLFlBY0EsS0FBQyxDQUFBLHFCQUFELEdBQXlCLE9BZHpCLENBQUE7QUFlQSxrQkFBQSxDQWhCQztXQXhCTDtBQUFBLFVBMENBLE9BQU8sQ0FBQyxLQUFSLENBQWMsNkJBQWQsRUFBNkMsUUFBN0MsRUFBdUQsRUFBdkQsQ0ExQ0EsQ0FBQTtBQUFBLFVBMkNBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIscUNBQTNCLENBM0NBLENBQUE7O2lCQTRDSyxDQUFFLEtBQVAsQ0FBQTtXQTdDYztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUGxCLENBQUE7QUFBQSxNQXVEQSxPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ04sY0FBQSxLQUFBO0FBQUEsVUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLDZCQUFkLEVBQTZDLEtBQTdDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixxQ0FBM0IsQ0FEQSxDQUFBO3FEQUVLLENBQUUsS0FBUCxDQUFBLFdBSE07UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXZEVixDQUFBO2FBNERBLFNBQUEsQ0FBVSxNQUFNLENBQUMsSUFBakIsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixlQUE1QixFQUE2QyxPQUE3QyxFQTdEa0I7SUFBQSxDQTFCdEIsQ0FBQTs7cUJBQUE7O01BTEosQ0FBQTs7QUFBQSxFQThGQSxTQUFBLEdBQVksWUFBWSxDQUFDLGVBQWIsQ0FBQSxDQTlGWixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/inspector.coffee
