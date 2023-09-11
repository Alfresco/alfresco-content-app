/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { DownloadNodesAction, EditOfflineAction, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NodeActionsService } from '../../../services/node-actions.service';

describe('ToggleEditOfflineComponent', () => {
  let fixture: ComponentFixture<ToggleEditOfflineComponent>;
  let component: ToggleEditOfflineComponent;
  let store: Store;
  let dispatchSpy: jasmine.Spy;
  let selectSpy: jasmine.Spy;
  let selection: any;

  const lockedNodeEntry: NodeEntry = {
    entry: {
      isFile: true,
      createdByUser: {
        id: 'hruser',
        displayName: 'hruser'
      },
      modifiedAt: new Date('2023-09-08T11:54:48.325+0000'),
      nodeType: 'cm:content',
      content: {
        mimeType: 'image/jpeg',
        mimeTypeName: 'JPEG Image',
        sizeInBytes: 128473,
        encoding: 'UTF-8'
      },
      parentId: '5a2d88ec-a29c-408a-874d-6394940c51d7',
      aspectNames: ['cm:versionable', 'cm:lockable', 'cm:auditable', 'cm:taggable', 'exif:exif'],
      createdAt: new Date('2023-09-07T11:10:48.788+0000'),
      isFolder: false,
      modifiedByUser: {
        id: 'hruser',
        displayName: 'hruser'
      },
      name: 'e2e_favorite_file.jpg',
      id: '36e5b5ad-3fa0-47e2-b256-016b868ac772',
      properties: {
        'cm:lockType': 'WRITE_LOCK',
        'cm:lockOwner': {
          id: 'hruser',
          displayName: 'hruser'
        },
        'cm:versionType': 'MAJOR',
        'cm:versionLabel': '1.0',
        'cm:lockLifetime': 'PERSISTENT',
        'exif:pixelYDimension': 1253,
        'exif:pixelXDimension': 1024
      }
    }
  };

  const nodesApiMock = jasmine.createSpyObj('nodesApi', ['lockNode', 'unlockNode']);
  const nodeActionsServiceMock = jasmine.createSpyObj('nodeActionsService', ['setNodeLocked']);

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
        { provide: NodesApi, useValue: nodesApiMock },
        { provide: NodeActionsService, useValue: nodeActionsServiceMock }
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

    expect(dispatchSpy.calls.argsFor(0)).toEqual([
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.LOCK_NODE', {
        fileName: 'test'
      })
    ]);
  });

  it('should raise notification on unlock error', () => {
    selectSpy.and.returnValue(of(selection));

    fixture.detectChanges();
    component.onUnlockError();
    fixture.detectChanges();

    expect(dispatchSpy.calls.argsFor(0)).toEqual([
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
        fileName: 'test'
      })
    ]);
  });

  it('should call setNodeLocked with true when a node is locked', () => {
    const nodeId = 'testNode1';
    nodesApiMock.lockNode.and.returnValue(Promise.resolve(lockedNodeEntry));

    component.lockNode(nodeId).then((result) => {
      expect(nodesApiMock.lockNode).toHaveBeenCalledWith(nodeId, {
        type: 'ALLOW_OWNER_CHANGES',
        lifetime: 'PERSISTENT'
      });
      expect(nodeActionsServiceMock.setNodeLocked).toHaveBeenCalledWith(true);
      expect(result).toEqual(lockedNodeEntry);
    });
  });

  it('should call setNodeLocked with false when a node is unlocked', () => {
    const nodeId = 'testNode2';
    nodesApiMock.unlockNode.and.returnValue(Promise.resolve(lockedNodeEntry));

    component.unlockNode(nodeId).then((result) => {
      expect(nodesApiMock.unlockNode).toHaveBeenCalledWith(nodeId);
      expect(nodeActionsServiceMock.setNodeLocked).toHaveBeenCalledWith(false);
      expect(result).toEqual(lockedNodeEntry);
    });
  });

  it('should handle errors when locking a node encounters an error', () => {
    const nodeId = 'testNode1';
    const error = new Error('Locking failed');
    nodesApiMock.lockNode.and.returnValue(Promise.reject(error));
    component.lockNode(nodeId).catch((err) => {
      expect(nodesApiMock.lockNode).toHaveBeenCalledWith(nodeId, { type: 'ALLOW_OWNER_CHANGES', lifetime: 'PERSISTENT' });
      expect(nodeActionsServiceMock.setNodeLocked).not.toHaveBeenCalled();
      expect(err).toEqual(error);
    });
  });

  it('should handle errors when unlocking a node encounters an error', () => {
    const nodeId = 'testNode1';
    const error = new Error('Unlocking failed');
    nodesApiMock.unlockNode.and.returnValue(Promise.reject(error));
    component.unlockNode(nodeId).catch((err) => {
      expect(nodesApiMock.lockNode).toHaveBeenCalledWith(nodeId);
      expect(nodeActionsServiceMock.setNodeLocked).not.toHaveBeenCalled();
      expect(err).toEqual(error);
    });
  });
});
