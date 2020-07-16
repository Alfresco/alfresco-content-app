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

import { Component } from '../component';
import { waitForPresence } from '../../utilities/utils';

export class MetadataCard extends Component {
  footer = this.byCss('.adf-content-metadata-card-footer');
  expandButton = this.byCss('[data-automation-id="meta-data-card-toggle-expand"]');
  expansionPanels = this.allByCss('.adf-metadata-grouped-properties-container mat-expansion-panel');

  constructor(ancestor?: string) {
    super('adf-content-metadata-card', ancestor);
  }

  async isExpandPresent() {
    return this.expandButton.isPresent();
  }

  async waitForFirstExpansionPanel() {
    await waitForPresence(this.expansionPanels.get(0));
  }

  async isExpansionPanelPresent(index: number) {
    return this.expansionPanels.get(index).isPresent();
  }

  async getComponentIdOfPanel(index: number) {
    return this.expansionPanels.get(index).getAttribute('data-automation-id');
  }
}
