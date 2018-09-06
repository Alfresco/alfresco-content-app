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

import { ElementFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class ConfirmDialog extends Component {
    private static selectors = {
        root: 'adf-confirm-dialog',

        title: '.mat-dialog-title',
        content: '.mat-dialog-content',
        delete: 'adf-confirm-accept',
        keep: 'adf-confirm-cancel'
    };

    title: ElementFinder = this.component.element(by.css(ConfirmDialog.selectors.title));
    content: ElementFinder = this.component.element(by.css(ConfirmDialog.selectors.content));
    deleteButton: ElementFinder = this.component.element(by.id(ConfirmDialog.selectors.delete));
    keepButton: ElementFinder = this.component.element(by.id(ConfirmDialog.selectors.keep));

    constructor(ancestor?: ElementFinder) {
        super(ConfirmDialog.selectors.root, ancestor);
    }

    async waitForDialogToClose() {
        return await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
    }

    async getTitle() {
        return await this.title.getText();
    }

    async getText() {
        return await this.content.getText();
    }

    async clickDelete() {
        await this.deleteButton.click();
    }

    async clickKeep() {
        await this.keepButton.click();
        await this.waitForDialogToClose();
    }
}
