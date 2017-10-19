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

import { SITE_VISIBILITY } from '../../../../configs';

export class Site {
    title?: string;
    visibility?: string = SITE_VISIBILITY.PUBLIC;
    id?: string;
    description?: string;

    constructor(title: string, visibility: string, details: Site) {
        this.title = title;
        this.visibility = visibility;
        this.id = title;
        this.description = `${title} description`;

        Object.assign(this, details);
    }
}
