(function() {
  var JumpyView;

  JumpyView = require('./jumpy-view');

  module.exports = {
    jumpyView: null,
    config: {
      fontSize: {
        description: 'The font size of jumpy labels.',
        type: 'number',
        "default": .75,
        minimum: 0,
        maximum: 1
      },
      highContrast: {
        description: 'This will display a high contrast label, usually green.  It is dynamic per theme.',
        type: 'boolean',
        "default": false
      },
      useHomingBeaconEffectOnJumps: {
        description: 'This will animate a short lived homing beacon upon jump.  It is *temporarily* not working due to architectural changes in Atom.',
        type: 'boolean',
        "default": true
      },
      matchPattern: {
        description: 'Jumpy will create labels based on this pattern.',
        type: 'string',
        "default": '([A-Z]+([0-9a-z])*)|[a-z0-9]{2,}'
      }
    },
    activate: function(state) {
      return this.jumpyView = new JumpyView(state.jumpyViewState);
    },
    deactivate: function() {
      this.jumpyView.destroy();
      return this.jumpyView = null;
    },
    serialize: function() {
      return {
        jumpyViewState: this.jumpyView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvanVtcHkvbGliL2p1bXB5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLFNBQUEsRUFBVyxJQUFYO0FBQUEsSUFDQSxNQUFBLEVBQ0k7QUFBQSxNQUFBLFFBQUEsRUFDSTtBQUFBLFFBQUEsV0FBQSxFQUFhLGdDQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEdBRlQ7QUFBQSxRQUdBLE9BQUEsRUFBUyxDQUhUO0FBQUEsUUFJQSxPQUFBLEVBQVMsQ0FKVDtPQURKO0FBQUEsTUFNQSxZQUFBLEVBQ0k7QUFBQSxRQUFBLFdBQUEsRUFBYSxtRkFBYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BUEo7QUFBQSxNQVdBLDRCQUFBLEVBQ0k7QUFBQSxRQUFBLFdBQUEsRUFBYSxpSUFBYjtBQUFBLFFBR0EsSUFBQSxFQUFNLFNBSE47QUFBQSxRQUlBLFNBQUEsRUFBUyxJQUpUO09BWko7QUFBQSxNQWlCQSxZQUFBLEVBQ0k7QUFBQSxRQUFBLFdBQUEsRUFBYSxpREFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxrQ0FGVDtPQWxCSjtLQUZKO0FBQUEsSUF3QkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ04sSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxTQUFBLENBQVUsS0FBSyxDQUFDLGNBQWhCLEVBRFg7SUFBQSxDQXhCVjtBQUFBLElBMkJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FGTDtJQUFBLENBM0JaO0FBQUEsSUErQkEsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNQO0FBQUEsUUFBQSxjQUFBLEVBQWdCLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFBLENBQWhCO1FBRE87SUFBQSxDQS9CWDtHQUhKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/nikke/.atom/packages/jumpy/lib/jumpy.coffee
