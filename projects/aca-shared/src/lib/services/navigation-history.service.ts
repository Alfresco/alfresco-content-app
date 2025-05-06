/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  history: string[] = [];

  constructor(private router: Router) {}

  listenToRouteChanges(): Observable<NavigationEnd> {
    return this.router.events.pipe(
      startWith(new NavigationEnd(0, this.router.url, this.router.url)),
      filter((event: NavigationEnd) => event instanceof NavigationEnd)
    );
  }

  shouldReturnLastSelection(url: string): boolean {
    return (
      this.history.length > 2 &&
      this.history[this.history.length - 2].startsWith(url) &&
      [...this.history]
        .reverse()
        .slice(1)
        .find((oldUrl) => !oldUrl.startsWith(url)) === this.history[this.history.length - 1]
    );
  }

  setHistory(event: NavigationEnd): void {
    this.history.push(event.urlAfterRedirects);
  }
}
