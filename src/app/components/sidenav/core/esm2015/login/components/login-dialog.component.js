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
import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LoginDialogPanelComponent } from './login-dialog-panel.component';
export class LoginDialogComponent {
  /**
   * @param {?} data
   */
  constructor(data) {
    this.data = data;
    this.buttonActionName = '';
    this.buttonActionName = data.actionName
      ? `LOGIN.DIALOG.${data.actionName.toUpperCase()}`
      : 'LOGIN.DIALOG.CHOOSE';
  }
  /**
   * @return {?}
   */
  close() {
    this.data.logged.complete();
  }
  /**
   * @return {?}
   */
  submitForm() {
    this.loginPanel.submitForm();
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onLoginSuccess(event) {
    this.data.logged.next(event);
    this.close();
  }
  /**
   * @return {?}
   */
  isFormValid() {
    return this.loginPanel ? this.loginPanel.isValid() : false;
  }
}
LoginDialogComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-login-dialog',
        template:
          '<header\n    mat-dialog-title\n    data-automation-id="login-dialog-title">{{data?.title}}\n</header>\n\n<mat-dialog-content class="adf-login-dialog-content">\n    <adf-login-dialog-panel #adfLoginPanel\n                            (success)="onLoginSuccess($event)">\n    </adf-login-dialog-panel>\n</mat-dialog-content>\n\n<mat-dialog-actions align="end">\n    <button\n        mat-button\n        (click)="close()"\n        data-automation-id="login-dialog-actions-cancel">{{ \'LOGIN.DIALOG.CANCEL\' | translate }}\n    </button>\n\n    <button mat-button\n        class="choose-action"\n        data-automation-id="login-dialog-actions-perform"\n        [disabled]="!isFormValid()"\n        (click)="submitForm()">{{ buttonActionName | translate}}\n    </button>\n</mat-dialog-actions>\n',
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
LoginDialogComponent.ctorParameters = () => [
  { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA] }] }
];
LoginDialogComponent.propDecorators = {
  loginPanel: [{ type: ViewChild, args: ['adfLoginPanel'] }]
};
if (false) {
  /** @type {?} */
  LoginDialogComponent.prototype.loginPanel;
  /** @type {?} */
  LoginDialogComponent.prototype.buttonActionName;
  /** @type {?} */
  LoginDialogComponent.prototype.data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImxvZ2luL2NvbXBvbmVudHMvbG9naW4tZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBTzNFLE1BQU0sT0FBTyxvQkFBb0I7Ozs7SUFPN0IsWUFBNEMsSUFBOEI7UUFBOUIsU0FBSSxHQUFKLElBQUksQ0FBMEI7UUFGMUUscUJBQWdCLEdBQUcsRUFBRSxDQUFDO1FBR2xCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztJQUN0SCxDQUFDOzs7O0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Ozs7SUFFRCxVQUFVO1FBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNqQyxDQUFDOzs7OztJQUVELGNBQWMsQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDakIsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMvRCxDQUFDOzs7WUFoQ0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLHF6QkFBNEM7Z0JBRTVDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN4Qzs7Ozs0Q0FRZ0IsTUFBTSxTQUFDLGVBQWU7Ozt5QkFMbEMsU0FBUyxTQUFDLGVBQWU7Ozs7SUFBMUIsMENBQ3NDOztJQUV0QyxnREFBc0I7O0lBRVYsb0NBQThEIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIFZpZXdFbmNhcHN1bGF0aW9uLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IExvZ2luRGlhbG9nQ29tcG9uZW50RGF0YSB9IGZyb20gJy4vbG9naW4tZGlhbG9nLWNvbXBvbmVudC1kYXRhLmludGVyZmFjZSc7XG5pbXBvcnQgeyBMb2dpbkRpYWxvZ1BhbmVsQ29tcG9uZW50IH0gZnJvbSAnLi9sb2dpbi1kaWFsb2ctcGFuZWwuY29tcG9uZW50JztcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWxvZ2luLWRpYWxvZycsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2xvZ2luLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vbG9naW4tZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBMb2dpbkRpYWxvZ0NvbXBvbmVudCB7XG5cbiAgICBAVmlld0NoaWxkKCdhZGZMb2dpblBhbmVsJylcbiAgICBsb2dpblBhbmVsOiBMb2dpbkRpYWxvZ1BhbmVsQ29tcG9uZW50O1xuXG4gICAgYnV0dG9uQWN0aW9uTmFtZSA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChNQVRfRElBTE9HX0RBVEEpIHB1YmxpYyBkYXRhOiBMb2dpbkRpYWxvZ0NvbXBvbmVudERhdGEpIHtcbiAgICAgICAgdGhpcy5idXR0b25BY3Rpb25OYW1lID0gZGF0YS5hY3Rpb25OYW1lID8gYExPR0lOLkRJQUxPRy4ke2RhdGEuYWN0aW9uTmFtZS50b1VwcGVyQ2FzZSgpfWAgOiAnTE9HSU4uRElBTE9HLkNIT09TRSc7XG4gICAgfVxuXG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMuZGF0YS5sb2dnZWQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBzdWJtaXRGb3JtKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ2luUGFuZWwuc3VibWl0Rm9ybSgpO1xuICAgIH1cblxuICAgIG9uTG9naW5TdWNjZXNzKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgdGhpcy5kYXRhLmxvZ2dlZC5uZXh0KGV2ZW50KTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cblxuICAgIGlzRm9ybVZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dpblBhbmVsID8gdGhpcy5sb2dpblBhbmVsLmlzVmFsaWQoKSA6IGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==
