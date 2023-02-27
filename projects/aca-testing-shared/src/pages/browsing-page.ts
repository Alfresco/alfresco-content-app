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

import { Header, DataTable, Pagination, Toolbar, Breadcrumb, Sidenav } from '../components/components';
import { SIDEBAR_LABELS } from './../configs';
import { Page } from './page';

export class BrowsingPage extends Page {
  header = new Header(this.appRoot);
  sidenav = new Sidenav(this.appRoot);
  toolbar = new Toolbar(this.appRoot);
  breadcrumb = new Breadcrumb(this.appRoot);
  dataTable = new DataTable(this.appRoot);
  pagination = new Pagination(this.appRoot);

  async clickPersonalFiles(): Promise<void> {
    await this.sidenav.clickLink(SIDEBAR_LABELS.PERSONAL_FILES);
  }

  async clickPersonalFilesAndWait(): Promise<void> {
    await this.clickPersonalFiles();
    await this.dataTable.waitForHeader();
  }

  async clickFileLibraries(): Promise<void> {
    await this.sidenav.clickLink(SIDEBAR_LABELS.FILE_LIBRARIES);
  }

  async clickFileLibrariesAndWait(): Promise<void> {
    await this.clickFileLibraries();
    await this.dataTable.waitForHeader();
  }

  async goToFavoriteLibraries(): Promise<void> {
    if (!(await this.sidenav.isFileLibrariesMenuExpanded())) {
      await this.sidenav.expandFileLibraries();
    }
    await this.sidenav.clickLink(SIDEBAR_LABELS.FAVORITE_LIBRARIES);
  }

  async goToFavoriteLibrariesAndWait(): Promise<void> {
    await this.goToFavoriteLibraries();
    await this.dataTable.waitForHeader();
  }

  async goToMyLibraries(): Promise<void> {
    if (!(await this.sidenav.isFileLibrariesMenuExpanded())) {
      await this.sidenav.expandFileLibraries();
    }
    await this.sidenav.clickLink(SIDEBAR_LABELS.MY_LIBRARIES);
  }

  async goToMyLibrariesAndWait(): Promise<void> {
    await this.goToMyLibraries();
    await this.dataTable.waitForHeader();
  }

  async clickRecentFiles(): Promise<void> {
    await this.sidenav.clickLink(SIDEBAR_LABELS.RECENT_FILES);
  }

  async clickRecentFilesAndWait(): Promise<void> {
    await this.clickRecentFiles();
    await this.dataTable.waitForHeader();
  }

  async clickSharedFiles(): Promise<void> {
    await this.sidenav.clickLink(SIDEBAR_LABELS.SHARED_FILES);
  }

  async clickSharedFilesAndWait(): Promise<void> {
    await this.clickSharedFiles();
    await this.dataTable.waitForHeader();
  }

  async clickFavorites(): Promise<void> {
    await this.sidenav.clickLink(SIDEBAR_LABELS.FAVORITES);
  }

  async clickFavoritesAndWait(): Promise<void> {
    await this.clickFavorites();
    await this.dataTable.waitForHeader();
  }

  async clickTrash(): Promise<void> {
    await this.sidenav.clickLink(SIDEBAR_LABELS.TRASH);
  }

  async clickTrashAndWait(): Promise<void> {
    await this.clickTrash();
    await this.dataTable.waitForHeader();
  }
}
