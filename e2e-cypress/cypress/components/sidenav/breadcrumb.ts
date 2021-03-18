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

export class Breadcrumb {
  items = '.adf-breadcrumb-item';
  currentItem = '.adf-breadcrumb-item-current';

  getAllItems() {
    return new Cypress.Promise((resolve, revoke) => {
      cy.get(this.items).invoke('text').then( response => {
        const result = response.split('chevron_right').map( item => item.trim());
        resolve(result);
      });
    });
    // return cy.get(this.items).each((elem) => {
    //   const str = elem.text();
    //   return str.replace('\nchevron_right', '');
    // }).invoke('text');
  }

  checkLastItemIsVisible(name: string) {
    return cy.contains(this.currentItem, name).should('be.visible');
  }

  getCurrentItem() {
    return cy.get(this.currentItem);
  }

  getItemByIndex(index: number) {
    return cy.get(this.items).eq(index);
  }

  getRowsCount() {
    return cy.get(this.items).its('length');
  }

  clickItem(name: string) {
    return cy.get(`.adf-breadcrumb-item[title=${name}]`).click();
  }
}
