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
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { NodeEffects } from './node.effects';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';
import {
  SharedStoreModule,
  ShareNodeAction,
  SetSelectedNodesAction,
  UnshareNodesAction,
  PurgeDeletedNodesAction,
  RestoreDeletedNodesAction,
  DeleteNodesAction,
  UndoDeleteNodesAction,
  CreateFolderAction,
  EditFolderAction,
  CopyNodesAction,
  MoveNodesAction,
  ManagePermissionsAction,
  UnlockWriteAction,
  FullscreenViewerAction,
  PrintFileAction,
  SetCurrentFolderAction
} from '@alfresco/aca-shared/store';
import { ViewUtilService } from '@alfresco/adf-core';
import { ViewerEffects } from './viewer.effects';
describe('NodeEffects', function() {
  var store;
  var contentService;
  var viewUtilService;
  var viewerEffects;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        SharedStoreModule,
        EffectsModule.forRoot([NodeEffects, ViewerEffects])
      ],
      declarations: [],
      providers: [ViewUtilService]
    });
    // actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);
    contentService = TestBed.get(ContentManagementService);
    viewUtilService = TestBed.get(ViewUtilService);
    viewerEffects = TestBed.get(ViewerEffects);
  });
  describe('shareNode$', function() {
    it('should share node from payload', function() {
      spyOn(contentService, 'shareNode').and.stub();
      var node = {};
      store.dispatch(new ShareNodeAction(node));
      expect(contentService.shareNode).toHaveBeenCalledWith(node);
    });
    it('should share node from active selection', fakeAsync(function() {
      spyOn(contentService, 'shareNode').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new ShareNodeAction(null));
      expect(contentService.shareNode).toHaveBeenCalledWith(node);
    }));
    it('should do nothing if invoking share with no data', function() {
      spyOn(contentService, 'shareNode').and.stub();
      store.dispatch(new ShareNodeAction(null));
      expect(contentService.shareNode).not.toHaveBeenCalled();
    });
  });
  describe('unshareNodes$', function() {
    it('should unshare nodes from the payload', function() {
      spyOn(contentService, 'unshareNodes').and.stub();
      var node = {};
      store.dispatch(new UnshareNodesAction([node]));
      expect(contentService.unshareNodes).toHaveBeenCalledWith([node]);
    });
    it('should unshare nodes from the active selection', fakeAsync(function() {
      spyOn(contentService, 'unshareNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new UnshareNodesAction(null));
      expect(contentService.unshareNodes).toHaveBeenCalledWith([node]);
    }));
    it('should do nothing if invoking unshare with no data', function() {
      spyOn(contentService, 'unshareNodes').and.stub();
      store.dispatch(new UnshareNodesAction(null));
      expect(contentService.unshareNodes).not.toHaveBeenCalled();
    });
  });
  describe('purgeDeletedNodes$', function() {
    it('should purge deleted nodes from the payload', function() {
      spyOn(contentService, 'purgeDeletedNodes').and.stub();
      var node = {};
      store.dispatch(new PurgeDeletedNodesAction([node]));
      expect(contentService.purgeDeletedNodes).toHaveBeenCalledWith([node]);
    });
    it('should purge nodes from the active selection', fakeAsync(function() {
      spyOn(contentService, 'purgeDeletedNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new PurgeDeletedNodesAction(null));
      expect(contentService.purgeDeletedNodes).toHaveBeenCalledWith([node]);
    }));
    it('should do nothing if invoking purge with no data', function() {
      spyOn(contentService, 'purgeDeletedNodes').and.stub();
      store.dispatch(new PurgeDeletedNodesAction(null));
      expect(contentService.purgeDeletedNodes).not.toHaveBeenCalled();
    });
  });
  describe('restoreDeletedNodes$', function() {
    it('should restore deleted nodes from the payload', function() {
      spyOn(contentService, 'restoreDeletedNodes').and.stub();
      var node = {};
      store.dispatch(new RestoreDeletedNodesAction([node]));
      expect(contentService.restoreDeletedNodes).toHaveBeenCalledWith([node]);
    });
    it('should restore deleted nodes from the active selection', fakeAsync(function() {
      spyOn(contentService, 'restoreDeletedNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new RestoreDeletedNodesAction(null));
      expect(contentService.restoreDeletedNodes).toHaveBeenCalledWith([node]);
    }));
    it('should do nothing if invoking restore with no data', function() {
      spyOn(contentService, 'restoreDeletedNodes').and.stub();
      store.dispatch(new RestoreDeletedNodesAction(null));
      expect(contentService.restoreDeletedNodes).not.toHaveBeenCalled();
    });
  });
  describe('deleteNodes$', function() {
    it('should delete nodes from the payload', function() {
      spyOn(contentService, 'deleteNodes').and.stub();
      var node = {};
      store.dispatch(new DeleteNodesAction([node]));
      expect(contentService.deleteNodes).toHaveBeenCalledWith([node]);
    });
    it('should delete nodes from the active selection', fakeAsync(function() {
      spyOn(contentService, 'deleteNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new DeleteNodesAction(null));
      expect(contentService.deleteNodes).toHaveBeenCalledWith([node]);
    }));
    it('should do nothing if invoking delete with no data', function() {
      spyOn(contentService, 'deleteNodes').and.stub();
      store.dispatch(new DeleteNodesAction(null));
      expect(contentService.deleteNodes).not.toHaveBeenCalled();
    });
  });
  describe('undoDeleteNodes$', function() {
    it('should undo deleted nodes from the payload', function() {
      spyOn(contentService, 'undoDeleteNodes').and.stub();
      var node = {};
      store.dispatch(new UndoDeleteNodesAction([node]));
      expect(contentService.undoDeleteNodes).toHaveBeenCalledWith([node]);
    });
    it('should do nothing if undoing deletion with no data', function() {
      spyOn(contentService, 'undoDeleteNodes').and.stub();
      store.dispatch(new UndoDeleteNodesAction([]));
      expect(contentService.undoDeleteNodes).not.toHaveBeenCalled();
    });
  });
  describe('createFolder$', function() {
    it('should create folder from the payload', function() {
      spyOn(contentService, 'createFolder').and.stub();
      var currentFolder = 'folder1';
      store.dispatch(new CreateFolderAction(currentFolder));
      expect(contentService.createFolder).toHaveBeenCalledWith(currentFolder);
    });
    it('should create folder in the active selected one', fakeAsync(function() {
      spyOn(contentService, 'createFolder').and.stub();
      var currentFolder = { isFolder: true, id: 'folder1' };
      store.dispatch(new SetCurrentFolderAction(currentFolder));
      tick(100);
      store.dispatch(new CreateFolderAction(null));
      expect(contentService.createFolder).toHaveBeenCalledWith(
        currentFolder.id
      );
    }));
    it('should do nothing if invoking delete with no data', function() {
      spyOn(contentService, 'createFolder').and.stub();
      store.dispatch(new CreateFolderAction(null));
      expect(contentService.createFolder).not.toHaveBeenCalled();
    });
  });
  describe('editFolder$', function() {
    it('should edit folder from the payload', function() {
      spyOn(contentService, 'editFolder').and.stub();
      var node = { entry: { isFolder: true, id: 'folder1' } };
      store.dispatch(new EditFolderAction(node));
      expect(contentService.editFolder).toHaveBeenCalledWith(node);
    });
    it('should edit folder from the active selection', fakeAsync(function() {
      spyOn(contentService, 'editFolder').and.stub();
      var currentFolder = {
        entry: { isFolder: true, isFile: false, id: 'folder1' }
      };
      store.dispatch(new SetSelectedNodesAction([currentFolder]));
      tick(100);
      store.dispatch(new EditFolderAction(null));
      expect(contentService.editFolder).toHaveBeenCalledWith(currentFolder);
    }));
    it('should do nothing if editing folder with no selection and payload', function() {
      spyOn(contentService, 'editFolder').and.stub();
      store.dispatch(new EditFolderAction(null));
      expect(contentService.editFolder).not.toHaveBeenCalled();
    });
  });
  describe('copyNodes$', function() {
    it('should copy nodes from the payload', function() {
      spyOn(contentService, 'copyNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new CopyNodesAction([node]));
      expect(contentService.copyNodes).toHaveBeenCalledWith([node]);
    });
    it('should copy nodes from the active selection', fakeAsync(function() {
      spyOn(contentService, 'copyNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new CopyNodesAction(null));
      expect(contentService.copyNodes).toHaveBeenCalledWith([node]);
    }));
    it('should do nothing if invoking copy with no data', function() {
      spyOn(contentService, 'copyNodes').and.stub();
      store.dispatch(new CopyNodesAction(null));
      expect(contentService.copyNodes).not.toHaveBeenCalled();
    });
  });
  describe('moveNodes$', function() {
    it('should move nodes from the payload', function() {
      spyOn(contentService, 'moveNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new MoveNodesAction([node]));
      expect(contentService.moveNodes).toHaveBeenCalledWith([node]);
    });
    it('should move nodes from the active selection', fakeAsync(function() {
      spyOn(contentService, 'moveNodes').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new MoveNodesAction(null));
      expect(contentService.moveNodes).toHaveBeenCalledWith([node]);
    }));
    it('should do nothing if invoking move with no data', function() {
      spyOn(contentService, 'moveNodes').and.stub();
      store.dispatch(new MoveNodesAction(null));
      expect(contentService.moveNodes).not.toHaveBeenCalled();
    });
  });
  describe('managePermissions$', function() {
    it('should manage permissions from the payload', function() {
      spyOn(contentService, 'managePermissions').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new ManagePermissionsAction(node));
      expect(contentService.managePermissions).toHaveBeenCalledWith(node);
    });
    it('should manage permissions from the active selection', fakeAsync(function() {
      spyOn(contentService, 'managePermissions').and.stub();
      var node = { entry: { isFile: true } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new ManagePermissionsAction(null));
      expect(contentService.managePermissions).toHaveBeenCalledWith(node);
    }));
    it('should do nothing if invoking manage permissions with no data', function() {
      spyOn(contentService, 'managePermissions').and.stub();
      store.dispatch(new ManagePermissionsAction(null));
      expect(contentService.managePermissions).not.toHaveBeenCalled();
    });
  });
  describe('printFile$', function() {
    it('it should print node content from payload', function() {
      spyOn(viewUtilService, 'printFileGeneric').and.stub();
      var node = {
        entry: { id: 'node-id', content: { mimeType: 'text/json' } }
      };
      store.dispatch(new PrintFileAction(node));
      expect(viewUtilService.printFileGeneric).toHaveBeenCalledWith(
        'node-id',
        'text/json'
      );
    });
    it('it should print node content from store', fakeAsync(function() {
      spyOn(viewUtilService, 'printFileGeneric').and.stub();
      var node = {
        entry: {
          isFile: true,
          id: 'node-id',
          content: { mimeType: 'text/json' }
        }
      };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new PrintFileAction(null));
      expect(viewUtilService.printFileGeneric).toHaveBeenCalledWith(
        'node-id',
        'text/json'
      );
    }));
  });
  describe('fullscreenViewer$', function() {
    it('should call fullscreen viewer', function() {
      spyOn(viewerEffects, 'enterFullScreen').and.stub();
      store.dispatch(new FullscreenViewerAction(null));
      expect(viewerEffects.enterFullScreen).toHaveBeenCalled();
    });
  });
  describe('unlockWrite$', function() {
    it('should unlock node from payload', function() {
      spyOn(contentService, 'unlockNode').and.stub();
      var node = { entry: { id: 'node-id' } };
      store.dispatch(new UnlockWriteAction(node));
      expect(contentService.unlockNode).toHaveBeenCalledWith(node);
    });
    it('should unlock node from store selection', fakeAsync(function() {
      spyOn(contentService, 'unlockNode').and.stub();
      var node = { entry: { isFile: true, id: 'node-id' } };
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);
      store.dispatch(new UnlockWriteAction(null));
      expect(contentService.unlockNode).toHaveBeenCalledWith(node);
    }));
  });
});
//# sourceMappingURL=node.effects.spec.js.map
