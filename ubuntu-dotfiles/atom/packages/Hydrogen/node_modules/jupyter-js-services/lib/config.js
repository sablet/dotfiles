// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
"use strict";
var utils = require('./utils');
/**
 * The url for the config service.
 */
var SERVICE_CONFIG_URL = 'api/config';
/**
 * Create a config section.
 *
 * @returns A Promise that is fulfilled with the config section is loaded.
 */
function getConfigSection(options) {
    var section = new ConfigSection(options);
    return section.load().then(function () {
        return section;
    });
}
exports.getConfigSection = getConfigSection;
/**
 * Implementation of the Configurable data section.
 */
var ConfigSection = (function () {
    /**
     * Construct a new config section.
     */
    function ConfigSection(options) {
        this._url = 'unknown';
        this._data = null;
        this._ajaxSettings = null;
        var baseUrl = options.baseUrl || utils.getBaseUrl();
        this.ajaxSettings = options.ajaxSettings || {};
        this._url = utils.urlPathJoin(baseUrl, SERVICE_CONFIG_URL, encodeURIComponent(options.name));
    }
    Object.defineProperty(ConfigSection.prototype, "ajaxSettings", {
        /**
         * Get a copy of the default ajax settings for the section.
         */
        get: function () {
            return utils.copy(this._ajaxSettings);
        },
        /**
         * Set the default ajax settings for the section.
         */
        set: function (value) {
            this._ajaxSettings = utils.copy(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigSection.prototype, "data", {
        /**
         * Get the data for this section.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Load the initial data for this section.
     *
     * #### Notes
     * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/config).
     *
     * The promise is fulfilled on a valid response and rejected otherwise.
     */
    ConfigSection.prototype.load = function () {
        var _this = this;
        var ajaxSettings = this.ajaxSettings;
        ajaxSettings.method = 'GET';
        ajaxSettings.dataType = 'json';
        ajaxSettings.cache = false;
        return utils.ajaxRequest(this._url, ajaxSettings).then(function (success) {
            if (success.xhr.status !== 200) {
                return utils.makeAjaxError(success);
            }
            _this._data = success.data;
        });
    };
    /**
     * Modify the stored config values.
     *
     * #### Notes
     * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/config).
     *
     * The promise is fulfilled on a valid response and rejected otherwise.
     *
     * Updates the local data immediately, sends the change to the server,
     * and updates the local data with the response, and fulfils the promise
     * with that data.
     */
    ConfigSection.prototype.update = function (newdata) {
        var _this = this;
        this._data = utils.extend(this._data, newdata);
        var ajaxSettings = this.ajaxSettings;
        ajaxSettings.method = 'PATCH';
        ajaxSettings.data = JSON.stringify(newdata);
        ajaxSettings.dataType = 'json';
        ajaxSettings.contentType = 'application/json';
        return utils.ajaxRequest(this._url, ajaxSettings).then(function (success) {
            if (success.xhr.status !== 200) {
                return utils.makeAjaxError(success);
            }
            _this._data = success.data;
            return _this._data;
        });
    };
    return ConfigSection;
}());
/**
 * Configurable object with defaults.
 */
var ConfigWithDefaults = (function () {
    /**
     * Create a new config with defaults.
     */
    function ConfigWithDefaults(options) {
        this._section = null;
        this._defaults = null;
        this._className = '';
        this._section = options.section;
        this._defaults = options.defaults || {};
        this._className = options.className || '';
    }
    /**
     * Get data from the config section or fall back to defaults.
     */
    ConfigWithDefaults.prototype.get = function (key) {
        return this._classData()[key] || this._defaults[key];
    };
    /**
     * Set a config value.
     *
     * #### Notes
     * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/config).
     *
     * The promise is fulfilled on a valid response and rejected otherwise.
     *
     * Sends the update to the server, and changes our local copy of the data
     * immediately.
     */
    ConfigWithDefaults.prototype.set = function (key, value) {
        var d = {};
        d[key] = value;
        if (this._className) {
            var d2 = {};
            d2[this._className] = d;
            return this._section.update(d2);
        }
        else {
            return this._section.update(d);
        }
    };
    /**
     * Get data from the Section with our classname, if available.
     *
     * #### Notes
     * If we have no classname, get all of the data in the Section
     */
    ConfigWithDefaults.prototype._classData = function () {
        if (this._className) {
            return this._section.data[this._className] || {};
        }
        else {
            return this._section.data;
        }
    };
    return ConfigWithDefaults;
}());
exports.ConfigWithDefaults = ConfigWithDefaults;
