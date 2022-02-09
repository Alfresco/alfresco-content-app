/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import { initialState, LibTestingModule } from '../testing/lib-testing-module';
import { RouterExtensionService } from './router.extension.service';
import { ExtensionService } from '@alfresco/adf-extensions';
import { Router } from '@angular/router';
import { Type } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';

describe('RouterExtensionService', () => {
  let extensionService: ExtensionService;
  let service: RouterExtensionService;
  let router: Router;
  let component1;
  let component2;
  let component3;
  let layoutComponent;
  let guard1;
  let guard2;
  let guard3;

  beforeEach(() => {
    component1 = { name: 'component-1' };
    component2 = { name: 'component-2' };
    component3 = { name: 'component-3' };
    layoutComponent = { name: 'layoutComponent' };
    guard1 = { name: 'guard1' };
    guard2 = { name: 'guard2' };
    guard3 = { name: 'guard3' };

    TestBed.configureTestingModule({
      imports: [LibTestingModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ExtensionService,
          useValue: {
            routes: [],
            getAuthGuards: (authKeys) => {
              const authMapping = {
                'app.auth': guard1,
                'ext.auth1': guard2,
                'ext.auth2': guard3
              };

              return authKeys.map((authKey) => authMapping[authKey]);
            },
            getComponentById: (componentKey) => {
              const componentMapping = {
                'ext:components/about': component1,
                'ext:components/settings': component2,
                'ext:components/info': component3,
                'app.layout.main': layoutComponent
              };

              return componentMapping[componentKey];
            }
          }
        }
      ]
    });

    extensionService = TestBed.inject(ExtensionService);
    service = TestBed.inject(RouterExtensionService);
    router = TestBed.inject(Router);
    router.config = [
      { path: 'login', component: {} as Type<any> },
      { path: 'settings', component: {} as Type<any> },
      { path: 'custom', children: [] },
      {
        path: '',
        children: [
          { path: 'child-route1', component: {} as Type<any> },
          { path: 'child-route2', component: {} as Type<any> }
        ]
      }
    ];
  });

  describe('getApplicationRoutes', () => {
    const getDummyRoute = (overrides) => ({
      id: 'aca:routes/about',
      path: 'ext/about',
      component: 'ext:components/about',
      layout: 'aca:layouts/main',
      auth: ['aca:auth'],
      data: { title: 'Custom About' },
      ...overrides
    });
    it('should calculate path properly', () => {
      extensionService.routes = [getDummyRoute({ path: 'aca:routes/about' })];

      expect(service.getApplicationRoutes().length).toBe(1);
      expect(service.getApplicationRoutes()[0].path).toBe('aca:routes/about');
    });

    it('should calculate parentRoute properly', () => {
      extensionService.routes = [getDummyRoute({ parentRoute: 'parent-1' })];

      expect(service.getApplicationRoutes()[0].parentRoute).toBe('parent-1');
    });

    it('should calculate the "component" to default layout, if no "layout" defined for the route', () => {
      extensionService.routes = [getDummyRoute({ layout: undefined })];

      expect(service.getApplicationRoutes()[0].component).toBe(layoutComponent);
    });

    it('should calculate the "component" to the registered component matching the "layout" value of the route', () => {
      extensionService.routes = [getDummyRoute({ layout: 'ext:components/about' })];

      expect(service.getApplicationRoutes()[0].component).toBe(component1);
    });

    it('should calculate the "canActivateChild" and "canActivate" to default auth guard, if no "auth" defined for the route', () => {
      extensionService.routes = [getDummyRoute({ auth: undefined })];

      expect(service.getApplicationRoutes()[0].canActivateChild).toEqual([guard1]);
      expect(service.getApplicationRoutes()[0].canActivate).toEqual([guard1]);
    });

    it('should calculate the "canActivateChild" and "canActivate" to default auth guard, if "auth" is defined as [] for the route', () => {
      extensionService.routes = [getDummyRoute({ auth: [] })];

      expect(service.getApplicationRoutes()[0].canActivateChild).toEqual([guard1]);
      expect(service.getApplicationRoutes()[0].canActivate).toEqual([guard1]);
    });

    it('should calculate the "canActivateChild" and "canActivate" to the registered guard(s) matching the "auth" value of the route', () => {
      extensionService.routes = [getDummyRoute({ auth: ['ext.auth1', 'ext.auth2'] })];

      expect(service.getApplicationRoutes()[0].canActivateChild).toEqual([guard2, guard3]);
      expect(service.getApplicationRoutes()[0].canActivate).toEqual([guard2, guard3]);
    });

    it('should calculate the main path and data of "children" with the component and data of the route', () => {
      const routeData = {};
      extensionService.routes = [getDummyRoute({ component: 'ext:components/about', data: routeData })];

      expect(service.getApplicationRoutes()[0].children[0].path).toBe('');
      expect(service.getApplicationRoutes()[0].children[0].component).toBe(component1);
      expect(service.getApplicationRoutes()[0].children[0].data).toBe(routeData);
    });

    it('should calculate the "children"-s with the "children" value of the route', () => {
      extensionService.routes = [
        getDummyRoute({
          component: 'ext:components/about',
          children: [
            {
              path: 'child-path1',
              outlet: 'outlet1',
              component: 'ext:components/settings'
            },
            {
              path: 'child-path2',
              component: 'ext:components/info'
            }
          ]
        })
      ];

      expect(service.getApplicationRoutes()[0].children[0].path).toBe('child-path1');
      expect(service.getApplicationRoutes()[0].children[0].component).toBe(component2);
      expect(service.getApplicationRoutes()[0].children[0].outlet).toBe('outlet1');
      expect(service.getApplicationRoutes()[0].children[1].path).toBe('child-path2');
      expect(service.getApplicationRoutes()[0].children[1].component).toBe(component3);
      expect(service.getApplicationRoutes()[0].children[1].outlet).toBe(undefined);
      expect(service.getApplicationRoutes()[0].children[2].path).toBe('');
      expect(service.getApplicationRoutes()[0].children[2].component).toBe(component1);
    });

    it('should transform more routes, not just one', () => {
      extensionService.routes = [getDummyRoute({ path: 'aca:routes/about' }), getDummyRoute({ path: 'aca:routes/login' })];
      expect(service.getApplicationRoutes().length).toBe(2);
      expect(service.getApplicationRoutes()[0].path).toBe('aca:routes/about');
      expect(service.getApplicationRoutes()[1].path).toBe('aca:routes/login');
    });
  });

  describe('mapExtensionRoutes', () => {
    it('should prepend routes without parent', () => {
      const route1 = {
        id: 'aca:routes/about',
        path: 'ext/about',
        component: 'ext:components/about'
      };
      extensionService.routes = [route1];

      service.mapExtensionRoutes();

      expect(router.config.length).toBe(5);
      expect(router.config[0].path).toBe(route1.path);
      expect(router.config[1].path).toBe('login');
    });

    it('should add routes to the right parent in reverse order (only one level deep searching)', () => {
      const parentRoutePath = '';
      const parentRoute = router.config.find((routeConfig) => routeConfig.path === parentRoutePath);

      const route1 = {
        id: 'aca:routes/about',
        path: 'dynamic-extension-route',
        component: 'ext:components/about',
        parentRoute: parentRoutePath
      };
      const route2 = {
        id: 'aca:routes/info',
        path: 'dynamic-extension-route2',
        component: 'ext:components/info',
        parentRoute: parentRoutePath
      };
      extensionService.routes = [route1, route2];

      expect(parentRoute.children.length).toBe(2);
      expect(parentRoute.children[0].path).toBe('child-route1');

      service.mapExtensionRoutes();

      expect(router.config.length).toBe(4);
      expect(parentRoute.children.length).toBe(4);
      expect(parentRoute.children[0].path).toBe(route2.path);
      expect(parentRoute.children[1].path).toBe(route1.path);
      expect(parentRoute.children[2].path).toBe('child-route1');
    });

    it('should remove plugin related properties from the route when adding to the router config of Angular', () => {
      const parentRoutePath = '';
      const parentRoute = router.config.find((routeConfig) => routeConfig.path === parentRoutePath);

      const route1 = {
        id: 'aca:routes/about',
        path: 'dynamic-extension-route',
        component: 'ext:components/about',
        parentRoute: parentRoutePath
      };
      extensionService.routes = [route1];

      service.mapExtensionRoutes();

      expect(parentRoute.children[0].path).toBe(route1.path);
      expect((parentRoute.children[0] as any).parentRoute).toBe(undefined);
      expect((parentRoute.children[0] as any).component).toBe(undefined);
    });

    it('should NOT add routes at all if parent can not be found (only one level deep searching)', () => {
      const parentRoutePath = 'not-existing';

      const route1 = {
        id: 'aca:routes/about',
        path: 'dynamic-extension-route',
        component: 'ext:components/about',
        parentRoute: parentRoutePath
      };
      extensionService.routes = [route1];

      function invalidParentAddition() {
        service.mapExtensionRoutes();
      }

      expect(invalidParentAddition).not.toThrow();
    });
  });
});
