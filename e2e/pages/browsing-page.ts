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

import { Header, DataTable, Pagination, Toolbar, Breadcrumb, Sidenav } from '../components/components';
import { SIDEBAR_LABELS } from './../configs';
import { Page } from './page';

export class BrowsingPage extends Page {
  header = new Header(this.app);
  sidenav = new Sidenav(this.app);
  toolbar = new Toolbar(this.app);
  breadcrumb = new Breadcrumb(this.app);
  dataTable = new DataTable(this.app);
  pagination = new Pagination(this.app);

  async signOut() {
    await this.header.userInfo.signOut();
  }


  // helper methods

  async clickPersonalFilesAndWait() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.PERSONAL_FILES);
    await this.dataTable.waitForHeader();
  }

  async clickPersonalFiles() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.PERSONAL_FILES);
  }


  async clickFileLibrariesAndWait() {
    await this.sidenav.expandFileLibraries();
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.MY_LIBRARIES);
    await this.dataTable.waitForHeader();
  }

  async clickFileLibraries() {
    await this.sidenav.expandFileLibraries();
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.MY_LIBRARIES);
  }

  async goToFavoriteLibraries() {
    await this.sidenav.expandFileLibraries();
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.FAVORITE_LIBRARIES);
  }

  async goToMyLibraries() {
    if ( !(await this.sidenav.isFileLibrariesMenuExpanded()) ) {
      await this.sidenav.expandFileLibraries();
    }
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.MY_LIBRARIES);
  }

  async clickRecentFilesAndWait() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.RECENT_FILES);
    await this.dataTable.waitForHeader();
  }

  async clickRecentFiles() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.RECENT_FILES);
  }


  async clickSharedFilesAndWait() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.SHARED_FILES);
    await this.dataTable.waitForHeader();
  }

  async clickSharedFiles() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.SHARED_FILES);
  }


  async clickFavoritesAndWait() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.FAVORITES);
    await this.dataTable.waitForHeader();
  }

  async clickFavorites() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.FAVORITES);
  }


  async clickTrashAndWait() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.TRASH);
    await this.dataTable.waitForHeader();
  }

  async clickTrash() {
    await this.sidenav.navigateToLink(SIDEBAR_LABELS.TRASH);
  }

}
