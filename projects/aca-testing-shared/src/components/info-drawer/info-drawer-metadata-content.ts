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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser } from 'protractor';
import { Component } from '../component';
import { isPresentAndEnabled } from '../../utilities/utils';

export class ContentMetadata extends Component {
  expandedPanel = this.byCss('.mat-expansion-panel.mat-expanded');
  lessInfoButton = this.byCssText(`[data-automation-id='meta-data-card-toggle-expand']`, 'Less information');
  moreInfoButton = this.byCssText(`[data-automation-id='meta-data-card-toggle-expand']`, 'More information');

  constructor(ancestor?: string) {
    super('adf-content-metadata-card', ancestor);
  }

  async isPropertiesListExpanded(): Promise<boolean> {
    return browser.isElementPresent(this.expandedPanel);
  }

  async isLessInfoButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.lessInfoButton);
  }

  async isMoreInfoButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.moreInfoButton);
  }

  async isMoreInfoButtonDisplayed(): Promise<boolean> {
    return browser.isElementPresent(this.moreInfoButton);
  }
}
