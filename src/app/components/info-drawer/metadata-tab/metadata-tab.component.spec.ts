/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { MetadataTabComponent } from './metadata-tab.component';
import { NodePermissionService } from '@alfresco/aca-shared';
import { Node } from '@alfresco/js-api';

describe('MetadataTabComponent', () => {
  let nodePermissionService: NodePermissionService;
  let component: MetadataTabComponent;

  beforeEach(() => {
    nodePermissionService = new NodePermissionService();
    const appConfig = <any>{ config: { 'content-metadata': {} } };
    const extension = <any>{ contentMetadata: {} };

    component = new MetadataTabComponent(
      nodePermissionService,
      extension,
      appConfig
    );
  });

  describe('canUpdateNode()', () => {
    it('should return true if node is not locked and has update permission', () => {
      const node = <Node>{
        isLocked: false,
        allowableOperations: ['update']
      };

      component.node = node;
      expect(component.canUpdateNode).toBe(true);
    });

    it('should return false if node is locked', () => {
      const node = <Node>{
        isLocked: true,
        allowableOperations: ['update']
      };

      component.node = node;
      expect(component.canUpdateNode).toBe(false);
    });

    it('should return false if node has no update permission', () => {
      const node = <Node>{
        isLocked: false,
        allowableOperations: ['other']
      };

      component.node = node;
      expect(component.canUpdateNode).toBe(false);
    });

    it('should return false if node has read only property', () => {
      const node = <Node>{
        isLocked: false,
        allowableOperations: ['update'],
        properties: {
          'cm:lockType': 'WRITE_LOCK'
        }
      };

      component.node = node;
      expect(component.canUpdateNode).toBe(false);
    });
  });
});
