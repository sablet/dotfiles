// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
"use strict";
var signaling_1 = require('phosphor/lib/core/signaling');
var contents_1 = require('./contents');
var kernel_1 = require('./kernel');
var session_1 = require('./session');
var terminals_1 = require('./terminals');
var utils_1 = require('./utils');
/**
 * Create a new service manager.
 *
 * @param options - The service manager creation options.
 *
 * @returns A promise that resolves with a service manager.
 */
function createServiceManager(options) {
    if (options === void 0) { options = {}; }
    options.baseUrl = options.baseUrl || utils_1.getBaseUrl();
    options.ajaxSettings = options.ajaxSettings || {};
    if (options.kernelspecs) {
        return Promise.resolve(new ServiceManager(options));
    }
    var kernelOptions = {
        baseUrl: options.baseUrl,
        ajaxSettings: options.ajaxSettings
    };
    return kernel_1.getKernelSpecs(kernelOptions).then(function (specs) {
        options.kernelspecs = specs;
        return new ServiceManager(options);
    });
}
exports.createServiceManager = createServiceManager;
/**
 * An implementation of a services manager.
 */
var ServiceManager = (function () {
    /**
     * Construct a new services provider.
     */
    function ServiceManager(options) {
        this._kernelManager = null;
        this._sessionManager = null;
        this._contentsManager = null;
        this._terminalManager = null;
        this._kernelspecs = null;
        this._isDisposed = false;
        var subOptions = {
            baseUrl: options.baseUrl,
            ajaxSettings: options.ajaxSettings
        };
        this._kernelspecs = options.kernelspecs;
        this._kernelManager = new kernel_1.KernelManager(subOptions);
        this._sessionManager = new session_1.SessionManager(subOptions);
        this._contentsManager = new contents_1.ContentsManager(subOptions);
        this._terminalManager = new terminals_1.TerminalManager(subOptions);
        this._kernelManager.specsChanged.connect(this._onSpecsChanged, this);
        this._sessionManager.specsChanged.connect(this._onSpecsChanged, this);
    }
    Object.defineProperty(ServiceManager.prototype, "isDisposed", {
        /**
         * Test whether the terminal manager is disposed.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._isDisposed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose of the resources used by the manager.
     */
    ServiceManager.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        signaling_1.clearSignalData(this);
    };
    Object.defineProperty(ServiceManager.prototype, "kernelspecs", {
        /**
         * Get kernel specs.
         */
        get: function () {
            return this._kernelspecs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceManager.prototype, "kernels", {
        /**
         * Get kernel manager instance.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._kernelManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceManager.prototype, "sessions", {
        /**
         * Get the session manager instance.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._sessionManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceManager.prototype, "contents", {
        /**
         * Get the contents manager instance.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._contentsManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceManager.prototype, "terminals", {
        /**
         * Get the terminal manager instance.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._terminalManager;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handle a change in kernel specs.
     */
    ServiceManager.prototype._onSpecsChanged = function (sender, args) {
        this._kernelspecs = args;
        this.specsChanged.emit(args);
    };
    return ServiceManager;
}());
exports.ServiceManager = ServiceManager;
// Define the signals for the `ServiceManager` class.
signaling_1.defineSignal(ServiceManager.prototype, 'specsChanged');
