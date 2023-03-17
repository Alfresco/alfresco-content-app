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
import { ContentManagementService } from '../../services/content-management.service';
import { AppExtensionService, PageComponent } from '@alfresco/aca-shared';
import { SetCurrentFolderAction, AppStore } from '@alfresco/aca-shared/store';

@Component({
  selector: 'aca-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderActionsComponent extends PageComponent implements OnInit, OnDestroy {
  constructor(private router: Router, store: Store<AppStore>, content: ContentManagementService, extensions: AppExtensionService) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    this.store.dispatch(new SetCurrentFolderAction(null));
    super.ngOnDestroy();
  }

  isPersonalFilesRoute(): boolean {
    return this.router.url.includes('/personal-files');
  }

  isFavoriteLibrariesRoute(): boolean {
    return this.router.url.includes('/favorite/libraries');
  }

  isLibrariesRoute(): boolean {
    return this.router.url.includes('/libraries');
  }

  canShowCreateButton(): boolean {
    if (this.isPersonalFilesRoute() || this.isFavoriteLibrariesRoute() || this.isLibrariesRoute()) {
      return true;
    } else {
      return false;
    }
  }

  canShowUploadButton(): boolean {
    if (this.isPersonalFilesRoute()) {
      return true;
    } else {
      return false;
    }
  }

  canShowSearchSeparator(): boolean {
    if (this.isPersonalFilesRoute() || this.isFavoriteLibrariesRoute() || this.isLibrariesRoute()) {
      return true;
    } else {
      return false;
    }
  }
}
