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

import { promise } from 'protractor';
import { Header, DataTable, Pagination, Toolbar, Sidenav } from '../components/components';
import { Page } from './page';

export class BrowsingPage extends Page {
    header = new Header(this.app);
    sidenav = new Sidenav(this.app);
    toolbar = new Toolbar(this.app);
    dataTable = new DataTable(this.app);
    pagination = new Pagination(this.app);

    signOut(): promise.Promise<void> {
        return this.header.userInfo.signOut();
    }
}
