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
import { CardViewBoolItemModel } from '../../models/card-view-boolitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
export class CardViewBoolItemComponent {
  /**
   * @param {?} cardViewUpdateService
   */
  constructor(cardViewUpdateService) {
    this.cardViewUpdateService = cardViewUpdateService;
  }
  /**
   * @return {?}
   */
  isEditable() {
    return this.editable && this.property.editable;
  }
  /**
   * @param {?} change
   * @return {?}
   */
  changed(change) {
    this.cardViewUpdateService.update(this.property, change.checked);
    this.property.value = change.checked;
  }
}
CardViewBoolItemComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view-boolitem',
        template:
          '<ng-container *ngIf="!property.isEmpty() || isEditable()">\n    <div [attr.data-automation-id]="\'card-boolean-label-\' + property.key" class="adf-property-label">{{ property.label | translate }}</div>\n    <div class="adf-property-value">\n        <mat-checkbox\n            [attr.data-automation-id]="\'card-boolean-\' + property.key"\n            [attr.title]="\'CORE.METADATA.ACTIONS.TOGGLE\' | translate"\n            [checked]="property.displayValue"\n            [disabled]="!isEditable()"\n            (change)="changed($event)">\n        </mat-checkbox>\n    </div>\n</ng-container>\n',
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
CardViewBoolItemComponent.ctorParameters = () => [
  { type: CardViewUpdateService }
];
CardViewBoolItemComponent.propDecorators = {
  property: [{ type: Input }],
  editable: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  CardViewBoolItemComponent.prototype.property;
  /** @type {?} */
  CardViewBoolItemComponent.prototype.editable;
  /**
   * @type {?}
   * @private
   */
  CardViewBoolItemComponent.prototype.cardViewUpdateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWJvb2xpdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9jb21wb25lbnRzL2NhcmQtdmlldy1ib29saXRlbS9jYXJkLXZpZXctYm9vbGl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWpELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBUWhGLE1BQU0sT0FBTyx5QkFBeUI7Ozs7SUFRbEMsWUFBb0IscUJBQTRDO1FBQTVDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7SUFBRyxDQUFDOzs7O0lBRXBFLFVBQVU7UUFDTixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDbkQsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsTUFBeUI7UUFDN0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUUsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ3pDLENBQUM7OztZQXZCSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMseW1CQUFrRDs7YUFFckQ7Ozs7WUFOUSxxQkFBcUI7Ozt1QkFVekIsS0FBSzt1QkFHTCxLQUFLOzs7O0lBSE4sNkNBQ2dDOztJQUVoQyw2Q0FDa0I7Ozs7O0lBRU4sMERBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0Q2hlY2tib3hDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBDYXJkVmlld0Jvb2xJdGVtTW9kZWwgfSBmcm9tICcuLi8uLi9tb2RlbHMvY2FyZC12aWV3LWJvb2xpdGVtLm1vZGVsJztcbmltcG9ydCB7IENhcmRWaWV3VXBkYXRlU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NhcmQtdmlldy11cGRhdGUuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWNhcmQtdmlldy1ib29saXRlbScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NhcmQtdmlldy1ib29saXRlbS5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2FyZC12aWV3LWJvb2xpdGVtLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBDYXJkVmlld0Jvb2xJdGVtQ29tcG9uZW50IHtcblxuICAgIEBJbnB1dCgpXG4gICAgcHJvcGVydHk6IENhcmRWaWV3Qm9vbEl0ZW1Nb2RlbDtcblxuICAgIEBJbnB1dCgpXG4gICAgZWRpdGFibGU6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhcmRWaWV3VXBkYXRlU2VydmljZTogQ2FyZFZpZXdVcGRhdGVTZXJ2aWNlKSB7fVxuXG4gICAgaXNFZGl0YWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdGFibGUgJiYgdGhpcy5wcm9wZXJ0eS5lZGl0YWJsZTtcbiAgICB9XG5cbiAgICBjaGFuZ2VkKGNoYW5nZTogTWF0Q2hlY2tib3hDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5jYXJkVmlld1VwZGF0ZVNlcnZpY2UudXBkYXRlKHRoaXMucHJvcGVydHksIGNoYW5nZS5jaGVja2VkICk7XG4gICAgICAgIHRoaXMucHJvcGVydHkudmFsdWUgPSBjaGFuZ2UuY2hlY2tlZDtcbiAgICB9XG59XG4iXX0=
