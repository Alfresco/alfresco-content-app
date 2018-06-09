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
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService, CoreModule } from '@alfresco/adf-core';

import { NodePermanentDeleteDirective } from './node-permanent-delete.directive';
import { MatDialogModule, MatDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { INITIAL_STATE } from '../../store/states/app.state';
import { appReducer } from '../../store/reducers/app.reducer';
import { Actions, ofType, EffectsModule } from '@ngrx/effects';
import {
    SNACKBAR_INFO, SnackbarWarningAction, SnackbarInfoAction,
    SnackbarErrorAction, SNACKBAR_ERROR, SNACKBAR_WARNING
} from '../../store/actions';
import { map } from 'rxjs/operators';
import { NodeEffects } from '../../store/effects/node.effects';
import { ContentManagementService } from '../services/content-management.service';

@Component({
    template: `<div [acaPermanentDelete]="selection"></div>`
})
class TestComponent {
    selection = [];
}

describe('NodePermanentDeleteDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let alfrescoApiService: AlfrescoApiService;
    let dialog: MatDialog;

    let actions$: Actions;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                CoreModule.forRoot(),
                MatDialogModule,
                StoreModule.forRoot({ app: appReducer }, { initialState: INITIAL_STATE }),
                EffectsModule.forRoot([NodeEffects])
            ],
            declarations: [
                NodePermanentDeleteDirective,
                TestComponent
            ],
            providers: [
                ContentManagementService
            ]
        })
        .compileComponents()
        .then(() => {
            alfrescoApiService = TestBed.get(AlfrescoApiService);
            alfrescoApiService.reset();

            actions$ = TestBed.get(Actions);

            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement.query(By.directive(NodePermanentDeleteDirective));

            dialog = TestBed.get(MatDialog);
        });
    }));

    beforeEach(() => {

        spyOn(dialog, 'open').and.returnValue({
            afterClosed() {
                return Observable.of(true);
            }
        });
    });

    it('does not purge nodes if no selection', () => {
        spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode');

        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(alfrescoApiService.nodesApi.purgeDeletedNode).not.toHaveBeenCalled();
    });

    it('call purge nodes if selection is not empty', fakeAsync(() => {
        spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode').and.returnValue(Promise.resolve());

        component.selection = [ { entry: { id: '1' } } ];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);
        tick();

        expect(alfrescoApiService.nodesApi.purgeDeletedNode).toHaveBeenCalled();
    }));

    describe('notification', () => {
        it('raises warning on multiple fail and one success', fakeAsync(done => {
            actions$.pipe(
                ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
                map((action: SnackbarWarningAction) => {
                    done();
                })
            );

            spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode').and.callFake((id) => {
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
        }));

        it('raises warning on multiple success and multiple fail', fakeAsync(done => {
            actions$.pipe(
                ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
                map((action: SnackbarWarningAction) => {
                    done();
                })
            );

            spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode').and.callFake((id) => {
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
        }));

        it('raises info on one selected node success', fakeAsync(done => {
            actions$.pipe(
                ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                map((action: SnackbarInfoAction) => {
                    done();
                })
            );

            spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        it('raises error on one selected node fail', fakeAsync(done => {
            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map((action: SnackbarErrorAction) => {
                    done();
                })
            );

            spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode').and.returnValue(Promise.reject({}));

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();
        }));

        it('raises info on all nodes success', fakeAsync(done => {
            actions$.pipe(
                ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                map((action: SnackbarInfoAction) => {
                    done();
                })
            );
            spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode').and.callFake((id) => {
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
        }));

        it('raises error on all nodes fail', fakeAsync(done => {
            actions$.pipe(
                ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                map((action: SnackbarErrorAction) => {
                    done();
                })
            );
            spyOn(alfrescoApiService.nodesApi, 'purgeDeletedNode').and.callFake((id) => {
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
        }));
    });
});
