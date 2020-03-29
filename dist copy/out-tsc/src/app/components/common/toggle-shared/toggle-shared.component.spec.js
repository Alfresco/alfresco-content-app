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
describe('ToggleSharedComponent', function() {
  var component;
  var entry;
  var storeMock = {
    select: function() {
      return of({ first: { entry: entry } });
    },
    dispatch: jasmine.createSpy('dispatch')
  };
  beforeEach(function() {
    entry = {
      properties: {
        'qshare:sharedId': null
      }
    };
    component = new ToggleSharedComponent(storeMock);
  });
  it('should get Store selection entry on initialization', function(done) {
    component.ngOnInit();
    component.selection$.subscribe(function(selection) {
      expect(selection.first.entry).toEqual(entry);
      done();
    });
  });
  it('should return false when entry is not shared', function() {
    component.ngOnInit();
    expect(component.isShared({ first: { entry: entry } })).toBe(false);
  });
  it('should return true when entry is shared', function() {
    entry.properties['qshare:sharedId'] = 'some-id';
    component.ngOnInit();
    expect(component.isShared({ first: { entry: entry } })).toBe(true);
  });
  it('should dispatch `SHARE_NODE` action on share', function() {
    component.ngOnInit();
    component.editSharedNode({ first: { entry: entry } });
    expect(storeMock.dispatch).toHaveBeenCalled();
  });
});
//# sourceMappingURL=toggle-shared.component.spec.js.map
