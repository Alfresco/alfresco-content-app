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
import { OnInit, OnDestroy } from '@angular/core';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';
import { DataTableAdapter } from '../../data/datatable-adapter';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';
import { BehaviorSubject, Subject } from 'rxjs';
export declare class DataTableCellComponent implements OnInit, OnDestroy {
  protected alfrescoApiService: AlfrescoApiService;
  /** Data table adapter instance. */
  data: DataTableAdapter;
  /** Data that defines the column. */
  column: DataColumn;
  /** Data that defines the row. */
  row: DataRow;
  value$: BehaviorSubject<any>;
  /** Enables/disables a Clipboard directive to allow copying of the cell's content. */
  copyContent: boolean;
  /** Text for the cell's tooltip. */
  tooltip: string;
  /** Custom resolver function which is used to parse dynamic column objects */
  resolverFn: (row: DataRow, col: DataColumn) => any;
  protected onDestroy$: Subject<boolean>;
  constructor(alfrescoApiService: AlfrescoApiService);
  ngOnInit(): void;
  protected updateValue(): void;
  ngOnDestroy(): void;
}
