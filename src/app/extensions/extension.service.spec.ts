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

import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../testing/app-testing.module';
import { ExtensionService } from './extension.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/states';
import { ContentActionType } from './action.extensions';

describe('ExtensionService', () => {
    let extensions: ExtensionService;
    let store: Store<AppStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppTestingModule]
        });

        store = TestBed.get(Store);
        extensions = TestBed.get(ExtensionService);
    });

    describe('configs', () => {
        it('should merge two arrays based on [id] keys', () => {
            const left = [
                {
                    name: 'item0'
                },
                {
                    id: '#1',
                    name: 'item1'
                },
                {
                    id: '#2',
                    name: 'item2'
                }
            ];

            const right = [
                {
                    name: 'extra-1'
                },
                {
                    id: '#2',
                    name: 'custom2',
                    tag: 'extra tag'
                }
            ];

            const result = extensions.mergeArrays(left, right);
            expect(result).toEqual([
                {
                    id: '#1',
                    name: 'item1'
                },
                {
                    id: '#2',
                    name: 'custom2',
                    tag: 'extra tag'
                },
                {
                    name: 'item0'
                },
                {
                    name: 'extra-1'
                },
            ]);
        });
    });

    describe('actions', () => {
        beforeEach(() => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                actions: [
                    {
                        id: 'aca:actions/create-folder',
                        type: 'CREATE_FOLDER',
                        payload: 'folder-name'
                    }
                ]
            });
        });

        it('should load actions from the config', () => {
            expect(extensions.actions.length).toBe(1);
        });

        it('should find action by id', () => {
            const action = extensions.getActionById(
                'aca:actions/create-folder'
            );
            expect(action).toBeTruthy();
            expect(action.type).toBe('CREATE_FOLDER');
            expect(action.payload).toBe('folder-name');
        });

        it('should not find action by id', () => {
            const action = extensions.getActionById('missing');
            expect(action).toBeFalsy();
        });

        it('should run the action via store', () => {
            spyOn(store, 'dispatch').and.stub();

            extensions.runActionById('aca:actions/create-folder');
            expect(store.dispatch).toHaveBeenCalledWith({
                type: 'CREATE_FOLDER',
                payload: 'folder-name'
            });
        });

        it('should still invoke store if action is missing', () => {
            spyOn(store, 'dispatch').and.stub();

            extensions.runActionById('missing');
            expect(store.dispatch).toHaveBeenCalled();
        });
    });

    describe('expressions', () => {
        it('should eval static value', () => {
            const value = extensions.runExpression('hello world');
            expect(value).toBe('hello world');
        });

        it('should eval string as an expression', () => {
            const value = extensions.runExpression('$( "hello world" )');
            expect(value).toBe('hello world');
        });

        it('should eval expression with no context', () => {
            const value = extensions.runExpression('$( 1 + 1 )');
            expect(value).toBe(2);
        });

        it('should eval expression with context', () => {
            const context = {
                a: 'hey',
                b: 'there'
            };
            const expression = '$( context.a + " " + context.b + "!" )';
            const value = extensions.runExpression(expression, context);
            expect(value).toBe('hey there!');
        });
    });

    describe('auth guards', () => {
        let guard1;
        let guard2;

        beforeEach(() => {
            guard1 = {};
            guard2 = {};

            extensions.authGuards['guard1'] = guard1;
            extensions.authGuards['guard2'] = guard2;
        });

        it('should fetch auth guards by ids', () => {
            const guards = extensions.getAuthGuards(['guard2', 'guard1']);

            expect(guards.length).toBe(2);
            expect(guards[0]).toEqual(guard1);
            expect(guards[1]).toEqual(guard2);
        });

        it('should not fetch auth guards for missing ids', () => {
            const guards = extensions.getAuthGuards(null);
            expect(guards).toEqual([]);
        });

        it('should fetch only known guards', () => {
            const guards = extensions.getAuthGuards(['missing', 'guard1']);

            expect(guards.length).toBe(1);
            expect(guards[0]).toEqual(guard1);
        });
    });

    describe('components', () => {
        let component1;

        beforeEach(() => {
            component1 = {};

            extensions.components['component-1'] = component1;
        });

        it('should fetch registered component', () => {
            const component = extensions.getComponentById('component-1');
            expect(component).toEqual(component1);
        });

        it('should not fetch registered component', () => {
            const component = extensions.getComponentById('missing');
            expect(component).toBeFalsy();
        });
    });

    describe('routes', () => {
        let component1, component2;
        let guard1;

        beforeEach(() => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                routes: [
                    {
                        id: 'aca:routes/about',
                        path: 'ext/about',
                        component: 'aca:components/about',
                        layout: 'aca:layouts/main',
                        auth: ['aca:auth'],
                        data: {
                            title: 'Custom About'
                        }
                    }
                ]
            });

            component1 = {};
            component2 = {};
            extensions.components['aca:components/about'] = component1;
            extensions.components['aca:layouts/main'] = component2;

            guard1 = {};
            extensions.authGuards['aca:auth'] = guard1;
        });

        it('should load routes from the config', () => {
            expect(extensions.routes.length).toBe(1);
        });

        it('should find a route by id', () => {
            const route = extensions.getRouteById('aca:routes/about');
            expect(route).toBeTruthy();
            expect(route.path).toBe('ext/about');
        });

        it('should not find a route by id', () => {
            const route = extensions.getRouteById('some-route');
            expect(route).toBeFalsy();
        });

        it('should build application routes', () => {
            const routes = extensions.getApplicationRoutes();

            expect(routes.length).toBe(1);

            const route = routes[0];
            expect(route.path).toBe('ext/about');
            expect(route.component).toEqual(component2);
            expect(route.canActivateChild).toEqual([guard1]);
            expect(route.canActivate).toEqual([guard1]);
            expect(route.children.length).toBe(1);
            expect(route.children[0].path).toBe('');
            expect(route.children[0].component).toEqual(component1);
        });
    });

    describe('content actions', () => {
        it('should load content actions from the config', () => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                features: {
                    content: {
                        actions: [
                            {
                                id: 'aca:toolbar/separator-1',
                                order: 1,
                                type: ContentActionType.separator,
                                title: 'action1',
                            },
                            {
                                id: 'aca:toolbar/separator-2',
                                order: 2,
                                type: ContentActionType.separator,
                                title: 'action2'
                            }
                        ]
                    }
                }
            });

            expect(extensions.contentActions.length).toBe(2);
        });

        it('should sort content actions by order', () => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                features: {
                    content: {
                        actions: [
                            {
                                id: 'aca:toolbar/separator-2',
                                order: 2,
                                type: ContentActionType.separator,
                                title: 'action2'
                            },
                            {
                                id: 'aca:toolbar/separator-1',
                                order: 1,
                                type: ContentActionType.separator,
                                title: 'action1'
                            }
                        ]
                    }
                }
            });

            expect(extensions.contentActions.length).toBe(2);
            expect(extensions.contentActions[0].id).toBe(
                'aca:toolbar/separator-1'
            );
            expect(extensions.contentActions[1].id).toBe(
                'aca:toolbar/separator-2'
            );
        });
    });

    describe('open with', () => {
        it('should load [open with] actions for the viewer', () => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                features: {
                    viewer: {
                        openWith: [
                            {
                                disabled: false,
                                id: 'aca:viewer/action1',
                                order: 100,
                                icon: 'build',
                                title: 'Snackbar',
                                type: ContentActionType.default,
                                actions: {
                                    click: 'aca:actions/info'
                                }
                            }
                        ]
                    }
                }
            });

            expect(extensions.openWithActions.length).toBe(1);
        });

        it('should load only enabled [open with] actions for the viewer', () => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                features: {
                    viewer: {
                        openWith: [
                            {
                                id: 'aca:viewer/action2',
                                order: 200,
                                icon: 'build',
                                title: 'Snackbar',
                                type: ContentActionType.default,
                                actions: {
                                    click: 'aca:actions/info'
                                }
                            },
                            {
                                disabled: true,
                                id: 'aca:viewer/action1',
                                order: 100,
                                icon: 'build',
                                title: 'Snackbar',
                                type: ContentActionType.default,
                                actions: {
                                    click: 'aca:actions/info'
                                }
                            }
                        ]
                    }
                }
            });

            expect(extensions.openWithActions.length).toBe(1);
            expect(extensions.openWithActions[0].id).toBe('aca:viewer/action2');
        });

        it('should sort [open with] actions by order', () => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                features: {
                    viewer: {
                        openWith: [
                            {
                                id: 'aca:viewer/action2',
                                order: 200,
                                icon: 'build',
                                title: 'Snackbar',
                                type: ContentActionType.default,
                                actions: {
                                    click: 'aca:actions/info'
                                }
                            },
                            {
                                id: 'aca:viewer/action1',
                                order: 100,
                                icon: 'build',
                                title: 'Snackbar',
                                type: ContentActionType.default,
                                actions: {
                                    click: 'aca:actions/info'
                                }
                            }
                        ]
                    }
                }
            });

            expect(extensions.openWithActions.length).toBe(2);
            expect(extensions.openWithActions[0].id).toBe('aca:viewer/action1');
            expect(extensions.openWithActions[1].id).toBe('aca:viewer/action2');
        });
    });

    describe('create', () => {
        it('should load [create] actions from config', () => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                features: {
                    create: [
                        {
                            id: 'aca:create/folder',
                            order: 100,
                            icon: 'create_new_folder',
                            title: 'ext: Create Folder',
                            type: ContentActionType.default
                        }
                    ]
                }
            });

            expect(extensions.createActions.length).toBe(1);
        });

        it('should sort [create] actions by order', () => {
            extensions.setup({
                $name: 'test',
                $version: '1.0.0',
                features: {
                    create: [
                        {
                            id: 'aca:create/folder',
                            order: 100,
                            icon: 'create_new_folder',
                            title: 'ext: Create Folder',
                            type: ContentActionType.default
                        },
                        {
                            id: 'aca:create/folder-2',
                            order: 10,
                            icon: 'create_new_folder',
                            title: 'ext: Create Folder',
                            type: ContentActionType.default
                        }
                    ]
                }
            });

            expect(extensions.createActions.length).toBe(2);
            expect(extensions.createActions[0].id).toBe('aca:create/folder-2');
            expect(extensions.createActions[1].id).toBe('aca:create/folder');
        });
    });

    describe('sorting', () => {
        it('should sort by provided order', () => {
            const sorted = [
                { id: '1', order: 10 },
                { id: '2', order: 1 },
                { id: '3', order: 5 }
            ].sort(extensions.sortByOrder);

            expect(sorted[0].id).toBe('2');
            expect(sorted[1].id).toBe('3');
            expect(sorted[2].id).toBe('1');
        });

        it('should use implicit order', () => {
            const sorted = [
                { id: '3'},
                { id: '2' },
                { id: '1', order: 1 }
            ].sort(extensions.sortByOrder);

            expect(sorted[0].id).toBe('1');
            expect(sorted[1].id).toBe('3');
            expect(sorted[2].id).toBe('2');
        });
    });

    describe('filtering', () => {
        it('should filter out disabled items', () => {
            const items = [
                { id: 1, disabled: true },
                { id: 2 },
                { id: 3, disabled: true }
            ].filter(extensions.filterEnabled);

            expect(items.length).toBe(1);
            expect(items[0].id).toBe(2);
        });
    });

    it('should reduce duplicate separators', () => {
        const actions = [
            { id: '1', type: ContentActionType.button },
            { id: '2', type: ContentActionType.separator },
            { id: '3', type: ContentActionType.separator },
            { id: '4', type: ContentActionType.separator },
            { id: '5', type: ContentActionType.button }
        ];

        const result = actions.reduce(extensions.reduceSeparators, []);
        expect(result.length).toBe(3);
        expect(result[0].id).toBe('1');
        expect(result[1].id).toBe('2');
        expect(result[2].id).toBe('5');
    });

    it('should trim trailing separators', () => {
        const actions = [
            { id: '1', type: ContentActionType.button },
            { id: '2', type: ContentActionType.separator }
        ];

        const result = actions.reduce(extensions.reduceSeparators, []);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('1');
    });

    it('should reduce empty menus', () => {
        const actions = [
            <any>{ id: '1', type: ContentActionType.button },
            {
                id: '2',
                type: ContentActionType.menu
            },
            {
                id: '3',
                type: ContentActionType.menu,
                children: [{ id: '3-1', type: ContentActionType.button }]
            }
        ];

        const result = actions.reduce(extensions.reduceEmptyMenus, []);

        expect(result.length).toBe(2);
        expect(result[0].id).toBe('1');
        expect(result[1].id).toBe('3');
    });
});
