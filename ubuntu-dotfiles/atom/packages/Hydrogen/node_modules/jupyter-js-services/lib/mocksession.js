"use strict";
var utils_1 = require('./utils');
var signaling_1 = require('phosphor/lib/core/signaling');
var json_1 = require('./json');
var mockkernel_1 = require('./mockkernel');
/**
 * A mock session object that uses a mock kernel by default.
 */
var MockSession = (function () {
    function MockSession(model) {
        this.ajaxSettings = {};
        this._isDisposed = false;
        this._kernel = null;
        if (!model) {
            model = {
                id: utils_1.uuid(),
                notebook: {
                    path: ''
                },
                kernel: {}
            };
        }
        this.id = model.id;
        this.path = model.notebook.path;
        this._kernel = new mockkernel_1.MockKernel(model.kernel);
        this._kernel.statusChanged.connect(this.onKernelStatus, this);
        this._kernel.unhandledMessage.connect(this.onUnhandledMessage, this);
        Private.runningSessions[this.id] = this;
    }
    Object.defineProperty(MockSession.prototype, "kernel", {
        /**
         * Get the session kernel object.
         */
        get: function () {
            return this._kernel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockSession.prototype, "model", {
        /**
         * Get the session model.
         */
        get: function () {
            return {
                id: this.id,
                kernel: this.kernel.model,
                notebook: {
                    path: this.path
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockSession.prototype, "status", {
        /**
         * The current status of the session.
         */
        get: function () {
            return this._kernel.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockSession.prototype, "isDisposed", {
        /**
         * Test whether the session has been disposed.
         *
         * #### Notes
         * This is a read-only property which is always safe to access.
         */
        get: function () {
            return this._isDisposed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose of the resources held by the session.
     */
    MockSession.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        delete Private.runningSessions[this.id];
    };
    /**
     * Rename or move the session.
     */
    MockSession.prototype.rename = function (path) {
        this.path = path;
        return Promise.resolve(void 0);
    };
    /**
     * Change the kernel.
     */
    MockSession.prototype.changeKernel = function (options) {
        this._kernel.dispose();
        this._kernel = new mockkernel_1.MockKernel(options);
        this.kernelChanged.emit(this._kernel);
        return Promise.resolve(this._kernel);
    };
    /**
     * Kill the kernel and shutdown the session.
     */
    MockSession.prototype.shutdown = function () {
        this._kernel.dispose();
        this._kernel = null;
        this.sessionDied.emit(void 0);
        return Promise.resolve(void 0);
    };
    /**
     * Handle to changes in the Kernel status.
     */
    MockSession.prototype.onKernelStatus = function (sender, state) {
        this.statusChanged.emit(state);
    };
    /**
     * Handle unhandled kernel messages.
     */
    MockSession.prototype.onUnhandledMessage = function (sender, msg) {
        this.unhandledMessage.emit(msg);
    };
    return MockSession;
}());
exports.MockSession = MockSession;
/**
 *  A mock session manager object.
 */
var MockSessionManager = (function () {
    function MockSessionManager() {
        this._isDisposed = false;
        this._running = [];
    }
    Object.defineProperty(MockSessionManager.prototype, "isDisposed", {
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
    MockSessionManager.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        signaling_1.clearSignalData(this);
        this._running = [];
    };
    /**
     * Get the available kernel specs.
     */
    MockSessionManager.prototype.getSpecs = function (options) {
        return Promise.resolve(mockkernel_1.KERNELSPECS);
    };
    /*
     * Get the running sessions.
     */
    MockSessionManager.prototype.listRunning = function (options) {
        var models = [];
        for (var id in Private.runningSessions) {
            var session = Private.runningSessions[id];
            models.push(session.model);
        }
        if (!json_1.deepEqual(models, this._running)) {
            this._running = models.slice();
            this.runningChanged.emit(models);
        }
        return Promise.resolve(models);
    };
    /**
     * Start a new session.
     */
    MockSessionManager.prototype.startNew = function (options, id) {
        var session = new MockSession({
            id: id,
            notebook: {
                path: options.path || ''
            },
            kernel: {
                id: options.kernelId,
                name: options.kernelName
            }
        });
        return Promise.resolve(session);
    };
    /**
     * Find a session by id.
     */
    MockSessionManager.prototype.findById = function (id, options) {
        if (id in Private.runningSessions) {
            return Promise.resolve(Private.runningSessions[id].model);
        }
        return Promise.resolve(void 0);
    };
    /**
     * Find a session by path.
     */
    MockSessionManager.prototype.findByPath = function (path, options) {
        for (var id in Private.runningSessions) {
            var session = Private.runningSessions[id];
            if (session.path === path) {
                return Promise.resolve(session.model);
            }
        }
        return Promise.resolve(void 0);
    };
    /**
     * Connect to a running session.
     */
    MockSessionManager.prototype.connectTo = function (id, options) {
        if (id in Private.runningSessions) {
            return Promise.resolve(Private.runningSessions[id]);
        }
        return this.startNew(options, id);
    };
    MockSessionManager.prototype.shutdown = function (id, options) {
        var session = Private.runningSessions[id];
        if (!session) {
            return Promise.reject("No running sessions with id: " + id);
        }
        return session.shutdown();
    };
    return MockSessionManager;
}());
exports.MockSessionManager = MockSessionManager;
// Define the signals for the `MockSession` class.
signaling_1.defineSignal(MockSession.prototype, 'sessionDied');
signaling_1.defineSignal(MockSession.prototype, 'kernelChanged');
signaling_1.defineSignal(MockSession.prototype, 'statusChanged');
signaling_1.defineSignal(MockSession.prototype, 'iopubMessage');
signaling_1.defineSignal(MockSession.prototype, 'unhandledMessage');
signaling_1.defineSignal(MockSession.prototype, 'pathChanged');
// Define the signals for the `MockSessionManager` class.
signaling_1.defineSignal(MockSessionManager.prototype, 'specsChanged');
signaling_1.defineSignal(MockSessionManager.prototype, 'runningChanged');
/**
 * A namespace for notebook session private data.
 */
var Private;
(function (Private) {
    /**
     * A module private store for running mock sessions.
     */
    Private.runningSessions = Object.create(null);
})(Private || (Private = {}));
