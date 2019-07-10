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

import { AppRouteReuseStrategy } from './app.routes.strategy';
import { TestBed } from '@angular/core/testing';

describe('AppRouteReuseStrategy', () => {
  let appRouteReuse: AppRouteReuseStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppRouteReuseStrategy]
    });

    appRouteReuse = TestBed.get(AppRouteReuseStrategy);
  });

  it('should allow detach if route is configured to be reused', () => {
    const route = <any>{
      routeConfig: {
        data: {
          reuse: true
        },
        path: 'tested-path'
      }
    };
    expect(appRouteReuse.shouldDetach(<any>route)).toBe(true);
  });

  it('should store on routeCache', () => {
    const route = <any>{
      url: [],
      routeConfig: {
        data: {
          reuse: true
        },
        path: 'tested-path',
        component: {}
      },
      firstChild: null,
      children: []
    };
    appRouteReuse.store(route, { route: {} });
    expect(appRouteReuse.shouldAttach(<any>route)).toBe(true);
  });

  it('should clear routeCache on resetCache', () => {
    const route = <any>{
      url: [],
      routeConfig: {
        data: {
          reuse: true
        },
        path: 'tested-path',
        component: {}
      },
      firstChild: null,
      children: []
    };
    appRouteReuse.store(route, { route: {} });
    appRouteReuse.resetCache();
    expect(appRouteReuse.shouldAttach(<any>route)).toBe(false);
  });
});
