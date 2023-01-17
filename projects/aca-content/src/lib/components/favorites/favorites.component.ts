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

import { AppExtensionService, ContentApiService } from '@alfresco/aca-shared';
import { AppStore } from '@alfresco/aca-shared/store';
import { UploadService } from '@alfresco/adf-core';
import { MinimalNodeEntity, MinimalNodeEntryEntity, PathElementEntity, PathInfo } from '@alfresco/js-api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, map } from 'rxjs/operators';
import { ContentManagementService } from '../../services/content-management.service';
import { PageComponent } from '../page.component';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';

@Component({
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent extends PageComponent implements OnInit {
  isSmallScreen = false;

  columns: DocumentListPresetRef[] = [];

  constructor(
    private router: Router,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    private contentApi: ContentApiService,
    content: ContentManagementService,
    private uploadService: UploadService,
    private breakpointObserver: BreakpointObserver
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions = this.subscriptions.concat([
      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe((_) => this.reload()),
      this.uploadService.fileUploadDeleted.pipe(debounceTime(300)).subscribe((_) => this.reload()),

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).subscribe((result) => {
        this.isSmallScreen = result.matches;
      })
    ]);

    this.columns = this.extensions.documentListPresets.favorites;
  }

  navigate(favorite: MinimalNodeEntryEntity) {
    const { isFolder, id } = favorite;

    // TODO: rework as it will fail on non-English setups
    const isSitePath = (path: PathInfo): boolean => path && path.elements && path.elements.some(({ name }: PathElementEntity) => name === 'Sites');

    if (isFolder) {
      this.contentApi
        .getNode(id)
        .pipe(map((node) => node.entry))
        .subscribe(({ path }: MinimalNodeEntryEntity) => {
          const routeUrl = isSitePath(path) ? '/libraries' : '/personal-files';
          this.router.navigate([routeUrl, id]);
        });
    }
  }

  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.navigate(node.entry);
      }

      if (node.entry.isFile) {
        this.showPreview(node, { location: this.router.url });
      }
    }
  }

  handleNodeClick(event: Event) {
    this.onNodeDoubleClick((event as CustomEvent).detail?.node);
  }
}
