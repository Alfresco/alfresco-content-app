import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Rx';

import { CoreModule, TranslationService, NodesApiService, NotificationService } from 'ng2-alfresco-core';
import { DocumentListModule } from 'ng2-alfresco-documentlist';

import { NodeActionsService } from '../services/node-actions.service';
import { ContentManagementService } from '../services/content-management.service';
import { NodeMoveDirective } from './node-move.directive';

@Component({
    template: '<div [app-move-node]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeMoveDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let element: DebugElement;
    let notificationService: NotificationService;
    let nodesApiService: NodesApiService;
    let service: NodeActionsService;
    let translationService: TranslationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DocumentListModule
            ],
            declarations: [
                TestComponent,
                NodeMoveDirective
            ],
            providers: [
                ContentManagementService,
                NodeActionsService
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeMoveDirective));
        notificationService = TestBed.get(NotificationService);
        nodesApiService = TestBed.get(NodesApiService);
        service = TestBed.get(NodeActionsService);
        translationService = TestBed.get(TranslationService);
    });

    beforeEach(() => {
        spyOn(translationService, 'get').and.callFake((keysArray) => {
            const processedKeys = {};
            keysArray.forEach((key) => {
                processedKeys[key] = key;
            });
            return Observable.of(processedKeys);
        });
    });

    describe('Move node action', () => {
        beforeEach(() => {
            spyOn(notificationService, 'openSnackMessageAction').and.callThrough();
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR', 'Undo', 10000
            );
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_MOVE.PLURAL', 'Undo', 10000
            );
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR', 'Undo', 10000
            );
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.PLURAL', 'Undo', 10000
            );
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.FAIL', 'Undo', 10000
            );
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_MOVE.SINGULAR APP.MESSAGES.INFO.NODE_MOVE.PARTIAL.SINGULAR', 'Undo', 10000
            );
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith('APP.MESSAGES.ERRORS.GENERIC', '', 3000);
        });

        it('notifies permission error on move of node', () => {
            spyOn(service, 'moveNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 403}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.PERMISSION', '', 3000
            );
        });

        it('notifies generic error message on all errors, but 403', () => {
            spyOn(service, 'moveNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 404}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.GENERIC', '', 3000
            );
        });

        it('notifies conflict error message on 409', () => {
            spyOn(service, 'moveNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 409}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.moveNodes).toHaveBeenCalled();
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.NODE_MOVE', '', 3000
            );
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
            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.GENERIC', '', 3000
            );
        });
    });
});
