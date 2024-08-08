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
  SidenavComponent,
  PaginationComponent,
  ErrorComponent,
  ShareDialogComponent,
  AdfConfirmDialogComponent,
  AdfInfoDrawerComponent,
  UploadNewVersionDialog,
  ManageVersionsDialog,
  UploadDialog,
  SnackBarComponent,
  EditDialog
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
  public pagination = new PaginationComponent(this.page);
  public errorDialog = new ErrorComponent(this.page);
  public shareDialog = new ShareDialogComponent(this.page);
  public confirmDialog = new AdfConfirmDialogComponent(this.page);
  public infoDrawer = new AdfInfoDrawerComponent(this.page);
  public uploadNewVersionDialog = new UploadNewVersionDialog(this.page);
  public manageVersionsDialog = new ManageVersionsDialog(this.page);
  public uploadDialog = new UploadDialog(this.page);
  public snackBar = new SnackBarComponent(this.page);
  public editDialog = new EditDialog(this.page);

  async selectCreateFolder(): Promise<void> {
    await this.acaHeader.createButton.click();
    await this.matMenu.createFolder.click();
  }

  async closeMenu(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async waitForPageLoad() {
    await this.page.waitForURL(`**/${PersonalFilesPage.pageUrl}`);
  }

  async clickMoreActionsButton(buttonLabel: string): Promise<void> {
    await this.acaHeader.clickMoreActions();
    await this.matMenu.clickMenuItem(buttonLabel);
  }

  async copyOrMoveContentInDatatable(sourceFileList: string[], destinationName: string, operation = 'Copy'): Promise<void> {
    await this.page.keyboard.down('Control');
    for (const sourceName of sourceFileList) {
      await this.dataTable.selectItems(sourceName);
    }
    await this.page.keyboard.up('Control');
    await this.clickMoreActionsButton(operation);
    await this.contentNodeSelector.selectDestination(destinationName);
    await this.contentNodeSelector.actionButton.click();
  }

  async selectItemsAndToggleFavorite(item: string[], action: 'Favorite' | 'Remove Favorite') {
    for (const itemToSelect of item) {
      await this.dataTable.selectItems(itemToSelect);
    }
    await this.acaHeader.clickMoreActions();
    await this.matMenu.clickMenuItem(action);
  }
}
