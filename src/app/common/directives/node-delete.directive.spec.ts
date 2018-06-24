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

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Component, DebugElement } from '@angular/core';

import { NodeDeleteDirective } from './node-delete.directive';
import { EffectsModule, Actions, ofType } from '@ngrx/effects';
import { NodeEffects } from '../../store/effects/node.effects';
import {
    SnackbarInfoAction, SNACKBAR_INFO, SNACKBAR_ERROR,
    SnackbarErrorAction, SnackbarWarningAction, SNACKBAR_WARNING
} from '../../store/actions';
import { map } from 'rxjs/operators';
import { AppTestingModule } from '../../testing/app-testing.module';

@Component({
    template: '<div [acaDeleteNode]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeDeleteDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let alfrescoApiService: AlfrescoApiService;
    let actions$: Actions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTestingModule,
                EffectsModule.forRoot([NodeEffects])
            ],
            declarations: [
                NodeDeleteDirective,
                TestComponent
            ]
        });

        alfrescoApiService = TestBed.get(AlfrescoApiService);
        alfrescoApiService.reset();

        actions$ = TestBed.get(Actions);

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeDeleteDirective));
    });

    describe('Delete action', () => {
        it('should raise info message on successful single file deletion', fakeAsync(done => {
            spyOn(alfrescoApiService.nodesApi, 'deleteNode').and.returnValue(Promise.resolve(null));

            actions$.pipe(
                ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                map(action => {
                    done();
                })
            );

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            tick();
        }));

        it('should raise error message on failed single file deletion', fakeAsync(done => {
            spyOn(alfrescoApiService.nodesApi, 'deleteNode').and.returnValue(Promise.reject(null));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => {
                    done();
                })
            );

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            tick();
        }));

        it('should raise info message on successful multiple files deletion', fakeAsync(done => {
            spyOn(alfrescoApiService.nodesApi, 'deleteNode').and.returnValue(Promise.resolve(null));

            actions$.pipe(
                ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                map(action => {
                    done();
                })
            );

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            tick();
        }));

        it('should raise error message failed multiple files deletion', fakeAsync(done => {
            spyOn(alfrescoApiService.nodesApi, 'deleteNode').and.returnValue(Promise.reject(null));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => {
                    done();
                })
            );

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            tick();
        }));

        it('should raise warning message when only one file is successful', fakeAsync(done => {
            spyOn(alfrescoApiService.nodesApi, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject(null);
                } else {
                    return Promise.resolve(null);
                }
            });

            actions$.pipe(
                ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
                map(action => {
                    done();
                })
            );

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            tick();
        }));

        it('should raise warning message when some files are successfully deleted', fakeAsync(done => {
            spyOn(alfrescoApiService.nodesApi, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject(null);
                }

                if (id === '2') {
                    return Promise.resolve(null);
                }

                if (id === '3') {
                    return Promise.resolve(null);
                }
            });

            actions$.pipe(
                ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
                map(action => {
                    done();
                })
            );

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            tick();
        }));
    });

    /*
    describe('Restore action', () => {
        beforeEach(() => {
            spyOn(alfrescoApiService.nodesApi, 'deleteNode').and.returnValue(Promise.resolve(null));
        });

        it('notifies failed file on on restore', () => {
            spyOn(alfrescoApiService.nodesApi, 'restoreNode').and.returnValue(Promise.reject(null));

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(spySnackBar.calls.mostRecent().args)
                .toEqual((['APP.MESSAGES.ERRORS.NODE_RESTORE', '', 3000]));
        });

        it('notifies failed files on on restore', () => {
            spyOn(alfrescoApiService.nodesApi, 'restoreNode').and.returnValue(Promise.reject(null));

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
            spyOn(contentService.nodeRestored, 'next');
            spyOn(alfrescoApiService.nodesApi, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve(null);
                } else {
                    return Promise.reject(null);
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(contentService.nodeRestored.next).toHaveBeenCalled();
        });
    });
    */
});
