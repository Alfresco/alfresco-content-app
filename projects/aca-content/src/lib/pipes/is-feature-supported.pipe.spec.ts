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

import { Subject } from 'rxjs';
import { IsFeatureSupportedInCurrentAcsPipe } from './is-feature-supported.pipe';
import { TestBed } from '@angular/core/testing';
import { AppExtensionService } from '@alfresco/aca-shared';
import { AppStore } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { RepositoryInfo, VersionInfo } from '@alfresco/js-api';

describe('IsFeatureSupportedInCurrentAcsPipe', () => {
  let serviceSpy: jasmine.SpyObj<AppExtensionService>;
  let storeSpy: jasmine.SpyObj<Store<AppStore>>;
  let pipe: IsFeatureSupportedInCurrentAcsPipe;
  let repoStatusSubject: Subject<Partial<RepositoryInfo>>;

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('AppExtensionService', ['isFeatureSupported']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    repoStatusSubject = new Subject<Partial<RepositoryInfo>>();
    TestBed.configureTestingModule({
      providers: [IsFeatureSupportedInCurrentAcsPipe, { provide: AppExtensionService, useValue: serviceSpy }, { provide: Store, useValue: storeSpy }]
    });
    pipe = TestBed.inject(IsFeatureSupportedInCurrentAcsPipe);
  });

  it('should wait until the version property is available before calling isFeatureSupported', (done) => {
    const featureId = 'someFeature';
    serviceSpy.isFeatureSupported.and.returnValue(true);

    storeSpy.select.and.returnValue(repoStatusSubject.asObservable());

    pipe.transform(featureId).subscribe({
      next: (result) => {
        expect(result).toBe(true);
        expect(serviceSpy.isFeatureSupported).toHaveBeenCalledWith(featureId);
        done();
      },
      error: done.fail
    });

    repoStatusSubject.next({});
    expect(serviceSpy.isFeatureSupported).not.toHaveBeenCalled();

    repoStatusSubject.next({ version: {} as VersionInfo });
  });
});
