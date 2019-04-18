/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { AppExtensionService } from './extension.service';
import { Store } from '@ngrx/store';
import { AppStore } from '@alfresco/aca-shared/store';
import {
  ContentActionType,
  mergeArrays,
  sortByOrder,
  filterEnabled,
  reduceSeparators,
  reduceEmptyMenus,
  ExtensionService,
  ExtensionConfig,
  ComponentRegisterService
} from '@alfresco/adf-extensions';

describe('AppExtensionService', () => {
  let service: AppExtensionService;
  let store: Store<AppStore>;
  let extensions: ExtensionService;
  let components: ComponentRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    });

    store = TestBed.get(Store);
    service = TestBed.get(AppExtensionService);
    extensions = TestBed.get(ExtensionService);
    components = TestBed.get(ComponentRegisterService);
  });

  const applyConfig = (config: ExtensionConfig) => {
    extensions.setup(config);
    service.setup(config);
  };

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

      const result = mergeArrays(left, right);
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
        }
      ]);
    });
  });

  describe('actions', () => {
    beforeEach(() => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
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
      const action = extensions.getActionById('aca:actions/create-folder');
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

      service.runActionById('aca:actions/create-folder');
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'CREATE_FOLDER',
        payload: 'folder-name'
      });
    });

    it('should still invoke store if action is missing', () => {
      spyOn(store, 'dispatch').and.stub();

      service.runActionById('missing');
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

      components.setComponents({
        'component-1': component1
      });
    });

    it('should fetch registered component', () => {
      const component = service.getComponentById('component-1');
      expect(component).toEqual(component1);
    });

    it('should not fetch registered component', () => {
      const component = service.getComponentById('missing');
      expect(component).toBeFalsy();
    });
  });

  describe('routes', () => {
    let component1, component2;
    let guard1;

    beforeEach(() => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
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

      components.setComponents({
        'aca:components/about': component1,
        'aca:layouts/main': component2
      });

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
      const routes = service.getApplicationRoutes();

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
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
        features: {
          toolbar: [
            {
              id: 'aca:toolbar/separator-1',
              order: 1,
              type: ContentActionType.separator,
              title: 'action1'
            },
            {
              id: 'aca:toolbar/separator-2',
              order: 2,
              type: ContentActionType.separator,
              title: 'action2'
            }
          ]
        }
      });

      expect(service.toolbarActions.length).toBe(2);
    });

    it('should sort content actions by order', () => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
        features: {
          toolbar: [
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
      });

      expect(service.toolbarActions.length).toBe(2);
      expect(service.toolbarActions[0].id).toBe('aca:toolbar/separator-1');
      expect(service.toolbarActions[1].id).toBe('aca:toolbar/separator-2');
    });
  });

  describe('open with', () => {
    it('should load [open with] actions for the viewer', () => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
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

      expect(service.openWithActions.length).toBe(1);
    });

    it('should load only enabled [open with] actions for the viewer', () => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
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

      expect(service.openWithActions.length).toBe(1);
      expect(service.openWithActions[0].id).toBe('aca:viewer/action2');
    });

    it('should sort [open with] actions by order', () => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
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

      expect(service.openWithActions.length).toBe(2);
      expect(service.openWithActions[0].id).toBe('aca:viewer/action1');
      expect(service.openWithActions[1].id).toBe('aca:viewer/action2');
    });
  });

  describe('create', () => {
    it('should load [create] actions from config', () => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
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

      expect(service.createActions.length).toBe(1);
    });

    it('should sort [create] actions by order', () => {
      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
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

      expect(service.createActions.length).toBe(2);
      expect(service.createActions[0].id).toBe('aca:create/folder-2');
      expect(service.createActions[1].id).toBe('aca:create/folder');
    });
  });

  describe('sorting', () => {
    it('should sort by provided order', () => {
      const sorted = [
        { id: '1', order: 10 },
        { id: '2', order: 1 },
        { id: '3', order: 5 }
      ].sort(sortByOrder);

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    it('should use implicit order', () => {
      const sorted = [{ id: '3' }, { id: '2' }, { id: '1', order: 1 }].sort(
        sortByOrder
      );

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
      ].filter(filterEnabled);

      expect(items.length).toBe(1);
      expect(items[0].id).toBe(2);
    });

    it('should filter out all disabled items', () => {
      const items: any[] = [
        { id: '1', disabled: true },
        {
          id: '2',
          someItems: [
            { id: '21', disabled: true },
            { id: '22', disabled: false },
            { id: '23' }
          ],
          someObjectProp: {
            innerItems: [{ id: '24' }, { id: '25', disabled: true }]
          }
        },
        { id: 3, disabled: true }
      ];

      const result = service.filterDisabled(items);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('2');
      expect(result[0].someItems.length).toBe(2);
      expect(result[0].someItems[0].id).toBe('22');
      expect(result[0].someItems[1].id).toBe('23');
      expect(result[0].someObjectProp).not.toBeNull();
      expect(result[0].someObjectProp.innerItems.length).toBe(1);
      expect(result[0].someObjectProp.innerItems[0].id).toBe('24');
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

    const result = actions.reduce(reduceSeparators, []);
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

    const result = actions.reduce(reduceSeparators, []);
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

    const result = actions.reduce(reduceEmptyMenus, []);

    expect(result.length).toBe(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
  });

  describe('getApplicationNavigation', () => {
    it('should create navigation data', () => {
      const navigation = service.getApplicationNavigation([
        { items: [{ route: 'route1' }, { route: 'route2' }] },
        { items: [{ children: [{ route: 'route3' }] }] }
      ]);

      expect(navigation).toEqual([
        {
          items: [
            { route: 'route1', url: '/route1' },
            { route: 'route2', url: '/route2' }
          ]
        },
        {
          items: [{ children: [{ route: 'route3', url: '/route3' }] }]
        }
      ]);
    });

    it('should filter out disabled items', () => {
      const navigation = service.getApplicationNavigation([
        { items: [{ route: 'route1' }, { route: 'route2', disabled: true }] },
        { items: [{ children: [{ route: 'route3', disabled: true }] }] }
      ]);

      expect(navigation).toEqual([
        { items: [{ route: 'route1', url: '/route1' }] },
        { items: [{ children: [] }] }
      ]);
    });
  });

  describe('getSharedLinkViewerToolbarActions', () => {
    it('should get shared link viewer actions', () => {
      const actions = [
        {
          id: 'id',
          type: ContentActionType.button,
          icon: 'icon',
          actions: {
            click: 'click'
          }
        }
      ];

      applyConfig({
        $id: 'test',
        $name: 'test',
        $version: '1.0.0',
        $license: 'MIT',
        $vendor: 'Good company',
        $runtime: '1.5.0',
        features: {
          viewer: {
            shared: {
              toolbarActions: actions
            }
          }
        }
      });

      expect(service.getSharedLinkViewerToolbarActions()).toEqual(<any>actions);
    });
  });
});
