/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';

@Component({
  selector: 'aca-logout',
  template: `
    <button mat-menu-item (click)="onLogoutEvent()" adf-logout>
      <mat-icon>exit_to_app</mat-icon>
      <span>{{ 'APP.SIGN_OUT' | translate }}</span>
    </button>
  `
})
export class LogoutComponent implements OnInit {
  public readonly LAST_VISITED_LOCATION_KEY = 'lastVisitedLocation';
  constructor(private store: Store<AppStore>, private router: Router) {}

  ngOnInit() {
    this.navigateToLastVisitedLocation();
  }

  onLogoutEvent() {
    this.store.dispatch(new SetSelectedNodesAction([]));
    const lastVisitedLocation = this.router.url;
    this.saveLastVisitedLocation(lastVisitedLocation);
  }

  navigateToLastVisitedLocation() {
    const lastVisitedLocation = this.getLastVisitedLocation();
    if (lastVisitedLocation) {
      this.router.navigateByUrl(lastVisitedLocation);
    } else {
      this.navigateToLandingPage();
    }
  }

  navigateToLandingPage() {
    this.router.navigateByUrl('/personal-files');
  }

  saveLastVisitedLocation(location: string) {
    localStorage.setItem(this.LAST_VISITED_LOCATION_KEY, location);
  }
  getLastVisitedLocation(): string {
    return localStorage.getItem(this.LAST_VISITED_LOCATION_KEY);
  }
}
