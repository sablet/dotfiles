(function() {
  var Breakpoint;

  module.exports = Breakpoint = (function() {
    Breakpoint.prototype.decoration = null;

    function Breakpoint(filename, lineNumber) {
      this.filename = filename;
      this.lineNumber = lineNumber;
    }

    Breakpoint.prototype.toCommand = function() {
      return "b " + this.filename + ":" + this.lineNumber;
    };

    return Breakpoint;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvcHl0aG9uLWRlYnVnZ2VyL2xpYi9icmVha3BvaW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHlCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQ2EsSUFBQSxvQkFBRSxRQUFGLEVBQWEsVUFBYixHQUFBO0FBQTBCLE1BQXpCLElBQUMsQ0FBQSxXQUFBLFFBQXdCLENBQUE7QUFBQSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBMUI7SUFBQSxDQURiOztBQUFBLHlCQUVBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVIsR0FBbUIsR0FBbkIsR0FBeUIsSUFBQyxDQUFBLFdBRGpCO0lBQUEsQ0FGWCxDQUFBOztzQkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/nikke/.atom/packages/python-debugger/lib/breakpoint.coffee
