/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ToggleEditOfflineComponent } from './toggle-edit-offline.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NodeEntry } from '@alfresco/js-api';
import { DownloadNodesAction, EditOfflineAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppExtensionService } from '@alfresco/aca-shared';
import { NotificationService } from '@alfresco/adf-core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ToggleEditOfflineComponent', () => {
  let fixture: ComponentFixture<ToggleEditOfflineComponent>;
  let component: ToggleEditOfflineComponent;
  let store: Store;
  let dispatchSpy: jasmine.Spy;
  let selectSpy: jasmine.Spy;
  let selection: any;
  let showErrorSpy: jasmine.Spy;

  const extensionsMock = {
    updateSidebarActions: jasmine.createSpy('updateSidebarActions')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ToggleEditOfflineComponent, MatSnackBarModule],
      providers: [
        {
          provide: Store,
          useValue: {
            select: () => {},
            dispatch: () => {}
          }
        },
        {
          provide: AppExtensionService,
          useValue: extensionsMock
        }
      ]
    });

    fixture = TestBed.createComponent(ToggleEditOfflineComponent);
    component = fixture.componentInstance;
    spyOn(component, 'unlockNode').and.returnValue(Promise.resolve(null));
    spyOn(component, 'lockNode').and.returnValue(Promise.resolve(null));
    store = TestBed.inject(Store);

    dispatchSpy = spyOn(store, 'dispatch');
    selectSpy = spyOn(store, 'select');

    selection = { file: { entry: { name: 'test', properties: {}, isLocked: false } } };

    const notificationService = TestBed.inject(NotificationService);
    showErrorSpy = spyOn(notificationService, 'showError');
  });

  it('should initialized with data from store', () => {
    selectSpy.and.returnValue(of(selection));

    fixture.detectChanges();

    expect(component.selection).toEqual(selection.file);
  });

  it('should download content when node is locked', async () => {
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    selection.file.entry.isLocked = false;
    await component.onClick();

    fixture.detectChanges();

    expect(dispatchSpy.calls.argsFor(0)).toEqual([new DownloadNodesAction([selection.file as NodeEntry])]);
  });

  it('should not download content if node is not locked', () => {
    selectSpy.and.returnValue(of(selection));

    fixture.detectChanges();
    component.onClick();
    fixture.detectChanges();

    expect(dispatchSpy.calls.argsFor(0)).not.toEqual([new DownloadNodesAction([selection.file as NodeEntry])]);
  });

  it('should dispatch EditOfflineAction action', async () => {
    selectSpy.and.returnValue(of(selection));

    selection.file.entry.isLocked = true;

    fixture.detectChanges();
    await component.onClick();
    fixture.detectChanges();

    expect(dispatchSpy.calls.argsFor(0)).toEqual([new EditOfflineAction(selection.file as NodeEntry)]);
  });

  it('should raise notification on lock error', () => {
    selectSpy.and.returnValue(of(selection));

    fixture.detectChanges();
    component.onLockError();
    fixture.detectChanges();

    expect(showErrorSpy).toHaveBeenCalledWith('APP.MESSAGES.ERRORS.LOCK_NODE', null, { fileName: 'test' });
  });

  it('should raise notification on unlock error', () => {
    selectSpy.and.returnValue(of(selection));

    fixture.detectChanges();
    component.onUnlockError();
    fixture.detectChanges();

    expect(showErrorSpy).toHaveBeenCalledWith('APP.MESSAGES.ERRORS.UNLOCK_NODE', null, { fileName: 'test' });
  });

  it('should call updateSidebarActions on click', async () => {
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    await component.onClick();
    fixture.detectChanges();

    expect(extensionsMock.updateSidebarActions).toHaveBeenCalled();
  });
});
