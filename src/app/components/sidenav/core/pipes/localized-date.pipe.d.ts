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
import { PipeTransform, OnDestroy } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferencesService } from '../services/user-preferences.service';
export declare class LocalizedDatePipe implements PipeTransform, OnDestroy {
  userPreferenceService?: UserPreferencesService;
  appConfig?: AppConfigService;
  static DEFAULT_LOCALE: string;
  static DEFAULT_DATE_FORMAT: string;
  defaultLocale: string;
  defaultFormat: string;
  private onDestroy$;
  constructor(
    userPreferenceService?: UserPreferencesService,
    appConfig?: AppConfigService
  );
  transform(value: any, format?: string, locale?: string): any;
  ngOnDestroy(): void;
}
