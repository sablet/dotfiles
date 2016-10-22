// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
"use strict";
var signaling_1 = require('phosphor/lib/core/signaling');
var json_1 = require('./json');
/**
 * A mock terminal session manager.
 */
var MockTerminalManager = (function () {
    /**
     * Construct a new mock terminal manager.
     */
    function MockTerminalManager() {
        this._running = [];
        this._isDisposed = false;
        // no-op
    }
    Object.defineProperty(MockTerminalManager.prototype, "isDisposed", {
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
    MockTerminalManager.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        signaling_1.clearSignalData(this);
        this._running = [];
    };
    /**
     * Create a new terminal session or connect to an existing session.
     */
    MockTerminalManager.prototype.create = function (options) {
        if (options === void 0) { options = {}; }
        var name = options.name;
        if (name in Private.running) {
            return Promise.resolve(Private.running[name]);
        }
        if (!name) {
            var i = 1;
            while (String(i) in Private.running) {
                i++;
            }
            name = String(i);
        }
        var session = new MockTerminalSession(name);
        Private.running[name] = session;
        return Promise.resolve(session);
    };
    /**
     * Shut down a terminal session by name.
     */
    MockTerminalManager.prototype.shutdown = function (name) {
        if (!(name in Private.running)) {
            return Promise.resolve(void 0);
        }
        Private.running[name].shutdown();
        return Promise.resolve(void 0);
    };
    /**
     * Get the list of models for the terminals running on the server.
     */
    MockTerminalManager.prototype.listRunning = function () {
        var models = [];
        for (var name_1 in Private.running) {
            models.push({ name: name_1 });
        }
        if (!json_1.deepEqual(models, this._running)) {
            this._running = models.slice();
            this.runningChanged.emit(models);
        }
        return Promise.resolve(models);
    };
    return MockTerminalManager;
}());
exports.MockTerminalManager = MockTerminalManager;
/**
 * A mock implementation of a terminal interface.
 */
var MockTerminalSession = (function () {
    /**
     * Construct a new terminal session.
     */
    function MockTerminalSession(name) {
        this._isDisposed = false;
        this._name = name;
        this._url = "mockterminals/{name}";
    }
    Object.defineProperty(MockTerminalSession.prototype, "name", {
        /**
         * Get the name of the terminal session.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockTerminalSession.prototype, "url", {
        /**
         * Get the websocket url used by the terminal session.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockTerminalSession.prototype, "isDisposed", {
        /**
         * Test whether the session is disposed.
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
     * Dispose of the resources held by the session.
     */
    MockTerminalSession.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        delete Private.running[this._name];
        signaling_1.clearSignalData(this);
    };
    /**
     * Send a message to the terminal session.
     */
    MockTerminalSession.prototype.send = function (message) {
        // Echo the message back on stdout.
        message.content = [(message.type + ": " + message.content)];
        message.type = 'stdout';
        this.messageReceived.emit(message);
    };
    /**
     * Shut down the terminal session.
     */
    MockTerminalSession.prototype.shutdown = function () {
        this.dispose();
        return Promise.resolve(void 0);
    };
    return MockTerminalSession;
}());
exports.MockTerminalSession = MockTerminalSession;
// Define the signals for the `MockTerminalManager` class.
signaling_1.defineSignal(MockTerminalManager.prototype, 'runningChanged');
// Define the signals for the `MockTerminalSession` class.
signaling_1.defineSignal(MockTerminalSession.prototype, 'messageReceived');
/**
 * A namespace for private data.
 */
var Private;
(function (Private) {
    /**
     * A mapping of running terminals by name.
     */
    Private.running = Object.create(null);
})(Private || (Private = {}));
