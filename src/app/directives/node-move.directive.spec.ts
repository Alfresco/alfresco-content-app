/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';
import { TranslationService } from '@alfresco/adf-core';
import { NodeActionsService } from '../services/node-actions.service';
import { NodeMoveDirective } from './node-move.directive';
import { EffectsModule, Actions, ofType } from '@ngrx/effects';
import { NodeEffects } from '../store/effects/node.effects';
import { SnackbarErrorAction, SNACKBAR_ERROR } from '../store/actions';
import { map } from 'rxjs/operators';
import { AppTestingModule } from '../testing/app-testing.module';
import { ContentApiService } from '../services/content-api.service';

@Component({
    template: '<div [acaMoveNode]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeMoveDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let element: DebugElement;
    let service: NodeActionsService;
    let actions$: Actions;
    let translationService: TranslationService;
    let contentApi: ContentApiService;
    let snackBar: MatSnackBar;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTestingModule,
                EffectsModule.forRoot([NodeEffects])
            ],
            declarations: [
                NodeMoveDirective,
                TestComponent
            ]
        });

        contentApi = TestBed.get(ContentApiService);
        translationService = TestBed.get(TranslationService);

        actions$ = TestBed.get(Actions);
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeMoveDirective));
        service = TestBed.get(NodeActionsService);
        snackBar = TestBed.get(MatSnackBar);
    });

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

    describe('Move node action', () => {
        beforeEach(() => {
            spyOn(snackBar, 'open').and.callThrough();
        });

        it('notifies successful move of a node', () => {
            const node = [ { entry: { id: 'node-to-move-id', name: 'name' } } ];
            const moveResponse = {
                succeeded: node,
                failed: [],
                partiallySucceeded: []
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));
            spyOn(service, 'processResponse').and.returnValue(moveResponse);

            component.selection = node;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
        });

        it('notifies successful move of multiple nodes', () => {
            const nodes = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }];
            const moveResponse = {
                succeeded: nodes,
                failed: [],
                partiallySucceeded: []
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));
            spyOn(service, 'processResponse').and.returnValue(moveResponse);

            component.selection = nodes;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.PLURAL');
        });

        it('notifies partial move of a node', () => {
            const node = [ { entry: { id: '1', name: 'name' } } ];
            const moveResponse = {
                succeeded: [],
                failed: [],
                partiallySucceeded: node
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));
            spyOn(service, 'processResponse').and.returnValue(moveResponse);

            component.selection = node;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR');
        });

        it('notifies partial move of multiple nodes', () => {
            const nodes = [
                { entry: { id: '1', name: 'name' } },
                { entry: { id: '2', name: 'name2' } } ];
            const moveResponse = {
                succeeded: [],
                failed: [],
                partiallySucceeded: nodes
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));
            spyOn(service, 'processResponse').and.returnValue(moveResponse);

            component.selection = nodes;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.PLURAL');
        });

        it('notifies successful move and the number of nodes that could not be moved', () => {
            const nodes = [ { entry: { id: '1', name: 'name' } },
                { entry: { id: '2', name: 'name2' } } ];
            const moveResponse = {
                succeeded: [ nodes[0] ],
                failed: [ nodes[1] ],
                partiallySucceeded: []
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));
            spyOn(service, 'processResponse').and.returnValue(moveResponse);

            component.selection = nodes;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0])
                .toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.FAIL');
        });

        it('notifies successful move and the number of partially moved ones', () => {
            const nodes = [ { entry: { id: '1', name: 'name' } },
                { entry: { id: '2', name: 'name2' } } ];
            const moveResponse = {
                succeeded: [ nodes[0] ],
                failed: [],
                partiallySucceeded: [ nodes[1] ]
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));
            spyOn(service, 'processResponse').and.returnValue(moveResponse);

            component.selection = nodes;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0])
                .toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR');
        });

        it('notifies error if success message was not emitted', () => {
            const node = { entry: { id: 'node-to-move-id', name: 'name' } };
            const moveResponse = {
                succeeded: [],
                failed: [],
                partiallySucceeded: []
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of(''));

            component.selection = [ node ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
        });

        it('notifies permission error on move of node', () => {
            spyOn(service, 'moveNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 403}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.PERMISSION');
        });

        it('notifies generic error message on all errors, but 403', () => {
            spyOn(service, 'moveNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 404}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
        });

        it('notifies conflict error message on 409', () => {
            spyOn(service, 'moveNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 409}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.NODE_MOVE');
        });

        it('notifies error if move response has only failed items', () => {
            const node = [ { entry: { id: '1', name: 'name' } } ];
            const moveResponse = {
                succeeded: [],
                failed: [ {} ],
                partiallySucceeded: []
            };

            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));
            spyOn(service, 'processResponse').and.returnValue(moveResponse);

            component.selection = node;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(moveResponse);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
        });
    });

    describe('Undo Move action', () => {
        beforeEach(() => {
            spyOn(service, 'moveNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.MOVE'));

            spyOn(snackBar, 'open').and.returnValue({
                onAction: () => Observable.of({})
            });

            // spyOn(snackBar, 'open').and.callThrough();
        });

        it('should move node back to initial parent, after succeeded move', () => {
            const initialParent = 'parent-id-0';
            const node = { entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent } };
            component.selection = [ node ];

            spyOn(service, 'moveNodeAction').and.returnValue(Observable.of({}));

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            const movedItems = {
                failed: [],
                partiallySucceeded: [],
                succeeded: [ { itemMoved: node, initialParentId: initialParent} ]
            };
            service.contentMoved.next(<any>movedItems);

            expect(service.moveNodeAction)
                .toHaveBeenCalledWith(movedItems.succeeded[0].itemMoved.entry, movedItems.succeeded[0].initialParentId);
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
        });

        it('should move node back to initial parent, after succeeded move of a single file', () => {
            const initialParent = 'parent-id-0';
            const node = { entry: { id: 'node-to-move-id', name: 'name', isFolder: false, parentId: initialParent } };
            component.selection = [ node ];

            spyOn(service, 'moveNodeAction').and.returnValue(Observable.of({}));

            const movedItems = {
                failed: [],
                partiallySucceeded: [],
                succeeded: [ node ]
            };

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(<any>movedItems);

            expect(service.moveNodeAction).toHaveBeenCalledWith(node.entry, initialParent);
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
        });

        it('should restore deleted folder back to initial parent, after succeeded moving all its files', () => {
            // when folder was deleted after all its children were moved to a folder with the same name from destination
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.of(null));

            const initialParent = 'parent-id-0';
            const node = { entry: { id: 'folder-to-move-id', name: 'conflicting-name', parentId: initialParent, isFolder: true } };
            component.selection = [ node ];

            const itemMoved = {}; // folder was empty
            service.moveDeletedEntries = [ node ]; // folder got deleted

            const movedItems = {
                failed: [],
                partiallySucceeded: [],
                succeeded: [ [ itemMoved ] ]
            };

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(<any>movedItems);

            expect(contentApi.restoreNode).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_MOVE.SINGULAR');
        });

        it('should notify when error occurs on Undo Move action', fakeAsync(done => {
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.throw(null));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => done())
            );

            const initialParent = 'parent-id-0';
            const node = { entry: { id: 'node-to-move-id', name: 'conflicting-name', parentId: initialParent } };
            component.selection = [node];

            const afterMoveParentId = 'parent-id-1';
            const childMoved = { entry: { id: 'child-of-node-to-move-id', name: 'child-name', parentId: afterMoveParentId } };
            service.moveDeletedEntries = [ node ]; // folder got deleted

            const movedItems = {
                failed: [],
                partiallySucceeded: [],
                succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
            };

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(<any>movedItems);

            expect(contentApi.restoreNode).toHaveBeenCalled();
        }));

        it('should notify when some error of type Error occurs on Undo Move action', fakeAsync(done => {
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.throw(new Error('oops!')));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => done())
            );

            const initialParent = 'parent-id-0';
            const node = { entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent } };
            component.selection = [ node ];

            const childMoved = { entry: { id: 'child-of-node-to-move-id', name: 'child-name' } };
            service.moveDeletedEntries = [ node ]; // folder got deleted

            const movedItems = {
                failed: [],
                partiallySucceeded: [],
                succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
            };

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(<any>movedItems);

            expect(contentApi.restoreNode).toHaveBeenCalled();
        }));

        it('should notify permission error when it occurs on Undo Move action', fakeAsync(done => {
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 403}}))));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => done())
            );

            const initialParent = 'parent-id-0';
            const node = { entry: { id: 'node-to-move-id', name: 'name', parentId: initialParent } };
            component.selection = [ node ];

            const childMoved = { entry: { id: 'child-of-node-to-move-id', name: 'child-name' } };
            service.moveDeletedEntries = [ node ]; // folder got deleted

            const movedItems = {
                failed: [],
                partiallySucceeded: [],
                succeeded: [{ itemMoved: childMoved, initialParentId: initialParent }]
            };

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentMoved.next(<any>movedItems);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(contentApi.restoreNode).toHaveBeenCalled();
        }));
    });

});
