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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalNodeEntity } from 'alfresco-js-api';

@Component({
    selector: 'app-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.scss']
})
export class SearchComponent {

    searchTerm = '';

    constructor(
        private router: Router) {
    }

    onItemClicked(node: MinimalNodeEntity) {
        if (node && node.entry) {
            if (node.entry.isFile) {
                this.router.navigate(['/preview', node.entry.id]);
            } else if (node.entry.isFolder) {
                this.router.navigate([ '/personal-files',  node.entry.id ]);
            }
        }
    }
}
