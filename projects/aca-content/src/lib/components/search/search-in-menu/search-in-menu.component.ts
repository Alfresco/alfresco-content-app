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

import { Component, EventEmitter, inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { SearchOptionIds } from '@alfresco/aca-shared/store';
import { SearchFilterService } from '../search-filter.service';

@Component({
  selector: 'aca-search-in-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDividerModule
  ],
  templateUrl: './search-in-menu.component.html',
  styleUrls: ['./search-in-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchInMenuComponent implements OnInit {
  readonly SearchOptionIds = SearchOptionIds;

  /** Emitted when user clicks "Apply" and filters should trigger a new search. */
  @Output() readonly filtersApplied = new EventEmitter<void>();

  @ViewChild('searchInTrigger')
  menuTrigger: MatMenuTrigger;

  searchInMode: 'content' | 'libraries' = 'content';
  filesChecked = true;
  foldersChecked = true;

  readonly filterService = inject(SearchFilterService);

  private pendingSearchInMode: 'content' | 'libraries' = 'content';
  private pendingFilesChecked = true;
  private pendingFoldersChecked = true;

  ngOnInit() {
    this.initializeSavedValues();
  }

  onSearchInModeChange() {
    if (this.searchInMode === SearchOptionIds.Libraries) {
      this.filesChecked = false;
      this.foldersChecked = false;
    } else {
      this.filesChecked = true;
      this.foldersChecked = true;
    }
  }

  onContentFilterChange() {
    if (!this.filesChecked && !this.foldersChecked) {
      this.filesChecked = true;
      this.foldersChecked = true;
    }
  }

  apply() {
    this.commitToService();
    this.pendingSearchInMode = this.searchInMode;
    this.pendingFilesChecked = this.filesChecked;
    this.pendingFoldersChecked = this.foldersChecked;
    this.menuTrigger?.closeMenu();
    this.filtersApplied.emit();
  }

  reset() {
    this.searchInMode = 'content';
    this.filesChecked = true;
    this.foldersChecked = true;
  }

  close() {
    this.searchInMode = this.pendingSearchInMode;
    this.filesChecked = this.pendingFilesChecked;
    this.foldersChecked = this.pendingFoldersChecked;
    this.menuTrigger?.closeMenu();
  }

  private initializeSavedValues() {
    this.searchInMode = this.filterService.searchInMode;
    this.filesChecked = this.filterService.filesChecked;
    this.foldersChecked = this.filterService.foldersChecked;
    this.pendingSearchInMode = this.searchInMode;
    this.pendingFilesChecked = this.filesChecked;
    this.pendingFoldersChecked = this.foldersChecked;
  }

  private commitToService() {
    this.filterService.searchInMode = this.searchInMode;
    this.filterService.filesChecked = this.filesChecked;
    this.filterService.foldersChecked = this.foldersChecked;
  }
}
