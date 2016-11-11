// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';
var utils = require('./utils');
var disposable_1 = require('phosphor/lib/core/disposable');
var signaling_1 = require('phosphor/lib/core/signaling');
var kernelfuture_1 = require('./kernelfuture');
var json_1 = require('./json');
var kernel_1 = require('./kernel');
/**
 * The default kernel spec models.
 */
exports.KERNELSPECS = {
    default: 'python',
    kernelspecs: {
        python: {
            name: 'python',
            spec: {
                language: 'python',
                argv: [],
                display_name: 'Python',
                env: {}
            },
            resources: {}
        },
        shell: {
            name: 'shell',
            spec: {
                language: 'shell',
                argv: [],
                display_name: 'Shell',
                env: {}
            },
            resources: {}
        }
    }
};
/**
 * The code input to trigger an error.
 */
exports.ERROR_INPUT = 'trigger execute error';
/**
 * The default language infos.
 */
var LANGUAGE_INFOS = {
    python: {
        name: 'python',
        version: '1',
        mimetype: 'text/x-python',
        file_extension: '.py',
        pygments_lexer: 'python',
        codemirror_mode: 'python',
        nbconverter_exporter: ''
    },
    shell: {
        name: 'shell',
        version: '1',
        mimetype: 'text/x-sh',
        file_extension: '.sh',
        pygments_lexer: 'shell',
        codemirror_mode: 'shell',
        nbconverter_exporter: ''
    }
};
/**
 * A mock kernel object.
 */
var MockKernel = (function () {
    /**
     * Construct a new mock kernel.
     */
    function MockKernel(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.username = '';
        this.clientId = '';
        this._status = 'unknown';
        this._isDisposed = false;
        this._futures = [];
        this._kernelspec = null;
        this._kernelInfo = null;
        this._executionCount = 0;
        this.id = options.id || utils.uuid();
        this.name = options.name || 'python';
        var name = this.name;
        if (!(name in exports.KERNELSPECS.kernelspecs)) {
            name = 'python';
        }
        this._kernelspec = exports.KERNELSPECS.kernelspecs[name].spec;
        this._kernelInfo = {
            protocol_version: '1',
            implementation: 'foo',
            implementation_version: '1',
            language_info: LANGUAGE_INFOS[name],
            banner: 'Hello',
            help_links: {}
        };
        Promise.resolve().then(function () {
            _this._changeStatus('idle');
        });
        Private.runningKernels[this.id] = this;
    }
    Object.defineProperty(MockKernel.prototype, "status", {
        /**
         * The current status of the kernel.
         */
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockKernel.prototype, "model", {
        /**
         * The model associated with the kernel.
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
    Object.defineProperty(MockKernel.prototype, "info", {
        get: function () {
            return this._kernelInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockKernel.prototype, "spec", {
        get: function () {
            return this._kernelspec;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockKernel.prototype, "isDisposed", {
        /**
         * Test whether the kernel has been disposed.
         */
        get: function () {
            return this._isDisposed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose of the resources held by the kernel.
     */
    MockKernel.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        this._futures = null;
        delete Private.runningKernels[this.id];
    };
    /**
     * Send a shell message to the kernel.
     */
    MockKernel.prototype.sendShellMessage = function (msg, expectReply, disposeOnDone) {
        var _this = this;
        if (expectReply === void 0) { expectReply = false; }
        if (disposeOnDone === void 0) { disposeOnDone = true; }
        var future = new kernelfuture_1.KernelFutureHandler(function () {
            var index = _this._futures.indexOf(future);
            if (index !== -1) {
                _this._futures.splice(index, 1);
            }
        }, msg, expectReply, disposeOnDone);
        this._futures.push(future);
        return future;
    };
    /**
     * Send a message to the kernel.
     */
    MockKernel.prototype.sendServerMessage = function (msgType, channel, content, future) {
        if (future.isDisposed) {
            return;
        }
        var options = {
            msgType: msgType,
            channel: channel,
            username: this.username,
            session: this.clientId
        };
        var msg = kernel_1.createKernelMessage(options, content);
        if (msgType === 'status') {
            var statusMsg = msg;
            this._changeStatus(statusMsg.content.execution_state);
        }
        future.handleMsg(msg);
    };
    /**
     * Send a shell reply message to the kernel.
     */
    MockKernel.prototype.sendShellReply = function (content) {
        if (this.isDisposed) {
            return;
        }
        var future = this._futures.shift();
        if (!future) {
            return;
        }
        var msgType = future.msg.header.msg_type.replace('_request', '_reply');
        this.sendServerMessage(msgType, 'shell', content, future);
    };
    /**
     * Interrupt a kernel.
     */
    MockKernel.prototype.interrupt = function () {
        var _this = this;
        this._changeStatus('busy');
        return Promise.resolve().then(function () {
            _this._changeStatus('idle');
        });
    };
    /**
     * Restart a kernel.
     */
    MockKernel.prototype.restart = function () {
        var _this = this;
        this._changeStatus('restarting');
        return Promise.resolve().then(function () {
            _this._changeStatus('idle');
        });
    };
    /**
     * Reconnect to a disconnected kernel. This is not actually a
     * standard HTTP request, but useful function nonetheless for
     * reconnecting to the kernel if the connection is somehow lost.
     */
    MockKernel.prototype.reconnect = function () {
        var _this = this;
        this._changeStatus('reconnecting');
        return Promise.resolve().then(function () {
            _this._changeStatus('idle');
        });
    };
    /**
     * Shutdown a kernel.
     */
    MockKernel.prototype.shutdown = function () {
        this._changeStatus('dead');
        this.dispose();
        return Promise.resolve(void 0);
    };
    /**
     * Get the kernel info.
     */
    MockKernel.prototype.kernelInfo = function () {
        var options = {
            msgType: 'kernel_info_reply',
            channel: 'shell',
            username: '',
            session: ''
        };
        var msg = kernel_1.createKernelMessage(options, this._kernelInfo);
        return Promise.resolve(msg);
    };
    /**
     * Send a `complete_request` message.
     */
    MockKernel.prototype.complete = function (content) {
        return this._sendKernelMessage('complete_request', 'shell', content);
    };
    /**
     * Send a `history_request` message.
     */
    MockKernel.prototype.history = function (content) {
        return this._sendKernelMessage('history_request', 'shell', content);
    };
    /**
     * Send an `inspect_request` message.
     */
    MockKernel.prototype.inspect = function (content) {
        return this._sendKernelMessage('inspect_request', 'shell', content);
    };
    /**
     * Send an `execute_request` message.
     *
     * #### Notes
     * This simulates an actual exection on the server.
     * Use `ERROR_INPUT` to simulate an input error.
     */
    MockKernel.prototype.execute = function (content, disposeOnDone) {
        var _this = this;
        if (disposeOnDone === void 0) { disposeOnDone = true; }
        var options = {
            msgType: 'execute_request',
            channel: 'shell',
            username: '',
            session: ''
        };
        var defaults = {
            silent: false,
            store_history: true,
            user_expressions: {},
            allow_stdin: true,
            stop_on_error: false
        };
        content = utils.extend(defaults, content);
        var msg = kernel_1.createKernelMessage(options, content);
        var future = this.sendShellMessage(msg, true, disposeOnDone);
        var count = ++this._executionCount;
        // Delay sending the message so the handlers can be set up.
        setTimeout(function () {
            if (_this.isDisposed || future.isDisposed) {
                return;
            }
            // Send a typical stream of messages.
            _this.sendServerMessage('status', 'iopub', {
                execution_state: 'busy'
            }, future);
            _this.sendServerMessage('stream', 'iopub', {
                name: 'stdout',
                text: 'foo'
            }, future);
            _this.sendServerMessage('status', 'iopub', {
                execution_state: 'idle'
            }, future);
            // Handle an explicit error.
            if (content.code === exports.ERROR_INPUT) {
                _this.sendShellReply({
                    execution_count: count,
                    status: 'error',
                    ename: 'mock',
                    evalue: exports.ERROR_INPUT,
                    traceback: []
                });
                // Cancel remaining executes if necessary.
                if (content.stop_on_error) {
                    _this._handleStop();
                }
            }
            else {
                _this.sendShellReply({
                    execution_count: count,
                    status: 'ok',
                    user_expressions: {},
                    payload: {}
                });
            }
        }, 0);
        return future;
    };
    /**
     * Send an `is_complete_request` message.
     */
    MockKernel.prototype.isComplete = function (content) {
        return this._sendKernelMessage('is_complete_request', 'shell', content);
    };
    /**
     * Send a `comm_info_request` message.
     */
    MockKernel.prototype.commInfo = function (content) {
        return this._sendKernelMessage('comm_info_request', 'shell', content);
    };
    /**
     * Send an `input_reply` message.
     */
    MockKernel.prototype.sendInputReply = function (content) { };
    /**
     * Register a comm target handler.
     */
    MockKernel.prototype.registerCommTarget = function (targetName, callback) {
        return void 0;
    };
    /**
     * Connect to a comm, or create a new one.
     */
    MockKernel.prototype.connectToComm = function (targetName, commId) {
        return void 0;
    };
    /**
     * Get the kernel spec associated with the kernel.
     */
    MockKernel.prototype.getKernelSpec = function () {
        return Promise.resolve(this._kernelspec);
    };
    /**
     * Register a message hook
     */
    MockKernel.prototype.registerMessageHook = function (msg_id, hook) {
        return new disposable_1.DisposableDelegate(function () { });
    };
    /**
     * Send a messaage to the mock kernel.
     */
    MockKernel.prototype._sendKernelMessage = function (msgType, channel, content) {
        var options = {
            msgType: msgType,
            channel: channel,
            username: this.username,
            session: this.clientId
        };
        var msg = kernel_1.createKernelMessage(options, content);
        var future;
        try {
            future = this.sendShellMessage(msg, true);
        }
        catch (e) {
            return Promise.reject(e);
        }
        return new Promise(function (resolve, reject) {
            future.onReply = function (reply) {
                resolve(reply);
            };
        });
    };
    /**
     * Handle a `stop_on_error` error event.
     */
    MockKernel.prototype._handleStop = function () {
        // Trigger immediate errors on remaining execute messages.
        var futures = this._futures.slice();
        for (var _i = 0, futures_1 = futures; _i < futures_1.length; _i++) {
            var future = futures_1[_i];
            if (future.msg.header.msg_type === 'execute_request') {
                this.sendServerMessage('status', 'iopub', {
                    execution_state: 'idle'
                }, future);
                this.sendShellReply({
                    execution_count: null,
                    status: 'error',
                    ename: 'mock',
                    evalue: exports.ERROR_INPUT,
                    traceback: []
                });
            }
        }
    };
    /**
     * Change the status of the mock kernel.
     */
    MockKernel.prototype._changeStatus = function (status) {
        if (this._status === status) {
            return;
        }
        this._status = status;
        this.statusChanged.emit(status);
    };
    return MockKernel;
}());
exports.MockKernel = MockKernel;
/**
 * A mock kernel manager object.
 */
var MockKernelManager = (function () {
    function MockKernelManager() {
        this._running = [];
        this._specs = null;
        this._isDisposed = false;
    }
    Object.defineProperty(MockKernelManager.prototype, "isDisposed", {
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
    MockKernelManager.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._isDisposed = true;
        signaling_1.clearSignalData(this);
        this._specs = null;
        this._running = [];
    };
    MockKernelManager.prototype.getSpecs = function (options) {
        return Promise.resolve(exports.KERNELSPECS);
    };
    MockKernelManager.prototype.listRunning = function (options) {
        var models = [];
        for (var id in Private.runningKernels) {
            var kernel = Private.runningKernels[id];
            models.push({ name: kernel.name, id: id });
        }
        if (!json_1.deepEqual(models, this._running)) {
            this._running = models.slice();
            this.runningChanged.emit(models);
        }
        return Promise.resolve(models);
    };
    MockKernelManager.prototype.startNew = function (options, id) {
        var name = options ? options.name : void 0;
        return Promise.resolve(new MockKernel({ name: name, id: id }));
    };
    MockKernelManager.prototype.findById = function (id, options) {
        if (id in Private.runningKernels) {
            return Promise.resolve(Private.runningKernels[id].model);
        }
        return Promise.resolve(void 0);
    };
    MockKernelManager.prototype.connectTo = function (id, options) {
        if (id in Private.runningKernels) {
            return Promise.resolve(Private.runningKernels[id]);
        }
        return this.startNew(options, id);
    };
    MockKernelManager.prototype.shutdown = function (id, options) {
        var kernel = Private.runningKernels[id];
        if (!kernel) {
            return Promise.reject("No running kernel with id: " + id);
        }
        return kernel.shutdown();
    };
    return MockKernelManager;
}());
exports.MockKernelManager = MockKernelManager;
// Define the signals for the `MockKernel` class.
signaling_1.defineSignal(MockKernel.prototype, 'statusChanged');
signaling_1.defineSignal(MockKernel.prototype, 'iopubMessage');
signaling_1.defineSignal(MockKernel.prototype, 'unhandledMessage');
// Define the signal for the `MockKernelKernelManager` class.
signaling_1.defineSignal(MockKernelManager.prototype, 'specsChanged');
signaling_1.defineSignal(MockKernelManager.prototype, 'runningChanged');
var Private;
(function (Private) {
    /**
     * A module private store for running mock kernels.
     */
    Private.runningKernels = Object.create(null);
})(Private || (Private = {}));
