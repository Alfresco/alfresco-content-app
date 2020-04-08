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
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { Observable } from 'rxjs';
export class CardViewSelectItemComponent {
  /**
   * @param {?} cardViewUpdateService
   */
  constructor(cardViewUpdateService) {
    this.cardViewUpdateService = cardViewUpdateService;
    this.editable = false;
    this.displayNoneOption = true;
  }
  /**
   * @return {?}
   */
  ngOnChanges() {
    this.value = this.property.value;
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
  getOptions() {
    return this.options$ || this.property.options$;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onChange(event) {
    /** @type {?} */
    const selectedOption = event.value !== undefined ? event.value : null;
    this.cardViewUpdateService.update(this.property, selectedOption);
    this.property.value = selectedOption;
  }
  /**
   * @return {?}
   */
  showNoneOption() {
    return this.displayNoneOption;
  }
}
CardViewSelectItemComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view-selectitem',
        template:
          '<div [attr.data-automation-id]="\'card-select-label-\' + property.key" class="adf-property-label">{{ property.label | translate }}</div>\n<div class="adf-property-value">\n    <div *ngIf="!isEditable()" data-automation-class="read-only-value">{{ property.displayValue | async }}</div>\n    <div *ngIf="isEditable()">\n        <mat-form-field>\n            <mat-select [(value)]="value" (selectionChange)="onChange($event)" data-automation-class="select-box">\n              <mat-option *ngIf="showNoneOption()">{{ \'CORE.CARDVIEW.NONE\' | translate }}</mat-option>\n              <mat-option *ngFor="let option of getOptions() | async" [value]="option.key">\n                {{ option.label | translate }}\n              </mat-option>\n            </mat-select>\n          </mat-form-field>\n    </div>\n</div>\n',
        styles: ['.mat-form-field-type-mat-select{width:100%}']
      }
    ]
  }
];
/** @nocollapse */
CardViewSelectItemComponent.ctorParameters = () => [
  { type: CardViewUpdateService }
];
CardViewSelectItemComponent.propDecorators = {
  property: [{ type: Input }],
  editable: [{ type: Input }],
  options$: [{ type: Input }],
  displayNoneOption: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  CardViewSelectItemComponent.prototype.property;
  /** @type {?} */
  CardViewSelectItemComponent.prototype.editable;
  /** @type {?} */
  CardViewSelectItemComponent.prototype.options$;
  /** @type {?} */
  CardViewSelectItemComponent.prototype.displayNoneOption;
  /** @type {?} */
  CardViewSelectItemComponent.prototype.value;
  /**
   * @type {?}
   * @private
   */
  CardViewSelectItemComponent.prototype.cardViewUpdateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LXNlbGVjdGl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L2NvbXBvbmVudHMvY2FyZC12aWV3LXNlbGVjdGl0ZW0vY2FyZC12aWV3LXNlbGVjdGl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFTbEMsTUFBTSxPQUFPLDJCQUEyQjs7OztJQVlwQyxZQUFvQixxQkFBNEM7UUFBNUMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQVR2RCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBS25DLHNCQUFpQixHQUFZLElBQUksQ0FBQztJQUlpQyxDQUFDOzs7O0lBRXBFLFdBQVc7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3JDLENBQUM7Ozs7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ25ELENBQUM7Ozs7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ25ELENBQUM7Ozs7O0lBRUQsUUFBUSxDQUFDLEtBQXNCOztjQUNyQixjQUFjLEdBQUcsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDckUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztJQUN6QyxDQUFDOzs7O0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2xDLENBQUM7OztZQXZDSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsNDBCQUFvRDs7YUFFdkQ7Ozs7WUFUUSxxQkFBcUI7Ozt1QkFXekIsS0FBSzt1QkFFTCxLQUFLO3VCQUVMLEtBQUs7Z0NBRUwsS0FBSzs7OztJQU5OLCtDQUFtRDs7SUFFbkQsK0NBQW1DOztJQUVuQywrQ0FBa0U7O0lBRWxFLHdEQUNrQzs7SUFFbEMsNENBQWM7Ozs7O0lBRUYsNERBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJkVmlld1NlbGVjdEl0ZW1Nb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJkLXZpZXctc2VsZWN0aXRlbS5tb2RlbCc7XG5pbXBvcnQgeyBDYXJkVmlld1VwZGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jYXJkLXZpZXctdXBkYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FyZFZpZXdTZWxlY3RJdGVtT3B0aW9uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jYXJkLXZpZXcuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNYXRTZWxlY3RDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWNhcmQtdmlldy1zZWxlY3RpdGVtJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2FyZC12aWV3LXNlbGVjdGl0ZW0uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2NhcmQtdmlldy1zZWxlY3RpdGVtLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ2FyZFZpZXdTZWxlY3RJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgICBASW5wdXQoKSBwcm9wZXJ0eTogQ2FyZFZpZXdTZWxlY3RJdGVtTW9kZWw8c3RyaW5nPjtcblxuICAgIEBJbnB1dCgpIGVkaXRhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBvcHRpb25zJDogT2JzZXJ2YWJsZTxDYXJkVmlld1NlbGVjdEl0ZW1PcHRpb248c3RyaW5nPltdPjtcblxuICAgIEBJbnB1dCgpXG4gICAgZGlzcGxheU5vbmVPcHRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FyZFZpZXdVcGRhdGVTZXJ2aWNlOiBDYXJkVmlld1VwZGF0ZVNlcnZpY2UpIHt9XG5cbiAgICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMucHJvcGVydHkudmFsdWU7XG4gICAgfVxuXG4gICAgaXNFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdGFibGUgJiYgdGhpcy5wcm9wZXJ0eS5lZGl0YWJsZTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKCk6IE9ic2VydmFibGU8Q2FyZFZpZXdTZWxlY3RJdGVtT3B0aW9uPHN0cmluZz5bXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zJCB8fCB0aGlzLnByb3BlcnR5Lm9wdGlvbnMkO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGV2ZW50OiBNYXRTZWxlY3RDaGFuZ2UpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSBldmVudC52YWx1ZSAhPT0gdW5kZWZpbmVkID8gZXZlbnQudmFsdWUgOiBudWxsO1xuICAgICAgICB0aGlzLmNhcmRWaWV3VXBkYXRlU2VydmljZS51cGRhdGUodGhpcy5wcm9wZXJ0eSwgc2VsZWN0ZWRPcHRpb24pO1xuICAgICAgICB0aGlzLnByb3BlcnR5LnZhbHVlID0gc2VsZWN0ZWRPcHRpb247XG4gICAgfVxuXG4gICAgc2hvd05vbmVPcHRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlOb25lT3B0aW9uO1xuICAgIH1cbn1cbiJdfQ==
