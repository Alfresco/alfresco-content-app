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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { NodeEffects } from './node.effects';
import { provideEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';
import {
  CopyNodesAction,
  CreateFolderAction,
  DeleteNodesAction,
  EditFolderAction,
  ExpandInfoDrawerAction,
  FolderInformationAction,
  FullscreenViewerAction,
  ManageAspectsAction,
  ManagePermissionsAction,
  MoveNodesAction,
  NavigateUrlAction,
  PrintFileAction,
  PurgeDeletedNodesAction,
  RestoreDeletedNodesAction,
  RouterEffects,
  SetCurrentFolderAction,
  SetInfoDrawerStateAction,
  SetSelectedNodesAction,
  ShareNodeAction,
  ShowLoaderAction,
  UndoDeleteNodesAction,
  UnlockWriteAction,
  UnshareNodesAction
} from '@alfresco/aca-shared/store';
import { RenditionService } from '@alfresco/adf-content-services';
import { ViewerEffects } from './viewer.effects';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NodeEntry, UserInfo } from '@alfresco/js-api';

describe('NodeEffects', () => {
  let store: Store<any>;
  let contentService: ContentManagementService;
  let renditionViewerService: RenditionService;
  let viewerEffects: ViewerEffects;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, MatDialogModule, MatSnackBarModule],
      providers: [
        provideEffects([NodeEffects, ViewerEffects, RouterEffects]),
        RenditionService,
        { provide: ActivatedRoute, useValue: { queryParams: of({ location: 'test-page' }) } }
      ]
    });

    store = TestBed.inject(Store);
    contentService = TestBed.inject(ContentManagementService);
    renditionViewerService = TestBed.inject(RenditionService);
    viewerEffects = TestBed.inject(ViewerEffects);
    router = TestBed.inject(Router);
  });

  describe('shareNode$', () => {
    it('should share node from payload', () => {
      spyOn(contentService, 'shareNode').and.stub();

      const node: any = {
        entry: {}
      };
      store.dispatch(new ShareNodeAction(node));

      expect(contentService.shareNode).toHaveBeenCalledWith(node, undefined);
    });

    it('should share node from active selection', fakeAsync(() => {
      spyOn(contentService, 'shareNode').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new ShareNodeAction(null));
      expect(contentService.shareNode).toHaveBeenCalledWith(node, undefined);
    }));

    it('should do nothing if invoking share with no data', () => {
      spyOn(contentService, 'shareNode').and.stub();

      store.dispatch(new ShareNodeAction(null));

      expect(contentService.shareNode).not.toHaveBeenCalled();
    });
  });

  describe('unshareNodes$', () => {
    it('should unshare nodes from the payload', () => {
      spyOn(contentService, 'unshareNodes').and.stub();

      const node: any = {};
      store.dispatch(new UnshareNodesAction([node]));

      expect(contentService.unshareNodes).toHaveBeenCalledWith([node]);
    });

    it('should unshare nodes from the active selection', fakeAsync(() => {
      spyOn(contentService, 'unshareNodes').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new UnshareNodesAction(null));
      expect(contentService.unshareNodes).toHaveBeenCalledWith([node]);
    }));

    it('should do nothing if invoking unshare with no data', () => {
      spyOn(contentService, 'unshareNodes').and.stub();

      store.dispatch(new UnshareNodesAction(null));

      expect(contentService.unshareNodes).not.toHaveBeenCalled();
    });
  });

  describe('purgeDeletedNodes$', () => {
    it('should purge deleted nodes from the payload', () => {
      spyOn(contentService, 'purgeDeletedNodes').and.stub();

      const node: any = {};
      store.dispatch(new PurgeDeletedNodesAction([node]));

      expect(contentService.purgeDeletedNodes).toHaveBeenCalledWith([node], undefined);
    });

    it('should purge nodes from the active selection', fakeAsync(() => {
      spyOn(contentService, 'purgeDeletedNodes').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new PurgeDeletedNodesAction([node], { focusedElementOnCloseSelector: '.test-selector' }));
      expect(contentService.purgeDeletedNodes).toHaveBeenCalledWith([node], '.test-selector');
    }));

    it('should do nothing if invoking purge with no data', () => {
      spyOn(contentService, 'purgeDeletedNodes').and.stub();

      store.dispatch(new PurgeDeletedNodesAction(null));

      expect(contentService.purgeDeletedNodes).not.toHaveBeenCalled();
    });
  });

  describe('restoreDeletedNodes$', () => {
    it('should restore deleted nodes from the payload', () => {
      spyOn(contentService, 'restoreDeletedNodes').and.stub();

      const node: any = {};
      store.dispatch(new RestoreDeletedNodesAction([node]));

      expect(contentService.restoreDeletedNodes).toHaveBeenCalledWith([node], undefined);
    });

    it('should restore deleted nodes from the active selection', fakeAsync(() => {
      spyOn(contentService, 'restoreDeletedNodes').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new RestoreDeletedNodesAction(null, { focusedElementOnCloseSelector: '.test-selector' }));
      expect(contentService.restoreDeletedNodes).toHaveBeenCalledWith([node], '.test-selector');
    }));

    it('should do nothing if invoking restore with no data', () => {
      spyOn(contentService, 'restoreDeletedNodes').and.stub();

      store.dispatch(new RestoreDeletedNodesAction(null));

      expect(contentService.restoreDeletedNodes).not.toHaveBeenCalled();
    });
  });

  describe('deleteNodes$', () => {
    it('should delete nodes from the payload', () => {
      spyOn(contentService, 'deleteNodes').and.stub();
      spyOn(store, 'dispatch').and.callThrough();
      const node: any = {};
      store.dispatch(new DeleteNodesAction([node]));

      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new DeleteNodesAction([node], true) }));
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ShowLoaderAction(true) }));
      expect(contentService.deleteNodes).toHaveBeenCalledWith([node], true, undefined);
    });

    it('should delete nodes from the active selection', fakeAsync(() => {
      spyOn(contentService, 'deleteNodes').and.stub();
      spyOn(store, 'dispatch').and.callThrough();
      const node: any = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new DeleteNodesAction(null, true, { focusedElementOnCloseSelector: '.test-selector' }));

      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({ ...new DeleteNodesAction(null, true, { focusedElementOnCloseSelector: '.test-selector' }) })
      );
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ShowLoaderAction(true) }));
      expect(contentService.deleteNodes).toHaveBeenCalledWith([node], true, '.test-selector');
    }));

    it('should do nothing if invoking delete with no data', () => {
      spyOn(contentService, 'deleteNodes').and.stub();
      spyOn(store, 'dispatch').and.callThrough();
      store.dispatch(new DeleteNodesAction(null));

      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new DeleteNodesAction(null) }));
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ShowLoaderAction(true) }));
      expect(contentService.deleteNodes).not.toHaveBeenCalled();
    });
  });

  describe('undoDeleteNodes$', () => {
    it('should undo deleted nodes from the payload', () => {
      spyOn(contentService, 'undoDeleteNodes').and.stub();

      const node: any = {};
      store.dispatch(new UndoDeleteNodesAction([node]));

      expect(contentService.undoDeleteNodes).toHaveBeenCalledWith([node]);
    });

    it('should do nothing if undoing deletion with no data', () => {
      spyOn(contentService, 'undoDeleteNodes').and.stub();

      store.dispatch(new UndoDeleteNodesAction([]));

      expect(contentService.undoDeleteNodes).not.toHaveBeenCalled();
    });
  });

  describe('createFolder$', () => {
    beforeEach(() => {
      spyOn(contentService, 'createFolder').and.stub();
    });

    it('should create folder from the payload', () => {
      const currentFolder = 'folder1';
      store.dispatch(new CreateFolderAction(currentFolder));

      expect(contentService.createFolder).toHaveBeenCalledWith(currentFolder);
    });

    it('should create folder in the active selected one', fakeAsync(() => {
      const currentFolder: any = { isFolder: true, id: 'folder1' };
      store.dispatch(new SetCurrentFolderAction(currentFolder));

      tick(100);

      store.dispatch(new CreateFolderAction(null));
      expect(contentService.createFolder).toHaveBeenCalledWith(currentFolder.id);
    }));
  });

  describe('editFolder$', () => {
    it('should edit folder from the payload', () => {
      spyOn(contentService, 'editFolder').and.stub();

      const node: any = { entry: { isFolder: true, id: 'folder1' } };
      store.dispatch(new EditFolderAction(node));

      expect(contentService.editFolder).toHaveBeenCalledWith(node);
    });

    it('should edit folder from the active selection', fakeAsync(() => {
      spyOn(contentService, 'editFolder').and.stub();

      const currentFolder: any = {
        entry: { isFolder: true, isFile: false, id: 'folder1' }
      };
      store.dispatch(new SetSelectedNodesAction([currentFolder]));

      tick(100);

      store.dispatch(new EditFolderAction(null));
      expect(contentService.editFolder).toHaveBeenCalledWith(currentFolder, undefined);
    }));

    it('should do nothing if editing folder with no selection and payload', () => {
      spyOn(contentService, 'editFolder').and.stub();

      store.dispatch(new EditFolderAction(null));

      expect(contentService.editFolder).not.toHaveBeenCalled();
    });
  });

  describe('copyNodes$', () => {
    it('should copy nodes from the payload', () => {
      spyOn(contentService, 'copyNodes').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new CopyNodesAction([node]));

      expect(contentService.copyNodes).toHaveBeenCalledWith([node]);
    });

    it('should copy nodes from the active selection', fakeAsync(() => {
      spyOn(contentService, 'copyNodes').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new CopyNodesAction(null));

      expect(contentService.copyNodes).toHaveBeenCalledWith([node], undefined);
    }));

    it('should do nothing if invoking copy with no data', () => {
      spyOn(contentService, 'copyNodes').and.stub();

      store.dispatch(new CopyNodesAction(null));

      expect(contentService.copyNodes).not.toHaveBeenCalled();
    });
  });

  describe('moveNodes$', () => {
    it('should move nodes from the payload', () => {
      spyOn(contentService, 'moveNodes').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new MoveNodesAction([node]));

      expect(contentService.moveNodes).toHaveBeenCalledWith([node]);
    });

    it('should move nodes from the active selection', fakeAsync(() => {
      spyOn(contentService, 'moveNodes').and.stub();

      const node: any = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new MoveNodesAction(null));

      expect(contentService.moveNodes).toHaveBeenCalledWith([node], undefined);
    }));

    it('should do nothing if invoking move with no data', () => {
      spyOn(contentService, 'moveNodes').and.stub();

      store.dispatch(new MoveNodesAction(null));

      expect(contentService.moveNodes).not.toHaveBeenCalled();
    });
  });

  describe('managePermissions$', () => {
    it('should manage permissions from the payload', () => {
      spyOn(router, 'navigateByUrl').and.stub();
      const node: any = { entry: { isFile: true, id: 'fileId' } };
      store.dispatch(new ManagePermissionsAction(node));

      expect(router.navigateByUrl).toHaveBeenCalledWith('personal-files/details/fileId/permissions');
    });

    it('should manage permissions from the active selection', () => {
      spyOn(store, 'select').and.returnValue(of({ isEmpty: false, last: { entry: { id: 'fileId' } } }));
      spyOn(router, 'navigateByUrl').and.stub();
      store.dispatch(new ManagePermissionsAction(null));

      expect(router.navigateByUrl).toHaveBeenCalledWith('personal-files/details/fileId/permissions');
    });

    it('should do nothing if invoking manage permissions with no data', () => {
      spyOn(store, 'select').and.returnValue(of(null));
      spyOn(router, 'navigate').and.stub();
      store.dispatch(new ManagePermissionsAction(null));

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should call dispatch on store with SetInfoDrawerStateAction when NavigationEnd event occurs', () => {
      spyOn(store, 'dispatch').and.callThrough();
      Object.defineProperty(router, 'events', {
        value: of(new NavigationEnd(1, '', ''))
      });

      store.dispatch(new ManagePermissionsAction(null));
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(SetInfoDrawerStateAction));
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          payload: true
        })
      );
    });
  });

  describe('printFile$', () => {
    it('it should print node content from payload', () => {
      spyOn(renditionViewerService, 'printFileGeneric').and.stub();
      const node: any = {
        entry: { id: 'node-id', content: { mimeType: 'text/json' } }
      };

      store.dispatch(new PrintFileAction(node));

      expect(renditionViewerService.printFileGeneric).toHaveBeenCalledWith('node-id', 'text/json');
    });

    it('it should print node content from store', fakeAsync(() => {
      spyOn(renditionViewerService, 'printFileGeneric').and.stub();
      const node: any = {
        entry: {
          isFile: true,
          id: 'node-id',
          content: { mimeType: 'text/json' }
        }
      };

      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new PrintFileAction(null));

      expect(renditionViewerService.printFileGeneric).toHaveBeenCalledWith('node-id', 'text/json');
    }));
  });

  describe('fullscreenViewer$', () => {
    it('should call fullscreen viewer', () => {
      spyOn(viewerEffects, 'enterFullScreen').and.stub();

      store.dispatch(new FullscreenViewerAction(null));

      expect(viewerEffects.enterFullScreen).toHaveBeenCalled();
    });
  });

  describe('unlockWrite$', () => {
    it('should unlock node from payload', () => {
      spyOn(contentService, 'unlockNode').and.stub();
      const node: any = { entry: { id: 'node-id' } };

      store.dispatch(new UnlockWriteAction(node));

      expect(contentService.unlockNode).toHaveBeenCalledWith(node);
    });

    it('should unlock node from store selection', fakeAsync(() => {
      spyOn(contentService, 'unlockNode').and.stub();
      const node: any = { entry: { isFile: true, id: 'node-id' } };

      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new UnlockWriteAction(null));

      expect(contentService.unlockNode).toHaveBeenCalledWith(node);
    }));
  });

  describe('aspectList$', () => {
    it('should call aspect dialog', () => {
      const node: any = { entry: { isFile: true } };
      spyOn(contentService, 'manageAspects').and.stub();

      store.dispatch(new ManageAspectsAction(node));

      expect(contentService.manageAspects).toHaveBeenCalled();
    });

    it('should call aspect dialog from the active file selection', fakeAsync(() => {
      spyOn(contentService, 'manageAspects').and.stub();

      const node: any = { entry: { isFile: true, id: 'file-node-id' } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new ManageAspectsAction(null));

      expect(contentService.manageAspects).toHaveBeenCalledWith({ entry: { isFile: true, id: 'file-node-id' } }, undefined);
    }));

    it('should call aspect dialog from the active folder selection', fakeAsync(() => {
      spyOn(contentService, 'manageAspects').and.stub();

      const node: any = { entry: { isFile: false, id: 'folder-node-id' } };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new ManageAspectsAction(null));

      expect(contentService.manageAspects).toHaveBeenCalledWith({ entry: { isFile: false, id: 'folder-node-id' } }, undefined);
    }));
  });

  describe('expandInfoDrawer$', () => {
    it('should call dispatch on store with SetInfoDrawerStateAction when NavigationEnd event occurs', () => {
      spyOn(store, 'dispatch').and.callThrough();
      Object.defineProperty(router, 'events', {
        value: of(new NavigationEnd(1, '', ''))
      });

      store.dispatch(new ExpandInfoDrawerAction(undefined));
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(SetInfoDrawerStateAction));
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          payload: true
        })
      );
    });

    it('should redirect to correct url', () => {
      spyOn(store, 'dispatch').and.callThrough();
      Object.defineProperties(router, {
        events: {
          value: of(new NavigationEnd(1, 'test/(viewer:view/node-id)', ''))
        },
        navigateByUrl: {
          value: jasmine.createSpy('navigateByUrl')
        }
      });
      const node: any = { entry: { isFile: true, id: 'node-id' } };

      store.dispatch(new ExpandInfoDrawerAction(node));
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({ ...new NavigateUrlAction('personal-files/details/node-id?location=test-page') })
      );
    });
  });

  describe('folderInformation$', () => {
    it('should call folder information dialog', () => {
      const node: NodeEntry = {
        entry: {
          id: 'folder-node-id',
          name: 'mock-folder-name',
          nodeType: 'fake-node-type',
          isFolder: true,
          isFile: false,
          modifiedAt: new Date(),
          modifiedByUser: new UserInfo(),
          createdAt: new Date(),
          createdByUser: new UserInfo()
        }
      };
      spyOn(contentService, 'showFolderInformation').and.stub();

      store.dispatch(new FolderInformationAction(node));

      expect(contentService.showFolderInformation).toHaveBeenCalledWith(node);
    });

    it('should call folder information dialog from the active folder selection', fakeAsync(() => {
      spyOn(contentService, 'showFolderInformation').and.stub();

      const node: NodeEntry = {
        entry: {
          id: 'folder-node-id',
          name: 'mock-folder-name',
          nodeType: 'fake-node-type',
          isFolder: true,
          isFile: false,
          modifiedAt: new Date(),
          modifiedByUser: new UserInfo(),
          createdAt: new Date(),
          createdByUser: new UserInfo()
        }
      };
      store.dispatch(new SetSelectedNodesAction([node]));

      tick(100);

      store.dispatch(new FolderInformationAction(null));

      expect(contentService.showFolderInformation).toHaveBeenCalledWith(node);
    }));
  });
});
