'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var tokenizedLineForRow = function tokenizedLineForRow(textEditor, lineNumber) {
  return(
    // Uses non-public parts of the Atom API, liable to break at any time!
    textEditor.tokenizedBuffer.tokenizedLineForRow(lineNumber)
  );
};

exports['default'] = {
  tooComplex: function tooComplex(textEditor, message, lineNumber) {
    // C901 - 'FUNCTION' is too complex
    // C901 - 'CLASS.METHOD' is too complex

    // // Get the raw symbol
    var symbol = /'(?:[^.]+\.)?([^']+)'/.exec(message)[1];

    // Some variables
    var lineCount = textEditor.getLineCount();
    var line = undefined;

    // Parse through the lines, starting where `flake8` says it starts
    for (line = lineNumber; line < lineCount; line += 1) {
      var offset = 0;
      var tokenizedLine = tokenizedLineForRow(textEditor, line);
      if (tokenizedLine === undefined) {
        // Doesn't exist if the line is folded
        break;
      }

      var foundDecorator = false;
      for (var i = 0; i < tokenizedLine.tokens.length; i += 1) {
        var token = tokenizedLine.tokens[i];
        if (token.scopes.includes('meta.function.python')) {
          if (token.value === symbol) {
            return {
              line: line,
              col: offset,
              endCol: offset + token.value.length
            };
          }
        }
        // Flag whether we have found the decorator, must be after symbol checks
        if (token.scopes.includes('meta.function.decorator.python')) {
          foundDecorator = true;
        }
        offset += token.value.length;
      }

      if (!foundDecorator) {
        break;
      }
    }

    // Fixing couldn't determine a point, let rangeFromLineNumber make up a range
    return {
      line: line
    };
  },

  importedUnused: function importedUnused(textEditor, message, lineNumber) {
    // F401 - 'SYMBOL' imported but unused

    // Get the raw symbol and split it into the word(s)
    var symbol = /'([^']+)'/.exec(message)[1];

    var _symbol$split$slice = symbol.split('.').slice(-1);

    var _symbol$split$slice2 = _slicedToArray(_symbol$split$slice, 1);

    symbol = _symbol$split$slice2[0];

    var symbolParts = symbol.split(/\s/);

    // Some variables
    var foundImport = false;
    var lineCount = textEditor.getLineCount();
    var line = undefined;
    var start = undefined;
    var end = undefined;

    // Parse through the lines, starting where `flake8` says it starts
    for (line = lineNumber; line < lineCount; line += 1) {
      var offset = 0;
      var tokenizedLine = tokenizedLineForRow(textEditor, line);
      if (tokenizedLine === undefined) {
        // Doesn't exist if the line is folded
        break;
      }
      // Check each token in the line
      for (var i = 0; i < tokenizedLine.tokens.length; i += 1) {
        var token = tokenizedLine.tokens[i];
        // Only match on the name if we have already passed the "import" statement
        if (foundImport && token.value === symbolParts[0]) {
          start = { line: line, col: offset };
          end = { line: line, col: offset + token.value.length };
        }
        // For multi-word symbols('foo as bar'), grab the end point as well
        if (foundImport && symbolParts.length > 1 && token.value === symbolParts[symbolParts.length - 1]) {
          end = { line: line, col: offset + token.value.length };
        }
        // Flag whether we have found the import, must be after symbol checks
        if (token.value === 'import' && token.scopes.includes('keyword.control.import.python')) {
          foundImport = true;
        }
        // If we didn't find what we were looking for, move on in the line
        offset += token.value.length;
      }
    }
    if (start !== undefined && end !== undefined) {
      // We found a valid range
      return {
        line: start.line,
        col: start.col,
        endCol: end.col
      };
    }
    // Fixing couldn't determine a point, let rangeFromLineNumber make up a range
    return {
      line: line
    };
  },

  noLocalsString: function noLocalsString(textEditor, lineNumber) {
    // H501 - do not use locals() for string formatting
    var tokenizedLine = tokenizedLineForRow(textEditor, lineNumber);
    if (tokenizedLine === undefined) {
      return {
        line: lineNumber
      };
    }
    var offset = 0;
    for (var i = 0; i < tokenizedLine.tokens.length; i += 1) {
      var token = tokenizedLine.tokens[i];
      if (token.scopes.includes('meta.function-call.python')) {
        if (token.value === 'locals') {
          return {
            line: lineNumber,
            col: offset,
            endCol: offset + token.value.length
          };
        }
      }
      offset += token.value.length;
    }
    return {
      line: lineNumber
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2tlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1mbGFrZTgvbGliL3JhbmdlSGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7O0FBRVosSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxVQUFVLEVBQUUsVUFBVTs7O0FBRWpELGNBQVUsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDOztDQUFBLENBQUM7O3FCQUU5QztBQUNiLFlBQVUsRUFBQSxvQkFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTs7Ozs7QUFLMUMsUUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHeEQsUUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzVDLFFBQUksSUFBSSxZQUFBLENBQUM7OztBQUdULFNBQUssSUFBSSxHQUFHLFVBQVUsRUFBRSxJQUFJLEdBQUcsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDbkQsVUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsVUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVELFVBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTs7QUFFL0IsY0FBTTtPQUNQOztBQUVELFVBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztBQUMzQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2RCxZQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENB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VUFBVTtLQUNqQixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvaG9tZS9uaWtrZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItZmxha2U4L2xpYi9yYW5nZUhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgdG9rZW5pemVkTGluZUZvclJvdyA9ICh0ZXh0RWRpdG9yLCBsaW5lTnVtYmVyKSA9PlxuICAvLyBVc2VzIG5vbi1wdWJsaWMgcGFydHMgb2YgdGhlIEF0b20gQVBJLCBsaWFibGUgdG8gYnJlYWsgYXQgYW55IHRpbWUhXG4gIHRleHRFZGl0b3IudG9rZW5pemVkQnVmZmVyLnRva2VuaXplZExpbmVGb3JSb3cobGluZU51bWJlcik7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdG9vQ29tcGxleCh0ZXh0RWRpdG9yLCBtZXNzYWdlLCBsaW5lTnVtYmVyKSB7XG4gICAgLy8gQzkwMSAtICdGVU5DVElPTicgaXMgdG9vIGNvbXBsZXhcbiAgICAvLyBDOTAxIC0gJ0NMQVNTLk1FVEhPRCcgaXMgdG9vIGNvbXBsZXhcblxuICAgIC8vIC8vIEdldCB0aGUgcmF3IHN5bWJvbFxuICAgIGNvbnN0IHN5bWJvbCA9IC8nKD86W14uXStcXC4pPyhbXiddKyknLy5leGVjKG1lc3NhZ2UpWzFdO1xuXG4gICAgLy8gU29tZSB2YXJpYWJsZXNcbiAgICBjb25zdCBsaW5lQ291bnQgPSB0ZXh0RWRpdG9yLmdldExpbmVDb3VudCgpO1xuICAgIGxldCBsaW5lO1xuXG4gICAgLy8gUGFyc2UgdGhyb3VnaCB0aGUgbGluZXMsIHN0YXJ0aW5nIHdoZXJlIGBmbGFrZThgIHNheXMgaXQgc3RhcnRzXG4gICAgZm9yIChsaW5lID0gbGluZU51bWJlcjsgbGluZSA8IGxpbmVDb3VudDsgbGluZSArPSAxKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgIGNvbnN0IHRva2VuaXplZExpbmUgPSB0b2tlbml6ZWRMaW5lRm9yUm93KHRleHRFZGl0b3IsIGxpbmUpO1xuICAgICAgaWYgKHRva2VuaXplZExpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBEb2Vzbid0IGV4aXN0IGlmIHRoZSBsaW5lIGlzIGZvbGRlZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbGV0IGZvdW5kRGVjb3JhdG9yID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2VuaXplZExpbmUudG9rZW5zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5pemVkTGluZS50b2tlbnNbaV07XG4gICAgICAgIGlmICh0b2tlbi5zY29wZXMuaW5jbHVkZXMoJ21ldGEuZnVuY3Rpb24ucHl0aG9uJykpIHtcbiAgICAgICAgICBpZiAodG9rZW4udmFsdWUgPT09IHN5bWJvbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgbGluZSxcbiAgICAgICAgICAgICAgY29sOiBvZmZzZXQsXG4gICAgICAgICAgICAgIGVuZENvbDogb2Zmc2V0ICsgdG9rZW4udmFsdWUubGVuZ3RoLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmxhZyB3aGV0aGVyIHdlIGhhdmUgZm91bmQgdGhlIGRlY29yYXRvciwgbXVzdCBiZSBhZnRlciBzeW1ib2wgY2hlY2tzXG4gICAgICAgIGlmICh0b2tlbi5zY29wZXMuaW5jbHVkZXMoJ21ldGEuZnVuY3Rpb24uZGVjb3JhdG9yLnB5dGhvbicpKSB7XG4gICAgICAgICAgZm91bmREZWNvcmF0b3IgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG9mZnNldCArPSB0b2tlbi52YWx1ZS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmREZWNvcmF0b3IpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRml4aW5nIGNvdWxkbid0IGRldGVybWluZSBhIHBvaW50LCBsZXQgcmFuZ2VGcm9tTGluZU51bWJlciBtYWtlIHVwIGEgcmFuZ2VcbiAgICByZXR1cm4ge1xuICAgICAgbGluZSxcbiAgICB9O1xuICB9LFxuXG4gIGltcG9ydGVkVW51c2VkKHRleHRFZGl0b3IsIG1lc3NhZ2UsIGxpbmVOdW1iZXIpIHtcbiAgICAvLyBGNDAxIC0gJ1NZTUJPTCcgaW1wb3J0ZWQgYnV0IHVudXNlZFxuXG4gICAgLy8gR2V0IHRoZSByYXcgc3ltYm9sIGFuZCBzcGxpdCBpdCBpbnRvIHRoZSB3b3JkKHMpXG4gICAgbGV0IHN5bWJvbCA9IC8nKFteJ10rKScvLmV4ZWMobWVzc2FnZSlbMV07XG4gICAgW3N5bWJvbF0gPSBzeW1ib2wuc3BsaXQoJy4nKS5zbGljZSgtMSk7XG4gICAgY29uc3Qgc3ltYm9sUGFydHMgPSBzeW1ib2wuc3BsaXQoL1xccy8pO1xuXG4gICAgLy8gU29tZSB2YXJpYWJsZXNcbiAgICBsZXQgZm91bmRJbXBvcnQgPSBmYWxzZTtcbiAgICBjb25zdCBsaW5lQ291bnQgPSB0ZXh0RWRpdG9yLmdldExpbmVDb3VudCgpO1xuICAgIGxldCBsaW5lO1xuICAgIGxldCBzdGFydDtcbiAgICBsZXQgZW5kO1xuXG4gICAgLy8gUGFyc2UgdGhyb3VnaCB0aGUgbGluZXMsIHN0YXJ0aW5nIHdoZXJlIGBmbGFrZThgIHNheXMgaXQgc3RhcnRzXG4gICAgZm9yIChsaW5lID0gbGluZU51bWJlcjsgbGluZSA8IGxpbmVDb3VudDsgbGluZSArPSAxKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgIGNvbnN0IHRva2VuaXplZExpbmUgPSB0b2tlbml6ZWRMaW5lRm9yUm93KHRleHRFZGl0b3IsIGxpbmUpO1xuICAgICAgaWYgKHRva2VuaXplZExpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBEb2Vzbid0IGV4aXN0IGlmIHRoZSBsaW5lIGlzIGZvbGRlZFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIENoZWNrIGVhY2ggdG9rZW4gaW4gdGhlIGxpbmVcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5pemVkTGluZS50b2tlbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbml6ZWRMaW5lLnRva2Vuc1tpXTtcbiAgICAgICAgLy8gT25seSBtYXRjaCBvbiB0aGUgbmFtZSBpZiB3ZSBoYXZlIGFscmVhZHkgcGFzc2VkIHRoZSBcImltcG9ydFwiIHN0YXRlbWVudFxuICAgICAgICBpZiAoZm91bmRJbXBvcnQgJiYgdG9rZW4udmFsdWUgPT09IHN5bWJvbFBhcnRzWzBdKSB7XG4gICAgICAgICAgc3RhcnQgPSB7IGxpbmUsIGNvbDogb2Zmc2V0IH07XG4gICAgICAgICAgZW5kID0geyBsaW5lLCBjb2w6IG9mZnNldCArIHRva2VuLnZhbHVlLmxlbmd0aCB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvciBtdWx0aS13b3JkIHN5bWJvbHMoJ2ZvbyBhcyBiYXInKSwgZ3JhYiB0aGUgZW5kIHBvaW50IGFzIHdlbGxcbiAgICAgICAgaWYgKGZvdW5kSW1wb3J0ICYmIHN5bWJvbFBhcnRzLmxlbmd0aCA+IDFcbiAgICAgICAgICAmJiB0b2tlbi52YWx1ZSA9PT0gc3ltYm9sUGFydHNbc3ltYm9sUGFydHMubGVuZ3RoIC0gMV1cbiAgICAgICAgKSB7XG4gICAgICAgICAgZW5kID0geyBsaW5lLCBjb2w6IG9mZnNldCArIHRva2VuLnZhbHVlLmxlbmd0aCB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIEZsYWcgd2hldGhlciB3ZSBoYXZlIGZvdW5kIHRoZSBpbXBvcnQsIG11c3QgYmUgYWZ0ZXIgc3ltYm9sIGNoZWNrc1xuICAgICAgICBpZiAodG9rZW4udmFsdWUgPT09ICdpbXBvcnQnICYmIHRva2VuLnNjb3Blcy5pbmNsdWRlcygna2V5d29yZC5jb250cm9sLmltcG9ydC5weXRob24nKSkge1xuICAgICAgICAgIGZvdW5kSW1wb3J0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSBkaWRuJ3QgZmluZCB3aGF0IHdlIHdlcmUgbG9va2luZyBmb3IsIG1vdmUgb24gaW4gdGhlIGxpbmVcbiAgICAgICAgb2Zmc2V0ICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgZW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFdlIGZvdW5kIGEgdmFsaWQgcmFuZ2VcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxpbmU6IHN0YXJ0LmxpbmUsXG4gICAgICAgIGNvbDogc3RhcnQuY29sLFxuICAgICAgICBlbmRDb2w6IGVuZC5jb2wsXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBGaXhpbmcgY291bGRuJ3QgZGV0ZXJtaW5lIGEgcG9pbnQsIGxldCByYW5nZUZyb21MaW5lTnVtYmVyIG1ha2UgdXAgYSByYW5nZVxuICAgIHJldHVybiB7XG4gICAgICBsaW5lLFxuICAgIH07XG4gIH0sXG5cbiAgbm9Mb2NhbHNTdHJpbmcodGV4dEVkaXRvciwgbGluZU51bWJlcikge1xuICAgIC8vIEg1MDEgLSBkbyBub3QgdXNlIGxvY2FscygpIGZvciBzdHJpbmcgZm9ybWF0dGluZ1xuICAgIGNvbnN0IHRva2VuaXplZExpbmUgPSB0b2tlbml6ZWRMaW5lRm9yUm93KHRleHRFZGl0b3IsIGxpbmVOdW1iZXIpO1xuICAgIGlmICh0b2tlbml6ZWRMaW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICB9O1xuICAgIH1cbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2VuaXplZExpbmUudG9rZW5zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IHRva2VuaXplZExpbmUudG9rZW5zW2ldO1xuICAgICAgaWYgKHRva2VuLnNjb3Blcy5pbmNsdWRlcygnbWV0YS5mdW5jdGlvbi1jYWxsLnB5dGhvbicpKSB7XG4gICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PT0gJ2xvY2FscycpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgIGNvbDogb2Zmc2V0LFxuICAgICAgICAgICAgZW5kQ29sOiBvZmZzZXQgKyB0b2tlbi52YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2Zmc2V0ICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=
//# sourceURL=/home/nikke/.atom/packages/linter-flake8/lib/rangeHelpers.js
