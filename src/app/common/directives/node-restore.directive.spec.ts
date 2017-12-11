/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { CoreModule, AlfrescoApiService, TranslationService, NotificationService } from '@alfresco/adf-core';

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
