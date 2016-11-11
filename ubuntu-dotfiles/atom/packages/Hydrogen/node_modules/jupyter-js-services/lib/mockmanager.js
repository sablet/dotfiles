// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
"use strict";
var signaling_1 = require('phosphor/lib/core/signaling');
var mockcontents_1 = require('./mockcontents');
var mockkernel_1 = require('./mockkernel');
var mocksession_1 = require('./mocksession');
var mockterminals_1 = require('./mockterminals');
/**
 * A mock implementation of a services manager.
 */
var MockServiceManager = (function () {
    /**
     * Construct a new services provider.
     */
    function MockServiceManager() {
        this._kernelManager = null;
        this._sessionManager = null;
        this._contentsManager = null;
        this._terminalManager = null;
        this._kernelspecs = null;
        this._isDisposed = false;
        this._kernelspecs = mockkernel_1.KERNELSPECS;
        this._kernelManager = new mockkernel_1.MockKernelManager();
        this._sessionManager = new mocksession_1.MockSessionManager();
        this._contentsManager = new mockcontents_1.MockContentsManager();
        this._terminalManager = new mockterminals_1.MockTerminalManager();
    }
    Object.defineProperty(MockServiceManager.prototype, "isDisposed", {
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
    MockServiceManager.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        signaling_1.clearSignalData(this);
    };
    Object.defineProperty(MockServiceManager.prototype, "kernelspecs", {
        /**
         * Get kernel specs.
         */
        get: function () {
            return this._kernelspecs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockServiceManager.prototype, "kernels", {
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
    Object.defineProperty(MockServiceManager.prototype, "sessions", {
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
    Object.defineProperty(MockServiceManager.prototype, "contents", {
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
    Object.defineProperty(MockServiceManager.prototype, "terminals", {
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
    return MockServiceManager;
}());
exports.MockServiceManager = MockServiceManager;
// Define the signals for the `MockServiceManager` class.
signaling_1.defineSignal(MockServiceManager.prototype, 'specsChanged');
