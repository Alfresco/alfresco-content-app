/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { CoreModule, AlfrescoApiService, TranslationService, NotificationService } from 'ng2-alfresco-core';

import { NodeRestoreDirective } from './node-restore.directive';

@Component({
    template: `<div [app-restore-node]="selection"></div>`
})
class TestComponent {
    selection = [];
}

describe('NodeRestoreDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let alfrescoService: AlfrescoApiService;
    let translation: TranslationService;
    let notificationService: NotificationService;
    let router: Router;
    let nodesService;
    let coreApi;
    let directiveInstance;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                RouterTestingModule
            ],
            declarations: [
                TestComponent,
                NodeRestoreDirective
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement.query(By.directive(NodeRestoreDirective));
            directiveInstance = element.injector.get(NodeRestoreDirective);

            alfrescoService = TestBed.get(AlfrescoApiService);
            nodesService = alfrescoService.getInstance().nodes;
            coreApi = alfrescoService.getInstance().core;
            translation = TestBed.get(TranslationService);
            notificationService = TestBed.get(NotificationService);
            router = TestBed.get(Router);
        });
    }));

    beforeEach(() => {
        spyOn(translation, 'get').and.returnValue(Observable.of('message'));
    });

    it('does not restore nodes if no selection', () => {
        spyOn(nodesService, 'restoreNode');

        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(nodesService.restoreNode).not.toHaveBeenCalled();
    });

    it('does not restore nodes if selection has nodes without path', () => {
        spyOn(nodesService, 'restoreNode');

        component.selection = [ { entry: { id: '1' } } ];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(nodesService.restoreNode).not.toHaveBeenCalled();
    });

    it('call restore nodes if selection has nodes with path', fakeAsync(() => {
        spyOn(directiveInstance, 'restoreNotification').and.callFake(() => null);
        spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
        spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
            list: { entries: [] }
        }));

        component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);
        tick();

        expect(nodesService.restoreNode).toHaveBeenCalled();
    }));

    describe('refresh()', () => {
        it('reset selection', fakeAsync(() => {
            spyOn(directiveInstance, 'restoreNotification').and.callFake(() => null);
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
            spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
                list: { entries: [] }
            }));

            component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();

            expect(directiveInstance.selection.length).toBe(1);

            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.selection.length).toBe(0);
        }));

        it('reset status', fakeAsync(() => {
            directiveInstance.restoreProcessStatus.fail = [{}];
            directiveInstance.restoreProcessStatus.success = [{}];

            directiveInstance.restoreProcessStatus.reset();

            expect(directiveInstance.restoreProcessStatus.fail).toEqual([]);
            expect(directiveInstance.restoreProcessStatus.success).toEqual([]);
        }));

        it('dispatch event on finish', fakeAsync(() => {
            spyOn(directiveInstance, 'restoreNotification').and.callFake(() => null);
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
            spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
                list: { entries: [] }
            }));
            spyOn(element.nativeElement, 'dispatchEvent');

            component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(element.nativeElement.dispatchEvent).toHaveBeenCalled();
        }));
    });

    describe('notification', () => {
        beforeEach(() => {
            spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
                list: { entries: [] }
            }));
        });

        it('notifies on partial multiple fail ', fakeAsync(() => {
            const error = { message: '{ "error": {} }' };

            spyOn(notificationService, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });

            spyOn(nodesService, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                if (id === '2') {
                    return Promise.reject(error);
                }

                if (id === '3') {
                    return Promise.reject(error);
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '2', name: 'name2', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '3', name: 'name3', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.PARTIAL_PLURAL',
                { number: 2 }
            );
        }));

        it('notifies fail when restored node exist, error 409', fakeAsync(() => {
            const error = { message: '{ "error": { "statusCode": 409 } }' };

            spyOn(notificationService, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.reject(error));

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.NODE_EXISTS',
                { name: 'name1' }
            );
        }));

        it('notifies fail when restored node returns different statusCode', fakeAsync(() => {
            const error = { message: '{ "error": { "statusCode": 404 } }' };

            spyOn(notificationService, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.reject(error));

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.GENERIC',
                { name: 'name1' }
            );
        }));

        it('notifies fail when restored node location is missing', fakeAsync(() => {
            const error = { message: '{ "error": { } }' };

            spyOn(notificationService, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.reject(error));

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.LOCATION_MISSING',
                { name: 'name1' }
            );
        }));

        it('notifies success when restore multiple nodes', fakeAsync(() => {
            spyOn(notificationService, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                if (id === '2') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '2', name: 'name2', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.TRASH.NODES_RESTORE.PLURAL'
            );
        }));

        it('notifies success when restore selected node', fakeAsync(() => {
            spyOn(notificationService, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.TRASH.NODES_RESTORE.SINGULAR',
                { name: 'name1' }
            );
        }));

        it('navigate to restore selected node location onAction', fakeAsync(() => {
            spyOn(router, 'navigate');
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
            spyOn(notificationService, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.of({}) });

            component.selection = [
                {
                    entry: {
                         id: '1',
                         name: 'name1',
                         path: {
                             elements: ['somewhere-over-the-rainbow']
                         }
                    }
                }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(router.navigate).toHaveBeenCalled();
        }));
    });
});
