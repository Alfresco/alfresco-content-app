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

import { ToggleEditOfflineComponent } from './toggle-edit-offline.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NodeEntry } from '@alfresco/js-api';
import { CancelCheckoutNodeAction, CheckoutNodeAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppExtensionService } from '@alfresco/aca-shared';

describe('ToggleEditOfflineComponent', () => {
  let fixture: ComponentFixture<ToggleEditOfflineComponent>;
  let component: ToggleEditOfflineComponent;
  let store: Store;
  let dispatchSpy: jasmine.Spy;
  let selectSpy: jasmine.Spy;
  let selection: any;

  const extensionsMock = {
    updateSidebarActions: jasmine.createSpy('updateSidebarActions')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ToggleEditOfflineComponent],
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

    store = TestBed.inject(Store);
    dispatchSpy = spyOn(store, 'dispatch');
    selectSpy = spyOn(store, 'select');

    selection = { file: { entry: { name: 'test', properties: {}, isLocked: false } } };
  });

  it('should initialize selection from store', () => {
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();
    expect(component.selection).toEqual(selection.file);
  });

  it('should dispatch CheckoutNodeAction when node is not locked', () => {
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    component.onClick();

    expect(dispatchSpy).toHaveBeenCalledWith(new CheckoutNodeAction(selection.file as NodeEntry));
  });

  it('should dispatch CancelCheckoutNodeAction when node is locked', () => {
    selection.file.entry.isLocked = true;
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    component.onClick();

    expect(dispatchSpy).toHaveBeenCalledWith(new CancelCheckoutNodeAction(selection.file as NodeEntry));
  });

  it('should dispatch CancelCheckoutNodeAction when node is a working copy', () => {
    selection.file.entry.aspectNames = ['cm:workingcopy'];
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    component.onClick();

    expect(dispatchSpy).toHaveBeenCalledWith(new CancelCheckoutNodeAction(selection.file as NodeEntry));
  });

  it('should set isNodeLocked to false and nodeTitle to EDIT_OFFLINE for a plain unlocked file', () => {
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    expect(component.isNodeLocked).toBeFalse();
    expect(component.nodeTitle).toBe('APP.ACTIONS.EDIT_OFFLINE');
  });

  it('should set isNodeLocked to true and nodeTitle to EDIT_OFFLINE_CANCEL for a locked file', () => {
    selection.file.entry.isLocked = true;
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    expect(component.isNodeLocked).toBeTrue();
    expect(component.nodeTitle).toBe('APP.ACTIONS.EDIT_OFFLINE_CANCEL');
  });

  it('should set isNodeLocked to true for a working copy', () => {
    selection.file.entry.aspectNames = ['cm:workingcopy'];
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    expect(component.isNodeLocked).toBeTrue();
  });
});
