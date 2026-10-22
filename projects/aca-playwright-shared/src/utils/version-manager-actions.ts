/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AcaHeader, DataTableComponent, ManageVersionsDialog, MatMenuComponent, UploadNewVersionDialog, ViewerComponent } from '../page-objects';
import { timeouts } from './timeouts';

const MANAGE_VERSIONS_MENU_ITEM = 'Manage Versions';
const UPLOAD_NEW_VERSION_MENU_ITEM = 'Upload New Version';

/** Minimal shape required to act on a file selected in a document list. */
interface DocumentListActionContext {
  page: Page;
  dataTable: DataTableComponent;
  acaHeader: AcaHeader;
}

interface ManageVersionsFromListContext extends DocumentListActionContext {
  manageVersionsDialog: ManageVersionsDialog;
}

interface ManageVersionsFromViewerContext {
  matMenu: MatMenuComponent;
  viewer: ViewerComponent;
  manageVersionsDialog: ManageVersionsDialog;
}

interface UploadNewVersionContext extends DocumentListActionContext {
  uploadNewVersionDialog: UploadNewVersionDialog;
}

export interface UploadNewVersionOptions {
  major?: boolean;
  comment?: string;
  cancel?: boolean;
}

export class VersionManagerActions {
  static async openManageVersionsFromList(context: ManageVersionsFromListContext, fileName: string): Promise<void> {
    await context.dataTable.getRowByName(fileName).waitFor({ state: 'visible', timeout: timeouts.large });
    await context.dataTable.selectItems(fileName);
    await context.acaHeader.clickMoreActions();
    await context.acaHeader.matMenu.clickMenuItem(MANAGE_VERSIONS_MENU_ITEM);
    await context.manageVersionsDialog.waitForDialog();
    await context.manageVersionsDialog.waitForVersionListToLoad();
  }

  static async openManageVersionsFromViewer(context: ManageVersionsFromViewerContext): Promise<void> {
    await context.viewer.toolbar.clickMoreActions();
    await context.matMenu.clickMenuItem(MANAGE_VERSIONS_MENU_ITEM);
    await context.manageVersionsDialog.waitForDialog();
    await context.manageVersionsDialog.waitForVersionListToLoad();
  }

  static async selectFileForNewVersion(context: UploadNewVersionContext, fileName: string, filePath: string): Promise<void> {
    await context.dataTable.selectItems(fileName);
    await context.acaHeader.clickMoreActions();
    const [fileChooser] = await Promise.all([
      context.page.waitForEvent('filechooser', { timeout: timeouts.extraLarge }),
      context.acaHeader.matMenu.clickMenuItem(UPLOAD_NEW_VERSION_MENU_ITEM)
    ]);
    await fileChooser.setFiles(filePath);
    await context.uploadNewVersionDialog.title.waitFor();
  }

  static async uploadNewVersion(
    context: UploadNewVersionContext,
    fileName: string,
    filePath: string,
    options: UploadNewVersionOptions = {}
  ): Promise<void> {
    const { major = false, comment, cancel = false } = options;

    await this.selectFileForNewVersion(context, fileName, filePath);

    if (major) {
      await context.uploadNewVersionDialog.majorOption.click();
    }
    if (comment) {
      await context.uploadNewVersionDialog.description.fill(comment);
    }

    if (cancel) {
      await context.uploadNewVersionDialog.cancelButton.click();
    } else {
      await context.uploadNewVersionDialog.uploadButton.click();
    }
    await context.uploadNewVersionDialog.cancelButton.waitFor({ state: 'detached' });
  }
}
