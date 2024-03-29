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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { by } from 'protractor';
import { GenericDialog } from './generic-dialog';

export class ShareDialog extends GenericDialog {
  labels = this.rootElem.all(by.css('.adf-share-link__label'));
  url = this.childElement(by.css(`[data-automation-id='adf-share-link']`));
  closeButton = this.childElement(by.css(`[data-automation-id='adf-share-dialog-close']`));

  constructor() {
    super('.adf-share-dialog');
  }

  async clickClose(): Promise<void> {
    await this.closeButton.click();
    await this.waitForDialogToClose();
  }
}
