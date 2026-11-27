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
import { NodeEntry, NodesApi } from '@alfresco/js-api';
import {
  CancelCheckoutNodeAction,
  CheckoutNodeAction,
  DownloadNodesAction,
  EditOfflineAction,
  SetSelectedNodesAction
} from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppExtensionService } from '@alfresco/aca-shared';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListService } from '@alfresco/adf-content-services';

describe('ToggleEditOfflineComponent', () => {
  let fixture: ComponentFixture<ToggleEditOfflineComponent>;
  let component: ToggleEditOfflineComponent;
  let store: Store;
  let dispatchSpy: jasmine.Spy;
  let selectSpy: jasmine.Spy;
  let selection: any;
  let notificationMock: { showError: jasmine.Spy<NotificationService['showError']> };
  let documentListMock: { reloadSilently: jasmine.Spy<DocumentListService['reloadSilently']> };

  const extensionsMock = {
    updateSidebarActions: jasmine.createSpy('updateSidebarActions'),
    isFeatureSupported: jasmine.createSpy('isFeatureSupported')
  };

  beforeEach(() => {
    extensionsMock.isFeatureSupported.and.returnValue(true);
    notificationMock = { showError: jasmine.createSpy('showError') };
    documentListMock = { reloadSilently: jasmine.createSpy('reloadSilently') };

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
        },
        {
          provide: NotificationService,
          useValue: notificationMock
        },
        {
          provide: DocumentListService,
          useValue: documentListMock
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

  it('should dispatch CheckoutNodeAction when node is not locked', async () => {
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    await component.onClick();

    expect(dispatchSpy).toHaveBeenCalledWith(new CheckoutNodeAction(selection.file as NodeEntry));
  });

  it('should dispatch CancelCheckoutNodeAction when node is locked', async () => {
    selection.file.entry.isLocked = true;
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    await component.onClick();

    expect(dispatchSpy).toHaveBeenCalledWith(new CancelCheckoutNodeAction(selection.file as NodeEntry));
  });

  it('should dispatch CancelCheckoutNodeAction when node is a working copy', async () => {
    selection.file.entry.aspectNames = ['cm:workingcopy'];
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    await component.onClick();

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

  it('should not call the legacy lock API or reload the document list when check-out is available', async () => {
    const nodesApiMock = {
      lockNode: jasmine.createSpy<NodesApi['lockNode']>('lockNode'),
      unlockNode: jasmine.createSpy<NodesApi['unlockNode']>('unlockNode')
    };
    Object.defineProperty(component, 'nodesApi', { value: nodesApiMock });
    extensionsMock.updateSidebarActions.calls.reset();
    selectSpy.and.returnValue(of(selection));
    fixture.detectChanges();

    await component.onClick();

    expect(nodesApiMock.lockNode).not.toHaveBeenCalled();
    expect(nodesApiMock.unlockNode).not.toHaveBeenCalled();
    expect(documentListMock.reloadSilently).not.toHaveBeenCalled();
    expect(extensionsMock.updateSidebarActions).toHaveBeenCalled();
  });

  describe('legacy lock flow (ACS version without check-in / check-out support)', () => {
    let nodesApiMock: {
      lockNode: jasmine.Spy<NodesApi['lockNode']>;
      unlockNode: jasmine.Spy<NodesApi['unlockNode']>;
    };

    beforeEach(() => {
      extensionsMock.isFeatureSupported.and.returnValue(false);

      nodesApiMock = {
        lockNode: jasmine.createSpy<NodesApi['lockNode']>('lockNode').and.resolveTo({
          entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'user' }, 'cm:lockLifetime': 'PERSISTENT' } }
        } as NodeEntry),
        unlockNode: jasmine.createSpy<NodesApi['unlockNode']>('unlockNode').and.resolveTo({ entry: { properties: {} } } as NodeEntry)
      };
      Object.defineProperty(component, 'nodesApi', { value: nodesApiMock });

      selection.file.entry.id = 'node-1';
    });

    it('should lock node and dispatch download, edit offline and select actions', async () => {
      selectSpy.and.returnValue(of(selection));
      fixture.detectChanges();

      await component.onClick();

      expect(nodesApiMock.lockNode).toHaveBeenCalledWith('node-1', { type: 'ALLOW_OWNER_CHANGES', lifetime: 'PERSISTENT' });
      expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(DownloadNodesAction));
      expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(EditOfflineAction));
      expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(SetSelectedNodesAction));
      expect(dispatchSpy).not.toHaveBeenCalledWith(jasmine.any(CheckoutNodeAction));
      expect(documentListMock.reloadSilently).toHaveBeenCalled();
      expect(extensionsMock.updateSidebarActions).toHaveBeenCalled();
    });

    it('should update lock properties of the selection after locking', async () => {
      selectSpy.and.returnValue(of(selection));
      fixture.detectChanges();

      await component.onClick();

      expect(selection.file.entry.properties['cm:lockType']).toBe('WRITE_LOCK');
      expect(selection.file.entry.properties['cm:lockOwner']).toEqual({ id: 'user' });
      expect(selection.file.entry.properties['cm:lockLifetime']).toBe('PERSISTENT');
    });

    it('should unlock node when it is locked', async () => {
      selection.file.entry.isLocked = true;
      selectSpy.and.returnValue(of(selection));
      fixture.detectChanges();

      await component.onClick();

      expect(nodesApiMock.unlockNode).toHaveBeenCalledWith('node-1');
      expect(nodesApiMock.lockNode).not.toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(EditOfflineAction));
      expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(SetSelectedNodesAction));
      expect(dispatchSpy).not.toHaveBeenCalledWith(jasmine.any(DownloadNodesAction));
      expect(dispatchSpy).not.toHaveBeenCalledWith(jasmine.any(CancelCheckoutNodeAction));
      expect(documentListMock.reloadSilently).toHaveBeenCalled();
      expect(selection.file.entry.isLocked).toBeFalse();
    });

    it('should show lock error when locking fails', async () => {
      nodesApiMock.lockNode.and.rejectWith(new Error('failed'));
      selectSpy.and.returnValue(of(selection));
      fixture.detectChanges();

      await component.onClick();

      expect(notificationMock.showError).toHaveBeenCalledWith('APP.MESSAGES.ERRORS.LOCK_NODE', null, { fileName: 'test' });
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(documentListMock.reloadSilently).not.toHaveBeenCalled();
    });

    it('should show unlock error when unlocking fails', async () => {
      selection.file.entry.isLocked = true;
      nodesApiMock.unlockNode.and.rejectWith(new Error('failed'));
      selectSpy.and.returnValue(of(selection));
      fixture.detectChanges();

      await component.onClick();

      expect(notificationMock.showError).toHaveBeenCalledWith('APP.MESSAGES.ERRORS.UNLOCK_NODE', null, { fileName: 'test' });
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(documentListMock.reloadSilently).not.toHaveBeenCalled();
    });
  });
});
