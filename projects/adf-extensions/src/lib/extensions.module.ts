/*!
 * @license
 * Copyright 2016 - 2018 Alfresco Software, Ltd.
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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { ExtensionLoaderService } from './services/extension-loader.service';

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class ExtensionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ExtensionsModule,
            providers: [ExtensionLoaderService]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: ExtensionsModule
        };
    }
}
