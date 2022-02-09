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

import { Injectable, InjectionToken, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

export type ExtensionLoaderCallback = (route: ActivatedRouteSnapshot) => Observable<boolean>;

export const DefaultExtensionLoaderFactory = () => [];

export const EXTENSION_DATA_LOADERS = new InjectionToken<ExtensionLoaderCallback[]>('EXTENSION_DATA_LOADERS', {
  providedIn: 'root',
  factory: DefaultExtensionLoaderFactory
});

@Injectable({ providedIn: 'root' })
export class ExtensionsDataLoaderGuard implements CanActivate {
  private invoked = false;

  constructor(
    @Inject(EXTENSION_DATA_LOADERS)
    private extensionDataLoaders: ExtensionLoaderCallback[]
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (!this.invoked) {
      if (!this.extensionDataLoaders.length) {
        this.invoked = true;
        return of(true);
      }

      const dataLoaderCallbacks = this.extensionDataLoaders.map((callback) => callback(route));

      // Undocumented forkJoin behaviour/bug:
      // https://github.com/ReactiveX/rxjs/issues/3246
      // So all callbacks need to emit before completion, otherwise forkJoin will short circuit
      return forkJoin(...dataLoaderCallbacks).pipe(
        map(() => true),
        tap(() => (this.invoked = true)),
        catchError((e) => {
          // eslint-disable-next-line no-console
          console.error('Some of the extension data loader guards has been errored.');
          // eslint-disable-next-line no-console
          console.error(e);
          return of(true);
        })
      );
    } else {
      return of(true);
    }
  }

  canActivateChild(): Observable<boolean> {
    return of(true);
  }
}
