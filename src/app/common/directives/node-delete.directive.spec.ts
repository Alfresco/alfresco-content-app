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
