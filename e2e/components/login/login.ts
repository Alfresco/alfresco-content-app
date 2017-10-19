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

import { by, ElementFinder } from 'protractor';
import { Component } from '../component';

export class LoginComponent extends Component {
    static selector = 'alfresco-login';

    private locators = {
        usernameInput: by.css('input#username'),
        passwordInput: by.css('input#password'),
        submitButton: by.css('button#login-button'),
        errorMessage: by.css('.login-error-message')
    };

    usernameInput: ElementFinder = this.component.element(this.locators.usernameInput);
    passwordInput: ElementFinder = this.component.element(this.locators.passwordInput);
    submitButton: ElementFinder = this.component.element(this.locators.submitButton);
    errorMessage: ElementFinder = this.component.element(this.locators.errorMessage);

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

    submit(): Promise<void> {
        return this.submitButton.click();
    }
}
