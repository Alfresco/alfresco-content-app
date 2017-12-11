/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { ElementFinder, by, browser, protractor, ExpectedConditions as EC, promise } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class CreateOrEditFolderDialog extends Component {
    private static selectors = {
        root: 'adf-folder-dialog',

        title: '.mat-dialog-title',
        nameInput: '.mat-input-element[placeholder="Name" i]',
        descriptionTextArea: '.mat-input-element[placeholder="Description" i]',
        button: '.mat-dialog-actions button',
        validationMessage: '.mat-hint span'
    };

    title: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.title));
    nameInput: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.nameInput));
    descriptionTextArea: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.descriptionTextArea));
    createButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Create'));
    cancelButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Cancel'));
    updateButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Update'));
    validationMessage: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.validationMessage));

    constructor(ancestor?: ElementFinder) {
        super(CreateOrEditFolderDialog.selectors.root, ancestor);
    }

    waitForDialogToOpen() {
        return browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT);
    }

    waitForDialogToClose() {
        return browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
    }

    getTitle(): promise.Promise<string> {
        return this.title.getText();
    }

    isValidationMessageDisplayed(): promise.Promise<boolean> {
        return this.validationMessage.isDisplayed();
    }

    getValidationMessage(): promise.Promise<string> {
        return this.isValidationMessageDisplayed()
            .then(() => this.validationMessage.getText())
            .catch(() => '');
    }

    enterName(name: string): promise.Promise<CreateOrEditFolderDialog> {
        return this.nameInput.clear()
            .then(() => this.nameInput.sendKeys(name))
            .then(() => this);
    }

    enterDescription(description: string): promise.Promise<CreateOrEditFolderDialog> {
        return this.descriptionTextArea.clear()
            .then(() => {
                browser.actions().click(this.descriptionTextArea).sendKeys(description).perform();
            })
            .then(() => this);
    }

    deleteNameWithBackspace(): promise.Promise<void> {
        return this.nameInput.clear()
            .then(() => {
                return this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
            });
    }

    clickCreate() {
        return this.createButton.click();
    }

    clickCancel() {
        return this.cancelButton.click()
            .then(() => this.waitForDialogToClose());
    }

    clickUpdate() {
        return this.updateButton.click();
    }
}
