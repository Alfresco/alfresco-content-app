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

import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule, TranslationService, NodesApiService, NotificationService } from '@alfresco/adf-core';
import { Component, DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { NodeDeleteDirective } from './node-delete.directive';
import { ContentManagementService } from '../services/content-management.service';

@Component({
    template: '<div [app-delete-node]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeDeleteDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let notificationService: NotificationService;
    let translationService: TranslationService;
    let contentService: ContentManagementService;
    let nodeApiService: NodesApiService;
    let spySnackBar;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                TestComponent,
                 NodeDeleteDirective
            ],
            providers: [
                ContentManagementService
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeDeleteDirective));
        notificationService = TestBed.get(NotificationService);
        translationService = TestBed.get(TranslationService);
        nodeApiService = TestBed.get(NodesApiService);
        contentService = TestBed.get(ContentManagementService);
    });

    beforeEach(() => {
        spyOn(translationService, 'get').and.callFake((key) => {
            return Observable.of(key);
        });
    });

    describe('Delete action', () => {
        beforeEach(() => {
            spyOn(notificationService, 'openSnackMessageAction').and.callThrough();
        });

        it('notifies file deletion', () => {
            spyOn(nodeApiService, 'deleteNode').and.returnValue(Observable.of(null));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_DELETION.SINGULAR', 'APP.ACTIONS.UNDO', 10000
            );
        });

        it('notifies faild file deletion', () => {
            spyOn(nodeApiService, 'deleteNode').and.returnValue(Observable.throw(null));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.NODE_DELETION', '', 10000
            );
        });

        it('notifies files deletion', () => {
            spyOn(nodeApiService, 'deleteNode').and.returnValue(Observable.of(null));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_DELETION.PLURAL', 'APP.ACTIONS.UNDO', 10000
            );
        });

        it('notifies faild files deletion', () => {
            spyOn(nodeApiService, 'deleteNode').and.returnValue(Observable.throw(null));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.NODE_DELETION_PLURAL', '', 10000
            );
        });

        it('notifies partial deletion when only one file is successful', () => {
            spyOn(nodeApiService, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Observable.throw(null);
                } else {
                    return Observable.of(null);
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_SINGULAR', 'APP.ACTIONS.UNDO', 10000
            );
        });

        it('notifies partial deletion when some files are successful', () => {
            spyOn(nodeApiService, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Observable.throw(null);
                }

                if (id === '2') {
                    return Observable.of(null);
                }

                if (id === '3') {
                    return Observable.of(null);
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(notificationService.openSnackMessageAction).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_PLURAL', 'APP.ACTIONS.UNDO', 10000
            );
        });
    });

    describe('Restore action', () => {
        beforeEach(() => {
            spyOn(nodeApiService, 'deleteNode').and.returnValue(Observable.of(null));

            spySnackBar = spyOn(notificationService, 'openSnackMessageAction').and.returnValue({
                onAction: () => Observable.of({})
            });
        });

        it('notifies faild file on on restore', () => {
            spyOn(nodeApiService, 'restoreNode').and.returnValue(Observable.throw(null));

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(spySnackBar.calls.mostRecent().args)
                .toEqual((['APP.MESSAGES.ERRORS.NODE_RESTORE', '', 3000]));
        });

        it('notifies faild files on on restore', () => {
            spyOn(nodeApiService, 'restoreNode').and.returnValue(Observable.throw(null));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(spySnackBar.calls.mostRecent().args)
                .toEqual((['APP.MESSAGES.ERRORS.NODE_RESTORE_PLURAL', '', 3000]));
        });

        it('signals files restored', () => {
            spyOn(contentService.restoreNode, 'next');
            spyOn(nodeApiService, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Observable.of(null);
                } else {
                    return Observable.throw(null);
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(contentService.restoreNode.next).toHaveBeenCalled();
        });
    });
});
