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
import { NODE_TYPE_FILE, NODE_TYPE_FOLDER, NODE_TITLE, NODE_DESCRIPTION } from './node-body-create';
export function flattenNodeContentTree(content, relativePath) {
    if (relativePath === void 0) { relativePath = '/'; }
    var _a;
    var name = content.name, files = content.files, folders = content.folders, title = content.title, description = content.description;
    var aspectNames = ['cm:versionable'];
    var data = [];
    var properties;
    properties = (_a = {},
        _a[NODE_TITLE] = title,
        _a[NODE_DESCRIPTION] = description,
        _a);
    if (name) {
        data = data.concat([{
                nodeType: NODE_TYPE_FOLDER,
                name: name,
                relativePath: relativePath,
                properties: properties
            }]);
        relativePath = (relativePath === '/')
            ? "/" + name
            : relativePath + "/" + name;
    }
    if (folders) {
        var foldersData = folders
            .map(function (folder) {
            var folderData = (typeof folder === 'string')
                ? { name: folder }
                : folder;
            return flattenNodeContentTree(folderData, relativePath);
        })
            .reduce(function (nodesData, folderData) { return nodesData.concat(folderData); }, []);
        data = data.concat(foldersData);
    }
    if (files) {
        var filesData = files
            .map(function (filename) { return ({
            nodeType: NODE_TYPE_FILE,
            name: filename,
            relativePath: relativePath,
            aspectNames: aspectNames
        }); });
        data = data.concat(filesData);
    }
    return data;
}
//# sourceMappingURL=node-content-tree.js.map