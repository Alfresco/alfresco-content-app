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
import { Component, Input } from '@angular/core';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewKeyValuePairsItemModel } from '../../models/card-view.models';
import { MatTableDataSource } from '@angular/material';
export class CardViewKeyValuePairsItemComponent {
  /**
   * @param {?} cardViewUpdateService
   */
  constructor(cardViewUpdateService) {
    this.cardViewUpdateService = cardViewUpdateService;
    this.editable = false;
  }
  /**
   * @return {?}
   */
  ngOnChanges() {
    this.values = this.property.value || [];
    this.matTableValues = new MatTableDataSource(this.values);
  }
  /**
   * @return {?}
   */
  isEditable() {
    return this.editable && this.property.editable;
  }
  /**
   * @return {?}
   */
  add() {
    this.values.push({ name: '', value: '' });
  }
  /**
   * @param {?} index
   * @return {?}
   */
  remove(index) {
    this.values.splice(index, 1);
    this.save(true);
  }
  /**
   * @param {?} value
   * @return {?}
   */
  onBlur(value) {
    if (value.length) {
      this.save();
    }
  }
  /**
   * @param {?=} remove
   * @return {?}
   */
  save(remove) {
    /** @type {?} */
    const validValues = this.values.filter(
      /**
       * @param {?} i
       * @return {?}
       */
      (i => i.name.length && i.value.length)
    );
    if (remove || validValues.length) {
      this.cardViewUpdateService.update(this.property, validValues);
      this.property.value = validValues;
    }
  }
}
CardViewKeyValuePairsItemComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view-boolitem',
        template:
          '<div [attr.data-automation-id]="\'card-key-value-pairs-label-\' + property.key" class="adf-property-label">{{ property.label | translate }}</div>\n<div class="adf-property-value">\n\n    <div *ngIf="isEditable()">\n        {{ \'CORE.CARDVIEW.KEYVALUEPAIRS.ADD\' | translate }}\n        <button (click)="add()" mat-icon-button class="adf-card-view__key-value-pairs__add-btn" [attr.data-automation-id]="\'card-key-value-pairs-button-\' + property.key">\n            <mat-icon>add</mat-icon>\n        </button>\n    </div>\n\n    <div *ngIf="!isEditable()" class="adf-card-view__key-value-pairs__read-only">\n        <mat-table #table [dataSource]="matTableValues" class="mat-elevation-z8">\n            <ng-container matColumnDef="name">\n                <mat-header-cell *matHeaderCellDef>{{ \'CORE.CARDVIEW.KEYVALUEPAIRS.NAME\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let item">{{item.name}}</mat-cell>\n            </ng-container>\n            <ng-container matColumnDef="value">\n                <mat-header-cell *matHeaderCellDef>{{ \'CORE.CARDVIEW.KEYVALUEPAIRS.VALUE\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let item">{{item.value}}</mat-cell>\n            </ng-container>\n\n            <mat-header-row *matHeaderRowDef="[\'name\', \'value\']"></mat-header-row>\n            <mat-row *matRowDef="let row; columns: [\'name\', \'value\'];"></mat-row>\n        </mat-table>\n    </div>\n\n\n    <div class="adf-card-view__key-value-pairs" *ngIf="isEditable() && values && values.length">\n        <div class="adf-card-view__key-value-pairs__row">\n            <div class="adf-card-view__key-value-pairs__col">{{ \'CORE.CARDVIEW.KEYVALUEPAIRS.NAME\' | translate }}</div>\n            <div class="adf-card-view__key-value-pairs__col">{{ \'CORE.CARDVIEW.KEYVALUEPAIRS.VALUE\' | translate }}</div>\n        </div>\n\n        <div class="adf-card-view__key-value-pairs__row" *ngFor="let item of values; let i = index">\n            <div class="adf-card-view__key-value-pairs__col">\n                <mat-form-field class="adf-example-full-width">\n                    <input matInput\n                           placeholder="{{ \'CORE.CARDVIEW.KEYVALUEPAIRS.NAME\' | translate }}"\n                           (blur)="onBlur(item.value)"\n                           [attr.data-automation-id]="\'card-\'+ property.key +\'-name-input-\' + i"\n                           [(ngModel)]="values[i].name">\n                </mat-form-field>\n            </div>\n            <div class="adf-card-view__key-value-pairs__col">\n                <mat-form-field class="adf-example-full-width">\n                    <input matInput\n                           placeholder="{{ \'CORE.CARDVIEW.KEYVALUEPAIRS.VALUE\' | translate }}"\n                           (blur)="onBlur(item.value)"\n                           [attr.data-automation-id]="\'card-\'+ property.key +\'-value-input-\' + i"\n                           [(ngModel)]="values[i].value">\n                </mat-form-field>\n            </div>\n            <button mat-icon-button (click)="remove(i)" class="adf-card-view__key-value-pairs__remove-btn">\n                <mat-icon>close</mat-icon>\n            </button>\n        </div>\n    </div>\n</div>\n',
        styles: [
          '.adf-card-view__key-value-pairs__col{display:inline-block;width:39%}.adf-card-view__key-value-pairs__col .mat-form-field{width:100%}.adf-card-view__key-value-pairs__read-only .mat-table{box-shadow:none}.adf-card-view__key-value-pairs__read-only .mat-header-row,.adf-card-view__key-value-pairs__read-only .mat-row{padding:0}'
        ]
      }
    ]
  }
];
/** @nocollapse */
CardViewKeyValuePairsItemComponent.ctorParameters = () => [
  { type: CardViewUpdateService }
];
CardViewKeyValuePairsItemComponent.propDecorators = {
  property: [{ type: Input }],
  editable: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  CardViewKeyValuePairsItemComponent.prototype.property;
  /** @type {?} */
  CardViewKeyValuePairsItemComponent.prototype.editable;
  /** @type {?} */
  CardViewKeyValuePairsItemComponent.prototype.values;
  /** @type {?} */
  CardViewKeyValuePairsItemComponent.prototype.matTableValues;
  /**
   * @type {?}
   * @private
   */
  CardViewKeyValuePairsItemComponent.prototype.cardViewUpdateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWtleXZhbHVlcGFpcnNpdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9jb21wb25lbnRzL2NhcmQtdmlldy1rZXl2YWx1ZXBhaXJzaXRlbS9jYXJkLXZpZXcta2V5dmFsdWVwYWlyc2l0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRS9FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBUXZELE1BQU0sT0FBTyxrQ0FBa0M7Ozs7SUFXM0MsWUFBb0IscUJBQTRDO1FBQTVDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFMaEUsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUt5QyxDQUFDOzs7O0lBRXBFLFdBQVc7UUFDUCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELENBQUM7Ozs7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ25ELENBQUM7Ozs7SUFFRCxHQUFHO1FBQ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLEtBQWE7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsS0FBSztRQUNSLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNmO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxJQUFJLENBQUMsTUFBZ0I7O2NBQ1gsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQztRQUU5RSxJQUFJLE1BQU0sSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7U0FDckM7SUFDTCxDQUFDOzs7WUFsREosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLHd2R0FBMkQ7O2FBRTlEOzs7O1lBVFEscUJBQXFCOzs7dUJBYXpCLEtBQUs7dUJBR0wsS0FBSzs7OztJQUhOLHNEQUN5Qzs7SUFFekMsc0RBQzBCOztJQUUxQixvREFBd0M7O0lBQ3hDLDREQUFrRTs7Ozs7SUFFdEQsbUVBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJkVmlld1VwZGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jYXJkLXZpZXctdXBkYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbU1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NhcmQtdmlldy5tb2RlbHMnO1xuaW1wb3J0IHsgQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbVR5cGUgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhcmQtdmlldy5pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1hdFRhYmxlRGF0YVNvdXJjZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtY2FyZC12aWV3LWJvb2xpdGVtJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2FyZC12aWV3LWtleXZhbHVlcGFpcnNpdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jYXJkLXZpZXcta2V5dmFsdWVwYWlyc2l0ZW0uY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIENhcmRWaWV3S2V5VmFsdWVQYWlyc0l0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KClcbiAgICBwcm9wZXJ0eTogQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbU1vZGVsO1xuXG4gICAgQElucHV0KClcbiAgICBlZGl0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgdmFsdWVzOiBDYXJkVmlld0tleVZhbHVlUGFpcnNJdGVtVHlwZVtdO1xuICAgIG1hdFRhYmxlVmFsdWVzOiBNYXRUYWJsZURhdGFTb3VyY2U8Q2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbVR5cGU+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYXJkVmlld1VwZGF0ZVNlcnZpY2U6IENhcmRWaWV3VXBkYXRlU2VydmljZSkge31cblxuICAgIG5nT25DaGFuZ2VzKCkge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHRoaXMucHJvcGVydHkudmFsdWUgfHwgW107XG4gICAgICAgIHRoaXMubWF0VGFibGVWYWx1ZXMgPSBuZXcgTWF0VGFibGVEYXRhU291cmNlKHRoaXMudmFsdWVzKTtcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSAmJiB0aGlzLnByb3BlcnR5LmVkaXRhYmxlO1xuICAgIH1cblxuICAgIGFkZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh7IG5hbWU6ICcnLCB2YWx1ZTogJycgfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5zYXZlKHRydWUpO1xuICAgIH1cblxuICAgIG9uQmx1cih2YWx1ZSk6IHZvaWQge1xuICAgICAgICBpZiAodmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmUocmVtb3ZlPzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCB2YWxpZFZhbHVlcyA9IHRoaXMudmFsdWVzLmZpbHRlcigoaSkgPT4gaS5uYW1lLmxlbmd0aCAmJiBpLnZhbHVlLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKHJlbW92ZSB8fCB2YWxpZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZFZpZXdVcGRhdGVTZXJ2aWNlLnVwZGF0ZSh0aGlzLnByb3BlcnR5LCB2YWxpZFZhbHVlcyk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5LnZhbHVlID0gdmFsaWRWYWx1ZXM7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
