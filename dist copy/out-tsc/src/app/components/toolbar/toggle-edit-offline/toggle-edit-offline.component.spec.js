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
import { ToggleEditOfflineComponent } from './toggle-edit-offline.component';
import { LockNodeDirective } from '../../../directives/lock-node.directive';
import { setupTestBed, CoreModule } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  DownloadNodesAction,
  EditOfflineAction,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
describe('ToggleEditOfflineComponent', function() {
  var fixture;
  var component;
  var selection;
  var store;
  var dispatchSpy;
  setupTestBed({
    imports: [CoreModule.forRoot()],
    declarations: [ToggleEditOfflineComponent, LockNodeDirective],
    providers: [
      {
        provide: Store,
        useValue: {
          select: function() {
            return of(selection);
          },
          dispatch: function() {}
        }
      }
    ]
  });
  beforeEach(function() {
    fixture = TestBed.createComponent(ToggleEditOfflineComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    dispatchSpy = spyOn(store, 'dispatch');
  });
  afterEach(function() {
    dispatchSpy.calls.reset();
  });
  it('should initialized with data from store', function() {
    selection = { file: { entry: { properties: {} } } };
    fixture.detectChanges();
    expect(component.selection).toEqual(selection.file);
  });
  it('should download content if node is locked', function() {
    component.selection = { entry: { properties: {} } };
    var isLocked = true;
    component.onToggleEvent(isLocked);
    fixture.detectChanges();
    expect(dispatchSpy.calls.argsFor(0)).toEqual([
      new DownloadNodesAction([component.selection])
    ]);
  });
  it('should not download content if node is not locked', function() {
    component.selection = { entry: { properties: {} } };
    var isLocked = false;
    component.onToggleEvent(isLocked);
    fixture.detectChanges();
    expect(dispatchSpy.calls.argsFor(0)).not.toEqual([
      new DownloadNodesAction([component.selection])
    ]);
  });
  it('should dispatch EditOfflineAction action', function() {
    component.selection = { entry: { properties: {} } };
    var isLocked = false;
    component.onToggleEvent(isLocked);
    fixture.detectChanges();
    expect(dispatchSpy.calls.argsFor(0)).toEqual([
      new EditOfflineAction(component.selection)
    ]);
  });
  it('should raise notification on lock error', function() {
    component.selection = {
      entry: { name: 'test' }
    };
    component.onLockError();
    fixture.detectChanges();
    expect(dispatchSpy.calls.argsFor(0)).toEqual([
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.LOCK_NODE', {
        fileName: 'test'
      })
    ]);
  });
  it('should raise notification on unlock error', function() {
    component.selection = {
      entry: { name: 'test' }
    };
    component.onUnlockLockError();
    fixture.detectChanges();
    expect(dispatchSpy.calls.argsFor(0)).toEqual([
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
        fileName: 'test'
      })
    ]);
  });
});
//# sourceMappingURL=toggle-edit-offline.component.spec.js.map
