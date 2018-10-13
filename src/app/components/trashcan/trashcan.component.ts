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
import { selectUser } from '../../store/selectors/app.selectors';
import { AppStore } from '../../store/states/app.state';
import { AppExtensionService } from '../../extensions/extension.service';
import { Observable } from 'rxjs';
import { ProfileState } from '@alfresco/adf-extensions';

@Component({
  templateUrl: './trashcan.component.html'
})
export class TrashcanComponent extends PageComponent implements OnInit {
  isSmallScreen = false;
  user$: Observable<ProfileState>;

  columns: any[] = [
    {
      key: '$thumbnail',
      title: null,
      type: 'image',
      format: null,
      class: 'image-table-cell',
      sortable: false,
      template: null,
      desktopOnly: false
    },
    {
      key: 'name',
      title: 'APP.DOCUMENT_LIST.COLUMNS.NAME',
      type: 'text',
      format: null,
      class: 'adf-data-table-cell--ellipsis__name',
      sortable: true,
      template: 'app.columns.trashcanName',
      desktopOnly: false
    },
    {
      key: 'path.name',
      title: 'APP.DOCUMENT_LIST.COLUMNS.LOCATION',
      type: 'text',
      format: null,
      class: null,
      sortable: true,
      template: 'app.columns.location',
      desktopOnly: true
    },
    {
      key: 'content.sizeInBytes',
      title: 'APP.DOCUMENT_LIST.COLUMNS.SIZE',
      type: 'fileSize',
      format: null,
      class: null,
      sortable: true,
      template: null,
      desktopOnly: true
    },
    {
      key: 'archivedAt',
      title: 'APP.DOCUMENT_LIST.COLUMNS.DELETED_ON',
      type: 'date',
      format: 'timeAgo',
      class: null,
      sortable: true,
      template: null,
      desktopOnly: true
    }
  ];

  constructor(
    content: ContentManagementService,
    extensions: AppExtensionService,
    store: Store<AppStore>,
    private breakpointObserver: BreakpointObserver
  ) {
    super(store, extensions, content);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this.content.nodesRestored.subscribe(() => this.reload()),
      this.content.nodesPurged.subscribe(() => this.reload()),
      this.content.nodesRestored.subscribe(() => this.reload()),

      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(result => {
          this.isSmallScreen = result.matches;
        })
    );
  }
}
