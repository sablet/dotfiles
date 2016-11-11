// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';
/**
 * Required fields for `IKernelHeader`.
 */
var HEADER_FIELDS = ['username', 'version', 'session', 'msg_id', 'msg_type'];
/**
 * Requred fields and types for contents of various types of `kernel.IMessage`
 * messages on the iopub channel.
 */
var IOPUB_CONTENT_FIELDS = {
    stream: { name: 'string', text: 'string' },
    display_data: { data: 'object', metadata: 'object' },
    execute_input: { code: 'string', execution_count: 'number' },
    execute_result: { execution_count: 'number', data: 'object',
        metadata: 'object' },
    error: { ename: 'string', evalue: 'string', traceback: 'object' },
    status: { execution_state: 'string' },
    clear_output: { wait: 'boolean' },
    comm_open: { comm_id: 'string', target_name: 'string', data: 'object' },
    comm_msg: { comm_id: 'string', data: 'object' },
    comm_close: { comm_id: 'string' },
    shutdown_reply: { restart: 'boolean' } // Emitted by the IPython kernel.
};
/**
 * Validate a property as being on an object, and optionally
 * of a given type.
 */
function validateProperty(object, name, typeName) {
    if (!object.hasOwnProperty(name)) {
        throw Error("Missing property '" + name + "'");
    }
    if (typeName !== void 0) {
        var valid = true;
        var value = object[name];
        switch (typeName) {
            case 'array':
                valid = Array.isArray(value);
                break;
            case 'object':
                valid = typeof value !== 'undefined';
                break;
            default:
                valid = typeof value === typeName;
        }
        if (!valid) {
            throw new Error("Property '" + name + "' is not of type '" + typeName);
        }
    }
}
/**
 * Validate the header of a kernel message.
 */
function validateKernelHeader(header) {
    for (var i = 0; i < HEADER_FIELDS.length; i++) {
        validateProperty(header, HEADER_FIELDS[i], 'string');
    }
}
/**
 * Validate a kernel message object.
 */
function validateKernelMessage(msg) {
    validateProperty(msg, 'metadata', 'object');
    validateProperty(msg, 'content', 'object');
    validateProperty(msg, 'channel', 'string');
    validateProperty(msg, 'buffers', 'array');
    validateKernelHeader(msg.header);
    if (Object.keys(msg.parent_header).length > 0) {
        validateKernelHeader(msg.parent_header);
    }
    if (msg.channel === 'iopub') {
        validateIOPubContent(msg);
    }
}
exports.validateKernelMessage = validateKernelMessage;
/**
 * Validate content an kernel message on the iopub channel.
 */
function validateIOPubContent(msg) {
    if (msg.channel === 'iopub') {
        var fields = IOPUB_CONTENT_FIELDS[msg.header.msg_type];
        if (fields === void 0) {
            throw Error("Invalid Kernel message: iopub message type " + msg.header.msg_type + " not recognized");
        }
        var names = Object.keys(fields);
        var content = msg.content;
        for (var i = 0; i < names.length; i++) {
            validateProperty(content, names[i], fields[names[i]]);
        }
    }
}
/**
 * Validate an `IKernel.IModel` object.
 */
function validateKernelModel(model) {
    validateProperty(model, 'name', 'string');
    validateProperty(model, 'id', 'string');
}
exports.validateKernelModel = validateKernelModel;
/**
 * Validate an `ISession.IModel` object.
 */
function validateSessionModel(model) {
    validateProperty(model, 'id', 'string');
    validateProperty(model, 'notebook', 'object');
    validateProperty(model, 'kernel', 'object');
    validateKernelModel(model.kernel);
    validateProperty(model.notebook, 'path', 'string');
}
exports.validateSessionModel = validateSessionModel;
/**
 * Validate an `IKernel.ISpecModel` object.
 */
function validateKernelSpecModel(info) {
    validateProperty(info, 'name', 'string');
    validateProperty(info, 'spec', 'object');
    validateProperty(info, 'resources', 'object');
    var spec = info.spec;
    validateProperty(spec, 'language', 'string');
    validateProperty(spec, 'display_name', 'string');
    validateProperty(spec, 'argv', 'array');
}
exports.validateKernelSpecModel = validateKernelSpecModel;
/**
 * Validate an `IContents.IModel` object.
 */
function validateContentsModel(model) {
    validateProperty(model, 'name', 'string');
    validateProperty(model, 'path', 'string');
    validateProperty(model, 'type', 'string');
    validateProperty(model, 'created', 'string');
    validateProperty(model, 'last_modified', 'string');
    validateProperty(model, 'mimetype', 'object');
    validateProperty(model, 'content', 'object');
    validateProperty(model, 'format', 'object');
}
exports.validateContentsModel = validateContentsModel;
/**
 * Validate an `IContents.ICheckpointModel` object.
 */
function validateCheckpointModel(model) {
    validateProperty(model, 'id', 'string');
    validateProperty(model, 'last_modified', 'string');
}
exports.validateCheckpointModel = validateCheckpointModel;
