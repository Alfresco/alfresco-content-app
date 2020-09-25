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

import { ToggleSharedComponent } from './toggle-shared.component';
import { of } from 'rxjs';

describe('ToggleSharedComponent', () => {
  let component;
  let entry;

  const storeMock: any = {
    select: () => of({ first: { entry } }),
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
    entry = {
      properties: {
        'qshare:sharedId': null
      }
    };

    component = new ToggleSharedComponent(storeMock);
  });

  it('should get Store selection entry on initialization', (done) => {
    component.ngOnInit();

    component.selection$.subscribe((selection) => {
      expect(selection.first.entry).toEqual(entry);
      done();
    });
  });

  it('should return false when entry is not shared', () => {
    component.ngOnInit();

    expect(component.isShared({ first: { entry } })).toBe(false);
  });

  it('should return true when entry is shared', () => {
    entry.properties['qshare:sharedId'] = 'some-id';
    component.ngOnInit();

    expect(component.isShared({ first: { entry } })).toBe(true);
  });

  it('should dispatch `SHARE_NODE` action on share', () => {
    component.ngOnInit();
    component.editSharedNode({ first: { entry } });
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should get action label for unshared file', () => {
    component.ngOnInit();
    const label = component.getLabel({ first: { entry } });

    expect(label).toBe('APP.ACTIONS.SHARE');
  });

  it('should get action label for shared file', () => {
    entry.properties['qshare:sharedId'] = 'some-id';
    component.ngOnInit();
    const label = component.getLabel({ first: { entry } });

    expect(label).toBe('APP.ACTIONS.SHARE_EDIT');
  });
});
