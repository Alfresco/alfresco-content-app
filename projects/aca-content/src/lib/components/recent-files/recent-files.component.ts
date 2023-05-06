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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { UploadService } from '@alfresco/adf-content-services';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PageComponent } from '@alfresco/aca-shared';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';

@Component({
  templateUrl: './recent-files.component.html'
})
export class RecentFilesComponent extends PageComponent implements OnInit {
  isSmallScreen = false;

  columns: DocumentListPresetRef[] = [];

  constructor(private uploadService: UploadService, private breakpointObserver: BreakpointObserver, private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions = this.subscriptions.concat([
      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe(() => this.onFileUploadedEvent()),
      this.uploadService.fileUploadDeleted.pipe(debounceTime(300)).subscribe(() => this.onFileUploadedEvent()),

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).subscribe((result) => {
        this.isSmallScreen = result.matches;
      })
    ]);

    this.columns = this.extensions.documentListPresets.recent || [];
  }

  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      this.showPreview(node, { location: this.router.url });
    }
  }

  handleNodeClick(event: Event) {
    this.onNodeDoubleClick((event as CustomEvent).detail?.node);
  }

  private onFileUploadedEvent() {
    this.reload();
  }
}
