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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NodeInformationComponent } from './node-information.component';
import { DIALOG_COMPONENT_DATA, RedirectAuthService, UnitTestingUtils } from '@alfresco/adf-core';
import { NodesApiService } from '@alfresco/adf-content-services';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { LibTestingModule } from '@alfresco/aca-shared';
import { JobIdBodyEntry, SizeDetails, SizeDetailsEntry, Node, NodeAssociationPaging, NodeAssociation } from '@alfresco/js-api';

describe('NodeInformationComponent', () => {
  let fixture: ComponentFixture<NodeInformationComponent>;
  let nodeService: NodesApiService;
  let unitTestingUtils: UnitTestingUtils;
  let initiateFolderSizeCalculationSpy: jasmine.Spy<(nodeId: string) => Observable<JobIdBodyEntry>>;
  let getFolderSizeInfoSpy: jasmine.Spy<(nodeId: string, jobId: string) => Observable<SizeDetailsEntry>>;
  let listParentsSpy: jasmine.Spy<(nodeId: string, opts: any) => Observable<NodeAssociationPaging>>;

  const getNumberOfFiles = (): string => unitTestingUtils.getInnerTextByDataAutomationId('node-info-number-of-files');
  const getNodeIcon = (): HTMLImageElement => unitTestingUtils.getByCSS('.aca-node-icon').nativeElement;
  const getNodeName = (): string => unitTestingUtils.getInnerTextByDataAutomationId('node-info-name');
  const getNodeSize = (): string => unitTestingUtils.getInnerTextByDataAutomationId('node-info-size');
  const getNodeLocation = (): string => unitTestingUtils.getInnerTextByCSS('.aca-node-info-location');
  const getNodeCreationDate = (): string => unitTestingUtils.getInnerTextByDataAutomationId('node-info-creation-date');
  const getNodeModifyDate = (): string => unitTestingUtils.getInnerTextByDataAutomationId('node-info-modify-date');

  const mockSub = new Subject<JobIdBodyEntry>();
  const mockFolder = {
    name: 'mock-folder',
    id: 'mock-folder-id',
    path: {
      name: 'mock-folder-path'
    },
    isFolder: true,
    createdAt: new Date(2024, 1, 1, 11, 11),
    modifiedAt: new Date(2024, 2, 2, 22, 22)
  } as Node;
  const mockFile = {
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
  const mockSizeDetailsEntry: SizeDetailsEntry = {
    entry: {
      id: 'mock-id',
      sizeInBytes: '1',
      calculatedAt: 'mock-date',
      numberOfFiles: 1,
      status: SizeDetails.StatusEnum.COMPLETE,
      jobId: 'mock-job-id'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeInformationComponent, LibTestingModule],
      providers: [{ provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: EMPTY } }]
    });
  });

  describe('folder node', () => {
    beforeEach(() => {
      TestBed.overrideProvider(DIALOG_COMPONENT_DATA, { useValue: mockFolder });
      fixture = TestBed.createComponent(NodeInformationComponent);
      nodeService = TestBed.inject(NodesApiService);
      unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
      initiateFolderSizeCalculationSpy = spyOn(nodeService, 'initiateFolderSizeCalculation').and.returnValue(mockSub.asObservable());
      getFolderSizeInfoSpy = spyOn(nodeService, 'getFolderSizeInfo').and.returnValue(EMPTY);
      listParentsSpy = spyOn(nodeService, 'listParents').and.returnValue(of({ list: { entries: [] } } as NodeAssociationPaging));
    });

    it('should display folder icon for folders', () => {
      fixture.detectChanges();
      const icon: HTMLImageElement = getNodeIcon();

      expect(icon.alt).toBe('APP.NODE_INFO.ICON');
      expect(icon.src).toContain('ft_ic_folder.svg');
    });

    it('should render all information in init', () => {
      fixture.detectChanges();
      expect(getNodeName()).toBe('mock-folder');
      expect(getNumberOfFiles()).toBe('APP.NODE_INFO.CALCULATING');
      expect(getNodeSize()).toBe('APP.NODE_INFO.CALCULATING');
      expect(getNodeLocation()).toBe('mock-folder-path');
      expect(getNodeCreationDate()).toBe('01/02/2024 11:11');
      expect(getNodeModifyDate()).toBe('02/03/2024 22:22');
    });

    it('should make API call on init to start folder size calculation', () => {
      fixture.detectChanges();
      expect(initiateFolderSizeCalculationSpy).toHaveBeenCalledWith('mock-folder-id');
    });

    it('should fetch folder size only when the initial folder size calculation request is completed and one second has passed', fakeAsync(() => {
      fixture.detectChanges();
      expect(initiateFolderSizeCalculationSpy).toHaveBeenCalledWith('mock-folder-id');
      expect(getFolderSizeInfoSpy).not.toHaveBeenCalled();
      mockSub.next({ entry: { jobId: 'mock-job-id' } });
      expect(getFolderSizeInfoSpy).not.toHaveBeenCalled();
      tick(1000);
      expect(getFolderSizeInfoSpy).toHaveBeenCalled();
    }));

    it('should make repeated calls to get folder size info, if the response returned from the API is IN_PROGRESS', fakeAsync(() => {
      mockSizeDetailsEntry.entry.status = SizeDetails.StatusEnum.IN_PROGRESS;
      getFolderSizeInfoSpy.and.returnValue(of(mockSizeDetailsEntry));
      fixture.detectChanges();
      expect(getFolderSizeInfoSpy).not.toHaveBeenCalled();
      mockSub.next({ entry: { jobId: 'mock-job-id' } });
      tick(1000);
      expect(getFolderSizeInfoSpy).toHaveBeenCalledTimes(1);
      tick(5000);
      expect(getFolderSizeInfoSpy).toHaveBeenCalledTimes(2);
      tick(5000);
      expect(getFolderSizeInfoSpy).toHaveBeenCalledTimes(3);
      mockSizeDetailsEntry.entry.status = SizeDetails.StatusEnum.COMPLETE;
      tick(5000);
      expect(getFolderSizeInfoSpy).toHaveBeenCalledTimes(4);
      tick(5000);
      expect(getFolderSizeInfoSpy).not.toHaveBeenCalledTimes(5);
      expect(fixture.componentInstance.nodeDetails.numberOfFiles).toBe(1);
    }));

    it('should not make new API request, and display error message if response returned from API is neither COMPLETE, nor IN_PROGRESS', fakeAsync(() => {
      mockSizeDetailsEntry.entry.status = SizeDetails.StatusEnum.NOT_INITIATED;
      getFolderSizeInfoSpy.and.returnValue(of(mockSizeDetailsEntry));
      fixture.detectChanges();
      mockSub.next({ entry: { jobId: 'mock-job-id' } });
      tick(1000);
      fixture.detectChanges();
      expect(getFolderSizeInfoSpy).toHaveBeenCalledTimes(1);
      fixture.detectChanges();
      expect(getNumberOfFiles()).toBe('APP.NODE_INFO.ERROR');
      expect(getNodeSize()).toBe('APP.NODE_INFO.ERROR');
      tick(5000);
      expect(getFolderSizeInfoSpy).not.toHaveBeenCalledTimes(2);
    }));
  });

  describe('file node', () => {
    const secondaryParent: NodeAssociation = {
      id: 'mock-secondary-parent-id',
      name: 'mock-secondary-parent',
      nodeType: 'cm:folder',
      isFolder: true,
      isFile: false,
      path: { name: 'mock-secondary-parent-path' },
      modifiedAt: new Date(),
      modifiedByUser: { id: 'mock-user-id', displayName: 'mock-user' },
      createdAt: new Date(),
      createdByUser: { id: 'mock-user-id', displayName: 'mock-user' }
    };

    const otherSecondaryParent: NodeAssociation = {
      id: 'mock-other-secondary-parent-id',
      name: 'mock-other-secondary-parent',
      nodeType: 'cm:folder',
      isFolder: true,
      isFile: false,
      path: { name: 'mock-other-secondary-parent-path' },
      modifiedAt: new Date(),
      modifiedByUser: { id: 'mock-user-id', displayName: 'mock-user' },
      createdAt: new Date(),
      createdByUser: { id: 'mock-user-id', displayName: 'mock-user' }
    };

    beforeEach(() => {
      TestBed.overrideProvider(DIALOG_COMPONENT_DATA, { useValue: mockFile });
      fixture = TestBed.createComponent(NodeInformationComponent);
      nodeService = TestBed.inject(NodesApiService);
      unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
      listParentsSpy = spyOn(nodeService, 'listParents').and.returnValue(
        of({ list: { entries: [{ entry: secondaryParent }, { entry: otherSecondaryParent }] } } as NodeAssociationPaging)
      );
    });

    it('should display file icon based on the mime type', () => {
      fixture.detectChanges();
      const icon: HTMLImageElement = getNodeIcon();

      expect(icon.alt).toBe('APP.NODE_INFO.ICON');
      expect(icon.src).toContain('ft_ic_document.svg');
    });

    it('should render all information in init', () => {
      fixture.detectChanges();
      expect(getNodeName()).toBe('mock-file');
      expect(getNodeSize()).toBe('1000 CORE.FILE_SIZE.BYTES');
      expect(getNodeLocation()).toBe('mock-file-path');
      expect(getNodeCreationDate()).toBe('01/02/2024 11:11');
      expect(getNodeModifyDate()).toBe('02/03/2024 22:22');
    });

    it('should call API to fetch secondary parent paths', () => {
      fixture.detectChanges();
      expect(listParentsSpy).toHaveBeenCalledWith('mock-file-id', { where: `(isPrimary=false and assocType='cm:contains')`, include: ['path'] });
    });

    it('should display secondary parent paths if there are any', () => {
      fixture.detectChanges();

      const locationLabels = unitTestingUtils.getAllByCSS('.aca-node-location-group .aca-node-info-item-label');
      const secondaryPaths = unitTestingUtils.getAllByCSS('.aca-node-location-group .aca-node-info-secondary-parent .aca-node-info-location');
      expect(locationLabels.length).toBe(2);
      expect(secondaryPaths.length).toBe(2);
      expect(locationLabels[0].nativeElement.innerText).toBe('APP.NODE_INFO.LOCATION');
      expect(locationLabels[1].nativeElement.innerText).toBe('APP.NODE_INFO.REFERENCED');
      expect(secondaryPaths[0].nativeElement.innerText).toBe('mock-secondary-parent-path');
      expect(secondaryPaths[1].nativeElement.innerText).toBe('mock-other-secondary-parent-path');
    });
  });
});
