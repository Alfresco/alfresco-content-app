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
import { DownloadEffects } from './download.effects';
import { getRepositoryStatus } from '@alfresco/aca-shared/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { EffectsModule } from '@ngrx/effects';

const fakeNodeInfo = {
  nodeId: 'fake-node-id',
  fileName: 'fake-file-name'
};

fdescribe('DownloadEffects', () => {
  let downloadEffects: DownloadEffects;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([DownloadEffects])],
      providers: [
        DownloadEffects,
        provideMockStore()
      ]
    });

    downloadEffects = TestBed.inject(DownloadEffects);
    store = TestBed.inject(MockStore);

    spyOn<any>(downloadEffects, 'download').and.stub();

    store.overrideSelector(getRepositoryStatus, <any>{
      status: {
        isDirectAccessUrlEnabled: false
      }
    });
  });

  it('should download without DAU if DAU is disabled', () => {
    const downloadFileUsingContentUrlSpy = spyOn(downloadEffects, 'downloadFileUsingContentUrl').and.stub();

    downloadEffects.downloadWithEitherDAUOrContentUrl(fakeNodeInfo);

    expect(downloadFileUsingContentUrlSpy).toHaveBeenCalledWith(fakeNodeInfo);
  });

  it('should download with DAU if DAU is enabled', () => {
    store.overrideSelector(getRepositoryStatus, <any>{
      status: {
        isDirectAccessUrlEnabled: true
      }
    });
    const downloadFileUsingDAUSpy = spyOn(downloadEffects, 'downloadFileUsingDAU').and.stub();

    downloadEffects.downloadWithEitherDAUOrContentUrl(fakeNodeInfo);

    expect(downloadFileUsingDAUSpy).toHaveBeenCalledWith(fakeNodeInfo);
  });
});
