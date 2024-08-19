/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  DataTableComponent,
  MatMenuComponent,
  ViewerComponent,
  SearchInputComponent,
  SearchOverlayComponent,
  SidenavComponent,
  SearchSortingPicker,
  SearchFilters,
  SearchFiltersTags,
  SearchFiltersCategories,
  SearchFiltersDate,
  SearchFiltersLocation,
  SearchFiltersLogic,
  SearchFiltersProperties
} from '../components';
import { AcaHeader } from '../components/aca-header.component';
import { AdfConfirmDialogComponent, AdfFolderDialogComponent, UploadNewVersionDialog, ManageVersionsDialog } from '../components/dialogs';

export type SearchType = 'files' | 'folders' | 'filesAndFolders' | 'libraries';

export class SearchPage extends BasePage {
  private static pageUrl = 'search';

  constructor(page: Page) {
    super(page, SearchPage.pageUrl);
  }

  public acaHeader = new AcaHeader(this.page);
  public matMenu = new MatMenuComponent(this.page);
  public folderDialog = new AdfFolderDialogComponent(this.page);
  public dataTable = new DataTableComponent(this.page);
  public viewer = new ViewerComponent(this.page);
  public searchInput = new SearchInputComponent(this.page);
  public searchOverlay = new SearchOverlayComponent(this.page);
  public searchSortingPicker = new SearchSortingPicker(this.page);
  public searchFilters = new SearchFilters(this.page);
  public searchFiltersTags = new SearchFiltersTags(this.page);
  public searchFiltersCategories = new SearchFiltersCategories(this.page);
  public searchFiltersDate = new SearchFiltersDate(this.page);
  public searchFiltersLocation = new SearchFiltersLocation(this.page);
  public searchFiltersProperties = new SearchFiltersProperties(this.page);
  public searchFiltersLogic = new SearchFiltersLogic(this.page);
  public sidenav = new SidenavComponent(this.page);
  public confirmDialogComponent = new AdfConfirmDialogComponent(this.page);
  public uploadNewVersionDialog = new UploadNewVersionDialog(this.page);
  public manageVersionsDialog = new ManageVersionsDialog(this.page);

  async searchWithin(searchText: string, searchType: SearchType): Promise<void> {
    await this.acaHeader.searchButton.click();
    await this.clickSearchButton();
    switch (searchType) {
      case 'files':
        await this.searchOverlay.checkOnlyFiles();
        break;
      case 'folders':
        await this.searchOverlay.checkOnlyFolders();
        break;
      case 'filesAndFolders':
        await this.searchOverlay.checkFilesAndFolders();
        break;
      case 'libraries':
        await this.searchOverlay.checkLibraries();
        break;
      default:
        break;
    }
    await this.searchOverlay.searchFor(searchText);
    await this.dataTable.progressBarWaitForReload();
  }

  async clickSearchButton() {
    await this.searchInput.searchButton.click({ force: true });
  }
}
