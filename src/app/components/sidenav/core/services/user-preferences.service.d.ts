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
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import { StorageService } from './storage.service';
import { AlfrescoApiService } from './alfresco-api.service';
export declare enum UserPreferenceValues {
  PaginationSize = 'paginationSize',
  Locale = 'locale',
  SupportedPageSizes = 'supportedPageSizes',
  ExpandedSideNavStatus = 'expandedSidenav'
}
export declare class UserPreferencesService {
  translate: TranslateService;
  private appConfig;
  private storage;
  private alfrescoApiService;
  defaults: {
    paginationSize: number;
    supportedPageSizes: number[];
    locale: string;
    expandedSidenav: boolean;
  };
  private userPreferenceStatus;
  private onChangeSubject;
  onChange: Observable<any>;
  constructor(
    translate: TranslateService,
    appConfig: AppConfigService,
    storage: StorageService,
    alfrescoApiService: AlfrescoApiService
  );
  private initUserPreferenceStatus;
  private initUserLanguage;
  /**
   * Sets up a callback to notify when a property has changed.
   * @param property The property to watch
   * @returns Notification callback
   */
  select(property: string): Observable<any>;
  /**
   * Gets a preference property.
   * @param property Name of the property
   * @param defaultValue Default to return if the property is not found
   * @returns Preference property
   */
  get(property: string, defaultValue?: string): string;
  /**
   * Sets a preference property.
   * @param property Name of the property
   * @param value New value for the property
   */
  set(property: string, value: any): void;
  /**
   * Sets a preference property.
   * @param property Name of the property
   * @param value New value for the property
   */
  setWithoutStore(property: string, value: any): void;
  /**
   * Check if an item is present in the storage
   * @param property Name of the property
   * @returns True if the item is present, false otherwise
   */
  hasItem(property: string): boolean;
  /**
   * Gets the active storage prefix for preferences.
   * @returns Storage prefix
   */
  getStoragePrefix(): string;
  /**
   * Sets the active storage prefix for preferences.
   * @param value Name of the prefix
   */
  setStoragePrefix(value: string): void;
  /**
   * Gets the full property key with prefix.
   * @param property The property name
   * @returns Property key
   */
  getPropertyKey(property: string): string;
  /**
   * Gets an array containing the available page sizes.
   * @returns Array of page size values
   */
  supportedPageSizes: number[];
  /** Pagination size. */
  paginationSize: number;
  /** Current locale setting. */
  locale: string;
  /**
   * Gets the default locale.
   * @returns Default locale language code
   */
  getDefaultLocale(): string;
  private getLanguageByKey;
}
