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

export class Breadcrumb extends Component {
  items = this.allByCss('.adf-breadcrumb-item');
  currentItem = this.byCss('.adf-breadcrumb-item-current');

  constructor(ancestor?: string) {
    super('adf-breadcrumb', ancestor);
  }

  async getAllItems(): Promise<string[]> {
    return this.items.map(async (elem) => {
      const str = await elem.getText();
      return str.split('\nchevron_right')[0];
    });
  }

  async clickItem(name: string): Promise<void> {
    const elem = this.byCss(`.adf-breadcrumb-item[title=${name}]`);
    await elem.click();
  }
}
