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

import { by, ElementFinder, promise } from 'protractor';
import { Component } from '../component';

export class LoginComponent extends Component {
    static selector = 'adf-login';

    private locators = {
        usernameInput: by.css('input#username'),
        passwordInput: by.css('input#password'),
        passwordVisibility: by.css('.adf-login-password-icon'),
        submitButton: by.css('button#login-button'),
        errorMessage: by.css('.login-error-message'),
        copyright: by.css('.copyright')
    };

    usernameInput: ElementFinder = this.component.element(this.locators.usernameInput);
    passwordInput: ElementFinder = this.component.element(this.locators.passwordInput);
    submitButton: ElementFinder = this.component.element(this.locators.submitButton);
    errorMessage: ElementFinder = this.component.element(this.locators.errorMessage);
    copyright: ElementFinder = this.component.element(this.locators.copyright);
    passwordVisibility: ElementFinder = this.component.element(this.locators.passwordVisibility);

    constructor(ancestor?: ElementFinder) {
        super(LoginComponent.selector, ancestor);
    }

    enterUsername(username: string): LoginComponent {
        const { usernameInput } = this;

        usernameInput.clear();
        usernameInput.sendKeys(username);

        return this;
    }

    enterPassword(password: string): LoginComponent {
        const { passwordInput } = this;

        passwordInput.clear();
        passwordInput.sendKeys(password);

        return this;
    }

    enterCredentials(username: string, password: string) {
        this.enterUsername(username).enterPassword(password);

        return this;
    }

    submit(): promise.Promise<void> {
        return this.submitButton.click();
    }

    getPasswordVisibility() {
        return this.passwordVisibility.getText()
            .then(text => {
                if (text.endsWith('visibility_off')) {
                    return false;
                } else {
                    if (text.endsWith('visibility')) {
                        return true;
                    }
                }
            });
    }

    isPasswordShown() {
        return this.passwordInput.getAttribute('type')
            .then(type => {
                if (type === 'text') {
                    return true;
                } else {
                    if (type === 'password') {
                        return false;
                    }
                }
            });
    }
}
