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
  ChangeDetectorRef,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import { PaginatedComponent } from './paginated-component.interface';
import { PaginationComponentInterface } from './pagination-component.interface';
import { PaginationModel } from '../models/pagination.model';
import { RequestPaginationModel } from '../models/request-pagination.model';
import { UserPreferencesService } from '../services/user-preferences.service';
import { Pagination } from '@alfresco/js-api';
export declare class InfinitePaginationComponent
  implements OnInit, OnDestroy, PaginationComponentInterface {
  private cdr;
  private userPreferencesService;
  static DEFAULT_PAGINATION: Pagination;
  _target: PaginatedComponent;
  private onDestroy$;
  /** Component that provides custom pagination support. */
  target: PaginatedComponent;
  /** Number of items that are added with each "load more" event. */
  pageSize: number;
  /** Is a new page loading? */
  isLoading: boolean;
  /** Emitted when the "Load More" button is clicked. */
  loadMore: EventEmitter<RequestPaginationModel>;
  pagination: PaginationModel;
  requestPaginationModel: RequestPaginationModel;
  constructor(
    cdr: ChangeDetectorRef,
    userPreferencesService: UserPreferencesService
  );
  ngOnInit(): void;
  onLoadMore(): void;
  reset(): void;
  ngOnDestroy(): void;
}
