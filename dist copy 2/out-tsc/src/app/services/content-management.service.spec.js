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
import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { Actions, ofType, EffectsModule } from '@ngrx/effects';
import {
  SnackbarErrorAction,
  PurgeDeletedNodesAction,
  RestoreDeletedNodesAction,
  NavigateToParentFolder,
  DeleteNodesAction,
  MoveNodesAction,
  CopyNodesAction,
  ShareNodeAction,
  SetSelectedNodesAction,
  UnlockWriteAction
} from '@alfresco/aca-shared/store';
import { map } from 'rxjs/operators';
import { NodeEffects } from '../store/effects/node.effects';
import { AppTestingModule } from '../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';
import { Store } from '@ngrx/store';
import { ContentManagementService } from './content-management.service';
import { NodeActionsService } from './node-actions.service';
import { TranslationService, AlfrescoApiService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SnackbarActionTypes,
  RouterActionTypes
} from '../../../projects/aca-shared/store/src/public_api';
describe('ContentManagementService', function() {
  var dialog;
  var actions$;
  var contentApi;
  var store;
  var contentManagementService;
  var snackBar;
  var nodeActions;
  var translationService;
  var alfrescoApiService;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([NodeEffects])]
    });
    contentApi = TestBed.get(ContentApiService);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);
    contentManagementService = TestBed.get(ContentManagementService);
    snackBar = TestBed.get(MatSnackBar);
    nodeActions = TestBed.get(NodeActionsService);
    translationService = TestBed.get(TranslationService);
    alfrescoApiService = TestBed.get(AlfrescoApiService);
    dialog = TestBed.get(MatDialog);
  });
  describe('Copy node action', function() {
    beforeEach(function() {
      spyOn(snackBar, 'open').and.callThrough();
    });
    it('notifies successful copy of a node', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.COPY')
      );
      var selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      var createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.SINGULAR'
      );
    });
    it('notifies successful copy of multiple nodes', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.COPY')
      );
      var selection = [
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        { entry: { id: 'node-to-copy-2', name: 'name2' } }
      ];
      var createdItems = [
        { entry: { id: 'copy-of-node-1', name: 'name1' } },
        { entry: { id: 'copy-of-node-2', name: 'name2' } }
      ];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.PLURAL'
      );
    });
    it('notifies partially copy of one node out of a multiple selection of nodes', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.COPY')
      );
      var selection = [
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        { entry: { id: 'node-to-copy-2', name: 'name2' } }
      ];
      var createdItems = [{ entry: { id: 'copy-of-node-1', name: 'name1' } }];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.PARTIAL_SINGULAR'
      );
    });
    it('notifies partially copy of more nodes out of a multiple selection of nodes', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.COPY')
      );
      var selection = [
        { entry: { id: 'node-to-copy-0', name: 'name0' } },
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        { entry: { id: 'node-to-copy-2', name: 'name2' } }
      ];
      var createdItems = [
        { entry: { id: 'copy-of-node-0', name: 'name0' } },
        { entry: { id: 'copy-of-node-1', name: 'name1' } }
      ];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.PARTIAL_PLURAL'
      );
    });
    it('notifies of failed copy of multiple nodes', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.COPY')
      );
      var selection = [
        { entry: { id: 'node-to-copy-0', name: 'name0' } },
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        { entry: { id: 'node-to-copy-2', name: 'name2' } }
      ];
      var createdItems = [];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.FAIL_PLURAL'
      );
    });
    it('notifies of failed copy of one node', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.COPY')
      );
      var selection = [{ entry: { id: 'node-to-copy', name: 'name' } }];
      var createdItems = [];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.FAIL_SINGULAR'
      );
    });
    it('notifies error if success message was not emitted', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(of(''));
      var selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next();
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.GENERIC'
      );
    });
    it('notifies permission error on copy of node', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        throwError(new Error(JSON.stringify({ error: { statusCode: 403 } })))
      );
      var selection = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.PERMISSION'
      );
    });
    it('notifies generic error message on all errors, but 403', function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        throwError(new Error(JSON.stringify({ error: { statusCode: 404 } })))
      );
      var selection = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.GENERIC'
      );
    });
  });
  describe('Undo Copy action', function() {
    beforeEach(function() {
      spyOn(nodeActions, 'copyNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.COPY')
      );
      spyOn(snackBar, 'open').and.returnValue({
        onAction: function() {
          return of({});
        }
      });
    });
    it('should delete the newly created node on Undo action', function() {
      spyOn(contentApi, 'deleteNode').and.returnValue(of(null));
      var selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      var createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.SINGULAR'
      );
      expect(contentApi.deleteNode).toHaveBeenCalledWith(
        createdItems[0].entry.id,
        { permanent: true }
      );
    });
    it('should delete also the node created inside an already existing folder from destination', function() {
      var spyOnDeleteNode = spyOn(contentApi, 'deleteNode').and.returnValue(
        of(null)
      );
      var selection = [
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        {
          entry: {
            id: 'node-to-copy-2',
            name: 'folder-with-name-already-existing-on-destination'
          }
        }
      ];
      var id1 = 'copy-of-node-1';
      var id2 = 'copy-of-child-of-node-2';
      var createdItems = [
        { entry: { id: id1, name: 'name1' } },
        [
          {
            entry: {
              id: id2,
              name: 'name-of-child-of-node-2',
              parentId: 'the-folder-already-on-destination'
            }
          }
        ]
      ];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_COPY.PLURAL'
      );
      expect(spyOnDeleteNode).toHaveBeenCalled();
      expect(spyOnDeleteNode.calls.allArgs()).toEqual([
        [id1, { permanent: true }],
        [id2, { permanent: true }]
      ]);
    });
    it('notifies when error occurs on Undo action', function() {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(null));
      var selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      var createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(contentApi.deleteNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toEqual(
        'APP.MESSAGES.INFO.NODE_COPY.SINGULAR'
      );
    });
    it('notifies when some error of type Error occurs on Undo action', function() {
      spyOn(contentApi, 'deleteNode').and.returnValue(
        throwError(new Error('oops!'))
      );
      var selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      var createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(contentApi.deleteNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toEqual(
        'APP.MESSAGES.INFO.NODE_COPY.SINGULAR'
      );
    });
    it('notifies permission error when it occurs on Undo action', function() {
      spyOn(contentApi, 'deleteNode').and.returnValue(
        throwError(new Error(JSON.stringify({ error: { statusCode: 403 } })))
      );
      var selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      var createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(contentApi.deleteNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toEqual(
        'APP.MESSAGES.INFO.NODE_COPY.SINGULAR'
      );
    });
  });
  describe('Move node action', function() {
    beforeEach(function() {
      spyOn(translationService, 'instant').and.callFake(function(keysArray) {
        if (Array.isArray(keysArray)) {
          var processedKeys_1 = {};
          keysArray.forEach(function(key) {
            processedKeys_1[key] = key;
          });
          return processedKeys_1;
        } else {
          return keysArray;
        }
      });
    });
    beforeEach(function() {
      spyOn(snackBar, 'open').and.callThrough();
    });
    it('notifies successful move of a node', function() {
      var node = [{ entry: { id: 'node-to-move-id', name: 'name' } }];
      var moveResponse = {
        succeeded: node,
        failed: [],
        partiallySucceeded: []
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);
      var selection = node;
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR'
      );
    });
    it('notifies successful move of multiple nodes', function() {
      var nodes = [
        { entry: { id: '1', name: 'name1' } },
        { entry: { id: '2', name: 'name2' } }
      ];
      var moveResponse = {
        succeeded: nodes,
        failed: [],
        partiallySucceeded: []
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);
      var selection = nodes;
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.PLURAL'
      );
    });
    it('notifies partial move of a node', function() {
      var nodes = [{ entry: { id: '1', name: 'name' } }];
      var moveResponse = {
        succeeded: [],
        failed: [],
        partiallySucceeded: nodes
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);
      var selection = nodes;
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR'
      );
    });
    it('notifies partial move of multiple nodes', function() {
      var nodes = [
        { entry: { id: '1', name: 'name' } },
        { entry: { id: '2', name: 'name2' } }
      ];
      var moveResponse = {
        succeeded: [],
        failed: [],
        partiallySucceeded: nodes
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);
      var selection = nodes;
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.PLURAL'
      );
    });
    it('notifies successful move and the number of nodes that could not be moved', function() {
      var nodes = [
        { entry: { id: '1', name: 'name' } },
        { entry: { id: '2', name: 'name2' } }
      ];
      var moveResponse = {
        succeeded: [nodes[0]],
        failed: [nodes[1]],
        partiallySucceeded: []
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);
      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.FAIL'
      );
    });
    it('notifies successful move and the number of partially moved ones', function() {
      var nodes = [
        { entry: { id: '1', name: 'name' } },
        { entry: { id: '2', name: 'name2' } }
      ];
      var moveResponse = {
        succeeded: [nodes[0]],
        failed: [],
        partiallySucceeded: [nodes[1]]
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);
      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR'
      );
    });
    it('notifies error if success message was not emitted', function() {
      var nodes = [{ entry: { id: 'node-to-move-id', name: 'name' } }];
      var moveResponse = {
        succeeded: [],
        failed: [],
        partiallySucceeded: []
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(of(''));
      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.GENERIC'
      );
    });
    it('notifies permission error on move of node', function() {
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        throwError(new Error(JSON.stringify({ error: { statusCode: 403 } })))
      );
      var selection = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new MoveNodesAction(selection));
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.PERMISSION'
      );
    });
    it('notifies generic error message on all errors, but 403', function() {
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        throwError(new Error(JSON.stringify({ error: { statusCode: 404 } })))
      );
      var selection = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new MoveNodesAction(selection));
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.GENERIC'
      );
    });
    it('notifies conflict error message on 409', function() {
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        throwError(new Error(JSON.stringify({ error: { statusCode: 409 } })))
      );
      var selection = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new MoveNodesAction(selection));
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.NODE_MOVE'
      );
    });
    it('notifies error if move response has only failed items', function() {
      var nodes = [{ entry: { id: '1', name: 'name' } }];
      var moveResponse = {
        succeeded: [],
        failed: [{}],
        partiallySucceeded: []
      };
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);
      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.contentMoved.next(moveResponse);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.ERRORS.GENERIC'
      );
    });
  });
  describe('Undo Move action', function() {
    beforeEach(function() {
      spyOn(translationService, 'instant').and.callFake(function(keysArray) {
        if (Array.isArray(keysArray)) {
          var processedKeys_2 = {};
          keysArray.forEach(function(key) {
            processedKeys_2[key] = key;
          });
          return processedKeys_2;
        } else {
          return keysArray;
        }
      });
    });
    beforeEach(function() {
      spyOn(nodeActions, 'moveNodes').and.returnValue(
        of('OPERATION.SUCCES.CONTENT.MOVE')
      );
      spyOn(snackBar, 'open').and.returnValue({
        onAction: function() {
          return of({});
        }
      });
    });
    it('should move node back to initial parent, after succeeded move', function() {
      var initialParent = 'parent-id-0';
      var node = {
        entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent }
      };
      var selection = [node];
      spyOn(nodeActions, 'moveNodeAction').and.returnValue(of({}));
      store.dispatch(new MoveNodesAction(selection));
      var movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: node, initialParentId: initialParent }]
      };
      nodeActions.contentMoved.next(movedItems);
      expect(nodeActions.moveNodeAction).toHaveBeenCalledWith(
        movedItems.succeeded[0].itemMoved.entry,
        movedItems.succeeded[0].initialParentId
      );
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR'
      );
    });
    it('should move node back to initial parent, after succeeded move of a single file', function() {
      var initialParent = 'parent-id-0';
      var node = {
        entry: {
          id: 'node-to-move-id',
          name: 'name',
          isFolder: false,
          parentId: initialParent
        }
      };
      var selection = [node];
      spyOn(nodeActions, 'moveNodeAction').and.returnValue(of({}));
      var movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [node]
      };
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(movedItems);
      expect(nodeActions.moveNodeAction).toHaveBeenCalledWith(
        node.entry,
        initialParent
      );
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR'
      );
    });
    it('should restore deleted folder back to initial parent, after succeeded moving all its files', function() {
      // when folder was deleted after all its children were moved to a folder with the same name from destination
      spyOn(contentApi, 'restoreNode').and.returnValue(of(null));
      var initialParent = 'parent-id-0';
      var node = {
        entry: {
          id: 'folder-to-move-id',
          name: 'conflicting-name',
          parentId: initialParent,
          isFolder: true
        }
      };
      var selection = [node];
      var itemMoved = {}; // folder was empty
      nodeActions.moveDeletedEntries = [node]; // folder got deleted
      var movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [[itemMoved]]
      };
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(movedItems);
      expect(contentApi.restoreNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe(
        'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR'
      );
    });
    it('should notify when error occurs on Undo Move action', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'restoreNode').and.returnValue(throwError(null));
      actions$.pipe(
        ofType(SnackbarActionTypes.Error),
        map(function(action) {
          return done();
        })
      );
      var initialParent = 'parent-id-0';
      var node = {
        entry: {
          id: 'node-to-move-id',
          name: 'conflicting-name',
          parentId: initialParent
        }
      };
      var selection = [node];
      var afterMoveParentId = 'parent-id-1';
      var childMoved = {
        entry: {
          id: 'child-of-node-to-move-id',
          name: 'child-name',
          parentId: afterMoveParentId
        }
      };
      nodeActions.moveDeletedEntries = [node]; // folder got deleted
      var movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
      };
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(movedItems);
      expect(contentApi.restoreNode).toHaveBeenCalled();
    }));
    it('should notify when some error of type Error occurs on Undo Move action', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'restoreNode').and.returnValue(
        throwError(new Error('oops!'))
      );
      actions$.pipe(
        ofType(SnackbarActionTypes.Error),
        map(function(action) {
          return done();
        })
      );
      var initialParent = 'parent-id-0';
      var node = {
        entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent }
      };
      var selection = [node];
      var childMoved = {
        entry: { id: 'child-of-node-to-move-id', name: 'child-name' }
      };
      nodeActions.moveDeletedEntries = [node]; // folder got deleted
      var movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
      };
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(movedItems);
      expect(contentApi.restoreNode).toHaveBeenCalled();
    }));
    it('should notify permission error when it occurs on Undo Move action', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'restoreNode').and.returnValue(
        throwError(new Error(JSON.stringify({ error: { statusCode: 403 } })))
      );
      actions$.pipe(
        ofType(SnackbarActionTypes.Error),
        map(function(action) {
          return done();
        })
      );
      var initialParent = 'parent-id-0';
      var node = {
        entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent }
      };
      var selection = [node];
      var childMoved = {
        entry: { id: 'child-of-node-to-move-id', name: 'child-name' }
      };
      nodeActions.moveDeletedEntries = [node]; // folder got deleted
      var movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
      };
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.contentMoved.next(movedItems);
      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(contentApi.restoreNode).toHaveBeenCalled();
    }));
  });
  describe('Delete action', function() {
    it('should raise info message on successful single file deletion', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'deleteNode').and.returnValue(of(null));
      actions$.pipe(
        ofType(SnackbarActionTypes.Info),
        map(function(action) {
          done();
        })
      );
      var selection = [{ entry: { id: '1', name: 'name1' } }];
      store.dispatch(new DeleteNodesAction(selection));
    }));
    it('should raise error message on failed single file deletion', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(null));
      actions$.pipe(
        ofType(SnackbarActionTypes.Error),
        map(function(action) {
          done();
        })
      );
      var selection = [{ entry: { id: '1', name: 'name1' } }];
      store.dispatch(new DeleteNodesAction(selection));
    }));
    it('should raise info message on successful multiple files deletion', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'deleteNode').and.returnValue(of(null));
      actions$.pipe(
        ofType(SnackbarActionTypes.Info),
        map(function(action) {
          done();
        })
      );
      var selection = [
        { entry: { id: '1', name: 'name1' } },
        { entry: { id: '2', name: 'name2' } }
      ];
      store.dispatch(new DeleteNodesAction(selection));
    }));
    it('should raise error message failed multiple files deletion', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(null));
      actions$.pipe(
        ofType(SnackbarActionTypes.Error),
        map(function(action) {
          done();
        })
      );
      var selection = [
        { entry: { id: '1', name: 'name1' } },
        { entry: { id: '2', name: 'name2' } }
      ];
      store.dispatch(new DeleteNodesAction(selection));
    }));
    it('should raise warning message when only one file is successful', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'deleteNode').and.callFake(function(id) {
        if (id === '1') {
          return throwError(null);
        } else {
          return of(null);
        }
      });
      actions$.pipe(
        ofType(SnackbarActionTypes.Warning),
        map(function(action) {
          done();
        })
      );
      var selection = [
        { entry: { id: '1', name: 'name1' } },
        { entry: { id: '2', name: 'name2' } }
      ];
      store.dispatch(new DeleteNodesAction(selection));
    }));
    it('should raise warning message when some files are successfully deleted', fakeAsync(function(
      done
    ) {
      spyOn(contentApi, 'deleteNode').and.callFake(function(id) {
        if (id === '1') {
          return throwError(null);
        }
        if (id === '2') {
          return of(null);
        }
        if (id === '3') {
          return of(null);
        }
        return of(null);
      });
      actions$.pipe(
        ofType(SnackbarActionTypes.Warning),
        map(function(action) {
          done();
        })
      );
      var selection = [
        { entry: { id: '1', name: 'name1' } },
        { entry: { id: '2', name: 'name2' } },
        { entry: { id: '3', name: 'name3' } }
      ];
      store.dispatch(new DeleteNodesAction(selection));
    }));
  });
  describe('Permanent Delete', function() {
    beforeEach(function() {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: function() {
          return of(true);
        }
      });
    });
    it('does not purge nodes if no selection', function() {
      spyOn(contentApi, 'purgeDeletedNode');
      store.dispatch(new PurgeDeletedNodesAction([]));
      expect(contentApi.purgeDeletedNode).not.toHaveBeenCalled();
    });
    it('call purge nodes if selection is not empty', fakeAsync(function() {
      spyOn(contentApi, 'purgeDeletedNode').and.returnValue(of({}));
      var selection = [{ entry: { id: '1' } }];
      store.dispatch(new PurgeDeletedNodesAction(selection));
      expect(contentApi.purgeDeletedNode).toHaveBeenCalled();
    }));
    describe('notification', function() {
      it('raises warning on multiple fail and one success', fakeAsync(function(
        done
      ) {
        actions$.pipe(
          ofType(SnackbarActionTypes.Warning),
          map(function(action) {
            done();
          })
        );
        spyOn(contentApi, 'purgeDeletedNode').and.callFake(function(id) {
          if (id === '1') {
            return of({});
          }
          if (id === '2') {
            return throwError({});
          }
          if (id === '3') {
            return throwError({});
          }
          return of(null);
        });
        var selection = [
          { entry: { id: '1', name: 'name1' } },
          { entry: { id: '2', name: 'name2' } },
          { entry: { id: '3', name: 'name3' } }
        ];
        store.dispatch(new PurgeDeletedNodesAction(selection));
      }));
      it('raises warning on multiple success and multiple fail', fakeAsync(function(
        done
      ) {
        actions$.pipe(
          ofType(SnackbarActionTypes.Warning),
          map(function(action) {
            done();
          })
        );
        spyOn(contentApi, 'purgeDeletedNode').and.callFake(function(id) {
          if (id === '1') {
            return of({});
          }
          if (id === '2') {
            return throwError({});
          }
          if (id === '3') {
            return throwError({});
          }
          if (id === '4') {
            return of({});
          }
          return of(null);
        });
        var selection = [
          { entry: { id: '1', name: 'name1' } },
          { entry: { id: '2', name: 'name2' } },
          { entry: { id: '3', name: 'name3' } },
          { entry: { id: '4', name: 'name4' } }
        ];
        store.dispatch(new PurgeDeletedNodesAction(selection));
      }));
      it('raises info on one selected node success', fakeAsync(function(done) {
        actions$.pipe(
          ofType(SnackbarActionTypes.Info),
          map(function(action) {
            done();
          })
        );
        spyOn(contentApi, 'purgeDeletedNode').and.returnValue(of({}));
        var selection = [{ entry: { id: '1', name: 'name1' } }];
        store.dispatch(new PurgeDeletedNodesAction(selection));
      }));
      it('raises error on one selected node fail', fakeAsync(function(done) {
        actions$.pipe(
          ofType(SnackbarActionTypes.Error),
          map(function(action) {
            done();
          })
        );
        spyOn(contentApi, 'purgeDeletedNode').and.returnValue(throwError({}));
        var selection = [{ entry: { id: '1', name: 'name1' } }];
        store.dispatch(new PurgeDeletedNodesAction(selection));
      }));
      it('raises info on all nodes success', fakeAsync(function(done) {
        actions$.pipe(
          ofType(SnackbarActionTypes.Info),
          map(function(action) {
            done();
          })
        );
        spyOn(contentApi, 'purgeDeletedNode').and.callFake(function(id) {
          if (id === '1') {
            return of({});
          }
          if (id === '2') {
            return of({});
          }
          return of(null);
        });
        var selection = [
          { entry: { id: '1', name: 'name1' } },
          { entry: { id: '2', name: 'name2' } }
        ];
        store.dispatch(new PurgeDeletedNodesAction(selection));
      }));
      it('raises error on all nodes fail', fakeAsync(function(done) {
        actions$.pipe(
          ofType(SnackbarActionTypes.Error),
          map(function(action) {
            done();
          })
        );
        spyOn(contentApi, 'purgeDeletedNode').and.callFake(function(id) {
          if (id === '1') {
            return throwError({});
          }
          if (id === '2') {
            return throwError({});
          }
          return of({});
        });
        var selection = [
          { entry: { id: '1', name: 'name1' } },
          { entry: { id: '2', name: 'name2' } }
        ];
        store.dispatch(new PurgeDeletedNodesAction(selection));
      }));
    });
  });
  describe('Restore Deleted', function() {
    it('does not restore nodes if no selection', function() {
      spyOn(contentApi, 'restoreNode');
      var selection = [];
      store.dispatch(new RestoreDeletedNodesAction(selection));
      expect(contentApi.restoreNode).not.toHaveBeenCalled();
    });
    it('does not restore nodes if selection has nodes without path', function() {
      spyOn(contentApi, 'restoreNode');
      var selection = [{ entry: { id: '1' } }];
      store.dispatch(new RestoreDeletedNodesAction(selection));
      expect(contentApi.restoreNode).not.toHaveBeenCalled();
    });
    it('call restore nodes if selection has nodes with path', fakeAsync(function() {
      spyOn(contentApi, 'restoreNode').and.returnValue(of({}));
      spyOn(contentApi, 'getDeletedNodes').and.returnValue(
        of({
          list: { entries: [] }
        })
      );
      var path = {
        elements: [
          {
            id: '1-1',
            name: 'somewhere-over-the-rainbow'
          }
        ]
      };
      var selection = [
        {
          entry: {
            id: '1',
            path: path
          }
        }
      ];
      store.dispatch(new RestoreDeletedNodesAction(selection));
      expect(contentApi.restoreNode).toHaveBeenCalled();
    }));
    it('should navigate to library folder when node is a library content', fakeAsync(function() {
      spyOn(store, 'dispatch').and.callThrough();
      spyOn(contentApi, 'restoreNode').and.returnValue(of({}));
      spyOn(contentApi, 'getDeletedNodes').and.returnValue(
        of({
          list: { entries: [] }
        })
      );
      var path = {
        elements: [
          {
            id: '1-1',
            name: 'Company Home'
          },
          {
            id: '1-2',
            name: 'Sites'
          }
        ]
      };
      var selection = [
        {
          entry: {
            id: '1',
            path: path
          }
        }
      ];
      store.dispatch(new RestoreDeletedNodesAction(selection));
      expect(
        store.dispatch['calls'].argsFor(1)[0].userAction.action instanceof
          NavigateToParentFolder
      ).toBe(true);
    }));
    describe('notification', function() {
      beforeEach(function() {
        spyOn(contentApi, 'getDeletedNodes').and.returnValue(
          of({
            list: { entries: [] }
          })
        );
      });
      it('should raise error message on partial multiple fail ', fakeAsync(function(
        done
      ) {
        var error = { message: '{ "error": {} }' };
        actions$.pipe(
          ofType(SnackbarActionTypes.Error),
          map(function(action) {
            return done();
          })
        );
        spyOn(contentApi, 'restoreNode').and.callFake(function(id) {
          if (id === '1') {
            return of({});
          }
          if (id === '2') {
            return throwError(error);
          }
          if (id === '3') {
            return throwError(error);
          }
          return of({});
        });
        var path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };
        var selection = [
          { entry: { id: '1', name: 'name1', path: path } },
          { entry: { id: '2', name: 'name2', path: path } },
          { entry: { id: '3', name: 'name3', path: path } }
        ];
        store.dispatch(new RestoreDeletedNodesAction(selection));
      }));
      it('should raise error message when restored node exist, error 409', fakeAsync(function(
        done
      ) {
        var error = { message: '{ "error": { "statusCode": 409 } }' };
        spyOn(contentApi, 'restoreNode').and.returnValue(throwError(error));
        actions$.pipe(
          ofType(SnackbarActionTypes.Error),
          map(function(action) {
            return done();
          })
        );
        var path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };
        var selection = [{ entry: { id: '1', name: 'name1', path: path } }];
        store.dispatch(new RestoreDeletedNodesAction(selection));
      }));
      it('should raise error message when restored node returns different statusCode', fakeAsync(function(
        done
      ) {
        var error = { message: '{ "error": { "statusCode": 404 } }' };
        spyOn(contentApi, 'restoreNode').and.returnValue(throwError(error));
        actions$.pipe(
          ofType(SnackbarActionTypes.Error),
          map(function(action) {
            return done();
          })
        );
        var path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };
        var selection = [{ entry: { id: '1', name: 'name1', path: path } }];
        store.dispatch(new RestoreDeletedNodesAction(selection));
      }));
      it('should raise error message when restored node location is missing', fakeAsync(function(
        done
      ) {
        var error = { message: '{ "error": { } }' };
        spyOn(contentApi, 'restoreNode').and.returnValue(throwError(error));
        actions$.pipe(
          ofType(SnackbarActionTypes.Error),
          map(function(action) {
            return done();
          })
        );
        var path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };
        var selection = [{ entry: { id: '1', name: 'name1', path: path } }];
        store.dispatch(new RestoreDeletedNodesAction(selection));
      }));
      it('should raise info message when restore multiple nodes', fakeAsync(function(
        done
      ) {
        spyOn(contentApi, 'restoreNode').and.callFake(function(id) {
          if (id === '1') {
            return of({});
          }
          if (id === '2') {
            return of({});
          }
          return of({});
        });
        actions$.pipe(
          ofType(SnackbarActionTypes.Info),
          map(function(action) {
            return done();
          })
        );
        var path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };
        var selection = [
          { entry: { id: '1', name: 'name1', path: path } },
          { entry: { id: '2', name: 'name2', path: path } }
        ];
        store.dispatch(new RestoreDeletedNodesAction(selection));
      }));
      xit('should raise info message when restore selected node', fakeAsync(function(
        done
      ) {
        spyOn(contentApi, 'restoreNode').and.returnValue(of({}));
        actions$.pipe(
          ofType(SnackbarActionTypes.Info),
          map(function(action) {
            return done();
          })
        );
        var path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };
        var selection = [{ entry: { id: '1', name: 'name1', path: path } }];
        store.dispatch(new RestoreDeletedNodesAction(selection));
      }));
      it('navigate to restore selected node location onAction', fakeAsync(function(
        done
      ) {
        spyOn(contentApi, 'restoreNode').and.returnValue(of({}));
        actions$.pipe(
          ofType(RouterActionTypes.NavigateRoute),
          map(function(action) {
            return done();
          })
        );
        var path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };
        var selection = [
          {
            entry: {
              id: '1',
              name: 'name1',
              path: path
            }
          }
        ];
        store.dispatch(new RestoreDeletedNodesAction(selection));
      }));
    });
  });
  describe('Share Node', function() {
    it('should open dialog for nodes without requesting getNodeInfo', fakeAsync(function() {
      var node = { entry: { id: '1', name: 'name1' } };
      spyOn(contentApi, 'getNodeInfo').and.returnValue(of({}));
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: function() {
          return of(null);
        }
      });
      store.dispatch(new ShareNodeAction(node));
      expect(contentApi.getNodeInfo).not.toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalled();
    }));
    it('should open dialog with getNodeInfo data when `id` property is missing', fakeAsync(function() {
      var node = { entry: { nodeId: '1', name: 'name1' } };
      spyOn(contentApi, 'getNodeInfo').and.returnValue(of({}));
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: function() {
          return of(null);
        }
      });
      store.dispatch(new ShareNodeAction(node));
      expect(contentApi.getNodeInfo).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalled();
    }));
    it('should update node selection after dialog is closed', fakeAsync(function() {
      var node = { entry: { id: '1', name: 'name1' } };
      spyOn(store, 'dispatch').and.callThrough();
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: function() {
          return of(null);
        }
      });
      store.dispatch(new ShareNodeAction(node));
      expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(
        new SetSelectedNodesAction([node])
      );
    }));
    it('should emit event when node is un-shared', fakeAsync(function() {
      var node = { entry: { id: '1', name: 'name1' } };
      spyOn(contentManagementService.linksUnshared, 'next').and.callThrough();
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: function() {
          return of(node);
        }
      });
      store.dispatch(new ShareNodeAction(node));
      tick();
      flush();
      expect(contentManagementService.linksUnshared.next).toHaveBeenCalledWith(
        jasmine.any(Object)
      );
    }));
  });
  describe('Unlock Node', function() {
    it('should unlock node', fakeAsync(function() {
      spyOn(contentApi, 'unlockNode').and.returnValue(Promise.resolve({}));
      store.dispatch(new UnlockWriteAction({ entry: { id: 'node-id' } }));
      tick();
      flush();
      expect(contentApi.unlockNode).toHaveBeenCalled();
    }));
    it('should raise error when unlock node fails', fakeAsync(function(done) {
      spyOn(contentApi, 'unlockNode').and.callFake(function() {
        return new Promise(function(resolve, reject) {
          return reject('error');
        });
      });
      spyOn(store, 'dispatch').and.callThrough();
      store.dispatch(
        new UnlockWriteAction({ entry: { id: 'node-id', name: 'some-file' } })
      );
      tick();
      flush();
      expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
          fileName: 'some-file'
        })
      );
    }));
  });
  describe('versionUploadDialog', function() {
    it('should open dialog with NodeVersionUploadDialogComponent instance', function() {
      spyOn(dialog, 'open');
      contentManagementService.versionUploadDialog();
      expect(dialog.open['calls'].argsFor(0)[0].name).toBe(
        'NodeVersionUploadDialogComponent'
      );
    });
    it('should return dialog instance reference', function() {
      var mockDialogInstance = { afterClose: function() {} };
      spyOn(dialog, 'open').and.returnValue(mockDialogInstance);
      var dialogRef = contentManagementService.versionUploadDialog();
      expect(dialogRef).toBe(mockDialogInstance);
    });
  });
  describe('editFolder', function() {
    it('should open dialog with FolderDialogComponent instance', function() {
      var mockDialogInstance = {
        componentInstance: { error: of() },
        afterClosed: function() {
          return of();
        }
      };
      var node = { entry: { id: '1', name: 'name1', isFolder: true } };
      spyOn(dialog, 'open').and.returnValue(mockDialogInstance);
      contentManagementService.editFolder(node);
      expect(dialog.open['calls'].argsFor(0)[0].name).toBe(
        'FolderDialogComponent'
      );
    });
    it('should raise error when edit operation fails', fakeAsync(function() {
      var mockDialogInstance = {
        componentInstance: { error: new Subject() },
        afterClosed: function() {
          return of();
        }
      };
      var node = { entry: { id: '1', name: 'name1', isFolder: true } };
      spyOn(dialog, 'open').and.returnValue(mockDialogInstance);
      spyOn(store, 'dispatch').and.callThrough();
      contentManagementService.editFolder(node);
      mockDialogInstance.componentInstance.error.next('edit folder error');
      expect(store.dispatch['calls'].argsFor(0)[0]).toEqual(
        new SnackbarErrorAction('edit folder error')
      );
    }));
    it('should call nodeUpdated event with edited node data', fakeAsync(function() {
      var node = { entry: { id: '1', name: 'name1' } };
      var newNode = { entry: { id: '1', name: 'name-edited' } };
      var mockDialogInstance = {
        componentInstance: { error: new Subject() },
        afterClosed: function() {
          return of(newNode);
        }
      };
      spyOn(alfrescoApiService.nodeUpdated, 'next');
      spyOn(dialog, 'open').and.returnValue(mockDialogInstance);
      contentManagementService.editFolder(node);
      expect(alfrescoApiService.nodeUpdated.next).toHaveBeenCalledWith(newNode);
    }));
  });
});
//# sourceMappingURL=content-management.service.spec.js.map
