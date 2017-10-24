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

import { ElementFinder, ElementArrayFinder, element, by, promise } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class UserInfo extends Component {
    private locators = {
        avatar: by.css('.current-user__avatar'),
        fullName: by.css('.current-user__full-name'),
        menuItems: by.css('[mat-menu-item]')
    };

    fullName: ElementFinder = this.component.element(this.locators.fullName);
    avatar: ElementFinder = this.component.element(this.locators.avatar);

    menu: Menu = new Menu();

    constructor(ancestor?: ElementFinder) {
        super('app-current-user', ancestor);
    }

    openMenu(): promise.Promise<Menu> {
        const { menu, avatar } = this;

        return avatar.click()
            .then(() => menu.wait())
            .then(() => menu);
    }

    get name(): promise.Promise<string> {
        return this.fullName.getText();
    }

    signOut(): promise.Promise<void> {
        return this.openMenu()
            .then(menu => {
                menu.clickMenuItem('Sign out');
            });
    }
}
