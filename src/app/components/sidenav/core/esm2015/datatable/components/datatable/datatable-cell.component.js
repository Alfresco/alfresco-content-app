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
  Input,
  ViewEncapsulation
} from '@angular/core';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class DataTableCellComponent {
  /**
   * @param {?} alfrescoApiService
   */
  constructor(alfrescoApiService) {
    this.alfrescoApiService = alfrescoApiService;
    this.value$ = new BehaviorSubject('');
    /**
     * Custom resolver function which is used to parse dynamic column objects
     */
    this.resolverFn = null;
    this.onDestroy$ = new Subject();
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.updateValue();
    this.alfrescoApiService.nodeUpdated
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        /**
         * @param {?} node
         * @return {?}
         */
        node => {
          if (this.row) {
            if (this.row['node'].entry.id === node.id) {
              this.row['node'].entry = node;
              this.row['cache'][this.column.key] = this.column.key
                .split('.')
                .reduce(
                  /**
                   * @param {?} source
                   * @param {?} key
                   * @return {?}
                   */
                  (source, key) => source[key],
                  node
                );
              this.updateValue();
            }
          }
        }
      );
  }
  /**
   * @protected
   * @return {?}
   */
  updateValue() {
    if (this.column && this.column.key && this.row && this.data) {
      /** @type {?} */
      const value = this.data.getValue(this.row, this.column, this.resolverFn);
      this.value$.next(value);
      if (!this.tooltip) {
        this.tooltip = value;
      }
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
DataTableCellComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-datatable-cell',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `
        <ng-container>
            <span *ngIf="copyContent; else defaultCell"
                adf-clipboard="CLIPBOARD.CLICK_TO_COPY"
                [clipboard-notification]="'CLIPBOARD.SUCCESS_COPY'"
                [attr.aria-label]="value$ | async"
                [title]="tooltip"
                class="adf-datatable-cell-value"
                >{{ value$ | async }}</span>
        </ng-container>
        <ng-template #defaultCell>
            <span
                [attr.aria-label]="value$ | async"
                [title]="tooltip"
                class="adf-datatable-cell-value"
            >{{ value$ | async }}</span>
        </ng-template>
    `,
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-datatable-content-cell' }
      }
    ]
  }
];
/** @nocollapse */
DataTableCellComponent.ctorParameters = () => [{ type: AlfrescoApiService }];
DataTableCellComponent.propDecorators = {
  data: [{ type: Input }],
  column: [{ type: Input }],
  row: [{ type: Input }],
  copyContent: [{ type: Input }],
  tooltip: [{ type: Input }],
  resolverFn: [{ type: Input }]
};
if (false) {
  /**
   * Data table adapter instance.
   * @type {?}
   */
  DataTableCellComponent.prototype.data;
  /**
   * Data that defines the column.
   * @type {?}
   */
  DataTableCellComponent.prototype.column;
  /**
   * Data that defines the row.
   * @type {?}
   */
  DataTableCellComponent.prototype.row;
  /** @type {?} */
  DataTableCellComponent.prototype.value$;
  /**
   * Enables/disables a Clipboard directive to allow copying of the cell's content.
   * @type {?}
   */
  DataTableCellComponent.prototype.copyContent;
  /**
   * Text for the cell's tooltip.
   * @type {?}
   */
  DataTableCellComponent.prototype.tooltip;
  /**
   * Custom resolver function which is used to parse dynamic column objects
   * @type {?}
   */
  DataTableCellComponent.prototype.resolverFn;
  /**
   * @type {?}
   * @protected
   */
  DataTableCellComponent.prototype.onDestroy$;
  /**
   * @type {?}
   * @protected
   */
  DataTableCellComponent.prototype.alfrescoApiService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXRhYmxlLWNlbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZGF0YXRhYmxlL2NvbXBvbmVudHMvZGF0YXRhYmxlL2RhdGF0YWJsZS1jZWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQ0gsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxLQUFLLEVBRUwsaUJBQWlCLEVBRXBCLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQTBCM0MsTUFBTSxPQUFPLHNCQUFzQjs7OztJQTZCL0IsWUFBc0Isa0JBQXNDO1FBQXRDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFoQjVELFdBQU0sR0FBRyxJQUFJLGVBQWUsQ0FBTSxFQUFFLENBQUMsQ0FBQzs7OztRQVl0QyxlQUFVLEdBQTRDLElBQUksQ0FBQztRQUVqRCxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztJQUVpQixDQUFDOzs7O0lBRWhFLFFBQVE7UUFDSixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVc7YUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUzs7OztRQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2QsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNWLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNOzs7OztvQkFBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0csSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUN0QjthQUNKO1FBQ0wsQ0FBQyxFQUFDLENBQUM7SUFDWCxDQUFDOzs7OztJQUVTLFdBQVc7UUFDakIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTs7a0JBQ25ELEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUV4RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzthQUN4QjtTQUNKO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7OztZQXJGSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQlQ7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSw0QkFBNEIsRUFBRTthQUNoRDs7OztZQTNCUSxrQkFBa0I7OzttQkE4QnRCLEtBQUs7cUJBSUwsS0FBSztrQkFJTCxLQUFLOzBCQU1MLEtBQUs7c0JBSUwsS0FBSzt5QkFJTCxLQUFLOzs7Ozs7O0lBdEJOLHNDQUN1Qjs7Ozs7SUFHdkIsd0NBQ21COzs7OztJQUduQixxQ0FDYTs7SUFFYix3Q0FBc0M7Ozs7O0lBR3RDLDZDQUNxQjs7Ozs7SUFHckIseUNBQ2dCOzs7OztJQUdoQiw0Q0FDMkQ7Ozs7O0lBRTNELDRDQUE4Qzs7Ozs7SUFFbEMsb0RBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgT25Jbml0LFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGFDb2x1bW4gfSBmcm9tICcuLi8uLi9kYXRhL2RhdGEtY29sdW1uLm1vZGVsJztcbmltcG9ydCB7IERhdGFSb3cgfSBmcm9tICcuLi8uLi9kYXRhL2RhdGEtcm93Lm1vZGVsJztcbmltcG9ydCB7IERhdGFUYWJsZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRhL2RhdGF0YWJsZS1hZGFwdGVyJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1kYXRhdGFibGUtY2VsbCcsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiY29weUNvbnRlbnQ7IGVsc2UgZGVmYXVsdENlbGxcIlxuICAgICAgICAgICAgICAgIGFkZi1jbGlwYm9hcmQ9XCJDTElQQk9BUkQuQ0xJQ0tfVE9fQ09QWVwiXG4gICAgICAgICAgICAgICAgW2NsaXBib2FyZC1ub3RpZmljYXRpb25dPVwiJ0NMSVBCT0FSRC5TVUNDRVNTX0NPUFknXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInZhbHVlJCB8IGFzeW5jXCJcbiAgICAgICAgICAgICAgICBbdGl0bGVdPVwidG9vbHRpcFwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJhZGYtZGF0YXRhYmxlLWNlbGwtdmFsdWVcIlxuICAgICAgICAgICAgICAgID57eyB2YWx1ZSQgfCBhc3luYyB9fTwvc3Bhbj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdENlbGw+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwidmFsdWUkIHwgYXN5bmNcIlxuICAgICAgICAgICAgICAgIFt0aXRsZV09XCJ0b29sdGlwXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImFkZi1kYXRhdGFibGUtY2VsbC12YWx1ZVwiXG4gICAgICAgICAgICA+e3sgdmFsdWUkIHwgYXN5bmMgfX08L3NwYW4+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHsgY2xhc3M6ICdhZGYtZGF0YXRhYmxlLWNvbnRlbnQtY2VsbCcgfVxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVDZWxsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIC8qKiBEYXRhIHRhYmxlIGFkYXB0ZXIgaW5zdGFuY2UuICovXG4gICAgQElucHV0KClcbiAgICBkYXRhOiBEYXRhVGFibGVBZGFwdGVyO1xuXG4gICAgLyoqIERhdGEgdGhhdCBkZWZpbmVzIHRoZSBjb2x1bW4uICovXG4gICAgQElucHV0KClcbiAgICBjb2x1bW46IERhdGFDb2x1bW47XG5cbiAgICAvKiogRGF0YSB0aGF0IGRlZmluZXMgdGhlIHJvdy4gKi9cbiAgICBASW5wdXQoKVxuICAgIHJvdzogRGF0YVJvdztcblxuICAgIHZhbHVlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PignJyk7XG5cbiAgICAvKiogRW5hYmxlcy9kaXNhYmxlcyBhIENsaXBib2FyZCBkaXJlY3RpdmUgdG8gYWxsb3cgY29weWluZyBvZiB0aGUgY2VsbCdzIGNvbnRlbnQuICovXG4gICAgQElucHV0KClcbiAgICBjb3B5Q29udGVudDogYm9vbGVhbjtcblxuICAgIC8qKiBUZXh0IGZvciB0aGUgY2VsbCdzIHRvb2x0aXAuICovXG4gICAgQElucHV0KClcbiAgICB0b29sdGlwOiBzdHJpbmc7XG5cbiAgICAvKiogQ3VzdG9tIHJlc29sdmVyIGZ1bmN0aW9uIHdoaWNoIGlzIHVzZWQgdG8gcGFyc2UgZHluYW1pYyBjb2x1bW4gb2JqZWN0cyAqL1xuICAgIEBJbnB1dCgpXG4gICAgcmVzb2x2ZXJGbjogKHJvdzogRGF0YVJvdywgY29sOiBEYXRhQ29sdW1uKSA9PiBhbnkgID0gbnVsbDtcblxuICAgIHByb3RlY3RlZCBvbkRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhbGZyZXNjb0FwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSkge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKCk7XG4gICAgICAgIHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLm5vZGVVcGRhdGVkXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvd1snbm9kZSddLmVudHJ5LmlkID09PSBub2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd1snbm9kZSddLmVudHJ5ID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm93WydjYWNoZSddW3RoaXMuY29sdW1uLmtleV0gPSB0aGlzLmNvbHVtbi5rZXkuc3BsaXQoJy4nKS5yZWR1Y2UoKHNvdXJjZSwga2V5KSA9PiBzb3VyY2Vba2V5XSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbiAmJiB0aGlzLmNvbHVtbi5rZXkgJiYgdGhpcy5yb3cgJiYgdGhpcy5kYXRhKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0YS5nZXRWYWx1ZSh0aGlzLnJvdywgdGhpcy5jb2x1bW4sIHRoaXMucmVzb2x2ZXJGbik7XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUkLm5leHQodmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMudG9vbHRpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbHRpcCA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMub25EZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG59XG4iXX0=
