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

import { extractSearchedWordFromEncodedQuery } from '@alfresco/aca-content';
import { Injectable } from '@angular/core';
import { PRIMARY_OUTLET, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchNavigationService {
  private _previousRoute = '';

  get previousRoute(): string {
    return this._previousRoute;
  }

  get onLibrariesSearchResults(): boolean {
    return this.router?.url.indexOf('/search-libraries') === 0;
  }

  get onSearchResults(): boolean {
    return !this.onLibrariesSearchResults && this.router?.url.indexOf('/search') === 0;
  }

  constructor(private router: Router) {}

  saveRoute(route: string): void {
    this._previousRoute = route;
  }

  navigateBack(): void {
    if (this.previousRoute) {
      this.router.navigate([this.previousRoute]);
    } else {
      this.router.navigate(['/personal-files']);
    }
  }

  navigateToSearch(): void {
    this.saveRoute(this.router.url);
    this.router.navigate(['/search']);
  }

  getUrlSearchTerm(): string {
    if (!this.onSearchResults && !this.onLibrariesSearchResults) {
      return '';
    }

    const urlTree: UrlTree = this.router.parseUrl(this.router.url);
    const urlSegmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

    if (urlSegmentGroup) {
      const urlSegments: UrlSegment[] = urlSegmentGroup.segments;
      return extractSearchedWordFromEncodedQuery(urlSegments[0].parameters['q']);
    }

    return '';
  }

  isSameSearchTerm(searchedWord: string): boolean {
    return searchedWord === this.getUrlSearchTerm();
  }
}
