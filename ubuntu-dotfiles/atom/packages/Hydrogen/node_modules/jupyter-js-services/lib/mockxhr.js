// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';
// Mock implementation of XMLHttpRequest following
// https://developer.mozilla.org/en-US/docs/Web/API/xmlhttprequest
/**
 * Mock XMLHttpRequest object.
 * Handles a global list of request, and adds the ability to respond()
 * to them.
 */
var MockXMLHttpRequest = (function () {
    function MockXMLHttpRequest() {
        this._readyState = MockXMLHttpRequest.UNSENT;
        this._response = '';
        this._responseType = '';
        this._status = -1;
        this._statusText = '';
        this._timeout = -1;
        this._mimetype = '';
        this._method = '';
        this._url = '';
        this._async = true;
        this._user = '';
        this._password = '';
        this._onLoad = null;
        this._onError = null;
        this._onProgress = null;
        this._requestHeader = Object.create(null);
        this._responseHeader = Object.create(null);
        this._onReadyState = null;
        this._onTimeout = null;
    }
    Object.defineProperty(MockXMLHttpRequest.prototype, "readyState", {
        /**
         * Ready state of the request.
         */
        get: function () {
            return this._readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "password", {
        /**
         * Password of the request.
         */
        get: function () {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "async", {
        /**
         * Async status of the request.
         */
        get: function () {
            return this._async;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "response", {
        /**
         * Response data for the request.
         */
        get: function () {
            return this._response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "responseText", {
        /**
         * Response data for the request as string.
         */
        get: function () {
            return '' + this._response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "responseType", {
        /**
         * Enumerated value that represents the response type.
         */
        get: function () {
            return this._responseType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "status", {
        /**
         * Status code of the response of the request.
         */
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "statusText", {
        /**
         * The status string returned by the server.
         */
        get: function () {
            return this._statusText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "timeout", {
        /**
         * Get the number of milliseconds to wait before a request is
         * automatically canceled.
         */
        get: function () {
            return this._timeout;
        },
        /**
         * Set the number of milliseconds to wait before a request is
         * automatically canceled.
         */
        set: function (timeout) {
            this._timeout = timeout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "onload", {
        /**
         * Set a callback for with the request is loaded.
         */
        set: function (cb) {
            this._onLoad = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "onerror", {
        /**
         * Set a callback for when the request has an error.
         */
        set: function (cb) {
            this._onError = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "onprogress", {
        /**
         * Set a callback for when the request is in progress.
         */
        set: function (cb) {
            throw new Error('Not implemented');
            //this._onProgress = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "onreadystatechange", {
        /**
         * Set a callback for when the ready state changes.
         */
        set: function (cb) {
            this._onReadyState = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "ontimeout", {
        /**
         * Set a callback for when the ready state changes.
         */
        set: function (cb) {
            this._onTimeout = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "method", {
        /**
         * Get the method of the request.
         */
        get: function () {
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest.prototype, "url", {
        /**
         * Get the url of the request.
         */
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize a request.
     */
    MockXMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        var _this = this;
        this._method = method;
        this._url = url;
        if (async !== void 0) {
            this._async = async;
        }
        if (user !== void 0) {
            this._user = user;
        }
        this._password = password || '';
        this._readyState = MockXMLHttpRequest.OPENED;
        doLater(function () {
            var onReadyState = _this._onReadyState;
            if (onReadyState)
                onReadyState();
        });
    };
    /**
     * Override the MIME type returned by the server.
     */
    MockXMLHttpRequest.prototype.overrideMimeType = function (mime) {
        this._mimetype = mime;
    };
    /**
     * Sends the request.
     */
    MockXMLHttpRequest.prototype.send = function (data) {
        var _this = this;
        if (data !== void 0) {
            this._data = data;
        }
        MockXMLHttpRequest.requests.push(this);
        setTimeout(function () {
            if (MockXMLHttpRequest.requests.indexOf(_this) === -1) {
                console.error('Unhandled request:', JSON.stringify(_this));
                throw new Error("Unhandled request: " + JSON.stringify(_this));
            }
            var onRequest = MockXMLHttpRequest.onRequest;
            if (onRequest)
                onRequest(_this);
            if (_this._timeout > 0) {
                setTimeout(function () {
                    if (_this._readyState != MockXMLHttpRequest.DONE) {
                        var cb = _this._onTimeout;
                        if (cb)
                            cb();
                    }
                }, _this._timeout);
            }
        }, 0);
    };
    Object.defineProperty(MockXMLHttpRequest.prototype, "requestHeaders", {
        /**
         * Get a copy of the HTTP request header.
         */
        get: function () {
            return JSON.parse(JSON.stringify(this._requestHeader));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set the value of an HTTP request header.
     */
    MockXMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this._requestHeader[header] = value;
    };
    /**
     * Returns the string containing the text of the specified header,
     * or null if either the response has not yet been received
     * or the header doesn't exist in the response.
     */
    MockXMLHttpRequest.prototype.getResponseHeader = function (header) {
        if (this._responseHeader.hasOwnProperty(header)) {
            return this._responseHeader[header];
        }
    };
    /**
     * Respond to a Mock XHR.
     */
    MockXMLHttpRequest.prototype.respond = function (statusCode, response, header) {
        var _this = this;
        if (header === void 0) {
            header = { 'Content-Type': 'text/json' };
        }
        if (typeof response !== 'string') {
            response = JSON.stringify(response);
        }
        this._status = statusCode;
        this._response = response;
        this._responseHeader = header;
        this._readyState = MockXMLHttpRequest.DONE;
        doLater(function () {
            _this._statusText = statusCode + " " + statusReasons[statusCode];
            var onReadyState = _this._onReadyState;
            if (onReadyState)
                onReadyState();
            var onLoad = _this._onLoad;
            if (onLoad)
                onLoad();
        });
    };
    /**
     * Simulate a request error.
     */
    MockXMLHttpRequest.prototype.error = function (error) {
        var _this = this;
        this._response = '';
        this._readyState = MockXMLHttpRequest.DONE;
        doLater(function () {
            var onError = _this._onError;
            if (onError)
                onError(error);
        });
    };
    MockXMLHttpRequest.UNSENT = 0; // open() has not been called yet.
    MockXMLHttpRequest.OPENED = 1; // send() has been called.
    MockXMLHttpRequest.HEADERS_RECEIVED = 2; // send() has been called, and headers and status are available.
    MockXMLHttpRequest.LOADING = 3; // Downloading; responseText holds partial data.
    MockXMLHttpRequest.DONE = 4; // The operation is complete.
    /**
     * Global list of XHRs.
     */
    MockXMLHttpRequest.requests = [];
    /**
     * Register a callback for the next request.
     *
     * It is automatically cleared after the request.
     */
    MockXMLHttpRequest.onRequest = null;
    return MockXMLHttpRequest;
}());
exports.MockXMLHttpRequest = MockXMLHttpRequest;
/**
 * Do something in the future ensuring total ordering wrt to Promises.
 */
function doLater(cb) {
    Promise.resolve().then(cb);
}
/**
 * Status code reasons.
 */
var statusReasons = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Moved Temporarily',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Large',
    415: 'Unsupported Media Type',
    416: 'Requested range not satisfiable',
    417: 'Expectation Failed',
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version not supported',
    507: 'Insufficient Storage'
};
