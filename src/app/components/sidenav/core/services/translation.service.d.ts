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
import { InjectionToken } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TranslateLoaderService } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';
export declare const TRANSLATION_PROVIDER: InjectionToken<{}>;
export interface TranslationProvider {
  name: string;
  source: string;
}
export declare class TranslationService {
  translate: TranslateService;
  defaultLang: string;
  userLang: string;
  customLoader: TranslateLoaderService;
  constructor(
    translate: TranslateService,
    userPreferencesService: UserPreferencesService,
    providers: TranslationProvider[]
  );
  /**
   * Adds a new folder of translation source files.
   * @param name Name for the translation provider
   * @param path Path to the folder
   */
  addTranslationFolder(name?: string, path?: string): void;
  /**
   * Loads a translation file.
   * @param lang Language code for the language to load
   * @param fallback Language code to fall back to if the first one was unavailable
   */
  loadTranslation(lang: string, fallback?: string): void;
  /**
   * Triggers a notification callback when the translation language changes.
   * @param lang The new language code
   */
  onTranslationChanged(lang: string): void;
  /**
   * Sets the target language for translations.
   * @param lang Code name for the language
   * @returns Translations available for the language
   */
  use(lang: string): Observable<any>;
  /**
   * Gets the translation for the supplied key.
   * @param key Key to translate
   * @param interpolateParams String(s) to be interpolated into the main message
   * @returns Translated text
   */
  get(
    key: string | Array<string>,
    interpolateParams?: Object
  ): Observable<string | any>;
  /**
   * Directly returns the translation for the supplied key.
   * @param key Key to translate
   * @param interpolateParams String(s) to be interpolated into the main message
   * @returns Translated text
   */
  instant(
    key: string | Array<string>,
    interpolateParams?: Object
  ): string | any;
}
