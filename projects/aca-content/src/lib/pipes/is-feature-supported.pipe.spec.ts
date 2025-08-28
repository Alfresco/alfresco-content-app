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

import { of } from 'rxjs';
import { IsFeatureSupportedInCurrentAcsPipe } from './is-feature-supported.pipe';

class MockAppExtensionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFeatureSupported(_feature: string) {
    return true;
  }
}

describe('IsFeatureSupportedInCurrentAcsPipe', () => {
  let serviceSpy: jasmine.SpyObj<MockAppExtensionService>;
  let storeSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('MockAppExtensionService', ['isFeatureSupported']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
  });

  it('should create an instance', () => {
    const pipe = new IsFeatureSupportedInCurrentAcsPipe(serviceSpy as any, storeSpy);
    expect(pipe).toBeTruthy();
  });

  it('should call isFeatureSupported in AppExtensionService', (done) => {
    serviceSpy.isFeatureSupported.and.returnValue(false);
    storeSpy.select.and.returnValue(of('7.4.0'));
    const pipe = new IsFeatureSupportedInCurrentAcsPipe(serviceSpy as any, storeSpy);
    pipe.transform('someFeature').subscribe((result) => {
      expect(result).toBe(false);
      expect(serviceSpy.isFeatureSupported).toHaveBeenCalledWith('someFeature');
      done();
    });
  });
});
