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
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
export class PdfPasswordDialogComponent {
  /**
   * @param {?} dialogRef
   * @param {?} data
   */
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.passwordFormControl = new FormControl('', [Validators.required]);
  }
  /**
   * @return {?}
   */
  isError() {
    return this.data.reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD;
  }
  /**
   * @return {?}
   */
  isValid() {
    return !this.passwordFormControl.hasError('required');
  }
  /**
   * @return {?}
   */
  submit() {
    this.dialogRef.close(this.passwordFormControl.value);
  }
}
PdfPasswordDialogComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-pdf-viewer-password-dialog',
        template:
          '<div mat-dialog-title>\n    <mat-icon>lock</mat-icon>\n</div>\n\n<mat-dialog-content>\n    <form (submit)="submit()">\n        <mat-form-field class="adf-full-width">\n            <input matInput\n                   data-automation-id=\'adf-password-dialog-input\'\n                   type="password"\n                   placeholder="{{ \'ADF_VIEWER.PDF_DIALOG.PLACEHOLDER\' | translate }}"\n                   [formControl]="passwordFormControl" />\n        </mat-form-field>\n\n        <mat-error *ngIf="isError()" data-automation-id=\'adf-password-dialog-error\'>{{ \'ADF_VIEWER.PDF_DIALOG.ERROR\' | translate }}</mat-error>\n    </form>\n</mat-dialog-content>\n\n<mat-dialog-actions class="adf-dialog-buttons">\n    <span class="adf-fill-remaining-space"></span>\n\n    <button mat-button mat-dialog-close data-automation-id=\'adf-password-dialog-close\'>{{ \'ADF_VIEWER.PDF_DIALOG.CLOSE\' | translate }}</button>\n\n    <button mat-button\n            data-automation-id=\'adf-password-dialog-submit\'\n            class="adf-dialog-action-button"\n            [disabled]="!isValid()"\n            (click)="submit()">\n        {{ \'ADF_VIEWER.PDF_DIALOG.SUBMIT\' | translate }}\n    </button>\n</mat-dialog-actions>\n',
        styles: [
          '.adf-fill-remaining-space{flex:1 1 auto}.adf-full-width{width:100%}'
        ]
      }
    ]
  }
];
/** @nocollapse */
PdfPasswordDialogComponent.ctorParameters = () => [
  { type: MatDialogRef },
  { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA] }] }
];
if (false) {
  /** @type {?} */
  PdfPasswordDialogComponent.prototype.passwordFormControl;
  /**
   * @type {?}
   * @private
   */
  PdfPasswordDialogComponent.prototype.dialogRef;
  /** @type {?} */
  PdfPasswordDialogComponent.prototype.data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXZpZXdlci1wYXNzd29yZC1kaWFsb2cuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ2aWV3ZXIvY29tcG9uZW50cy9wZGYtdmlld2VyLXBhc3N3b3JkLWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUMxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFTekQsTUFBTSxPQUFPLDBCQUEwQjs7Ozs7SUFHbkMsWUFDWSxTQUFtRCxFQUMzQixJQUFTO1FBRGpDLGNBQVMsR0FBVCxTQUFTLENBQTBDO1FBQzNCLFNBQUksR0FBSixJQUFJLENBQUs7SUFDMUMsQ0FBQzs7OztJQUVKLFFBQVE7UUFDSixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQzs7OztJQUVELE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQztJQUM5RSxDQUFDOzs7O0lBRUQsT0FBTztRQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFELENBQUM7Ozs7SUFFRCxNQUFNO1FBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pELENBQUM7OztZQTNCSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGdDQUFnQztnQkFDMUMsd3RDQUFnRDs7YUFFbkQ7Ozs7WUFUUSxZQUFZOzRDQWVaLE1BQU0sU0FBQyxlQUFlOzs7O0lBSjNCLHlEQUFpQzs7Ozs7SUFHN0IsK0NBQTJEOztJQUMzRCwwQ0FBeUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXREaWFsb2dSZWYsIE1BVF9ESUFMT0dfREFUQSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5kZWNsYXJlIGNvbnN0IHBkZmpzTGliOiBhbnk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLXBkZi12aWV3ZXItcGFzc3dvcmQtZGlhbG9nJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vcGRmLXZpZXdlci1wYXNzd29yZC1kaWFsb2cuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbICcuL3BkZi12aWV3ZXItcGFzc3dvcmQtZGlhbG9nLnNjc3MnIF1cbn0pXG5leHBvcnQgY2xhc3MgUGRmUGFzc3dvcmREaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHBhc3N3b3JkRm9ybUNvbnRyb2w6IEZvcm1Db250cm9sO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8UGRmUGFzc3dvcmREaWFsb2dDb21wb25lbnQ+LFxuICAgICAgICBASW5qZWN0KE1BVF9ESUFMT0dfREFUQSkgcHVibGljIGRhdGE6IGFueVxuICAgICkge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnBhc3N3b3JkRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXSk7XG4gICAgfVxuXG4gICAgaXNFcnJvcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yZWFzb24gPT09IHBkZmpzTGliLlBhc3N3b3JkUmVzcG9uc2VzLklOQ09SUkVDVF9QQVNTV09SRDtcbiAgICB9XG5cbiAgICBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMucGFzc3dvcmRGb3JtQ29udHJvbC5oYXNFcnJvcigncmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICBzdWJtaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHRoaXMucGFzc3dvcmRGb3JtQ29udHJvbC52YWx1ZSk7XG4gICAgfVxufVxuIl19
