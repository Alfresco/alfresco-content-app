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
import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NodePermissionService } from '@alfresco/aca-shared';
describe('CommentsTabComponent', function() {
  var component;
  var fixture;
  var permissionsMock = {
    check: jasmine.createSpy('check')
  };
  var checked;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [CommentsTabComponent],
      providers: [
        { provide: NodePermissionService, useValue: permissionsMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CommentsTabComponent);
    component = fixture.componentInstance;
    checked = null;
    permissionsMock.check.and.callFake(function(source, permissions) {
      checked = permissions;
      return true;
    });
  });
  afterEach(function() {
    fixture.destroy();
  });
  describe('canUpdateNode', function() {
    it('should return [false] if no node selected', function() {
      component.node = null;
      expect(component.canUpdateNode).toBe(false);
    });
    it('should return [false] if node selected is neither file or folder', function() {
      var testNode = {
        id: 'test-node-id',
        isFile: false,
        isFolder: false
      };
      component.node = testNode;
      expect(component.canUpdateNode).toBe(false);
    });
    it('should return [false] if node selected is a locked file', function() {
      var testNode = {
        id: 'test-node-id',
        isFile: true,
        isFolder: false,
        isLocked: true
      };
      component.node = testNode;
      expect(component.canUpdateNode).toBe(false);
    });
    it('should check [update] permission if node selected is a not locked file', function() {
      var testNode = {
        id: 'test-node-id',
        isFile: true,
        isFolder: false
      };
      component.node = testNode;
      expect(component.canUpdateNode).toBe(true);
      expect(checked).toContain('update');
    });
    it('should check [update] permission if node selected is a folder', function() {
      var testNode = {
        id: 'test-node-id',
        isFile: false,
        isFolder: true
      };
      component.node = testNode;
      expect(component.canUpdateNode).toBe(true);
      expect(checked).toContain('update');
    });
  });
});
//# sourceMappingURL=comments-tab.component.spec.js.map
