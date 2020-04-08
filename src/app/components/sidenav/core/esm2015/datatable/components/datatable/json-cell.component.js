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
  ViewEncapsulation,
  Input
} from '@angular/core';
import { DataTableCellComponent } from './datatable-cell.component';
import { MatDialog } from '@angular/material';
import { EditJsonDialogComponent } from '../../../dialogs/edit-json/edit-json.dialog';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';
export class JsonCellComponent extends DataTableCellComponent {
  /**
   * @param {?} dialog
   * @param {?} alfrescoApiService
   */
  constructor(dialog, alfrescoApiService) {
    super(alfrescoApiService);
    this.dialog = dialog;
    /**
     * Editable JSON.
     */
    this.editable = false;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.column && this.column.key && this.row && this.data) {
      this.value$.next(
        this.data.getValue(this.row, this.column, this.resolverFn)
      );
    }
  }
  /**
   * @return {?}
   */
  view() {
    /** @type {?} */
    const rawValue = this.data.getValue(this.row, this.column, this.resolverFn);
    /** @type {?} */
    const value =
      typeof rawValue === 'object'
        ? JSON.stringify(rawValue || {}, null, 2)
        : rawValue;
    /** @type {?} */
    const settings = {
      title: this.column.title,
      editable: this.editable,
      value
    };
    this.dialog
      .open(EditJsonDialogComponent, {
        data: settings,
        minWidth: '50%',
        minHeight: '50%'
      })
      .afterClosed()
      .subscribe(
        /**
         * @return {?}
         */
        (/*result: string*/) => {
          if (typeof rawValue === 'object') {
            // todo: update cell value as object
          } else {
            // todo: update cell value as string
          }
        }
      );
  }
}
JsonCellComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-json-cell',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `
        <ng-container *ngIf="value$ | async as value; else editEmpty">
            <button mat-button color="primary" (click)="view()">json</button>
        </ng-container>

        <ng-template #editEmpty>
            <button *ngIf="editable" mat-button color="primary" (click)="view()">json</button>
        </ng-template>
    `,
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-datatable-content-cell' },
        styles: [
          '.adf-datatable-json-cell{white-space:pre-wrap;word-wrap:break-word}.adf-datatable-cell-value{position:relative}'
        ]
      }
    ]
  }
];
/** @nocollapse */
JsonCellComponent.ctorParameters = () => [
  { type: MatDialog },
  { type: AlfrescoApiService }
];
JsonCellComponent.propDecorators = {
  editable: [{ type: Input }]
};
if (false) {
  /**
   * Editable JSON.
   * @type {?}
   */
  JsonCellComponent.prototype.editable;
  /**
   * @type {?}
   * @private
   */
  JsonCellComponent.prototype.dialog;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRhdGF0YWJsZS9jb21wb25lbnRzL2RhdGF0YWJsZS9qc29uLWNlbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsdUJBQXVCLEVBQTBCLE1BQU0sNkNBQTZDLENBQUM7QUFDOUcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFrQjVFLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxzQkFBc0I7Ozs7O0lBTXpELFlBQ1ksTUFBaUIsRUFDekIsa0JBQXNDO1FBRXRDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBSGxCLFdBQU0sR0FBTixNQUFNLENBQVc7Ozs7UUFIN0IsYUFBUSxHQUFZLEtBQUssQ0FBQztJQU8xQixDQUFDOzs7O0lBRUQsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ2hGO0lBQ0wsQ0FBQzs7OztJQUVELElBQUk7O2NBQ00sUUFBUSxHQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7Y0FDdEYsS0FBSyxHQUFHLE9BQU8sUUFBUSxLQUFLLFFBQVE7WUFDdEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxRQUFROztjQUVSLFFBQVEsR0FBMkI7WUFDckMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN4QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsS0FBSztTQUNSO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDdEMsSUFBSSxFQUFFLFFBQVE7WUFDZCxRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxLQUFLO1NBQ25CLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTOzs7UUFBQyxFQUFDLGtCQUFrQixFQUFFLEVBQUU7WUFDOUMsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7Z0JBQzlCLG9DQUFvQzthQUN2QztpQkFBTTtnQkFDSCxvQ0FBb0M7YUFDdkM7UUFDTCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7OztZQTFESixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxRQUFRLEVBQUU7Ozs7Ozs7O0tBUVQ7Z0JBRUQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSw0QkFBNEIsRUFBRTs7YUFDaEQ7Ozs7WUFuQlEsU0FBUztZQUVULGtCQUFrQjs7O3VCQXFCdEIsS0FBSzs7Ozs7OztJQUFOLHFDQUMwQjs7Ozs7SUFHdEIsbUNBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGFUYWJsZUNlbGxDb21wb25lbnQgfSBmcm9tICcuL2RhdGF0YWJsZS1jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBFZGl0SnNvbkRpYWxvZ0NvbXBvbmVudCwgRWRpdEpzb25EaWFsb2dTZXR0aW5ncyB9IGZyb20gJy4uLy4uLy4uL2RpYWxvZ3MvZWRpdC1qc29uL2VkaXQtanNvbi5kaWFsb2cnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1qc29uLWNlbGwnLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ2YWx1ZSQgfCBhc3luYyBhcyB2YWx1ZTsgZWxzZSBlZGl0RW1wdHlcIj5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LWJ1dHRvbiBjb2xvcj1cInByaW1hcnlcIiAoY2xpY2spPVwidmlldygpXCI+anNvbjwvYnV0dG9uPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgICA8bmctdGVtcGxhdGUgI2VkaXRFbXB0eT5cbiAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJlZGl0YWJsZVwiIG1hdC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgKGNsaWNrKT1cInZpZXcoKVwiPmpzb248L2J1dHRvbj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICBgLFxuICAgIHN0eWxlVXJsczogWycuL2pzb24tY2VsbC5jb21wb25lbnQuc2NzcyddLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDogeyBjbGFzczogJ2FkZi1kYXRhdGFibGUtY29udGVudC1jZWxsJyB9XG59KVxuZXhwb3J0IGNsYXNzIEpzb25DZWxsQ29tcG9uZW50IGV4dGVuZHMgRGF0YVRhYmxlQ2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICAvKiogRWRpdGFibGUgSlNPTi4gKi9cbiAgICBASW5wdXQoKVxuICAgIGVkaXRhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBkaWFsb2c6IE1hdERpYWxvZyxcbiAgICAgICAgYWxmcmVzY29BcGlTZXJ2aWNlOiBBbGZyZXNjb0FwaVNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYWxmcmVzY29BcGlTZXJ2aWNlKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1uICYmIHRoaXMuY29sdW1uLmtleSAmJiB0aGlzLnJvdyAmJiB0aGlzLmRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUkLm5leHQodGhpcy5kYXRhLmdldFZhbHVlKHRoaXMucm93LCB0aGlzLmNvbHVtbiwgdGhpcy5yZXNvbHZlckZuKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aWV3KCkge1xuICAgICAgICBjb25zdCByYXdWYWx1ZTogc3RyaW5nIHwgb2JqZWN0ID0gdGhpcy5kYXRhLmdldFZhbHVlKHRoaXMucm93LCB0aGlzLmNvbHVtbiwgdGhpcy5yZXNvbHZlckZuKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0eXBlb2YgcmF3VmFsdWUgPT09ICdvYmplY3QnXG4gICAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KHJhd1ZhbHVlIHx8IHt9LCBudWxsLCAyKVxuICAgICAgICAgICAgOiByYXdWYWx1ZTtcblxuICAgICAgICBjb25zdCBzZXR0aW5nczogRWRpdEpzb25EaWFsb2dTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmNvbHVtbi50aXRsZSxcbiAgICAgICAgICAgIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlLFxuICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKEVkaXRKc29uRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICAgICAgICBkYXRhOiBzZXR0aW5ncyxcbiAgICAgICAgICAgIG1pbldpZHRoOiAnNTAlJyxcbiAgICAgICAgICAgIG1pbkhlaWdodDogJzUwJSdcbiAgICAgICAgfSkuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKC8qcmVzdWx0OiBzdHJpbmcqLykgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByYXdWYWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAvLyB0b2RvOiB1cGRhdGUgY2VsbCB2YWx1ZSBhcyBvYmplY3RcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdG9kbzogdXBkYXRlIGNlbGwgdmFsdWUgYXMgc3RyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
