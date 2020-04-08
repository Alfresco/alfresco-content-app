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
import { Component } from '@angular/core';
import {
  AppConfigService,
  AppConfigValues
} from '../app-config/app-config.service';
import { UserPreferencesService } from '../services/user-preferences.service';
export class LanguageMenuComponent {
  /**
   * @param {?} appConfig
   * @param {?} userPreference
   */
  constructor(appConfig, userPreference) {
    this.appConfig = appConfig;
    this.userPreference = userPreference;
    this.languages = [{ key: 'en', label: 'English' }];
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    /** @type {?} */
    const languagesConfigApp = this.appConfig.get(
      AppConfigValues.APP_CONFIG_LANGUAGES_KEY
    );
    if (languagesConfigApp) {
      this.languages = languagesConfigApp;
    }
  }
  /**
   * @param {?} language
   * @return {?}
   */
  changeLanguage(language) {
    this.userPreference.locale = language.key;
    this.userPreference.set('textOrientation', language.direction || 'ltr');
  }
}
LanguageMenuComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-language-menu',
        template:
          '<button mat-menu-item *ngFor="let language of languages" (click)="changeLanguage(language)">{{language.label}}\n</button>\n'
      }
    ]
  }
];
/** @nocollapse */
LanguageMenuComponent.ctorParameters = () => [
  { type: AppConfigService },
  { type: UserPreferencesService }
];
if (false) {
  /** @type {?} */
  LanguageMenuComponent.prototype.languages;
  /**
   * @type {?}
   * @private
   */
  LanguageMenuComponent.prototype.appConfig;
  /**
   * @type {?}
   * @private
   */
  LanguageMenuComponent.prototype.userPreference;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UtbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJsYW5ndWFnZS1tZW51L2xhbmd1YWdlLW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBTzlFLE1BQU0sT0FBTyxxQkFBcUI7Ozs7O0lBTTlCLFlBQ1ksU0FBMkIsRUFDM0IsY0FBc0M7UUFEdEMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsbUJBQWMsR0FBZCxjQUFjLENBQXdCO1FBTmxELGNBQVMsR0FBd0I7WUFDN0IsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUM7U0FDakMsQ0FBQztJQUtGLENBQUM7Ozs7SUFFRCxRQUFROztjQUNFLGtCQUFrQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFzQixlQUFlLENBQUMsd0JBQXdCLENBQUM7UUFDNUcsSUFBSSxrQkFBa0IsRUFBRTtZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxjQUFjLENBQUMsUUFBc0I7UUFDakMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDO0lBQzVFLENBQUM7OztZQXpCSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsMklBQTJDO2FBQzlDOzs7O1lBUFEsZ0JBQWdCO1lBQ2hCLHNCQUFzQjs7OztJQVMzQiwwQ0FFRTs7Ozs7SUFHRSwwQ0FBbUM7Ozs7O0lBQ25DLCtDQUE4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBcHBDb25maWdTZXJ2aWNlLCBBcHBDb25maWdWYWx1ZXMgfSBmcm9tICcuLi9hcHAtY29uZmlnL2FwcC1jb25maWcuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvdXNlci1wcmVmZXJlbmNlcy5zZXJ2aWNlJztcbmltcG9ydCB7IExhbmd1YWdlSXRlbSB9IGZyb20gJy4vbGFuZ3VhZ2UuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtbGFuZ3VhZ2UtbWVudScsXG4gICAgdGVtcGxhdGVVcmw6ICdsYW5ndWFnZS1tZW51LmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBMYW5ndWFnZU1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgbGFuZ3VhZ2VzOiBBcnJheTxMYW5ndWFnZUl0ZW0+ID0gW1xuICAgICAgICB7IGtleTogJ2VuJywgbGFiZWw6ICdFbmdsaXNoJ31cbiAgICBdO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgYXBwQ29uZmlnOiBBcHBDb25maWdTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHVzZXJQcmVmZXJlbmNlOiBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGNvbnN0IGxhbmd1YWdlc0NvbmZpZ0FwcCA9IHRoaXMuYXBwQ29uZmlnLmdldDxBcnJheTxMYW5ndWFnZUl0ZW0+PihBcHBDb25maWdWYWx1ZXMuQVBQX0NPTkZJR19MQU5HVUFHRVNfS0VZKTtcbiAgICAgICAgaWYgKGxhbmd1YWdlc0NvbmZpZ0FwcCkge1xuICAgICAgICAgICAgdGhpcy5sYW5ndWFnZXMgPSBsYW5ndWFnZXNDb25maWdBcHA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VMYW5ndWFnZShsYW5ndWFnZTogTGFuZ3VhZ2VJdGVtKSB7XG4gICAgICAgIHRoaXMudXNlclByZWZlcmVuY2UubG9jYWxlID0gbGFuZ3VhZ2Uua2V5O1xuICAgICAgICB0aGlzLnVzZXJQcmVmZXJlbmNlLnNldCgndGV4dE9yaWVudGF0aW9uJywgbGFuZ3VhZ2UuZGlyZWN0aW9uIHx8ICdsdHInKTtcbiAgICB9XG59XG4iXX0=
