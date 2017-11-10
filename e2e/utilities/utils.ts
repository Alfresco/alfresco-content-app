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

import { browser, promise } from 'protractor';

export class Utils {
    // generate a random value
    static random(): string {
    return Math.random().toString(36).substring(3, 10);
    }

    // local storage
    static clearLocalStorage(): promise.Promise<any> {
        return browser.executeScript('window.localStorage.clear();');
    }
}
