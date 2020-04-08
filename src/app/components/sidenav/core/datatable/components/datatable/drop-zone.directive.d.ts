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
import { ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { DataRow } from '../../data/data-row.model';
import { DataColumn } from '../../data/data-column.model';
export declare class DropZoneDirective implements OnInit, OnDestroy {
  private ngZone;
  private element;
  dropTarget: 'header' | 'cell';
  dropRow: DataRow;
  dropColumn: DataColumn;
  constructor(elementRef: ElementRef, ngZone: NgZone);
  ngOnInit(): void;
  ngOnDestroy(): void;
  onDragOver(event: Event): void;
  onDrop(event: Event): void;
}
