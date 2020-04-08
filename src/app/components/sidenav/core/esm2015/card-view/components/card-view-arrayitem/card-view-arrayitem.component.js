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
import { CardViewArrayItemModel } from '../../models/card-view-arrayitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
export class CardViewArrayItemComponent {
  /**
   * @param {?} cardViewUpdateService
   */
  constructor(cardViewUpdateService) {
    this.cardViewUpdateService = cardViewUpdateService;
  }
  /**
   * @return {?}
   */
  clicked() {
    if (this.isClickable()) {
      this.cardViewUpdateService.clicked(this.property);
    }
  }
  /**
   * @return {?}
   */
  showClickableIcon() {
    return this.hasIcon() && this.isClickable();
  }
  /**
   * @return {?}
   */
  hasIcon() {
    return !!this.property.icon;
  }
  /**
   * @return {?}
   */
  displayCount() {
    return this.property.noOfItemsToDisplay
      ? this.property.noOfItemsToDisplay
      : 0;
  }
  /**
   * @return {?}
   */
  isClickable() {
    return !!this.property.clickable;
  }
}
CardViewArrayItemComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view-arrayitem',
        template:
          '<div [attr.data-automation-id]="\'card-array-label-\' + property.key" class="adf-property-label">{{ property.label | translate }}</div>\n<div class="adf-property-value adf-card-view-array-item-container" (click)="clicked()">\n    <ng-container *ngIf="(property.displayValue | async) as items; else elseEmptyValueBlock">\n        <mat-chip-list *ngIf="items.length > 0; else elseEmptyValueBlock" data-automation-id="card-arrayitem-chip-list-container">\n            <ng-container *ngIf="displayCount() > 0; else withOutDisplayCount" >\n                <mat-chip\n                    *ngFor="let item of items.slice(0, displayCount())"\n                    (click)="clicked()"\n                    [attr.data-automation-id]="\'card-arrayitem-chip-\' + item.value">\n                    <mat-icon *ngIf="item?.icon" class="adf-array-item-icon">{{item.icon}}</mat-icon>\n                    <span>{{item?.value}}</span>\n                </mat-chip>\n                <mat-chip\n                    *ngIf="items.length > displayCount()"\n                    data-automation-id="card-arrayitem-more-chip"\n                    [matMenuTriggerFor]="menu">\n                    <span>{{items.length - displayCount()}} {{\'CORE.CARDVIEW.MORE\' | translate}}</span>\n                </mat-chip>\n            </ng-container>\n            <ng-template #withOutDisplayCount>\n                <mat-chip\n                    *ngFor="let item of items"\n                    (click)="clicked()"\n                    [attr.data-automation-id]="\'card-arrayitem-chip-\' + item.value">\n                    <mat-icon *ngIf="item?.icon" class="adf-array-item-icon">{{item.icon}}</mat-icon>\n                    <span>{{item?.value}}</span>\n                </mat-chip>\n            </ng-template>\n        </mat-chip-list>\n        <mat-menu #menu="matMenu">\n            <mat-card class="adf-array-item-more-chip-container">\n                <mat-card-content>\n                    <mat-chip-list>\n                        <mat-chip (click)="clicked()"\n                            *ngFor="let item of items.slice(displayCount(), items.length)"\n                            [attr.data-automation-id]="\'card-arrayitem-chip-\' + item.value">\n                        <mat-icon *ngIf="item?.icon" class="adf-array-item-icon">{{item.icon}}</mat-icon>\n                        <span>{{item?.value}}</span>\n                        </mat-chip>\n                    </mat-chip-list>\n                </mat-card-content>\n            </mat-card>\n        </mat-menu>\n    </ng-container>\n    <ng-template #elseEmptyValueBlock>\n        <span class="adf-card-array-item-default" data-automation-id="card-arrayitem-default">{{ property?.default | translate }}</span>\n    </ng-template>\n    <button mat-icon-button *ngIf="showClickableIcon()"\n        class="adf-array-item-action"\n        [attr.aria-label]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n        [attr.title]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n        [attr.data-automation-id]="\'card-array-item-clickable-icon-\' + property.key">\n        <mat-icon class="adf-array-item-icon">{{property.icon}}</mat-icon>\n    </button>\n</div>\n',
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
CardViewArrayItemComponent.ctorParameters = () => [
  { type: CardViewUpdateService }
];
CardViewArrayItemComponent.propDecorators = {
  property: [{ type: Input }]
};
if (false) {
  /**
   * The CardViewArrayItemModel of data used to populate the cardView array items.
   * @type {?}
   */
  CardViewArrayItemComponent.prototype.property;
  /**
   * @type {?}
   * @private
   */
  CardViewArrayItemComponent.prototype.cardViewUpdateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWFycmF5aXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJjYXJkLXZpZXcvY29tcG9uZW50cy9jYXJkLXZpZXctYXJyYXlpdGVtL2NhcmQtdmlldy1hcnJheWl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBT2hGLE1BQU0sT0FBTywwQkFBMEI7Ozs7SUFNbkMsWUFBb0IscUJBQTRDO1FBQTVDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7SUFBRyxDQUFDOzs7O0lBRXBFLE9BQU87UUFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNwQixJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNyRDtJQUNMLENBQUM7Ozs7SUFFRCxpQkFBaUI7UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEQsQ0FBQzs7OztJQUVELE9BQU87UUFDSCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNoQyxDQUFDOzs7O0lBRUQsWUFBWTtRQUNSLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25GLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1AsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7SUFDckMsQ0FBQzs7O1lBakNKLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxpckdBQW1EOzthQUVwRDs7OztZQU5RLHFCQUFxQjs7O3VCQVV6QixLQUFLOzs7Ozs7O0lBQU4sOENBQ2lDOzs7OztJQUVyQiwyREFBb0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJkVmlld0FycmF5SXRlbU1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NhcmQtdmlldy1hcnJheWl0ZW0ubW9kZWwnO1xuaW1wb3J0IHsgQ2FyZFZpZXdVcGRhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2FyZC12aWV3LXVwZGF0ZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWRmLWNhcmQtdmlldy1hcnJheWl0ZW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FyZC12aWV3LWFycmF5aXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NhcmQtdmlldy1hcnJheWl0ZW0uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDYXJkVmlld0FycmF5SXRlbUNvbXBvbmVudCB7XG5cbiAgICAvKiogVGhlIENhcmRWaWV3QXJyYXlJdGVtTW9kZWwgb2YgZGF0YSB1c2VkIHRvIHBvcHVsYXRlIHRoZSBjYXJkVmlldyBhcnJheSBpdGVtcy4gKi9cbiAgICBASW5wdXQoKVxuICAgIHByb3BlcnR5OiBDYXJkVmlld0FycmF5SXRlbU1vZGVsO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYXJkVmlld1VwZGF0ZVNlcnZpY2U6IENhcmRWaWV3VXBkYXRlU2VydmljZSkge31cblxuICAgIGNsaWNrZWQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2xpY2thYmxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZFZpZXdVcGRhdGVTZXJ2aWNlLmNsaWNrZWQodGhpcy5wcm9wZXJ0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93Q2xpY2thYmxlSWNvbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzSWNvbigpICYmIHRoaXMuaXNDbGlja2FibGUoKTtcbiAgICB9XG5cbiAgICBoYXNJY29uKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLnByb3BlcnR5Lmljb247XG4gICAgfVxuXG4gICAgZGlzcGxheUNvdW50KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnR5Lm5vT2ZJdGVtc1RvRGlzcGxheSA/IHRoaXMucHJvcGVydHkubm9PZkl0ZW1zVG9EaXNwbGF5IDogMDtcbiAgICB9XG5cbiAgICBpc0NsaWNrYWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5wcm9wZXJ0eS5jbGlja2FibGU7XG4gICAgfVxufVxuIl19
