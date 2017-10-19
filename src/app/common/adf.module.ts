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

import { NgModule } from '@angular/core';

import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { ViewerModule } from 'ng2-alfresco-viewer';
import { UploadModule } from 'ng2-alfresco-upload';
import { SearchModule } from 'ng2-alfresco-search';
import { LoginModule } from 'ng2-alfresco-login';

export function modules() {
    return [
        CoreModule,
        DataTableModule,
        DocumentListModule,
        ViewerModule,
        UploadModule,
        SearchModule,
        LoginModule
    ];
}

@NgModule({
    imports: modules(),
    exports: modules()
})
export class AdfModule {}
