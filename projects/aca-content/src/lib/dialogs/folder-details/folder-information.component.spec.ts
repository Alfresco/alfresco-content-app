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
import { FolderInformationComponent } from './folder-information.component';
import { DIALOG_COMPONENT_DATA, RedirectAuthService, UnitTestingUtils } from '@alfresco/adf-core';
import { ContentService, NodesApiService } from '@alfresco/adf-content-services';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { LibTestingModule } from '@alfresco/aca-shared';
import { JobIdBodyEntry, SizeDetails, SizeDetailsEntry, Node } from '@alfresco/js-api';

describe('FolderInformationComponent', () => {
  let fixture: ComponentFixture<FolderInformationComponent>;
  let nodeService: NodesApiService;
  let unitTestingUtils: UnitTestingUtils;
  let initiateFolderSizeCalculationSpy: jasmine.Spy<(nodeId: string) => Observable<JobIdBodyEntry>>;
  let getFolderSizeInfoSpy: jasmine.Spy<(nodeId: string, jobId: string) => Observable<SizeDetailsEntry>>;

  const getNumberOfFiles = (): string => unitTestingUtils.getInnerTextByDataAutomationId('folder-info-number-of-files');

  const mockSub = new Subject<JobIdBodyEntry>();
  const dialogData = {
    name: 'mock-folder',
    id: 'mock-folder-id',
    path: {
      name: 'mock-folder-path'
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
      imports: [FolderInformationComponent, LibTestingModule],
      providers: [
        { provide: DIALOG_COMPONENT_DATA, useValue: dialogData },
        { provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: EMPTY } }
      ]
    });
    fixture = TestBed.createComponent(FolderInformationComponent);
    nodeService = TestBed.inject(NodesApiService);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    spyOn(TestBed.inject(ContentService), 'getNodeIcon').and.returnValue('./assets/images/ft_ic_folder.svg');
    initiateFolderSizeCalculationSpy = spyOn(nodeService, 'initiateFolderSizeCalculation').and.returnValue(mockSub.asObservable());
    getFolderSizeInfoSpy = spyOn(nodeService, 'getFolderSizeInfo').and.returnValue(EMPTY);
  });

  it('should render all information in init', () => {
    fixture.detectChanges();
    expect(unitTestingUtils.getInnerTextByDataAutomationId('folder-info-name')).toBe('mock-folder');
    expect(getNumberOfFiles()).toBe('APP.FOLDER_INFO.CALCULATING');
    expect(unitTestingUtils.getInnerTextByDataAutomationId('folder-info-size')).toBe('APP.FOLDER_INFO.CALCULATING');
    expect(unitTestingUtils.getInnerTextByDataAutomationId('folder-info-location')).toBe('mock-folder-path');
    expect(unitTestingUtils.getInnerTextByDataAutomationId('folder-info-creation-date')).toBe('01/02/2024 11:11');
    expect(unitTestingUtils.getInnerTextByDataAutomationId('folder-info-modify-date')).toBe('02/03/2024 22:22');
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
    expect(fixture.componentInstance.folderDetails.numberOfFiles).toBe(1);
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
    expect(getNumberOfFiles()).toBe('APP.FOLDER_INFO.ERROR');
    expect(unitTestingUtils.getInnerTextByDataAutomationId('folder-info-size')).toBe('APP.FOLDER_INFO.ERROR');
    tick(5000);
    expect(getFolderSizeInfoSpy).not.toHaveBeenCalledTimes(2);
  }));
});
