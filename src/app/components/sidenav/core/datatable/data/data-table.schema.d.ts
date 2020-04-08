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
import { AppConfigService } from '../../app-config/app-config.service';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { DataColumn } from './data-column.model';
export declare abstract class DataTableSchema {
  private appConfigService;
  protected presetKey: string;
  protected presetsModel: any;
  columnList: DataColumnListComponent;
  /** Custom preset column schema in JSON format. */
  presetColumn: string;
  columns: any;
  private layoutPresets;
  constructor(
    appConfigService: AppConfigService,
    presetKey: string,
    presetsModel: any
  );
  createDatatableSchema(): void;
  loadLayoutPresets(): void;
  mergeJsonAndHtmlSchema(): any;
  getSchemaFromHtml(columnList: DataColumnListComponent): any;
  getSchemaFromConfig(presetColumn: string): DataColumn[];
  private getDefaultLayoutPreset;
}
