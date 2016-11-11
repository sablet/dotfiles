// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';
var MockContentsManager = (function () {
    function MockContentsManager() {
        this.methods = [];
        this.DEFAULT_TEXT = 'the quick brown fox jumped over the lazy dog';
        this.ajaxSettings = {};
        this._files = Object.create(null);
        this._checkpoints = Object.create(null);
        this._fileSnaps = Object.create(null);
        this._id = 0;
    }
    /**
     * Create a file with default content.
     */
    MockContentsManager.prototype.createFile = function (path) {
        var model = {
            name: path.split('/').pop(),
            path: path,
            type: 'file',
            content: this.DEFAULT_TEXT
        };
        this._files[path] = model;
    };
    /**
     * Get a path in the format it was saved or created in.
     */
    MockContentsManager.prototype.get = function (path, options) {
        if (options === void 0) { options = {}; }
        this.methods.push('get');
        var model = this._files[path];
        if (!model) {
            return Promise.reject(new Error('Path not found'));
        }
        return Promise.resolve(this._copyModel(model));
    };
    /**
     * Get a download url given an absolute file path.
     */
    MockContentsManager.prototype.getDownloadUrl = function (path) {
        // no-op
        return path;
    };
    MockContentsManager.prototype.newUntitled = function (options) {
        if (options === void 0) { options = {}; }
        this.methods.push('newUntitled');
        var ext = options.ext || '';
        var name = "untitled" + ext;
        var path = options.path + "/" + name;
        var format = 'text';
        if (options.type === 'notebook') {
            format = 'json';
        }
        var model = {
            name: name,
            path: path,
            format: format,
            type: options.type || 'file',
            content: this.DEFAULT_TEXT
        };
        this._files[path] = model;
        return Promise.resolve(this._copyModel(model));
    };
    MockContentsManager.prototype.delete = function (path) {
        this.methods.push('delete');
        delete this._files[path];
        return Promise.resolve(void 0);
    };
    MockContentsManager.prototype.rename = function (path, newPath) {
        this.methods.push('rename');
        var model = this._files[path];
        if (!model) {
            return Promise.reject(new Error('Path not found'));
        }
        model.name = newPath.split('/').pop();
        model.path = newPath;
        delete this._files[path];
        this._files[newPath] = model;
        return Promise.resolve(model);
    };
    MockContentsManager.prototype.save = function (path, options) {
        if (options === void 0) { options = {}; }
        this.methods.push('save');
        if (options) {
            this._files[path] = this._copyModel(options);
        }
        return Promise.resolve(options);
    };
    MockContentsManager.prototype.copy = function (path, toDir) {
        this.methods.push('copy');
        var model = this._files[path];
        if (!model) {
            return Promise.reject(new Error('Path not found'));
        }
        var newModel = JSON.parse(JSON.stringify(model));
        newModel.path = toDir + "/" + model.name;
        this._files[newModel.path] = newModel;
        return Promise.resolve(newModel);
    };
    MockContentsManager.prototype.createCheckpoint = function (path) {
        this.methods.push('createCheckpoint');
        var fileModel = this._files[path];
        if (!fileModel) {
            return Promise.reject(new Error('Path not found'));
        }
        var checkpoints = this._checkpoints[path] || [];
        var id = String(this._id++);
        var date = new Date(Date.now());
        var last_modified = date.toISOString();
        var model = { id: id, last_modified: last_modified };
        checkpoints.push(model);
        this._checkpoints[path] = checkpoints;
        this._fileSnaps[id] = this._copyModel(fileModel);
        return Promise.resolve(model);
    };
    MockContentsManager.prototype.listCheckpoints = function (path) {
        this.methods.push('listCheckpoints');
        var checkpoints = this._checkpoints[path] || [];
        return Promise.resolve(checkpoints);
    };
    MockContentsManager.prototype.restoreCheckpoint = function (path, checkpointID) {
        this.methods.push('restoreCheckpoint');
        this._files[path] = this._copyModel(this._fileSnaps[checkpointID]);
        return Promise.resolve(void 0);
    };
    MockContentsManager.prototype.deleteCheckpoint = function (path, checkpointID) {
        this.methods.push('deleteCheckpoint');
        delete this._fileSnaps[checkpointID];
        return Promise.resolve(void 0);
    };
    MockContentsManager.prototype._copyModel = function (model) {
        return JSON.parse(JSON.stringify(model));
    };
    return MockContentsManager;
}());
exports.MockContentsManager = MockContentsManager;
