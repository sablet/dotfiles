(function() {
  var HydrogenProvider;

  module.exports = HydrogenProvider = (function() {
    function HydrogenProvider(_hydrogen) {
      this._hydrogen = _hydrogen;
      this._happy = true;
    }

    HydrogenProvider.prototype.onDidChangeKernel = function(callback) {
      return this._hydrogen.emitter.on('did-change-kernel', function(kernel) {
        if (kernel != null) {
          return callback(kernel.getPluginWrapper());
        } else {
          return callback(null);
        }
      });
    };

    HydrogenProvider.prototype.getActiveKernel = function() {
      if (!this._hydrogen.kernel) {
        return null;
      }
      return this._hydrogen.kernel.getPluginWrapper();
    };

    return HydrogenProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BsdWdpbi1hcGkvaHlkcm9nZW4tcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNXLElBQUEsMEJBQUUsU0FBRixHQUFBO0FBQ1QsTUFEVSxJQUFDLENBQUEsWUFBQSxTQUNYLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBVixDQURTO0lBQUEsQ0FBYjs7QUFBQSwrQkFHQSxpQkFBQSxHQUFtQixTQUFDLFFBQUQsR0FBQTthQUNmLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQW5CLENBQXNCLG1CQUF0QixFQUEyQyxTQUFDLE1BQUQsR0FBQTtBQUN2QyxRQUFBLElBQUcsY0FBSDtpQkFDSSxRQUFBLENBQVMsTUFBTSxDQUFDLGdCQUFQLENBQUEsQ0FBVCxFQURKO1NBQUEsTUFBQTtpQkFHSSxRQUFBLENBQVMsSUFBVCxFQUhKO1NBRHVDO01BQUEsQ0FBM0MsRUFEZTtJQUFBLENBSG5CLENBQUE7O0FBQUEsK0JBVUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDYixNQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsU0FBUyxDQUFDLE1BQWxCO0FBQ0ksZUFBTyxJQUFQLENBREo7T0FBQTtBQUdBLGFBQU8sSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWxCLENBQUEsQ0FBUCxDQUphO0lBQUEsQ0FWakIsQ0FBQTs7NEJBQUE7O01BRkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/plugin-api/hydrogen-provider.coffee
