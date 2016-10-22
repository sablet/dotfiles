(function() {
  var HydrogenKernel;

  module.exports = HydrogenKernel = (function() {
    function HydrogenKernel(_kernel) {
      this._kernel = _kernel;
      this.destroyed = false;
    }

    HydrogenKernel.prototype._assertNotDestroyed = function() {
      if (this.destroyed) {
        throw new Error('HydrogenKernel: operation not allowed because the kernel has been destroyed');
      }
    };

    HydrogenKernel.prototype.onDidDestroy = function(callback) {
      this._assertNotDestroyed();
      return this._kernel.emitter.on('did-destroy', callback);
    };

    HydrogenKernel.prototype.getConnectionFile = function() {
      var connectionFile;
      this._assertNotDestroyed();
      connectionFile = this._kernel.connectionFile;
      if (connectionFile == null) {
        return null;
      }
      return connectionFile;
    };

    return HydrogenKernel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BsdWdpbi1hcGkvaHlkcm9nZW4ta2VybmVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNXLElBQUEsd0JBQUUsT0FBRixHQUFBO0FBQ1QsTUFEVSxJQUFDLENBQUEsVUFBQSxPQUNYLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FBYixDQURTO0lBQUEsQ0FBYjs7QUFBQSw2QkFHQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFHakIsTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFKO0FBQ0ksY0FBVSxJQUFBLEtBQUEsQ0FBTSw2RUFBTixDQUFWLENBREo7T0FIaUI7SUFBQSxDQUhyQixDQUFBOztBQUFBLDZCQVNBLFlBQUEsR0FBYyxTQUFDLFFBQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFqQixDQUFvQixhQUFwQixFQUFtQyxRQUFuQyxDQUFQLENBRlU7SUFBQSxDQVRkLENBQUE7O0FBQUEsNkJBYUEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxjQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUQxQixDQUFBO0FBRUEsTUFBQSxJQUFPLHNCQUFQO0FBR0ksZUFBTyxJQUFQLENBSEo7T0FGQTtBQU1BLGFBQU8sY0FBUCxDQVBlO0lBQUEsQ0FibkIsQ0FBQTs7MEJBQUE7O01BRkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/plugin-api/hydrogen-kernel.coffee
