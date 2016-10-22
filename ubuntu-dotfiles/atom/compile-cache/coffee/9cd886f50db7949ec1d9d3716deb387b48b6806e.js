(function() {
  var CodeManager, escapeStringRegexp, _;

  escapeStringRegexp = require('escape-string-regexp');

  _ = require('lodash');

  module.exports = CodeManager = (function() {
    function CodeManager() {
      this.editor = atom.workspace.getActiveTextEditor();
    }

    CodeManager.prototype.findCodeBlock = function() {
      var cursor, endRow, foldRange, foldable, indentLevel, row, selectedRange, selectedText;
      selectedText = this.getSelectedText();
      if (selectedText) {
        selectedRange = this.editor.getSelectedBufferRange();
        endRow = selectedRange.end.row;
        if (selectedRange.end.column === 0) {
          endRow = endRow - 1;
        }
        endRow = this.escapeBlankRows(selectedRange.start.row, endRow);
        return [selectedText, endRow];
      }
      cursor = this.editor.getLastCursor();
      row = cursor.getBufferRow();
      console.log('findCodeBlock:', row);
      indentLevel = cursor.getIndentLevel();
      foldable = this.editor.isFoldableAtBufferRow(row);
      foldRange = this.editor.languageMode.rowRangeForCodeFoldAtBufferRow(row);
      if ((foldRange == null) || (foldRange[0] == null) || (foldRange[1] == null)) {
        foldable = false;
      }
      if (foldable) {
        return this.getFoldContents(row);
      } else if (this.isBlank(row)) {
        return this.findPrecedingBlock(row, indentLevel);
      } else if (this.getRow(row).trim() === 'end') {
        return this.findPrecedingBlock(row, indentLevel);
      } else {
        return [this.getRow(row), row];
      }
    };

    CodeManager.prototype.findPrecedingBlock = function(row, indentLevel) {
      var blank, isEnd, previousIndentLevel, previousRow, sameIndent;
      previousRow = row - 1;
      while (previousRow >= 0) {
        previousIndentLevel = this.editor.indentationForBufferRow(previousRow);
        sameIndent = previousIndentLevel <= indentLevel;
        blank = this.isBlank(previousRow);
        isEnd = this.getRow(previousRow).trim() === 'end';
        if (this.isBlank(row)) {
          row = previousRow;
        }
        if (sameIndent && !blank && !isEnd) {
          return [this.getRows(previousRow, row), row];
        }
        previousRow--;
      }
      return null;
    };

    CodeManager.prototype.getRow = function(row) {
      return this.normalizeString(this.editor.lineTextForBufferRow(row));
    };

    CodeManager.prototype.getTextInRange = function(start, end) {
      var code;
      code = this.editor.getTextInBufferRange([start, end]);
      return this.normalizeString(code);
    };

    CodeManager.prototype.getRows = function(startRow, endRow) {
      var code;
      code = this.editor.getTextInBufferRange({
        start: {
          row: startRow,
          column: 0
        },
        end: {
          row: endRow,
          column: 9999999
        }
      });
      return this.normalizeString(code);
    };

    CodeManager.prototype.getSelectedText = function() {
      return this.normalizeString(this.editor.getSelectedText());
    };

    CodeManager.prototype.normalizeString = function(code) {
      if (code != null) {
        return code.replace(/\r\n|\r/g, '\n');
      }
    };

    CodeManager.prototype.getFoldRange = function(row) {
      var range, _ref;
      range = this.editor.languageMode.rowRangeForCodeFoldAtBufferRow(row);
      if (((_ref = this.getRow(range[1] + 1)) != null ? _ref.trim() : void 0) === 'end') {
        range[1] = range[1] + 1;
      }
      console.log('getFoldRange:', range);
      return range;
    };

    CodeManager.prototype.getFoldContents = function(row) {
      var range;
      range = this.getFoldRange(row);
      return [this.getRows(range[0], range[1]), range[1]];
    };

    CodeManager.prototype.getCodeToInspect = function() {
      var code, cursor, cursor_pos, identifier_end, row, selectedText;
      selectedText = this.getSelectedText();
      if (selectedText) {
        code = selectedText;
        cursor_pos = code.length;
      } else {
        cursor = this.editor.getLastCursor();
        row = cursor.getBufferRow();
        code = this.getRow(row);
        cursor_pos = cursor.getBufferColumn();
        identifier_end = code.slice(cursor_pos).search(/\W/);
        if (identifier_end !== -1) {
          cursor_pos += identifier_end;
        }
      }
      return [code, cursor_pos];
    };

    CodeManager.prototype.getCurrentCell = function() {
      var buffer, cursor, end, regex, regexString, start;
      buffer = this.editor.getBuffer();
      start = buffer.getFirstPosition();
      end = buffer.getEndPosition();
      regexString = this.getRegexString(this.editor);
      if (regexString == null) {
        return [start, end];
      }
      regex = new RegExp(regexString);
      cursor = this.editor.getCursorBufferPosition();
      while (cursor.row < end.row && this.isComment(cursor)) {
        cursor.row += 1;
        cursor.column = 0;
      }
      if (cursor.row > 0) {
        buffer.backwardsScanInRange(regex, [start, cursor], function(_arg) {
          var range;
          range = _arg.range;
          return start = range.start;
        });
      }
      buffer.scanInRange(regex, [cursor, end], function(_arg) {
        var range;
        range = _arg.range;
        return end = range.start;
      });
      console.log('CellManager: Cell [start, end]:', [start, end], 'cursor:', cursor);
      return [start, end];
    };

    CodeManager.prototype.getBreakpoints = function() {
      var breakpoints, buffer, regex, regexString;
      buffer = this.editor.getBuffer();
      breakpoints = [buffer.getFirstPosition()];
      regexString = this.getRegexString(this.editor);
      if (regexString != null) {
        regex = new RegExp(regexString, 'g');
        buffer.scan(regex, function(_arg) {
          var range;
          range = _arg.range;
          return breakpoints.push(range.start);
        });
      }
      breakpoints.push(buffer.getEndPosition());
      console.log('CellManager: Breakpoints:', breakpoints);
      return breakpoints;
    };

    CodeManager.prototype.getRegexString = function() {
      var commentEndString, commentStartString, escapedCommentStartString, regexString, scope, _ref;
      scope = this.editor.getRootScopeDescriptor();
      _ref = this.getCommentStrings(scope), commentStartString = _ref.commentStartString, commentEndString = _ref.commentEndString;
      if (!commentStartString) {
        console.log('CellManager: No comment string defined in root scope');
        return;
      }
      escapedCommentStartString = escapeStringRegexp(commentStartString.trimRight());
      regexString = escapedCommentStartString + '(%%| %%| <codecell>| In\[[0-9 ]*\]:?)';
      return regexString;
    };

    CodeManager.prototype.getCommentStrings = function(scope) {
      if (parseFloat(atom.getVersion()) <= 1.1) {
        return this.editor.languageMode.commentStartAndEndStringsForScope(scope);
      } else {
        return this.editor.getCommentStrings(scope);
      }
    };

    CodeManager.prototype.isComment = function(position) {
      var scope, scopeString;
      scope = this.editor.scopeDescriptorForBufferPosition(position);
      scopeString = scope.getScopeChain();
      return _.includes(scopeString, 'comment.line');
    };

    CodeManager.prototype.isBlank = function(row) {
      return this.editor.getBuffer().isRowBlank(row) || this.editor.languageMode.isLineCommentedAtBufferRow(row);
    };

    CodeManager.prototype.escapeBlankRows = function(startRow, endRow) {
      var i, _i, _ref;
      if (endRow > startRow) {
        for (i = _i = startRow, _ref = endRow - 1; startRow <= _ref ? _i <= _ref : _i >= _ref; i = startRow <= _ref ? ++_i : --_i) {
          if (this.isBlank(endRow)) {
            endRow -= 1;
          }
        }
      }
      return endRow;
    };

    CodeManager.prototype.moveDown = function(row) {
      var lastRow;
      lastRow = this.editor.getLastBufferRow();
      if (row >= lastRow) {
        this.editor.moveToBottom();
        this.editor.insertNewline();
        return;
      }
      while (row < lastRow) {
        row++;
        if (!this.isBlank(row)) {
          break;
        }
      }
      return this.editor.setCursorBufferPosition({
        row: row,
        column: 0
      });
    };

    return CodeManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvZGUtbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0NBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsc0JBQVIsQ0FBckIsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1csSUFBQSxxQkFBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFWLENBRFM7SUFBQSxDQUFiOztBQUFBLDBCQUlBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDWCxVQUFBLGtGQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFmLENBQUE7QUFFQSxNQUFBLElBQUcsWUFBSDtBQUNJLFFBQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsQ0FBaEIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FEM0IsQ0FBQTtBQUVBLFFBQUEsSUFBRyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQWxCLEtBQTRCLENBQS9CO0FBQ0ksVUFBQSxNQUFBLEdBQVMsTUFBQSxHQUFTLENBQWxCLENBREo7U0FGQTtBQUFBLFFBSUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxlQUFELENBQWlCLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBckMsRUFBMEMsTUFBMUMsQ0FKVCxDQUFBO0FBS0EsZUFBTyxDQUFDLFlBQUQsRUFBZSxNQUFmLENBQVAsQ0FOSjtPQUZBO0FBQUEsTUFVQSxNQUFBLEdB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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/code-manager.coffee
