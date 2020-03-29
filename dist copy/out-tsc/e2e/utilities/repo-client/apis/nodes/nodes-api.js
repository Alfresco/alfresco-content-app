/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
import * as tslib_1 from "tslib";
import { RepoApi } from '../repo-api';
import { flattenNodeContentTree } from './node-content-tree';
import { NodesApi as AdfNodeApi } from '@alfresco/js-api';
import { Utils } from '../../../../utilities/utils';
var NodesApi = /** @class */ (function (_super) {
    tslib_1.__extends(NodesApi, _super);
    function NodesApi(username, password) {
        var _this = _super.call(this, username, password) || this;
        _this.nodesApi = new AdfNodeApi(_this.alfrescoJsApi);
        return _this;
    }
    NodesApi.prototype.getNodeByPath = function (relativePath) {
        if (relativePath === void 0) { relativePath = '/'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.getNode('-my-', { relativePath: relativePath })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeByPath.name, error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getNodeById = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var node, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.getNode(id)];
                    case 2:
                        node = _a.sent();
                        return [2 /*return*/, node];
                    case 3:
                        error_2 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeById.name, error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getNodeIdFromParent = function (name, parentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var children, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeChildren(parentId)];
                    case 1:
                        children = (_a.sent()).list.entries;
                        return [2 /*return*/, children.find(function (elem) { return elem.entry.name === name; }).entry.id || ''];
                    case 2:
                        error_3 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeIdFromParent.name, error_3);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getNodeDescription = function (name, parentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var children, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeChildren(parentId)];
                    case 1:
                        children = (_a.sent()).list.entries;
                        return [2 /*return*/, children.find(function (elem) { return elem.entry.name === name; }).entry.properties['cm:description'] || ''];
                    case 2:
                        error_4 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeDescription.name, error_4);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getNodeTitle = function (name, parentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var children, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeChildren(parentId)];
                    case 1:
                        children = (_a.sent()).list.entries;
                        return [2 /*return*/, children.find(function (elem) { return elem.entry.name === name; }).entry.properties['cm:title'] || ''];
                    case 2:
                        error_5 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeTitle.name, error_5);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getNodeProperty = function (nodeId, property) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var node, error_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeById(nodeId)];
                    case 1:
                        node = _a.sent();
                        return [2 /*return*/, (node.entry.properties && node.entry.properties[property]) || ''];
                    case 2:
                        error_6 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeProperty.name, error_6);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getFileVersionType = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var prop, error_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeProperty(nodeId, 'cm:versionType')];
                    case 1:
                        prop = _a.sent();
                        return [2 /*return*/, prop || ''];
                    case 2:
                        error_7 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getFileVersionType.name, error_7);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getFileVersionLabel = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var prop, error_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeProperty(nodeId, 'cm:versionLabel')];
                    case 1:
                        prop = _a.sent();
                        return [2 /*return*/, prop || ''];
                    case 2:
                        error_8 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getFileVersionLabel.name, error_8);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getSharedId = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sharedId, error_9;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeProperty(nodeId, 'qshare:sharedId')];
                    case 1:
                        sharedId = _a.sent();
                        return [2 /*return*/, sharedId || ''];
                    case 2:
                        error_9 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getSharedId.name, error_9);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getSharedExpiryDate = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var expiryDate, error_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeProperty(nodeId, 'qshare:expiryDate')];
                    case 1:
                        expiryDate = _a.sent();
                        return [2 /*return*/, expiryDate || ''];
                    case 2:
                        error_10 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getSharedExpiryDate.name, error_10);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.isFileShared = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sharedId, error_11;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getSharedId(nodeId)];
                    case 1:
                        sharedId = _a.sent();
                        return [2 /*return*/, sharedId !== ''];
                    case 2:
                        error_11 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.isFileShared.name, error_11);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.deleteNodeById = function (id, permanent) {
        if (permanent === void 0) { permanent = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_12;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.deleteNode(id, { permanent: permanent })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_12 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteNodeById.name, error_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.deleteNodeByPath = function (path, permanent) {
        if (permanent === void 0) { permanent = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var id, error_13;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getNodeByPath(path)];
                    case 1:
                        id = (_a.sent()).entry.id;
                        return [4 /*yield*/, this.deleteNodeById(id, permanent)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteNodeByPath.name, error_13);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.deleteNodes = function (names, relativePath, permanent) {
        if (relativePath === void 0) { relativePath = ''; }
        if (permanent === void 0) { permanent = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_14;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, names.reduce(function (previous, current) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var req;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.deleteNodeByPath(relativePath + "/" + current, permanent)];
                                        case 2:
                                            req = _a.sent();
                                            return [2 /*return*/, req];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteNodes.name, error_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.deleteNodesById = function (ids, permanent) {
        if (permanent === void 0) { permanent = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _i, ids_1, id, error_15;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        _i = 0, ids_1 = ids;
                        _a.label = 1;
                    case 1:
                        if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                        id = ids_1[_i];
                        return [4 /*yield*/, this.deleteNodeById(id, permanent)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_15 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteNodesById.name, error_15);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getNodeChildren = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, error_16;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        opts = {
                            include: ['properties']
                        };
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.listNodeChildren(nodeId, opts)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_16 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeChildren.name, error_16);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.deleteNodeChildren = function (parentId, exceptNodesNamed) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listEntries, nodeIds, error_17;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getNodeChildren(parentId)];
                    case 1:
                        listEntries = (_a.sent()).list.entries;
                        nodeIds = void 0;
                        if (exceptNodesNamed) {
                            nodeIds = listEntries
                                .filter(function (entries) { return !exceptNodesNamed.includes(entries.entry.name); })
                                .map(function (entries) { return entries.entry.id; });
                        }
                        else {
                            nodeIds = listEntries.map(function (entries) { return entries.entry.id; });
                        }
                        return [4 /*yield*/, this.deleteNodesById(nodeIds)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_17 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.deleteNodeChildren.name, error_17);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createImageNode = function (name, parentId, title, description) {
        if (parentId === void 0) { parentId = '-my-'; }
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var imageProps, error_18;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imageProps = {
                            'exif:pixelXDimension': 1000,
                            'exif:pixelYDimension': 1200
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.createNode('cm:content', name, parentId, title, description, imageProps)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_18 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createImageNode.name, error_18);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createNode = function (nodeType, name, parentId, title, description, imageProps, author, majorVersion, aspectNames) {
        if (parentId === void 0) { parentId = '-my-'; }
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        if (imageProps === void 0) { imageProps = null; }
        if (author === void 0) { author = ''; }
        if (majorVersion === void 0) { majorVersion = true; }
        if (aspectNames === void 0) { aspectNames = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nodeBody, error_19;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!aspectNames) {
                            aspectNames = ['cm:versionable']; // workaround for REPO-4772
                        }
                        nodeBody = {
                            name: name,
                            nodeType: nodeType,
                            properties: {
                                'cm:title': title,
                                'cm:description': description,
                                'cm:author': author
                            },
                            aspectNames: aspectNames
                        };
                        if (imageProps) {
                            nodeBody.properties = Object.assign(nodeBody.properties, imageProps);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.createNode(parentId, nodeBody, { majorVersion: majorVersion })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_19 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createNode.name, error_19);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createFile = function (name, parentId, title, description, author, majorVersion, aspectNames) {
        if (parentId === void 0) { parentId = '-my-'; }
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        if (author === void 0) { author = ''; }
        if (majorVersion === void 0) { majorVersion = true; }
        if (aspectNames === void 0) { aspectNames = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_20;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createNode('cm:content', name, parentId, title, description, null, author, majorVersion, aspectNames)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_20 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createFile.name, error_20);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createImage = function (name, parentId, title, description) {
        if (parentId === void 0) { parentId = '-my-'; }
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_21;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createImageNode(name, parentId, title, description)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_21 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createImage.name, error_21);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createFolder = function (name, parentId, title, description, author, aspectNames) {
        if (parentId === void 0) { parentId = '-my-'; }
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        if (author === void 0) { author = ''; }
        if (aspectNames === void 0) { aspectNames = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_22;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createNode('cm:folder', name, parentId, title, description, null, author, null, aspectNames)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_22 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createFolder.name, error_22);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createChildren = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_23;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.createNode('-my-', data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_23 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createChildren.name, error_23);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createContent = function (content, relativePath) {
        if (relativePath === void 0) { relativePath = '/'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_24;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createChildren(flattenNodeContentTree(content, relativePath))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_24 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createContent.name, error_24);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createFolders = function (names, relativePath) {
        if (relativePath === void 0) { relativePath = '/'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_25;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createContent({ folders: names }, relativePath)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_25 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createFolders.name, error_25);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createFiles = function (names, relativePath) {
        if (relativePath === void 0) { relativePath = '/'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_26;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createContent({ files: names }, relativePath)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_26 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createFiles.name, error_26);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.addAspects = function (nodeId, aspectNames) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_27;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.nodesApi.updateNode(nodeId, { aspectNames: aspectNames })];
                    case 2:
                        error_27 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.addAspects.name, error_27);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createFileLink = function (originalNodeId, destinationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var name, nodeBody, link, error_28;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNodeById(originalNodeId)];
                    case 1:
                        name = (_a.sent()).entry.name;
                        nodeBody = {
                            name: "Link to " + name + ".url",
                            nodeType: 'app:filelink',
                            properties: {
                                'cm:destination': originalNodeId
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.createNode(destinationId, nodeBody)];
                    case 4:
                        link = _a.sent();
                        return [4 /*yield*/, this.addAspects(originalNodeId, ['app:linked'])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, link];
                    case 6:
                        error_28 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createFileLink.name, error_28);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.createFolderLink = function (originalNodeId, destinationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var name, nodeBody, link, error_29;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNodeById(originalNodeId)];
                    case 1:
                        name = (_a.sent()).entry.name;
                        nodeBody = {
                            name: "Link to " + name + ".url",
                            nodeType: 'app:folderlink',
                            properties: {
                                'cm:title': "Link to " + name + ".url",
                                'cm:destination': originalNodeId,
                                'cm:description': "Link to " + name + ".url",
                                'app:icon': 'space-icon-link'
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.createNode(destinationId, nodeBody)];
                    case 4:
                        link = _a.sent();
                        return [4 /*yield*/, this.addAspects(originalNodeId, ['app:linked'])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, link];
                    case 6:
                        error_29 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.createFolderLink.name, error_29);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // node content
    NodesApi.prototype.getNodeContent = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_30;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.getNodeContent(nodeId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_30 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getNodeContent.name, error_30);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.editNodeContent = function (nodeId, content) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_31;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.updateNodeContent(nodeId, content)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_31 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.editNodeContent.name, error_31);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.renameNode = function (nodeId, newName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_32;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.nodesApi.updateNode(nodeId, { name: newName })];
                    case 2:
                        error_32 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.renameNode.name, error_32);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // node permissions
    NodesApi.prototype.setInheritPermissions = function (nodeId, inheritPermissions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_33;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            permissions: {
                                isInheritanceEnabled: inheritPermissions
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.updateNode(nodeId, data)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_33 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.setGranularPermission.name, error_33);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.setGranularPermission = function (nodeId, inheritPermissions, username, role) {
        if (inheritPermissions === void 0) { inheritPermissions = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_34;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            permissions: {
                                isInheritanceEnabled: inheritPermissions,
                                locallySet: [
                                    {
                                        authorityId: username,
                                        name: role
                                    }
                                ]
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.updateNode(nodeId, data)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_34 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.setGranularPermission.name, error_34);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // lock node
    NodesApi.prototype.lockFile = function (nodeId, lockType) {
        if (lockType === void 0) { lockType = 'ALLOW_OWNER_CHANGES'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, error_35;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            type: lockType
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.lockNode(nodeId, data)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_35 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.lockFile.name, error_35);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.unlockFile = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_36;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.apiAuth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodesApi.unlockNode(nodeId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_36 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.unlockFile.name, error_36);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getLockType = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var lockType, error_37;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeProperty(nodeId, 'cm:lockType')];
                    case 1:
                        lockType = _a.sent();
                        return [2 /*return*/, lockType || ''];
                    case 2:
                        error_37 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getLockType.name, error_37);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.getLockOwner = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var lockOwner, error_38;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getNodeProperty(nodeId, 'cm:lockOwner')];
                    case 1:
                        lockOwner = _a.sent();
                        return [2 /*return*/, lockOwner || ''];
                    case 2:
                        error_38 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.getLockOwner.name, error_38);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.isFileLockedWrite = function (nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_39;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getLockType(nodeId)];
                    case 1: return [2 /*return*/, (_a.sent()) === 'WRITE_LOCK'];
                    case 2:
                        error_39 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.isFileLockedWrite.name, error_39);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NodesApi.prototype.isFileLockedWriteWithRetry = function (nodeId, expect) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, isLocked, locked, error_40;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            expect: expect,
                            retry: 5
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        locked = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getLockType(nodeId)];
                                    case 1:
                                        isLocked = (_a.sent()) === 'WRITE_LOCK';
                                        if (isLocked !== data.expect) {
                                            return [2 /*return*/, Promise.reject(isLocked)];
                                        }
                                        else {
                                            return [2 /*return*/, Promise.resolve(isLocked)];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Utils.retryCall(locked, data.retry)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_40 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.isFileLockedWriteWithRetry.name, error_40);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, isLocked];
                }
            });
        });
    };
    NodesApi.prototype.isFileLockedByName = function (fileName, parentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var id, error_41;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getNodeIdFromParent(fileName, parentId)];
                    case 1:
                        id = _a.sent();
                        return [4 /*yield*/, this.isFileLockedWrite(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_41 = _a.sent();
                        this.handleError(this.constructor.name + " " + this.isFileLockedByName.name, error_41);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return NodesApi;
}(RepoApi));
export { NodesApi };
//# sourceMappingURL=nodes-api.js.map