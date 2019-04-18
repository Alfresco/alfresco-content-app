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

import {
  RouteReuseStrategy,
  DetachedRouteHandle,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ComponentRef } from '@angular/core';

interface RouteData {
  reuse: boolean;
}

interface RouteInfo {
  handle: DetachedRouteHandle;
  data: RouteData;
}

export class AppRouteReuseStrategy implements RouteReuseStrategy {
  private routeCache = new Map<string, RouteInfo>();

  resetCache() {
    this.routeCache.forEach(value => {
      this.deactivateComponent(value.handle);
    });
    this.routeCache.clear();
  }

  private deactivateComponent(handle: DetachedRouteHandle): void {
    if (!handle) {
      return;
    }
    const componentRef: ComponentRef<any> = handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    const ret = future.routeConfig === curr.routeConfig;
    if (ret) {
      this.addRedirectsRecursively(future); // update redirects
    }
    return ret;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const data = this.getRouteData(route);
    return data && data.reuse;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    this.routeCache.set(url, { handle, data });
    this.addRedirectsRecursively(route);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteUrl(route);
    return this.routeCache.has(url);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    return data && data.reuse && this.routeCache.has(url)
      ? this.routeCache.get(url).handle
      : null;
  }

  private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        const routeFirstChild = route.firstChild;
        const routeFirstChildUrl = routeFirstChild
          ? this.getRouteUrlPaths(routeFirstChild).join('/')
          : '';
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(
            c => c.path === '' && !!c.redirectTo
          );
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(childRoute =>
        this.addRedirectsRecursively(childRoute)
      );
    }
  }

  private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
    return this.getFullRouteUrlPaths(route)
      .filter(Boolean)
      .join('/');
  }

  private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    const paths = this.getRouteUrlPaths(route);
    return route.parent
      ? [...this.getFullRouteUrlPaths(route.parent), ...paths]
      : paths;
  }

  private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    return route.url.map(urlSegment => urlSegment.path);
  }

  private getRouteData(route: ActivatedRouteSnapshot): RouteData {
    return route.routeConfig && (route.routeConfig.data as RouteData);
  }
}
