/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_COMPONENT_DATA, UnitTestingUtils } from '@alfresco/adf-core';
import { NodesApiService } from '@alfresco/adf-content-services';
import { LibTestingModule } from '@alfresco/aca-shared';
import { Node, NodeAssociation } from '@alfresco/js-api';
import { NodeLocationReferencesComponent } from './node-location-references.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('NodeLocationReferencesComponent', () => {
  let fixture: ComponentFixture<NodeLocationReferencesComponent>;
  let nodeService: NodesApiService;
  let unitTestingUtils: UnitTestingUtils;
  let router: Router;

  const checkNavigationUrl = (event: Event, node: NodeAssociation, expectedUrl: string): void => {
    spyOn(router, 'parseUrl').and.returnValue({ root: { children: [] } } as any);
    spyOn(router, 'serializeUrl');
    spyOn(window, 'open');

    fixture.componentInstance.goToLocation(event, node);

    expect(router.parseUrl).toHaveBeenCalledWith(expectedUrl);
  };

  const getNoLocationsMessage = (): string => unitTestingUtils.getInnerTextByCSS('.app-node-location-reference-no-locations');

  const verifyIfNavigationHappened = (event: Event, node: NodeAssociation): void => {
    spyOn(window, 'open');
    fixture.componentInstance.goToLocation(event, node);
    expect(window.open).not.toHaveBeenCalled();
  };

  const mockNode = {
    name: 'mock-file',
    id: 'mock-file-id',
    path: {
      name: 'mock-file-path'
    },
    isFolder: false,
    isFile: true,
    content: {
      mimeType: 'text/plain',
      sizeInBytes: 1000
    },
    createdAt: new Date(2024, 1, 1, 11, 11),
    modifiedAt: new Date(2024, 2, 2, 22, 22)
  } as Node;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeLocationReferencesComponent, LibTestingModule],
      providers: [{ provide: DIALOG_COMPONENT_DATA, useValue: mockNode }]
    });

    fixture = TestBed.createComponent(NodeLocationReferencesComponent);
    nodeService = TestBed.inject(NodesApiService);
    router = TestBed.inject(Router);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
  });

  it('should display proper message when there are no additional reference locations', () => {
    spyOn(nodeService, 'listParents').and.returnValue(of({ list: { entries: [] } }));
    fixture.detectChanges();

    expect(getNoLocationsMessage()).toBe('APP.ADDITIONAL_REFERENCES_DIALOG.NO_LOCATIONS');
  });

  it('should display proper message when list parents api fails', () => {
    spyOn(nodeService, 'listParents').and.returnValue(throwError(() => new Error('API Error')));
    fixture.detectChanges();

    expect(getNoLocationsMessage()).toBe('APP.ADDITIONAL_REFERENCES_DIALOG.NO_LOCATIONS');
  });

  describe('Additional reference locations', () => {
    let additionalLocation1: NodeAssociation;
    let additionalLocation2: NodeAssociation;
    const mockEvent = jasmine.createSpyObj('MouseEvent', ['preventDefault']);

    beforeEach(() => {
      additionalLocation1 = {
        name: 'additional-location-1',
        id: 'additional-location-1-id',
        nodeType: 'cm:folder',
        isFolder: true,
        isFile: false,
        modifiedAt: new Date(2024, 3, 3, 15, 15),
        modifiedByUser: {
          id: 'user-id',
          displayName: 'User Name'
        },
        createdAt: new Date(2024, 3, 3, 14, 14),
        createdByUser: {
          id: 'user-id',
          displayName: 'User Name'
        },
        path: {
          name: 'additional-location-1-path',
          elements: [{ name: 'Company Home' }, { name: 'Sites' }, { name: 'My Site' }]
        }
      };
      additionalLocation2 = {
        name: 'additional-location-2',
        id: 'additional-location-2-id',
        nodeType: 'cm:file',
        isFolder: false,
        isFile: true,
        modifiedAt: new Date(2024, 3, 3, 15, 15),
        modifiedByUser: {
          id: 'user-id',
          displayName: 'User Name'
        },
        createdAt: new Date(2024, 3, 3, 14, 14),
        createdByUser: {
          id: 'user-id',
          displayName: 'User Name'
        },
        path: {
          name: 'additional-location-2-path',
          elements: [{ name: 'Company Home' }, { name: 'Sites' }, { name: 'My Site 2' }]
        }
      };
      spyOn(nodeService, 'listParents').and.returnValue(of({ list: { entries: [{ entry: additionalLocation1 }, { entry: additionalLocation2 }] } }));
      fixture.detectChanges();
    });

    it('should display proper title for additional reference locations', () => {
      expect(unitTestingUtils.getInnerTextByCSS('.app-node-location-reference-title')).toBe('APP.ADDITIONAL_REFERENCES_DIALOG.DESCRIPTION');
    });

    it('should display folder icon and correct link for additional reference location', () => {
      const link: HTMLAnchorElement = unitTestingUtils.getByCSS('.app-node-location-reference-link').nativeElement;

      expect(unitTestingUtils.getInnerTextByCSS('.app-node-location-reference-icon')).toBe('folder');
      expect(link.getAttribute('title')).toBe('additional-location-1-path');
      expect(link.innerText).toBe('additional-location-1-path');
    });

    it('should prevent default event behavior when navigating to a location', () => {
      fixture.componentInstance.goToLocation(mockEvent, additionalLocation1);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to location when reference link is clicked', () => {
      spyOn(router, 'parseUrl').and.returnValue({ root: { children: [] } } as any);
      spyOn(router, 'serializeUrl').and.returnValue('#/libraries/additional-location-1-id');
      spyOn(window, 'open');
      spyOn(fixture.componentInstance, 'goToLocation').and.callThrough();

      unitTestingUtils.clickByCSS('.app-node-location-reference-link');

      expect(fixture.componentInstance.goToLocation).toHaveBeenCalledWith(jasmine.any(MouseEvent), additionalLocation1);
      expect(router.parseUrl).toHaveBeenCalledWith('#/libraries/additional-location-1-id');
      expect(router.serializeUrl).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith('#/libraries/additional-location-1-id', '_blank');
    });

    it('should navigate to libraries area when path has Sites as second element', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: {
          name: '/Company Home/Sites/My Site',
          elements: [{ name: 'Company Home' }, { name: 'Sites' }, { name: 'My Site' }]
        }
      } as NodeAssociation;

      checkNavigationUrl(mockEvent, node, '#/libraries/test-node-id');
    });

    it('should navigate to libraries area when path has more than 2 elements with Sites as second', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: {
          name: '/Company Home/Sites/My Site/Folder1',
          elements: [{ name: 'Company Home' }, { name: 'Sites' }, { name: 'My Site' }, { name: 'Folder1' }]
        }
      } as NodeAssociation;

      checkNavigationUrl(mockEvent, node, '#/libraries/test-node-id');
    });

    it('should navigate to personal-files area when path has User Homes as second element', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: {
          name: '/Company Home/User Homes/user123',
          elements: [{ name: 'Company Home' }, { name: 'User Homes' }, { name: 'user123' }]
        }
      } as NodeAssociation;

      checkNavigationUrl(mockEvent, node, '#/personal-files/test-node-id');
    });

    it('should navigate to personal-files area when path has only one element', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: {
          name: '/Company Home',
          elements: [{ name: 'Company Home' }]
        }
      } as NodeAssociation;

      checkNavigationUrl(mockEvent, node, '#/personal-files/test-node-id');
    });

    it('should not open window when path is undefined', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: undefined
      } as NodeAssociation;

      verifyIfNavigationHappened(mockEvent, node);
    });

    it('should not open window when path.name is missing', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: {
          name: undefined,
          elements: [{ name: 'Company Home' }]
        }
      } as NodeAssociation;

      verifyIfNavigationHappened(mockEvent, node);
    });

    it('should not open window when path.elements is missing', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: {
          name: '/Company Home',
          elements: undefined
        }
      } as NodeAssociation;

      verifyIfNavigationHappened(mockEvent, node);
    });

    it('should not open window when path.name is empty string', () => {
      const node: NodeAssociation = {
        id: 'test-node-id',
        name: 'Test Node',
        path: {
          name: '',
          elements: [{ name: 'Company Home' }]
        }
      } as NodeAssociation;

      verifyIfNavigationHappened(mockEvent, node);
    });
  });
});
