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
import { Component, Input, ViewChild } from '@angular/core';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { AppConfigService } from '../../../app-config/app-config.service';
export class CardViewTextItemComponent {
  /**
   * @param {?} cardViewUpdateService
   * @param {?} appConfig
   */
  constructor(cardViewUpdateService, appConfig) {
    this.cardViewUpdateService = cardViewUpdateService;
    this.appConfig = appConfig;
    this.editable = false;
    this.displayEmpty = true;
    this.inEdit = false;
    this.valueSeparator =
      this.appConfig.get('content-metadata.multi-value-pipe-separator') ||
      CardViewTextItemComponent.DEFAULT_SEPARATOR;
  }
  /**
   * @return {?}
   */
  ngOnChanges() {
    this.editedValue = this.property.multiline
      ? this.property.displayValue
      : this.property.value;
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
  showClickableIcon() {
    return this.hasIcon() && this.editable;
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
  isClickable() {
    return !!this.property.clickable;
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
  hasErrors() {
    return this.errorMessages && this.errorMessages.length > 0;
  }
  /**
   * @param {?} editStatus
   * @return {?}
   */
  setEditMode(editStatus) {
    this.inEdit = editStatus;
    setTimeout(
      /**
       * @return {?}
       */
      () => {
        if (this.editorInput) {
          this.editorInput.nativeElement.click();
        }
      },
      0
    );
  }
  /**
   * @param {?} event
   * @return {?}
   */
  reset(event) {
    event.stopPropagation();
    this.editedValue = this.property.multiline
      ? this.property.displayValue
      : this.property.value;
    this.setEditMode(false);
    this.resetErrorMessages();
  }
  /**
   * @private
   * @return {?}
   */
  resetErrorMessages() {
    this.errorMessages = [];
  }
  /**
   * @param {?} event
   * @return {?}
   */
  update(event) {
    event.stopPropagation();
    if (this.property.isValid(this.editedValue)) {
      /** @type {?} */
      const updatedValue = this.prepareValueForUpload(
        this.property,
        this.editedValue
      );
      this.cardViewUpdateService.update(this.property, updatedValue);
      this.property.value = updatedValue;
      this.setEditMode(false);
      this.resetErrorMessages();
    } else {
      this.errorMessages = this.property.getValidationErrors(this.editedValue);
    }
  }
  /**
   * @param {?} property
   * @param {?} value
   * @return {?}
   */
  prepareValueForUpload(property, value) {
    if (property.multivalued) {
      /** @type {?} */
      const listOfValues = value.split(this.valueSeparator.trim()).map(
        /**
         * @param {?} item
         * @return {?}
         */
        (item => item.trim())
      );
      return listOfValues;
    }
    return value;
  }
  /**
   * @return {?}
   */
  onTextAreaInputChange() {
    this.errorMessages = this.property.getValidationErrors(this.editedValue);
  }
  /**
   * @return {?}
   */
  clicked() {
    if (typeof this.property.clickCallBack === 'function') {
      this.property.clickCallBack();
    } else {
      this.cardViewUpdateService.clicked(this.property);
    }
  }
}
CardViewTextItemComponent.DEFAULT_SEPARATOR = ', ';
CardViewTextItemComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view-textitem',
        template:
          '<div [attr.data-automation-id]="\'card-textitem-label-\' + property.key" class="adf-property-label" *ngIf="showProperty() || isEditable()">{{ property.label | translate }}</div>\n<div class="adf-property-value">\n    <span *ngIf="!isEditable()">\n        <span *ngIf="!isClickable(); else elseBlock" [attr.data-automation-id]="\'card-textitem-value-\' + property.key">\n            <span *ngIf="showProperty()"\n                [ngClass]="property.multiline?\'adf-textitem-multiline\':\'adf-textitem-scroll\'">\n                {{ property.displayValue }}</span>\n        </span>\n        <ng-template #elseBlock>\n            <div role="button" class="adf-textitem-clickable" [attr.data-automation-id]="\'card-textitem-toggle-\' + property.key" (click)="clicked()" fxLayout="row" fxLayoutAlign="space-between center">\n                <span class="adf-textitem-clickable-value" [attr.data-automation-id]="\'card-textitem-value-\' + property.key">\n                    <span *ngIf="showProperty(); else elseEmptyValueBlock">{{ property.displayValue }}</span>\n                </span>\n                <button mat-icon-button fxFlex="0 0 auto" *ngIf="showClickableIcon()"\n                    class="adf-textitem-action"\n                    [attr.aria-label]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n                    [attr.title]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n                    [attr.data-automation-id]="\'card-textitem-clickable-icon-\' + property.key">\n\n                    <mat-icon class="adf-textitem-icon">{{property?.icon}}</mat-icon>\n                </button>\n            </div>\n        </ng-template>\n    </span>\n    <span *ngIf="isEditable()">\n        <div *ngIf="!inEdit" role="button"\n            tabindex="0"\n            [attr.aria-label]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n            (click)="setEditMode(true)"\n            (keydown.enter)="setEditMode(true)"\n            class="adf-textitem-readonly"\n            [attr.data-automation-id]="\'card-textitem-toggle-\' + property.key"\n            fxLayout="row" fxLayoutAlign="space-between center">\n            <span [attr.data-automation-id]="\'card-textitem-value-\' + property.key">\n                <span *ngIf="showProperty(); else elseEmptyValueBlock">{{ property.displayValue }}</span>\n            </span>\n\n            <button mat-icon-button fxFlex="0 0 auto"\n                class="adf-textitem-action"\n                [attr.aria-label]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n                [attr.title]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n                [attr.data-automation-id]="\'card-textitem-edit-icon-\' + property.key">\n\n                <mat-icon class="adf-textitem-icon"> create</mat-icon>\n            </button>\n        </div>\n        <div *ngIf="inEdit" class="adf-textitem-editable">\n            <div class="adf-textitem-editable-controls">\n                <mat-form-field floatPlaceholder="never" class="adf-input-container">\n                    <input *ngIf="!property.multiline" #editorInput\n                           (keydown.escape)="reset($event)"\n                           (keydown.enter)="update($event)"\n                        matInput\n                        class="adf-input"\n                        [placeholder]="property.default | translate"\n                        [(ngModel)]="editedValue"\n                        [attr.data-automation-id]="\'card-textitem-editinput-\' + property.key">\n                    <textarea *ngIf="property.multiline" #editorInput\n                        matInput\n                        matTextareaAutosize\n                        matAutosizeMaxRows="1"\n                        matAutosizeMaxRows="5"\n                        class="adf-textarea"\n                        [placeholder]="property.default | translate"\n                        [(ngModel)]="editedValue"\n                        (input)="onTextAreaInputChange()"\n                        [attr.data-automation-id]="\'card-textitem-edittextarea-\' + property.key"></textarea>\n                </mat-form-field>\n                <button mat-icon-button class="adf-textitem-action" (click)="update($event)"\n                    [attr.aria-label]="\'CORE.METADATA.ACTIONS.SAVE\' | translate"\n                    [attr.title]="\'CORE.METADATA.ACTIONS.SAVE\' | translate"\n                    [attr.data-automation-id]="\'card-textitem-update-\' + property.key">\n\n                    <mat-icon class="adf-textitem-icon">done</mat-icon>\n                </button>\n\n                <button mat-icon-button (click)="reset($event)" class="adf-textitem-action"\n                    [attr.aria-label]="\'CORE.METADATA.ACTIONS.CANCEL\' | translate"\n                    [attr.title]="\'CORE.METADATA.ACTIONS.CANCEL\' | translate"\n                    [attr.data-automation-id]="\'card-textitem-reset-\' + property.key">\n\n                    <mat-icon>clear</mat-icon>\n                </button>\n            </div>\n            <mat-error [attr.data-automation-id]="\'card-textitem-error-\' + property.key" class="adf-textitem-editable-error" *ngIf="hasErrors()">\n                <ul>\n                    <li *ngFor="let errorMessage of errorMessages">{{ errorMessage | translate }}</li>\n                </ul>\n            </mat-error>\n        </div>\n    </span>\n    <ng-template #elseEmptyValueBlock>\n        <span class="adf-textitem-default-value">{{ property.default | translate }}</span>\n    </ng-template>\n</div>\n',
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
CardViewTextItemComponent.ctorParameters = () => [
  { type: CardViewUpdateService },
  { type: AppConfigService }
];
CardViewTextItemComponent.propDecorators = {
  property: [{ type: Input }],
  editable: [{ type: Input }],
  displayEmpty: [{ type: Input }],
  editorInput: [{ type: ViewChild, args: ['editorInput'] }]
};
if (false) {
  /** @type {?} */
  CardViewTextItemComponent.DEFAULT_SEPARATOR;
  /** @type {?} */
  CardViewTextItemComponent.prototype.property;
  /** @type {?} */
  CardViewTextItemComponent.prototype.editable;
  /** @type {?} */
  CardViewTextItemComponent.prototype.displayEmpty;
  /**
   * @type {?}
   * @private
   */
  CardViewTextItemComponent.prototype.editorInput;
  /** @type {?} */
  CardViewTextItemComponent.prototype.inEdit;
  /** @type {?} */
  CardViewTextItemComponent.prototype.editedValue;
  /** @type {?} */
  CardViewTextItemComponent.prototype.errorMessages;
  /** @type {?} */
  CardViewTextItemComponent.prototype.valueSeparator;
  /**
   * @type {?}
   * @private
   */
  CardViewTextItemComponent.prototype.cardViewUpdateService;
  /**
   * @type {?}
   * @private
   */
  CardViewTextItemComponent.prototype.appConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LXRleHRpdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9jb21wb25lbnRzL2NhcmQtdmlldy10ZXh0aXRlbS9jYXJkLXZpZXctdGV4dGl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFhLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNoRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQU8xRSxNQUFNLE9BQU8seUJBQXlCOzs7OztJQXFCbEMsWUFBb0IscUJBQTRDLEVBQzVDLFNBQTJCO1FBRDNCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFkL0MsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUcxQixpQkFBWSxHQUFZLElBQUksQ0FBQztRQUs3QixXQUFNLEdBQVksS0FBSyxDQUFDO1FBT3BCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVMsNkNBQTZDLENBQUMsSUFBSSx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQztJQUNuSixDQUFDOzs7O0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUNsRyxDQUFDOzs7O0lBRUQsWUFBWTtRQUNS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QztJQUNqQixDQUFDOzs7O0lBRUQscUJBQXFCO1FBQ2pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0UsQ0FBQzs7OztJQUVELE9BQU87UUFDSCxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEtBQUssVUFBVSxFQUFFO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDakM7YUFBTTtZQUNILElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JEO0lBQ0wsQ0FBQzs7QUF6R00sMkNBQWlCLEdBQUcsSUFBSSxDQUFDOztZQVBuQyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsdWdMQUFrRDs7YUFFckQ7Ozs7WUFQUSxxQkFBcUI7WUFDckIsZ0JBQWdCOzs7dUJBV3BCLEtBQUs7dUJBR0wsS0FBSzsyQkFHTCxLQUFLOzBCQUdMLFNBQVMsU0FBQyxhQUFhOzs7O0lBWHhCLDRDQUFnQzs7SUFFaEMsNkNBQ2dDOztJQUVoQyw2Q0FDMEI7O0lBRTFCLGlEQUM2Qjs7Ozs7SUFFN0IsZ0RBQ3lCOztJQUV6QiwyQ0FBd0I7O0lBQ3hCLGdEQUFvQjs7SUFDcEIsa0RBQXdCOztJQUN4QixtREFBdUI7Ozs7O0lBRVgsMERBQW9EOzs7OztJQUNwRCw4Q0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FyZFZpZXdUZXh0SXRlbU1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NhcmQtdmlldy10ZXh0aXRlbS5tb2RlbCc7XG5pbXBvcnQgeyBDYXJkVmlld1VwZGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jYXJkLXZpZXctdXBkYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXBwQ29uZmlnU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtY2FyZC12aWV3LXRleHRpdGVtJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2FyZC12aWV3LXRleHRpdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jYXJkLXZpZXctdGV4dGl0ZW0uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDYXJkVmlld1RleHRJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICAgIHN0YXRpYyBERUZBVUxUX1NFUEFSQVRPUiA9ICcsICc7XG5cbiAgICBASW5wdXQoKVxuICAgIHByb3BlcnR5OiBDYXJkVmlld1RleHRJdGVtTW9kZWw7XG5cbiAgICBASW5wdXQoKVxuICAgIGVkaXRhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIGRpc3BsYXlFbXB0eTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAVmlld0NoaWxkKCdlZGl0b3JJbnB1dCcpXG4gICAgcHJpdmF0ZSBlZGl0b3JJbnB1dDogYW55O1xuXG4gICAgaW5FZGl0OiBib29sZWFuID0gZmFsc2U7XG4gICAgZWRpdGVkVmFsdWU6IHN0cmluZztcbiAgICBlcnJvck1lc3NhZ2VzOiBzdHJpbmdbXTtcbiAgICB2YWx1ZVNlcGFyYXRvcjogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYXJkVmlld1VwZGF0ZVNlcnZpY2U6IENhcmRWaWV3VXBkYXRlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGFwcENvbmZpZzogQXBwQ29uZmlnU2VydmljZSkge1xuICAgICAgICB0aGlzLnZhbHVlU2VwYXJhdG9yID0gdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oJ2NvbnRlbnQtbWV0YWRhdGEubXVsdGktdmFsdWUtcGlwZS1zZXBhcmF0b3InKSB8fCBDYXJkVmlld1RleHRJdGVtQ29tcG9uZW50LkRFRkFVTFRfU0VQQVJBVE9SO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVkaXRlZFZhbHVlID0gdGhpcy5wcm9wZXJ0eS5tdWx0aWxpbmUgPyB0aGlzLnByb3BlcnR5LmRpc3BsYXlWYWx1ZSA6IHRoaXMucHJvcGVydHkudmFsdWU7XG4gICAgfVxuXG4gICAgc2hvd1Byb3BlcnR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNwbGF5RW1wdHkgfHwgIXRoaXMucHJvcGVydHkuaXNFbXB0eSgpO1xuICAgIH1cblxuICAgIHNob3dDbGlja2FibGVJY29uKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNJY29uKCkgJiYgdGhpcy5lZGl0YWJsZTtcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSAmJiB0aGlzLnByb3BlcnR5LmVkaXRhYmxlO1xuICAgIH1cblxuICAgIGlzQ2xpY2thYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLnByb3BlcnR5LmNsaWNrYWJsZTtcbiAgICB9XG5cbiAgICBoYXNJY29uKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLnByb3BlcnR5Lmljb247XG4gICAgfVxuXG4gICAgaGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvck1lc3NhZ2VzICYmIHRoaXMuZXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIHNldEVkaXRNb2RlKGVkaXRTdGF0dXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbkVkaXQgPSBlZGl0U3RhdHVzO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvcklucHV0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3JJbnB1dC5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIHJlc2V0KGV2ZW50OiBNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5lZGl0ZWRWYWx1ZSA9IHRoaXMucHJvcGVydHkubXVsdGlsaW5lID8gdGhpcy5wcm9wZXJ0eS5kaXNwbGF5VmFsdWUgOiB0aGlzLnByb3BlcnR5LnZhbHVlO1xuICAgICAgICB0aGlzLnNldEVkaXRNb2RlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5yZXNldEVycm9yTWVzc2FnZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0RXJyb3JNZXNzYWdlcygpIHtcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2VzID0gW107XG4gICAgfVxuXG4gICAgdXBkYXRlKGV2ZW50OiBNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcGVydHkuaXNWYWxpZCh0aGlzLmVkaXRlZFZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZFZhbHVlID0gdGhpcy5wcmVwYXJlVmFsdWVGb3JVcGxvYWQodGhpcy5wcm9wZXJ0eSwgdGhpcy5lZGl0ZWRWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNhcmRWaWV3VXBkYXRlU2VydmljZS51cGRhdGUodGhpcy5wcm9wZXJ0eSwgdXBkYXRlZFZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHkudmFsdWUgPSB1cGRhdGVkVmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNldEVkaXRNb2RlKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucmVzZXRFcnJvck1lc3NhZ2VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZXMgPSB0aGlzLnByb3BlcnR5LmdldFZhbGlkYXRpb25FcnJvcnModGhpcy5lZGl0ZWRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmVwYXJlVmFsdWVGb3JVcGxvYWQocHJvcGVydHk6IENhcmRWaWV3VGV4dEl0ZW1Nb2RlbCwgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB8IHN0cmluZyBbXSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eS5tdWx0aXZhbHVlZCkge1xuICAgICAgICAgICAgY29uc3QgbGlzdE9mVmFsdWVzID0gdmFsdWUuc3BsaXQodGhpcy52YWx1ZVNlcGFyYXRvci50cmltKCkpLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpO1xuICAgICAgICAgICAgcmV0dXJuIGxpc3RPZlZhbHVlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgb25UZXh0QXJlYUlucHV0Q2hhbmdlKCkge1xuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZXMgPSB0aGlzLnByb3BlcnR5LmdldFZhbGlkYXRpb25FcnJvcnModGhpcy5lZGl0ZWRWYWx1ZSk7XG4gICAgfVxuXG4gICAgY2xpY2tlZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BlcnR5LmNsaWNrQ2FsbEJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHkuY2xpY2tDYWxsQmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYXJkVmlld1VwZGF0ZVNlcnZpY2UuY2xpY2tlZCh0aGlzLnByb3BlcnR5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
