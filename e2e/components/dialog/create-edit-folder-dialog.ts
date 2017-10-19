/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ElementFinder, by, browser, protractor, ExpectedConditions as EC, promise } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class CreateOrEditFolderDialog extends Component {
    private static selectors = {
        root: '.mat-dialog-container',

        title: '.mat-dialog-title',
        nameInput: '.mat-dialog-container .mat-input-element[placeholder="Name"]',
        descriptionTextArea: '.mat-dialog-container .mat-input-element[placeholder="Description"]',
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

    enterName(name: string): CreateOrEditFolderDialog {
        const { nameInput } = this;

        nameInput.clear();
        nameInput.sendKeys(name);

        return this;
    }

    deleteNameWithBackspace(): promise.Promise<void> {
        const { nameInput } = this;

        return nameInput.clear()
            .then(() => {
                return nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
            });
    }

    enterDescription(description: string): CreateOrEditFolderDialog {
        const { descriptionTextArea } = this;

        descriptionTextArea.clear();
        descriptionTextArea.sendKeys(description);

        return this;
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
