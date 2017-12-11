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
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { CoreModule, AlfrescoApiService, TranslationService, NotificationService } from '@alfresco/adf-core';

import { NodePermanentDeleteDirective } from './node-permanent-delete.directive';

@Component({
    template: `<div [app-permanent-delete-node]="selection"></div>`
})
class TestComponent {
    selection = [];
}

describe('NodePermanentDeleteDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let alfrescoService: AlfrescoApiService;
    let translation: TranslationService;
    let notificationService: NotificationService;
    let nodesService;
    let directiveInstance;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                TestComponent,
                NodePermanentDeleteDirective
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement.query(By.directive(NodePermanentDeleteDirective));
            directiveInstance = element.injector.get(NodePermanentDeleteDirective);

            alfrescoService = TestBed.get(AlfrescoApiService);
            nodesService = alfrescoService.getInstance().nodes;
            translation = TestBed.get(TranslationService);
            notificationService = TestBed.get(NotificationService);
        });
    }));

    beforeEach(() => {
        spyOn(translation, 'get').and.returnValue(Observable.of('message'));
        spyOn(notificationService, 'openSnackMessage').and.returnValue({});
    });

    it('does not purge nodes if no selection', () => {
        spyOn(nodesService, 'purgeDeletedNode');

        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(nodesService.purgeDeletedNode).not.toHaveBeenCalled();
    });

    it('call purge nodes if selection is not empty', fakeAsync(() => {
        spyOn(nodesService, 'purgeDeletedNode').and.returnValue(Promise.resolve());

        component.selection = [ { entry: { id: '1' } } ];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);
        tick();

        expect(nodesService.purgeDeletedNode).toHaveBeenCalled();
    }));

    describe('notification', () => {
        it('notifies on multiple fail and one success', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                if (id === '2') {
                    return Promise.reject({});
                }

                if (id === '3') {
                    return Promise.reject({});
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_SINGULAR',
                { name: 'name1', failed: 2 }
            );
        }));

        it('notifies on multiple success and multiple fail', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                if (id === '2') {
                    return Promise.reject({});
                }

                if (id === '3') {
                    return Promise.reject({});
                }

                if (id === '4') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } },
                { entry: { id: '4', name: 'name4' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_PLURAL',
                { number: 2, failed: 2 }
            );
        }));

        it('notifies on one selected node success', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.SINGULAR',
                { name: 'name1' }
            );
        }));

        it('notifies on one selected node fail', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.returnValue(Promise.reject({}));

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.SINGULAR',
                { name: 'name1' }
            );
        }));

        it('notifies on selected nodes success', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                if (id === '2') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PLURAL',
                { number: 2 }
            );
        }));

        it('notifies on selected nodes fail', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject({});
                }

                if (id === '2') {
                    return Promise.reject({});
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
            expect(translation.get).toHaveBeenCalledWith(
                'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.PLURAL',
                { number: 2 }
            );
        }));
    });

    describe('refresh()', () => {
        it('resets selection on success', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.selection).toEqual([]);
        }));

        it('resets selection on error', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.returnValue(Promise.reject({}));

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.selection).toEqual([]);
        }));

        it('resets status', fakeAsync(() => {
            const status = directiveInstance.processStatus([
                { status: 0 },
                { status: 1 }
            ]);

            expect(status.fail.length).toBe(1);
            expect(status.success.length).toBe(1);

            status.reset();

            expect(status.fail.length).toBe(0);
            expect(status.success.length).toBe(0);
        }));

        it('dispatch event on partial success', fakeAsync(() => {
            spyOn(element.nativeElement, 'dispatchEvent');
            spyOn(nodesService, 'purgeDeletedNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject({});
                }

                if (id === '2') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(element.nativeElement.dispatchEvent).toHaveBeenCalled();
        }));

        it('does not dispatch event on error', fakeAsync(() => {
            spyOn(nodesService, 'purgeDeletedNode').and.returnValue(Promise.reject({}));
            spyOn(element.nativeElement, 'dispatchEvent');

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(element.nativeElement.dispatchEvent).not.toHaveBeenCalled();
        }));
    });
});
