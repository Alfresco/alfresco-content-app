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
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
/**
 * @record
 */
export function EditJsonDialogSettings() {}
if (false) {
  /** @type {?|undefined} */
  EditJsonDialogSettings.prototype.title;
  /** @type {?|undefined} */
  EditJsonDialogSettings.prototype.editable;
  /** @type {?|undefined} */
  EditJsonDialogSettings.prototype.value;
}
export class EditJsonDialogComponent {
  /**
   * @param {?} settings
   */
  constructor(settings) {
    this.settings = settings;
    this.editable = false;
    this.title = 'JSON';
    this.value = '';
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.settings) {
      this.editable = this.settings.editable ? true : false;
      this.value = this.settings.value || '';
      this.title = this.settings.title || 'JSON';
    }
  }
}
EditJsonDialogComponent.decorators = [
  {
    type: Component,
    args: [
      {
        template:
          '<h1 mat-dialog-title>{{ title | translate }}</h1>\n<mat-dialog-content>\n    <textarea [(ngModel)]="value" [attr.readonly]="!editable ? true : null"></textarea>\n</mat-dialog-content>\n\n<mat-dialog-actions align="end">\n    <button mat-button mat-dialog-close cdkFocusInitial>\n        {{ \'CORE.DIALOG.EDIT_JSON.CLOSE\' | translate }}\n    </button>\n    <button *ngIf="editable" mat-button [mat-dialog-close]="value">\n        {{ \'CORE.DIALOG.EDIT_JSON.UPDATE\' | translate }}\n    </button>\n</mat-dialog-actions>\n',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-edit-json-dialog' },
        styles: [
          '.adf-edit-json-dialog .mat-dialog-content{height:300px;overflow:hidden}.adf-edit-json-dialog textarea{resize:none;width:100%;height:100%;margin:0;padding:0;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box}.adf-edit-json-dialog textarea:focus{outline:0}'
        ]
      }
    ]
  }
];
/** @nocollapse */
EditJsonDialogComponent.ctorParameters = () => [
  { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA] }] }
];
EditJsonDialogComponent.propDecorators = {
  value: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  EditJsonDialogComponent.prototype.editable;
  /** @type {?} */
  EditJsonDialogComponent.prototype.title;
  /** @type {?} */
  EditJsonDialogComponent.prototype.value;
  /**
   * @type {?}
   * @private
   */
  EditJsonDialogComponent.prototype.settings;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1qc29uLmRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRpYWxvZ3MvZWRpdC1qc29uL2VkaXQtanNvbi5kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQVUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7OztBQUUzRCw0Q0FJQzs7O0lBSEcsdUNBQWU7O0lBQ2YsMENBQW1COztJQUNuQix1Q0FBZTs7QUFTbkIsTUFBTSxPQUFPLHVCQUF1Qjs7OztJQVFoQyxZQUNxQyxRQUFnQztRQUFoQyxhQUFRLEdBQVIsUUFBUSxDQUF3QjtRQVByRSxhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLFVBQUssR0FBVyxNQUFNLENBQUM7UUFHdkIsVUFBSyxHQUFXLEVBQUUsQ0FBQztJQUloQixDQUFDOzs7O0lBRUosUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDO1NBQzlDO0lBQ0wsQ0FBQzs7O1lBeEJKLFNBQVMsU0FBQztnQkFDUCwwaEJBQW9DO2dCQUVwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFOzthQUMxQzs7Ozs0Q0FVUSxNQUFNLFNBQUMsZUFBZTs7O29CQUoxQixLQUFLOzs7O0lBSE4sMkNBQTBCOztJQUMxQix3Q0FBdUI7O0lBRXZCLHdDQUNtQjs7Ozs7SUFHZiwyQ0FBaUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgT25Jbml0LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWRpdEpzb25EaWFsb2dTZXR0aW5ncyB7XG4gICAgdGl0bGU/OiBzdHJpbmc7XG4gICAgZWRpdGFibGU/OiBib29sZWFuO1xuICAgIHZhbHVlPzogc3RyaW5nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICB0ZW1wbGF0ZVVybDogJ2VkaXQtanNvbi5kaWFsb2cuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJ2VkaXQtanNvbi5kaWFsb2cuc2NzcyddLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDogeyBjbGFzczogJ2FkZi1lZGl0LWpzb24tZGlhbG9nJyB9XG59KVxuZXhwb3J0IGNsYXNzIEVkaXRKc29uRGlhbG9nQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIGVkaXRhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgdGl0bGU6IHN0cmluZyA9ICdKU09OJztcblxuICAgIEBJbnB1dCgpXG4gICAgdmFsdWU6IHN0cmluZyA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBwcml2YXRlIHNldHRpbmdzOiBFZGl0SnNvbkRpYWxvZ1NldHRpbmdzXG4gICAgKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzKSB7XG4gICAgICAgICAgICB0aGlzLmVkaXRhYmxlID0gdGhpcy5zZXR0aW5ncy5lZGl0YWJsZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnNldHRpbmdzLnZhbHVlIHx8ICcnO1xuICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRoaXMuc2V0dGluZ3MudGl0bGUgfHwgJ0pTT04nO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
