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

import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../testing/app-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ContentUrlService } from './content-url.service';
import { getRepositoryStatus } from '@alfresco/aca-shared/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { of, throwError } from 'rxjs';

describe('ContentUrlService', () => {
  let contentUrlService: ContentUrlService;
  let contentApiService: ContentApiService;
  let store: MockStore;

  const fakeNodeId = 'fake-node-id';
  const fakeVersionId = 'fake-version-id';
  const fakeNodeContentUrl = 'https://api.example.com/fake-node-content-url';
  const fakeNodeDirectAccessUrl = 'https://remote.example.com/fake-node-content-url';
  const requestDauMock = {
    entry: {
      contentUrl: fakeNodeDirectAccessUrl,
      attachment: true,
      expiryTime: new Date()
    }
  };
  const requestDauErrorMock = { error: 'fakeError' };

  const overrideSelectorWithEnabledDAU = () => {
    store.overrideSelector(getRepositoryStatus, {
      status: {
        isDirectAccessUrlEnabled: true
      }
    } as any);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [provideMockStore()]
    });

    contentUrlService = TestBed.inject(ContentUrlService);
    contentApiService = TestBed.inject(ContentApiService);
    store = TestBed.inject(MockStore);

    store.overrideSelector(getRepositoryStatus, {
      status: {
        isDirectAccessUrlEnabled: false
      }
    } as any);
  });

  describe('Nodes', () => {
    let getContentUrlSpy: jasmine.Spy;
    let requestNodeDirectAccessUrlSpy: jasmine.Spy;

    beforeEach(() => {
      getContentUrlSpy = spyOn(contentApiService, 'getContentUrl').and.returnValue(fakeNodeContentUrl);
    });

    it('should get the node URL from the content API if DAU is disabled', async () => {
      requestNodeDirectAccessUrlSpy = spyOn(contentApiService, 'requestNodeDirectAccessUrl').and.returnValue(of(requestDauMock));

      const url = await contentUrlService.getNodeContentUrl(fakeNodeId).toPromise();

      expect(url).toBe(fakeNodeContentUrl);
      expect(getContentUrlSpy).toHaveBeenCalledWith(fakeNodeId, true);
      expect(requestNodeDirectAccessUrlSpy).not.toHaveBeenCalled();
    });

    it('should get the node URL from remote if DAU is enabled', async () => {
      overrideSelectorWithEnabledDAU();
      requestNodeDirectAccessUrlSpy = spyOn(contentApiService, 'requestNodeDirectAccessUrl').and.returnValue(of(requestDauMock));

      const url = await contentUrlService.getNodeContentUrl(fakeNodeId).toPromise();

      expect(url).toBe(fakeNodeDirectAccessUrl);
      expect(getContentUrlSpy).not.toHaveBeenCalled();
      expect(requestNodeDirectAccessUrlSpy).toHaveBeenCalledWith(fakeNodeId);
    });

    it('should fallback to getting the node URL from the content API if an error occurs requesting a DAU', async () => {
      overrideSelectorWithEnabledDAU();
      requestNodeDirectAccessUrlSpy = spyOn(contentApiService, 'requestNodeDirectAccessUrl').and.returnValue(throwError(requestDauErrorMock));

      const url = await contentUrlService.getNodeContentUrl(fakeNodeId).toPromise();

      expect(url).toBe(fakeNodeContentUrl);
      expect(getContentUrlSpy).toHaveBeenCalledWith(fakeNodeId, true);
      expect(requestNodeDirectAccessUrlSpy).toHaveBeenCalledWith(fakeNodeId);
    });
  });

  describe('Versions', () => {
    let getVersionContentUrlSpy: jasmine.Spy;
    let requestVersionDirectAccessUrlSpy: jasmine.Spy;

    beforeEach(() => {
      getVersionContentUrlSpy = spyOn(contentApiService, 'getVersionContentUrl').and.returnValue(fakeNodeContentUrl);
    });

    it('should get the version URL from the content API if DAU is disabled', async () => {
      requestVersionDirectAccessUrlSpy = spyOn(contentApiService, 'requestVersionDirectAccessUrl').and.returnValue(of(requestDauMock));

      const url = await contentUrlService.getVersionContentUrl(fakeNodeId, fakeVersionId).toPromise();

      expect(url).toBe(fakeNodeContentUrl);
      expect(getVersionContentUrlSpy).toHaveBeenCalledWith(fakeNodeId, fakeVersionId, true);
      expect(requestVersionDirectAccessUrlSpy).not.toHaveBeenCalled();
    });

    it('should get the version URL from remote if DAU is enabled', async () => {
      overrideSelectorWithEnabledDAU();
      requestVersionDirectAccessUrlSpy = spyOn(contentApiService, 'requestVersionDirectAccessUrl').and.returnValue(of(requestDauMock));

      const url = await contentUrlService.getVersionContentUrl(fakeNodeId, fakeVersionId).toPromise();

      expect(url).toBe(fakeNodeDirectAccessUrl);
      expect(getVersionContentUrlSpy).not.toHaveBeenCalled();
      expect(requestVersionDirectAccessUrlSpy).toHaveBeenCalledWith(fakeNodeId, fakeVersionId);
    });

    it('should fallback to getting the version URL from the content API if an error occurs requesting a DAU', async () => {
      overrideSelectorWithEnabledDAU();
      requestVersionDirectAccessUrlSpy = spyOn(contentApiService, 'requestVersionDirectAccessUrl').and.returnValue(throwError(requestDauErrorMock));

      const url = await contentUrlService.getVersionContentUrl(fakeNodeId, fakeVersionId).toPromise();

      expect(url).toBe(fakeNodeContentUrl);
      expect(getVersionContentUrlSpy).toHaveBeenCalledWith(fakeNodeId, fakeVersionId, true);
      expect(requestVersionDirectAccessUrlSpy).toHaveBeenCalledWith(fakeNodeId, fakeVersionId);
    });
  });
});
