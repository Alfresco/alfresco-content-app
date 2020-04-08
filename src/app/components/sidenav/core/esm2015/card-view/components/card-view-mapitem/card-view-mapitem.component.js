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
import { CardViewMapItemModel } from '../../models/card-view-mapitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
export class CardViewMapItemComponent {
  /**
   * @param {?} cardViewUpdateService
   */
  constructor(cardViewUpdateService) {
    this.cardViewUpdateService = cardViewUpdateService;
    this.displayEmpty = true;
  }
  /**
   * @return {?}
   */
  showProperty() {
    return this.displayEmpty || !this.property.isEmpty();
  }
  /**
   * @return {?}
   */
  isClickable() {
    return this.property.clickable;
  }
  /**
   * @return {?}
   */
  clicked() {
    this.cardViewUpdateService.clicked(this.property);
  }
}
CardViewMapItemComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view-mapitem',
        template:
          '<div [attr.data-automation-id]="\'card-mapitem-label-\' + property.key" class="adf-property-label" *ngIf="showProperty()">{{ property.label | translate }}</div>\n<div class="adf-property-value">\n    <div>\n        <span *ngIf="!isClickable(); else elseBlock" [attr.data-automation-id]="\'card-mapitem-value-\' + property.key">\n            <span *ngIf="showProperty();">{{ property.displayValue }}</span>\n        </span>\n        <ng-template #elseBlock>\n            <span class="adf-mapitem-clickable-value" (click)="clicked()" [attr.data-automation-id]="\'card-mapitem-value-\' + property.key">\n                <span *ngIf="showProperty(); else elseEmptyValueBlock">{{ property.displayValue }}</span>\n            </span>\n        </ng-template>\n    </div>\n    <ng-template #elseEmptyValueBlock>\n        {{ property.default | translate }}\n    </ng-template>\n</div>\n',
        styles: ['.adf-mapitem-clickable-value{cursor:pointer!important}']
      }
    ]
  }
];
/** @nocollapse */
CardViewMapItemComponent.ctorParameters = () => [
  { type: CardViewUpdateService }
];
CardViewMapItemComponent.propDecorators = {
  property: [{ type: Input }],
  displayEmpty: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  CardViewMapItemComponent.prototype.property;
  /** @type {?} */
  CardViewMapItemComponent.prototype.displayEmpty;
  /**
   * @type {?}
   * @private
   */
  CardViewMapItemComponent.prototype.cardViewUpdateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LW1hcGl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L2NvbXBvbmVudHMvY2FyZC12aWV3LW1hcGl0ZW0vY2FyZC12aWV3LW1hcGl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBUWhGLE1BQU0sT0FBTyx3QkFBd0I7Ozs7SUFPakMsWUFBb0IscUJBQTRDO1FBQTVDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFGaEUsaUJBQVksR0FBWSxJQUFJLENBQUM7SUFFc0MsQ0FBQzs7OztJQUVwRSxZQUFZO1FBQ1IsT0FBTyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN6RCxDQUFDOzs7O0lBRUQsV0FBVztRQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7SUFDbkMsQ0FBQzs7OztJQUVELE9BQU87UUFDSCxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDOzs7WUF6QkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLHk0QkFBaUQ7O2FBRXBEOzs7O1lBTlEscUJBQXFCOzs7dUJBU3pCLEtBQUs7MkJBR0wsS0FBSzs7OztJQUhOLDRDQUMrQjs7SUFFL0IsZ0RBQzZCOzs7OztJQUVqQix5REFBb0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJkVmlld01hcEl0ZW1Nb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJkLXZpZXctbWFwaXRlbS5tb2RlbCc7XG5pbXBvcnQgeyBDYXJkVmlld1VwZGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jYXJkLXZpZXctdXBkYXRlLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1jYXJkLXZpZXctbWFwaXRlbScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NhcmQtdmlldy1tYXBpdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jYXJkLXZpZXctbWFwaXRlbS5jb21wb25lbnQuc2NzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgQ2FyZFZpZXdNYXBJdGVtQ29tcG9uZW50IHtcbiAgICBASW5wdXQoKVxuICAgIHByb3BlcnR5OiBDYXJkVmlld01hcEl0ZW1Nb2RlbDtcblxuICAgIEBJbnB1dCgpXG4gICAgZGlzcGxheUVtcHR5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FyZFZpZXdVcGRhdGVTZXJ2aWNlOiBDYXJkVmlld1VwZGF0ZVNlcnZpY2UpIHt9XG5cbiAgICBzaG93UHJvcGVydHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlFbXB0eSB8fCAhdGhpcy5wcm9wZXJ0eS5pc0VtcHR5KCk7XG4gICAgfVxuXG4gICAgaXNDbGlja2FibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnR5LmNsaWNrYWJsZTtcbiAgICB9XG5cbiAgICBjbGlja2VkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhcmRWaWV3VXBkYXRlU2VydmljZS5jbGlja2VkKHRoaXMucHJvcGVydHkpO1xuICAgIH1cbn1cbiJdfQ==
