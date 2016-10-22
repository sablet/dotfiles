(function() {
  var $, BlameLineComponent, BlameListLinesComponent, BlameListView, RP, React, Reactionary, div, renderLoading, _, _ref;

  $ = require('atom-space-pen-views').$;

  React = require('react-atom-fork');

  Reactionary = require('reactionary-atom-fork');

  div = Reactionary.div;

  RP = React.PropTypes;

  _ = require('underscore');

  _ref = require('./blame-line-view'), BlameLineComponent = _ref.BlameLineComponent, renderLoading = _ref.renderLoading;

  BlameListLinesComponent = React.createClass({
    propTypes: {
      annotations: RP.arrayOf(RP.object),
      loading: RP.bool.isRequired,
      dirty: RP.bool.isRequired,
      initialLineCount: RP.number.isRequired,
      remoteRevision: RP.object.isRequired,
      showOnlyLastNames: RP.bool.isRequired
    },
    renderLoading: function() {
      var lines, _i, _ref1, _results;
      lines = (function() {
        _results = [];
        for (var _i = 0, _ref1 = this.props.initialLineCount; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(renderLoading);
      return div(null, lines);
    },
    _addAlternatingBackgroundColor: function(lines) {
      var bgClass, lastHash, line, _i, _len;
      bgClass = null;
      lastHash = null;
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        bgClass = line.noCommit ? '' : line.hash === lastHash ? bgClass : bgClass === 'line-bg-lighter' ? 'line-bg-darker' : 'line-bg-lighter';
        line['backgroundClass'] = bgClass;
        lastHash = line.hash;
      }
      return lines;
    },
    renderLoaded: function() {
      var l, lines, _i, _len;
      lines = _.clone(this.props.annotations);
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        l = lines[_i];
        l.remoteRevision = this.props.remoteRevision;
        l.showOnlyLastNames = this.props.showOnlyLastNames;
      }
      this._addAlternatingBackgroundColor(lines);
      return div(null, lines.map(BlameLineComponent));
    },
    render: function() {
      if (this.props.loading) {
        return this.renderLoading();
      } else {
        return this.renderLoaded();
      }
    },
    shouldComponentUpdate: function(_arg) {
      var dirty, finishedEdit, finishedInitialLoad, loading, showOnlyLastNames, showOnlyLastNamesChanged;
      loading = _arg.loading, dirty = _arg.dirty, showOnlyLastNames = _arg.showOnlyLastNames;
      finishedInitialLoad = this.props.loading && !loading && !this.props.dirty;
      finishedEdit = this.props.dirty && !dirty;
      showOnlyLastNamesChanged = this.props.showOnlyLastNames !== showOnlyLastNames;
      return finishedInitialLoad || finishedEdit || showOnlyLastNamesChanged;
    }
  });

  BlameListView = React.createClass({
    propTypes: {
      projectBlamer: RP.object.isRequired,
      remoteRevision: RP.object.isRequired,
      editorView: RP.object.isRequired
    },
    getInitialState: function() {
      return {
        scrollTop: this.scrollbar().scrollTop(),
        width: atom.config.get('git-blame.columnWidth'),
        loading: true,
        visible: true,
        dirty: false,
        showOnlyLastNames: atom.config.get('git-blame.showOnlyLastNames')
      };
    },
    scrollbar: function() {
      var _ref1;
      return this._scrollbar != null ? this._scrollbar : this._scrollbar = $((_ref1 = this.props.editorView.rootElement) != null ? _ref1.querySelector('.vertical-scrollbar') : void 0);
    },
    editor: function() {
      return this._editor != null ? this._editor : this._editor = this.props.editorView.getModel();
    },
    render: function() {
      var body, display;
      display = this.state.visible ? 'inline-block' : 'none';
      body = this.state.error ? div("Sorry, an error occurred.") : div({
        className: 'git-blame-scroller'
      }, div({
        className: 'blame-lines',
        style: {
          WebkitTransform: this.getTransform()
        }
      }, BlameListLinesComponent({
        annotations: this.state.annotations,
        loading: this.state.loading,
        dirty: this.state.dirty,
        initialLineCount: this.editor().getLineCount(),
        remoteRevision: this.props.remoteRevision,
        showOnlyLastNames: this.state.showOnlyLastNames
      })));
      return div({
        className: 'git-blame',
        style: {
          width: this.state.width,
          display: display
        }
      }, div({
        className: 'git-blame-resize-handle',
        onMouseDown: this.resizeStarted
      }), body);
    },
    getTransform: function() {
      var scrollTop, useHardwareAcceleration;
      scrollTop = this.state.scrollTop;
      useHardwareAcceleration = false;
      if (useHardwareAcceleration) {
        return "translate3d(0px, " + (-scrollTop) + "px, 0px)";
      } else {
        return "translate(0px, " + (-scrollTop) + "px)";
      }
    },
    componentWillMount: function() {
      this.loadBlame();
      this.editor().onDidStopChanging(this.contentsModified);
      return this.editor().onDidSave(this.saved);
    },
    loadBlame: function() {
      this.setState({
        loading: true
      });
      return this.props.projectBlamer.blame(this.editor().getPath(), (function(_this) {
        return function(err, data) {
          if (err) {
            return _this.setState({
              loading: false,
              error: true,
              dirty: false
            });
          } else {
            return _this.setState({
              loading: false,
              error: false,
              dirty: false,
              annotations: data
            });
          }
        };
      })(this));
    },
    contentsModified: function() {
      if (!this.isMounted()) {
        return;
      }
      if (!this.state.dirty) {
        return this.setState({
          dirty: true
        });
      }
    },
    saved: function() {
      if (!this.isMounted()) {
        return;
      }
      if (this.state.visible && this.state.dirty) {
        return this.loadBlame();
      }
    },
    toggle: function() {
      if (this.state.visible) {
        return this.setState({
          visible: false
        });
      } else {
        if (this.state.dirty) {
          this.loadBlame();
        }
        return this.setState({
          visible: true
        });
      }
    },
    componentDidMount: function() {
      this.scrollbar().on('scroll', this.matchScrollPosition);
      return this.showOnlyLastNamesObserver = atom.config.observe('git-blame.showOnlyLastNames', (function(_this) {
        return function(value) {
          return _this.setState({
            showOnlyLastNames: value
          });
        };
      })(this));
    },
    componentWillUnmount: function() {
      this.scrollbar().off('scroll', this.matchScrollPosition);
      this.editor().off('contents-modified', this.contentsModified);
      this.editor().buffer.off('saved', this.saved);
      return this.showOnlyLastNamesObserver.dispose();
    },
    matchScrollPosition: function() {
      return this.setState({
        scrollTop: this.scrollbar().scrollTop()
      });
    },
    resizeStarted: function(_arg) {
      var pageX;
      pageX = _arg.pageX;
      this.setState({
        dragging: true,
        initialPageX: pageX,
        initialWidth: this.state.width
      });
      $(document).on('mousemove', this.onResizeMouseMove);
      return $(document).on('mouseup', this.resizeStopped);
    },
    resizeStopped: function(e) {
      $(document).off('mousemove', this.onResizeMouseMove);
      $(document).off('mouseup', this.resizeStopped);
      this.setState({
        dragging: false
      });
      e.stopPropagation();
      return e.preventDefault();
    },
    onResizeMouseMove: function(e) {
      if (!(this.state.dragging && e.which === 1)) {
        return this.resizeStopped();
      }
      this.setState({
        width: this.state.initialWidth + e.pageX - this.state.initialPageX
      });
      e.stopPropagation();
      return e.preventDefault();
    }
  });

  module.exports = BlameListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi92aWV3cy9ibGFtZS1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGlCQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsdUJBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0MsTUFBTyxZQUFQLEdBSEQsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxLQUFLLENBQUMsU0FKWCxDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBTEosQ0FBQTs7QUFBQSxFQU1BLE9BQXNDLE9BQUEsQ0FBUSxtQkFBUixDQUF0QyxFQUFDLDBCQUFBLGtCQUFELEVBQXFCLHFCQUFBLGFBTnJCLENBQUE7O0FBQUEsRUFTQSx1QkFBQSxHQUEwQixLQUFLLENBQUMsV0FBTixDQUN4QjtBQUFBLElBQUEsU0FBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsRUFBRSxDQUFDLE9BQUgsQ0FBVyxFQUFFLENBQUMsTUFBZCxDQUFiO0FBQUEsTUFDQSxPQUFBLEVBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQURqQjtBQUFBLE1BRUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFGZjtBQUFBLE1BR0EsZ0JBQUEsRUFBa0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUg1QjtBQUFBLE1BSUEsY0FBQSxFQUFnQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBSjFCO0FBQUEsTUFLQSxpQkFBQSxFQUFtQixFQUFFLENBQUMsSUFBSSxDQUFDLFVBTDNCO0tBREY7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

//# sourceURL=/home/nikke/.atom/packages/git-blame/lib/views/blame-list-view.coffee
