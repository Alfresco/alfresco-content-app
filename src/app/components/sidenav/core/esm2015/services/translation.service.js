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
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  UserPreferencesService,
  UserPreferenceValues
} from './user-preferences.service';
import * as i0 from '@angular/core';
import * as i1 from '@ngx-translate/core';
import * as i2 from './user-preferences.service';
/** @type {?} */
export const TRANSLATION_PROVIDER = new InjectionToken(
  'Injection token for translation providers.'
);
/**
 * @record
 */
export function TranslationProvider() {}
if (false) {
  /** @type {?} */
  TranslationProvider.prototype.name;
  /** @type {?} */
  TranslationProvider.prototype.source;
}
export class TranslationService {
  /**
   * @param {?} translate
   * @param {?} userPreferencesService
   * @param {?} providers
   */
  constructor(translate, userPreferencesService, providers) {
    this.translate = translate;
    this.customLoader = /** @type {?} */ (this.translate.currentLoader);
    this.defaultLang = 'en';
    translate.setDefaultLang(this.defaultLang);
    this.customLoader.setDefaultLang(this.defaultLang);
    if (providers && providers.length > 0) {
      for (const provider of providers) {
        this.addTranslationFolder(provider.name, provider.source);
      }
    }
    userPreferencesService.select(UserPreferenceValues.Locale).subscribe(
      /**
       * @param {?} locale
       * @return {?}
       */
      locale => {
        if (locale) {
          this.userLang = locale;
          this.use(this.userLang);
        }
      }
    );
  }
  /**
   * Adds a new folder of translation source files.
   * @param {?=} name Name for the translation provider
   * @param {?=} path Path to the folder
   * @return {?}
   */
  addTranslationFolder(name = '', path = '') {
    if (!this.customLoader.providerRegistered(name)) {
      this.customLoader.registerProvider(name, path);
      if (this.userLang) {
        this.loadTranslation(this.userLang, this.defaultLang);
      } else {
        this.loadTranslation(this.defaultLang);
      }
    }
  }
  /**
   * Loads a translation file.
   * @param {?} lang Language code for the language to load
   * @param {?=} fallback Language code to fall back to if the first one was unavailable
   * @return {?}
   */
  loadTranslation(lang, fallback) {
    this.translate.getTranslation(lang).subscribe(
      /**
       * @return {?}
       */
      () => {
        this.translate.use(lang);
        this.onTranslationChanged(lang);
      }
      /**
       * @return {?}
       */,
      () => {
        if (fallback && fallback !== lang) {
          this.loadTranslation(fallback);
        }
      }
    );
  }
  /**
   * Triggers a notification callback when the translation language changes.
   * @param {?} lang The new language code
   * @return {?}
   */
  onTranslationChanged(lang) {
    this.translate.onTranslationChange.next({
      lang: lang,
      translations: this.customLoader.getFullTranslationJSON(lang)
    });
  }
  /**
   * Sets the target language for translations.
   * @param {?} lang Code name for the language
   * @return {?} Translations available for the language
   */
  use(lang) {
    this.customLoader.init(lang);
    return this.translate.use(lang);
  }
  /**
   * Gets the translation for the supplied key.
   * @param {?} key Key to translate
   * @param {?=} interpolateParams String(s) to be interpolated into the main message
   * @return {?} Translated text
   */
  get(key, interpolateParams) {
    return this.translate.get(key, interpolateParams);
  }
  /**
   * Directly returns the translation for the supplied key.
   * @param {?} key Key to translate
   * @param {?=} interpolateParams String(s) to be interpolated into the main message
   * @return {?} Translated text
   */
  instant(key, interpolateParams) {
    return key ? this.translate.instant(key, interpolateParams) : '';
  }
}
TranslationService.decorators = [
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
TranslationService.ctorParameters = () => [
  { type: TranslateService },
  { type: UserPreferencesService },
  {
    type: Array,
    decorators: [
      { type: Optional },
      { type: Inject, args: [TRANSLATION_PROVIDER] }
    ]
  }
];
/** @nocollapse */ TranslationService.ngInjectableDef = i0.defineInjectable({
  factory: function TranslationService_Factory() {
    return new TranslationService(
      i0.inject(i1.TranslateService),
      i0.inject(i2.UserPreferencesService),
      i0.inject(TRANSLATION_PROVIDER, 8)
    );
  },
  token: TranslationService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  TranslationService.prototype.defaultLang;
  /** @type {?} */
  TranslationService.prototype.userLang;
  /** @type {?} */
  TranslationService.prototype.customLoader;
  /** @type {?} */
  TranslationService.prototype.translate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL3RyYW5zbGF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUd2RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7Ozs7QUFFMUYsTUFBTSxPQUFPLG9CQUFvQixHQUFHLElBQUksY0FBYyxDQUFDLDRDQUE0QyxDQUFDOzs7O0FBRXBHLHlDQUdDOzs7SUFGRyxtQ0FBYTs7SUFDYixxQ0FBZTs7QUFNbkIsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7O0lBSzNCLFlBQW1CLFNBQTJCLEVBQ2xDLHNCQUE4QyxFQUNKLFNBQWdDO1FBRm5FLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBRzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsbUJBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFBLENBQUM7UUFFMUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5ELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25DLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO2dCQUM5QixJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFR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byBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgVHJhbnNsYXRlTG9hZGVyU2VydmljZSB9IGZyb20gJy4vdHJhbnNsYXRlLWxvYWRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsIFVzZXJQcmVmZXJlbmNlVmFsdWVzIH0gZnJvbSAnLi91c2VyLXByZWZlcmVuY2VzLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgVFJBTlNMQVRJT05fUFJPVklERVIgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ0luamVjdGlvbiB0b2tlbiBmb3IgdHJhbnNsYXRpb24gcHJvdmlkZXJzLicpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0aW9uUHJvdmlkZXIge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBzb3VyY2U6IHN0cmluZztcbn1cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvblNlcnZpY2Uge1xuICAgIGRlZmF1bHRMYW5nOiBzdHJpbmc7XG4gICAgdXNlckxhbmc6IHN0cmluZztcbiAgICBjdXN0b21Mb2FkZXI6IFRyYW5zbGF0ZUxvYWRlclNlcnZpY2U7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlc1NlcnZpY2U6IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChUUkFOU0xBVElPTl9QUk9WSURFUikgcHJvdmlkZXJzOiBUcmFuc2xhdGlvblByb3ZpZGVyW10pIHtcbiAgICAgICAgdGhpcy5jdXN0b21Mb2FkZXIgPSA8VHJhbnNsYXRlTG9hZGVyU2VydmljZT4gdGhpcy50cmFuc2xhdGUuY3VycmVudExvYWRlcjtcblxuICAgICAgICB0aGlzLmRlZmF1bHRMYW5nID0gJ2VuJztcbiAgICAgICAgdHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKHRoaXMuZGVmYXVsdExhbmcpO1xuICAgICAgICB0aGlzLmN1c3RvbUxvYWRlci5zZXREZWZhdWx0TGFuZyh0aGlzLmRlZmF1bHRMYW5nKTtcblxuICAgICAgICBpZiAocHJvdmlkZXJzICYmIHByb3ZpZGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHByb3ZpZGVyIG9mIHByb3ZpZGVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVHJhbnNsYXRpb25Gb2xkZXIocHJvdmlkZXIubmFtZSwgcHJvdmlkZXIuc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVzZXJQcmVmZXJlbmNlc1NlcnZpY2Uuc2VsZWN0KFVzZXJQcmVmZXJlbmNlVmFsdWVzLkxvY2FsZSkuc3Vic2NyaWJlKChsb2NhbGUpID0+IHtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJMYW5nID0gbG9jYWxlO1xuICAgICAgICAgICAgICAgIHRoaXMudXNlKHRoaXMudXNlckxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbmV3IGZvbGRlciBvZiB0cmFuc2xhdGlvbiBzb3VyY2UgZmlsZXMuXG4gICAgICogQHBhcmFtIG5hbWUgTmFtZSBmb3IgdGhlIHRyYW5zbGF0aW9uIHByb3ZpZGVyXG4gICAgICogQHBhcmFtIHBhdGggUGF0aCB0byB0aGUgZm9sZGVyXG4gICAgICovXG4gICAgYWRkVHJhbnNsYXRpb25Gb2xkZXIobmFtZTogc3RyaW5nID0gJycsIHBhdGg6IHN0cmluZyA9ICcnKSB7XG4gICAgICAgIGlmICghdGhpcy5jdXN0b21Mb2FkZXIucHJvdmlkZXJSZWdpc3RlcmVkKG5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmN1c3RvbUxvYWRlci5yZWdpc3RlclByb3ZpZGVyKG5hbWUsIHBhdGgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy51c2VyTGFuZykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZFRyYW5zbGF0aW9uKHRoaXMudXNlckxhbmcsIHRoaXMuZGVmYXVsdExhbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRUcmFuc2xhdGlvbih0aGlzLmRlZmF1bHRMYW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWRzIGEgdHJhbnNsYXRpb24gZmlsZS5cbiAgICAgKiBAcGFyYW0gbGFuZyBMYW5ndWFnZSBjb2RlIGZvciB0aGUgbGFuZ3VhZ2UgdG8gbG9hZFxuICAgICAqIEBwYXJhbSBmYWxsYmFjayBMYW5ndWFnZSBjb2RlIHRvIGZhbGwgYmFjayB0byBpZiB0aGUgZmlyc3Qgb25lIHdhcyB1bmF2YWlsYWJsZVxuICAgICAqL1xuICAgIGxvYWRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcsIGZhbGxiYWNrPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlLmdldFRyYW5zbGF0aW9uKGxhbmcpLnN1YnNjcmliZShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0ZS51c2UobGFuZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblRyYW5zbGF0aW9uQ2hhbmdlZChsYW5nKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZhbGxiYWNrICYmIGZhbGxiYWNrICE9PSBsYW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRyYW5zbGF0aW9uKGZhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlcnMgYSBub3RpZmljYXRpb24gY2FsbGJhY2sgd2hlbiB0aGUgdHJhbnNsYXRpb24gbGFuZ3VhZ2UgY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0gbGFuZyBUaGUgbmV3IGxhbmd1YWdlIGNvZGVcbiAgICAgKi9cbiAgICBvblRyYW5zbGF0aW9uQ2hhbmdlZChsYW5nOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGUub25UcmFuc2xhdGlvbkNoYW5nZS5uZXh0KHtcbiAgICAgICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgICAgICB0cmFuc2xhdGlvbnM6IHRoaXMuY3VzdG9tTG9hZGVyLmdldEZ1bGxUcmFuc2xhdGlvbkpTT04obGFuZylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdGFyZ2V0IGxhbmd1YWdlIGZvciB0cmFuc2xhdGlvbnMuXG4gICAgICogQHBhcmFtIGxhbmcgQ29kZSBuYW1lIGZvciB0aGUgbGFuZ3VhZ2VcbiAgICAgKiBAcmV0dXJucyBUcmFuc2xhdGlvbnMgYXZhaWxhYmxlIGZvciB0aGUgbGFuZ3VhZ2VcbiAgICAgKi9cbiAgICB1c2UobGFuZzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgdGhpcy5jdXN0b21Mb2FkZXIuaW5pdChsYW5nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlLnVzZShsYW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0cmFuc2xhdGlvbiBmb3IgdGhlIHN1cHBsaWVkIGtleS5cbiAgICAgKiBAcGFyYW0ga2V5IEtleSB0byB0cmFuc2xhdGVcbiAgICAgKiBAcGFyYW0gaW50ZXJwb2xhdGVQYXJhbXMgU3RyaW5nKHMpIHRvIGJlIGludGVycG9sYXRlZCBpbnRvIHRoZSBtYWluIG1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyBUcmFuc2xhdGVkIHRleHRcbiAgICAgKi9cbiAgICBnZXQoa2V5OiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+LCBpbnRlcnBvbGF0ZVBhcmFtcz86IE9iamVjdCk6IE9ic2VydmFibGU8c3RyaW5nIHwgYW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZS5nZXQoa2V5LCBpbnRlcnBvbGF0ZVBhcmFtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlyZWN0bHkgcmV0dXJucyB0aGUgdHJhbnNsYXRpb24gZm9yIHRoZSBzdXBwbGllZCBrZXkuXG4gICAgICogQHBhcmFtIGtleSBLZXkgdG8gdHJhbnNsYXRlXG4gICAgICogQHBhcmFtIGludGVycG9sYXRlUGFyYW1zIFN0cmluZyhzKSB0byBiZSBpbnRlcnBvbGF0ZWQgaW50byB0aGUgbWFpbiBtZXNzYWdlXG4gICAgICogQHJldHVybnMgVHJhbnNsYXRlZCB0ZXh0XG4gICAgICovXG4gICAgaW5zdGFudChrZXk6IHN0cmluZyB8IEFycmF5PHN0cmluZz4sIGludGVycG9sYXRlUGFyYW1zPzogT2JqZWN0KTogc3RyaW5nIHwgYW55IHtcbiAgICAgICAgcmV0dXJuIGtleSA/IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoa2V5LCBpbnRlcnBvbGF0ZVBhcmFtcykgOiAnJztcbiAgICB9XG59XG4iXX0=
