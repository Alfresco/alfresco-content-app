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

import { CommentsTabComponent } from './comments-tab.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NodePermissionService } from '@alfresco/aca-shared';
import { Node } from '@alfresco/js-api';
import { CommentsModule } from '@alfresco/adf-core';

describe('CommentsTabComponent', () => {
  let component: CommentsTabComponent;
  let fixture: ComponentFixture<CommentsTabComponent>;
  let nodePermissionService: NodePermissionService;
  let checked: string[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CommentsModule],
      declarations: [CommentsTabComponent]
    });

    nodePermissionService = TestBed.inject(NodePermissionService);

    fixture = TestBed.createComponent(CommentsTabComponent);
    component = fixture.componentInstance;

    checked = null;
    spyOn(nodePermissionService, 'check').and.callFake((_source, permissions) => {
      checked = permissions;
      return true;
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('canUpdateNode', () => {
    it('should return [false] if no node selected', () => {
      component.node = null;
      expect(component.canUpdateNode).toBe(false);
    });

    it('should return [false] if node selected is neither file or folder', () => {
      component.node = {
        id: 'test-node-id',
        isFile: false,
        isFolder: false
      } as Node;
      expect(component.canUpdateNode).toBe(false);
    });

    it('should return [false] if node selected is a locked file', () => {
      component.node = {
        id: 'test-node-id',
        isFile: true,
        isFolder: false,
        isLocked: true
      } as Node;
      expect(component.canUpdateNode).toBe(false);
    });

    it('should check [update] permission if node selected is a not locked file', () => {
      component.node = {
        id: 'test-node-id',
        isFile: true,
        isFolder: false
      } as Node;
      expect(component.canUpdateNode).toBe(true);
      expect(checked).toContain('update');
    });

    it('should check [update] permission if node selected is a folder', () => {
      component.node = {
        id: 'test-node-id',
        isFile: false,
        isFolder: true
      } as Node;
      expect(component.canUpdateNode).toBe(true);
      expect(checked).toContain('update');
    });
  });
});
