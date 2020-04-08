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
import {
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Pagination } from '@alfresco/js-api';
import { PaginatedComponent } from './paginated-component.interface';
import { PaginationComponentInterface } from './pagination-component.interface';
import { PaginationModel } from '../models/pagination.model';
import { UserPreferencesService } from '../services/user-preferences.service';
import { TranslateService } from '@ngx-translate/core';
export declare class PaginationComponent
  implements OnInit, OnDestroy, PaginationComponentInterface {
  private cdr;
  private userPreferencesService;
  private translate;
  static DEFAULT_PAGINATION: Pagination;
  static ACTIONS: {
    NEXT_PAGE: string;
    PREV_PAGE: string;
    CHANGE_PAGE_SIZE: string;
    CHANGE_PAGE_NUMBER: string;
  };
  /** Component that provides custom pagination support. */
  target: PaginatedComponent;
  /** An array of page sizes. */
  supportedPageSizes: number[];
  /** Pagination object. */
  pagination: PaginationModel;
  /** Emitted when pagination changes in any way. */
  change: EventEmitter<PaginationModel>;
  /** Emitted when the page number changes. */
  changePageNumber: EventEmitter<PaginationModel>;
  /** Emitted when the page size changes. */
  changePageSize: EventEmitter<PaginationModel>;
  /** Emitted when the next page is requested. */
  nextPage: EventEmitter<PaginationModel>;
  /** Emitted when the previous page is requested. */
  prevPage: EventEmitter<PaginationModel>;
  private onDestroy$;
  constructor(
    cdr: ChangeDetectorRef,
    userPreferencesService: UserPreferencesService,
    translate: TranslateService
  );
  ngOnInit(): void;
  readonly lastPage: number;
  readonly current: number;
  readonly isLastPage: boolean;
  readonly isFirstPage: boolean;
  readonly next: number;
  readonly previous: number;
  readonly hasItems: boolean;
  readonly isEmpty: boolean;
  readonly range: number[];
  readonly pages: number[];
  readonly itemRangeText: string;
  goNext(): void;
  goPrevious(): void;
  onChangePageNumber(pageNumber: number): void;
  onChangePageSize(maxItems: number): void;
  ngOnDestroy(): void;
  handlePaginationEvent(action: string, params: PaginationModel): void;
}
