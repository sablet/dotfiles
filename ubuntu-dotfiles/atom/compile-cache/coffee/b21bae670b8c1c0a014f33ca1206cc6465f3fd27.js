(function() {
  var StatusView;

  module.exports = StatusView = (function() {
    function StatusView(language) {
      this.language = language;
      this.element = document.createElement('div');
      this.element.classList.add('hydrogen');
      this.element.classList.add('status');
      this.element.innerText = this.language + ': starting';
    }

    StatusView.prototype.setStatus = function(status) {
      return this.element.innerText = this.language + ': ' + status;
    };

    StatusView.prototype.destroy = function() {
      this.element.innerHTML = '';
      return this.element.remove();
    };

    return StatusView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0YXR1cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVXLElBQUEsb0JBQUUsUUFBRixHQUFBO0FBQ1QsTUFEVSxJQUFDLENBQUEsV0FBQSxRQUNYLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixVQUF2QixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFFBQXZCLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLElBQUMsQ0FBQSxRQUFELEdBQVksWUFKakMsQ0FEUztJQUFBLENBQWI7O0FBQUEseUJBUUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBWixHQUFtQixPQURqQztJQUFBLENBUlgsQ0FBQTs7QUFBQSx5QkFZQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUIsRUFBckIsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBLEVBRks7SUFBQSxDQVpULENBQUE7O3NCQUFBOztNQUhKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/status-view.coffee
