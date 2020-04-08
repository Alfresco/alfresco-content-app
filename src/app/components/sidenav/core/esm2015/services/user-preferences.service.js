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
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import {
  AppConfigService,
  AppConfigValues
} from '../app-config/app-config.service';
import { StorageService } from './storage.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AlfrescoApiService } from './alfresco-api.service';
import * as i0 from '@angular/core';
import * as i1 from '@ngx-translate/core';
import * as i2 from '../app-config/app-config.service';
import * as i3 from './storage.service';
import * as i4 from './alfresco-api.service';
/** @enum {string} */
const UserPreferenceValues = {
  PaginationSize: 'paginationSize',
  Locale: 'locale',
  SupportedPageSizes: 'supportedPageSizes',
  ExpandedSideNavStatus: 'expandedSidenav'
};
export { UserPreferenceValues };
export class UserPreferencesService {
  /**
   * @param {?} translate
   * @param {?} appConfig
   * @param {?} storage
   * @param {?} alfrescoApiService
   */
  constructor(translate, appConfig, storage, alfrescoApiService) {
    this.translate = translate;
    this.appConfig = appConfig;
    this.storage = storage;
    this.alfrescoApiService = alfrescoApiService;
    this.defaults = {
      paginationSize: 25,
      supportedPageSizes: [5, 10, 15, 20],
      locale: 'en',
      expandedSidenav: true
    };
    this.userPreferenceStatus = this.defaults;
    this.alfrescoApiService.alfrescoApiInitialized.subscribe(
      this.initUserPreferenceStatus.bind(this)
    );
    this.onChangeSubject = new BehaviorSubject(this.userPreferenceStatus);
    this.onChange = this.onChangeSubject.asObservable();
  }
  /**
   * @private
   * @return {?}
   */
  initUserPreferenceStatus() {
    this.initUserLanguage();
    this.set(UserPreferenceValues.PaginationSize, this.paginationSize);
    this.set(
      UserPreferenceValues.SupportedPageSizes,
      JSON.stringify(this.supportedPageSizes)
    );
  }
  /**
   * @private
   * @return {?}
   */
  initUserLanguage() {
    if (this.locale || this.appConfig.get(UserPreferenceValues.Locale)) {
      /** @type {?} */
      const locale = this.locale || this.getDefaultLocale();
      this.set(UserPreferenceValues.Locale, locale);
      this.set(
        'textOrientation',
        this.getLanguageByKey(locale).direction || 'ltr'
      );
    } else {
      /** @type {?} */
      const locale = this.locale || this.getDefaultLocale();
      this.setWithoutStore(UserPreferenceValues.Locale, locale);
      this.setWithoutStore(
        'textOrientation',
        this.getLanguageByKey(locale).direction || 'ltr'
      );
    }
  }
  /**
   * Sets up a callback to notify when a property has changed.
   * @param {?} property The property to watch
   * @return {?} Notification callback
   */
  select(property) {
    return this.onChange.pipe(
      map(
        /**
         * @param {?} userPreferenceStatus
         * @return {?}
         */
        userPreferenceStatus => userPreferenceStatus[property]
      ),
      distinctUntilChanged()
    );
  }
  /**
   * Gets a preference property.
   * @param {?} property Name of the property
   * @param {?=} defaultValue Default to return if the property is not found
   * @return {?} Preference property
   */
  get(property, defaultValue) {
    /** @type {?} */
    const key = this.getPropertyKey(property);
    /** @type {?} */
    const value = this.storage.getItem(key);
    if (value === undefined || value === null) {
      return defaultValue;
    }
    return value;
  }
  /**
   * Sets a preference property.
   * @param {?} property Name of the property
   * @param {?} value New value for the property
   * @return {?}
   */
  set(property, value) {
    if (!property) {
      return;
    }
    this.storage.setItem(this.getPropertyKey(property), value);
    this.userPreferenceStatus[property] = value;
    this.onChangeSubject.next(this.userPreferenceStatus);
  }
  /**
   * Sets a preference property.
   * @param {?} property Name of the property
   * @param {?} value New value for the property
   * @return {?}
   */
  setWithoutStore(property, value) {
    if (!property) {
      return;
    }
    this.userPreferenceStatus[property] = value;
    this.onChangeSubject.next(this.userPreferenceStatus);
  }
  /**
   * Check if an item is present in the storage
   * @param {?} property Name of the property
   * @return {?} True if the item is present, false otherwise
   */
  hasItem(property) {
    if (!property) {
      return false;
    }
    return this.storage.hasItem(this.getPropertyKey(property));
  }
  /**
   * Gets the active storage prefix for preferences.
   * @return {?} Storage prefix
   */
  getStoragePrefix() {
    return this.storage.getItem('USER_PROFILE') || 'GUEST';
  }
  /**
   * Sets the active storage prefix for preferences.
   * @param {?} value Name of the prefix
   * @return {?}
   */
  setStoragePrefix(value) {
    this.storage.setItem('USER_PROFILE', value || 'GUEST');
    this.initUserPreferenceStatus();
  }
  /**
   * Gets the full property key with prefix.
   * @param {?} property The property name
   * @return {?} Property key
   */
  getPropertyKey(property) {
    return `${this.getStoragePrefix()}__${property}`;
  }
  /**
   * Gets an array containing the available page sizes.
   * @return {?} Array of page size values
   */
  get supportedPageSizes() {
    /** @type {?} */
    const supportedPageSizes = this.get(
      UserPreferenceValues.SupportedPageSizes
    );
    if (supportedPageSizes) {
      return JSON.parse(supportedPageSizes);
    } else {
      return this.appConfig.get(
        'pagination.supportedPageSizes',
        this.defaults.supportedPageSizes
      );
    }
  }
  /**
   * @param {?} value
   * @return {?}
   */
  set supportedPageSizes(value) {
    this.set(UserPreferenceValues.SupportedPageSizes, JSON.stringify(value));
  }
  /**
   * Pagination size.
   * @param {?} value
   * @return {?}
   */
  set paginationSize(value) {
    this.set(UserPreferenceValues.PaginationSize, value);
  }
  /**
   * @return {?}
   */
  get paginationSize() {
    /** @type {?} */
    const paginationSize = this.get(UserPreferenceValues.PaginationSize);
    if (paginationSize) {
      return Number(paginationSize);
    } else {
      return Number(
        this.appConfig.get('pagination.size', this.defaults.paginationSize)
      );
    }
  }
  /**
   * Current locale setting.
   * @return {?}
   */
  get locale() {
    return this.get(UserPreferenceValues.Locale);
  }
  /**
   * @param {?} value
   * @return {?}
   */
  set locale(value) {
    this.set(UserPreferenceValues.Locale, value);
  }
  /**
   * Gets the default locale.
   * @return {?} Default locale language code
   */
  getDefaultLocale() {
    return (
      this.appConfig.get(UserPreferenceValues.Locale) ||
      this.translate.getBrowserCultureLang() ||
      'en'
    );
  }
  /**
   * @private
   * @param {?} key
   * @return {?}
   */
  getLanguageByKey(key) {
    return (
      this.appConfig
        .get(AppConfigValues.APP_CONFIG_LANGUAGES_KEY, [
          /** @type {?} */ ({ key: 'en' })
        ])
        .find(
          /**
           * @param {?} language
           * @return {?}
           */
          language => key.includes(language.key)
        ) || /** @type {?} */ ({ key: 'en' })
    );
  }
}
UserPreferencesService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
UserPreferencesService.ctorParameters = () => [
  { type: TranslateService },
  { type: AppConfigService },
  { type: StorageService },
  { type: AlfrescoApiService }
];
/** @nocollapse */ UserPreferencesService.ngInjectableDef = i0.defineInjectable(
  {
    factory: function UserPreferencesService_Factory() {
      return new UserPreferencesService(
        i0.inject(i1.TranslateService),
        i0.inject(i2.AppConfigService),
        i0.inject(i3.StorageService),
        i0.inject(i4.AlfrescoApiService)
      );
    },
    token: UserPreferencesService,
    providedIn: 'root'
  }
);
if (false) {
  /** @type {?} */
  UserPreferencesService.prototype.defaults;
  /**
   * @type {?}
   * @private
   */
  UserPreferencesService.prototype.userPreferenceStatus;
  /**
   * @type {?}
   * @private
   */
  UserPreferencesService.prototype.onChangeSubject;
  /** @type {?} */
  UserPreferencesService.prototype.onChange;
  /** @type {?} */
  UserPreferencesService.prototype.translate;
  /**
   * @type {?}
   * @private
   */
  UserPreferencesService.prototype.appConfig;
  /**
   * @type {?}
   * @private
   */
  UserPreferencesService.prototype.storage;
  /**
   * @type {?}
   * @private
   */
  UserPreferencesService.prototype.alfrescoApiService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcmVmZXJlbmNlcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvdXNlci1wcmVmZXJlbmNlcy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFjLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFckYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7SUFHeEQsZ0JBQWlCLGdCQUFnQjtJQUNqQyxRQUFTLFFBQVE7SUFDakIsb0JBQXFCLG9CQUFvQjtJQUN6Qyx1QkFBd0IsaUJBQWlCOzs7QUFNN0MsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7OztJQWEvQixZQUFtQixTQUEyQixFQUMxQixTQUEyQixFQUMzQixPQUF1QixFQUN2QixrQkFBc0M7UUFIdkMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDMUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDdkIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQWQxRCxhQUFRLEdBQUc7WUFDUCxjQUFjLEVBQUUsRUFBRTtZQUNsQixrQkFBa0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNuQyxNQUFN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QyxTQUFTLENBQUMscUJBQXFCLEVBQUUsSUFBSSxJQUFJLENBQUM7SUFDckgsQ0FBQzs7Ozs7O0lBRU8sZ0JBQWdCLENBQUMsR0FBVztRQUNoQyxPQUFPLENBQ0gsSUFBSSxDQUFDLFNBQVM7YUFDVCxHQUFHLENBQXNCLGVBQWUsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLG1CQUFlLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFBLENBQUMsQ0FBQzthQUNsRyxJQUFJOzs7O1FBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFDLElBQUksbUJBQWUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUEsQ0FDdEYsQ0FBQztJQUNOLENBQUM7OztZQXZNSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7Ozs7WUFqQlEsZ0JBQWdCO1lBRWhCLGdCQUFnQjtZQUVoQixjQUFjO1lBRWQsa0JBQWtCOzs7OztJQWN2QiwwQ0FLRTs7Ozs7SUFFRixzREFBa0Q7Ozs7O0lBQ2xELGlEQUE4Qzs7SUFDOUMsMENBQTBCOztJQUVkLDJDQUFrQzs7Ozs7SUFDbEMsMkNBQW1DOzs7OztJQUNuQyx5Q0FBK0I7Ozs7O0lBQy9CLG9EQUE4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQXBwQ29uZmlnU2VydmljZSwgQXBwQ29uZmlnVmFsdWVzIH0gZnJvbSAnLi4vYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFuZ3VhZ2VJdGVtIH0gZnJvbSAnLi4vbGFuZ3VhZ2UtbWVudS9sYW5ndWFnZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuL3N0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi9hbGZyZXNjby1hcGkuc2VydmljZSc7XG5cbmV4cG9ydCBlbnVtIFVzZXJQcmVmZXJlbmNlVmFsdWVzIHtcbiAgICBQYWdpbmF0aW9uU2l6ZSA9ICdwYWdpbmF0aW9uU2l6ZScsXG4gICAgTG9jYWxlID0gJ2xvY2FsZScsXG4gICAgU3VwcG9ydGVkUGFnZVNpemVzID0gJ3N1cHBvcnRlZFBhZ2VTaXplcycsXG4gICAgRXhwYW5kZWRTaWRlTmF2U3RhdHVzID0gJ2V4cGFuZGVkU2lkZW5hdidcbn1cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlIHtcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBwYWdpbmF0aW9uU2l6ZTogMjUsXG4gICAgICAgIHN1cHBvcnRlZFBhZ2VTaXplczogWzUsIDEwLCAxNSwgMjBdLFxuICAgICAgICBsb2NhbGU6ICdlbicsXG4gICAgICAgIGV4cGFuZGVkU2lkZW5hdjogdHJ1ZVxuICAgIH07XG5cbiAgICBwcml2YXRlIHVzZXJQcmVmZXJlbmNlU3RhdHVzOiBhbnkgPSB0aGlzLmRlZmF1bHRzO1xuICAgIHByaXZhdGUgb25DaGFuZ2VTdWJqZWN0OiBCZWhhdmlvclN1YmplY3Q8YW55PjtcbiAgICBvbkNoYW5nZTogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGFwcENvbmZpZzogQXBwQ29uZmlnU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHN0b3JhZ2U6IFN0b3JhZ2VTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYWxmcmVzY29BcGlTZXJ2aWNlOiBBbGZyZXNjb0FwaVNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuYWxmcmVzY29BcGlJbml0aWFsaXplZC5zdWJzY3JpYmUodGhpcy5pbml0VXNlclByZWZlcmVuY2VTdGF0dXMuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMub25DaGFuZ2VTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0aGlzLnVzZXJQcmVmZXJlbmNlU3RhdHVzKTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2VTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdFVzZXJQcmVmZXJlbmNlU3RhdHVzKCkge1xuICAgICAgICB0aGlzLmluaXRVc2VyTGFuZ3VhZ2UoKTtcbiAgICAgICAgdGhpcy5zZXQoVXNlclByZWZlcmVuY2VWYWx1ZXMuUGFnaW5hdGlvblNpemUsIHRoaXMucGFnaW5hdGlvblNpemUpO1xuICAgICAgICB0aGlzLnNldChVc2VyUHJlZmVyZW5jZVZhbHVlcy5TdXBwb3J0ZWRQYWdlU2l6ZXMsIEpTT04uc3RyaW5naWZ5KHRoaXMuc3VwcG9ydGVkUGFnZVNpemVzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0VXNlckxhbmd1YWdlKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NhbGUgfHwgdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oVXNlclByZWZlcmVuY2VWYWx1ZXMuTG9jYWxlKSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYWxlID0gdGhpcy5sb2NhbGUgfHwgdGhpcy5nZXREZWZhdWx0TG9jYWxlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0KFVzZXJQcmVmZXJlbmNlVmFsdWVzLkxvY2FsZSwgbG9jYWxlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0KCd0ZXh0T3JpZW50YXRpb24nLCB0aGlzLmdldExhbmd1YWdlQnlLZXkobG9jYWxlKS5kaXJlY3Rpb24gfHwgJ2x0cicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbG9jYWxlID0gdGhpcy5sb2NhbGUgfHwgdGhpcy5nZXREZWZhdWx0TG9jYWxlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0V2l0aG91dFN0b3JlKFVzZXJQcmVmZXJlbmNlVmFsdWVzLkxvY2FsZSwgbG9jYWxlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0V2l0aG91dFN0b3JlKCd0ZXh0T3JpZW50YXRpb24nLCB0aGlzLmdldExhbmd1YWdlQnlLZXkobG9jYWxlKS5kaXJlY3Rpb24gfHwgJ2x0cicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBhIGNhbGxiYWNrIHRvIG5vdGlmeSB3aGVuIGEgcHJvcGVydHkgaGFzIGNoYW5nZWQuXG4gICAgICogQHBhcmFtIHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byB3YXRjaFxuICAgICAqIEByZXR1cm5zIE5vdGlmaWNhdGlvbiBjYWxsYmFja1xuICAgICAqL1xuICAgIHNlbGVjdChwcm9wZXJ0eTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2VcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgodXNlclByZWZlcmVuY2VTdGF0dXMpID0+IHVzZXJQcmVmZXJlbmNlU3RhdHVzW3Byb3BlcnR5XSksXG4gICAgICAgICAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgcHJlZmVyZW5jZSBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0gcHJvcGVydHkgTmFtZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0gZGVmYXVsdFZhbHVlIERlZmF1bHQgdG8gcmV0dXJuIGlmIHRoZSBwcm9wZXJ0eSBpcyBub3QgZm91bmRcbiAgICAgKiBAcmV0dXJucyBQcmVmZXJlbmNlIHByb3BlcnR5XG4gICAgICovXG4gICAgZ2V0KHByb3BlcnR5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0UHJvcGVydHlLZXkocHJvcGVydHkpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgcHJlZmVyZW5jZSBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0gcHJvcGVydHkgTmFtZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0gdmFsdWUgTmV3IHZhbHVlIGZvciB0aGUgcHJvcGVydHlcbiAgICAgKi9cbiAgICBzZXQocHJvcGVydHk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICBpZiAoIXByb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmdldFByb3BlcnR5S2V5KHByb3BlcnR5KSxcbiAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudXNlclByZWZlcmVuY2VTdGF0dXNbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25DaGFuZ2VTdWJqZWN0Lm5leHQodGhpcy51c2VyUHJlZmVyZW5jZVN0YXR1cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhIHByZWZlcmVuY2UgcHJvcGVydHkuXG4gICAgICogQHBhcmFtIHByb3BlcnR5IE5hbWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSBmb3IgdGhlIHByb3BlcnR5XG4gICAgICovXG4gICAgc2V0V2l0aG91dFN0b3JlKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXNlclByZWZlcmVuY2VTdGF0dXNbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25DaGFuZ2VTdWJqZWN0Lm5leHQodGhpcy51c2VyUHJlZmVyZW5jZVN0YXR1cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYW4gaXRlbSBpcyBwcmVzZW50IGluIHRoZSBzdG9yYWdlXG4gICAgICogQHBhcmFtIHByb3BlcnR5IE5hbWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgaXRlbSBpcyBwcmVzZW50LCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBoYXNJdGVtKHByb3BlcnR5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2UuaGFzSXRlbShcbiAgICAgICAgICAgIHRoaXMuZ2V0UHJvcGVydHlLZXkocHJvcGVydHkpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYWN0aXZlIHN0b3JhZ2UgcHJlZml4IGZvciBwcmVmZXJlbmNlcy5cbiAgICAgKiBAcmV0dXJucyBTdG9yYWdlIHByZWZpeFxuICAgICAqL1xuICAgIGdldFN0b3JhZ2VQcmVmaXgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5nZXRJdGVtKCdVU0VSX1BST0ZJTEUnKSB8fCAnR1VFU1QnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGFjdGl2ZSBzdG9yYWdlIHByZWZpeCBmb3IgcHJlZmVyZW5jZXMuXG4gICAgICogQHBhcmFtIHZhbHVlIE5hbWUgb2YgdGhlIHByZWZpeFxuICAgICAqL1xuICAgIHNldFN0b3JhZ2VQcmVmaXgodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSgnVVNFUl9QUk9GSUxFJywgdmFsdWUgfHwgJ0dVRVNUJyk7XG4gICAgICAgIHRoaXMuaW5pdFVzZXJQcmVmZXJlbmNlU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZnVsbCBwcm9wZXJ0eSBrZXkgd2l0aCBwcmVmaXguXG4gICAgICogQHBhcmFtIHByb3BlcnR5IFRoZSBwcm9wZXJ0eSBuYW1lXG4gICAgICogQHJldHVybnMgUHJvcGVydHkga2V5XG4gICAgICovXG4gICAgZ2V0UHJvcGVydHlLZXkocHJvcGVydHk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmdldFN0b3JhZ2VQcmVmaXgoKX1fXyR7cHJvcGVydHl9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGF2YWlsYWJsZSBwYWdlIHNpemVzLlxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIHBhZ2Ugc2l6ZSB2YWx1ZXNcbiAgICAgKi9cbiAgICBnZXQgc3VwcG9ydGVkUGFnZVNpemVzKCk6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3Qgc3VwcG9ydGVkUGFnZVNpemVzID0gdGhpcy5nZXQoVXNlclByZWZlcmVuY2VWYWx1ZXMuU3VwcG9ydGVkUGFnZVNpemVzKTtcblxuICAgICAgICBpZiAoc3VwcG9ydGVkUGFnZVNpemVzKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzdXBwb3J0ZWRQYWdlU2l6ZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwQ29uZmlnLmdldCgncGFnaW5hdGlvbi5zdXBwb3J0ZWRQYWdlU2l6ZXMnLCB0aGlzLmRlZmF1bHRzLnN1cHBvcnRlZFBhZ2VTaXplcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgc3VwcG9ydGVkUGFnZVNpemVzKHZhbHVlOiBudW1iZXJbXSkge1xuICAgICAgICB0aGlzLnNldChVc2VyUHJlZmVyZW5jZVZhbHVlcy5TdXBwb3J0ZWRQYWdlU2l6ZXMsIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgfVxuXG4gICAgLyoqIFBhZ2luYXRpb24gc2l6ZS4gKi9cbiAgICBzZXQgcGFnaW5hdGlvblNpemUodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNldChVc2VyUHJlZmVyZW5jZVZhbHVlcy5QYWdpbmF0aW9uU2l6ZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGdldCBwYWdpbmF0aW9uU2l6ZSgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBwYWdpbmF0aW9uU2l6ZSA9IHRoaXMuZ2V0KFVzZXJQcmVmZXJlbmNlVmFsdWVzLlBhZ2luYXRpb25TaXplKTtcblxuICAgICAgICBpZiAocGFnaW5hdGlvblNpemUpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIocGFnaW5hdGlvblNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmFwcENvbmZpZy5nZXQoJ3BhZ2luYXRpb24uc2l6ZScsIHRoaXMuZGVmYXVsdHMucGFnaW5hdGlvblNpemUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBDdXJyZW50IGxvY2FsZSBzZXR0aW5nLiAqL1xuICAgIGdldCBsb2NhbGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFVzZXJQcmVmZXJlbmNlVmFsdWVzLkxvY2FsZSk7XG4gICAgfVxuXG4gICAgc2V0IGxvY2FsZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0KFVzZXJQcmVmZXJlbmNlVmFsdWVzLkxvY2FsZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGRlZmF1bHQgbG9jYWxlLlxuICAgICAqIEByZXR1cm5zIERlZmF1bHQgbG9jYWxlIGxhbmd1YWdlIGNvZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RGVmYXVsdExvY2FsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oVXNlclByZWZlcmVuY2VWYWx1ZXMuTG9jYWxlKSB8fCB0aGlzLnRyYW5zbGF0ZS5nZXRCcm93c2VyQ3VsdHVyZUxhbmcoKSB8fCAnZW4nO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TGFuZ3VhZ2VCeUtleShrZXk6IHN0cmluZyk6IExhbmd1YWdlSXRlbSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmFwcENvbmZpZ1xuICAgICAgICAgICAgICAgIC5nZXQ8QXJyYXk8TGFuZ3VhZ2VJdGVtPj4oQXBwQ29uZmlnVmFsdWVzLkFQUF9DT05GSUdfTEFOR1VBR0VTX0tFWSwgWzxMYW5ndWFnZUl0ZW0+IHsga2V5OiAnZW4nIH1dKVxuICAgICAgICAgICAgICAgIC5maW5kKChsYW5ndWFnZSkgPT4ga2V5LmluY2x1ZGVzKGxhbmd1YWdlLmtleSkpIHx8IDxMYW5ndWFnZUl0ZW0+IHsga2V5OiAnZW4nIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG4iXX0=
