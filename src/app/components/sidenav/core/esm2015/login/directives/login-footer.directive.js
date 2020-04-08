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
import { ContentChild, Directive, TemplateRef } from '@angular/core';
import { LoginComponent } from '../components/login.component';
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
export class LoginFooterDirective {
  /**
   * @param {?} alfrescoLoginComponent
   */
  constructor(alfrescoLoginComponent) {
    this.alfrescoLoginComponent = alfrescoLoginComponent;
  }
  /**
   * @return {?}
   */
  ngAfterContentInit() {
    this.alfrescoLoginComponent.footerTemplate = this.template;
  }
}
LoginFooterDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: 'adf-login-footer, login-footer'
      }
    ]
  }
];
/** @nocollapse */
LoginFooterDirective.ctorParameters = () => [{ type: LoginComponent }];
LoginFooterDirective.propDecorators = {
  template: [{ type: ContentChild, args: [TemplateRef] }]
};
if (false) {
  /** @type {?} */
  LoginFooterDirective.prototype.template;
  /**
   * @type {?}
   * @private
   */
  LoginFooterDirective.prototype.alfrescoLoginComponent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tZm9vdGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImxvZ2luL2RpcmVjdGl2ZXMvbG9naW4tZm9vdGVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBRUgsWUFBWSxFQUNaLFNBQVMsRUFDVCxXQUFXLEVBQ2QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLCtCQUErQixDQUFDOzs7O0FBUS9ELE1BQU0sT0FBTyxvQkFBb0I7Ozs7SUFLN0IsWUFDWSxzQkFBc0M7UUFBdEMsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUFnQjtJQUNsRCxDQUFDOzs7O0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQy9ELENBQUM7OztZQWRKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZ0NBQWdDO2FBQzdDOzs7O1lBUFEsY0FBYzs7O3VCQVVsQixZQUFZLFNBQUMsV0FBVzs7OztJQUF6Qix3Q0FDYzs7Ozs7SUFHVixzREFBOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIERpcmVjdGl2ZSxcbiAgICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvZ2luQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9sb2dpbi5jb21wb25lbnQnO1xuXG4vKipcbiAqIERpcmVjdGl2ZSBzZWxlY3RvcnMgd2l0aG91dCBhZGYtIHByZWZpeCB3aWxsIGJlIGRlcHJlY2F0ZWQgb24gMy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdhZGYtbG9naW4tZm9vdGVyLCBsb2dpbi1mb290ZXInXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luRm9vdGVyRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG5cbiAgICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKVxuICAgIHRlbXBsYXRlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhbGZyZXNjb0xvZ2luQ29tcG9uZW50OiBMb2dpbkNvbXBvbmVudCkge1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy5hbGZyZXNjb0xvZ2luQ29tcG9uZW50LmZvb3RlclRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICB9XG59XG4iXX0=
