// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';
/**
 * A namespace for kernel messages.
 */
var KernelMessage;
(function (KernelMessage) {
    /**
     * Test whether a kernel message is a `'stream'` message.
     */
    function isStreamMsg(msg) {
        return msg.header.msg_type === 'stream';
    }
    KernelMessage.isStreamMsg = isStreamMsg;
    /**
     * Test whether a kernel message is an `'display_data'` message.
     */
    function isDisplayDataMsg(msg) {
        return msg.header.msg_type === 'display_data';
    }
    KernelMessage.isDisplayDataMsg = isDisplayDataMsg;
    /**
     * Test whether a kernel message is an `'execute_input'` message.
     */
    function isExecuteInputMsg(msg) {
        return msg.header.msg_type === 'execute_input';
    }
    KernelMessage.isExecuteInputMsg = isExecuteInputMsg;
    /**
     * Test whether a kernel message is an `'execute_result'` message.
     */
    function isExecuteResultMsg(msg) {
        return msg.header.msg_type === 'execute_result';
    }
    KernelMessage.isExecuteResultMsg = isExecuteResultMsg;
    /**
     * Test whether a kernel message is an `'error'` message.
     */
    function isErrorMsg(msg) {
        return msg.header.msg_type === 'error';
    }
    KernelMessage.isErrorMsg = isErrorMsg;
    /**
     * Test whether a kernel message is a `'status'` message.
     */
    function isStatusMsg(msg) {
        return msg.header.msg_type === 'status';
    }
    KernelMessage.isStatusMsg = isStatusMsg;
    /**
     * Test whether a kernel message is a `'clear_output'` message.
     */
    function isClearOutputMsg(msg) {
        return msg.header.msg_type === 'clear_output';
    }
    KernelMessage.isClearOutputMsg = isClearOutputMsg;
    /**
     * Test whether a kernel message is a `'comm_open'` message.
     */
    function isCommOpenMsg(msg) {
        return msg.header.msg_type === 'comm_open';
    }
    KernelMessage.isCommOpenMsg = isCommOpenMsg;
    /**
     * Test whether a kernel message is a `'comm_close'` message.
     */
    function isCommCloseMsg(msg) {
        return msg.header.msg_type === 'comm_close';
    }
    KernelMessage.isCommCloseMsg = isCommCloseMsg;
    /**
     * Test whether a kernel message is a `'comm_msg'` message.
     */
    function isCommMsgMsg(msg) {
        return msg.header.msg_type === 'comm_msg';
    }
    KernelMessage.isCommMsgMsg = isCommMsgMsg;
    ;
    /**
     * Test whether a kernel message is an `'input_request'` message.
     */
    function isInputRequestMsg(msg) {
        return msg.header.msg_type === 'input_request';
    }
    KernelMessage.isInputRequestMsg = isInputRequestMsg;
})(KernelMessage = exports.KernelMessage || (exports.KernelMessage = {}));
