/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { OnDestroy, OnInit } from '@angular/core';
import { ObjectDataTableAdapter } from '../../datatable/data/object-datatable-adapter';
import { AppExtensionService, ExtensionRef } from '@alfresco/adf-extensions';
export declare class AboutApplicationModulesComponent
  implements OnInit, OnDestroy {
  private appExtensions;
  extensionColumns: string[];
  dependencyEntries: ObjectDataTableAdapter;
  extensions: ExtensionRef[];
  /** Toggles showing/hiding of extensions block. */
  showExtensions: boolean;
  /** Regular expression for filtering dependencies packages. */
  regexp: string;
  /** Current version of the app running */
  dependencies: any;
  private onDestroy$;
  constructor(appExtensions: AppExtensionService);
  ngOnInit(): void;
  ngOnDestroy(): void;
}
