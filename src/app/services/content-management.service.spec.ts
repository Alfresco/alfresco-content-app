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


import { TestBed, fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import { Actions, ofType, EffectsModule } from '@ngrx/effects';
import {
    SNACKBAR_INFO, SnackbarWarningAction, SnackbarInfoAction,
    SnackbarErrorAction, SNACKBAR_ERROR, SNACKBAR_WARNING, PurgeDeletedNodesAction,
    RestoreDeletedNodesAction, NavigateRouteAction, NAVIGATE_ROUTE
} from '../store/actions';
import { map } from 'rxjs/operators';
import { NodeEffects } from '../store/effects/node.effects';
import { AppTestingModule } from '../testing/app-testing.module';
import { ContentApiService } from '../services/content-api.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/states';
import { ContentManagementService } from './content-management.service';

describe('ContentManagementService', () => {

    let dialog: MatDialog;
    let actions$: Actions;
    let contentApi: ContentApiService;
    let store: Store<AppStore>;
    let contentManagementService: ContentManagementService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTestingModule,
                EffectsModule.forRoot([NodeEffects])
            ]
        });

        contentApi = TestBed.get(ContentApiService);
        actions$ = TestBed.get(Actions);
        store = TestBed.get(Store);
        contentManagementService = TestBed.get(ContentManagementService);

        dialog = TestBed.get(MatDialog);
        spyOn(dialog, 'open').and.returnValue({
            afterClosed() {
                return Observable.of(true);
            }
        });
    });


    describe('Permanent Delete', () => {
        it('does not purge nodes if no selection', () => {
            spyOn(contentApi, 'purgeDeletedNode');

            store.dispatch(new PurgeDeletedNodesAction([]));
            expect(contentApi.purgeDeletedNode).not.toHaveBeenCalled();
        });

        it('call purge nodes if selection is not empty', fakeAsync(() => {
            spyOn(contentApi, 'purgeDeletedNode').and.returnValue(Observable.of({}));

            const selection = [ { entry: { id: '1' } } ];
            store.dispatch(new PurgeDeletedNodesAction(selection));

            expect(contentApi.purgeDeletedNode).toHaveBeenCalled();
        }));

        describe('notification', () => {
            it('raises warning on multiple fail and one success', fakeAsync(done => {
                actions$.pipe(
                    ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
                    map((action: SnackbarWarningAction) => {
                        done();
                    })
                );

                spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
                    if (id === '1') {
                        return Observable.of({});
                    }

                    if (id === '2') {
                        return Observable.throw({});
                    }

                    if (id === '3') {
                        return Observable.throw({});
                    }
                });

                const selection = [
                    { entry: { id: '1', name: 'name1' } },
                    { entry: { id: '2', name: 'name2' } },
                    { entry: { id: '3', name: 'name3' } }
                ];

                store.dispatch(new PurgeDeletedNodesAction(selection));
            }));

            it('raises warning on multiple success and multiple fail', fakeAsync(done => {
                actions$.pipe(
                    ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
                    map((action: SnackbarWarningAction) => {
                        done();
                    })
                );

                spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
                    if (id === '1') {
                        return Observable.of({});
                    }

                    if (id === '2') {
                        return Observable.throw({});
                    }

                    if (id === '3') {
                        return Observable.throw({});
                    }

                    if (id === '4') {
                        return Observable.of({});
                    }
                });

                const selection = [
                    { entry: { id: '1', name: 'name1' } },
                    { entry: { id: '2', name: 'name2' } },
                    { entry: { id: '3', name: 'name3' } },
                    { entry: { id: '4', name: 'name4' } }
                ];

                store.dispatch(new PurgeDeletedNodesAction(selection));
            }));

            it('raises info on one selected node success', fakeAsync(done => {
                actions$.pipe(
                    ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                    map((action: SnackbarInfoAction) => {
                        done();
                    })
                );

                spyOn(contentApi, 'purgeDeletedNode').and.returnValue(Observable.of({}));

                const selection = [
                    { entry: { id: '1', name: 'name1' } }
                ];

                store.dispatch(new PurgeDeletedNodesAction(selection));
            }));

            it('raises error on one selected node fail', fakeAsync(done => {
                actions$.pipe(
                    ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                    map((action: SnackbarErrorAction) => {
                        done();
                    })
                );

                spyOn(contentApi, 'purgeDeletedNode').and.returnValue(Observable.throw({}));

                const selection = [
                    { entry: { id: '1', name: 'name1' } }
                ];

                store.dispatch(new PurgeDeletedNodesAction(selection));
            }));

            it('raises info on all nodes success', fakeAsync(done => {
                actions$.pipe(
                    ofType<SnackbarInfoAction>(SNACKBAR_INFO),
                    map((action: SnackbarInfoAction) => {
                        done();
                    })
                );
                spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
                    if (id === '1') {
                        return Observable.of({});
                    }

                    if (id === '2') {
                        return Observable.of({});
                    }
                });

                const selection = [
                    { entry: { id: '1', name: 'name1' } },
                    { entry: { id: '2', name: 'name2' } }
                ];

                store.dispatch(new PurgeDeletedNodesAction(selection));
            }));

            it('raises error on all nodes fail', fakeAsync(done => {
                actions$.pipe(
                    ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
                    map((action: SnackbarErrorAction) => {
                        done();
                    })
                );
                spyOn(contentApi, 'purgeDeletedNode').and.callFake((id) => {
                    if (id === '1') {
                        return Observable.throw({});
                    }

                    if (id === '2') {
                        return Observable.throw({});
                    }
                });

                const selection = [
                    { entry: { id: '1', name: 'name1' } },
                    { entry: { id: '2', name: 'name2' } }
                ];

                store.dispatch(new PurgeDeletedNodesAction(selection));
            }));
        });
    });

    describe('Restore Deleted', () => {
        it('does not restore nodes if no selection', () => {
            spyOn(contentApi, 'restoreNode');

            const selection = [];
            store.dispatch(new RestoreDeletedNodesAction(selection));

            expect(contentApi.restoreNode).not.toHaveBeenCalled();
        });

        it('does not restore nodes if selection has nodes without path', () => {
            spyOn(contentApi, 'restoreNode');

            const selection = [ { entry: { id: '1' } } ];

            store.dispatch(new RestoreDeletedNodesAction(selection));

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

            const selection = [
                {
                    entry: {
                        id: '1',
                        path
                    }
                }
            ];

            store.dispatch(new RestoreDeletedNodesAction(selection));

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

                const selection = [
                    {
                        entry: {
                            id: '1',
                            path
                        }
                    }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));

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

                const selection = [
                    { entry: { id: '1', name: 'name1', path } },
                    { entry: { id: '2', name: 'name2', path } },
                    { entry: { id: '3', name: 'name3', path } }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));
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

                const selection = [
                    { entry: { id: '1', name: 'name1', path } }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));
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

                const selection = [
                    { entry: { id: '1', name: 'name1', path } }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));
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

                const selection = [
                    { entry: { id: '1', name: 'name1', path } }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));
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

                const selection = [
                    { entry: { id: '1', name: 'name1', path } },
                    { entry: { id: '2', name: 'name2', path } }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));
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

                const selection = [
                    { entry: { id: '1', name: 'name1', path } }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));
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

                const selection = [
                    {
                        entry: {
                             id: '1',
                             name: 'name1',
                             path
                        }
                    }
                ];

                store.dispatch(new RestoreDeletedNodesAction(selection));
            }));
        });
    });

});
