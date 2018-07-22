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
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NodeRestoreDirective } from './node-restore.directive';
import { ContentManagementService } from '../services/content-management.service';
import { Actions, ofType, EffectsModule } from '@ngrx/effects';
import { SnackbarErrorAction,
    SNACKBAR_ERROR, SnackbarInfoAction, SNACKBAR_INFO,
    NavigateRouteAction, NAVIGATE_ROUTE } from '../store/actions';
import { map } from 'rxjs/operators';
import { AppTestingModule } from '../testing/app-testing.module';
import { ContentApiService } from '../services/content-api.service';
import { Observable } from 'rxjs/Rx';
import { NodeEffects } from '../store/effects';
import { MinimalNodeEntity } from 'alfresco-js-api';

@Component({
    template: `<div [acaRestoreNode]="selection"></div>`
})
class TestComponent {
    selection: Array<MinimalNodeEntity> = [];
}

describe('NodeRestoreDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let contentManagementService: ContentManagementService;
    let actions$: Actions;
    let contentApi: ContentApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTestingModule,
                EffectsModule.forRoot([NodeEffects])
            ],
            declarations: [
                NodeRestoreDirective,
                TestComponent
            ]
        });

        actions$ = TestBed.get(Actions);

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeRestoreDirective));

        contentManagementService = TestBed.get(ContentManagementService);
        contentApi = TestBed.get(ContentApiService);
    });

    it('does not restore nodes if no selection', () => {
        spyOn(contentApi, 'restoreNode');

        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(contentApi.restoreNode).not.toHaveBeenCalled();
    });

    it('does not restore nodes if selection has nodes without path', () => {
        spyOn(contentApi, 'restoreNode');

        component.selection = [ { entry: { id: '1' } } ];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(contentApi.restoreNode).not.toHaveBeenCalled();
    });

    it('call restore nodes if selection has nodes with path', fakeAsync(() => {
        spyOn(contentApi, 'restoreNode').and.returnValue(Observable.of({}));
        spyOn(contentApi, 'getDeletedNodes').and.returnValue(Observable.of({
            list: { entries: [] }
        }));

        const path = {
            elements: [
                {
                    id: '1-1',
                    name: 'somewhere-over-the-rainbow'
                }
            ]
        };

        component.selection = [
            {
                entry: {
                    id: '1',
                    path
                }
            }
        ];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);
        tick();

        expect(contentApi.restoreNode).toHaveBeenCalled();
    }));

    describe('refresh()', () => {
        it('dispatch event on finish', fakeAsync(done => {
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.of({}));
            spyOn(contentApi, 'getDeletedNodes').and.returnValue(Observable.of({
                list: { entries: [] }
            }));

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                {
                    entry: {
                        id: '1',
                        path
                    }
                }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            contentManagementService.nodesRestored.subscribe(() => done());
        }));
    });

    describe('notification', () => {
        beforeEach(() => {
            spyOn(contentApi, 'getDeletedNodes').and.returnValue(Observable.of({
                list: { entries: [] }
            }));
        });

        it('should raise error message on partial multiple fail ', fakeAsync(done => {
            const error = { message: '{ "error": {} }' };

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => done())
            );

            spyOn(contentApi, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Observable.of({});
                }

                if (id === '2') {
                    return Observable.throw(error);
                }

                if (id === '3') {
                    return Observable.throw(error);
                }
            });

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                { entry: { id: '1', name: 'name1', path } },
                { entry: { id: '2', name: 'name2', path } },
                { entry: { id: '3', name: 'name3', path } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        it('should raise error message when restored node exist, error 409', fakeAsync(done => {
            const error = { message: '{ "error": { "statusCode": 409 } }' };
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.throw(error));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => done())
            );

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                { entry: { id: '1', name: 'name1', path } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        it('should raise error message when restored node returns different statusCode', fakeAsync(done => {
            const error = { message: '{ "error": { "statusCode": 404 } }' };

            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.throw(error));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => done())
            );

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                { entry: { id: '1', name: 'name1', path } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        it('should raise error message when restored node location is missing', fakeAsync(done => {
            const error = { message: '{ "error": { } }' };

            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.throw(error));

            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map(action => done())
            );

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                { entry: { id: '1', name: 'name1', path } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        it('should raise info message when restore multiple nodes', fakeAsync(done => {
            spyOn(contentApi, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Observable.of({});
                }

                if (id === '2') {
                    return Observable.of({});
                }
            });

            actions$.pipe(
                ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                map(action => done())
            );

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                { entry: { id: '1', name: 'name1', path } },
                { entry: { id: '2', name: 'name2', path } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        xit('should raise info message when restore selected node', fakeAsync(done => {
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.of({}));

            actions$.pipe(
                ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                map(action => done())
            );

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                { entry: { id: '1', name: 'name1', path } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        it('navigate to restore selected node location onAction', fakeAsync(done => {
            spyOn(contentApi, 'restoreNode').and.returnValue(Observable.of({}));

            actions$.pipe(
                ofType<NavigateRouteAction>(NAVIGATE_ROUTE),
                map(action => done())
            );

            const path = {
                elements: [
                    {
                        id: '1-1',
                        name: 'somewhere-over-the-rainbow'
                    }
                ]
            };

            component.selection = [
                {
                    entry: {
                         id: '1',
                         name: 'name1',
                         path
                    }
                }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));
    });
});
