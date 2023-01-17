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

import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ContentManagementService } from '../../services/content-management.service';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { UploadService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { AppExtensionService, AppHookService } from '@alfresco/aca-shared';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';

@Component({
  templateUrl: './shared-files.component.html'
})
export class SharedFilesComponent extends PageComponent implements OnInit {
  isSmallScreen = false;

  columns: DocumentListPresetRef[] = [];

  constructor(
    store: Store<any>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private appHookService: AppHookService,
    private uploadService: UploadService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions = this.subscriptions.concat([
      this.appHookService.linksUnshared.pipe(debounceTime(300)).subscribe(() => this.reload()),

      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe((_) => this.reload()),
      this.uploadService.fileUploadDeleted.pipe(debounceTime(300)).subscribe((_) => this.reload()),

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).subscribe((result) => {
        this.isSmallScreen = result.matches;
      })
    ]);

    this.columns = this.extensions.documentListPresets.shared || [];
  }

  preview(node: MinimalNodeEntity) {
    this.showPreview(node, { location: this.router.url });
  }

  handleNodeClick(event: Event) {
    this.preview((event as CustomEvent).detail?.node);
  }
}
