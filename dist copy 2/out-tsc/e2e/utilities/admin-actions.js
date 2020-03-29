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
import { RepoClient } from './repo-client/repo-client';
import { SitesApi } from './repo-client/apis/sites/sites-api';
import { UploadApi } from './repo-client/apis/upload/upload-api';
import { NodesApi } from './repo-client/apis/nodes/nodes-api';
import { FavoritesApi } from './repo-client/apis/favorites/favorites-api';
import { SearchApi } from './repo-client/apis/search/search-api';
var AdminActions = /** @class */ (function () {
    function AdminActions() {
        this.sites = new SitesApi();
        this.upload = new UploadApi();
        this.nodes = new NodesApi();
        this.favorites = new FavoritesApi();
        this.search = new SearchApi();
        this.adminApi = new RepoClient();
    }
    AdminActions.prototype.getDataDictionaryId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adminApi.nodes.getNodeIdFromParent('Data Dictionary', '-root-')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.getNodeTemplatesFolderId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.adminApi.nodes).getNodeIdFromParent;
                        _c = ['Node Templates'];
                        return [4 /*yield*/, this.getDataDictionaryId()];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                    case 2: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    AdminActions.prototype.getSpaceTemplatesFolderId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.adminApi.nodes).getNodeIdFromParent;
                        _c = ['Space Templates'];
                        return [4 /*yield*/, this.getDataDictionaryId()];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                    case 2: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createUser = function (user) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adminApi.people.createUser(user)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createNodeTemplate = function (name, title, description, author) {
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        if (author === void 0) { author = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var templatesRootFolderId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNodeTemplatesFolderId()];
                    case 1:
                        templatesRootFolderId = _a.sent();
                        return [4 /*yield*/, this.adminApi.nodes.createFile(name, templatesRootFolderId, title, description, author)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createNodeTemplatesHierarchy = function (hierarchy) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adminApi.nodes.createContent(hierarchy, "Data Dictionary/Node Templates")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createSpaceTemplate = function (name, title, description) {
        if (title === void 0) { title = ''; }
        if (description === void 0) { description = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var templatesRootFolderId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpaceTemplatesFolderId()];
                    case 1:
                        templatesRootFolderId = _a.sent();
                        return [4 /*yield*/, this.adminApi.nodes.createFolder(name, templatesRootFolderId, title, description)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createSpaceTemplatesHierarchy = function (hierarchy) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adminApi.nodes.createContent(hierarchy, "Data Dictionary/Space Templates")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.removeUserAccessOnNodeTemplate = function (nodeName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var templatesRootFolderId, nodeId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNodeTemplatesFolderId()];
                    case 1:
                        templatesRootFolderId = _a.sent();
                        return [4 /*yield*/, this.adminApi.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId)];
                    case 2:
                        nodeId = _a.sent();
                        return [4 /*yield*/, this.adminApi.nodes.setInheritPermissions(nodeId, false)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.removeUserAccessOnSpaceTemplate = function (nodeName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var templatesRootFolderId, nodeId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpaceTemplatesFolderId()];
                    case 1:
                        templatesRootFolderId = _a.sent();
                        return [4 /*yield*/, this.adminApi.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId)];
                    case 2:
                        nodeId = _a.sent();
                        return [4 /*yield*/, this.adminApi.nodes.setInheritPermissions(nodeId, false)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.cleanupNodeTemplatesFolder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this.adminApi.nodes).deleteNodeChildren;
                        return [4 /*yield*/, this.getNodeTemplatesFolderId()];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    AdminActions.prototype.cleanupSpaceTemplatesFolder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var spaceTemplatesNodeId, nodesToDelete;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpaceTemplatesFolderId()];
                    case 1:
                        spaceTemplatesNodeId = _a.sent();
                        return [4 /*yield*/, this.adminApi.nodes.getNodeChildren(spaceTemplatesNodeId)];
                    case 2:
                        nodesToDelete = (_a.sent()).list.entries
                            .filter(function (node) { return (node.entry.nodeType !== 'app:folderlink') && (node.entry.name !== 'Software Engineering Project'); })
                            .map(function (node) { return node.entry.id; });
                        return [4 /*yield*/, this.adminApi.nodes.deleteNodesById(nodesToDelete)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createLinkToFileId = function (originalFileId, destinationParentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adminApi.nodes.createFileLink(originalFileId, destinationParentId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createLinkToFileName = function (originalFileName, originalFileParentId, destinationParentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nodeId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!destinationParentId) {
                            destinationParentId = originalFileParentId;
                        }
                        ;
                        return [4 /*yield*/, this.adminApi.nodes.getNodeIdFromParent(originalFileName, originalFileParentId)];
                    case 1:
                        nodeId = _a.sent();
                        return [4 /*yield*/, this.createLinkToFileId(nodeId, destinationParentId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createLinkToFolderId = function (originalFolderId, destinationParentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adminApi.nodes.createFolderLink(originalFolderId, destinationParentId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminActions.prototype.createLinkToFolderName = function (originalFolderName, originalFolderParentId, destinationParentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nodeId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!destinationParentId) {
                            destinationParentId = originalFolderParentId;
                        }
                        ;
                        return [4 /*yield*/, this.adminApi.nodes.getNodeIdFromParent(originalFolderName, originalFolderParentId)];
                    case 1:
                        nodeId = _a.sent();
                        return [4 /*yield*/, this.createLinkToFolderId(nodeId, destinationParentId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AdminActions;
}());
export { AdminActions };
//# sourceMappingURL=admin-actions.js.map