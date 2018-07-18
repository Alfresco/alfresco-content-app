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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';
import { NodeActionsService } from '../services/node-actions.service';
import { NodeCopyDirective } from './node-copy.directive';
import { ContentApiService } from '../services/content-api.service';
import { AppTestingModule } from '../testing/app-testing.module';

@Component({
    template: '<div [acaCopyNode]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeCopyDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let element: DebugElement;
    let snackBar: MatSnackBar;
    let service: NodeActionsService;
    let contentApi: ContentApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ AppTestingModule ],
            declarations: [
                TestComponent,
                NodeCopyDirective
            ]
        });

        contentApi = TestBed.get(ContentApiService);

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeCopyDirective));
        snackBar = TestBed.get(MatSnackBar);
        service = TestBed.get(NodeActionsService);
    });

    describe('Copy node action', () => {
        beforeEach(() => {
            spyOn(snackBar, 'open').and.callThrough();
        });

        it('notifies successful copy of a node', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.COPY'));

            component.selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
            const createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
        });

        it('notifies successful copy of multiple nodes', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.COPY'));

            component.selection = [
                { entry: { id: 'node-to-copy-1', name: 'name1' } },
                { entry: { id: 'node-to-copy-2', name: 'name2' } }];
            const createdItems = [
                { entry: { id: 'copy-of-node-1', name: 'name1' } },
                { entry: { id: 'copy-of-node-2', name: 'name2' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PLURAL');
        });

        it('notifies partially copy of one node out of a multiple selection of nodes', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.COPY'));

            component.selection = [
                { entry: { id: 'node-to-copy-1', name: 'name1' } },
                { entry: { id: 'node-to-copy-2', name: 'name2' } }];
            const createdItems = [
                { entry: { id: 'copy-of-node-1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PARTIAL_SINGULAR');
        });

        it('notifies partially copy of more nodes out of a multiple selection of nodes', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.COPY'));

            component.selection = [
                { entry: { id: 'node-to-copy-0', name: 'name0' } },
                { entry: { id: 'node-to-copy-1', name: 'name1' } },
                { entry: { id: 'node-to-copy-2', name: 'name2' } }];
            const createdItems = [
                { entry: { id: 'copy-of-node-0', name: 'name0' } },
                { entry: { id: 'copy-of-node-1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PARTIAL_PLURAL');
        });

        it('notifies of failed copy of multiple nodes', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.COPY'));

            component.selection = [
                { entry: { id: 'node-to-copy-0', name: 'name0' } },
                { entry: { id: 'node-to-copy-1', name: 'name1' } },
                { entry: { id: 'node-to-copy-2', name: 'name2' } }];
            const createdItems = [];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.FAIL_PLURAL');
        });

        it('notifies of failed copy of one node', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.COPY'));

            component.selection = [
                { entry: { id: 'node-to-copy', name: 'name' } }];
            const createdItems = [];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.FAIL_SINGULAR');
        });

        it('notifies error if success message was not emitted', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of(''));

            component.selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next();

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
        });

        it('notifies permission error on copy of node', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 403}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.PERMISSION');
        });

        it('notifies generic error message on all errors, but 403', () => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 404}}))));

            component.selection = [{ entry: { id: '1', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.ERRORS.GENERIC');
        });
    });

    describe('Undo Copy action', () => {
        beforeEach(() => {
            spyOn(service, 'copyNodes').and.returnValue(Observable.of('OPERATION.SUCCES.CONTENT.COPY'));

            spyOn(snackBar, 'open').and.returnValue({
                onAction: () => Observable.of({})
            });
        });

        it('should delete the newly created node on Undo action', () => {
            spyOn(contentApi, 'deleteNode').and.returnValue(Observable.of(null));

            component.selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
            const createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');

            expect(contentApi.deleteNode).toHaveBeenCalledWith(createdItems[0].entry.id, { permanent: true });
        });

        it('should delete also the node created inside an already existing folder from destination', () => {
            const spyOnDeleteNode = spyOn(contentApi, 'deleteNode').and.returnValue(Observable.of(null));

            component.selection = [
                { entry: { id: 'node-to-copy-1', name: 'name1' } },
                { entry: { id: 'node-to-copy-2', name: 'folder-with-name-already-existing-on-destination' } }];
            const id1 = 'copy-of-node-1';
            const id2 = 'copy-of-child-of-node-2';
            const createdItems = [
                { entry: { id: id1, name: 'name1' } },
                [ { entry: { id: id2, name: 'name-of-child-of-node-2' , parentId: 'the-folder-already-on-destination' } }] ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toBe('APP.MESSAGES.INFO.NODE_COPY.PLURAL');

            expect(spyOnDeleteNode).toHaveBeenCalled();
            expect(spyOnDeleteNode.calls.allArgs())
                .toEqual([[id1, { permanent: true }], [id2, { permanent: true }]]);
        });

        it('notifies when error occurs on Undo action', () => {
            spyOn(contentApi, 'deleteNode').and.returnValue(Observable.throw(null));

            component.selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
            const createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(contentApi.deleteNode).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toEqual('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
        });

        it('notifies when some error of type Error occurs on Undo action', () => {
            spyOn(contentApi, 'deleteNode').and.returnValue(Observable.throw(new Error('oops!')));

            component.selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
            const createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(contentApi.deleteNode).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toEqual('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
        });

        it('notifies permission error when it occurs on Undo action', () => {
            spyOn(contentApi, 'deleteNode').and.returnValue(Observable.throw(new Error(JSON.stringify({error: {statusCode: 403}}))));

            component.selection = [{ entry: { id: 'node-to-copy-id', name: 'name' } }];
            const createdItems = [{ entry: { id: 'copy-id', name: 'name' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            service.contentCopied.next(<any>createdItems);

            expect(service.copyNodes).toHaveBeenCalled();
            expect(contentApi.deleteNode).toHaveBeenCalled();
            expect(snackBar.open['calls'].argsFor(0)[0]).toEqual('APP.MESSAGES.INFO.NODE_COPY.SINGULAR');
        });
    });

});
