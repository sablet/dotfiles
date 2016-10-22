// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CLOSE_NORMAL = 1000;
function overrideWebSocket() {
    // Override the builtin websocket
    if (typeof window === 'undefined') {
        global.WebSocket = MockSocket;
    }
    else {
        window.WebSocket = MockSocket;
    }
}
exports.overrideWebSocket = overrideWebSocket;
/**
 * Do something in the future ensuring total ordering wrt to Promises.
 */
function doLater(cb) {
    Promise.resolve().then(cb);
}
/**
 * Base class for a mock socket implementation.
 */
var SocketBase = (function () {
    function SocketBase() {
        this._readyState = SocketBase.CLOSED;
        this._onClose = null;
        this._onMessage = null;
        this._onError = null;
        this._onOpen = null;
    }
    Object.defineProperty(SocketBase.prototype, "readyState", {
        /**
         * Get the current ready state.
         */
        get: function () {
            return this._readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketBase.prototype, "onopen", {
        /**
         * Assign a callback for the websocket opening.
         */
        set: function (cb) {
            this._onOpen = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketBase.prototype, "onclose", {
        /**
         * Assign a callback for the websocket closing.
         */
        set: function (cb) {
            this._onClose = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketBase.prototype, "onerror", {
        /**
         * Assign a callback for the websocket error condition.
         */
        set: function (cb) {
            this._onError = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketBase.prototype, "onmessage", {
        /**
         * Assign a callback for the websocket incoming message.
         */
        set: function (cb) {
            this._onMessage = cb;
        },
        enumerable: true,
        configurable: true
    });
    // Implementation details
    /**
     * Trigger an open event on the next event loop run.
     */
    SocketBase.prototype.triggerOpen = function () {
        var _this = this;
        this._readyState = SocketBase.CONNECTING;
        doLater(function () {
            _this._readyState = SocketBase.OPEN;
            var onOpen = _this._onOpen;
            if (onOpen)
                onOpen();
        });
    };
    /**
     * Trigger a close event on the next event loop run.
     */
    SocketBase.prototype.triggerClose = function (evt) {
        var _this = this;
        this._readyState = SocketBase.CLOSING;
        doLater(function () {
            _this._readyState = SocketBase.CLOSED;
            var onClose = _this._onClose;
            if (onClose)
                onClose(evt);
        });
    };
    /**
     * Trigger an error event on the next event loop run.
     */
    SocketBase.prototype.triggerError = function (msg) {
        var _this = this;
        doLater(function () {
            var onError = _this._onError;
            if (onError)
                onError({ message: msg });
        });
    };
    /**
     * Trigger a message event on the next event loop run.
     */
    SocketBase.prototype.triggerMessage = function (msg) {
        var _this = this;
        if (this._readyState != SocketBase.OPEN) {
            throw Error('Websocket not connected');
        }
        doLater(function () {
            var onMessage = _this._onMessage;
            var isOpen = _this._readyState === SocketBase.OPEN;
            if (onMessage && isOpen)
                onMessage({ data: msg });
        });
    };
    SocketBase.CONNECTING = 0; // The connection is not yet open.
    SocketBase.OPEN = 1; // The connection is open and ready to communicate.
    SocketBase.CLOSING = 2; // The connection is in the process of closing.
    SocketBase.CLOSED = 3; // The connection is closed or couldn't be opened.
    return SocketBase;
}());
exports.SocketBase = SocketBase;
/**
 * Mock Websocket class that talks to a mock server.
 */
var MockSocket = (function (_super) {
    __extends(MockSocket, _super);
    /**
     * Create a new Mock Websocket.
     * Look for an connect to a server on the same url.
     */
    function MockSocket(url) {
        _super.call(this);
        this._binaryType = 'arraybuffer';
        this._server = MockSocketServer.servers[url];
        if (this._server === void 0) {
            this._server = new MockSocketServer(url);
            MockSocketServer.servers[url] = this._server;
        }
        this._server.connect(this);
    }
    Object.defineProperty(MockSocket.prototype, "binaryType", {
        /**
         * Get the current binary data type.
         */
        get: function () {
            return this._binaryType;
        },
        /**
         * Set the binary data type.
         */
        set: function (type) {
            this._binaryType = type;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Send a message to the server.
     */
    MockSocket.prototype.send = function (msg) {
        this._server.triggerMessage(msg);
    };
    /**
     * Close the connection to the server.
     */
    MockSocket.prototype.close = function (code, reason) {
        if (this.readyState === SocketBase.CLOSED) {
            return;
        }
        if (code === void 0) {
            code = CLOSE_NORMAL;
        }
        if (reason === void 0) {
            reason = '';
        }
        var evt = { code: code, reason: reason, wasClean: code === CLOSE_NORMAL };
        this.triggerClose(evt);
        this._server.closeSocket(this, evt);
    };
    return MockSocket;
}(SocketBase));
exports.MockSocket = MockSocket;
/**
 * Mock Websocket server.
 */
var MockSocketServer = (function (_super) {
    __extends(MockSocketServer, _super);
    /**
     * Create a new mock web socket server.
     */
    function MockSocketServer(url) {
        _super.call(this);
        this._onWSClose = null;
        this._connections = [];
        this._url = '';
        this._url = url;
        this.triggerOpen();
    }
    Object.defineProperty(MockSocketServer.prototype, "url", {
        /**
         * Get the server url.
         *
         * Read-only.
         */
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockSocketServer.prototype, "onWSClose", {
        /**
       * Assign a callback for the websocket closing.
       */
        set: function (cb) {
            this._onWSClose = cb;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handle a connection from a mock websocket.
     */
    MockSocketServer.prototype.connect = function (ws) {
        var _this = this;
        ws.triggerOpen();
        this._connections.push(ws);
        doLater(function () {
            var callback = MockSocketServer.onConnect;
            if (callback)
                callback(_this);
        });
    };
    /**
     * Handle a closing websocket.
     */
    MockSocketServer.prototype.closeSocket = function (ws, evt) {
        var _this = this;
        var i = this._connections.indexOf(ws);
        if (i !== -1) {
            this._connections.splice(i, 1);
            doLater(function () {
                var onClose = _this._onWSClose;
                if (onClose)
                    onClose(ws, evt);
            });
        }
    };
    /**
     * Send a message to all connected web sockets.
     */
    MockSocketServer.prototype.send = function (msg) {
        this._connections.forEach(function (ws) {
            if (ws.readyState == SocketBase.OPEN)
                ws.triggerMessage(msg);
        });
    };
    /**
     * Trigger an error for all connected web sockets.
     */
    MockSocketServer.prototype.triggerError = function (msg) {
        _super.prototype.triggerError.call(this, msg);
        this._connections.forEach(function (ws) {
            ws.triggerError(msg);
        });
    };
    /**
     * Map of running servers by url.
     */
    MockSocketServer.servers = Object.create(null);
    /**
     * Callback for when a server is started.
     */
    MockSocketServer.onConnect = null;
    return MockSocketServer;
}(SocketBase));
exports.MockSocketServer = MockSocketServer;
