(function() {
  var OutputView, create, getView, view;

  OutputView = require('./views/output-view');

  view = null;

  getView = function() {
    if (view === null) {
      view = new OutputView;
      atom.workspace.addBottomPanel({
        item: view
      });
      view.hide();
    }
    return view;
  };

  create = function() {
    if (view != null) {
      view.reset();
    }
    return getView();
  };

  module.exports = {
    create: create,
    getView: getView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL291dHB1dC12aWV3LW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUFiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sSUFGUCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLElBQUEsSUFBRyxJQUFBLEtBQVEsSUFBWDtBQUNFLE1BQUEsSUFBQSxHQUFPLEdBQUEsQ0FBQSxVQUFQLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBOUIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsSUFBTCxDQUFBLENBRkEsQ0FERjtLQUFBO1dBSUEsS0FMUTtFQUFBLENBSlYsQ0FBQTs7QUFBQSxFQVdBLE1BQUEsR0FBUyxTQUFBLEdBQUE7O01BQ1AsSUFBSSxDQUFFLEtBQU4sQ0FBQTtLQUFBO1dBQ0EsT0FBQSxDQUFBLEVBRk87RUFBQSxDQVhULENBQUE7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUMsUUFBQSxNQUFEO0FBQUEsSUFBUyxTQUFBLE9BQVQ7R0FmakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/git-plus/lib/output-view-manager.coffee
