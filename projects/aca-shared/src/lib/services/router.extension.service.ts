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

import { Injectable, Type } from '@angular/core';
import { ExtensionService } from '@alfresco/adf-extensions';
import { ExtensionRoute } from '../models/types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterExtensionService {
  defaults = {
    layout: 'app.layout.main',
    auth: ['app.auth']
  };

  constructor(private router: Router, protected extensions: ExtensionService) {}

  mapExtensionRoutes() {
    const routesWithoutParent = [];
    this.getApplicationRoutes().forEach((extensionRoute: ExtensionRoute) => {
      if (this.extensionRouteHasChild(extensionRoute)) {
        const parentRoute = this.findRoute(extensionRoute.parentRoute);
        if (parentRoute) {
          this.convertExtensionRouteToRoute(extensionRoute);
          parentRoute.children.unshift(extensionRoute);
        }
      } else {
        routesWithoutParent.push(extensionRoute);
      }
    });

    this.router.config.unshift(...routesWithoutParent);
  }

  public getApplicationRoutes(): Array<ExtensionRoute> {
    return this.extensions.routes.map((route) => {
      const guards = this.extensions.getAuthGuards(route.auth && route.auth.length > 0 ? route.auth : this.defaults.auth);

      return {
        path: route.path,
        component: this.getComponentById(route.layout || this.defaults.layout),
        canActivateChild: guards,
        canActivate: guards,
        parentRoute: route.parentRoute,
        children: [
          ...(route['children']
            ? route['children'].map(({ path, component, outlet, data }) => ({
                path,
                outlet,
                data,
                component: this.getComponentById(component)
              }))
            : []),
          {
            path: '',
            component: this.getComponentById(route.component),
            data: route.data
          }
        ]
      };
    });
  }

  private getComponentById(id: string): Type<unknown> {
    return this.extensions.getComponentById(id);
  }

  private extensionRouteHasChild(route: ExtensionRoute): boolean {
    return route.parentRoute !== undefined;
  }

  private convertExtensionRouteToRoute(extensionRoute: ExtensionRoute) {
    delete extensionRoute.parentRoute;
    delete extensionRoute.component;
  }

  private findRoute(parentRoute) {
    const routeIndex = this.router.config.findIndex((route) => route.path === parentRoute);

    return this.router.config[routeIndex];
  }
}
