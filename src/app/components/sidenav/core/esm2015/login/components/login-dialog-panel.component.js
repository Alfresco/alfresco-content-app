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
  Component,
  ViewEncapsulation,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { LoginComponent } from './login.component';
export class LoginDialogPanelComponent {
  constructor() {
    /**
     * Emitted when the login succeeds.
     */
    this.success = new EventEmitter();
  }
  /**
   * @return {?}
   */
  submitForm() {
    this.login.submit();
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onLoginSuccess(event) {
    this.success.emit(event);
  }
  /**
   * @return {?}
   */
  isValid() {
    return this.login && this.login.form ? this.login.form.valid : false;
  }
}
LoginDialogPanelComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-login-dialog-panel',
        template:
          '<div>\n    <adf-login #adfLogin\n               class="adf-panel-login-dialog-component"\n               [showRememberMe]="false"\n               [showLoginActions]="false"\n               [backgroundImageUrl]="\'\'"\n               (success)="onLoginSuccess($event)">\n        <adf-login-header><ng-template></ng-template></adf-login-header>\n        <adf-login-footer><ng-template></ng-template></adf-login-footer>\n    </adf-login>\n</div>\n',
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
LoginDialogPanelComponent.propDecorators = {
  success: [{ type: Output }],
  login: [{ type: ViewChild, args: ['adfLogin'] }]
};
if (false) {
  /**
   * Emitted when the login succeeds.
   * @type {?}
   */
  LoginDialogPanelComponent.prototype.success;
  /** @type {?} */
  LoginDialogPanelComponent.prototype.login;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tZGlhbG9nLXBhbmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImxvZ2luL2NvbXBvbmVudHMvbG9naW4tZGlhbG9nLXBhbmVsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQVNuRCxNQUFNLE9BQU8seUJBQXlCO0lBTnRDOzs7O1FBU0ksWUFBTyxHQUFHLElBQUksWUFBWSxFQUFxQixDQUFDO0lBZ0JwRCxDQUFDOzs7O0lBWEcsVUFBVTtRQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7Ozs7SUFFRCxjQUFjLENBQUMsS0FBd0I7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVELE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3pFLENBQUM7OztZQXhCSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsZ2RBQWtEO2dCQUVsRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDeEM7OztzQkFHSSxNQUFNO29CQUdOLFNBQVMsU0FBQyxVQUFVOzs7Ozs7O0lBSHJCLDRDQUNnRDs7SUFFaEQsMENBQ3NCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbiwgVmlld0NoaWxkLCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9naW5Db21wb25lbnQgfSBmcm9tICcuL2xvZ2luLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2dpblN1Y2Nlc3NFdmVudCB9IGZyb20gJy4uL21vZGVscy9sb2dpbi1zdWNjZXNzLmV2ZW50JztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtbG9naW4tZGlhbG9nLXBhbmVsJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbG9naW4tZGlhbG9nLXBhbmVsLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9sb2dpbi1kaWFsb2ctcGFuZWwuY29tcG9uZW50LnNjc3MnXSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luRGlhbG9nUGFuZWxDb21wb25lbnQge1xuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGxvZ2luIHN1Y2NlZWRzLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHN1Y2Nlc3MgPSBuZXcgRXZlbnRFbWl0dGVyPExvZ2luU3VjY2Vzc0V2ZW50PigpO1xuXG4gICAgQFZpZXdDaGlsZCgnYWRmTG9naW4nKVxuICAgIGxvZ2luOiBMb2dpbkNvbXBvbmVudDtcblxuICAgIHN1Ym1pdEZvcm0oKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9naW4uc3VibWl0KCk7XG4gICAgfVxuXG4gICAgb25Mb2dpblN1Y2Nlc3MoZXZlbnQ6IExvZ2luU3VjY2Vzc0V2ZW50KSB7XG4gICAgICAgIHRoaXMuc3VjY2Vzcy5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBpc1ZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dpbiAmJiB0aGlzLmxvZ2luLmZvcm0gPyB0aGlzLmxvZ2luLmZvcm0udmFsaWQgOiBmYWxzZTtcbiAgICB9XG59XG4iXX0=
