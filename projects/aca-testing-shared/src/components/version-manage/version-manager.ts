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

import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';
import { by, element, ElementFinder } from 'protractor';

export class VersionManagePage {
  async clickActionButton(version: string): Promise<void> {
    await BrowserActions.click(element(by.id(`adf-version-list-action-menu-button-${version}`)));
    await BrowserVisibility.waitUntilElementIsVisible(element(by.css('.cdk-overlay-container .mat-menu-content')));
  }

  async viewFileVersion(version): Promise<void> {
    await this.clickActionButton(version);
    const viewButton: ElementFinder = element(by.id(`adf-version-list-action-view-${version}`));
    await BrowserActions.click(viewButton);
  }
}
