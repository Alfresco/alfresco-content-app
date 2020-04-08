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
/* tslint:disable:no-input-rename  */
/* tslint:disable:rxjs-no-subject-value */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  UserPreferencesService,
  UserPreferenceValues
} from '../services/user-preferences.service';
import { Pagination } from '@alfresco/js-api';
import { takeUntil } from 'rxjs/operators';
export class InfinitePaginationComponent {
  /**
   * @param {?} cdr
   * @param {?} userPreferencesService
   */
  constructor(cdr, userPreferencesService) {
    this.cdr = cdr;
    this.userPreferencesService = userPreferencesService;
    this.onDestroy$ = new Subject();
    /**
     * Is a new page loading?
     */
    this.isLoading = false;
    /**
     * Emitted when the "Load More" button is clicked.
     */
    this.loadMore = new EventEmitter();
    this.pagination = InfinitePaginationComponent.DEFAULT_PAGINATION;
    this.requestPaginationModel = {
      skipCount: 0,
      merge: true
    };
  }
  /**
   * Component that provides custom pagination support.
   * @param {?} target
   * @return {?}
   */
  set target(target) {
    if (target) {
      this._target = target;
      target.pagination.pipe(takeUntil(this.onDestroy$)).subscribe(
        /**
         * @param {?} pagination
         * @return {?}
         */
        pagination => {
          this.isLoading = false;
          this.pagination = pagination;
          if (!this.pagination.hasMoreItems) {
            this.pagination.hasMoreItems = false;
          }
          this.cdr.detectChanges();
        }
      );
    }
  }
  /**
   * @return {?}
   */
  get target() {
    return this._target;
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
         * @param {?} pageSize
         * @return {?}
         */
        pageSize => {
          this.pageSize = this.pageSize || pageSize;
          this.requestPaginationModel.maxItems = this.pageSize;
        }
      );
  }
  /**
   * @return {?}
   */
  onLoadMore() {
    this.requestPaginationModel.skipCount = 0;
    this.requestPaginationModel.merge = false;
    this.requestPaginationModel.maxItems += this.pageSize;
    this.loadMore.next(this.requestPaginationModel);
    if (this._target) {
      this.isLoading = true;
      this._target.updatePagination(
        /** @type {?} */ (this.requestPaginationModel)
      );
    }
  }
  /**
   * @return {?}
   */
  reset() {
    this.pagination.skipCount = 0;
    this.pagination.maxItems = this.pageSize;
    if (this._target) {
      this._target.updatePagination(this.pagination);
    }
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
InfinitePaginationComponent.DEFAULT_PAGINATION = new Pagination({
  skipCount: 0,
  maxItems: 25,
  totalItems: 0
});
InfinitePaginationComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-infinite-pagination',
        host: { class: 'infinite-adf-pagination' },
        template:
          '<div *ngIf="pagination?.hasMoreItems || isLoading" class="adf-infinite-pagination">\n\n    <button mat-button\n        *ngIf="!isLoading"\n        class="adf-infinite-pagination-load-more"\n        (click)="onLoadMore()"\n        data-automation-id="adf-infinite-pagination-button">\n            <ng-content></ng-content>\n    </button>\n\n    <mat-progress-bar *ngIf="isLoading"\n        mode="indeterminate"\n        class="adf-infinite-pagination-spinner"\n        data-automation-id="adf-infinite-pagination-spinner"></mat-progress-bar>\n</div>\n',
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        styles: [
          '.adf-infinite-pagination{display:flex;justify-content:space-around;min-height:56px}.adf-infinite-pagination-load-more{margin-bottom:10px;margin-top:10px}'
        ]
      }
    ]
  }
];
/** @nocollapse */
InfinitePaginationComponent.ctorParameters = () => [
  { type: ChangeDetectorRef },
  { type: UserPreferencesService }
];
InfinitePaginationComponent.propDecorators = {
  target: [{ type: Input }],
  pageSize: [{ type: Input }],
  isLoading: [{ type: Input, args: ['loading'] }],
  loadMore: [{ type: Output }]
};
if (false) {
  /** @type {?} */
  InfinitePaginationComponent.DEFAULT_PAGINATION;
  /** @type {?} */
  InfinitePaginationComponent.prototype._target;
  /**
   * @type {?}
   * @private
   */
  InfinitePaginationComponent.prototype.onDestroy$;
  /**
   * Number of items that are added with each "load more" event.
   * @type {?}
   */
  InfinitePaginationComponent.prototype.pageSize;
  /**
   * Is a new page loading?
   * @type {?}
   */
  InfinitePaginationComponent.prototype.isLoading;
  /**
   * Emitted when the "Load More" button is clicked.
   * @type {?}
   */
  InfinitePaginationComponent.prototype.loadMore;
  /** @type {?} */
  InfinitePaginationComponent.prototype.pagination;
  /** @type {?} */
  InfinitePaginationComponent.prototype.requestPaginationModel;
  /**
   * @type {?}
   * @private
   */
  InfinitePaginationComponent.prototype.cdr;
  /**
   * @type {?}
   * @private
   */
  InfinitePaginationComponent.prototype.userPreferencesService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5maW5pdGUtcGFnaW5hdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwYWdpbmF0aW9uL2luZmluaXRlLXBhZ2luYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsT0FBTyxFQUNILHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQ25FLEtBQUssRUFBVSxNQUFNLEVBQWEsaUJBQWlCLEVBQ3RELE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFJL0IsT0FBTyxFQUFFLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDcEcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVUzQyxNQUFNLE9BQU8sMkJBQTJCOzs7OztJQXNEcEMsWUFBb0IsR0FBc0IsRUFDdEIsc0JBQThDO1FBRDlDLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ3RCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUE5QzFELGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDOzs7O1FBZ0M1QyxjQUFTLEdBQVksS0FBSyxDQUFDOzs7O1FBSTNCLGFBQVEsR0FBeUMsSUFBSSxZQUFZLEVBQTBCLENBQUM7UUFFNUYsZUFBVSxHQUFvQiwyQkFBMkIsQ0FBQyxrQkFBa0IsQ0FBQztRQUU3RSwyQkFBc0IsR0FBMkI7WUFDN0MsU0FBUyxFQUFFLENBQUM7WUFDWixLQUFLLEVBQUUsSUFBSTtTQUNkLENBQUM7SUFJRixDQUFDOzs7Ozs7SUE1Q0QsSUFDSSxNQUFNLENBQUMsTUFBMEI7UUFDakMsSUFBSSxNQUFNLEVBQUU7WUFDUixJQUFJ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QjFCLEtBQUs7dUJBd0JMLEtBQUs7d0JBSUwsS0FBSyxTQUFDLFNBQVM7dUJBSWYsTUFBTTs7OztJQTFDUCwrQ0FJRzs7SUFFSCw4Q0FBNEI7Ozs7O0lBQzVCLGlEQUE0Qzs7Ozs7SUEyQjVDLCtDQUNpQjs7Ozs7SUFHakIsZ0RBQzJCOzs7OztJQUczQiwrQ0FDNEY7O0lBRTVGLGlEQUE2RTs7SUFFN0UsNkRBR0U7Ozs7O0lBRVUsMENBQThCOzs7OztJQUM5Qiw2REFBc0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1pbnB1dC1yZW5hbWUgICovXG4vKiB0c2xpbnQ6ZGlzYWJsZTpyeGpzLW5vLXN1YmplY3QtdmFsdWUgKi9cblxuaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LCBPbkluaXQsIE91dHB1dCwgT25EZXN0cm95LCBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUGFnaW5hdGVkQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdpbmF0ZWQtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBQYWdpbmF0aW9uQ29tcG9uZW50SW50ZXJmYWNlIH0gZnJvbSAnLi9wYWdpbmF0aW9uLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUGFnaW5hdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL3BhZ2luYXRpb24ubW9kZWwnO1xuaW1wb3J0IHsgUmVxdWVzdFBhZ2luYXRpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9yZXF1ZXN0LXBhZ2luYXRpb24ubW9kZWwnO1xuaW1wb3J0IHsgVXNlclByZWZlcmVuY2VzU2VydmljZSwgVXNlclByZWZlcmVuY2VWYWx1ZXMgfSBmcm9tICcuLi9zZXJ2aWNlcy91c2VyLXByZWZlcmVuY2VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1pbmZpbml0ZS1wYWdpbmF0aW9uJyxcbiAgICBob3N0OiB7ICdjbGFzcyc6ICdpbmZpbml0ZS1hZGYtcGFnaW5hdGlvbicgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vaW5maW5pdGUtcGFnaW5hdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vaW5maW5pdGUtcGFnaW5hdGlvbi5jb21wb25lbnQuc2NzcyddLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgSW5maW5pdGVQYWdpbmF0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFBhZ2luYXRpb25Db21wb25lbnRJbnRlcmZhY2Uge1xuXG4gICAgc3RhdGljIERFRkFVTFRfUEFHSU5BVElPTjogUGFnaW5hdGlvbiA9IG5ldyBQYWdpbmF0aW9uKHtcbiAgICAgICAgc2tpcENvdW50OiAwLFxuICAgICAgICBtYXhJdGVtczogMjUsXG4gICAgICAgIHRvdGFsSXRlbXM6IDBcbiAgICB9KTtcblxuICAgIF90YXJnZXQ6IFBhZ2luYXRlZENvbXBvbmVudDtcbiAgICBwcml2YXRlIG9uRGVzdHJveSQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgLyoqIENvbXBvbmVudCB0aGF0IHByb3ZpZGVzIGN1c3RvbSBwYWdpbmF0aW9uIHN1cHBvcnQuICovXG4gICAgQElucHV0KClcbiAgICBzZXQgdGFyZ2V0KHRhcmdldDogUGFnaW5hdGVkQ29tcG9uZW50KSB7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldC5wYWdpbmF0aW9uXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMub25EZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShwYWdpbmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0gcGFnaW5hdGlvbjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGFnaW5hdGlvbi5oYXNNb3JlSXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5oYXNNb3JlSXRlbXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0YXJnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG4gICAgfVxuXG4gICAgLyoqIE51bWJlciBvZiBpdGVtcyB0aGF0IGFyZSBhZGRlZCB3aXRoIGVhY2ggXCJsb2FkIG1vcmVcIiBldmVudC4gKi9cbiAgICBASW5wdXQoKVxuICAgIHBhZ2VTaXplOiBudW1iZXI7XG5cbiAgICAvKiogSXMgYSBuZXcgcGFnZSBsb2FkaW5nPyAqL1xuICAgIEBJbnB1dCgnbG9hZGluZycpXG4gICAgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHRoZSBcIkxvYWQgTW9yZVwiIGJ1dHRvbiBpcyBjbGlja2VkLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGxvYWRNb3JlOiBFdmVudEVtaXR0ZXI8UmVxdWVzdFBhZ2luYXRpb25Nb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFJlcXVlc3RQYWdpbmF0aW9uTW9kZWw+KCk7XG5cbiAgICBwYWdpbmF0aW9uOiBQYWdpbmF0aW9uTW9kZWwgPSBJbmZpbml0ZVBhZ2luYXRpb25Db21wb25lbnQuREVGQVVMVF9QQUdJTkFUSU9OO1xuXG4gICAgcmVxdWVzdFBhZ2luYXRpb25Nb2RlbDogUmVxdWVzdFBhZ2luYXRpb25Nb2RlbCA9IHtcbiAgICAgICAgc2tpcENvdW50OiAwLFxuICAgICAgICBtZXJnZTogdHJ1ZVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB1c2VyUHJlZmVyZW5jZXNTZXJ2aWNlOiBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMudXNlclByZWZlcmVuY2VzU2VydmljZVxuICAgICAgICAgICAgLnNlbGVjdChVc2VyUHJlZmVyZW5jZVZhbHVlcy5QYWdpbmF0aW9uU2l6ZSlcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLm9uRGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgocGFnZVNpemU6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnZVNpemUgPSB0aGlzLnBhZ2VTaXplIHx8IHBhZ2VTaXplO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBhZ2luYXRpb25Nb2RlbC5tYXhJdGVtcyA9IHRoaXMucGFnZVNpemU7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkxvYWRNb3JlKCkge1xuICAgICAgICB0aGlzLnJlcXVlc3RQYWdpbmF0aW9uTW9kZWwuc2tpcENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5yZXF1ZXN0UGFnaW5hdGlvbk1vZGVsLm1lcmdlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0UGFnaW5hdGlvbk1vZGVsLm1heEl0ZW1zICs9IHRoaXMucGFnZVNpemU7XG5cbiAgICAgICAgdGhpcy5sb2FkTW9yZS5uZXh0KHRoaXMucmVxdWVzdFBhZ2luYXRpb25Nb2RlbCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldCkge1xuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0LnVwZGF0ZVBhZ2luYXRpb24oPFJlcXVlc3RQYWdpbmF0aW9uTW9kZWw+IHRoaXMucmVxdWVzdFBhZ2luYXRpb25Nb2RlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnNraXBDb3VudCA9IDA7XG4gICAgICAgIHRoaXMucGFnaW5hdGlvbi5tYXhJdGVtcyA9IHRoaXMucGFnZVNpemU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldCkge1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0LnVwZGF0ZVBhZ2luYXRpb24odGhpcy5wYWdpbmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxufVxuIl19
