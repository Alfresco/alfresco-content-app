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

import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  AcaHeader,
  AdfFolderDialogComponent,
  ContentNodeSelectorDialog,
  CreateFromTemplateDialogComponent,
  PasswordOverlayDialogComponent,
  ViewerOverlayDialogComponent,
  Breadcrumb,
  DataTableComponent,
  MatMenuComponent,
  ViewerComponent,
  SidenavComponent
} from '../components';

export class PersonalFilesPage extends BasePage {
  private static pageUrl = 'personal-files';

  constructor(page: Page) {
    super(page, PersonalFilesPage.pageUrl);
  }

  public acaHeader = new AcaHeader(this.page);
  public matMenu = new MatMenuComponent(this.page);
  public folderDialog = new AdfFolderDialogComponent(this.page);
  public contentNodeSelector = new ContentNodeSelectorDialog(this.page);
  public dataTable = new DataTableComponent(this.page);
  public viewer = new ViewerComponent(this.page);
  public passwordDialog = new PasswordOverlayDialogComponent(this.page);
  public viewerDialog = new ViewerOverlayDialogComponent(this.page);
  public breadcrumb = new Breadcrumb(this.page);
  public sidenav = new SidenavComponent(this.page);
  public createFromTemplateDialogComponent = new CreateFromTemplateDialogComponent(this.page);

  async selectCreateFolder(): Promise<void> {
    await this.acaHeader.createButton.click();
    await this.matMenu.createFolder.click();
  }
}
