// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var disposable_1 = require('phosphor/lib/core/disposable');
var signaling_1 = require('phosphor/lib/core/signaling');
var json_1 = require('./json');
var kernelfuture_1 = require('./kernelfuture');
var serialize = require('./serialize');
var validate = require('./validate');
var utils = require('./utils');
/**
 * The url for the kernel service.
 */
var KERNEL_SERVICE_URL = 'api/kernels';
/**
 * The url for the kernelspec service.
 */
var KERNELSPEC_SERVICE_URL = 'api/kernelspecs';
/**
 * An implementation of a kernel manager.
 */
var KernelManager = (function () {
    /**
     * Construct a new kernel manager.
     *
     * @param options - The default options for kernel.
     */
    function KernelManager(options) {
        this._options = null;
        this._running = [];
        this._spec = null;
        this._isDisposed = false;
        this._options = utils.copy(options || {});
    }
    Object.defineProperty(KernelManager.prototype, "isDisposed", {
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
    KernelManager.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        signaling_1.clearSignalData(this);
        this._spec = null;
        this._running = [];
    };
    /**
     * Get the kernel specs.  See also [[getKernelSpecs]].
     *
     * @param options - Overrides for the default options.
     */
    KernelManager.prototype.getSpecs = function (options) {
        var _this = this;
        return getKernelSpecs(this._getOptions(options)).then(function (specs) {
            if (!json_1.deepEqual(specs, _this._spec)) {
                _this._spec = specs;
                _this.specsChanged.emit(specs);
            }
            return specs;
        });
    };
    /**
     * List the running kernels.  See also [[listRunningKernels]].
     *
     * @param options - Overrides for the default options.
     */
    KernelManager.prototype.listRunning = function (options) {
        var _this = this;
        return listRunningKernels(this._getOptions(options)).then(function (running) {
            if (!json_1.deepEqual(running, _this._running)) {
                _this._running = running.slice();
                _this.runningChanged.emit(running);
            }
            return running;
        });
    };
    /**
     * Start a new kernel.  See also [[startNewKernel]].
     *
     * @param options - Overrides for the default options.
     *
     * #### Notes
     * This will emit [[runningChanged]] if the running kernels list
     * changes.
     */
    KernelManager.prototype.startNew = function (options) {
        return startNewKernel(this._getOptions(options));
    };
    /**
     * Find a kernel by id.
     *
     * @param options - Overrides for the default options.
     */
    KernelManager.prototype.findById = function (id, options) {
        return findKernelById(id, this._getOptions(options));
    };
    /**
     * Connect to a running kernel.  See also [[connectToKernel]].
     *
     * @param options - Overrides for the default options.
     */
    KernelManager.prototype.connectTo = function (id, options) {
        return connectToKernel(id, this._getOptions(options));
    };
    /**
     * Shut down a kernel by id.
     *
     * @param options - Overrides for the default options.
     *
     * #### Notes
     * This will emit [[runningChanged]] if the running kernels list
     * changes.
     */
    KernelManager.prototype.shutdown = function (id, options) {
        return shutdownKernel(id, this._getOptions(options));
    };
    /**
     * Get optionally overidden options.
     */
    KernelManager.prototype._getOptions = function (options) {
        if (options) {
            options = utils.extend(utils.copy(this._options), options);
        }
        else {
            options = this._options;
        }
        return options;
    };
    return KernelManager;
}());
exports.KernelManager = KernelManager;
/**
 * Find a kernel by id.
 *
 * #### Notes
 * If the kernel was already started via `startNewKernel`, we return its
 * `IKernel.IModel`.
 *
 * Otherwise, if `options` are given, we attempt to find to the existing
 * kernel.
 * The promise is fulfilled when the kernel is found,
 * otherwise the promise is rejected.
 */
function findKernelById(id, options) {
    var kernels = Private.runningKernels;
    for (var clientId in kernels) {
        var kernel = kernels[clientId];
        if (kernel.id === id) {
            var result = { id: kernel.id, name: kernel.name };
            return Promise.resolve(result);
        }
    }
    return Private.getKernelModel(id, options).catch(function () {
        return Private.typedThrow("No running kernel with id: " + id);
    });
}
exports.findKernelById = findKernelById;
/**
 * Fetch the kernel specs.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernelspecs).
 */
function getKernelSpecs(options) {
    if (options === void 0) { options = {}; }
    var baseUrl = options.baseUrl || utils.getBaseUrl();
    var url = utils.urlPathJoin(baseUrl, KERNELSPEC_SERVICE_URL);
    var ajaxSettings = utils.copy(options.ajaxSettings || {});
    ajaxSettings.method = 'GET';
    ajaxSettings.dataType = 'json';
    return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
        if (success.xhr.status !== 200) {
            return utils.makeAjaxError(success);
        }
        var data = success.data;
        if (!data.hasOwnProperty('kernelspecs')) {
            return utils.makeAjaxError(success, 'No kernelspecs found');
        }
        var keys = Object.keys(data.kernelspecs);
        for (var i = 0; i < keys.length; i++) {
            var ks = data.kernelspecs[keys[i]];
            try {
                validate.validateKernelSpecModel(ks);
            }
            catch (err) {
                // Remove the errant kernel spec.
                console.warn("Removing errant kernel spec: " + keys[i]);
                delete data.kernelspecs[keys[i]];
            }
        }
        keys = Object.keys(data.kernelspecs);
        if (!keys.length) {
            return utils.makeAjaxError(success, 'No valid kernelspecs found');
        }
        if (!data.hasOwnProperty('default') ||
            typeof data.default !== 'string' ||
            !data.kernelspecs.hasOwnProperty(data.default)) {
            data.default = keys[0];
            console.warn("Default kernel not found, using '" + keys[0] + "'");
        }
        return data;
    });
}
exports.getKernelSpecs = getKernelSpecs;
/**
 * Fetch the running kernels.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
function listRunningKernels(options) {
    if (options === void 0) { options = {}; }
    var baseUrl = options.baseUrl || utils.getBaseUrl();
    var url = utils.urlPathJoin(baseUrl, KERNEL_SERVICE_URL);
    var ajaxSettings = utils.copy(options.ajaxSettings || {});
    ajaxSettings.method = 'GET';
    ajaxSettings.dataType = 'json';
    ajaxSettings.cache = false;
    return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
        if (success.xhr.status !== 200) {
            return utils.makeAjaxError(success);
        }
        if (!Array.isArray(success.data)) {
            return utils.makeAjaxError(success, 'Invalid kernel list');
        }
        for (var i = 0; i < success.data.length; i++) {
            try {
                validate.validateKernelModel(success.data[i]);
            }
            catch (err) {
                return utils.makeAjaxError(success, err.message);
            }
        }
        return success.data;
    }, Private.onKernelError);
}
exports.listRunningKernels = listRunningKernels;
/**
 * Start a new kernel.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * If no options are given or the kernel name is not given, the
 * default kernel will by started by the server.
 *
 * Wraps the result in a Kernel object. The promise is fulfilled
 * when the kernel is started by the server, otherwise the promise is rejected.
 */
function startNewKernel(options) {
    options = options || {};
    var baseUrl = options.baseUrl || utils.getBaseUrl();
    var url = utils.urlPathJoin(baseUrl, KERNEL_SERVICE_URL);
    var ajaxSettings = utils.copy(options.ajaxSettings || {});
    ajaxSettings.method = 'POST';
    ajaxSettings.data = JSON.stringify({ name: options.name });
    ajaxSettings.dataType = 'json';
    ajaxSettings.contentType = 'application/json';
    ajaxSettings.cache = false;
    return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
        if (success.xhr.status !== 201) {
            return utils.makeAjaxError(success);
        }
        validate.validateKernelModel(success.data);
        return new Kernel(options, success.data.id);
    }, Private.onKernelError);
}
exports.startNewKernel = startNewKernel;
/**
 * Connect to a running kernel.
 *
 * #### Notes
 * If the kernel was already started via `startNewKernel`, the existing
 * Kernel object info is used to create another instance.
 *
 * Otherwise, if `options` are given, we attempt to connect to the existing
 * kernel found by calling `listRunningKernels`.
 * The promise is fulfilled when the kernel is running on the server,
 * otherwise the promise is rejected.
 *
 * If the kernel was not already started and no `options` are given,
 * the promise is rejected.
 */
function connectToKernel(id, options) {
    for (var clientId in Private.runningKernels) {
        var kernel = Private.runningKernels[clientId];
        if (kernel.id === id) {
            return Promise.resolve(kernel.clone());
        }
    }
    return Private.getKernelModel(id, options).then(function (model) {
        return new Kernel(options, id);
    }).catch(function () {
        return Private.typedThrow("No running kernel with id: " + id);
    });
}
exports.connectToKernel = connectToKernel;
/**
 * Shut down a kernel by id.
 */
function shutdownKernel(id, options) {
    if (options === void 0) { options = {}; }
    var baseUrl = options.baseUrl || utils.getBaseUrl();
    var ajaxSettings = options.ajaxSettings || {};
    return Private.shutdownKernel(id, baseUrl, ajaxSettings);
}
exports.shutdownKernel = shutdownKernel;
/**
 * Create a well-formed kernel message.
 */
function createKernelMessage(options, content, metadata, buffers) {
    if (content === void 0) { content = {}; }
    if (metadata === void 0) { metadata = {}; }
    if (buffers === void 0) { buffers = []; }
    return {
        header: {
            username: options.username || '',
            version: '5.0',
            session: options.session,
            msg_id: options.msgId || utils.uuid(),
            msg_type: options.msgType
        },
        parent_header: {},
        channel: options.channel,
        content: content,
        metadata: metadata,
        buffers: buffers
    };
}
exports.createKernelMessage = createKernelMessage;
/**
 * Create a well-formed kernel shell message.
 */
function createShellMessage(options, content, metadata, buffers) {
    if (content === void 0) { content = {}; }
    if (metadata === void 0) { metadata = {}; }
    if (buffers === void 0) { buffers = []; }
    var msg = createKernelMessage(options, content, metadata, buffers);
    return msg;
}
exports.createShellMessage = createShellMessage;
/**
 * Implementation of the Kernel object
 */
var Kernel = (function () {
    /**
     * Construct a kernel object.
     */
    function Kernel(options, id) {
        this._id = '';
        this._name = '';
        this._baseUrl = '';
        this._wsUrl = '';
        this._status = 'unknown';
        this._clientId = '';
        this._ws = null;
        this._username = '';
        this._ajaxSettings = '{}';
        this._reconnectLimit = 7;
        this._reconnectAttempt = 0;
        this._isReady = false;
        this._futures = null;
        this._commPromises = null;
        this._comms = null;
        this._targetRegistry = Object.create(null);
        this._spec = null;
        this._info = null;
        this._pendingMessages = [];
        this._connectionPromise = null;
        this.ajaxSettings = options.ajaxSettings || {};
        this._name = options.name;
        this._id = id;
        this._baseUrl = options.baseUrl || utils.getBaseUrl();
        this._wsUrl = options.wsUrl || utils.getWsUrl(this._baseUrl);
        this._clientId = options.clientId || utils.uuid();
        this._username = options.username || '';
        this._futures = new Map();
        this._commPromises = new Map();
        this._comms = new Map();
        this._createSocket();
        Private.runningKernels[this._clientId] = this;
    }
    Object.defineProperty(Kernel.prototype, "id", {
        /**
         * The id of the server-side kernel.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "name", {
        /**
         * The name of the server-side kernel.
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
    Object.defineProperty(Kernel.prototype, "model", {
        /**
         * Get the model associated with the kernel.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return { name: this.name, id: this.id };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "username", {
        /**
         * The client username.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "clientId", {
        /**
         * The client unique id.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._clientId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "status", {
        /**
         * The current status of the kernel.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "info", {
        /**
         * The cached info for the kernel.
         *
         * #### Notes
         * This is a read-only property.
         * If `null`, call [[kernelInfo]] to get the value,
         * which will populate this value.
         */
        get: function () {
            return this._info;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "spec", {
        /**
         * The cached specs for the kernel.
         *
         * #### Notes
         * This is a read-only property.
         * If `null`, call [[getKernelSpecs]] to get the value,
         * which will populate this value.
         */
        get: function () {
            return this._spec;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "ajaxSettings", {
        /**
         * Get a copy of the default ajax settings for the kernel.
         */
        get: function () {
            return JSON.parse(this._ajaxSettings);
        },
        /**
         * Set the default ajax settings for the kernel.
         */
        set: function (value) {
            this._ajaxSettings = JSON.stringify(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Kernel.prototype, "isDisposed", {
        /**
         * Test whether the kernel has been disposed.
         *
         * #### Notes
         * This is a read-only property which is always safe to access.
         */
        get: function () {
            return this._futures === null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clone the current kernel with a new clientId.
     */
    Kernel.prototype.clone = function () {
        var options = {
            baseUrl: this._baseUrl,
            wsUrl: this._wsUrl,
            name: this._name,
            username: this._username,
            ajaxSettings: this.ajaxSettings
        };
        return new Kernel(options, this._id);
    };
    /**
     * Dispose of the resources held by the kernel.
     */
    Kernel.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._status = 'dead';
        if (this._ws !== null) {
            this._ws.close();
        }
        this._ws = null;
        this._futures.forEach(function (future, key) {
            future.dispose();
        });
        this._comms.forEach(function (comm, key) {
            comm.dispose();
        });
        this._futures = null;
        this._commPromises = null;
        this._comms = null;
        this._status = 'dead';
        this._targetRegistry = null;
        signaling_1.clearSignalData(this);
        delete Private.runningKernels[this._clientId];
    };
    /**
     * Send a shell message to the kernel.
     *
     * #### Notes
     * Send a message to the kernel's shell channel, yielding a future object
     * for accepting replies.
     *
     * If `expectReply` is given and `true`, the future is disposed when both a
     * shell reply and an idle status message are received. If `expectReply`
     * is not given or is `false`, the future is resolved when an idle status
     * message is received.
     * If `disposeOnDone` is not given or is `true`, the Future is disposed at this point.
     * If `disposeOnDone` is given and `false`, it is up to the caller to dispose of the Future.
     *
     * All replies are validated as valid kernel messages.
     *
     * If the kernel status is `Dead`, this will throw an error.
     */
    Kernel.prototype.sendShellMessage = function (msg, expectReply, disposeOnDone) {
        var _this = this;
        if (expectReply === void 0) { expectReply = false; }
        if (disposeOnDone === void 0) { disposeOnDone = true; }
        if (this.status === 'dead') {
            throw new Error('Kernel is dead');
        }
        if (!this._isReady) {
            this._pendingMessages.push(msg);
        }
        else {
            this._ws.send(serialize.serialize(msg));
        }
        var future = new kernelfuture_1.KernelFutureHandler(function () {
            _this._futures.delete(msg.header.msg_id);
        }, msg, expectReply, disposeOnDone);
        this._futures.set(msg.header.msg_id, future);
        return future;
    };
    /**
     * Interrupt a kernel.
     *
     * #### Notes
     * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels).
     *
     * The promise is fulfilled on a valid response and rejected otherwise.
     *
     * It is assumed that the API call does not mutate the kernel id or name.
     *
     * The promise will be rejected if the kernel status is `Dead` or if the
     * request fails or the response is invalid.
     */
    Kernel.prototype.interrupt = function () {
        return Private.interruptKernel(this, this._baseUrl, this.ajaxSettings);
    };
    /**
     * Restart a kernel.
     *
     * #### Notes
     * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
     *
     * Any existing Future or Comm objects are cleared.
     *
     * The promise is fulfilled on a valid response and rejected otherwise.
     *
     * It is assumed that the API call does not mutate the kernel id or name.
     *
     * The promise will be rejected if the request fails or the response is
     * invalid.
     */
    Kernel.prototype.restart = function () {
        this._clearState();
        this._updateStatus('restarting');
        return Private.restartKernel(this, this._baseUrl, this.ajaxSettings);
    };
    /**
     * Reconnect to a disconnected kernel.
     *
     * #### Notes
     * Used when the websocket connection to the kernel is lost.
     */
    Kernel.prototype.reconnect = function () {
        if (this._ws !== null) {
            // Clear the websocket event handlers and the socket itself.
            this._ws.onclose = null;
            this._ws.onerror = null;
            this._ws.close();
            this._ws = null;
        }
        this._isReady = false;
        this._updateStatus('reconnecting');
        this._createSocket();
        return this._connectionPromise.promise;
    };
    /**
     * Shutdown a kernel.
     *
     * #### Notes
     * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels).
     *
     * The promise is fulfilled on a valid response and rejected otherwise.
     *
     * On a valid response, closes the websocket and disposes of the kernel
     * object, and fulfills the promise.
     *
     * The promise will be rejected if the kernel status is `Dead` or if the
     * request fails or the response is invalid.
     */
    Kernel.prototype.shutdown = function () {
        var _this = this;
        if (this.status === 'dead') {
            return Promise.reject(new Error('Kernel is dead'));
        }
        this._clearState();
        return Private.shutdownKernel(this.id, this._baseUrl, this.ajaxSettings)
            .then(function () {
            _this.dispose();
        });
    };
    /**
     * Send a `kernel_info_request` message.
     *
     * #### Notes
     * See [Messaging in Jupyter](http://jupyter-client.readthedocs.org/en/latest/messaging.html#kernel-info).
     *
     * Fulfills with the `kernel_info_response` content when the shell reply is
     * received and validated.
     */
    Kernel.prototype.kernelInfo = function () {
        var _this = this;
        var options = {
            msgType: 'kernel_info_request',
            channel: 'shell',
            username: this._username,
            session: this._clientId
        };
        var msg = createShellMessage(options);
        return Private.handleShellMessage(this, msg).then(function (reply) {
            _this._info = reply.content;
            return reply;
        });
    };
    /**
     * Send a `complete_request` message.
     *
     * #### Notes
     * See [Messaging in Jupyter](http://jupyter-client.readthedocs.org/en/latest/messaging.html#completion).
     *
     * Fulfills with the `complete_reply` content when the shell reply is
     * received and validated.
     */
    Kernel.prototype.complete = function (content) {
        var options = {
            msgType: 'complete_request',
            channel: 'shell',
            username: this._username,
            session: this._clientId
        };
        var msg = createShellMessage(options, content);
        return Private.handleShellMessage(this, msg);
    };
    /**
     * Send an `inspect_request` message.
     *
     * #### Notes
     * See [Messaging in Jupyter](http://jupyter-client.readthedocs.org/en/latest/messaging.html#introspection).
     *
     * Fulfills with the `inspect_reply` content when the shell reply is
     * received and validated.
     */
    Kernel.prototype.inspect = function (content) {
        var options = {
            msgType: 'inspect_request',
            channel: 'shell',
            username: this._username,
            session: this._clientId
        };
        var msg = createShellMessage(options, content);
        return Private.handleShellMessage(this, msg);
    };
    /**
     * Send a `history_request` message.
     *
     * #### Notes
     * See [Messaging in Jupyter](http://jupyter-client.readthedocs.org/en/latest/messaging.html#history).
     *
     * Fulfills with the `history_reply` content when the shell reply is
     * received and validated.
     */
    Kernel.prototype.history = function (content) {
        var options = {
            msgType: 'history_request',
            channel: 'shell',
            username: this._username,
            session: this._clientId
        };
        var msg = createShellMessage(options, content);
        return Private.handleShellMessage(this, msg);
    };
    /**
     * Send an `execute_request` message.
     *
     * #### Notes
     * See [Messaging in Jupyter](http://jupyter-client.readthedocs.org/en/latest/messaging.html#execute).
     *
     * Future `onReply` is called with the `execute_reply` content when the
     * shell reply is received and validated. The future will resolve when
     * this message is received and the `idle` iopub status is received.
     * The future will also be disposed at this point unless `disposeOnDone`
     * is specified and `false`, in which case it is up to the caller to dispose
     * of the future.
     *
     * **See also:** [[IExecuteReply]]
     */
    Kernel.prototype.execute = function (content, disposeOnDone) {
        if (disposeOnDone === void 0) { disposeOnDone = true; }
        var options = {
            msgType: 'execute_request',
            channel: 'shell',
            username: this._username,
            session: this._clientId
        };
        var defaults = {
            silent: false,
            store_history: true,
            user_expressions: {},
            allow_stdin: true,
            stop_on_error: false
        };
        content = utils.extend(defaults, content);
        var msg = createShellMessage(options, content);
        return this.sendShellMessage(msg, true, disposeOnDone);
    };
    /**
     * Send an `is_complete_request` message.
     *
     * #### Notes
     * See [Messaging in Jupyter](http://jupyter-client.readthedocs.org/en/latest/messaging.html#code-completeness).
     *
     * Fulfills with the `is_complete_response` content when the shell reply is
     * received and validated.
     */
    Kernel.prototype.isComplete = function (content) {
        var options = {
            msgType: 'is_complete_request',
            channel: 'shell',
            username: this._username,
            session: this._clientId
        };
        var msg = createShellMessage(options, content);
        return Private.handleShellMessage(this, msg);
    };
    /**
     * Send a `comm_info_request` message.
     *
     * #### Notes
     * Fulfills with the `comm_info_reply` content when the shell reply is
     * received and validated.
     */
    Kernel.prototype.commInfo = function (content) {
        var options = {
            msgType: 'comm_info_request',
            channel: 'shell',
            username: this._username,
            session: this._clientId
        };
        var msg = createShellMessage(options, content);
        return Private.handleShellMessage(this, msg);
    };
    /**
     * Send an `input_reply` message.
     *
     * #### Notes
     * See [Messaging in Jupyter](http://jupyter-client.readthedocs.org/en/latest/messaging.html#messages-on-the-stdin-router-dealer-sockets).
     */
    Kernel.prototype.sendInputReply = function (content) {
        if (this.status === 'dead') {
            throw new Error('Kernel is dead');
        }
        var options = {
            msgType: 'input_reply',
            channel: 'stdin',
            username: this._username,
            session: this._clientId
        };
        var msg = createKernelMessage(options, content);
        if (!this._isReady) {
            this._pendingMessages.push(msg);
        }
        else {
            this._ws.send(serialize.serialize(msg));
        }
    };
    /**
     * Register an IOPub message hook.
     *
     * @param msg_id - The parent_header message id the hook will intercept.
     *
     * @param hook - The callback invoked for the message.
     *
     * @returns A disposable used to unregister the message hook.
     *
     * #### Notes
     * The IOPub hook system allows you to preempt the handlers for IOPub messages with a
     * given parent_header message id. The most recently registered hook is run first.
     * If the hook returns false, any later hooks and the future's onIOPub handler will not run.
     * If a hook throws an error, the error is logged to the console and the next hook is run.
     * If a hook is registered during the hook processing, it won't run until the next message.
     * If a hook is disposed during the hook processing, it will be deactivated immediately.
     *
     * See also [[IFuture.registerMessageHook]].
     */
    Kernel.prototype.registerMessageHook = function (msgId, hook) {
        var _this = this;
        var future = this._futures && this._futures.get(msgId);
        if (future) {
            future.registerMessageHook(hook);
        }
        return new disposable_1.DisposableDelegate(function () {
            future = _this._futures && _this._futures.get(msgId);
            if (future) {
                future.removeMessageHook(hook);
            }
        });
    };
    /**
     * Register a comm target handler.
     *
     * @param targetName - The name of the comm target.
     *
     * @param callback - The callback invoked for a comm open message.
     *
     * @returns A disposable used to unregister the comm target.
     *
     * #### Notes
     * Only one comm target can be registered at a time, an existing
     * callback will be overidden.  A registered comm target handler will take
     * precedence over a comm which specifies a `target_module`.
     */
    Kernel.prototype.registerCommTarget = function (targetName, callback) {
        var _this = this;
        this._targetRegistry[targetName] = callback;
        return new disposable_1.DisposableDelegate(function () {
            if (!_this.isDisposed) {
                delete _this._targetRegistry[targetName];
            }
        });
    };
    /**
     * Connect to a comm, or create a new one.
     *
     * #### Notes
     * If a client-side comm already exists, it is returned.
     */
    Kernel.prototype.connectToComm = function (targetName, commId) {
        var _this = this;
        if (commId === void 0) {
            commId = utils.uuid();
        }
        var comm = this._comms.get(commId);
        if (!comm) {
            comm = new Comm(targetName, commId, this, function () { _this._unregisterComm(commId); });
            this._comms.set(commId, comm);
        }
        return comm;
    };
    /**
     * Get the kernel spec associated with the kernel.
     *
     * #### Notes
     * This value is cached and only fetched the first time it is requested.
     */
    Kernel.prototype.getKernelSpec = function () {
        var _this = this;
        return Private.getKernelSpec(this, this._baseUrl, this.ajaxSettings)
            .then(function (specs) {
            _this._spec = specs;
            return specs;
        });
    };
    /**
     * Create the kernel websocket connection and add socket status handlers.
     */
    Kernel.prototype._createSocket = function () {
        var _this = this;
        var partialUrl = utils.urlPathJoin(this._wsUrl, KERNEL_SERVICE_URL, encodeURIComponent(this._id));
        // Strip any authentication from the display string.
        var parsed = utils.urlParse(partialUrl);
        var display = partialUrl.replace(parsed.auth, '');
        console.log('Starting WebSocket:', display);
        var url = utils.urlPathJoin(partialUrl, 'channels?session_id=' + encodeURIComponent(this._clientId));
        this._connectionPromise = new utils.PromiseDelegate();
        this._ws = new WebSocket(url);
        // Ensure incoming binary messages are not Blobs
        this._ws.binaryType = 'arraybuffer';
        this._ws.onmessage = function (evt) { _this._onWSMessage(evt); };
        this._ws.onopen = function (evt) { _this._onWSOpen(evt); };
        this._ws.onclose = function (evt) { _this._onWSClose(evt); };
        this._ws.onerror = function (evt) { _this._onWSClose(evt); };
    };
    /**
     * Handle a websocket open event.
     */
    Kernel.prototype._onWSOpen = function (evt) {
        var _this = this;
        this._reconnectAttempt = 0;
        // Allow the message to get through.
        this._isReady = true;
        // Get the kernel info, signaling that the kernel is ready.
        this.kernelInfo().then(function () {
            _this._connectionPromise.resolve(void 0);
        });
        this._isReady = false;
    };
    /**
     * Handle a websocket message, validating and routing appropriately.
     */
    Kernel.prototype._onWSMessage = function (evt) {
        if (this.status === 'dead') {
            // If the socket is being closed, ignore any messages
            return;
        }
        var msg = serialize.deserialize(evt.data);
        try {
            validate.validateKernelMessage(msg);
        }
        catch (error) {
            console.error(error.message);
            return;
        }
        if (msg.parent_header) {
            var parentHeader = msg.parent_header;
            var future = this._futures && this._futures.get(parentHeader.msg_id);
            if (future) {
                future.handleMsg(msg);
            }
            else {
                // If the message was sent by us and was not iopub, it is orphaned.
                var owned = parentHeader.session === this.clientId;
                if (msg.channel !== 'iopub' && owned) {
                    this.unhandledMessage.emit(msg);
                }
            }
        }
        if (msg.channel === 'iopub') {
            switch (msg.header.msg_type) {
                case 'status':
                    this._updateStatus(msg.content.execution_state);
                    break;
                case 'comm_open':
                    this._handleCommOpen(msg);
                    break;
                case 'comm_msg':
                    this._handleCommMsg(msg);
                    break;
                case 'comm_close':
                    this._handleCommClose(msg);
                    break;
            }
            this.iopubMessage.emit(msg);
        }
    };
    /**
     * Handle a websocket close event.
     */
    Kernel.prototype._onWSClose = function (evt) {
        if (this.status === 'dead') {
            return;
        }
        // Clear the websocket event handlers and the socket itself.
        this._ws.onclose = null;
        this._ws.onerror = null;
        this._ws = null;
        if (this._reconnectAttempt < this._reconnectLimit) {
            this._updateStatus('reconnecting');
            var timeout = Math.pow(2, this._reconnectAttempt);
            console.error('Connection lost, reconnecting in ' + timeout + ' seconds.');
            setTimeout(this._createSocket.bind(this), 1e3 * timeout);
            this._reconnectAttempt += 1;
        }
        else {
            this._updateStatus('dead');
        }
    };
    /**
     * Handle status iopub messages from the kernel.
     */
    Kernel.prototype._updateStatus = function (status) {
        switch (status) {
            case 'starting':
            case 'idle':
            case 'busy':
                this._isReady = true;
                break;
            case 'restarting':
            case 'reconnecting':
            case 'dead':
                this._isReady = false;
                break;
            default:
                console.error('invalid kernel status:', status);
                return;
        }
        if (status !== this._status) {
            this._status = status;
            Private.logKernelStatus(this);
            this.statusChanged.emit(status);
            if (status === 'dead') {
                this.dispose();
            }
        }
        if (this._isReady) {
            this._sendPending();
        }
    };
    /**
     * Send pending messages to the kernel.
     */
    Kernel.prototype._sendPending = function () {
        // We shift the message off the queue
        // after the message is sent so that if there is an exception,
        // the message is still pending.
        while (this._pendingMessages.length > 0) {
            var msg = serialize.serialize(this._pendingMessages[0]);
            this._ws.send(msg);
            this._pendingMessages.shift();
        }
    };
    /**
     * Clear the internal state.
     */
    Kernel.prototype._clearState = function () {
        this._isReady = false;
        this._pendingMessages = [];
        this._futures.forEach(function (future, key) {
            future.dispose();
        });
        this._comms.forEach(function (comm, key) {
            comm.dispose();
        });
        this._futures = new Map();
        this._commPromises = new Map();
        this._comms = new Map();
    };
    /**
     * Handle a `comm_open` kernel message.
     */
    Kernel.prototype._handleCommOpen = function (msg) {
        var _this = this;
        var content = msg.content;
        var promise = utils.loadObject(content.target_name, content.target_module, this._targetRegistry).then(function (target) {
            var comm = new Comm(content.target_name, content.comm_id, _this, function () { _this._unregisterComm(content.comm_id); });
            var response;
            try {
                response = target(comm, msg);
            }
            catch (e) {
                comm.close();
                console.error('Exception opening new comm');
                throw (e);
            }
            return Promise.resolve(response).then(function () {
                _this._commPromises.delete(comm.commId);
                _this._comms.set(comm.commId, comm);
                return comm;
            });
        });
        this._commPromises.set(content.comm_id, promise);
    };
    /**
     * Handle 'comm_close' kernel message.
     */
    Kernel.prototype._handleCommClose = function (msg) {
        var _this = this;
        var content = msg.content;
        var promise = this._commPromises.get(content.comm_id);
        if (!promise) {
            var comm = this._comms.get(content.comm_id);
            if (!comm) {
                console.error('Comm not found for comm id ' + content.comm_id);
                return;
            }
            promise = Promise.resolve(comm);
        }
        promise.then(function (comm) {
            _this._unregisterComm(comm.commId);
            try {
                var onClose = comm.onClose;
                if (onClose) {
                    onClose(msg);
                }
                comm.dispose();
            }
            catch (e) {
                console.error('Exception closing comm: ', e, e.stack, msg);
            }
        });
    };
    /**
     * Handle a 'comm_msg' kernel message.
     */
    Kernel.prototype._handleCommMsg = function (msg) {
        var content = msg.content;
        var promise = this._commPromises.get(content.comm_id);
        if (!promise) {
            var comm = this._comms.get(content.comm_id);
            if (!comm) {
                console.error('Comm not found for comm id ' + content.comm_id);
                return;
            }
            else {
                var onMsg = comm.onMsg;
                if (onMsg) {
                    onMsg(msg);
                }
            }
        }
        else {
            promise.then(function (comm) {
                try {
                    var onMsg = comm.onMsg;
                    if (onMsg) {
                        onMsg(msg);
                    }
                }
                catch (e) {
                    console.error('Exception handling comm msg: ', e, e.stack, msg);
                }
                return comm;
            });
        }
    };
    /**
     * Unregister a comm instance.
     */
    Kernel.prototype._unregisterComm = function (commId) {
        this._comms.delete(commId);
        this._commPromises.delete(commId);
    };
    return Kernel;
}());
/**
 * Comm channel handler.
 */
var Comm = (function (_super) {
    __extends(Comm, _super);
    /**
     * Construct a new comm channel.
     */
    function Comm(target, id, kernel, disposeCb) {
        _super.call(this, disposeCb);
        this._target = '';
        this._id = '';
        this._kernel = null;
        this._onClose = null;
        this._onMsg = null;
        this._id = id;
        this._target = target;
        this._kernel = kernel;
    }
    Object.defineProperty(Comm.prototype, "commId", {
        /**
         * The unique id for the comm channel.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Comm.prototype, "targetName", {
        /**
         * The target name for the comm channel.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Comm.prototype, "onClose", {
        /**
         * Get the callback for a comm close event.
         *
         * #### Notes
         * This is called when the comm is closed from either the server or
         * client.
         *
         * **See also:** [[ICommClose]], [[close]]
         */
        get: function () {
            return this._onClose;
        },
        /**
         * Set the callback for a comm close event.
         *
         * #### Notes
         * This is called when the comm is closed from either the server or
         * client.
         *
         * **See also:** [[close]]
         */
        set: function (cb) {
            this._onClose = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Comm.prototype, "onMsg", {
        /**
         * Get the callback for a comm message received event.
         */
        get: function () {
            return this._onMsg;
        },
        /**
         * Set the callback for a comm message received event.
         */
        set: function (cb) {
            this._onMsg = cb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Comm.prototype, "isDisposed", {
        /**
         * Test whether the comm has been disposed.
         *
         * #### Notes
         * This is a read-only property which is always safe to access.
         */
        get: function () {
            return (this._kernel === null);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open a comm with optional data and metadata.
     *
     * #### Notes
     * This sends a `comm_open` message to the server.
     *
     * **See also:** [[ICommOpen]]
     */
    Comm.prototype.open = function (data, metadata) {
        if (this.isDisposed || this._kernel.isDisposed) {
            return;
        }
        var options = {
            msgType: 'comm_open',
            channel: 'shell',
            username: this._kernel.username,
            session: this._kernel.clientId
        };
        var content = {
            comm_id: this._id,
            target_name: this._target,
            data: data || {}
        };
        var msg = createShellMessage(options, content, metadata);
        return this._kernel.sendShellMessage(msg, false, true);
    };
    /**
     * Send a `comm_msg` message to the kernel.
     *
     * #### Notes
     * This is a no-op if the comm has been closed.
     *
     * **See also:** [[ICommMsg]]
     */
    Comm.prototype.send = function (data, metadata, buffers, disposeOnDone) {
        if (buffers === void 0) { buffers = []; }
        if (disposeOnDone === void 0) { disposeOnDone = true; }
        if (this.isDisposed || this._kernel.isDisposed) {
            return;
        }
        var options = {
            msgType: 'comm_msg',
            channel: 'shell',
            username: this._kernel.username,
            session: this._kernel.clientId
        };
        var content = {
            comm_id: this._id,
            data: data
        };
        var msg = createShellMessage(options, content, metadata, buffers);
        return this._kernel.sendShellMessage(msg, false, true);
    };
    /**
     * Close the comm.
     *
     * #### Notes
     * This will send a `comm_close` message to the kernel, and call the
     * `onClose` callback if set.
     *
     * This is a no-op if the comm is already closed.
     *
     * **See also:** [[ICommClose]], [[onClose]]
     */
    Comm.prototype.close = function (data, metadata) {
        if (this.isDisposed || this._kernel.isDisposed) {
            return;
        }
        var options = {
            msgType: 'comm_msg',
            channel: 'shell',
            username: this._kernel.username,
            session: this._kernel.clientId
        };
        var content = {
            comm_id: this._id,
            data: data || {}
        };
        var msg = createShellMessage(options, content, metadata);
        var future = this._kernel.sendShellMessage(msg, false, true);
        options.channel = 'iopub';
        var ioMsg = createKernelMessage(options, content, metadata);
        var onClose = this._onClose;
        if (onClose) {
            onClose(ioMsg);
        }
        this.dispose();
        return future;
    };
    /**
     * Dispose of the resources held by the comm.
     */
    Comm.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._onClose = null;
        this._onMsg = null;
        this._kernel = null;
        _super.prototype.dispose.call(this);
    };
    return Comm;
}(disposable_1.DisposableDelegate));
// Define the signals for the `Kernel` class.
signaling_1.defineSignal(Kernel.prototype, 'statusChanged');
signaling_1.defineSignal(Kernel.prototype, 'iopubMessage');
signaling_1.defineSignal(Kernel.prototype, 'unhandledMessage');
// Define the signal for the `KernelManager` class.
signaling_1.defineSignal(KernelManager.prototype, 'specsChanged');
signaling_1.defineSignal(KernelManager.prototype, 'runningChanged');
/**
 * A private namespace for the Kernel.
 */
var Private;
(function (Private) {
    /**
     * A module private store for running kernels.
     */
    Private.runningKernels = Object.create(null);
    /**
     * Restart a kernel.
     */
    function restartKernel(kernel, baseUrl, ajaxSettings) {
        if (kernel.status === 'dead') {
            return Promise.reject(new Error('Kernel is dead'));
        }
        var url = utils.urlPathJoin(baseUrl, KERNEL_SERVICE_URL, encodeURIComponent(kernel.id), 'restart');
        ajaxSettings = ajaxSettings || {};
        ajaxSettings.method = 'POST';
        ajaxSettings.dataType = 'json';
        ajaxSettings.contentType = 'application/json';
        ajaxSettings.cache = false;
        return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
            if (success.xhr.status !== 200) {
                return utils.makeAjaxError(success);
            }
            try {
                validate.validateKernelModel(success.data);
            }
            catch (err) {
                return utils.makeAjaxError(success, err.message);
            }
        }, onKernelError);
    }
    Private.restartKernel = restartKernel;
    /**
     * Interrupt a kernel.
     */
    function interruptKernel(kernel, baseUrl, ajaxSettings) {
        if (kernel.status === 'dead') {
            return Promise.reject(new Error('Kernel is dead'));
        }
        var url = utils.urlPathJoin(baseUrl, KERNEL_SERVICE_URL, encodeURIComponent(kernel.id), 'interrupt');
        ajaxSettings = ajaxSettings || {};
        ajaxSettings.method = 'POST';
        ajaxSettings.dataType = 'json';
        ajaxSettings.contentType = 'application/json';
        ajaxSettings.cache = false;
        return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
            if (success.xhr.status !== 204) {
                return utils.makeAjaxError(success);
            }
        }, onKernelError);
    }
    Private.interruptKernel = interruptKernel;
    /**
     * Delete a kernel.
     */
    function shutdownKernel(id, baseUrl, ajaxSettings) {
        var url = utils.urlPathJoin(baseUrl, KERNEL_SERVICE_URL, encodeURIComponent(id));
        ajaxSettings = ajaxSettings || {};
        ajaxSettings.method = 'DELETE';
        ajaxSettings.dataType = 'json';
        ajaxSettings.cache = false;
        return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
            if (success.xhr.status !== 204) {
                return utils.makeAjaxError(success);
            }
        }, onKernelError);
    }
    Private.shutdownKernel = shutdownKernel;
    /**
     * Get the kernelspec for a kernel.
     */
    function getKernelSpec(kernel, baseUrl, ajaxSettings) {
        var url = utils.urlPathJoin(baseUrl, KERNELSPEC_SERVICE_URL, encodeURIComponent(kernel.name));
        ajaxSettings = ajaxSettings || {};
        ajaxSettings.dataType = 'json';
        ajaxSettings.cache = false;
        return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
            if (success.xhr.status !== 200) {
                return utils.makeAjaxError(success);
            }
            var data = success.data;
            try {
                validate.validateKernelSpecModel(data);
            }
            catch (err) {
                return utils.makeAjaxError(success, err.message);
            }
            return data.spec;
        }, onKernelError);
    }
    Private.getKernelSpec = getKernelSpec;
    /**
     * Get a full kernel model from the server by kernel id string.
     */
    function getKernelModel(id, options) {
        options = options || {};
        var baseUrl = options.baseUrl || utils.getBaseUrl();
        var url = utils.urlPathJoin(baseUrl, KERNEL_SERVICE_URL, encodeURIComponent(id));
        var ajaxSettings = options.ajaxSettings || {};
        ajaxSettings.method = 'GET';
        ajaxSettings.dataType = 'json';
        ajaxSettings.cache = false;
        return utils.ajaxRequest(url, ajaxSettings).then(function (success) {
            if (success.xhr.status !== 200) {
                return utils.makeAjaxError(success);
            }
            var data = success.data;
            try {
                validate.validateKernelModel(data);
            }
            catch (err) {
                return utils.makeAjaxError(success, err.message);
            }
            return data;
        }, Private.onKernelError);
    }
    Private.getKernelModel = getKernelModel;
    /**
     * Log the current kernel status.
     */
    function logKernelStatus(kernel) {
        switch (kernel.status) {
            case 'idle':
            case 'busy':
            case 'unknown':
                return;
            default:
                console.log("Kernel: " + kernel.status + " (" + kernel.id + ")");
                break;
        }
    }
    Private.logKernelStatus = logKernelStatus;
    /**
     * Handle an error on a kernel Ajax call.
     */
    function onKernelError(error) {
        var text = (error.throwError ||
            error.xhr.statusText ||
            error.xhr.responseText);
        var msg = "API request failed: " + text;
        console.error(msg);
        return Promise.reject(error);
    }
    Private.onKernelError = onKernelError;
    /**
     * Send a kernel message to the kernel and resolve the reply message.
     */
    function handleShellMessage(kernel, msg) {
        var future;
        try {
            future = kernel.sendShellMessage(msg, true);
        }
        catch (e) {
            return Promise.reject(e);
        }
        return new Promise(function (resolve, reject) {
            future.onReply = function (reply) {
                resolve(reply);
            };
        });
    }
    Private.handleShellMessage = handleShellMessage;
    /**
     * Throw a typed error.
     */
    function typedThrow(msg) {
        throw new Error(msg);
    }
    Private.typedThrow = typedThrow;
})(Private || (Private = {}));
