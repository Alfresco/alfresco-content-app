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

import { NodeBodyCreate, NODE_TYPE_FILE, NODE_TYPE_FOLDER, NODE_TITLE, NODE_DESCRIPTION } from './node-body-create';

export interface NodeContentTree {
  name?: string;
  files?: string[];
  folders?: (string | NodeContentTree)[];
  title?: string;
  description?: string;
}

export function flattenNodeContentTree(content: NodeContentTree, relativePath: string = '/'): NodeBodyCreate[] {
  const { name, files, folders, title, description } = content;
  const aspectNames: string[] = ['cm:versionable'];
  let data: NodeBodyCreate[] = [];
  let properties: any;

  properties = {
    [NODE_TITLE]: title,
    [NODE_DESCRIPTION]: description
  };

  if (name) {
    data = data.concat([
      {
        nodeType: NODE_TYPE_FOLDER,
        name,
        relativePath,
        properties
      }
    ]);

    relativePath = relativePath === '/' ? `/${name}` : `${relativePath}/${name}`;
  }

  if (folders) {
    const foldersData: NodeBodyCreate[] = folders
      .map((folder: string | NodeContentTree): NodeBodyCreate[] => {
        const folderData: NodeContentTree = typeof folder === 'string' ? { name: folder } : folder;

        return flattenNodeContentTree(folderData, relativePath);
      })
      .reduce((nodesData: NodeBodyCreate[], folderData: NodeBodyCreate[]) => nodesData.concat(folderData), []);

    data = data.concat(foldersData);
  }

  if (files) {
    const filesData: NodeBodyCreate[] = files.map(
      (filename: string): NodeBodyCreate => ({
        nodeType: NODE_TYPE_FILE,
        name: filename,
        relativePath,
        aspectNames
      })
    );

    data = data.concat(filesData);
  }

  return data;
}
