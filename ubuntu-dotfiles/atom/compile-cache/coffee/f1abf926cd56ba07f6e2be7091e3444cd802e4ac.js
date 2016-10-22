(function() {
  var CompositeDisposable, MarkdownTransform, ResultView, transform, transformime;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ResultView = (function() {
    function ResultView(marker) {
      var actionPanel, closeButton, copyButton, openButton, outputContainer, padding, richCloseButton;
      this.marker = marker;
      this.element = document.createElement('div');
      this.element.classList.add('hydrogen', 'output-bubble', 'empty');
      outputContainer = document.createElement('div');
      outputContainer.classList.add('bubble-output-container');
      outputContainer.onmousewheel = function(e) {
        return e.stopPropagation();
      };
      this.element.appendChild(outputContainer);
      this.resultContainer = document.createElement('div');
      this.resultContainer.classList.add('bubble-result-container');
      outputContainer.appendChild(this.resultContainer);
      this.errorContainer = document.createElement('div');
      this.errorContainer.classList.add('bubble-error-container');
      outputContainer.appendChild(this.errorContainer);
      this.statusContainer = document.createElement('div');
      this.statusContainer.classList.add('bubble-status-container');
      this.spinner = this.buildSpinner();
      this.statusContainer.appendChild(this.spinner);
      outputContainer.appendChild(this.statusContainer);
      richCloseButton = document.createElement('div');
      richCloseButton.classList.add('rich-close-button', 'icon', 'icon-x');
      richCloseButton.onclick = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      this.element.appendChild(richCloseButton);
      actionPanel = document.createElement('div');
      actionPanel.classList.add('bubble-action-panel');
      this.element.appendChild(actionPanel);
      closeButton = document.createElement('div');
      closeButton.classList.add('action-button', 'close-button', 'icon', 'icon-x');
      closeButton.onclick = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      actionPanel.appendChild(closeButton);
      padding = document.createElement('div');
      padding.classList.add('padding');
      actionPanel.appendChild(padding);
      copyButton = document.createElement('div');
      copyButton.classList.add('action-button', 'copy-button', 'icon', 'icon-clippy');
      copyButton.onclick = (function(_this) {
        return function() {
          atom.clipboard.write(_this.getAllText());
          return atom.notifications.addSuccess('Copied to clipboard');
        };
      })(this);
      actionPanel.appendChild(copyButton);
      openButton = document.createElement('div');
      openButton.classList.add('action-button', 'open-button', 'icon', 'icon-file-symlink-file');
      openButton.onclick = (function(_this) {
        return function() {
          var bubbleText;
          bubbleText = _this.getAllText();
          return atom.workspace.open().then(function(editor) {
            return editor.insertText(bubbleText);
          });
        };
      })(this);
      actionPanel.appendChild(openButton);
      this.setMultiline(false);
      this.tooltips = new CompositeDisposable();
      this.tooltips.add(atom.tooltips.add(copyButton, {
        title: 'Copy to clipboard'
      }));
      this.tooltips.add(atom.tooltips.add(openButton, {
        title: 'Open in new editor'
      }));
      this._hasResult = false;
      return this;
    }

    ResultView.prototype.addResult = function(result) {
      var container, onError, onSuccess;
      console.log('ResultView: Add result', result);
      this.element.classList.remove('empty');
      if (result.stream === 'status') {
        if (!this._hasResult && result.data === 'ok') {
          console.log('ResultView: Show status container');
          this.statusContainer.classList.add('icon', 'icon-check');
          this.statusContainer.style.display = 'inline-block';
        }
        return;
      }
      if (result.stream === 'stderr') {
        container = this.errorContainer;
      } else if (result.stream === 'stdout') {
        container = this.resultContainer;
      } else if (result.stream === 'error') {
        container = this.errorContainer;
      } else {
        container = this.resultContainer;
      }
      onSuccess = (function(_this) {
        return function(_arg) {
          var el, htmlElement, mimeType, mimetype, previousText, text, webview;
          mimetype = _arg.mimetype, el = _arg.el;
          console.log('ResultView: Hide status container');
          _this._hasResult = true;
          _this.statusContainer.style.display = 'none';
          mimeType = mimetype;
          htmlElement = el;
          if (mimeType === 'text/plain') {
            _this.element.classList.remove('rich');
            previousText = _this.getAllText();
            text = result.data['text/plain'];
            if (previousText === '' && text.length < 50 && text.indexOf('\n') === -1) {
              _this.setMultiline(false);
              _this.tooltips.add(atom.tooltips.add(container, {
                title: 'Copy to clipboard'
              }));
              container.onclick = function() {
                atom.clipboard.write(_this.getAllText());
                return atom.notifications.addSuccess('Copied to clipboard');
              };
            } else {
              _this.setMultiline(true);
            }
          } else {
            _this.element.classList.add('rich');
            _this.setMultiline(true);
          }
          if (mimeType === 'application/pdf') {
            webview = document.createElement('webview');
            webview.src = htmlElement.href;
            htmlElement = webview;
          }
          console.log('ResultView: Rendering as MIME ', mimeType);
          console.log('ResultView: Rendering as ', htmlElement);
          container.appendChild(htmlElement);
          if (mimeType === 'text/html') {
            if (_this.getAllText() !== '') {
              _this.element.classList.remove('rich');
            }
          }
          if (mimeType === 'image/svg+xml') {
            container.classList.add('svg');
          }
          if (mimeType === 'text/markdown') {
            _this.element.classList.add('markdown');
            _this.element.classList.remove('rich');
          }
          if (mimeType === 'text/latex') {
            _this.element.classList.add('latex');
          }
          if (_this.errorContainer.getElementsByTagName('span').length === 0) {
            return _this.errorContainer.classList.add('plain-error');
          } else {
            return _this.errorContainer.classList.remove('plain-error');
          }
        };
      })(this);
      onError = function(error) {
        return console.error('ResultView: Rendering error:', error);
      };
      return transform(result.data).then(onSuccess, onError);
    };

    ResultView.prototype.getAllText = function() {
      var errorText, resultText, text;
      text = '';
      resultText = this.resultContainer.innerText.trim();
      if (resultText.length > 0) {
        text += resultText;
      }
      errorText = this.errorContainer.innerText.trim();
      if (errorText.length > 0) {
        text += '\n' + errorText;
      }
      return text;
    };

    ResultView.prototype.setMultiline = function(multiline) {
      if (multiline) {
        return this.element.classList.add('multiline');
      } else {
        return this.element.classList.remove('multiline');
      }
    };

    ResultView.prototype.buildSpinner = function() {
      var container, rect1, rect2, rect3, rect4, rect5;
      container = document.createElement('div');
      container.classList.add('spinner');
      rect1 = document.createElement('div');
      rect1.classList.add('rect1');
      rect2 = document.createElement('div');
      rect2.classList.add('rect2');
      rect3 = document.createElement('div');
      rect3.classList.add('rect3');
      rect4 = document.createElement('div');
      rect4.classList.add('rect4');
      rect5 = document.createElement('div');
      rect5.classList.add('rect5');
      container.appendChild(rect1);
      container.appendChild(rect2);
      container.appendChild(rect3);
      container.appendChild(rect4);
      container.appendChild(rect5);
      return container;
    };

    ResultView.prototype.spin = function(shouldSpin) {
      if (shouldSpin) {
        this.element.classList.remove('empty');
        return this.spinner.style.display = 'block';
      } else {
        return this.spinner.style.display = 'none';
      }
    };

    ResultView.prototype.destroy = function() {
      this.tooltips.dispose();
      if (this.marker != null) {
        this.marker.destroy();
      }
      return this.element.innerHTML = '';
    };

    return ResultView;

  })();

  transformime = require('transformime');

  MarkdownTransform = require('transformime-marked');

  transform = transformime.createTransform([MarkdownTransform]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3Jlc3VsdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyRUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVXLElBQUEsb0JBQUUsTUFBRixHQUFBO0FBQ1QsVUFBQSwyRkFBQTtBQUFBLE1BRFUsSUFBQyxDQUFBLFNBQUEsTUFDWCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsVUFBdkIsRUFBbUMsZUFBbkMsRUFBb0QsT0FBcEQsQ0FEQSxDQUFBO0FBQUEsTUFHQSxlQUFBLEdBQWtCLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSGxCLENBQUE7QUFBQSxNQUlBLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBMUIsQ0FBOEIseUJBQTlCLENBSkEsQ0FBQTtBQUFBLE1BS0EsZUFBZSxDQUFDLFlBQWhCLEdBQStCLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUFQO01BQUEsQ0FML0IsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLGVBQXJCLENBTkEsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FSbkIsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBM0IsQ0FBK0IseUJBQS9C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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/result-view.coffee
