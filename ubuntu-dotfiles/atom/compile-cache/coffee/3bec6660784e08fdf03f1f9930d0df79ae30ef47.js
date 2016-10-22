(function() {
  var Config, CustomListView, SelectListView, WSKernel, WSKernelPicker, services, tildify, uuid, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  _ = require('lodash');

  tildify = require('tildify');

  Config = require('./config');

  services = require('./jupyter-js-services-shim');

  WSKernel = require('./ws-kernel');

  uuid = require('uuid');

  CustomListView = (function(_super) {
    __extends(CustomListView, _super);

    function CustomListView() {
      return CustomListView.__super__.constructor.apply(this, arguments);
    }

    CustomListView.prototype.initialize = function(emptyMessage, onConfirmed) {
      this.emptyMessage = emptyMessage;
      this.onConfirmed = onConfirmed;
      CustomListView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    CustomListView.prototype.getFilterKey = function() {
      return 'name';
    };

    CustomListView.prototype.destroy = function() {
      return this.cancel();
    };

    CustomListView.prototype.viewForItem = function(item) {
      var element;
      element = document.createElement('li');
      element.textContent = item.name;
      return element;
    };

    CustomListView.prototype.cancelled = function() {
      var _ref;
      if ((_ref = this.panel) != null) {
        _ref.destroy();
      }
      return this.panel = null;
    };

    CustomListView.prototype.confirmed = function(item) {
      if (typeof this.onConfirmed === "function") {
        this.onConfirmed(item);
      }
      return this.cancel();
    };

    CustomListView.prototype.getEmptyMessage = function() {
      return this.emptyMessage;
    };

    return CustomListView;

  })(SelectListView);

  module.exports = WSKernelPicker = (function() {
    function WSKernelPicker(onChosen) {
      this._onChosen = onChosen;
    }

    WSKernelPicker.prototype.toggle = function(_grammar, _kernelSpecFilter) {
      var gatewayListing, gateways;
      this._grammar = _grammar;
      this._kernelSpecFilter = _kernelSpecFilter;
      gateways = Config.getJson('gateways', []);
      if (_.isEmpty(gateways)) {
        atom.notifications.addError('No remote kernel gateways available', {
          description: 'Use the Hydrogen package settings to specify the list of remote servers. Hydrogen can use remote kernels on either a Jupyter Kernel Gateway or Jupyter notebook server.'
        });
        return;
      }
      this._path = atom.workspace.getActiveTextEditor().getPath() + '-' + uuid.v4();
      gatewayListing = new CustomListView('No gateways available', this.onGateway.bind(this));
      this.previouslyFocusedElement = gatewayListing.previouslyFocusedElement;
      gatewayListing.setItems(gateways);
      return gatewayListing.setError('Select a gateway');
    };

    WSKernelPicker.prototype.onGateway = function(gatewayInfo) {
      return services.getKernelSpecs(gatewayInfo.options).then((function(_this) {
        return function(specModels) {
          var kernelNames, kernelSpecs, sessionListing;
          kernelSpecs = _.filter(specModels.kernelspecs, function(specModel) {
            return _this._kernelSpecFilter(specModel.spec);
          });
          kernelNames = _.map(kernelSpecs, function(specModel) {
            return specModel.name;
          });
          sessionListing = new CustomListView('No sessions available', _this.onSession.bind(_this));
          sessionListing.previouslyFocusedElement = _this.previouslyFocusedElement;
          sessionListing.setLoading('Loading sessions...');
          return services.listRunningSessions(gatewayInfo.options).then(function(sessionModels) {
            var items;
            sessionModels = sessionModels.filter(function(model) {
              var name, _ref;
              name = (_ref = model.kernel) != null ? _ref.name : void 0;
              if (name != null) {
                return __indexOf.call(kernelNames, name) >= 0;
              } else {
                return true;
              }
            });
            items = sessionModels.map(function(model) {
              var name, _ref;
              if (((_ref = model.notebook) != null ? _ref.path : void 0) != null) {
                name = tildify(model.notebook.path);
              } else {
                name = "Session " + model.id;
              }
              return {
                name: name,
                model: model,
                options: gatewayInfo.options
              };
            });
            items.unshift({
              name: '[new session]',
              model: null,
              options: gatewayInfo.options,
              kernelSpecs: kernelSpecs
            });
            return sessionListing.setItems(items);
          }, function(err) {
            return _this.onSession({
              name: '[new session]',
              model: null,
              options: gatewayInfo.options,
              kernelSpecs: kernelSpecs
            });
          });
        };
      })(this), function(err) {
        return atom.notifications.addError('Connection to gateway failed');
      });
    };

    WSKernelPicker.prototype.onSession = function(sessionInfo) {
      var items, kernelListing;
      if (sessionInfo.model == null) {
        kernelListing = new CustomListView('No kernel specs available', this.startSession.bind(this));
        kernelListing.previouslyFocusedElement = this.previouslyFocusedElement;
        items = _.map(sessionInfo.kernelSpecs, (function(_this) {
          return function(specModel) {
            var options;
            options = Object.assign({}, sessionInfo.options);
            options.kernelName = specModel.name;
            options.path = _this._path;
            return {
              name: specModel.spec.display_name,
              options: options
            };
          };
        })(this));
        kernelListing.setItems(items);
        if (sessionInfo.name == null) {
          return kernelListing.setError('This gateway does not support listing sessions');
        }
      } else {
        return services.connectToSession(sessionInfo.model.id, sessionInfo.options).then(this.onSessionChosen.bind(this));
      }
    };

    WSKernelPicker.prototype.startSession = function(sessionInfo) {
      return services.startNewSession(sessionInfo.options).then(this.onSessionChosen.bind(this));
    };

    WSKernelPicker.prototype.onSessionChosen = function(session) {
      return session.kernel.getKernelSpec().then((function(_this) {
        return function(kernelSpec) {
          var kernel;
          kernel = new WSKernel(kernelSpec, _this._grammar, session);
          return _this._onChosen(kernel);
        };
      })(this));
    };

    return WSKernelPicker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvbmlra2UvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC1waWNrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRGQUFBO0lBQUE7O3lKQUFBOztBQUFBLEVBQUMsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUixFQUFsQixjQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUpULENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDRCQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQU5YLENBQUE7O0FBQUEsRUFPQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FQUCxDQUFBOztBQUFBLEVBU007QUFDRixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNkJBQUEsVUFBQSxHQUFZLFNBQUUsWUFBRixFQUFpQixXQUFqQixHQUFBO0FBQ1IsTUFEUyxJQUFDLENBQUEsZUFBQSxZQUNWLENBQUE7QUFBQSxNQUR3QixJQUFDLENBQUEsY0FBQSxXQUN6QixDQUFBO0FBQUEsTUFBQSxnREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FEQSxDQUFBOztRQUVBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7T0FGVjtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FIQSxDQUFBO2FB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

//# sourceURL=/home/nikke/.atom/packages/Hydrogen/lib/ws-kernel-picker.coffee
