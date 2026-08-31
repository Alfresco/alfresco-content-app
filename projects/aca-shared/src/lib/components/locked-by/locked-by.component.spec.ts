/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { LockedByComponent } from './locked-by.component';

describe('LockedByComponent', () => {
  it('should show lock owner for a locked file', () => {
    const component = new LockedByComponent();
    component.node = {
      entry: {
        aspectNames: [],
        properties: {
          'cm:lockOwner': { displayName: 'lock-owner' }
        }
      } as any
    };
    component.ngOnInit();
    expect(component.workingCopy).toBeFalse();
    expect(component.text).toBe('lock-owner');
  });

  it('should show working copy owner for a working copy', () => {
    const component = new LockedByComponent();
    component.node = {
      entry: {
        aspectNames: ['cm:workingcopy'],
        properties: {
          'cm:workingCopyOwner': { displayName: 'wc-owner' }
        }
      } as any
    };
    component.ngOnInit();
    expect(component.workingCopy).toBeTrue();
    expect(component.text).toBe('wc-owner');
  });
});
