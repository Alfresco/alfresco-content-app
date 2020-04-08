/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ChangeDetectorRef,
  HostBinding
} from '@angular/core';
import { Pagination } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { PaginationModel } from '../models/pagination.model';
import {
  UserPreferencesService,
  UserPreferenceValues
} from '../services/user-preferences.service';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
export class PaginationComponent {
  /**
   * @param {?} cdr
   * @param {?} userPreferencesService
   * @param {?} translate
   */
  constructor(cdr, userPreferencesService, translate) {
    this.cdr = cdr;
    this.userPreferencesService = userPreferencesService;
    this.translate = translate;
    /**
     * Pagination object.
     */
    this.pagination = PaginationComponent.DEFAULT_PAGINATION;
    /**
     * Emitted when pagination changes in any way.
     */
    this.change = new EventEmitter();
    /**
     * Emitted when the page number changes.
     */
    this.changePageNumber = new EventEmitter();
    /**
     * Emitted when the page size changes.
     */
    this.changePageSize = new EventEmitter();
    /**
     * Emitted when the next page is requested.
     */
    this.nextPage = new EventEmitter();
    /**
     * Emitted when the previous page is requested.
     */
    this.prevPage = new EventEmitter();
    this.onDestroy$ = new Subject();
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.userPreferencesService
      .select(UserPreferenceValues.PaginationSize)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        /**
         * @param {?} pagSize
         * @return {?}
         */
        pagSize => (this.pagination.maxItems = pagSize)
      );
    if (!this.supportedPageSizes) {
      this.supportedPageSizes = this.userPreferencesService.supportedPageSizes;
    }
    if (this.target) {
      this.target.pagination.pipe(takeUntil(this.onDestroy$)).subscribe(
        /**
         * @param {?} pagination
         * @return {?}
         */
        pagination => {
          if (pagination.count === 0 && !this.isFirstPage) {
            this.goPrevious();
          }
          this.pagination = pagination;
          this.cdr.detectChanges();
        }
      );
    }
    if (!this.pagination) {
      this.pagination = PaginationComponent.DEFAULT_PAGINATION;
    }
  }
  /**
   * @return {?}
   */
  get lastPage() {
    const { maxItems, totalItems } = this.pagination;
    return totalItems && maxItems ? Math.ceil(totalItems / maxItems) : 1;
  }
  /**
   * @return {?}
   */
  get current() {
    const { maxItems, skipCount } = this.pagination;
    return skipCount && maxItems ? Math.floor(skipCount / maxItems) + 1 : 1;
  }
  /**
   * @return {?}
   */
  get isLastPage() {
    if (!this.pagination.totalItems && this.pagination.hasMoreItems) {
      return false;
    }
    return this.current === this.lastPage;
  }
  /**
   * @return {?}
   */
  get isFirstPage() {
    return this.current === 1;
  }
  /**
   * @return {?}
   */
  get next() {
    return this.isLastPage ? this.current : this.current + 1;
  }
  /**
   * @return {?}
   */
  get previous() {
    return this.isFirstPage ? 1 : this.current - 1;
  }
  /**
   * @return {?}
   */
  get hasItems() {
    return this.pagination && this.pagination.count > 0;
  }
  /**
   * @return {?}
   */
  get isEmpty() {
    return !this.hasItems;
  }
  /**
   * @return {?}
   */
  get range() {
    const { skipCount, maxItems, totalItems } = this.pagination;
    const { isLastPage } = this;
    /** @type {?} */
    let start = 0;
    if (totalItems || totalItems !== 0) {
      start = skipCount + 1;
    }
    /** @type {?} */
    const end = isLastPage ? totalItems : skipCount + maxItems;
    return [start, end];
  }
  /**
   * @return {?}
   */
  get pages() {
    return Array(this.lastPage)
      .fill('n')
      .map(
        /**
         * @param {?} _
         * @param {?} index
         * @return {?}
         */
        (_, index) => index + 1
      );
  }
  /**
   * @return {?}
   */
  get itemRangeText() {
    /** @type {?} */
    const rangeString = this.range.join('-');
    /** @type {?} */
    let translation = this.translate.instant('CORE.PAGINATION.ITEMS_RANGE', {
      range: rangeString,
      total: this.pagination.totalItems
    });
    if (!this.pagination.totalItems) {
      translation = translation.substr(
        0,
        translation.indexOf(rangeString) + rangeString.length
      );
    }
    return translation;
  }
  /**
   * @return {?}
   */
  goNext() {
    if (this.hasItems) {
      /** @type {?} */
      const maxItems = this.pagination.maxItems;
      /** @type {?} */
      const skipCount = (this.next - 1) * maxItems;
      this.pagination.skipCount = skipCount;
      this.handlePaginationEvent(PaginationComponent.ACTIONS.NEXT_PAGE, {
        skipCount,
        maxItems
      });
    }
  }
  /**
   * @return {?}
   */
  goPrevious() {
    if (this.hasItems) {
      /** @type {?} */
      const maxItems = this.pagination.maxItems;
      /** @type {?} */
      const skipCount = (this.previous - 1) * maxItems;
      this.pagination.skipCount = skipCount;
      this.handlePaginationEvent(PaginationComponent.ACTIONS.PREV_PAGE, {
        skipCount,
        maxItems
      });
    }
  }
  /**
   * @param {?} pageNumber
   * @return {?}
   */
  onChangePageNumber(pageNumber) {
    if (this.hasItems) {
      /** @type {?} */
      const maxItems = this.pagination.maxItems;
      /** @type {?} */
      const skipCount = (pageNumber - 1) * maxItems;
      this.pagination.skipCount = skipCount;
      this.handlePaginationEvent(
        PaginationComponent.ACTIONS.CHANGE_PAGE_NUMBER,
        {
          skipCount,
          maxItems
        }
      );
    }
  }
  /**
   * @param {?} maxItems
   * @return {?}
   */
  onChangePageSize(maxItems) {
    this.pagination.skipCount = 0;
    this.userPreferencesService.paginationSize = maxItems;
    this.handlePaginationEvent(PaginationComponent.ACTIONS.CHANGE_PAGE_SIZE, {
      skipCount: 0,
      maxItems
    });
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  /**
   * @param {?} action
   * @param {?} params
   * @return {?}
   */
  handlePaginationEvent(action, params) {
    const {
      NEXT_PAGE,
      PREV_PAGE,
      CHANGE_PAGE_NUMBER,
      CHANGE_PAGE_SIZE
    } = PaginationComponent.ACTIONS;
    const {
      change,
      changePageNumber,
      changePageSize,
      nextPage,
      prevPage,
      pagination
    } = this;
    /** @type {?} */
    const paginationModel = Object.assign({}, pagination, params);
    if (action === NEXT_PAGE) {
      nextPage.emit(paginationModel);
    }
    if (action === PREV_PAGE) {
      prevPage.emit(paginationModel);
    }
    if (action === CHANGE_PAGE_NUMBER) {
      changePageNumber.emit(paginationModel);
    }
    if (action === CHANGE_PAGE_SIZE) {
      changePageSize.emit(paginationModel);
    }
    change.emit(params);
    if (this.target) {
      this.target.updatePagination(params);
    }
  }
}
PaginationComponent.DEFAULT_PAGINATION = new Pagination({
  skipCount: 0,
  maxItems: 25,
  totalItems: 0
});
PaginationComponent.ACTIONS = {
  NEXT_PAGE: 'NEXT_PAGE',
  PREV_PAGE: 'PREV_PAGE',
  CHANGE_PAGE_SIZE: 'CHANGE_PAGE_SIZE',
  CHANGE_PAGE_NUMBER: 'CHANGE_PAGE_NUMBER'
};
PaginationComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-pagination',
        host: { class: 'adf-pagination' },
        template:
          '<ng-container *ngIf="hasItems">\n    <div class="adf-pagination__block adf-pagination__range-block">\n        <span class="adf-pagination__range">\n            {{ itemRangeText }}\n        </span>\n    </div>\n\n    <div class="adf-pagination__block adf-pagination__perpage-block">\n        <span>\n            {{ \'CORE.PAGINATION.ITEMS_PER_PAGE\' | translate }}\n        </span>\n\n        <span class="adf-pagination__max-items">\n            {{ pagination.maxItems }}\n        </span>\n\n        <button\n            mat-icon-button\n            [attr.aria-label]="\'CORE.PAGINATION.ARIA.ITEMS_PER_PAGE\' | translate"\n            [matMenuTriggerFor]="pageSizeMenu">\n            <mat-icon>arrow_drop_down</mat-icon>\n        </button>\n\n        <mat-menu #pageSizeMenu="matMenu" class="adf-pagination__page-selector">\n            <button\n                mat-menu-item\n                *ngFor="let pageSize of supportedPageSizes"\n                (click)="onChangePageSize(pageSize)">\n                {{ pageSize }}\n            </button>\n        </mat-menu>\n    </div>\n\n    <div class="adf-pagination__block adf-pagination__actualinfo-block">\n        <span class="adf-pagination__current-page">\n            {{ \'CORE.PAGINATION.CURRENT_PAGE\' | translate: { number: current } }}\n        </span>\n\n        <button\n            mat-icon-button\n            data-automation-id="page-selector"\n            [attr.aria-label]="\'CORE.PAGINATION.ARIA.CURRENT_PAGE\' | translate"\n            [matMenuTriggerFor]="pagesMenu"\n            *ngIf="pages.length > 1">\n            <mat-icon>arrow_drop_down</mat-icon>\n        </button>\n\n        <div *ngIf="pagination.totalItems">\n            <span class="adf-pagination__total-pages">\n                {{ \'CORE.PAGINATION.TOTAL_PAGES\' | translate: { total: pages.length } }}\n            </span>\n        </div>\n\n        <mat-menu #pagesMenu="matMenu" class="adf-pagination__page-selector">\n            <button\n                mat-menu-item\n                *ngFor="let pageNumber of pages"\n                (click)="onChangePageNumber(pageNumber)">\n                {{ pageNumber }}\n            </button>\n        </mat-menu>\n    </div>\n\n    <div class="adf-pagination__block adf-pagination__controls-block">\n        <button\n            class="adf-pagination__previous-button"\n            mat-icon-button\n            [attr.aria-label]="\'CORE.PAGINATION.ARIA.PREVIOUS_PAGE\' | translate"\n            [disabled]="isFirstPage"\n            (click)="goPrevious()">\n            <mat-icon>keyboard_arrow_left</mat-icon>\n        </button>\n\n        <button\n            class="adf-pagination__next-button"\n            mat-icon-button\n            [attr.aria-label]="\'CORE.PAGINATION.ARIA.NEXT_PAGE\' | translate"\n            [disabled]="isLastPage"\n            (click)="goNext()">\n            <mat-icon>keyboard_arrow_right</mat-icon>\n        </button>\n    </div>\n</ng-container>\n',
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
PaginationComponent.ctorParameters = () => [
  { type: ChangeDetectorRef },
  { type: UserPreferencesService },
  { type: TranslateService }
];
PaginationComponent.propDecorators = {
  target: [{ type: Input }],
  supportedPageSizes: [{ type: Input }],
  pagination: [{ type: Input }],
  change: [{ type: Output }],
  changePageNumber: [{ type: Output }],
  changePageSize: [{ type: Output }],
  nextPage: [{ type: Output }],
  prevPage: [{ type: Output }],
  isEmpty: [{ type: HostBinding, args: ['class.adf-pagination__empty'] }]
};
if (false) {
  /** @type {?} */
  PaginationComponent.DEFAULT_PAGINATION;
  /** @type {?} */
  PaginationComponent.ACTIONS;
  /**
   * Component that provides custom pagination support.
   * @type {?}
   */
  PaginationComponent.prototype.target;
  /**
   * An array of page sizes.
   * @type {?}
   */
  PaginationComponent.prototype.supportedPageSizes;
  /**
   * Pagination object.
   * @type {?}
   */
  PaginationComponent.prototype.pagination;
  /**
   * Emitted when pagination changes in any way.
   * @type {?}
   */
  PaginationComponent.prototype.change;
  /**
   * Emitted when the page number changes.
   * @type {?}
   */
  PaginationComponent.prototype.changePageNumber;
  /**
   * Emitted when the page size changes.
   * @type {?}
   */
  PaginationComponent.prototype.changePageSize;
  /**
   * Emitted when the next page is requested.
   * @type {?}
   */
  PaginationComponent.prototype.nextPage;
  /**
   * Emitted when the previous page is requested.
   * @type {?}
   */
  PaginationComponent.prototype.prevPage;
  /**
   * @type {?}
   * @private
   */
  PaginationComponent.prototype.onDestroy$;
  /**
   * @type {?}
   * @private
   */
  PaginationComponent.prototype.cdr;
  /**
   * @type {?}
   * @private
   */
  PaginationComponent.prototype.userPreferencesService;
  /**
   * @type {?}
   * @private
   */
  PaginationComponent.prototype.translate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwYWdpbmF0aW9uL3BhZ2luYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFDSCx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsaUJBQWlCLEVBQzFGLGlCQUFpQixFQUFhLFdBQVcsRUFDNUMsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRzlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQVV2RCxNQUFNLE9BQU8sbUJBQW1COzs7Ozs7SUFpRDVCLFlBQW9CLEdBQXNCLEVBQVUsc0JBQThDLEVBQVUsU0FBMkI7UUFBbkgsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBVSwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7Ozs7UUF4QnZJLGVBQVUsR0FBb0IsbUJBQW1CLENBQUMsa0JBQWtCLENBQUM7Ozs7UUFJckUsV0FBTSxHQUFrQyxJQUFJLFlBQVksRUFBbUIsQ0FBQzs7OztRQUk1RSxxQkFBZ0IsR0FBa0MsSUFBSSxZQUFZLEVBQW1CLENBQUM7Ozs7UUFJdEYsbUJBQWMsR0FBa0MsSUFBSSxZQUFZLEVBQW1CLENBQUM7Ozs7UUFJ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O3VCQUlOLE1BQU07c0JBMkVOLFdBQVcsU0FBQyw2QkFBNkI7Ozs7SUFySDFDLHVDQUlHOztJQUVILDRCQUtFOzs7OztJQUdGLHFDQUMyQjs7Ozs7SUFHM0IsaURBQzZCOzs7OztJQUc3Qix5Q0FDcUU7Ozs7O0lBR3JFLHFDQUM0RTs7Ozs7SUFHNUUsK0NBQ3NGOzs7OztJQUd0Riw2Q0FDb0Y7Ozs7O0lBR3BGLHVDQUM4RTs7Ozs7SUFHOUUsdUNBQzhFOzs7OztJQUU5RSx5Q0FBNEM7Ozs7O0lBRWhDLGtDQUE4Qjs7Ozs7SUFBRSxxREFBc0Q7Ozs7O0lBQUUsd0NBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsIE9uRGVzdHJveSwgSG9zdEJpbmRpbmdcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFBhZ2luYXRpb24gfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IFBhZ2luYXRlZENvbXBvbmVudCB9IGZyb20gJy4vcGFnaW5hdGVkLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUGFnaW5hdGlvbkNvbXBvbmVudEludGVyZmFjZSB9IGZyb20gJy4vcGFnaW5hdGlvbi1jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFBhZ2luYXRpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9wYWdpbmF0aW9uLm1vZGVsJztcbmltcG9ydCB7IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsIFVzZXJQcmVmZXJlbmNlVmFsdWVzIH0gZnJvbSAnLi4vc2VydmljZXMvdXNlci1wcmVmZXJlbmNlcy5zZXJ2aWNlJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtcGFnaW5hdGlvbicsXG4gICAgaG9zdDogeyAnY2xhc3MnOiAnYWRmLXBhZ2luYXRpb24nIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3BhZ2luYXRpb24uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL3BhZ2luYXRpb24uY29tcG9uZW50LnNjc3MnXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFBhZ2luYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUGFnaW5hdGlvbkNvbXBvbmVudEludGVyZmFjZSB7XG5cbiAgICBzdGF0aWMgREVGQVVMVF9QQUdJTkFUSU9OOiBQYWdpbmF0aW9uID0gbmV3IFBhZ2luYXRpb24oe1xuICAgICAgICBza2lwQ291bnQ6IDAsXG4gICAgICAgIG1heEl0ZW1zOiAyNSxcbiAgICAgICAgdG90YWxJdGVtczogMFxuICAgIH0pO1xuXG4gICAgc3RhdGljIEFDVElPTlMgPSB7XG4gICAgICAgIE5FWFRfUEFHRTogJ05FWFRfUEFHRScsXG4gICAgICAgIFBSRVZfUEFHRTogJ1BSRVZfUEFHRScsXG4gICAgICAgIENIQU5HRV9QQUdFX1NJWkU6ICdDSEFOR0VfUEFHRV9TSVpFJyxcbiAgICAgICAgQ0hBTkdFX1BBR0VfTlVNQkVSOiAnQ0hBTkdFX1BBR0VfTlVNQkVSJ1xuICAgIH07XG5cbiAgICAvKiogQ29tcG9uZW50IHRoYXQgcHJvdmlkZXMgY3VzdG9tIHBhZ2luYXRpb24gc3VwcG9ydC4gKi9cbiAgICBASW5wdXQoKVxuICAgIHRhcmdldDogUGFnaW5hdGVkQ29tcG9uZW50O1xuXG4gICAgLyoqIEFuIGFycmF5IG9mIHBhZ2Ugc2l6ZXMuICovXG4gICAgQElucHV0KClcbiAgICBzdXBwb3J0ZWRQYWdlU2l6ZXM6IG51bWJlcltdO1xuXG4gICAgLyoqIFBhZ2luYXRpb24gb2JqZWN0LiAqL1xuICAgIEBJbnB1dCgpXG4gICAgcGFnaW5hdGlvbjogUGFnaW5hdGlvbk1vZGVsID0gUGFnaW5hdGlvbkNvbXBvbmVudC5ERUZBVUxUX1BBR0lOQVRJT047XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHBhZ2luYXRpb24gY2hhbmdlcyBpbiBhbnkgd2F5LiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGNoYW5nZTogRXZlbnRFbWl0dGVyPFBhZ2luYXRpb25Nb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2luYXRpb25Nb2RlbD4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIHBhZ2UgbnVtYmVyIGNoYW5nZXMuICovXG4gICAgQE91dHB1dCgpXG4gICAgY2hhbmdlUGFnZU51bWJlcjogRXZlbnRFbWl0dGVyPFBhZ2luYXRpb25Nb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2luYXRpb25Nb2RlbD4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIHBhZ2Ugc2l6ZSBjaGFuZ2VzLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGNoYW5nZVBhZ2VTaXplOiBFdmVudEVtaXR0ZXI8UGFnaW5hdGlvbk1vZGVsPiA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnaW5hdGlvbk1vZGVsPigpO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgbmV4dCBwYWdlIGlzIHJlcXVlc3RlZC4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBuZXh0UGFnZTogRXZlbnRFbWl0dGVyPFBhZ2luYXRpb25Nb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2luYXRpb25Nb2RlbD4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIHByZXZpb3VzIHBhZ2UgaXMgcmVxdWVzdGVkLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHByZXZQYWdlOiBFdmVudEVtaXR0ZXI8UGFnaW5hdGlvbk1vZGVsPiA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnaW5hdGlvbk1vZGVsPigpO1xuXG4gICAgcHJpdmF0ZSBvbkRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSB1c2VyUHJlZmVyZW5jZXNTZXJ2aWNlOiBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlLCBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnVzZXJQcmVmZXJlbmNlc1NlcnZpY2VcbiAgICAgICAgICAgIC5zZWxlY3QoVXNlclByZWZlcmVuY2VWYWx1ZXMuUGFnaW5hdGlvblNpemUpXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUocGFnU2l6ZSA9PiB0aGlzLnBhZ2luYXRpb24ubWF4SXRlbXMgPSBwYWdTaXplKTtcblxuICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydGVkUGFnZVNpemVzKSB7XG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRlZFBhZ2VTaXplcyA9IHRoaXMudXNlclByZWZlcmVuY2VzU2VydmljZS5zdXBwb3J0ZWRQYWdlU2l6ZXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnBhZ2luYXRpb25cbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHBhZ2luYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFnaW5hdGlvbi5jb3VudCA9PT0gMCAmJiAhdGhpcy5pc0ZpcnN0UGFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nb1ByZXZpb3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSBwYWdpbmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMucGFnaW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0gUGFnaW5hdGlvbkNvbXBvbmVudC5ERUZBVUxUX1BBR0lOQVRJT047XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgbGFzdFBhZ2UoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgeyBtYXhJdGVtcywgdG90YWxJdGVtcyB9ID0gdGhpcy5wYWdpbmF0aW9uO1xuXG4gICAgICAgIHJldHVybiAodG90YWxJdGVtcyAmJiBtYXhJdGVtcylcbiAgICAgICAgICAgID8gTWF0aC5jZWlsKHRvdGFsSXRlbXMgLyBtYXhJdGVtcylcbiAgICAgICAgICAgIDogMTtcbiAgICB9XG5cbiAgICBnZXQgY3VycmVudCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB7IG1heEl0ZW1zLCBza2lwQ291bnQgfSA9IHRoaXMucGFnaW5hdGlvbjtcblxuICAgICAgICByZXR1cm4gKHNraXBDb3VudCAmJiBtYXhJdGVtcylcbiAgICAgICAgICAgID8gTWF0aC5mbG9vcihza2lwQ291bnQgLyBtYXhJdGVtcykgKyAxXG4gICAgICAgICAgICA6IDE7XG4gICAgfVxuXG4gICAgZ2V0IGlzTGFzdFBhZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5wYWdpbmF0aW9uLnRvdGFsSXRlbXMgJiYgdGhpcy5wYWdpbmF0aW9uLmhhc01vcmVJdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPT09IHRoaXMubGFzdFBhZ2U7XG4gICAgfVxuXG4gICAgZ2V0IGlzRmlyc3RQYWdlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50ID09PSAxO1xuICAgIH1cblxuICAgIGdldCBuZXh0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzTGFzdFBhZ2UgPyB0aGlzLmN1cnJlbnQgOiB0aGlzLmN1cnJlbnQgKyAxO1xuICAgIH1cblxuICAgIGdldCBwcmV2aW91cygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0ZpcnN0UGFnZSA/IDEgOiB0aGlzLmN1cnJlbnQgLSAxO1xuICAgIH1cblxuICAgIGdldCBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnaW5hdGlvbiAmJiB0aGlzLnBhZ2luYXRpb24uY291bnQgPiAwO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuYWRmLXBhZ2luYXRpb25fX2VtcHR5JylcbiAgICBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmhhc0l0ZW1zO1xuICAgIH1cblxuICAgIGdldCByYW5nZSgpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IHsgc2tpcENvdW50LCBtYXhJdGVtcywgdG90YWxJdGVtcyB9ID0gdGhpcy5wYWdpbmF0aW9uO1xuICAgICAgICBjb25zdCB7IGlzTGFzdFBhZ2UgfSA9IHRoaXM7XG5cbiAgICAgICAgbGV0IHN0YXJ0ID0gMDtcbiAgICAgICAgaWYgKHRvdGFsSXRlbXMgfHwgdG90YWxJdGVtcyAhPT0gMCkge1xuICAgICAgICAgICAgc3RhcnQgPSBza2lwQ291bnQgKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5kID0gaXNMYXN0UGFnZSA/IHRvdGFsSXRlbXMgOiBza2lwQ291bnQgKyBtYXhJdGVtcztcblxuICAgICAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICAgIH1cblxuICAgIGdldCBwYWdlcygpOiBudW1iZXJbXSB7XG4gICAgICAgIHJldHVybiBBcnJheSh0aGlzLmxhc3RQYWdlKVxuICAgICAgICAgICAgLmZpbGwoJ24nKVxuICAgICAgICAgICAgLm1hcCgoXywgaW5kZXgpID0+IChpbmRleCArIDEpKTtcbiAgICB9XG5cbiAgICBnZXQgaXRlbVJhbmdlVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByYW5nZVN0cmluZyA9IHRoaXMucmFuZ2Uuam9pbignLScpO1xuICAgICAgICBsZXQgdHJhbnNsYXRpb24gPSB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KCdDT1JFLlBBR0lOQVRJT04uSVRFTVNfUkFOR0UnLCB7XG4gICAgICAgICAgICByYW5nZTogcmFuZ2VTdHJpbmcsXG4gICAgICAgICAgICB0b3RhbDogdGhpcy5wYWdpbmF0aW9uLnRvdGFsSXRlbXNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghdGhpcy5wYWdpbmF0aW9uLnRvdGFsSXRlbXMpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uID0gdHJhbnNsYXRpb24uc3Vic3RyKDAsIHRyYW5zbGF0aW9uLmluZGV4T2YocmFuZ2VTdHJpbmcpICsgcmFuZ2VTdHJpbmcubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJhbnNsYXRpb247XG4gICAgfVxuXG4gICAgZ29OZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5oYXNJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgbWF4SXRlbXMgPSB0aGlzLnBhZ2luYXRpb24ubWF4SXRlbXM7XG4gICAgICAgICAgICBjb25zdCBza2lwQ291bnQgPSAodGhpcy5uZXh0IC0gMSkgKiBtYXhJdGVtcztcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5za2lwQ291bnQgPSBza2lwQ291bnQ7XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUGFnaW5hdGlvbkV2ZW50KFBhZ2luYXRpb25Db21wb25lbnQuQUNUSU9OUy5ORVhUX1BBR0UsIHtcbiAgICAgICAgICAgICAgICBza2lwQ291bnQsXG4gICAgICAgICAgICAgICAgbWF4SXRlbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ29QcmV2aW91cygpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1heEl0ZW1zID0gdGhpcy5wYWdpbmF0aW9uLm1heEl0ZW1zO1xuICAgICAgICAgICAgY29uc3Qgc2tpcENvdW50ID0gKHRoaXMucHJldmlvdXMgLSAxKSAqIG1heEl0ZW1zO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnNraXBDb3VudCA9IHNraXBDb3VudDtcblxuICAgICAgICAgICAgdGhpcy5oYW5kbGVQYWdpbmF0aW9uRXZlbnQoUGFnaW5hdGlvbkNvbXBvbmVudC5BQ1RJT05TLlBSRVZfUEFHRSwge1xuICAgICAgICAgICAgICAgIHNraXBDb3VudCxcbiAgICAgICAgICAgICAgICBtYXhJdGVtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNoYW5nZVBhZ2VOdW1iZXIocGFnZU51bWJlcjogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0l0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBtYXhJdGVtcyA9IHRoaXMucGFnaW5hdGlvbi5tYXhJdGVtcztcbiAgICAgICAgICAgIGNvbnN0IHNraXBDb3VudCA9IChwYWdlTnVtYmVyIC0gMSkgKiBtYXhJdGVtcztcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5za2lwQ291bnQgPSBza2lwQ291bnQ7XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUGFnaW5hdGlvbkV2ZW50KFBhZ2luYXRpb25Db21wb25lbnQuQUNUSU9OUy5DSEFOR0VfUEFHRV9OVU1CRVIsIHtcbiAgICAgICAgICAgICAgICBza2lwQ291bnQsXG4gICAgICAgICAgICAgICAgbWF4SXRlbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DaGFuZ2VQYWdlU2l6ZShtYXhJdGVtczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucGFnaW5hdGlvbi5za2lwQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnVzZXJQcmVmZXJlbmNlc1NlcnZpY2UucGFnaW5hdGlvblNpemUgPSBtYXhJdGVtcztcbiAgICAgICAgdGhpcy5oYW5kbGVQYWdpbmF0aW9uRXZlbnQoUGFnaW5hdGlvbkNvbXBvbmVudC5BQ1RJT05TLkNIQU5HRV9QQUdFX1NJWkUsIHtcbiAgICAgICAgICAgIHNraXBDb3VudDogMCxcbiAgICAgICAgICAgIG1heEl0ZW1zXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgaGFuZGxlUGFnaW5hdGlvbkV2ZW50KGFjdGlvbjogc3RyaW5nLCBwYXJhbXM6IFBhZ2luYXRpb25Nb2RlbCkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBORVhUX1BBR0UsXG4gICAgICAgICAgICBQUkVWX1BBR0UsXG4gICAgICAgICAgICBDSEFOR0VfUEFHRV9OVU1CRVIsXG4gICAgICAgICAgICBDSEFOR0VfUEFHRV9TSVpFXG4gICAgICAgIH0gPSBQYWdpbmF0aW9uQ29tcG9uZW50LkFDVElPTlM7XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgY2hhbmdlLFxuICAgICAgICAgICAgY2hhbmdlUGFnZU51bWJlcixcbiAgICAgICAgICAgIGNoYW5nZVBhZ2VTaXplLFxuICAgICAgICAgICAgbmV4dFBhZ2UsXG4gICAgICAgICAgICBwcmV2UGFnZSxcbiAgICAgICAgICAgIHBhZ2luYXRpb25cbiAgICAgICAgfSA9IHRoaXM7XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbk1vZGVsOiBQYWdpbmF0aW9uTW9kZWwgPSBPYmplY3QuYXNzaWduKHt9LCBwYWdpbmF0aW9uLCBwYXJhbXMpO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT09IE5FWFRfUEFHRSkge1xuICAgICAgICAgICAgbmV4dFBhZ2UuZW1pdChwYWdpbmF0aW9uTW9kZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gUFJFVl9QQUdFKSB7XG4gICAgICAgICAgICBwcmV2UGFnZS5lbWl0KHBhZ2luYXRpb25Nb2RlbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0aW9uID09PSBDSEFOR0VfUEFHRV9OVU1CRVIpIHtcbiAgICAgICAgICAgIGNoYW5nZVBhZ2VOdW1iZXIuZW1pdChwYWdpbmF0aW9uTW9kZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gQ0hBTkdFX1BBR0VfU0laRSkge1xuICAgICAgICAgICAgY2hhbmdlUGFnZVNpemUuZW1pdChwYWdpbmF0aW9uTW9kZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hhbmdlLmVtaXQocGFyYW1zKTtcblxuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LnVwZGF0ZVBhZ2luYXRpb24ocGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
