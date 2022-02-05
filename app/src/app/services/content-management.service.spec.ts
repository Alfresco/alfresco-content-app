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
  AppStore,
  SnackbarWarningAction,
  SnackbarInfoAction,
  SnackbarErrorAction,
  PurgeDeletedNodesAction,
  RestoreDeletedNodesAction,
  NavigateToParentFolder,
  DeleteNodesAction,
  MoveNodesAction,
  CopyNodesAction,
  ShareNodeAction,
  SetSelectedNodesAction,
  UnlockWriteAction,
  SnackbarActionTypes,
  NodeActionTypes
} from '@alfresco/aca-shared/store';
import { map } from 'rxjs/operators';
import { NodeEffects } from '../store/effects/node.effects';
import { AppTestingModule } from '../testing/app-testing.module';
import { AppHookService, ContentApiService } from '@alfresco/aca-shared';
import { Store } from '@ngrx/store';
import { ContentManagementService } from './content-management.service';
import { NodeActionsService } from './node-actions.service';
import { TranslationService, AlfrescoApiService, FileModel } from '@alfresco/adf-core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NodeEntry, Node, VersionPaging } from '@alfresco/js-api';
import { NodeAspectService } from '@alfresco/adf-content-services';

describe('ContentManagementService', () => {
  let dialog: MatDialog;
  let actions$: Actions;
  let contentApi: ContentApiService;
  let store: Store<AppStore>;
  let contentManagementService: ContentManagementService;
  let snackBar: MatSnackBar;
  let nodeActions: NodeActionsService;
  let translationService: TranslationService;
  let alfrescoApiService: AlfrescoApiService;
  let nodeAspectService: NodeAspectService;
  let appHookService: AppHookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([NodeEffects])]
    });

    contentApi = TestBed.inject(ContentApiService);
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    contentManagementService = TestBed.inject(ContentManagementService);
    snackBar = TestBed.inject(MatSnackBar);
    nodeActions = TestBed.inject(NodeActionsService);
    translationService = TestBed.inject(TranslationService);
    alfrescoApiService = TestBed.inject(AlfrescoApiService);
    nodeAspectService = TestBed.inject(NodeAspectService);
    appHookService = TestBed.inject(AppHookService);

    dialog = TestBed.inject(MatDialog);
  });

  describe('Copy node action', () => {
    let subject: Subject<string>;

    beforeEach(() => {
      subject = new Subject<string>();
      spyOn(snackBar, 'open').and.callThrough();
    });

    afterEach(() => subject.complete());

    it('notifies successful copy of a node', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      const createdItems: any[] = [{ entry: { id: 'copy-id', name: 'name' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      subject.next('OPERATION.SUCCESS.CONTENT.COPY');

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
    });

    it('notifies successful copy of multiple nodes', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: 'node-to-copy-1', name: 'name1' } }, { entry: { id: 'node-to-copy-2', name: 'name2' } }];
      const createdItems: any[] = [{ entry: { id: 'copy-of-node-1', name: 'name1' } }, { entry: { id: 'copy-of-node-2', name: 'name2' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      subject.next('OPERATION.SUCCESS.CONTENT.COPY');

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PLURAL');
    });

    it('notifies partially copy of one node out of a multiple selection of nodes', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: 'node-to-copy-1', name: 'name1' } }, { entry: { id: 'node-to-copy-2', name: 'name2' } }];
      const createdItems: any[] = [{ entry: { id: 'copy-of-node-1', name: 'name1' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      subject.next('OPERATION.SUCCESS.CONTENT.COPY');

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PARTIAL_SINGULAR');
    });

    it('notifies partially copy of more nodes out of a multiple selection of nodes', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [
        { entry: { id: 'node-to-copy-0', name: 'name0' } },
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        { entry: { id: 'node-to-copy-2', name: 'name2' } }
      ];
      const createdItems: any[] = [{ entry: { id: 'copy-of-node-0', name: 'name0' } }, { entry: { id: 'copy-of-node-1', name: 'name1' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      subject.next('OPERATION.SUCCESS.CONTENT.COPY');

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PARTIAL_PLURAL');
    });

    it('notifies of failed copy of multiple nodes', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [
        { entry: { id: 'node-to-copy-0', name: 'name0' } },
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        { entry: { id: 'node-to-copy-2', name: 'name2' } }
      ];
      const createdItems: any[] = [];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      subject.next('OPERATION.SUCCESS.CONTENT.COPY');

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.FAIL_PLURAL');
    });

    it('notifies of failed copy of one node', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: 'node-to-copy', name: 'name' } }];
      const createdItems: any[] = [];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next(createdItems);
      subject.next('OPERATION.SUCCESS.CONTENT.COPY');

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.FAIL_SINGULAR');
    });

    it('notifies error if success message was not emitted', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.contentCopied.next();
      subject.next('');

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
    });

    it('notifies permission error on copy of node', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new CopyNodesAction(selection));
      subject.error(new Error(JSON.stringify({ error: { statusCode: 403 } })));

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.PERMISSION');
    });

    it('notifies generic error message on all errors, but 403', () => {
      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: '1', name: 'name' } }];

      store.dispatch(new CopyNodesAction(selection));
      subject.error(new Error(JSON.stringify({ error: { statusCode: 404 } })));

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
    });
  });

  describe('Undo Copy action', () => {
    let subject: Subject<string>;

    beforeEach(() => {
      subject = new Subject<string>();

      spyOn(nodeActions, 'copyNodes').and.returnValue(subject);
      spyOn(snackBar, 'open').and.returnValue({
        onAction: () => of(null)
      } as MatSnackBarRef<SimpleSnackBar>);
    });

    it('should delete the newly created node on Undo action', () => {
      spyOn(contentApi, 'deleteNode').and.returnValue(of(null));

      const selection: any[] = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      const createdItems: any[] = [{ entry: { id: 'copy-id', name: 'name' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.copyNodes(null).next('OPERATION.SUCCESS.CONTENT.COPY');
      nodeActions.contentCopied.next(createdItems);

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');

      expect(contentApi.deleteNode).toHaveBeenCalledWith(createdItems[0].entry.id, { permanent: true });
    });

    it('should delete also the node created inside an already existing folder from destination', () => {
      const spyOnDeleteNode = spyOn(contentApi, 'deleteNode').and.returnValue(of(null));

      const selection: any[] = [
        { entry: { id: 'node-to-copy-1', name: 'name1' } },
        {
          entry: {
            id: 'node-to-copy-2',
            name: 'folder-with-name-already-existing-on-destination'
          }
        }
      ];
      const id1 = 'copy-of-node-1';
      const id2 = 'copy-of-child-of-node-2';
      const createdItems: any[] = [
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
      nodeActions.copyNodes(null).next('OPERATION.SUCCESS.CONTENT.COPY');
      nodeActions.contentCopied.next(createdItems);

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PLURAL');

      expect(spyOnDeleteNode).toHaveBeenCalled();
      expect(spyOnDeleteNode.calls.allArgs()).toEqual([
        [id1, { permanent: true }],
        [id2, { permanent: true }]
      ]);
    });

    it('notifies when error occurs on Undo action', () => {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(null));

      const selection: any[] = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      const createdItems: any[] = [{ entry: { id: 'copy-id', name: 'name' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.copyNodes(null).next('OPERATION.SUCCESS.CONTENT.COPY');
      nodeActions.contentCopied.next(createdItems);

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(contentApi.deleteNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toEqual('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
    });

    it('notifies when some error of type Error occurs on Undo action', () => {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(new Error('oops!')));

      const selection: any[] = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      const createdItems: any[] = [{ entry: { id: 'copy-id', name: 'name' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.copyNodes(null).next('OPERATION.SUCCESS.CONTENT.COPY');
      nodeActions.contentCopied.next(createdItems);

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(contentApi.deleteNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toEqual('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
    });

    it('notifies permission error when it occurs on Undo action', () => {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(new Error(JSON.stringify({ error: { statusCode: 403 } }))));

      const selection: any[] = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
      const createdItems: any[] = [{ entry: { id: 'copy-id', name: 'name' } }];

      store.dispatch(new CopyNodesAction(selection));
      nodeActions.copyNodes(null).next('OPERATION.SUCCESS.CONTENT.COPY');
      nodeActions.contentCopied.next(createdItems);

      expect(nodeActions.copyNodes).toHaveBeenCalled();
      expect(contentApi.deleteNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toEqual('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
    });
  });

  describe('Move node action', () => {
    let subject: Subject<string>;

    beforeEach(() => {
      spyOn(translationService, 'instant').and.callFake((keysArray) => {
        if (Array.isArray(keysArray)) {
          const processedKeys = {};
          keysArray.forEach((key) => {
            processedKeys[key] = key;
          });
          return processedKeys;
        } else {
          return keysArray;
        }
      });
    });

    beforeEach(() => {
      subject = new Subject<string>();
      spyOn(snackBar, 'open').and.callThrough();
    });

    afterEach(() => subject.complete());

    it('notifies successful move of a node', () => {
      const node = [{ entry: { id: 'node-to-move-id', name: 'name' } }];
      const moveResponse = {
        succeeded: node,
        failed: [],
        partiallySucceeded: []
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);

      const selection: any = node;
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
    });

    it('notifies successful move of multiple nodes', () => {
      const nodes = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];
      const moveResponse = {
        succeeded: nodes,
        failed: [],
        partiallySucceeded: []
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);

      const selection: any = nodes;

      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.PLURAL');
    });

    it('notifies partial move of a node', () => {
      const nodes: any[] = [{ entry: { id: '1', name: 'name' } }];
      const moveResponse = {
        succeeded: [],
        failed: [],
        partiallySucceeded: nodes
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);

      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR');
    });

    it('notifies partial move of multiple nodes', () => {
      const nodes: any[] = [{ entry: { id: '1', name: 'name' } }, { entry: { id: '2', name: 'name2' } }];
      const moveResponse = {
        succeeded: [],
        failed: [],
        partiallySucceeded: nodes
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);

      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.PLURAL');
    });

    it('notifies successful move and the number of nodes that could not be moved', () => {
      const nodes: any[] = [{ entry: { id: '1', name: 'name' } }, { entry: { id: '2', name: 'name2' } }];
      const moveResponse = {
        succeeded: [nodes[0]],
        failed: [nodes[1]],
        partiallySucceeded: []
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);

      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.FAIL');
    });

    it('notifies successful move and the number of partially moved ones', () => {
      const nodes: any[] = [{ entry: { id: '1', name: 'name' } }, { entry: { id: '2', name: 'name2' } }];
      const moveResponse = {
        succeeded: [nodes[0]],
        failed: [],
        partiallySucceeded: [nodes[1]]
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);

      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR');
    });

    it('notifies error if success message was not emitted', () => {
      const nodes: any[] = [{ entry: { id: 'node-to-move-id', name: 'name' } }];
      const moveResponse = {
        succeeded: [],
        failed: [],
        partiallySucceeded: []
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);

      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.moveNodes(null).next('');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
    });

    it('notifies permission error on move of node', () => {
      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).error(new Error(JSON.stringify({ error: { statusCode: 403 } })));

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.PERMISSION');
    });

    it('notifies generic error message on all errors, but 403', () => {
      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).error(new Error(JSON.stringify({ error: { statusCode: 404 } })));

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
    });

    it('notifies conflict error message on 409', () => {
      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);

      const selection: any[] = [{ entry: { id: '1', name: 'name' } }];
      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).error(new Error(JSON.stringify({ error: { statusCode: 409 } })));

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.NODE_MOVE');
    });

    it('notifies error if move response has only failed items', () => {
      const nodes: any[] = [{ entry: { id: '1', name: 'name' } }];
      const moveResponse = {
        succeeded: [],
        failed: [{}],
        partiallySucceeded: []
      };

      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);
      spyOn(nodeActions, 'processResponse').and.returnValue(moveResponse);

      store.dispatch(new MoveNodesAction(nodes));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(moveResponse);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
    });
  });

  describe('Undo Move action', () => {
    let subject: Subject<string>;

    beforeEach(() => {
      spyOn(translationService, 'instant').and.callFake((keysArray) => {
        if (Array.isArray(keysArray)) {
          const processedKeys = {};
          keysArray.forEach((key) => {
            processedKeys[key] = key;
          });
          return processedKeys;
        } else {
          return keysArray;
        }
      });
    });

    beforeEach(() => {
      subject = new Subject<string>();
      spyOn(nodeActions, 'moveNodes').and.returnValue(subject);

      spyOn(snackBar, 'open').and.returnValue({
        onAction: () => of(null)
      } as MatSnackBarRef<SimpleSnackBar>);
    });

    afterEach(() => subject.next());

    it('should move node back to initial parent, after succeeded move', () => {
      const initialParent = 'parent-id-0';
      const node = {
        entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent }
      };
      const selection: any[] = [node];

      spyOn(nodeActions, 'moveNodeAction').and.returnValue(of({}));

      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      const movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: node, initialParentId: initialParent }]
      };
      nodeActions.contentMoved.next(movedItems);

      expect(nodeActions.moveNodeAction).toHaveBeenCalledWith(movedItems.succeeded[0].itemMoved.entry, movedItems.succeeded[0].initialParentId);
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
    });

    it('should move node back to initial parent, after succeeded move of a single file', () => {
      const initialParent = 'parent-id-0';
      const node = {
        entry: {
          id: 'node-to-move-id',
          name: 'name',
          isFolder: false,
          parentId: initialParent
        }
      };
      const selection: any[] = [node];

      spyOn(nodeActions, 'moveNodeAction').and.returnValue(of({}));

      const movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [node]
      };

      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(movedItems);

      expect(nodeActions.moveNodeAction).toHaveBeenCalledWith(node.entry, initialParent);
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
    });

    it('should restore deleted folder back to initial parent, after succeeded moving all its files', () => {
      // when folder was deleted after all its children were moved to a folder with the same name from destination
      spyOn(contentApi, 'restoreNode').and.returnValue(of(null));

      const initialParent = 'parent-id-0';
      const node = {
        entry: {
          id: 'folder-to-move-id',
          name: 'conflicting-name',
          parentId: initialParent,
          isFolder: true
        }
      };
      const selection: any[] = [node];

      const itemMoved = {}; // folder was empty
      nodeActions.moveDeletedEntries = [node]; // folder got deleted

      const movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [[itemMoved]]
      };

      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(movedItems);

      expect(contentApi.restoreNode).toHaveBeenCalled();
      expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
    });

    it('should notify when error occurs on Undo Move action', fakeAsync((done) => {
      spyOn(contentApi, 'restoreNode').and.returnValue(throwError(null));

      actions$.pipe(
        ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
        map(() => done())
      );

      const initialParent = 'parent-id-0';
      const node = {
        entry: {
          id: 'node-to-move-id',
          name: 'conflicting-name',
          parentId: initialParent
        }
      };
      const selection: any[] = [node];

      const afterMoveParentId = 'parent-id-1';
      const childMoved = {
        entry: {
          id: 'child-of-node-to-move-id',
          name: 'child-name',
          parentId: afterMoveParentId
        }
      };
      nodeActions.moveDeletedEntries = [node]; // folder got deleted

      const movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
      };

      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(movedItems);

      expect(contentApi.restoreNode).toHaveBeenCalled();
    }));

    it('should notify when some error of type Error occurs on Undo Move action', fakeAsync((done) => {
      spyOn(contentApi, 'restoreNode').and.returnValue(throwError(new Error('oops!')));

      actions$.pipe(
        ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
        map(() => done())
      );

      const initialParent = 'parent-id-0';
      const node: any = {
        entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent }
      };
      const selection = [node];

      const childMoved = {
        entry: { id: 'child-of-node-to-move-id', name: 'child-name' }
      };
      nodeActions.moveDeletedEntries = [node]; // folder got deleted

      const movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
      };

      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(movedItems);

      expect(contentApi.restoreNode).toHaveBeenCalled();
    }));

    it('should notify permission error when it occurs on Undo Move action', fakeAsync((done) => {
      spyOn(contentApi, 'restoreNode').and.returnValue(throwError(new Error(JSON.stringify({ error: { statusCode: 403 } }))));

      actions$.pipe(
        ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
        map(() => done())
      );

      const initialParent = 'parent-id-0';
      const node = {
        entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent }
      };
      const selection: any[] = [node];

      const childMoved = {
        entry: { id: 'child-of-node-to-move-id', name: 'child-name' }
      };
      nodeActions.moveDeletedEntries = [node]; // folder got deleted

      const movedItems = {
        failed: [],
        partiallySucceeded: [],
        succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
      };

      store.dispatch(new MoveNodesAction(selection));
      nodeActions.moveNodes(null).next('OPERATION.SUCCESS.CONTENT.MOVE');
      nodeActions.contentMoved.next(movedItems);

      expect(nodeActions.moveNodes).toHaveBeenCalled();
      expect(contentApi.restoreNode).toHaveBeenCalled();
    }));
  });

  describe('Delete action', () => {
    it('should raise info message on successful single file deletion', (done) => {
      spyOn(contentApi, 'deleteNode').and.returnValue(of(null));

      actions$
        .pipe(
          ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
          map((action) => expect(action).toBeDefined())
        )
        .subscribe(() => done());

      const selection: any[] = [{ entry: { id: '1', name: 'name1' } }];

      store.dispatch(new DeleteNodesAction(selection));
    });

    it('should raise error message on failed single file deletion', (done) => {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(null));

      actions$
        .pipe(
          ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
          map((action) => expect(action).toBeDefined())
        )
        .subscribe(() => done());

      const selection: any[] = [{ entry: { id: '1', name: 'name1' } }];

      store.dispatch(new DeleteNodesAction(selection));
    });

    it('should raise info message on successful multiple files deletion', (done) => {
      spyOn(contentApi, 'deleteNode').and.returnValue(of(null));

      actions$
        .pipe(
          ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
          map((action) => expect(action).toBeDefined())
        )
        .subscribe(() => done());

      const selection: any[] = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

      store.dispatch(new DeleteNodesAction(selection));
    });

    it('should raise error message failed multiple files deletion', (done) => {
      spyOn(contentApi, 'deleteNode').and.returnValue(throwError(null));

      actions$
        .pipe(
          ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
          map((action) => expect(action).toBeDefined())
        )
        .subscribe(() => done());

      const selection: any[] = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

      store.dispatch(new DeleteNodesAction(selection));
    });

    it('should raise warning message when only one file is successful', (done) => {
      spyOn(contentApi, 'deleteNode').and.callFake((id) => {
        if (id === '1') {
          return throwError(null);
        } else {
          return of(null);
        }
      });

      actions$
        .pipe(
          ofType<SnackbarWarningAction>(SnackbarActionTypes.Warning),
          map((action) => expect(action).toBeDefined())
        )
        .subscribe(() => done());

      const selection: any[] = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

      store.dispatch(new DeleteNodesAction(selection));
    });

    it('should raise warning message when some files are successfully deleted', (done) => {
      spyOn(contentApi, 'deleteNode').and.callFake((id) => {
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

      actions$
        .pipe(
          ofType<SnackbarWarningAction>(SnackbarActionTypes.Warning),
          map((action) => expect(action).toBeDefined())
        )
        .subscribe(() => done());

      const selection: any[] = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }, { entry: { id: '3', name: 'name3' } }];

      store.dispatch(new DeleteNodesAction(selection));
    });
  });

  describe('Permanent Delete', () => {
    beforeEach(() => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<MatDialog>);
    });

    it('does not purge nodes if no selection', () => {
      spyOn(contentApi, 'purgeDeletedNode');

      store.dispatch(new PurgeDeletedNodesAction([]));
      expect(contentApi.purgeDeletedNode).not.toHaveBeenCalled();
    });

    it('call purge nodes if selection is not empty', () => {
      spyOn(contentApi, 'purgeDeletedNode').and.returnValue(of({}));

      const selection: any[] = [{ entry: { id: '1' } }];
      store.dispatch(new PurgeDeletedNodesAction(selection));

      expect(contentApi.purgeDeletedNode).toHaveBeenCalled();
    });

    describe('notification', () => {
      it('raises warning on multiple fail and one success', (done) => {
        actions$
          .pipe(
            ofType<SnackbarWarningAction>(SnackbarActionTypes.Warning),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
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

        const selection: any[] = [
          { entry: { id: '1', name: 'name1' } },
          { entry: { id: '2', name: 'name2' } },
          { entry: { id: '3', name: 'name3' } }
        ];

        store.dispatch(new PurgeDeletedNodesAction(selection));
      });

      it('raises warning on multiple success and multiple fail', (done) => {
        actions$
          .pipe(
            ofType<SnackbarWarningAction>(SnackbarActionTypes.Warning),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
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

        const selection: any[] = [
          { entry: { id: '1', name: 'name1' } },
          { entry: { id: '2', name: 'name2' } },
          { entry: { id: '3', name: 'name3' } },
          { entry: { id: '4', name: 'name4' } }
        ];

        store.dispatch(new PurgeDeletedNodesAction(selection));
      });

      it('raises info on one selected node success', (done) => {
        actions$
          .pipe(
            ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        spyOn(contentApi, 'purgeDeletedNode').and.returnValue(of({}));

        const selection: any[] = [{ entry: { id: '1', name: 'name1' } }];

        store.dispatch(new PurgeDeletedNodesAction(selection));
      });

      it('raises error on one selected node fail', (done) => {
        actions$
          .pipe(
            ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        spyOn(contentApi, 'purgeDeletedNode').and.returnValue(throwError({}));

        const selection: any[] = [{ entry: { id: '1', name: 'name1' } }];

        store.dispatch(new PurgeDeletedNodesAction(selection));
      });

      it('raises info on all nodes success', (done) => {
        actions$
          .pipe(
            ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
          if (id === '1') {
            return of({});
          }

          if (id === '2') {
            return of({});
          }

          return of(null);
        });

        const selection: any[] = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

        store.dispatch(new PurgeDeletedNodesAction(selection));
      });

      it('raises error on all nodes fail', (done) => {
        actions$
          .pipe(
            ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
          if (id === '1') {
            return throwError({});
          }

          if (id === '2') {
            return throwError({});
          }

          return of({});
        });

        const selection: any[] = [{ entry: { id: '1', name: 'name1' } }, { entry: { id: '2', name: 'name2' } }];

        store.dispatch(new PurgeDeletedNodesAction(selection));
      });
    });
  });

  describe('Restore Deleted', () => {
    it('does not restore nodes if no selection', () => {
      spyOn(contentApi, 'restoreNode');

      const selection: any[] = [];
      store.dispatch(new RestoreDeletedNodesAction(selection));

      expect(contentApi.restoreNode).not.toHaveBeenCalled();
    });

    it('does not restore nodes if selection has nodes without path', () => {
      spyOn(contentApi, 'restoreNode');

      const selection: any[] = [{ entry: { id: '1' } }];

      store.dispatch(new RestoreDeletedNodesAction(selection));

      expect(contentApi.restoreNode).not.toHaveBeenCalled();
    });

    it('call restore nodes if selection has nodes with path', () => {
      spyOn(contentApi, 'restoreNode').and.returnValue(of({} as NodeEntry));
      spyOn(contentApi, 'getDeletedNodes').and.returnValue(
        of({
          list: { entries: [] }
        })
      );

      const path = {
        elements: [
          {
            id: '1-1',
            name: 'somewhere-over-the-rainbow'
          }
        ]
      };

      const selection: any[] = [
        {
          entry: {
            id: '1',
            path
          }
        }
      ];

      store.dispatch(new RestoreDeletedNodesAction(selection));

      expect(contentApi.restoreNode).toHaveBeenCalled();
    });

    it('should navigate to library folder when node is a library content', () => {
      spyOn(store, 'dispatch').and.callThrough();
      spyOn(contentApi, 'restoreNode').and.returnValue(of({} as NodeEntry));
      spyOn(contentApi, 'getDeletedNodes').and.returnValue(
        of({
          list: { entries: [] }
        })
      );

      const path = {
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

      const selection: any[] = [
        {
          entry: {
            id: '1',
            path
          }
        }
      ];

      store.dispatch(new RestoreDeletedNodesAction(selection));

      expect(store.dispatch['calls'].argsFor(1)[0].userAction.action instanceof NavigateToParentFolder).toBe(true);
    });

    describe('notification', () => {
      beforeEach(() => {
        spyOn(contentApi, 'getDeletedNodes').and.returnValue(
          of({
            list: { entries: [] }
          })
        );
      });

      it('should raise error message on partial multiple fail ', (done) => {
        const error = { message: '{ "error": {} }' };

        actions$
          .pipe(
            ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        spyOn(contentApi, 'restoreNode').and.callFake((id) => {
          if (id === '1') {
            return of({} as NodeEntry);
          }

          if (id === '2') {
            return throwError(error);
          }

          if (id === '3') {
            return throwError(error);
          }

          return of({} as NodeEntry);
        });

        const path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };

        const selection: any[] = [
          { entry: { id: '1', name: 'name1', path } },
          { entry: { id: '2', name: 'name2', path } },
          { entry: { id: '3', name: 'name3', path } }
        ];

        store.dispatch(new RestoreDeletedNodesAction(selection));
      });

      it('should raise error message when restored node exist, error 409', (done) => {
        const error = { message: '{ "error": { "statusCode": 409 } }' };
        spyOn(contentApi, 'restoreNode').and.returnValue(throwError(error));

        actions$
          .pipe(
            ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        const path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };

        const selection: any[] = [{ entry: { id: '1', name: 'name1', path } }];

        store.dispatch(new RestoreDeletedNodesAction(selection));
      });

      it('should raise error message when restored node returns different statusCode', (done) => {
        const error = { message: '{ "error": { "statusCode": 404 } }' };

        spyOn(contentApi, 'restoreNode').and.returnValue(throwError(error));

        actions$
          .pipe(
            ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        const path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };

        const selection: any[] = [{ entry: { id: '1', name: 'name1', path } }];

        store.dispatch(new RestoreDeletedNodesAction(selection));
      });

      it('should raise error message when restored node location is missing', (done) => {
        const error = { message: '{ "error": { } }' };

        spyOn(contentApi, 'restoreNode').and.returnValue(throwError(error));

        actions$
          .pipe(
            ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        const path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };

        const selection: any[] = [{ entry: { id: '1', name: 'name1', path } }];

        store.dispatch(new RestoreDeletedNodesAction(selection));
      });

      it('should raise info message when restore multiple nodes', (done) => {
        spyOn(contentApi, 'restoreNode').and.callFake((id) => {
          const entry = {} as NodeEntry;
          if (id === '1') {
            return of(entry);
          }

          if (id === '2') {
            return of(entry);
          }

          return of(entry);
        });

        actions$
          .pipe(
            ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        const path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };

        const selection: any[] = [{ entry: { id: '1', name: 'name1', path } }, { entry: { id: '2', name: 'name2', path } }];

        store.dispatch(new RestoreDeletedNodesAction(selection));
      });

      it('should raise info message when restore selected node', (done) => {
        spyOn(contentApi, 'restoreNode').and.returnValue(of({} as NodeEntry));

        actions$
          .pipe(
            ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
            map((action) => expect(action).toBeDefined())
          )
          .subscribe(() => done());

        const path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };

        const selection: any[] = [{ entry: { id: '1', name: 'name1', path } }];

        store.dispatch(new RestoreDeletedNodesAction(selection));
      });

      it('navigate to restore selected node location onAction', (done) => {
        spyOn(contentApi, 'restoreNode').and.returnValue(of({} as NodeEntry));
        const path = {
          elements: [
            {
              id: '1-1',
              name: 'somewhere-over-the-rainbow'
            }
          ]
        };

        const selection: any[] = [
          {
            entry: {
              id: '1',
              name: 'name1',
              path
            }
          }
        ];

        actions$
          .pipe(
            ofType<RestoreDeletedNodesAction>(NodeActionTypes.RestoreDeleted),
            map((action) => {
              expect(action).toBeDefined();
            })
          )
          .subscribe(() => done());

        store.dispatch(new RestoreDeletedNodesAction(selection));
      });
    });
  });

  describe('Share Node', () => {
    it('should open dialog for nodes without requesting getNodeInfo', fakeAsync(() => {
      const node = { entry: { id: '1', name: 'name1' } } as any;
      spyOn(contentApi, 'getNodeInfo').and.returnValue(of({} as Node));
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(null)
      } as MatDialogRef<MatDialog>);

      store.dispatch(new ShareNodeAction(node));

      expect(contentApi.getNodeInfo).not.toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalled();
    }));

    it('should open dialog with getNodeInfo data when `id` property is missing', fakeAsync(() => {
      const node = {
        entry: { nodeId: '1', name: 'name1' }
      } as any;
      spyOn(contentApi, 'getNodeInfo').and.returnValue(of({} as Node));
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(null)
      } as MatDialogRef<MatDialog>);

      store.dispatch(new ShareNodeAction(node));

      expect(contentApi.getNodeInfo).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalled();
    }));

    it('should update node selection after dialog is closed', fakeAsync(() => {
      const node = { entry: { id: '1', name: 'name1' } } as NodeEntry;
      spyOn(store, 'dispatch').and.callThrough();
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(null)
      } as MatDialogRef<MatDialog>);

      store.dispatch(new ShareNodeAction(node));

      expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(new SetSelectedNodesAction([node]));
    }));

    it('should emit event when node is un-shared', fakeAsync(() => {
      const node = { entry: { id: '1', name: 'name1' } } as NodeEntry;
      spyOn(appHookService.linksUnshared, 'next').and.callThrough();
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(node)
      } as MatDialogRef<MatDialog>);

      store.dispatch(new ShareNodeAction(node));
      tick();
      flush();

      expect(appHookService.linksUnshared.next).toHaveBeenCalled();
    }));
  });

  describe('Unlock Node', () => {
    it('should unlock node', fakeAsync(() => {
      spyOn(contentApi, 'unlockNode').and.returnValue(Promise.resolve({} as NodeEntry));

      store.dispatch(new UnlockWriteAction({ entry: { id: 'node-id' } }));
      tick();
      flush();

      expect(contentApi.unlockNode).toHaveBeenCalled();
    }));

    it('should raise error when unlock node fails', fakeAsync(() => {
      spyOn(contentApi, 'unlockNode').and.callFake(() => new Promise((_resolve, reject) => reject('error')));
      spyOn(store, 'dispatch').and.callThrough();
      store.dispatch(new UnlockWriteAction({ entry: { id: 'node-id', name: 'some-file' } }));
      tick();
      flush();

      expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
          fileName: 'some-file'
        })
      );
    }));
  });

  describe('versionUpdateDialog', () => {
    beforeEach(() => {
      const fakeVersion = { list: { entries: [{ entry: { id: '1.0' } }] } } as VersionPaging;
      spyOn(contentApi, 'getNodeVersions').and.returnValue(of(fakeVersion));
    });

    it('should open dialog with NodeVersionUploadDialogComponent instance', () => {
      spyOn(dialog, 'open');
      const fakeNode = {
        name: 'lights.jpg',
        id: 'f5e5cb54-200e-41a8-9c21-b5ee77da3992'
      };
      const fakeFile = new FileModel({ name: 'file1.png', size: 10 } as File, null, 'file1');

      contentManagementService.versionUpdateDialog(fakeNode, fakeFile);

      expect(dialog.open['calls'].argsFor(0)[0].name).toBe('NodeVersionsDialogComponent');
      expect(dialog.open['calls'].argsFor(0)[1].data).toEqual({
        node: fakeNode,
        file: fakeFile,
        currentVersion: { id: '1.0' },
        title: 'VERSION.DIALOG.TITLE'
      });
    });
  });

  describe('editFolder', () => {
    it('should open dialog with FolderDialogComponent instance', () => {
      const mockDialogInstance: any = {
        componentInstance: { error: of() },
        afterClosed: () => of()
      };
      const node: any = { entry: { id: '1', name: 'name1', isFolder: true } };
      spyOn(dialog, 'open').and.returnValue(mockDialogInstance);

      contentManagementService.editFolder(node);

      expect(dialog.open['calls'].argsFor(0)[0].name).toBe('FolderDialogComponent');
    });

    it('should raise error when edit operation fails', fakeAsync(() => {
      const mockDialogInstance: any = {
        componentInstance: { error: new Subject<any>() },
        afterClosed: () => of()
      };
      const node: any = { entry: { id: '1', name: 'name1', isFolder: true } };
      spyOn(dialog, 'open').and.returnValue(mockDialogInstance);
      spyOn(store, 'dispatch').and.callThrough();

      contentManagementService.editFolder(node);

      mockDialogInstance.componentInstance.error.next('edit folder error');

      expect(store.dispatch['calls'].argsFor(0)[0]).toEqual(new SnackbarErrorAction('edit folder error'));
    }));

    it('should call nodeUpdated event with edited node data', fakeAsync(() => {
      const node: any = { entry: { id: '1', name: 'name1' } };
      const newNode: any = { entry: { id: '1', name: 'name-edited' } };
      const mockDialogInstance: any = {
        componentInstance: { error: new Subject<any>() },
        afterClosed: () => of(newNode)
      };

      spyOn(alfrescoApiService.nodeUpdated, 'next');
      spyOn(dialog, 'open').and.returnValue(mockDialogInstance);

      contentManagementService.editFolder(node);

      expect(alfrescoApiService.nodeUpdated.next).toHaveBeenCalledWith(newNode);
    }));
  });

  describe('aspect list dialog', () => {
    it('should open dialog for managing the aspects for share or favorites nodes', () => {
      spyOn(nodeAspectService, 'updateNodeAspects').and.stub();

      const fakeNode = { entry: { nodeId: 'fake-node-id' } };
      const responseNode: Node = {
        id: 'real-node-ghostbuster',
        name: 'name',
        nodeType: null,
        isFolder: false,
        isFile: true,
        modifiedAt: null,
        modifiedByUser: null,
        createdAt: null,
        createdByUser: null
      };

      spyOn(contentApi, 'getNodeInfo').and.returnValue(of(responseNode));

      contentManagementService.manageAspects(fakeNode);

      expect(nodeAspectService.updateNodeAspects).toHaveBeenCalledWith('real-node-ghostbuster');
    });

    it('should open dialog for managing the aspects', () => {
      spyOn(nodeAspectService, 'updateNodeAspects').and.stub();
      const fakeNode = { entry: { id: 'fake-node-id' } };

      contentManagementService.manageAspects(fakeNode);

      expect(nodeAspectService.updateNodeAspects).toHaveBeenCalledWith('fake-node-id');
    });
  });
});
