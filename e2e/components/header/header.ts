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

import { ElementFinder, by } from 'protractor';
import { Component } from '../component';
import { UserInfo } from './user-info';

export class Header extends Component {
    private locators = {
        logoLink: by.css('.app-menu__title'),
        userInfo: by.css('app-current-user')
    };

    logoLink: ElementFinder = this.component.element(this.locators.logoLink);
    userInfo: UserInfo = new UserInfo(this.component);

    constructor(ancestor?: ElementFinder) {
        super('app-header', ancestor);
    }
}
