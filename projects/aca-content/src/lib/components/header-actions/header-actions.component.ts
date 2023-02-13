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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { SetCurrentFolderAction, AppStore } from '@alfresco/aca-shared/store';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'aca-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderActionsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  createActions: Array<ContentActionRef> = [];
  uploadActions: Array<ContentActionRef> = [];

  constructor(private router: Router, private store: Store<AppStore>, private extensions: AppExtensionService) {}

  ngOnInit(): void {
    this.extensions
      .getCreateActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.createActions = actions;
      });

    this.extensions
      .getUploadActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.uploadActions = actions;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this.store.dispatch(new SetCurrentFolderAction(null));
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }

  private isPersonalFilesRoute(): boolean {
    return this.router.url.includes('/personal-files');
  }

  private isFavoriteLibrariesRoute(): boolean {
    return this.router.url.includes('/favorite/libraries');
  }

  private isLibrariesRoute(): boolean {
    return this.router.url.includes('/libraries');
  }

  canShowCreateButton(): boolean {
    return this.createActions.length > 0 && (this.isPersonalFilesRoute() || this.isFavoriteLibrariesRoute() || this.isLibrariesRoute());
  }

  canShowUploadButton(): boolean {
    return this.uploadActions.length > 0 && this.isPersonalFilesRoute();
  }

  canShowSearchSeparator(): boolean {
    return this.canShowUploadButton() || this.canShowCreateButton();
  }
}
