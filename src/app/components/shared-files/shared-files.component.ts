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

import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ContentManagementService } from '../../services/content-management.service';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { AppExtensionService } from '../../extensions/extension.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  templateUrl: './shared-files.component.html'
})
export class SharedFilesComponent extends PageComponent implements OnInit {
  isSmallScreen = false;

  columns: any[] = [];

  constructor(
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private breakpointObserver: BreakpointObserver
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions = this.subscriptions.concat([
      this.content.nodesDeleted.subscribe(() => this.reload()),
      this.content.nodesMoved.subscribe(() => this.reload()),
      this.content.nodesRestored.subscribe(() => this.reload()),
      this.content.linksUnshared
        .pipe(debounceTime(300))
        .subscribe(() => this.reload()),

      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(result => {
          this.isSmallScreen = result.matches;
        })
    ]);

    this.columns = this.extensions.documentListPresets.shared || [];
  }
}
