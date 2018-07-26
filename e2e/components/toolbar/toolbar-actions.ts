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

import { ElementFinder, ElementArrayFinder, by, promise, protractor, browser } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class ToolbarActions extends Component {
    private static selectors = {
        root: 'adf-toolbar',
        button: '.mat-icon-button'
    };

    menu: Menu = new Menu();
    buttons: ElementArrayFinder = this.component.all(by.css(ToolbarActions.selectors.button));

    constructor(ancestor?: ElementFinder) {
        super(ToolbarActions.selectors.root, ancestor);
    }

    isEmpty(): promise.Promise<boolean> {
        return this.buttons.count().then(count => (count === 0));
    }

    isButtonPresent(title: string): promise.Promise<boolean> {
        return this.component.element(by.css(`${ToolbarActions.selectors.button}[title="${title}"]`)).isPresent();
    }

    getButtonByLabel(label: string): ElementFinder {
        return this.component.element(by.cssContainingText(ToolbarActions.selectors.button, label));
    }

    getButtonByTitleAttribute(title: string): ElementFinder {
        return this.component.element(by.css(`${ToolbarActions.selectors.button}[title="${title}"]`));
    }

    openMoreMenu() {
        return this.getButtonByTitleAttribute('More actions').click()
            .then(() => this.menu.waitForMenuToOpen())
            .then(() => this.menu);
    }

    closeMoreMenu() {
        return browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }
}
