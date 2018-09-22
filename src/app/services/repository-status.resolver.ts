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

import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { DiscoveryEntry } from 'alfresco-js-api';
import { Observable } from 'rxjs';
import { AppStore } from '../store/states/app.state';
import { RepositoryState } from '../store/states';
import { SetRepositoryStatus } from '../store/actions';
import { ContentApiService } from './content-api.service';

@Injectable()
export class RepositoryStatusResolver implements Resolve<RepositoryState> {
  constructor(
    private store: Store<AppStore>,
    private contentApi: ContentApiService,
    private router: Router
  ) {}

  resolve(): Observable<RepositoryState> {
    return new Observable(observer => {
      this.contentApi.getRepositoryInformation().subscribe(
        (response: DiscoveryEntry) => {
          const { status } = response.entry.repository;

          this.store.dispatch(new SetRepositoryStatus(status));
          observer.next(status);
          observer.complete();
        },
        err => {
          if (err) {
            observer.next(null);
            observer.complete();
            this.router.navigate(['login']);
          }
        }
      );
    });
  }
}
