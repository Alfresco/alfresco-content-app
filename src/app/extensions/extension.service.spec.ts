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
import { AppConfigService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/states';
import { ContentActionType } from './content-action.extension';

describe('ExtensionService', () => {
    let config: AppConfigService;
    let extensions: ExtensionService;
    let store: Store<AppStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppTestingModule]
        });

        extensions = TestBed.get(ExtensionService);
        store = TestBed.get(Store);

        config = TestBed.get(AppConfigService);
        config.config['extensions'] = {};
    });

    describe('auth guards', () => {
        let guard1;
        let guard2;

        beforeEach(() => {
            guard1 = {};
            guard2 = {};

            extensions.authGuards['guard1'] = guard1;
            extensions.authGuards['guard2'] = guard2;

            extensions.init();
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
            extensions.init();
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
            config.config.extensions = {
                core: {
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
                }
            };

            component1 = {};
            component2 = {};
            extensions.components['aca:components/about'] = component1;
            extensions.components['aca:layouts/main'] = component2;

            guard1 = {};
            extensions.authGuards['aca:auth'] = guard1;

            extensions.init();
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

    describe('actions', () => {
        beforeEach(() => {
            config.config.extensions = {
                core: {
                    actions: [
                        {
                            id: 'aca:actions/create-folder',
                            type: 'CREATE_FOLDER',
                            payload: 'folder-name'
                        }
                    ]
                }
            };
        });

        it('should load actions from the config', () => {
            extensions.init();
            expect(extensions.actions.length).toBe(1);
        });

        it('should have an empty action list if config provides nothing', () => {
            config.config.extensions = {};
            extensions.init();

            expect(extensions.actions).toEqual([]);
        });

        it('should find action by id', () => {
            extensions.init();

            const action = extensions.getActionById(
                'aca:actions/create-folder'
            );
            expect(action).toBeTruthy();
            expect(action.type).toBe('CREATE_FOLDER');
            expect(action.payload).toBe('folder-name');
        });

        it('should not find action by id', () => {
            extensions.init();

            const action = extensions.getActionById('missing');
            expect(action).toBeFalsy();
        });

        it('should run the action via store', () => {
            extensions.init();
            spyOn(store, 'dispatch').and.stub();

            extensions.runActionById('aca:actions/create-folder');
            expect(store.dispatch).toHaveBeenCalledWith({
                type: 'CREATE_FOLDER',
                payload: 'folder-name'
            });
        });

        it('should not use store if action is missing', () => {
            extensions.init();
            spyOn(store, 'dispatch').and.stub();

            extensions.runActionById('missing');
            expect(store.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('content actions', () => {
        it('should load content actions from the config', () => {
            config.config.extensions = {
                core: {
                    features: {
                        content: {
                            actions: [
                                {
                                    id: 'aca:toolbar/separator-1',
                                    order: 1,
                                    type: 'separator'
                                },
                                {
                                    id: 'aca:toolbar/separator-2',
                                    order: 2,
                                    type: 'separator'
                                }
                            ]
                        }
                    }
                }
            };

            extensions.init();
            expect(extensions.contentActions.length).toBe(2);
        });

        it('should have an empty content action list if config is empty', () => {
            config.config.extensions = {};
            extensions.init();
            expect(extensions.contentActions).toEqual([]);
        });

        it('should sort content actions by order', () => {
            config.config.extensions = {
                core: {
                    features: {
                        content: {
                            actions: [
                                {
                                    id: 'aca:toolbar/separator-2',
                                    order: 2,
                                    type: 'separator'
                                },
                                {
                                    id: 'aca:toolbar/separator-1',
                                    order: 1,
                                    type: 'separator'
                                }
                            ]
                        }
                    }
                }
            };

            extensions.init();
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
            config.config.extensions = {
                core: {
                    features: {
                        viewer: {
                            'open-with': [
                                {
                                    disabled: false,
                                    id: 'aca:viewer/action1',
                                    order: 100,
                                    icon: 'build',
                                    title: 'Snackbar',
                                    action: 'aca:actions/info'
                                }
                            ]
                        }
                    }
                }
            };

            extensions.init();
            expect(extensions.openWithActions.length).toBe(1);
        });

        it('should have an empty [open with] list if config is empty', () => {
            config.config.extensions = {};
            extensions.init();
            expect(extensions.openWithActions).toEqual([]);
        });

        it('should load only enabled [open with] actions for the viewer', () => {
            config.config.extensions = {
                core: {
                    features: {
                        viewer: {
                            'open-with': [
                                {
                                    id: 'aca:viewer/action2',
                                    order: 200,
                                    icon: 'build',
                                    title: 'Snackbar',
                                    action: 'aca:actions/info'
                                },
                                {
                                    disabled: true,
                                    id: 'aca:viewer/action1',
                                    order: 100,
                                    icon: 'build',
                                    title: 'Snackbar',
                                    action: 'aca:actions/info'
                                }
                            ]
                        }
                    }
                }
            };

            extensions.init();
            expect(extensions.openWithActions.length).toBe(1);
            expect(extensions.openWithActions[0].id).toBe('aca:viewer/action2');
        });

        it('should sort [open with] actions by order', () => {
            config.config.extensions = {
                core: {
                    features: {
                        viewer: {
                            'open-with': [
                                {
                                    id: 'aca:viewer/action2',
                                    order: 200,
                                    icon: 'build',
                                    title: 'Snackbar',
                                    action: 'aca:actions/info'
                                },
                                {
                                    id: 'aca:viewer/action1',
                                    order: 100,
                                    icon: 'build',
                                    title: 'Snackbar',
                                    action: 'aca:actions/info'
                                }
                            ]
                        }
                    }
                }
            };

            extensions.init();
            expect(extensions.openWithActions.length).toBe(2);
            expect(extensions.openWithActions[0].id).toBe('aca:viewer/action1');
            expect(extensions.openWithActions[1].id).toBe('aca:viewer/action2');
        });
    });

    describe('create', () => {
        it('should load [create] actions from config', () => {
            config.config.extensions = {
                core: {
                    features: {
                        create: [
                            {
                                disabled: false,
                                id: 'aca:create/folder',
                                order: 100,
                                icon: 'create_new_folder',
                                title: 'ext: Create Folder',
                                target: {
                                    permissions: ['create'],
                                    action: 'aca:actions/create-folder'
                                }
                            }
                        ]
                    }
                }
            };

            extensions.init();
            expect(extensions.createActions.length).toBe(1);
        });

        it('should have an empty [create] actions if config is empty', () => {
            config.config.extensions = {};
            extensions.init();
            expect(extensions.createActions).toEqual([]);
        });

        it('should sort [create] actions by order', () => {
            config.config.extensions = {
                core: {
                    features: {
                        create: [
                            {
                                id: 'aca:create/folder',
                                order: 100,
                                icon: 'create_new_folder',
                                title: 'ext: Create Folder',
                                target: {
                                    permissions: ['create'],
                                    action: 'aca:actions/create-folder'
                                }
                            },
                            {
                                id: 'aca:create/folder-2',
                                order: 10,
                                icon: 'create_new_folder',
                                title: 'ext: Create Folder',
                                target: {
                                    permissions: ['create'],
                                    action: 'aca:actions/create-folder'
                                }
                            }
                        ]
                    }
                }
            };

            extensions.init();
            expect(extensions.createActions.length).toBe(2);
            expect(extensions.createActions[0].id).toBe('aca:create/folder-2');
            expect(extensions.createActions[1].id).toBe('aca:create/folder');
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

    describe('permissions', () => {
        it('should approve node permission', () => {
            const node: any = {
                allowableOperations: ['create']
            };

            expect(extensions.nodeHasPermission(node, 'create')).toBeTruthy();
        });

        it('should not approve node permission', () => {
            const node: any = {
                allowableOperations: ['create']
            };

            expect(extensions.nodeHasPermission(node, 'update')).toBeFalsy();
        });

        it('should not approve node permission when node missing property', () => {
            const node: any = {
                allowableOperations: null
            };

            expect(extensions.nodeHasPermission(node, 'update')).toBeFalsy();
        });

        it('should require node to check permission', () => {
            expect(extensions.nodeHasPermission(null, 'create')).toBeFalsy();
        });

        it('should require permission value to check', () => {
            const node: any = {
                allowableOperations: ['create']
            };
            expect(extensions.nodeHasPermission(node, null)).toBeFalsy();
        });

        it('should approve multiple permissions', () => {
            const node: any = {
                allowableOperations: ['create', 'update', 'delete']
            };
            expect(
                extensions.nodeHasPermissions(node, ['create', 'delete'])
            ).toBeTruthy();
        });

        it('should require node to check multiple permissions', () => {
            expect(extensions.nodeHasPermissions(null, ['create'])).toBeFalsy();
        });

        it('should require multiple permissions to check', () => {
            const node: any = {
                allowableOperations: ['create', 'update', 'delete']
            };
            expect(extensions.nodeHasPermissions(node, null)).toBeFalsy();
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
