/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { ElementFinder, ElementArrayFinder, by, promise } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class Sidenav extends Component {
    private static selectors = {
        root: 'app-sidenav',
        link: '.sidenav-menu__item',
        label: '.menu__item--label',
        activeLink: '.menu__item--active',
        newButton: '.adf-sidebar-action-menu-button'
    };

    links: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.link));
    activeLink: ElementFinder = this.component.element(by.css(Sidenav.selectors.activeLink));
    newButton: ElementArrayFinder = this.component.all(by.css(Sidenav.selectors.newButton));

    menu: Menu = new Menu();

    constructor(ancestor?: ElementFinder) {
        super(Sidenav.selectors.root, ancestor);
    }

    openNewMenu(): promise.Promise<Menu> {
        const { menu, newButton } = this;

        return newButton.click()
            .then(() => menu.waitForMenuToOpen())
            .then(() => menu);
    }

    openCreateDialog(): any {
        return this.openNewMenu()
            .then(() => this.menu.clickMenuItem('Create folder'));
    }

    isActiveByLabel(label: string): promise.Promise<boolean> {
        return this.getLinkByLabel(label).getAttribute('class')
            .then(className => className.includes(Sidenav.selectors.activeLink.replace('.', '')));
    }

    getLink(label: string): ElementFinder {
        return this.component.element(by.cssContainingText(Sidenav.selectors.link, label));
    }

    getLinkByLabel(label: string): ElementFinder {
        return this.component.element(by.cssContainingText(Sidenav.selectors.label, label));
    }

    getLinkTooltip(label: string): promise.Promise<string> {
        return this.getLink(label).getAttribute('title');
    }

    navigateToLinkByLabel(label: string): promise.Promise<any> {
        return this.getLinkByLabel(label).click();
    }
}
