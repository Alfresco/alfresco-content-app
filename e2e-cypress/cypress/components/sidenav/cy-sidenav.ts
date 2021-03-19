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

// import { ElementFinder, by, element, browser } from 'protractor';
// import { Logger, BrowserActions } from '@alfresco/adf-testing';
import { SIDEBAR_LABELS, BROWSER_WAIT_TIMEOUT } from '../../utils/cy-configs';
import { CyMenu } from '../menu/cy-menu';
import { CyComponent } from '../cy-component';

export class CySidenav extends CyComponent {
  links = '.item';
  activeLink = '.action-button--active';
  newButton = '[data-automation-id="create-button"]';
  personalFiles = `[data-automation-id='app.navbar.personalFiles']`;
  fileLibraries = `[data-automation-id='app.navbar.libraries.menu']`;
  myLibraries = `[data-automation-id='app.navbar.libraries.files']`;
  favoriteLibraries = `[data-automation-id='app.navbar.libraries.favorite']`;
  shared = `[data-automation-id='app.navbar.shared']`;
  recentFiles = `[data-automation-id='app.navbar.recentFiles']`;
  favorites = `[data-automation-id='app.navbar.favorites']`;
  trash = `[data-automation-id='app.navbar.trashcan']`;

  menu: CyMenu = new CyMenu();

  constructor(ancestor?: string) {
    super('app-sidenav', ancestor);
  }

  private expandMenu(name: string) {
    cy.get('body').then((body) => {
      if (body.find('.mat-expanded').length) {
        return;
      } else {
        this.getLink(name).click();
        cy.get('.mat-expansion-panel-body');
      }
    });
  }

  openNewMenu() {
    // BrowserActions.click(this.newButton.first());
    return cy.get(this.newButton).click();
    // this.menu.waitForMenuToOpen();
  }

  // async closeNewMenu(): Promise<void> {
  //   await BrowserActions.click(element(by.css('button[data-automation-id="create-button"] span span')));
  //   await this.menu.waitForMenuToClose();
  // }

  openCreateFolderDialog() {
    this.openNewMenu().get(this.menu.createFolderAction).click();
  }

  // async openCreateLibraryDialog(): Promise<void> {
  //   await this.openNewMenu();
  //   await BrowserActions.click(this.menu.createLibraryAction);
  // }

  // async openCreateFileFromTemplateDialog(): Promise<void> {
  //   await this.openNewMenu();
  //   await BrowserActions.click(this.menu.createFileFromTemplateAction);
  // }

  // async openCreateFolderFromTemplateDialog(): Promise<void> {
  //   await this.openNewMenu();
  //   await BrowserActions.click(this.menu.createFolderFromTemplateAction);
  // }

  // async isActive(name: string): Promise<boolean> {
  //   const cssClass = await this.getLinkLabel(name).getAttribute('class');
  //   return cssClass.includes('action-button--active');
  // }

  isActive(name: string) {
    return cy.get('body')
    .find(this.getLinkLabel(name)).should('have.class', 'action-button--active').then((el) => {
      return el.length > 0;
    });
  }

  // async childIsActive(name: string): Promise<boolean> {
  //   const childClass = await this.getLinkLabel(name).element(by.css('span')).getAttribute('class');
  //   return childClass.includes('action-button--active');
  // }

  getLink(name: string) {
    return cy.get(this.getLinkLabel(name)).parent();
  }

  private getLinkLabel(name: string): string {
    switch (name) {
      case 'Personal Files':
        return this.personalFiles;
      case 'File Libraries':
        return this.fileLibraries;
      case 'My Libraries':
        return this.myLibraries;
      case 'Favorite Libraries':
        return this.favoriteLibraries;
      case 'Shared':
        return this.shared;
      case 'Recent Files':
        return this.recentFiles;
      case 'Favorites':
        return this.favorites;
      case 'Trash':
        return this.trash;
      default:
        return this.personalFiles;
    }
  }

  // async getLinkTooltip(name: string): Promise<string> {
  //   const link = this.getLinkLabel(name);
  //   const condition = () => link.getAttribute('title').then((value) => value && value.length > 0);

  //   await browser.actions().mouseMove(link).perform();
  //   await browser.wait(condition, BROWSER_WAIT_TIMEOUT);

  //   return link.getAttribute('title');
  // }

  /*
  const location = this.getItemLocationEl(name).$('a');
  const condition = () => location.getAttribute('title').then((value) => value && value.length > 0);

  await browser.actions().mouseMove(location).perform();
  await browser.wait(condition, BROWSER_WAIT_TIMEOUT);

  return location.getAttribute('title');
  */

  clickLink(name: string) {
    cy.get(this.getLinkLabel(name)).click();
  }

  isFileLibrariesMenuExpanded(): boolean {
    let present = false;

    cy.get('body').then((body) => {
      if (body.find('.mat-expanded').text().includes(SIDEBAR_LABELS.FILE_LIBRARIES)) {
        present = true;
      }
    });

    return present;
  }

  expandFileLibraries() {
    return this.expandMenu(SIDEBAR_LABELS.FILE_LIBRARIES);
  }

  getLinkTooltip(pageName: string) {
    // return this.getLinkLabel(pageName)
      // .find(`${this.locationLink} .adf-datatable-cell-value`)
        return cy.get(`${this.getLinkLabel(pageName)}`)
      .invoke('show')
      .trigger('mouseenter')
      .wait(1000)
      .should('have.attr', 'title');
  }
}
